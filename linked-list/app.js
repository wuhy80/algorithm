(() => {
  'use strict';
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const initial = [12, 27, 39, 54];
  let nextId = 1;
  let nodes = [];
  let width = 1, height = 1, dpr = 1;
  let timeline = [], timelineIndex = -1, active = {}, lastAdvance = 0;
  let running = false, paused = false, speed = 5;
  let comparisons = 0, writes = 0;

  const el = id => document.getElementById(id);
  const status = el('status'), stepLabel = el('step-label'), operationLabel = el('operation-label');
  const valueInput = el('node-value'), speedInput = el('speed');

  function makeNode(value) { return { id: nextId++, value }; }
  function syncMetrics() {
    el('metric-count').textContent = nodes.length;
    el('metric-comparisons').textContent = comparisons;
    el('metric-writes').textContent = writes;
  }
  function setPaused(value) {
    paused = value;
    for (const id of ['pause-icon', 'stage-pause-icon']) el(id).classList.toggle('play', paused);
    el('pause-label').textContent = paused ? '继续' : '暂停';
    el('stage-pause-label').textContent = paused ? '继续' : '暂停';
    el('live-dot').classList.toggle('paused', paused);
  }
  function finish() {
    running = false; active = {}; setPaused(false); status.textContent = '操作完成'; stepLabel.textContent = 'DONE';
  }
  function advance() {
    if (!running) return;
    timelineIndex += 1;
    if (timelineIndex >= timeline.length) { finish(); return; }
    active = timeline[timelineIndex];
    if (active.apply) active.apply();
    status.textContent = active.message;
    operationLabel.textContent = active.code || '更新链表状态';
    stepLabel.textContent = `${timelineIndex + 1} / ${timeline.length}`;
    lastAdvance = performance.now(); syncMetrics();
  }
  function play(steps) {
    timeline = steps; timelineIndex = -1; running = true; setPaused(false); advance();
  }
  function delay() { return 1450 - speed * 115; }
  function readValue() { const value = Number(valueInput.value); return Number.isFinite(value) ? Math.max(0, Math.min(99, Math.round(value))) : 0; }

  function insertHead() {
    if (nodes.length >= 12) { status.textContent = '最多演示 12 个节点'; return; }
    const node = makeNode(readValue()), oldHead = nodes[0]?.id;
    play([
      { message: `分配新节点 ${node.value}`, ghost: node, code: 'new = Node(value)' },
      { message: '新节点指向原头节点', ghost: node, focus: oldHead ? [oldHead] : [], code: 'new.next = head', apply: () => { writes += 1; } },
      { message: 'HEAD 指向新节点', focus: [node.id], code: 'head = new', apply: () => { nodes.unshift(node); writes += 1; } }
    ]);
  }
  function insertTail() {
    if (nodes.length >= 12) { status.textContent = '最多演示 12 个节点'; return; }
    const node = makeNode(readValue()), steps = [];
    if (!nodes.length) { insertHead(); return; }
    nodes.forEach((item, index) => steps.push({ message: `current 访问节点 ${item.value}`, focus: [item.id], code: index === nodes.length - 1 ? 'current.next == null' : 'current = current.next', apply: () => { comparisons += 1; } }));
    steps.push({ message: `分配尾节点 ${node.value}`, ghost: node, code: 'new = Node(value)' });
    const tailId = nodes[nodes.length - 1].id;
    steps.push({ message: '尾节点 next 指向新节点', focus: [tailId, node.id], link: [tailId, node.id], code: 'tail.next = new', apply: () => { nodes.push(node); writes += 1; } });
    play(steps);
  }
  function findValue(remove = false) {
    const value = readValue(), index = nodes.findIndex(node => node.value === value), steps = [];
    const end = index >= 0 ? index : nodes.length - 1;
    for (let i = 0; i <= end; i++) steps.push({ message: `比较 ${nodes[i].value} 与 ${value}`, focus: [nodes[i].id], code: `${nodes[i].value} ${nodes[i].value === value ? '==' : '!='} ${value}`, apply: () => { comparisons += 1; } });
    if (index < 0) steps.push({ message: `未找到值 ${value}`, code: 'current == null', tone: 'danger' });
    else if (!remove) steps.push({ message: `找到节点 ${value}`, focus: [nodes[index].id], code: 'return current', tone: 'success' });
    else {
      const target = nodes[index], prev = nodes[index - 1];
      steps.push({ message: index === 0 ? 'HEAD 跳过目标节点' : '前驱跳过目标节点', focus: prev ? [prev.id, target.id] : [target.id], link: prev ? [prev.id, nodes[index + 1]?.id] : null, deleting: target.id, code: index === 0 ? 'head = head.next' : 'prev.next = current.next', apply: () => { nodes.splice(nodes.findIndex(n => n.id === target.id), 1); writes += 1; } });
    }
    if (!steps.length) steps.push({ message: '链表为空', code: 'head == null' });
    play(steps);
  }

  function layout() {
    const availableTop = width < 760 ? 105 : 125, availableBottom = 70;
    const nodeW = Math.max(68, Math.min(106, (width - 70) / Math.min(5, Math.max(1, nodes.length)) - 38));
    const nodeH = 54, gapX = Math.max(34, Math.min(58, nodeW * .52));
    const cols = Math.max(1, Math.floor((width - 50 + gapX) / (nodeW + gapX)));
    const rows = Math.max(1, Math.ceil(nodes.length / cols));
    const gapY = Math.min(112, Math.max(72, (height - availableTop - availableBottom - nodeH) / Math.max(1, rows - 1)));
    const positions = new Map();
    for (let i = 0; i < nodes.length; i++) {
      const row = Math.floor(i / cols), countInRow = Math.min(cols, nodes.length - row * cols), col = i % cols;
      const rowWidth = countInRow * nodeW + (countInRow - 1) * gapX;
      positions.set(nodes[i].id, { x: (width - rowWidth) / 2 + col * (nodeW + gapX), y: availableTop + row * gapY, w: nodeW, h: nodeH, row });
    }
    return { positions, nodeW, nodeH };
  }
  function roundedRect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function arrow(from, to, color, emphasized) {
    if (!from || !to) return;
    const sx = from.x + from.w, sy = from.y + from.h / 2, tx = to.x, ty = to.y + to.h / 2;
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = emphasized ? 2 : 1.2; ctx.beginPath(); ctx.moveTo(sx, sy);
    if (Math.abs(sy - ty) < 2) ctx.lineTo(tx, ty); else { const bend = Math.min(width - 18, sx + 25); ctx.lineTo(bend, sy); ctx.lineTo(bend, ty - 25); ctx.lineTo(tx - 18, ty - 25); ctx.lineTo(tx - 18, ty); ctx.lineTo(tx, ty); }
    ctx.stroke(); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx - 7, ty - 4); ctx.lineTo(tx - 7, ty + 4); ctx.closePath(); ctx.fill();
  }
  function render() {
    ctx.fillStyle = '#111816'; ctx.fillRect(0, 0, width, height);
    const { positions, nodeW, nodeH } = layout();
    for (let i = 0; i < nodes.length - 1; i++) {
      const emphasized = active.link && active.link[0] === nodes[i].id && active.link[1] === nodes[i + 1].id;
      arrow(positions.get(nodes[i].id), positions.get(nodes[i + 1].id), emphasized ? '#f1bd58' : '#61716a', emphasized);
    }
    nodes.forEach((node, index) => {
      const p = positions.get(node.id), focused = active.focus?.includes(node.id), deleting = active.deleting === node.id;
      roundedRect(p.x, p.y, p.w, p.h, 6); ctx.fillStyle = deleting ? '#3b2421' : focused ? '#203b31' : '#18221f'; ctx.fill(); ctx.strokeStyle = deleting ? '#ef7968' : focused ? '#78d9b2' : '#394640'; ctx.lineWidth = focused || deleting ? 2 : 1; ctx.stroke();
      ctx.strokeStyle = '#394640'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x + p.w * .68, p.y); ctx.lineTo(p.x + p.w * .68, p.y + p.h); ctx.stroke();
      ctx.fillStyle = '#eff3eb'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '600 16px ui-monospace, Consolas'; ctx.fillText(node.value, p.x + p.w * .34, p.y + p.h / 2);
      ctx.fillStyle = focused ? '#78d9b2' : '#82918a'; ctx.font = '10px ui-monospace, Consolas'; ctx.fillText(index === nodes.length - 1 ? 'NULL' : 'NEXT', p.x + p.w * .84, p.y + p.h / 2);
      if (index === 0) { ctx.fillStyle = '#f1bd58'; ctx.font = '10px ui-monospace, Consolas'; ctx.fillText('HEAD', p.x + 18, p.y - 14); ctx.strokeStyle = '#f1bd58'; ctx.beginPath(); ctx.moveTo(p.x + 18, p.y - 8); ctx.lineTo(p.x + 18, p.y - 1); ctx.stroke(); }
    });
    if (active.ghost) {
      const base = nodes.length ? positions.get(nodes[0].id) : { x: width / 2 - nodeW / 2, y: height / 2, w: nodeW, h: nodeH };
      const gx = Math.min(width - nodeW - 20, Math.max(20, base.x)), gy = Math.max(105, base.y - 82);
      roundedRect(gx, gy, nodeW, nodeH, 6); ctx.fillStyle = '#252b25'; ctx.fill(); ctx.strokeStyle = '#f1bd58'; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#f1bd58'; ctx.font = '600 15px ui-monospace, Consolas'; ctx.textAlign = 'center'; ctx.fillText(active.ghost.value, gx + nodeW / 2, gy + nodeH / 2); ctx.font = '9px ui-monospace, Consolas'; ctx.fillText('NEW', gx + nodeW / 2, gy - 10);
    }
    if (!nodes.length && !active.ghost) { ctx.fillStyle = '#718079'; ctx.textAlign = 'center'; ctx.font = '12px ui-monospace, Consolas'; ctx.fillText('HEAD → NULL', width / 2, height / 2); }
  }
  function resize() { const rect = canvas.getBoundingClientRect(); width = Math.max(1, rect.width); height = Math.max(1, rect.height); dpr = Math.min(2, devicePixelRatio || 1); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function frame(now) { if (running && !paused && now - lastAdvance >= delay()) advance(); render(); requestAnimationFrame(frame); }
  function reset() { nextId = 1; nodes = initial.map(makeNode); timeline = []; active = {}; running = false; comparisons = 0; writes = 0; setPaused(false); status.textContent = '等待操作'; operationLabel.textContent = 'HEAD → 首节点'; stepLabel.textContent = 'READY'; syncMetrics(); }
  function togglePause() { if (!running) return; setPaused(!paused); lastAdvance = performance.now(); }
  el('add-head').onclick = insertHead; el('add-tail').onclick = insertTail; el('find').onclick = () => findValue(false); el('remove').onclick = () => findValue(true);
  el('reset').onclick = reset; el('stage-reset').onclick = reset; el('pause').onclick = togglePause; el('stage-pause').onclick = togglePause;
  el('step').onclick = () => { if (!running) return; setPaused(true); advance(); };
  valueInput.addEventListener('keydown', event => { if (event.key === 'Enter') insertTail(); });
  speedInput.addEventListener('input', () => { speed = Number(speedInput.value); el('speed-value').textContent = speed; speedInput.style.setProperty('--progress', `${(speed - 1) / 9 * 100}%`); });
  speedInput.dispatchEvent(new Event('input')); new ResizeObserver(resize).observe(canvas); reset(); resize(); requestAnimationFrame(frame);
})();
