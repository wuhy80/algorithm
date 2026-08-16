(() => {
  'use strict';

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const state = { ants: 120, speed: 1.4, alpha: 1.2, beta: 2.8, evaporation: 0.04, deposit: 1.8, nodes: 34, paused: false };
  let width = 1;
  let height = 1;
  let dpr = 1;
  let nodes = [];
  let edges = [];
  let adjacency = [];
  let ants = [];
  let nest = 0;
  let food = 1;
  let bestPath = [];
  let bestLength = Infinity;
  let completedTrips = 0;
  let generation = 1;
  let lastTime = performance.now();
  let fpsTime = lastTime;
  let fpsFrames = 0;

  const controls = {
    ants: document.getElementById('ant-count'), speed: document.getElementById('speed'), alpha: document.getElementById('alpha'),
    beta: document.getElementById('beta'), evaporation: document.getElementById('evaporation'), deposit: document.getElementById('deposit'), nodes: document.getElementById('node-count')
  };
  const outputs = {
    ants: document.getElementById('ant-count-value'), speed: document.getElementById('speed-value'), alpha: document.getElementById('alpha-value'),
    beta: document.getElementById('beta-value'), evaporation: document.getElementById('evaporation-value'), deposit: document.getElementById('deposit-value'), nodes: document.getElementById('node-count-value')
  };
  const format = { ants:v=>Math.round(v), speed:v=>`${Number(v).toFixed(1)}×`, alpha:v=>Number(v).toFixed(1), beta:v=>Number(v).toFixed(1), evaporation:v=>`${Math.round(v)}%`, deposit:v=>Number(v).toFixed(1), nodes:v=>Math.round(v) };

  function syncRange(key) {
    const input = controls[key];
    const min = Number(input.min);
    const max = Number(input.max);
    input.style.setProperty('--progress', `${(Number(input.value) - min) / (max - min) * 100}%`);
    outputs[key].textContent = format[key](input.value);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const oldW = width;
    const oldH = height;
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (nodes.length && oldW > 1 && oldH > 1) {
      for (const node of nodes) {
        node.x = node.x / oldW * width;
        node.y = node.y / oldH * height;
      }
      updateEdgeLengths();
    }
  }

  function updateEdgeLengths() {
    for (const edge of edges) {
      edge.length = Math.hypot(nodes[edge.a].x - nodes[edge.b].x, nodes[edge.a].y - nodes[edge.b].y);
    }
  }

  function edgeKey(a, b) { return a < b ? `${a}:${b}` : `${b}:${a}`; }

  function buildGraph() {
    const count = state.nodes;
    const top = height < 620 ? 94 : 116;
    const pad = Math.max(30, Math.min(width, height) * 0.07);
    nodes = [];
    nodes.push({ x: pad + 10, y: height * 0.56 });
    nodes.push({ x: width - pad - 10, y: height * 0.42 });
    for (let i = 2; i < count; i += 1) {
      let candidate;
      let tries = 0;
      do {
        candidate = { x: pad + Math.random() * Math.max(1, width - pad * 2), y: top + Math.random() * Math.max(1, height - top - pad) };
        tries += 1;
      } while (tries < 30 && nodes.some(n => Math.hypot(n.x - candidate.x, n.y - candidate.y) < 42));
      nodes.push(candidate);
    }

    edges = [];
    adjacency = Array.from({ length: count }, () => []);
    const existing = new Set();
    function connect(a, b) {
      if (a === b || existing.has(edgeKey(a, b))) return;
      const edge = { a, b, length: Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y), pheromone: 0.15 };
      const index = edges.length;
      edges.push(edge);
      adjacency[a].push({ node: b, edge: index });
      adjacency[b].push({ node: a, edge: index });
      existing.add(edgeKey(a, b));
    }

    const ordered = nodes.map((_, i) => i).sort((a, b) => nodes[a].x - nodes[b].x);
    for (let i = 1; i < ordered.length; i += 1) connect(ordered[i - 1], ordered[i]);
    for (let i = 0; i < count; i += 1) {
      const nearest = nodes.map((node, j) => ({ j, d: Math.hypot(node.x - nodes[i].x, node.y - nodes[i].y) })).filter(v => v.j !== i).sort((a, b) => a.d - b.d).slice(0, 4);
      for (const item of nearest) connect(i, item.j);
    }
    updateEdgeLengths();
    resetSimulation();
  }

  function makeAnt() {
    return { current: nest, target: nest, edge: -1, progress: 0, path: [nest], solutionPath: null, edgePath: [], visited: new Set([nest]), returning: false, pathLength: 0, offset: (Math.random() - 0.5) * 5 };
  }

  function resetSimulation() {
    bestPath = [];
    bestLength = Infinity;
    completedTrips = 0;
    generation = 1;
    for (const edge of edges) edge.pheromone = 0.15;
    ants = Array.from({ length: state.ants }, makeAnt);
    updateMetrics();
  }

  function setAntCount() {
    while (ants.length < state.ants) ants.push(makeAnt());
    if (ants.length > state.ants) ants.length = state.ants;
  }

  function chooseNext(ant) {
    const candidates = adjacency[ant.current].filter(option => !ant.visited.has(option.node) || option.node === food);
    const options = candidates.length ? candidates : adjacency[ant.current];
    let total = 0;
    const weights = [];
    for (const option of options) {
      const edge = edges[option.edge];
      const foodDistance = Math.hypot(nodes[option.node].x - nodes[food].x, nodes[option.node].y - nodes[food].y);
      const heuristic = 1 / Math.max(12, edge.length * 0.45 + foodDistance * 0.55);
      const revisitPenalty = ant.visited.has(option.node) ? 0.04 : 1;
      const weight = Math.pow(Math.max(0.01, edge.pheromone), state.alpha) * Math.pow(heuristic * 100, state.beta) * revisitPenalty;
      weights.push(weight);
      total += weight;
    }
    let pick = Math.random() * total;
    for (let i = 0; i < options.length; i += 1) {
      pick -= weights[i];
      if (pick <= 0) return options[i];
    }
    return options[options.length - 1];
  }

  function beginEdge(ant, option) {
    ant.target = option.node;
    ant.edge = option.edge;
    ant.progress = 0;
  }

  function restartAnt(ant) {
    Object.assign(ant, makeAnt());
  }

  function arrive(ant) {
    ant.current = ant.target;
    ant.progress = 0;
    if (ant.returning) {
      if (ant.current === nest) {
        const reward = state.deposit * 38 / Math.max(80, ant.pathLength);
        for (const edgeIndex of ant.edgePath) edges[edgeIndex].pheromone = Math.min(8, edges[edgeIndex].pheromone + reward);
        completedTrips += 1;
        if (ant.pathLength < bestLength) {
          bestLength = ant.pathLength;
          bestPath = ant.solutionPath.slice();
        }
        if (completedTrips % Math.max(1, state.ants) === 0) generation += 1;
        restartAnt(ant);
        updateMetrics();
      } else {
        const edgeIndex = ant.edgePath[ant.path.length - 2];
        ant.path.pop();
        beginEdge(ant, { node: ant.path[ant.path.length - 1], edge: edgeIndex });
      }
      return;
    }

    ant.path.push(ant.current);
    ant.edgePath.push(ant.edge);
    ant.pathLength += edges[ant.edge].length;
    ant.visited.add(ant.current);
    if (ant.current === food) {
      ant.returning = true;
      ant.solutionPath = ant.path.slice();
      const edgeIndex = ant.edgePath[ant.path.length - 2];
      ant.path.pop();
      beginEdge(ant, { node: ant.path[ant.path.length - 1], edge: edgeIndex });
    } else if (ant.path.length > nodes.length * 1.6) {
      restartAnt(ant);
    } else {
      beginEdge(ant, chooseNext(ant));
    }
  }

  function update(dt) {
    const evaporation = state.evaporation * dt * 0.018;
    for (const edge of edges) edge.pheromone = Math.max(0.035, edge.pheromone * (1 - evaporation));
    for (const ant of ants) {
      if (ant.edge < 0) beginEdge(ant, chooseNext(ant));
      const edge = edges[ant.edge];
      ant.progress += state.speed * dt * 2.8 / Math.max(20, edge.length);
      if (ant.progress >= 1) arrive(ant);
    }
  }

  function antPosition(ant) {
    const from = nodes[ant.current];
    const to = nodes[ant.target];
    const t = Math.min(1, ant.progress);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: from.x + dx * t - dy / length * ant.offset, y: from.y + dy * t + dx / length * ant.offset, angle: Math.atan2(dy, dx) };
  }

  function render() {
    ctx.fillStyle = '#171713';
    ctx.fillRect(0, 0, width, height);
    const topPheromone = Math.max(0.2, ...edges.map(edge => edge.pheromone));

    ctx.lineCap = 'round';
    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      const strength = Math.min(1, edge.pheromone / topPheromone);
      ctx.beginPath();
      ctx.moveTo(nodes[edge.a].x, nodes[edge.a].y);
      ctx.lineTo(nodes[edge.b].x, nodes[edge.b].y);
      ctx.lineWidth = 1 + strength * 5;
      ctx.strokeStyle = `rgba(235,118,95,${0.18 + strength * 0.78})`;
      ctx.stroke();
    }

    if (bestPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(nodes[bestPath[0]].x, nodes[bestPath[0]].y);
      for (let i = 1; i < bestPath.length; i += 1) ctx.lineTo(nodes[bestPath[i]].x, nodes[bestPath[i]].y);
      ctx.setLineDash([4, 7]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(201,236,114,.72)';
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (let i = 0; i < nodes.length; i += 1) {
      const radius = i === nest || i === food ? 8 : 3.4;
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, radius, 0, Math.PI * 2);
      ctx.fillStyle = i === nest ? '#c9ec72' : i === food ? '#f2b84b' : 'rgba(240,234,215,.86)';
      ctx.fill();
      if (i === nest || i === food) {
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, radius + 7, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = i === nest ? 'rgba(201,236,114,.3)' : 'rgba(242,184,75,.3)';
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#f0ead7';
    for (const ant of ants) {
      if (ant.edge < 0) continue;
      const p = antPosition(ant);
      const size = width < 600 ? 2.1 : 2.7;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.8, size * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function updateMetrics() {
    document.getElementById('best').textContent = Number.isFinite(bestLength) ? `${Math.round(bestLength)} px` : '--';
    document.getElementById('trips').textContent = completedTrips;
    document.getElementById('generation').textContent = `第 ${generation} 轮`;
  }

  function frame(time) {
    const dt = Math.min(2, (time - lastTime) / 16.667);
    lastTime = time;
    if (!state.paused) update(dt);
    render();
    fpsFrames += 1;
    if (time - fpsTime > 500) {
      document.getElementById('fps').textContent = Math.min(99, Math.round(fpsFrames * 1000 / (time - fpsTime)));
      fpsFrames = 0;
      fpsTime = time;
      updateMetrics();
    }
    requestAnimationFrame(frame);
  }

  for (const [key, input] of Object.entries(controls)) {
    syncRange(key);
    input.addEventListener('input', () => {
      const raw = Number(input.value);
      state[key] = key === 'evaporation' ? raw / 100 : raw;
      syncRange(key);
      if (key === 'ants') { state.ants = Math.round(raw); setAntCount(); }
    });
    if (key === 'nodes') input.addEventListener('change', () => { state.nodes = Math.round(Number(input.value)); buildGraph(); });
  }

  document.getElementById('rebuild').addEventListener('click', buildGraph);
  document.getElementById('pause').addEventListener('click', () => {
    state.paused = !state.paused;
    document.getElementById('pause-label').textContent = state.paused ? '继续' : '暂停';
    document.getElementById('pause-icon').textContent = state.paused ? '▶' : 'Ⅱ';
    if (!state.paused) lastTime = performance.now();
  });

  new ResizeObserver(resize).observe(canvas);
  resize();
  buildGraph();
  requestAnimationFrame(frame);
})();
