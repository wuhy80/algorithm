(() => {
  'use strict';
  const canvas = document.getElementById('workflow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let phase = 0;
  function draw() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    ctx.clearRect(0, 0, width, height);
    const layers = [[4, width * .14], [7, width * .46], [4, width * .79]];
    const points = layers.map(([count, x], layer) => Array.from({ length: count }, (_, index) => ({
      x, y: height * (.17 + (index + 1) * .66 / (count + 1)), layer, index,
    })));
    ctx.lineWidth = 1;
    for (let layer = 0; layer < points.length - 1; layer += 1) {
      for (const source of points[layer]) for (const target of points[layer + 1]) {
        const pulse = .08 + .18 * (1 + Math.sin(phase + source.index * .7 + target.index * .3)) / 2;
        ctx.strokeStyle = `rgba(87, 193, 176, ${pulse})`;
        ctx.beginPath(); ctx.moveTo(source.x, source.y); ctx.lineTo(target.x, target.y); ctx.stroke();
      }
    }
    points.forEach((layer) => layer.forEach((point) => {
      const pulse = (1 + Math.sin(phase * 1.4 + point.index * .7 + point.layer)) / 2;
      ctx.beginPath(); ctx.arc(point.x, point.y, 5 + pulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = point.layer === 2 ? '#e3a34b' : point.layer === 1 ? '#5f9ad6' : '#2aa79b'; ctx.fill();
      ctx.beginPath(); ctx.arc(point.x, point.y, 12 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(130, 224, 205, ${.1 + pulse * .16})`; ctx.stroke();
    }));
    phase += .018;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(draw);
  }
  if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16 } });
  new ResizeObserver(draw).observe(canvas);
  draw();
})();
