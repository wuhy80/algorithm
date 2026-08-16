(() => {
  "use strict";
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const sizeInput = document.getElementById("grid-size");
  const densityInput = document.getElementById("wall-density");
  const speedInput = document.getElementById("speed");
  const sizeOutput = document.getElementById("grid-size-value");
  const densityOutput = document.getElementById("wall-density-value");
  const speedOutput = document.getElementById("speed-value");
  const visitedMetric = document.getElementById("visited");
  const stackMetric = document.getElementById("stack-depth");
  const backtrackMetric = document.getElementById("backtracks");
  const fpsMetric = document.getElementById("fps");
  const gridStatus = document.getElementById("grid-status");
  const pathPreview = document.getElementById("path-preview");
  const statusLabel = document.getElementById("status-label");
  const runState = document.getElementById("run-state");
  const toolStatus = document.getElementById("tool-status");
  const pauseButton = document.getElementById("pause");
  const pauseIcon = document.getElementById("pause-icon");
  const pauseLabel = document.getElementById("pause-label");

  let columns = 30;
  let rows = 20;
  let walls = new Uint8Array(0);
  let states = new Uint8Array(0);
  let parent = new Int32Array(0);
  let steps = [];
  let stepIndex = 0;
  let start = 0;
  let target = 0;
  let current = -1;
  let pathStack = [];
  let visitedCount = 0;
  let backtracks = 0;
  let tool = "wall";
  let drawing = false;
  let paused = false;
  let accumulator = 0;
  let previousTime = performance.now();
  let fpsFrames = 0;
  let fpsStartedAt = previousTime;
  let dirty = true;
  let resizeTimer = 0;

  function updateRange(input) {
    const value = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100;
    input.style.setProperty("--progress", `${value}%`);
  }
  function syncControls() {
    sizeOutput.value = `${sizeInput.value} 列`;
    densityOutput.value = `${densityInput.value}%`;
    speedOutput.value = `${speedInput.value} 步/秒`;
    [sizeInput, densityInput, speedInput].forEach(updateRange);
  }
  function resizeCanvas(rebuild = false) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const nextColumns = Number(sizeInput.value);
    const nextRows = Math.max(12, Math.round(nextColumns * Math.max(1, rect.height - 132) / rect.width));
    if (rebuild || nextColumns !== columns || nextRows !== rows) {
      columns = nextColumns;
      rows = nextRows;
      generateMaze();
    }
    dirty = true;
  }
  function indexOf(x, y) { return y * columns + x; }
  function coordinates(index) { return { x: index % columns, y: Math.floor(index / columns) }; }
  function neighbors(index) {
    const { x, y } = coordinates(index);
    const result = [];
    if (x + 1 < columns) result.push(index + 1);
    if (y + 1 < rows) result.push(index + columns);
    if (x > 0) result.push(index - 1);
    if (y > 0) result.push(index - columns);
    return result;
  }
  function reachable(map) {
    const seen = new Uint8Array(map.length);
    const queue = [start];
    seen[start] = 1;
    for (let head = 0; head < queue.length; head += 1) {
      const node = queue[head];
      if (node === target) return true;
      neighbors(node).forEach((next) => { if (!map[next] && !seen[next]) { seen[next] = 1; queue.push(next); } });
    }
    return false;
  }
  function generateMaze() {
    const size = columns * rows;
    start = indexOf(1, Math.floor(rows / 2));
    target = indexOf(columns - 2, Math.floor(rows / 2));
    const probability = Number(densityInput.value) / 100;
    let candidate;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      candidate = new Uint8Array(size);
      for (let i = 0; i < size; i += 1) candidate[i] = Math.random() < probability ? 1 : 0;
      candidate[start] = 0;
      candidate[target] = 0;
      if (reachable(candidate)) break;
    }
    if (!reachable(candidate)) {
      const sy = Math.floor(rows / 2);
      for (let x = 1; x < columns - 1; x += 1) candidate[indexOf(x, sy)] = 0;
    }
    walls = candidate;
    gridStatus.textContent = `${columns} × ${rows} CELLS`;
    resetSearch();
  }
  function buildSteps() {
    const seen = new Uint8Array(walls.length);
    const localParent = new Int32Array(walls.length);
    localParent.fill(-1);
    const stack = [{ node: start, cursor: 0, options: neighbors(start) }];
    seen[start] = 1;
    steps = [{ type: "enter", node: start, parent: -1 }];
    while (stack.length) {
      const frame = stack[stack.length - 1];
      if (frame.node === target) { steps.push({ type: "found", node: target }); break; }
      let next = -1;
      while (frame.cursor < frame.options.length) {
        const candidate = frame.options[frame.cursor++];
        if (!walls[candidate] && !seen[candidate]) { next = candidate; break; }
      }
      if (next >= 0) {
        seen[next] = 1;
        localParent[next] = frame.node;
        steps.push({ type: "enter", node: next, parent: frame.node });
        stack.push({ node: next, cursor: 0, options: neighbors(next) });
      } else {
        stack.pop();
        steps.push({ type: "backtrack", node: frame.node, parent: stack.length ? stack[stack.length - 1].node : -1 });
      }
    }
  }
  function resetSearch() {
    states = new Uint8Array(walls.length);
    parent = new Int32Array(walls.length);
    parent.fill(-1);
    pathStack = [];
    current = -1;
    visitedCount = 0;
    backtracks = 0;
    stepIndex = 0;
    buildSteps();
    setPaused(false);
    statusLabel.textContent = "寻找目标";
    updateMetrics();
    dirty = true;
  }
  function applyStep() {
    if (stepIndex >= steps.length) { setPaused(true); runState.textContent = "搜索已结束"; return; }
    const event = steps[stepIndex++];
    if (event.type === "enter") {
      if (current >= 0 && states[current] === 4) states[current] = 2;
      current = event.node;
      states[current] = 4;
      parent[current] = event.parent;
      pathStack.push(current);
      visitedCount += 1;
    } else if (event.type === "backtrack") {
      states[event.node] = 3;
      backtracks += 1;
      if (pathStack[pathStack.length - 1] === event.node) pathStack.pop();
      current = event.parent;
      if (current >= 0) states[current] = 4;
    } else {
      current = event.node;
      states[current] = 5;
      setPaused(true);
      runState.textContent = "目标已找到";
      statusLabel.textContent = `路径长度 ${Math.max(0, pathStack.length - 1)}`;
    }
    updateMetrics();
    dirty = true;
  }
  function updateMetrics() {
    visitedMetric.textContent = String(visitedCount);
    stackMetric.textContent = String(pathStack.length);
    backtrackMetric.textContent = String(backtracks);
    pathPreview.textContent = pathStack.length ? pathStack.slice(-9).map((node) => { const p = coordinates(node); return `${p.x},${p.y}`; }).join("  ←  ") : "EMPTY";
  }
  function setPaused(value) {
    paused = value;
    pauseIcon.textContent = paused ? "▶" : "Ⅱ";
    pauseLabel.textContent = paused ? "继续" : "暂停";
    if (stepIndex < steps.length) runState.textContent = paused ? "搜索已暂停" : "向深处探索";
    pauseButton.setAttribute("aria-pressed", String(paused));
    accumulator = 0;
  }
  function draw() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const top = 92 * dpr;
    const bottom = 54 * dpr;
    const areaHeight = canvas.height - top - bottom;
    const cell = Math.min(canvas.width / columns, areaHeight / rows);
    const gridWidth = cell * columns;
    const gridHeight = cell * rows;
    const offsetX = (canvas.width - gridWidth) / 2;
    const offsetY = top + (areaHeight - gridHeight) / 2;
    ctx.fillStyle = "#111719";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const index = indexOf(x, y);
        let fill = "#172120";
        if (walls[index]) fill = "#303936";
        else if (states[index] === 2) fill = "#a88540";
        else if (states[index] === 3) fill = "#285954";
        else if (states[index] === 4) fill = "#ef776d";
        else if (states[index] === 5) fill = "#75d9d1";
        if (index === start) fill = "#79a6dc";
        if (index === target) fill = states[index] === 5 ? "#75d9d1" : "#efc25b";
        const gap = cell > 7 ? 1 * dpr : .5 * dpr;
        ctx.fillStyle = fill;
        ctx.fillRect(offsetX + x * cell + gap, offsetY + y * cell + gap, Math.max(1, cell - gap), Math.max(1, cell - gap));
      }
    }
    if (pathStack.length > 1) {
      ctx.strokeStyle = "rgba(239,194,91,.58)";
      ctx.lineWidth = Math.max(1, cell * .11);
      ctx.beginPath();
      pathStack.forEach((node, i) => { const p = coordinates(node); const x = offsetX + (p.x + .5) * cell; const y = offsetY + (p.y + .5) * cell; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.stroke();
    }
    [start, target].forEach((node, i) => {
      const p = coordinates(node);
      ctx.fillStyle = "#111719";
      ctx.font = `600 ${Math.max(8, cell * .44)}px ui-monospace,Consolas,monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(i ? "T" : "S", offsetX + (p.x + .5) * cell, offsetY + (p.y + .5) * cell);
    });
    canvas.dataset.offsetX = String(offsetX / dpr);
    canvas.dataset.offsetY = String(offsetY / dpr);
    canvas.dataset.cell = String(cell / dpr);
    dirty = false;
  }
  function pointerIndex(event) {
    const rect = canvas.getBoundingClientRect();
    const cell = Number(canvas.dataset.cell);
    const x = Math.floor((event.clientX - rect.left - Number(canvas.dataset.offsetX)) / cell);
    const y = Math.floor((event.clientY - rect.top - Number(canvas.dataset.offsetY)) / cell);
    return x >= 0 && x < columns && y >= 0 && y < rows ? indexOf(x, y) : -1;
  }
  function edit(event) {
    const index = pointerIndex(event);
    if (index < 0) return;
    if (tool === "start" && index !== target && !walls[index]) start = index;
    else if (tool === "target" && index !== start && !walls[index]) target = index;
    else if (tool === "wall" && index !== start && index !== target) walls[index] = 1;
    else if (tool === "erase") walls[index] = 0;
    resetSearch();
  }
  function frame(now) {
    const delta = Math.min(100, now - previousTime);
    previousTime = now;
    if (!paused) {
      accumulator += delta;
      const interval = 1000 / Number(speedInput.value);
      while (accumulator >= interval) { applyStep(); accumulator -= interval; if (paused) break; }
    }
    if (dirty) draw();
    fpsFrames += 1;
    if (now - fpsStartedAt >= 500) { fpsMetric.textContent = String(Math.round(fpsFrames * 1000 / (now - fpsStartedAt))); fpsFrames = 0; fpsStartedAt = now; }
    requestAnimationFrame(frame);
  }
  canvas.addEventListener("pointerdown", (event) => { drawing = true; canvas.setPointerCapture(event.pointerId); edit(event); });
  canvas.addEventListener("pointermove", (event) => { if (drawing && (tool === "wall" || tool === "erase")) edit(event); });
  canvas.addEventListener("pointerup", (event) => { drawing = false; canvas.releasePointerCapture(event.pointerId); });
  document.getElementById("tools").addEventListener("click", (event) => { const button = event.target.closest("button[data-tool]"); if (!button) return; tool = button.dataset.tool; document.querySelectorAll("#tools button").forEach((item) => item.setAttribute("aria-pressed", String(item === button))); toolStatus.textContent = button.textContent; });
  sizeInput.addEventListener("input", syncControls);
  sizeInput.addEventListener("change", () => resizeCanvas(true));
  densityInput.addEventListener("input", syncControls);
  densityInput.addEventListener("change", generateMaze);
  speedInput.addEventListener("input", syncControls);
  document.getElementById("new-maze").addEventListener("click", generateMaze);
  document.getElementById("reset").addEventListener("click", resetSearch);
  document.getElementById("step").addEventListener("click", () => { setPaused(true); applyStep(); });
  pauseButton.addEventListener("click", () => setPaused(!paused));
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => resizeCanvas(false), 160); });
  syncControls();
  resizeCanvas(true);
  requestAnimationFrame(frame);
})();
