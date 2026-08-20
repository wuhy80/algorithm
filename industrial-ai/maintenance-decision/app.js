(() => {
  'use strict';

  const canvas = document.getElementById('cost-chart');
  if (!canvas) return;
  const ids = ['failure-probability', 'downtime-loss', 'repair-cost', 'emergency-penalty', 'derating-cost'];
  const controls = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
  const outputs = Object.fromEntries(ids.map((id) => [id, document.getElementById(`${id}-output`)]));
  const colors = { ink: '#172521', muted: '#62736d', line: '#d6e1dc', immediate: '#d56c59', continue: '#5f9ad6', derated: '#e3a34b', teal: '#2aa79b' };
  const actions = [
    { key: 'immediate', label: '立即维护', color: colors.immediate },
    { key: 'continue', label: '继续运行', color: colors.continue },
    { key: 'derated', label: '降载运行', color: colors.derated },
  ];

  function readInputs() {
    return {
      probability: Number(controls['failure-probability'].value),
      downtime: Number(controls['downtime-loss'].value),
      repair: Number(controls['repair-cost'].value),
      emergency: Number(controls['emergency-penalty'].value),
      derating: Number(controls['derating-cost'].value),
    };
  }

  function calculate(input) {
    const incident = input.downtime + input.emergency;
    return {
      immediate: input.repair + input.downtime * 0.25,
      continue: input.probability * incident,
      derated: input.derating + input.probability * incident * 0.45,
    };
  }

  function formatNumber(value) { return `${value.toFixed(1)} 万`; }

  function updateOutputs(input) {
    outputs['failure-probability'].value = `${Math.round(input.probability * 100)}%`;
    outputs['downtime-loss'].value = `${input.downtime} 万`;
    outputs['repair-cost'].value = `${input.repair} 万`;
    outputs['emergency-penalty'].value = `${input.emergency} 万`;
    outputs['derating-cost'].value = `${input.derating} 万`;
  }

  function drawChart(costs, recommended) {
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
    const pad = { left: 50, right: 18, top: 22, bottom: 50 };
    const chartWidth = width - pad.left - pad.right;
    const chartHeight = height - pad.top - pad.bottom;
    const values = actions.map(({ key }) => costs[key]);
    const maxValue = Math.max(10, ...values) * 1.18;
    const y = (value) => pad.top + chartHeight - (value / maxValue) * chartHeight;
    const baseline = y(0);
    ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = colors.muted;
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    for (let tick = 0; tick <= 4; tick += 1) {
      const value = maxValue * tick / 4;
      const yy = y(value);
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
      ctx.fillText(value.toFixed(0), pad.left - 9, yy);
    }
    const slot = chartWidth / actions.length;
    const barWidth = Math.min(110, slot * 0.58);
    actions.forEach((action, index) => {
      const value = costs[action.key];
      const x = pad.left + slot * index + (slot - barWidth) / 2;
      const top = y(value);
      const isRecommended = action.key === recommended;
      ctx.fillStyle = action.color;
      ctx.globalAlpha = isRecommended ? 1 : 0.72;
      ctx.fillRect(x, top, barWidth, baseline - top);
      ctx.globalAlpha = 1;
      if (isRecommended) {
        ctx.strokeStyle = colors.ink;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 1, top - 1, barWidth + 2, baseline - top + 2);
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = colors.ink;
      ctx.font = '600 12px Segoe UI, Microsoft YaHei, sans-serif';
      ctx.fillText(formatNumber(value), x + barWidth / 2, Math.max(pad.top + 13, top - 7));
      ctx.font = '12px Segoe UI, Microsoft YaHei, sans-serif';
      ctx.fillStyle = colors.muted;
      ctx.textBaseline = 'top';
      ctx.fillText(action.label, x + barWidth / 2, baseline + 12);
      if (isRecommended) {
        ctx.fillStyle = colors.teal;
        ctx.font = '600 10px Segoe UI, Microsoft YaHei, sans-serif';
        ctx.fillText('推荐', x + barWidth / 2, baseline + 29);
      }
    });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = colors.muted;
    ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.fillText('期望成本（万元）', 8, pad.top - 6);
  }

  function render() {
    const input = readInputs();
    updateOutputs(input);
    const costs = calculate(input);
    const ranked = actions.slice().sort((a, b) => costs[a.key] - costs[b.key]);
    const recommended = ranked[0].key;
    const minimum = costs[recommended];
    const second = costs[ranked[1].key];
    document.getElementById('recommendation-value').textContent = ranked[0].label;
    document.getElementById('action-value').textContent = ranked[0].label;
    document.getElementById('minimum-cost-value').textContent = formatNumber(minimum);
    document.getElementById('saving-value').textContent = `${Math.max(0, ((second - minimum) / second) * 100).toFixed(0)}%`;
    const statusLine = document.getElementById('status-line');
    statusLine.style.borderLeftColor = ranked[0].color;
    statusLine.style.background = recommended === 'immediate' ? '#fff0ed' : recommended === 'continue' ? '#edf5fd' : '#fff7e9';
    drawChart(costs, recommended);
  }

  ids.forEach((id) => controls[id].addEventListener('input', render));
  if (window.ResizeObserver) new ResizeObserver(render).observe(canvas);
  window.addEventListener('resize', render);
  render();
})();
