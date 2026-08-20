(() => {
  'use strict';

  const canvas = document.getElementById('dosing-chart');
  const processCanvas = document.getElementById('process-canvas');
  if (!canvas || !processCanvas) return;

  const ids = ['raw-turbidity', 'plant-flow', 'water-ph', 'temperature', 'target-turbidity', 'robot-dose-ratio'];
  const controls = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
  const outputs = Object.fromEntries(ids.map((id) => [id, document.getElementById(`${id}-output`)]));
  const colors = {
    ink: '#172521', muted: '#62736d', line: '#d6e1dc',
    teal: '#2aa79b', amber: '#e3a34b', coral: '#d56c59', blue: '#5f9ad6',
  };

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

  function predict(input) {
    const baseDose = 5.5 + 2.25 * Math.sqrt(input.turbidity);
    const phFactor = 1 + Math.min(0.28, Math.abs(input.ph - 7.2) * 0.09);
    const temperatureFactor = 1
      + Math.max(0, 15 - input.temperature) * 0.016
      - Math.max(0, input.temperature - 24) * 0.004;
    const targetFactor = 1 + clamp((1 - input.target) * 0.13, -0.08, 0.12);
    const dose = clamp(baseDose * phFactor * temperatureFactor * targetFactor, 3, 70);
    const uncertainty = clamp(
      0.08
        + Math.abs(input.ph - 7.2) * 0.018
        + Math.max(0, 8 - input.temperature) * 0.008
        + Math.max(0, input.turbidity - 120) * 0.0007,
      0.08,
      0.24,
    );
    return {
      baseDose,
      phFactor,
      temperatureFactor,
      targetFactor,
      dose,
      low: dose * (1 - uncertainty),
      high: dose * (1 + uncertainty),
      chemicalKgHour: dose * input.flow / 1000,
      confidence: Math.round(clamp(96 - uncertainty * 100, 62, 93)),
    };
  }

  function readInput() {
    return {
      turbidity: Number(controls['raw-turbidity'].value),
      flow: Number(controls['plant-flow'].value),
      ph: Number(controls['water-ph'].value),
      temperature: Number(controls.temperature.value),
      target: Number(controls['target-turbidity'].value),
      robotRatio: Number(controls['robot-dose-ratio'].value) / 100,
    };
  }

  function processOutcome(input, result) {
    const underDose = Math.max(0, 0.9 - input.robotRatio);
    const overDose = Math.max(0, input.robotRatio - 1.15);
    const outletTurbidity = input.target * (1 + underDose * 5.2 + overDose * 2.2);
    const reactionQuality = clamp(1 - underDose * 2.1 - overDose * 1.5, 0.25, 1);
    const state = input.robotRatio < 0.85
      ? '投加不足 · 絮体偏小'
      : input.robotRatio > 1.2
        ? '投加偏高 · 余药风险'
        : '稳定絮凝 · 持续沉降';
    return {
      appliedDose: result.dose * input.robotRatio,
      chemicalKgHour: result.chemicalKgHour * input.robotRatio,
      outletTurbidity,
      reactionQuality,
      state,
    };
  }

  function signedDose(value) {
    if (Math.abs(value) < 0.05) return '±0.0 mg/L';
    return `${value > 0 ? '+' : ''}${value.toFixed(1)} mg/L`;
  }

  function updateText(input, result) {
    outputs['raw-turbidity'].value = `${input.turbidity} NTU`;
    outputs['plant-flow'].value = `${input.flow} m³/h`;
    outputs['water-ph'].value = input.ph.toFixed(1);
    outputs.temperature.value = `${input.temperature}°C`;
    outputs['target-turbidity'].value = `${input.target.toFixed(1)} NTU`;
    outputs['robot-dose-ratio'].value = `${Math.round(input.robotRatio * 100)}%`;

    const outcome = processOutcome(input, result);

    document.getElementById('dose-value').textContent = `${result.dose.toFixed(1)} mg/L`;
    document.getElementById('chemical-value').textContent = `${outcome.chemicalKgHour.toFixed(1)} kg/h`;
    document.getElementById('confidence-value').textContent = `${result.confidence}%`;
    document.getElementById('robot-dose-value').textContent = `${outcome.appliedDose.toFixed(1)} mg/L`;
    document.getElementById('water-state-value').textContent = outcome.state;
    document.getElementById('outlet-value').textContent = `${outcome.outletTurbidity.toFixed(2)} NTU`;
    document.getElementById('base-factor').textContent = `${result.baseDose.toFixed(1)} mg/L`;
    document.getElementById('ph-factor').textContent = signedDose(result.baseDose * (result.phFactor - 1));
    document.getElementById('temperature-factor').textContent = signedDose(result.baseDose * result.phFactor * (result.temperatureFactor - 1));
    document.getElementById('target-factor').textContent = signedDose(result.baseDose * result.phFactor * result.temperatureFactor * (result.targetFactor - 1));

    const action = document.getElementById('action-value');
    const status = document.getElementById('status-line');
    if (input.robotRatio < 0.85 || input.robotRatio > 1.2) {
      action.textContent = '先修正机器人执行比例';
      status.style.borderLeftColor = colors.coral;
      status.style.background = '#fff0ed';
    } else if (input.ph < 6 || input.ph > 8.5) {
      action.textContent = '先复核 pH 与碱度';
      status.style.borderLeftColor = colors.coral;
      status.style.background = '#fff0ed';
    } else if (result.dose > 45 || result.confidence < 75) {
      action.textContent = '烧杯试验并人工确认';
      status.style.borderLeftColor = colors.amber;
      status.style.background = '#fff7e9';
    } else {
      action.textContent = '烧杯试验确认后下发';
      status.style.borderLeftColor = colors.teal;
      status.style.background = '#eaf7f4';
    }
    return outcome;
  }

  const suspendedParticles = Array.from({ length: 82 }, (_, index) => ({
    x: ((index * 37) % 83) / 83,
    y: ((index * 53) % 79) / 79,
    speed: 0.006 + (index % 7) * 0.0012,
    radius: 1 + (index % 4) * 0.55,
    phase: index * 0.73,
  }));
  const flocParticles = Array.from({ length: 30 }, (_, index) => ({
    x: 0.16 + ((index * 29) % 67) / 67 * 0.76,
    y: ((index * 41) % 71) / 71,
    radius: 1.8 + (index % 5) * 0.55,
    phase: index * 1.17,
  }));

  function drawProcess(time, input, result, outcome) {
    if (!input || !result || !outcome) return;
    const rect = processCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    if (processCanvas.width !== width * ratio || processCanvas.height !== height * ratio) {
      processCanvas.width = width * ratio;
      processCanvas.height = height * ratio;
    }
    const ctx = processCanvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fbfa';
    ctx.fillRect(0, 0, width, height);

    const seconds = time / 1000;
    const tank = {
      x: width * 0.08,
      y: height * 0.42,
      width: width * 0.84,
      height: height * 0.49,
    };
    const waterTop = tank.y + tank.height * 0.16;
    const waterBottom = tank.y + tank.height - 4;
    const waterHeight = waterBottom - waterTop;
    const rawLoad = clamp(input.turbidity / 180, 0.06, 1);

    ctx.strokeStyle = '#e2ebe7';
    ctx.lineWidth = 1;
    for (let x = 24; x < width; x += 42) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 24; y < height; y += 42) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Inlet and outlet pipes establish the left-to-right treatment flow.
    ctx.strokeStyle = '#71847e';
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, waterTop + 24); ctx.lineTo(tank.x + 8, waterTop + 24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tank.x + tank.width - 8, waterTop + 18); ctx.lineTo(width, waterTop + 18); ctx.stroke();
    ctx.strokeStyle = colors.blue;
    ctx.lineWidth = 3;
    const flowOffset = (seconds * 35) % 28;
    for (let x = -20 + flowOffset; x < tank.x; x += 28) {
      ctx.beginPath(); ctx.moveTo(x, waterTop + 24); ctx.lineTo(x + 10, waterTop + 24); ctx.stroke();
    }
    for (let x = tank.x + tank.width + flowOffset; x < width + 15; x += 28) {
      ctx.beginPath(); ctx.moveTo(x, waterTop + 18); ctx.lineTo(x + 10, waterTop + 18); ctx.stroke();
    }

    ctx.fillStyle = '#dbe7e2';
    ctx.fillRect(tank.x, tank.y, tank.width, tank.height);
    ctx.fillStyle = '#79bec3';
    ctx.globalAlpha = 0.52 + outcome.reactionQuality * 0.16;
    ctx.fillRect(tank.x + 4, waterTop, tank.width - 8, waterHeight);
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(164, 125, 64, ${0.08 + rawLoad * 0.23 * (1.15 - outcome.reactionQuality)})`;
    ctx.fillRect(tank.x + 4, waterTop, tank.width - 8, waterHeight);

    ctx.save();
    ctx.beginPath();
    ctx.rect(tank.x + 4, waterTop, tank.width - 8, waterHeight);
    ctx.clip();
    suspendedParticles.forEach((particle, index) => {
      const xProgress = (particle.x + seconds * particle.speed) % 1;
      const x = tank.x + 8 + xProgress * (tank.width - 16);
      const y = waterTop + 5 + clamp(
        particle.y + Math.sin(seconds * 1.1 + particle.phase) * 0.025,
        0,
        1,
      ) * (waterHeight - 10);
      const treatment = outcome.reactionQuality * xProgress * 0.78;
      const alpha = clamp(0.12 + rawLoad * 0.58 - treatment * 0.48, 0.05, 0.72);
      ctx.fillStyle = `rgba(91, 73, 48, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, particle.radius + rawLoad * 0.8, 0, Math.PI * 2);
      ctx.fill();
      if (index % 11 === 0 && outcome.reactionQuality > 0.55) {
        ctx.fillStyle = `rgba(229, 188, 103, ${0.2 + outcome.reactionQuality * 0.25})`;
        ctx.beginPath(); ctx.arc(x + 3, y + 1, particle.radius + 1.2, 0, Math.PI * 2); ctx.fill();
      }
    });

    flocParticles.forEach((floc) => {
      const fall = (floc.y + seconds * (0.025 + outcome.reactionQuality * 0.024)) % 1;
      const sway = Math.sin(seconds * 0.9 + floc.phase) * 5;
      const x = tank.x + floc.x * tank.width + sway;
      const y = waterTop + fall * waterHeight;
      const radius = floc.radius * (0.55 + outcome.reactionQuality * 0.75);
      ctx.fillStyle = `rgba(120, 91, 48, ${0.18 + outcome.reactionQuality * 0.44})`;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + radius * 0.8, y + 1, radius * 0.62, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = `rgba(104, 80, 52, ${0.12 + outcome.reactionQuality * 0.18})`;
    ctx.fillRect(tank.x + 4, waterBottom - 8, tank.width - 8, 8);
    ctx.restore();

    // Rapid-mix shaft and rotating impeller.
    const mixerX = tank.x + tank.width * 0.34;
    const mixerY = waterTop + waterHeight * 0.54;
    ctx.strokeStyle = '#536760';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(mixerX, tank.y - 8); ctx.lineTo(mixerX, mixerY); ctx.stroke();
    ctx.save();
    ctx.translate(mixerX, mixerY);
    ctx.rotate(seconds * 2.8);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = colors.teal;
    ctx.beginPath(); ctx.arc(mixerX, mixerY, 5, 0, Math.PI * 2); ctx.fill();

    // Robot base, articulated arm, chemical reservoir, and dosing nozzle.
    const baseX = tank.x + tank.width * 0.82;
    const baseY = tank.y - 5;
    const shoulderX = baseX;
    const shoulderY = tank.y - 46;
    const elbowX = tank.x + tank.width * 0.68 + Math.sin(seconds * 1.2) * 2;
    const elbowY = tank.y - 72;
    const nozzleX = tank.x + tank.width * 0.53;
    const nozzleY = tank.y - 16;
    ctx.fillStyle = '#536760';
    ctx.fillRect(baseX - 19, baseY - 9, 38, 14);
    ctx.fillStyle = colors.blue;
    ctx.fillRect(baseX - 12, shoulderY, 24, baseY - shoulderY - 7);
    ctx.strokeStyle = '#536760';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(shoulderX, shoulderY); ctx.lineTo(elbowX, elbowY); ctx.lineTo(nozzleX, nozzleY); ctx.stroke();
    ctx.fillStyle = colors.blue;
    [[shoulderX, shoulderY], [elbowX, elbowY]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#dce8e4'; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.blue;
    });
    ctx.fillStyle = colors.amber;
    ctx.fillRect(baseX + 18, shoulderY - 13, 25, 35);
    ctx.strokeStyle = colors.amber;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(baseX + 18, shoulderY + 4); ctx.lineTo(nozzleX, nozzleY - 2); ctx.stroke();
    ctx.fillStyle = '#536760';
    ctx.beginPath(); ctx.moveTo(nozzleX - 6, nozzleY - 3); ctx.lineTo(nozzleX + 6, nozzleY - 3); ctx.lineTo(nozzleX + 2, nozzleY + 8); ctx.lineTo(nozzleX - 2, nozzleY + 8); ctx.closePath(); ctx.fill();
    ctx.lineCap = 'butt';

    const dropSpeed = 0.55 + outcome.appliedDose / 45;
    for (let index = 0; index < 5; index += 1) {
      const progress = (seconds * dropSpeed + index / 5) % 1;
      const y = nozzleY + 9 + progress * (waterTop - nozzleY - 9);
      ctx.fillStyle = `rgba(227, 163, 75, ${0.45 + progress * 0.45})`;
      ctx.beginPath(); ctx.arc(nozzleX, y, 2.2 + progress, 0, Math.PI * 2); ctx.fill();
    }

    ctx.strokeStyle = '#60746e';
    ctx.lineWidth = 2;
    ctx.strokeRect(tank.x, tank.y, tank.width, tank.height);
    ctx.fillStyle = colors.ink;
    ctx.font = '600 10px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.textAlign = 'left'; ctx.fillText('原水进入', 9, waterTop + 11);
    ctx.textAlign = 'center'; ctx.fillText('快速混合', mixerX, tank.y + 15);
    ctx.fillText('絮凝与沉降', tank.x + tank.width * 0.63, waterBottom - 14);
    ctx.textAlign = 'right'; ctx.fillText('出水', width - 9, waterTop + 6);
    ctx.fillStyle = colors.muted;
    ctx.font = '500 10px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'left'; ctx.fillText('DOSING ROBOT', 12, 18);
    ctx.textAlign = 'right'; ctx.fillText(`${outcome.appliedDose.toFixed(1)} mg/L`, width - 12, 18);
  }

  function drawChart(input, current) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const samples = Array.from({ length: 61 }, (_, index) => {
      const turbidity = 1 + index * 179 / 60;
      return { turbidity, ...predict({ ...input, turbidity }) };
    });
    const yMax = Math.max(40, Math.ceil(Math.max(...samples.map((item) => item.high)) / 10) * 10);
    const pad = { left: 53, right: 18, top: 20, bottom: 38 };
    const chartWidth = Math.max(1, width - pad.left - pad.right);
    const chartHeight = Math.max(1, height - pad.top - pad.bottom);
    const x = (value) => pad.left + (value - 1) / 179 * chartWidth;
    const y = (value) => pad.top + (yMax - value) / yMax * chartHeight;

    ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.fillStyle = colors.muted;
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    for (let tick = 0; tick <= 4; tick += 1) {
      const value = yMax * tick / 4;
      const yy = y(value);
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(value.toFixed(0), pad.left - 9, yy + 4);
    }
    for (let tick = 0; tick <= 3; tick += 1) {
      const value = 1 + 179 * tick / 3;
      ctx.textAlign = tick === 0 ? 'left' : tick === 3 ? 'right' : 'center';
      ctx.fillText(Math.round(value), x(value), height - 17);
    }

    ctx.beginPath();
    samples.forEach((item, index) => index ? ctx.lineTo(x(item.turbidity), y(item.high)) : ctx.moveTo(x(item.turbidity), y(item.high)));
    for (let index = samples.length - 1; index >= 0; index -= 1) {
      ctx.lineTo(x(samples[index].turbidity), y(samples[index].low));
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(227, 163, 75, .18)';
    ctx.fill();

    ctx.strokeStyle = colors.teal;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    samples.forEach((item, index) => index ? ctx.lineTo(x(item.turbidity), y(item.dose)) : ctx.moveTo(x(item.turbidity), y(item.dose)));
    ctx.stroke();

    const pointX = x(input.turbidity);
    const pointY = y(current.dose);
    ctx.strokeStyle = colors.coral;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(pointX, pad.top); ctx.lineTo(pointX, pad.top + chartHeight); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.coral;
    ctx.beginPath(); ctx.arc(pointX, pointY, 5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = colors.ink;
    ctx.font = '600 11px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.textAlign = pointX > width - 115 ? 'right' : 'left';
    ctx.fillText(`${current.dose.toFixed(1)} mg/L`, pointX + (pointX > width - 115 ? -8 : 8), Math.max(pad.top + 13, pointY - 9));
    ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.fillStyle = colors.muted;
    ctx.textAlign = 'right'; ctx.fillText('原水浊度（NTU）', width - pad.right, height - 4);
    ctx.save(); ctx.translate(13, 90); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText('推荐剂量（mg/L）', 0, 0); ctx.restore();
  }

  let latestInput;
  let latestResult;
  let latestOutcome;

  function render() {
    const input = readInput();
    const result = predict(input);
    const outcome = updateText(input, result);
    latestInput = input;
    latestResult = result;
    latestOutcome = outcome;
    drawChart(input, result);
    drawProcess(performance.now(), input, result, outcome);
  }

  function animate(time) {
    drawProcess(time, latestInput, latestResult, latestOutcome);
    requestAnimationFrame(animate);
  }

  ids.forEach((id) => controls[id].addEventListener('input', render));
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(render);
    observer.observe(canvas);
    observer.observe(processCanvas);
  }
  window.addEventListener('resize', render);
  render();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(animate);
  }
})();
