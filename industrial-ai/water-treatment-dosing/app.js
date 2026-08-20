(() => {
  'use strict';

  const canvas = document.getElementById('dosing-chart');
  if (!canvas) return;

  const ids = ['raw-turbidity', 'plant-flow', 'water-ph', 'temperature', 'target-turbidity'];
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

    document.getElementById('dose-value').textContent = `${result.dose.toFixed(1)} mg/L`;
    document.getElementById('chemical-value').textContent = `${result.chemicalKgHour.toFixed(1)} kg/h`;
    document.getElementById('confidence-value').textContent = `${result.confidence}%`;
    document.getElementById('base-factor').textContent = `${result.baseDose.toFixed(1)} mg/L`;
    document.getElementById('ph-factor').textContent = signedDose(result.baseDose * (result.phFactor - 1));
    document.getElementById('temperature-factor').textContent = signedDose(result.baseDose * result.phFactor * (result.temperatureFactor - 1));
    document.getElementById('target-factor').textContent = signedDose(result.baseDose * result.phFactor * result.temperatureFactor * (result.targetFactor - 1));

    const action = document.getElementById('action-value');
    const status = document.getElementById('status-line');
    if (input.ph < 6 || input.ph > 8.5) {
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

  function render() {
    const input = readInput();
    const result = predict(input);
    updateText(input, result);
    drawChart(input, result);
  }

  ids.forEach((id) => controls[id].addEventListener('input', render));
  if (window.ResizeObserver) new ResizeObserver(render).observe(canvas);
  window.addEventListener('resize', render);
  render();
})();
