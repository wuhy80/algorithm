(() => {
  'use strict';
  const canvas = document.getElementById('rul-chart');
  const controls = ['noise', 'horizon', 'threshold'].map((id) => document.getElementById(id));
  const outputs = { noise: document.getElementById('noise-output'), horizon: document.getElementById('horizon-output'), threshold: document.getElementById('threshold-output') };
  const colors = { ink: '#172521', muted: '#62736d', line: '#d6e1dc', teal: '#2aa79b', amber: '#e3a34b', coral: '#d56c59', blue: '#5f9ad6' };
  let seed = 31;
  function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  function buildSeries(noise) {
    seed = 31;
    return Array.from({ length: 44 }, (_, index) => 98 - index * .94 - Math.max(0, index - 27) * .19 + (random() - .5) * noise * 3.1 + Math.sin(index * .65) * .55);
  }
  function draw() {
    const noise = Number(controls[0].value); const horizon = Number(controls[1].value); const threshold = Number(controls[2].value);
    outputs.noise.value = noise.toFixed(1); outputs.horizon.value = `${horizon} 步`; outputs.threshold.value = threshold;
    const values = buildSeries(noise); const recent = values.slice(-16); const xMean = (recent.length - 1) / 2; const yMean = recent.reduce((a, b) => a + b, 0) / recent.length;
    let numerator = 0; let denominator = 0; recent.forEach((value, index) => { numerator += (index - xMean) * (value - yMean); denominator += (index - xMean) ** 2; });
    const slope = numerator / denominator; const last = values[values.length - 1]; const remaining = slope < 0 ? Math.max(0, Math.ceil((threshold - last) / slope)) : -1; const confidence = Math.max(55, Math.min(97, Math.round(95 - noise * 9 - Math.abs(slope + .95) * 19)));
    document.getElementById('rul-value').textContent = remaining < 0 ? '稳定' : `${remaining} 步`;
    document.getElementById('risk-value').textContent = remaining >= 0 && remaining < 12 ? '高' : remaining >= 0 && remaining < 24 ? '中' : '低';
    document.getElementById('confidence-value').textContent = `${confidence}%`;
    document.getElementById('action-value').textContent = remaining >= 0 && remaining < 12 ? '安排检修' : remaining >= 0 && remaining < 24 ? '准备备件' : '继续采集';
    const rect = canvas.getBoundingClientRect(); const ratio = Math.min(devicePixelRatio || 1, 2); const width = Math.max(1, Math.floor(rect.width)); const height = Math.max(1, Math.floor(rect.height));
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) { canvas.width = width * ratio; canvas.height = height * ratio; }
    const ctx = canvas.getContext('2d'); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height);
    const pad = { left: 44, right: 18, top: 18, bottom: 30 }; const chartWidth = width - pad.left - pad.right; const chartHeight = height - pad.top - pad.bottom; const total = values.length + horizon; const minY = Math.min(threshold - 8, ...values) - 2; const maxY = Math.max(100, ...values) + 2; const x = (index) => pad.left + index / (total - 1) * chartWidth; const y = (value) => pad.top + (maxY - value) / (maxY - minY) * chartHeight;
    ctx.font = '11px Segoe UI'; ctx.fillStyle = colors.muted; ctx.strokeStyle = colors.line; ctx.lineWidth = 1;
    for (let tick = 0; tick <= 4; tick += 1) { const value = minY + (maxY - minY) * tick / 4; const yy = y(value); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke(); ctx.fillText(value.toFixed(0), 8, yy + 4); }
    ctx.strokeStyle = colors.coral; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(pad.left, y(threshold)); ctx.lineTo(width - pad.right, y(threshold)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = colors.blue; ctx.lineWidth = 2; ctx.beginPath(); values.forEach((value, index) => index ? ctx.lineTo(x(index), y(value)) : ctx.moveTo(x(index), y(value))); ctx.stroke();
    const forecastStart = values.length - 1; ctx.strokeStyle = colors.amber; ctx.setLineDash([7, 4]); ctx.beginPath(); ctx.moveTo(x(forecastStart), y(last)); ctx.lineTo(x(forecastStart + horizon), y(last + slope * horizon)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = colors.blue; values.forEach((value, index) => { ctx.beginPath(); ctx.arc(x(index), y(value), 2.4, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = colors.ink; ctx.fillText('时间步', width - 42, height - 8); ctx.save(); ctx.translate(12, 54); ctx.rotate(-Math.PI / 2); ctx.fillText('健康度', 0, 0); ctx.restore();
  }
  controls.forEach((control) => control.addEventListener('input', draw));
  new ResizeObserver(draw).observe(canvas); draw();
})();
