(() => {
  'use strict';

  const canvas = document.getElementById('yield-chart');
  if (!canvas) return;
  const controls = {
    downtime: document.getElementById('downtime'),
    target: document.getElementById('target'),
    horizon: document.getElementById('horizon'),
  };
  const outputs = {
    downtime: document.getElementById('downtime-output'),
    target: document.getElementById('target-output'),
    horizon: document.getElementById('horizon-output'),
  };
  const colors = {
    ink: '#172521', muted: '#62736d', line: '#d6e1dc',
    teal: '#2aa79b', amber: '#e3a34b', coral: '#d56c59', blue: '#5f9ad6',
  };

  // A deterministic signal keeps screenshots and parameter comparisons reproducible.
  const history = Array.from({ length: 36 }, (_, index) => {
    const trend = index * 0.18;
    const season = Math.sin(index * Math.PI / 3) * 5.5 + Math.cos(index * Math.PI / 6) * 2.1;
    const repeatableNoise = Math.sin(index * 17.31) * 1.55 + Math.cos(index * 3.77) * .65;
    return 86 + trend + season + repeatableNoise;
  });

  function linearTrend(values) {
    const meanX = (values.length - 1) / 2;
    const meanY = values.reduce((sum, value) => sum + value, 0) / values.length;
    let numerator = 0;
    let denominator = 0;
    values.forEach((value, index) => {
      numerator += (index - meanX) * (value - meanY);
      denominator += (index - meanX) ** 2;
    });
    return denominator ? numerator / denominator : 0;
  }

  function forecastSeries(horizon, downtime) {
    const window = history.slice(-18);
    const slope = linearTrend(window);
    const recentMean = window.reduce((sum, value) => sum + value, 0) / window.length;
    const level = recentMean + slope * (window.length / 2);
    // Treat a shift as eight available hours. Downtime is spread across the horizon.
    const availability = Math.max(0, 1 - downtime / (horizon * 8));
    return Array.from({ length: horizon }, (_, step) => {
      const seasonal = Math.sin((history.length + step) * Math.PI / 3) * 5.5
        + Math.cos((history.length + step) * Math.PI / 6) * 2.1;
      const baseline = level + slope * (step + 1) + seasonal * .72;
      return Math.max(0, baseline * availability);
    });
  }

  function formatSigned(value) {
    const rounded = Math.round(value * 10) / 10;
    return `${rounded > 0 ? '+' : ''}${rounded}`;
  }

  function draw() {
    const downtime = Number(controls.downtime.value);
    const target = Number(controls.target.value);
    const horizon = Number(controls.horizon.value);
    outputs.downtime.value = `${downtime} 小时`;
    outputs.target.value = `${target} 件`;
    outputs.horizon.value = `${horizon} 班`;

    const forecast = forecastSeries(horizon, downtime);
    const average = forecast.reduce((sum, value) => sum + value, 0) / forecast.length;
    const gap = average - target;
    const residuals = history.slice(-18).map((value, index) => value - (history[history.length - 18] + linearTrend(history.slice(-18)) * index));
    const residualStd = Math.sqrt(residuals.reduce((sum, value) => sum + value ** 2, 0) / residuals.length);
    const confidence = Math.max(58, Math.min(97, Math.round(96 - residualStd * 3 - downtime * .35)));
    document.getElementById('forecast-value').textContent = `${Math.round(average)} 件`;
    document.getElementById('gap-value').textContent = formatSigned(gap) + ' 件';
    document.getElementById('confidence-value').textContent = `${confidence}%`;
    const action = document.getElementById('action-value');
    action.textContent = gap >= 0 ? '目标可达' : gap > -8 ? '需要关注' : '建议调整排产';

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

    const all = history.concat(forecast);
    const minY = Math.max(0, Math.min(target - 18, ...all) - 4);
    const maxY = Math.max(target + 12, ...all) + 4;
    const pad = { left: 46, right: 18, top: 18, bottom: 32 };
    const chartWidth = Math.max(1, width - pad.left - pad.right);
    const chartHeight = Math.max(1, height - pad.top - pad.bottom);
    const total = history.length + horizon - 1;
    const x = (index) => pad.left + index / total * chartWidth;
    const y = (value) => pad.top + (maxY - value) / (maxY - minY) * chartHeight;
    ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.fillStyle = colors.muted;
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    for (let tick = 0; tick <= 4; tick += 1) {
      const value = minY + (maxY - minY) * tick / 4;
      const yy = y(value);
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
      ctx.fillText(value.toFixed(0), 9, yy + 4);
    }

    // Shade the future interval where planned downtime is allocated.
    const futureStart = history.length - 1;
    const downtimeSteps = Math.min(horizon, Math.ceil(downtime / 8));
    if (downtimeSteps > 0) {
      ctx.fillStyle = 'rgba(98, 115, 109, .13)';
      ctx.fillRect(x(futureStart), pad.top, x(futureStart + downtimeSteps) - x(futureStart), chartHeight);
      ctx.fillStyle = colors.muted;
      ctx.font = '10px Segoe UI, Microsoft YaHei, sans-serif';
      ctx.fillText('计划停机', x(futureStart) + 6, pad.top + 14);
    }
    ctx.strokeStyle = colors.coral;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(pad.left, y(target)); ctx.lineTo(width - pad.right, y(target)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.coral;
    ctx.fillText('目标', width - pad.right - 28, y(target) - 7);

    ctx.strokeStyle = colors.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((value, index) => index ? ctx.lineTo(x(index), y(value)) : ctx.moveTo(x(index), y(value)));
    ctx.stroke();
    ctx.fillStyle = colors.blue;
    history.forEach((value, index) => { ctx.beginPath(); ctx.arc(x(index), y(value), 2.3, 0, Math.PI * 2); ctx.fill(); });

    ctx.strokeStyle = colors.amber;
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 4]);
    ctx.beginPath();
    forecast.forEach((value, index) => {
      const pointIndex = futureStart + index;
      if (index === 0) { ctx.moveTo(x(pointIndex), y(history[history.length - 1])); }
      ctx.lineTo(x(pointIndex + 1), y(value));
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.amber;
    forecast.forEach((value, index) => { ctx.beginPath(); ctx.arc(x(futureStart + index + 1), y(value), 2.3, 0, Math.PI * 2); ctx.fill(); });

    ctx.fillStyle = colors.ink;
    ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.fillText('班次', width - pad.right - 22, height - 8);
    ctx.save(); ctx.translate(13, 56); ctx.rotate(-Math.PI / 2); ctx.fillText('产量（件）', 0, 0); ctx.restore();
  }

  Object.values(controls).forEach((control) => control.addEventListener('input', draw));
  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(canvas);
  window.addEventListener('resize', draw);
  draw();
})();
