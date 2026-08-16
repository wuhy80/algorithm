(() => {
  "use strict";
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const countInput = document.getElementById("node-count");
  const densityInput = document.getElementById("edge-density");
  const speedInput = document.getElementById("speed");
  const countOutput = document.getElementById("node-count-value");
  const densityOutput = document.getElementById("edge-density-value");
  const speedOutput = document.getElementById("speed-value");
  const visitedMetric = document.getElementById("visited");
  const frontierMetric = document.getElementById("frontier");
  const depthMetric = document.getElementById("depth");
  const fpsMetric = document.getElementById("fps");
  const queueContent = document.getElementById("queue-content");
  const graphSize = document.getElementById("graph-size");
  const startLabel = document.getElementById("start-label");
  const runState = document.getElementById("run-state");
  const pauseButton = document.getElementById("pause");
  const pauseIcon = document.getElementById("pause-icon");
  const pauseLabel = document.getElementById("pause-label");

  let nodes = [];
  let edges = [];
  let adjacency = [];
  let states = new Uint8Array(0);
  let order = new Int16Array(0);
  let depth = new Int16Array(0);
  let steps = [];
  let stepIndex = 0;
  let startNode = 0;
  let currentNode = -1;
  let queue = [];
  let visitedCount = 0;
  let paused = false;
  let accumulator = 0;
  let previousTime = performance.now();
  let fpsFrames = 0;
  let fpsStartedAt = previousTime;
  let dirty = true;
  let seed = 14321;
  let resizeTimer = 0;

  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function updateRange(input) {
    const value = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100;
    input.style.setProperty("--progress", `${value}%`);
  }

  function syncControls() {
    countOutput.value = countInput.value;
    densityOutput.value = `${densityInput.value}%`;
    speedOutput.value = `${speedInput.value} 步/秒`;
    [countInput, densityInput, speedInput].forEach(updateRange);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    dirty = true;
  }

  function generateGraph() {
    const count = Number(countInput.value);
    seed = (Date.now() ^ (count * 7919)) >>> 0;
    nodes = [];
    edges = [];
    adjacency = Array.from({ length: count }, () => []);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i += 1) {
      const ratio = count === 1 ? 0 : i / (count - 1);
      const radius = 0.06 + 0.39 * Math.sqrt(ratio);
      const angle = i * golden + (random() - 0.5) * 0.18;
      nodes.push({ x: 0.5 + Math.cos(angle) * radius, y: 0.51 + Math.sin(angle) * radius * 0.84 });
    }

    const connected = new Set();
    function addEdge(a, b) {
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (a === b || connected.has(key)) return;
      connected.add(key);
      edges.push([a, b]);
      adjacency[a].push(b);
      adjacency[b].push(a);
    }
    for (let i = 1; i < count; i += 1) {
      let nearest = 0;
      let best = Infinity;
      for (let j = 0; j < i; j += 1) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = dx * dx + dy * dy;
        if (distance < best) { best = distance; nearest = j; }
      }
      addEdge(i, nearest);
    }
    const extraChance = Number(densityInput.value) / 100;
    for (let i = 0; i < count; i += 1) {
      const candidates = [];
      for (let j = i + 1; j < count; j += 1) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        candidates.push({ j, distance: dx * dx + dy * dy });
      }
      candidates.sort((a, b) => a.distance - b.distance);
      candidates.slice(0, 4).forEach(({ j }) => { if (random() < extraChance) addEdge(i, j); });
    }
    adjacency.forEach((list) => list.sort((a, b) => a - b));
    startNode = Math.min(startNode, count - 1);
    graphSize.textContent = `${count} NODES · ${edges.length} EDGES`;
    resetTraversal();
  }

  function buildSteps() {
    const seen = new Uint8Array(nodes.length);
    const levels = new Int16Array(nodes.length);
    const work = [startNode];
    let head = 0;
    seen[startNode] = 1;
    steps = [{ type: "discover", node: startNode, depth: 0 }];
    while (head < work.length) {
      const node = work[head++];
      steps.push({ type: "process", node, depth: levels[node] });
      adjacency[node].forEach((neighbor) => {
        if (seen[neighbor]) return;
        seen[neighbor] = 1;
        levels[neighbor] = levels[node] + 1;
        work.push(neighbor);
        steps.push({ type: "discover", node: neighbor, parent: node, depth: levels[neighbor] });
      });
      steps.push({ type: "finish", node, depth: levels[node] });
    }
  }

  function resetTraversal() {
    states = new Uint8Array(nodes.length);
    order = new Int16Array(nodes.length);
    order.fill(-1);
    depth = new Int16Array(nodes.length);
    queue = [];
    currentNode = -1;
    visitedCount = 0;
    stepIndex = 0;
    buildSteps();
    setPaused(false);
    startLabel.textContent = `起点 NODE ${String(startNode + 1).padStart(2, "0")}`;
    updateMetrics();
    dirty = true;
  }

  function applyStep() {
    if (stepIndex >= steps.length) {
      setPaused(true);
      runState.textContent = "遍历已完成";
      return;
    }
    const event = steps[stepIndex++];
    if (event.type === "discover") {
      states[event.node] = 1;
      depth[event.node] = event.depth;
      queue.push(event.node);
    } else if (event.type === "process") {
      if (currentNode >= 0 && states[currentNode] === 3) states[currentNode] = 2;
      currentNode = event.node;
      states[event.node] = 3;
      queue = queue.filter((node) => node !== event.node);
      if (order[event.node] < 0) {
        order[event.node] = visitedCount;
        visitedCount += 1;
      }
    } else {
      states[event.node] = 2;
      if (currentNode === event.node) currentNode = -1;
    }
    updateMetrics();
    dirty = true;
  }

  function updateMetrics() {
    visitedMetric.textContent = `${visitedCount}/${nodes.length}`;
    frontierMetric.textContent = String(queue.length);
    depthMetric.textContent = currentNode >= 0 ? String(depth[currentNode]) : "–";
    queueContent.textContent = queue.length ? queue.slice(0, 12).map((node) => String(node + 1).padStart(2, "0")).join("  →  ") : "EMPTY";
  }

  function setPaused(value) {
    paused = value;
    pauseIcon.textContent = paused ? "▶" : "Ⅱ";
    pauseLabel.textContent = paused ? "继续" : "暂停";
    if (stepIndex < steps.length) runState.textContent = paused ? "遍历已暂停" : "逐层探索";
    pauseButton.setAttribute("aria-pressed", String(paused));
    accumulator = 0;
  }

  function draw() {
    const width = canvas.width;
    const height = canvas.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    ctx.fillStyle = "#101718";
    ctx.fillRect(0, 0, width, height);
    const top = 92 * dpr;
    const bottom = 62 * dpr;
    const usableHeight = Math.max(1, height - top - bottom);
    const px = (node) => node.x * width;
    const py = (node) => top + node.y * usableHeight;
    ctx.lineWidth = dpr;
    edges.forEach(([a, b]) => {
      const active = states[a] > 0 && states[b] > 0;
      ctx.strokeStyle = active ? "rgba(115,219,197,.34)" : "rgba(205,222,216,.12)";
      ctx.beginPath();
      ctx.moveTo(px(nodes[a]), py(nodes[a]));
      ctx.lineTo(px(nodes[b]), py(nodes[b]));
      ctx.stroke();
    });
    const radius = Math.max(9, Math.min(15, 180 / Math.sqrt(nodes.length))) * dpr;
    nodes.forEach((node, index) => {
      const x = px(node);
      const y = py(node);
      const state = states[index];
      const fill = state === 3 ? "#ef796a" : state === 2 ? "#73dbc5" : state === 1 ? "#f0c65e" : "#25302e";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = state ? 2 * dpr : dpr;
      ctx.strokeStyle = state ? "rgba(245,249,242,.72)" : "rgba(220,232,226,.2)";
      ctx.stroke();
      ctx.fillStyle = state ? "#101718" : "#c1cbc7";
      ctx.font = `${Math.max(8, radius / dpr * .72) * dpr}px ui-monospace, Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(index + 1), x, y);
      if (order[index] >= 0) {
        ctx.fillStyle = "rgba(240,246,241,.74)";
        ctx.font = `${8 * dpr}px ui-monospace, Consolas, monospace`;
        ctx.fillText(`#${order[index] + 1}`, x, y + radius + 11 * dpr);
      }
    });
    dirty = false;
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
    if (now - fpsStartedAt >= 500) {
      fpsMetric.textContent = String(Math.round(fpsFrames * 1000 / (now - fpsStartedAt)));
      fpsFrames = 0;
      fpsStartedAt = now;
    }
    requestAnimationFrame(frame);
  }

  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const top = 92;
    const usableHeight = Math.max(1, rect.height - top - 62);
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top - top) / usableHeight;
    let best = -1;
    let distance = Infinity;
    nodes.forEach((node, index) => {
      const dx = (node.x - x) * rect.width;
      const dy = (node.y - y) * usableHeight;
      const d = dx * dx + dy * dy;
      if (d < distance) { distance = d; best = index; }
    });
    if (best >= 0 && distance < 34 * 34) { startNode = best; resetTraversal(); }
  });
  countInput.addEventListener("input", syncControls);
  countInput.addEventListener("change", generateGraph);
  densityInput.addEventListener("input", syncControls);
  densityInput.addEventListener("change", generateGraph);
  speedInput.addEventListener("input", syncControls);
  document.getElementById("new-graph").addEventListener("click", generateGraph);
  document.getElementById("reset").addEventListener("click", resetTraversal);
  document.getElementById("step").addEventListener("click", () => { setPaused(true); applyStep(); });
  pauseButton.addEventListener("click", () => setPaused(!paused));
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeCanvas, 160); });
  syncControls();
  resizeCanvas();
  generateGraph();
  requestAnimationFrame(frame);
})();
