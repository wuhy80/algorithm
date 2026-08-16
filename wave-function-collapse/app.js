(() => {
  'use strict';

  const NORTH = 1;
  const EAST = 2;
  const SOUTH = 4;
  const WEST = 8;
  const DIRECTIONS = [
    { bit: NORTH, opposite: SOUTH, dx: 0, dy: -1 },
    { bit: EAST, opposite: WEST, dx: 1, dy: 0 },
    { bit: SOUTH, opposite: NORTH, dx: 0, dy: 1 },
    { bit: WEST, opposite: EAST, dx: -1, dy: 0 }
  ];

  const TILE_SETS = {
    circuit: {
      name: '量子电路',
      masks: [0, 1, 2, 4, 8, 3, 6, 12, 9, 5, 10, 7, 11, 13, 14, 15],
      weights: [2.3, 0.75, 0.75, 0.75, 0.75, 1.35, 1.35, 1.35, 1.35, 1.7, 1.7, 0.48, 0.48, 0.48, 0.48, 0.16],
      background: '#16201d',
      grid: '#27342f',
      edge: '#43675a',
      line: '#79d9b3',
      core: '#e8f3e9',
      accent: '#f0bd59'
    },
    river: {
      name: '分形水系',
      masks: [0, 1, 2, 4, 8, 3, 6, 12, 9, 5, 10, 7, 11, 13, 14],
      weights: [1.9, 0.8, 0.8, 0.8, 0.8, 1.45, 1.45, 1.45, 1.45, 1.15, 1.15, 0.42, 0.42, 0.42, 0.42],
      background: '#16201e',
      grid: '#293833',
      edge: '#25464a',
      line: '#66c8d9',
      core: '#c9eff2',
      accent: '#9adbb8'
    },
    metro: {
      name: '城市路网',
      masks: [0, 3, 6, 12, 9, 5, 10, 7, 11, 13, 14, 15],
      weights: [2.5, 1.2, 1.2, 1.2, 1.2, 1.65, 1.65, 0.45, 0.45, 0.45, 0.45, 0.12],
      background: '#191d1d',
      grid: '#2b3030',
      edge: '#343b3a',
      line: '#d9ddd8',
      core: '#f1bd58',
      accent: '#ef7968'
    }
  };

  const canvas = document.getElementById('wfc-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const state = {
    size: 28,
    speed: 24,
    randomness: 58,
    tileSet: 'circuit',
    boundary: 'sealed',
    showEntropy: true,
    paused: false,
    complete: false
  };

  let options = new Uint16Array(1);
  let collapsedAt = new Float64Array(1);
  let compatible = [];
  let fullMask = 0;
  let history = [];
  let queue = new Int32Array(1);
  let queueHead = 0;
  let queueTail = 0;
  let width = 1;
  let height = 1;
  let dpr = 1;
  let boardX = 0;
  let boardY = 0;
  let boardSize = 1;
  let cellSize = 1;
  let lastTime = performance.now();
  let accumulator = 0;
  let activeCell = -1;
  let activeUntil = 0;
  let backtracks = 0;
  let restarts = 0;
  let decisions = 0;

  const controls = {
    size: document.getElementById('grid-size'),
    speed: document.getElementById('speed'),
    randomness: document.getElementById('randomness')
  };

  const outputs = {
    size: document.getElementById('grid-size-value'),
    speed: document.getElementById('speed-value'),
    randomness: document.getElementById('randomness-value')
  };

  const metricCollapsed = document.getElementById('metric-collapsed');
  const metricEntropy = document.getElementById('metric-entropy');
  const metricBacktracks = document.getElementById('metric-backtracks');
  const algorithmState = document.getElementById('algorithm-state');
  const cellState = document.getElementById('cell-state');
  const runState = document.getElementById('run-state');
  const liveDot = document.getElementById('live-dot');
  const pauseLabel = document.getElementById('pause-label');
  const pauseIcon = document.querySelector('.pause-icon');

  function popcount(value) {
    value -= (value >>> 1) & 0x5555;
    value = (value & 0x3333) + ((value >>> 2) & 0x3333);
    return ((((value + (value >>> 4)) & 0x0f0f) * 0x0101) >>> 8) & 0x1f;
  }

  function firstTile(mask) {
    for (let tile = 0; tile < 16; tile += 1) {
      if (mask & (1 << tile)) return tile;
    }
    return 0;
  }

  function currentSet() {
    return TILE_SETS[state.tileSet];
  }

  function adjustedWeight(tile) {
    const config = currentSet();
    const index = config.masks.indexOf(tile);
    const base = index >= 0 ? config.weights[index] : 0;
    const temperature = 0.35 + state.randomness * 0.0165;
    return Math.pow(base, 1 / temperature);
  }

  function entropy(mask) {
    let sum = 0;
    let weightedLog = 0;
    for (let tile = 0; tile < 16; tile += 1) {
      if (mask & (1 << tile)) {
        const weight = adjustedWeight(tile);
        sum += weight;
        weightedLog += weight * Math.log(weight);
      }
    }
    return sum > 0 ? Math.log(sum) - weightedLog / sum : 0;
  }

  function weightedChoice(mask) {
    let total = 0;
    for (let tile = 0; tile < 16; tile += 1) {
      if (mask & (1 << tile)) total += adjustedWeight(tile);
    }
    let target = Math.random() * total;
    for (let tile = 0; tile < 16; tile += 1) {
      if (mask & (1 << tile)) {
        target -= adjustedWeight(tile);
        if (target <= 0) return tile;
      }
    }
    return firstTile(mask);
  }

  function buildCompatibility() {
    const config = currentSet();
    fullMask = 0;
    for (const tile of config.masks) fullMask |= 1 << tile;
    compatible = DIRECTIONS.map((direction) => {
      const table = new Uint16Array(16);
      for (const tile of config.masks) {
        let allowed = 0;
        const hasEdge = (tile & direction.bit) !== 0;
        for (const neighbor of config.masks) {
          if (((neighbor & direction.opposite) !== 0) === hasEdge) allowed |= 1 << neighbor;
        }
        table[tile] = allowed;
      }
      return table;
    });
  }

  function allowedFrom(mask, directionIndex) {
    let allowed = 0;
    for (let tile = 0; tile < 16; tile += 1) {
      if (mask & (1 << tile)) allowed |= compatible[directionIndex][tile];
    }
    return allowed;
  }

  function enqueue(index) {
    queue[queueTail] = index;
    queueTail += 1;
  }

  function propagate(seed) {
    queueHead = 0;
    queueTail = 0;
    enqueue(seed);
    const size = state.size;

    while (queueHead < queueTail) {
      const index = queue[queueHead];
      queueHead += 1;
      const x = index % size;
      const y = Math.floor(index / size);

      for (let d = 0; d < DIRECTIONS.length; d += 1) {
        const direction = DIRECTIONS[d];
        const nx = x + direction.dx;
        const ny = y + direction.dy;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
        const neighborIndex = ny * size + nx;
        const next = options[neighborIndex] & allowedFrom(options[index], d);
        if (next === options[neighborIndex]) continue;
        if (next === 0) return false;
        options[neighborIndex] = next;
        enqueue(neighborIndex);
      }
    }
    return true;
  }

  function applyBoundaryConstraints() {
    if (state.boundary !== 'sealed') return true;
    const size = state.size;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const index = y * size + x;
        let mask = options[index];
        for (const tile of currentSet().masks) {
          const tileBit = 1 << tile;
          if (!(mask & tileBit)) continue;
          if ((y === 0 && (tile & NORTH)) ||
              (x === size - 1 && (tile & EAST)) ||
              (y === size - 1 && (tile & SOUTH)) ||
              (x === 0 && (tile & WEST))) {
            mask &= ~tileBit;
          }
        }
        if (mask === 0) return false;
        if (mask !== options[index]) {
          options[index] = mask;
          if (!propagate(index)) return false;
        }
      }
    }
    return true;
  }

  function rebuild(keepRestartCount = false) {
    buildCompatibility();
    const count = state.size * state.size;
    options = new Uint16Array(count);
    options.fill(fullMask);
    collapsedAt = new Float64Array(count);
    queue = new Int32Array(Math.max(count * 16, 256));
    history = [];
    activeCell = -1;
    backtracks = 0;
    decisions = 0;
    accumulator = 0;
    state.complete = false;
    if (!keepRestartCount) restarts = 0;

    if (!applyBoundaryConstraints()) {
      restarts += 1;
      state.boundary = 'open';
      updatePressed(document.getElementById('boundary'), 'open');
      options.fill(fullMask);
    }
    updateMetrics();
    updateRunState();
  }

  function findMinimumEntropyCell() {
    let bestIndex = -1;
    let bestEntropy = Infinity;
    const noise = state.randomness / 100 * 0.045;
    for (let i = 0; i < options.length; i += 1) {
      if (popcount(options[i]) <= 1) continue;
      const value = entropy(options[i]) + Math.random() * noise;
      if (value < bestEntropy) {
        bestEntropy = value;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  function commitDecision(index, availableMask) {
    const tile = weightedChoice(availableMask);
    const bit = 1 << tile;
    history.push({
      snapshot: options.slice(),
      index,
      remaining: availableMask & ~bit
    });
    options[index] = bit;
    collapsedAt[index] = performance.now();
    activeCell = index;
    activeUntil = performance.now() + 260;
    decisions += 1;
    return propagate(index);
  }

  function resolveContradiction() {
    while (history.length > 0) {
      const decision = history.pop();
      options.set(decision.snapshot);
      if (decision.remaining === 0) continue;
      backtracks += 1;
      if (commitDecision(decision.index, decision.remaining)) {
        algorithmState.textContent = `回退至决策 ${history.length}`;
        return true;
      }
    }

    restarts += 1;
    algorithmState.textContent = `矛盾重启 ${restarts}`;
    rebuild(true);
    return false;
  }

  function collapseOne() {
    if (state.complete) return false;
    const index = findMinimumEntropyCell();
    if (index < 0) {
      state.complete = true;
      state.paused = true;
      updateRunState();
      updateMetrics();
      return false;
    }

    algorithmState.textContent = `最低熵单元 #${index}`;
    if (!commitDecision(index, options[index])) resolveContradiction();
    updateMetrics();
    return true;
  }

  function updateMetrics() {
    let collapsed = 0;
    let entropySum = 0;
    let uncertain = 0;
    for (let i = 0; i < options.length; i += 1) {
      if (popcount(options[i]) === 1) {
        collapsed += 1;
      } else {
        entropySum += entropy(options[i]);
        uncertain += 1;
      }
    }
    metricCollapsed.textContent = `${Math.round(collapsed / options.length * 100)}%`;
    metricEntropy.textContent = uncertain ? (entropySum / uncertain).toFixed(2) : '0.00';
    metricBacktracks.textContent = backtracks;
    cellState.textContent = `${collapsed} / ${options.length} CELLS`;
  }

  function updateRunState() {
    liveDot.className = '';
    pauseIcon.classList.toggle('play', state.paused);
    if (state.complete) {
      runState.textContent = '生成完成';
      liveDot.className = 'complete';
      pauseLabel.textContent = '完成';
      return;
    }
    if (state.paused) {
      runState.textContent = '已暂停';
      liveDot.className = 'paused';
      pauseLabel.textContent = '继续';
    } else {
      runState.textContent = '正在坍缩';
      pauseLabel.textContent = '暂停';
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const headerSpace = width <= 760 ? 94 : 118;
    const footerSpace = width <= 760 ? 54 : 78;
    boardSize = Math.max(120, Math.min(width - (width <= 760 ? 28 : 72), height - headerSpace - footerSpace));
    boardX = Math.round((width - boardSize) / 2);
    boardY = Math.round(headerSpace + (height - headerSpace - footerSpace - boardSize) / 2);
    cellSize = boardSize / state.size;
  }

  function drawConnections(tile, x, y, size, config) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const endpoints = [];
    if (tile & NORTH) endpoints.push([cx, y - 0.5]);
    if (tile & EAST) endpoints.push([x + size + 0.5, cy]);
    if (tile & SOUTH) endpoints.push([cx, y + size + 0.5]);
    if (tile & WEST) endpoints.push([x - 0.5, cy]);
    if (endpoints.length === 0) {
      ctx.fillStyle = config.edge;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0.7, size * 0.065), 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    if (state.tileSet === 'river') {
      ctx.lineWidth = Math.max(2, size * 0.38);
      ctx.strokeStyle = config.edge;
      ctx.lineCap = 'round';
      for (const point of endpoints) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(point[0], point[1]);
        ctx.stroke();
      }
      ctx.lineWidth = Math.max(1.5, size * 0.25);
      ctx.strokeStyle = config.line;
    } else if (state.tileSet === 'metro') {
      ctx.lineWidth = Math.max(2, size * 0.34);
      ctx.strokeStyle = config.edge;
      ctx.lineCap = 'butt';
      for (const point of endpoints) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(point[0], point[1]);
        ctx.stroke();
      }
      ctx.lineWidth = Math.max(0.8, size * 0.055);
      ctx.setLineDash(size > 12 ? [size * 0.12, size * 0.09] : []);
      ctx.strokeStyle = config.core;
    } else {
      ctx.lineWidth = Math.max(1, size * 0.1);
      ctx.strokeStyle = config.line;
      ctx.lineCap = 'round';
    }

    for (const point of endpoints) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(point[0], point[1]);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const degree = endpoints.length;
    ctx.fillStyle = degree >= 3 ? config.accent : config.core;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(0.9, size * (degree >= 3 ? 0.12 : 0.075)), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawUncertain(mask, x, y, size, maxEntropy) {
    const count = popcount(mask);
    const ratio = maxEntropy > 0 ? entropy(mask) / maxEntropy : 0;
    if (state.showEntropy) {
      const alpha = 0.06 + ratio * 0.18;
      ctx.fillStyle = `rgba(241, 189, 88, ${alpha.toFixed(3)})`;
      ctx.fillRect(x + 0.7, y + 0.7, size - 1.4, size - 1.4);
    }
    if (size >= 11) {
      const dots = Math.min(4, count);
      const gap = Math.min(3, size * 0.16);
      const start = x + size / 2 - (dots - 1) * gap / 2;
      ctx.fillStyle = `rgba(223, 231, 225, ${0.18 + ratio * 0.25})`;
      for (let i = 0; i < dots; i += 1) {
        ctx.fillRect(start + i * gap, y + size / 2, 1, 1);
      }
    }
  }

  function render(now) {
    const config = currentSet();
    ctx.fillStyle = config.background;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0d1311';
    ctx.fillRect(boardX - 8, boardY - 8, boardSize + 16, boardSize + 16);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(boardX - 8.5, boardY - 8.5, boardSize + 17, boardSize + 17);

    const maxEntropy = entropy(fullMask);
    for (let y = 0; y < state.size; y += 1) {
      for (let x = 0; x < state.size; x += 1) {
        const index = y * state.size + x;
        const px = boardX + x * cellSize;
        const py = boardY + y * cellSize;
        ctx.fillStyle = config.background;
        ctx.fillRect(px, py, cellSize + 0.25, cellSize + 0.25);
        ctx.strokeStyle = config.grid;
        ctx.lineWidth = Math.min(1, cellSize * 0.08);
        ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);

        const mask = options[index];
        if (popcount(mask) === 1) {
          const age = collapsedAt[index] ? Math.min(1, (now - collapsedAt[index]) / 180) : 1;
          const eased = 1 - Math.pow(1 - age, 3);
          ctx.save();
          ctx.translate(px + cellSize / 2, py + cellSize / 2);
          ctx.scale(0.65 + eased * 0.35, 0.65 + eased * 0.35);
          ctx.translate(-px - cellSize / 2, -py - cellSize / 2);
          ctx.globalAlpha = 0.45 + eased * 0.55;
          drawConnections(firstTile(mask), px, py, cellSize, config);
          ctx.restore();
        } else {
          drawUncertain(mask, px, py, cellSize, maxEntropy);
        }
      }
    }

    if (activeCell >= 0 && now < activeUntil) {
      const x = activeCell % state.size;
      const y = Math.floor(activeCell / state.size);
      const pulse = 1 - (activeUntil - now) / 260;
      ctx.strokeStyle = `rgba(241, 189, 88, ${(1 - pulse).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(
        boardX + x * cellSize - pulse * cellSize * 0.35,
        boardY + y * cellSize - pulse * cellSize * 0.35,
        cellSize * (1 + pulse * 0.7),
        cellSize * (1 + pulse * 0.7)
      );
    }
  }

  function frame(now) {
    const delta = Math.min(100, now - lastTime);
    lastTime = now;
    if (!state.paused && !state.complete) {
      accumulator += delta * state.speed / 1000;
      let budget = Math.min(8, Math.floor(accumulator));
      while (budget > 0 && !state.complete) {
        collapseOne();
        accumulator -= 1;
        budget -= 1;
      }
    }
    render(now);
    requestAnimationFrame(frame);
  }

  function syncRange(key) {
    const input = controls[key];
    const min = Number(input.min);
    const max = Number(input.max);
    input.style.setProperty('--progress', `${(Number(input.value) - min) / (max - min) * 100}%`);
    if (key === 'size') outputs[key].textContent = `${input.value} × ${input.value}`;
    if (key === 'speed') outputs[key].textContent = `${input.value} 格/秒`;
    if (key === 'randomness') outputs[key].textContent = `${input.value}%`;
  }

  function updatePressed(group, value) {
    group.querySelectorAll('button[data-value]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.value === value));
    });
  }

  for (const [key, input] of Object.entries(controls)) {
    syncRange(key);
    input.addEventListener('input', () => {
      state[key] = Number(input.value);
      syncRange(key);
      if (key === 'size') {
        rebuild();
        resize();
      } else if (key === 'randomness') {
        updateMetrics();
      }
    });
  }

  document.getElementById('tile-set').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-value]');
    if (!button) return;
    state.tileSet = button.dataset.value;
    updatePressed(event.currentTarget, state.tileSet);
    document.getElementById('set-name').textContent = currentSet().name;
    rebuild();
  });

  document.getElementById('boundary').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-value]');
    if (!button) return;
    state.boundary = button.dataset.value;
    updatePressed(event.currentTarget, state.boundary);
    rebuild();
  });

  document.getElementById('show-entropy').addEventListener('change', (event) => {
    state.showEntropy = event.target.checked;
  });

  document.getElementById('rebuild').addEventListener('click', () => rebuild());

  document.getElementById('pause').addEventListener('click', () => {
    if (state.complete) rebuild();
    state.paused = !state.paused;
    updateRunState();
  });

  document.getElementById('step').addEventListener('click', () => {
    if (state.complete) rebuild();
    state.paused = true;
    collapseOne();
    updateRunState();
  });

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - boardX) / cellSize;
    const y = (event.clientY - rect.top - boardY) / cellSize;
    if (x < 0 || y < 0 || x >= state.size || y >= state.size) return;
    const index = Math.floor(y) * state.size + Math.floor(x);
    if (popcount(options[index]) <= 1 || state.complete) return;
    if (!commitDecision(index, options[index])) resolveContradiction();
    updateMetrics();
  });

  new ResizeObserver(resize).observe(canvas);
  rebuild();
  resize();
  requestAnimationFrame(frame);
})();
