(() => {
  'use strict';

  const canvas = document.getElementById('anomaly-chart');
  const windowInput = document.getElementById('window');
  const thresholdInput = document.getElementById('threshold');
  const intensityInput = document.getElementById('intensity');
  const outputs = {
    window: document.getElementById('window-output'),
    threshold: document.getElementById('threshold-output'),
    intensity: document.getElementById('intensity-output')
  };
  const colors = {
    ink: '#172521', muted: '#62736d', line: '#d6e1dc', teal: '#2aa79b',
    amber: '#e3a34b', coral: '#d56c59', blue: '#5f9ad6', band: 'rgba(95,154,214,.10)'
  };

  function randomSeries(intensity) {
    // A seeded generator keeps the lesson stable while controls only change detection.
    let seed = 9173;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const vibration = [];
    const temperature = [];
    for (let index = 0; index < 72; index += 1) {
      const vibrationBase = 1.6 + Math.sin(index * .34) * .13 + Math.sin(index * .08) * .16;
      const temperatureBase = 65 + Math.sin(index * .12) * 2.4 + index * .035;
      const noiseVibration = (random() - .5) * .20;
      const noiseTemperature = (random() - .5) * 1.6;
      const shock = [18, 19, 20, 47, 48, 62].includes(index) ? (0.95 + random() * .25) * intensity : 0;
      const heat = [35, 36, 37, 60, 61].includes(index) ? (4.8 + random() * 1.4) * intensity : 0;
      vibration.push(vibrationBase + noiseVibration + shock);
      temperature.push(temperatureBase + noiseTemperature + heat);
    }
    return { vibration, temperature };
  }

  function zScores(values, size) {
    return values.map((value, index) => {
      const start = Math.max(0, index - size + 1);
      const sample = values.slice(start, index + 1);
      const mean = sample.reduce((sum, item) => sum + item, 0) / sample.length;
      const variance = sample.reduce((sum, item) => sum + (item - mean) ** 2, 0) / sample.length;
      const deviation = Math.sqrt(variance);
      return Math.abs(value - mean) / Math.max(deviation, 0.0001);
    });
  }

  function draw() {
    const windowSize = Number(windowInput.value);
    const threshold = Number(thresholdInput.value);
    const intensity = Number(intensityInput.value);
    outputs.window.value = `${windowSize} 点`;
    outputs.threshold.value = threshold.toFixed(1);
    outputs.intensity.value = `${intensity.toFixed(1)}×`;

    const { vibration, temperature } = randomSeries(intensity);
    const vibrationZ = zScores(vibration, windowSize);
    const temperatureZ = zScores(temperature, windowSize);
    const scores = vibrationZ.map((value, index) => Math.max(value, temperatureZ[index]));
    const anomalyIndexes = scores.map((score, index) => score >= threshold && index >= 2 ? index : -1).filter((index) => index >= 0);
    const currentScore = scores[scores.length - 1];
    const maxScore = Math.max(...scores);
    document.getElementById('score-value').textContent = currentScore.toFixed(2);
    document.getElementById('anomaly-count').textContent = `${anomalyIndexes.length} 点`;
    document.getElementById('max-score').textContent = maxScore.toFixed(2);
    const status = document.getElementById('status-value');
    const statusLine = document.getElementById('status-line');
    if (currentScore >= threshold) {
      status.textContent = '需要确认';
      statusLine.style.borderColor = colors.coral;
      statusLine.style.background = '#fff0ed';
      statusLine.style.color = '#914437';
    } else if (anomalyIndexes.length > 5) {
      status.textContent = '持续偏离';
      statusLine.style.borderColor = colors.amber;
      statusLine.style.background = '#fff7e9';
      statusLine.style.color = '#7b5a23';
    } else {
      status.textContent = '正常工况';
      statusLine.style.borderColor = colors.teal;
      statusLine.style.background = '#ecf8f5';
      statusLine.style.color = '#26776f';
    }

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
    const pad = { left: 46, right: 18, top: 20, bottom: 32 };
    const chartWidth = width - pad.left - pad.right;
    const chartHeight = height - pad.top - pad.bottom;
    const divider = pad.top + chartHeight * .57;
    const upperHeight = chartHeight * .50;
    const lowerTop = divider + 20;
    const lowerHeight = chartHeight * .36;
    const x = (index) => pad.left + (index / (vibration.length - 1)) * chartWidth;
    const vibrationMin = Math.min(...vibration) - .15;
    const vibrationMax = Math.max(...vibration) + .15;
    const temperatureMin = Math.min(...temperature) - 1;
    const temperatureMax = Math.max(...temperature) + 1;
    const yVibration = (value) => pad.top + (vibrationMax - value) / (vibrationMax - vibrationMin) * upperHeight;
    const yTemperature = (value) => pad.top + (temperatureMax - value) / (temperatureMax - temperatureMin) * upperHeight;
    const yScore = (value) => lowerTop + lowerHeight - (Math.min(5, value) / 5) * lowerHeight;
    ctx.font = '11px Segoe UI';
    ctx.fillStyle = colors.muted;
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    for (let tick = 0; tick <= 3; tick += 1) {
      const yy = pad.top + upperHeight * tick / 3;
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
      const value = vibrationMax - (vibrationMax - vibrationMin) * tick / 3;
      ctx.fillText(value.toFixed(1), 8, yy + 4);
    }
    for (let tick = 0; tick <= 2; tick += 1) {
      const yy = lowerTop + lowerHeight * tick / 2;
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
      ctx.fillText((5 - tick * 2.5).toFixed(1), 16, yy + 4);
    }
    ctx.fillStyle = colors.muted;
    ctx.fillText('传感器读数', pad.left, pad.top - 6);
    ctx.fillText('z-score 异常分数', pad.left, lowerTop - 8);
    ctx.fillText('采样点', width - 50, height - 8);
    ctx.save(); ctx.translate(12, lowerTop + 34); ctx.rotate(-Math.PI / 2); ctx.fillText('分数', 0, 0); ctx.restore();

    ctx.fillStyle = colors.band;
    const bandY = yScore(threshold);
    ctx.fillRect(pad.left, bandY, chartWidth, lowerTop + lowerHeight - bandY);
    ctx.strokeStyle = colors.coral; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(pad.left, bandY); ctx.lineTo(width - pad.right, bandY); ctx.stroke(); ctx.setLineDash([]);

    ctx.lineWidth = 2; ctx.strokeStyle = colors.teal; ctx.beginPath();
    vibration.forEach((value, index) => index ? ctx.lineTo(x(index), yVibration(value)) : ctx.moveTo(x(index), yVibration(value))); ctx.stroke();
    ctx.strokeStyle = colors.amber; ctx.beginPath();
    temperature.forEach((value, index) => index ? ctx.lineTo(x(index), yTemperature(value)) : ctx.moveTo(x(index), yTemperature(value))); ctx.stroke();
    ctx.strokeStyle = colors.blue; ctx.beginPath();
    scores.forEach((value, index) => index ? ctx.lineTo(x(index), yScore(value)) : ctx.moveTo(x(index), yScore(value))); ctx.stroke();
    ctx.fillStyle = colors.coral;
    anomalyIndexes.forEach((index) => { ctx.beginPath(); ctx.arc(x(index), yScore(scores[index]), 4, 0, Math.PI * 2); ctx.fill(); });
  }

  [windowInput, thresholdInput, intensityInput].forEach((input) => input.addEventListener('input', draw));
  if (window.ResizeObserver) new ResizeObserver(draw).observe(canvas);
  window.addEventListener('resize', draw);
  draw();
})();
