(() => {
  'use strict';

  const MAX_BOIDS = 1400;
  const TAU = Math.PI * 2;
  const canvas = document.getElementById('flock-canvas');
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

  const state = {
    count: 420,
    perception: 62,
    speed: 3.2,
    alignment: 1,
    cohesion: 0.85,
    separation: 1.35,
    force: 0.055,
    boundary: 'wrap',
    tool: 'attract',
    trails: true,
    paused: false
  };

  const presets = {
    natural: { label: '自然迁徙', perception: 62, speed: 3.2, alignment: 1, cohesion: 0.85, separation: 1.35, force: 0.055 },
    school: { label: '紧密集群', perception: 88, speed: 2.7, alignment: 1.45, cohesion: 1.55, separation: 1.1, force: 0.07 },
    storm: { label: '湍流风暴', perception: 42, speed: 5.1, alignment: 0.45, cohesion: 0.55, separation: 2.35, force: 0.11 },
    calm: { label: '舒缓漂流', perception: 108, speed: 1.7, alignment: 1.6, cohesion: 0.65, separation: 1.75, force: 0.035 }
  };

  const x = new Float32Array(MAX_BOIDS);
  const y = new Float32Array(MAX_BOIDS);
  const vx = new Float32Array(MAX_BOIDS);
  const vy = new Float32Array(MAX_BOIDS);
  const next = new Int32Array(MAX_BOIDS);
  let gridHead = new Int32Array(1);
  let gridCols = 1;
  let gridRows = 1;
  let width = 1;
  let height = 1;
  let dpr = 1;
  let lastTime = performance.now();
  let fpsTime = lastTime;
  let fpsFrames = 0;
  let animationId = 0;
  let initialized = false;
  let coherence = 0;
  let steerResultX = 0;
  let steerResultY = 0;

  const pointer = { x: 0, y: 0, active: false, inside: false };
  const obstacles = [];

  const controls = {
    count: document.getElementById('count'),
    perception: document.getElementById('perception'),
    speed: document.getElementById('speed'),
    alignment: document.getElementById('alignment'),
    cohesion: document.getElementById('cohesion'),
    separation: document.getElementById('separation'),
    force: document.getElementById('force'),
    trails: document.getElementById('trails')
  };

  const outputs = Object.fromEntries(
    Object.keys(controls)
      .filter((key) => key !== 'trails')
      .map((key) => [key, document.getElementById(`${key}-value`)])
  );

  const formatters = {
    count: (value) => String(Math.round(value)),
    perception: (value) => `${Math.round(value)} px`,
    speed: (value) => Number(value).toFixed(1),
    alignment: (value) => Number(value).toFixed(2),
    cohesion: (value) => Number(value).toFixed(2),
    separation: (value) => Number(value).toFixed(2),
    force: (value) => Number(value).toFixed(3)
  };

  function randomVelocity(index) {
    const angle = Math.random() * TAU;
    const magnitude = state.speed * (0.45 + Math.random() * 0.4);
    vx[index] = Math.cos(angle) * magnitude;
    vy[index] = Math.sin(angle) * magnitude;
  }

  function createBoid(index, centered = false) {
    if (centered) {
      const angle = Math.random() * TAU;
      const radius = Math.sqrt(Math.random()) * Math.min(width, height) * 0.28;
      x[index] = width * 0.5 + Math.cos(angle) * radius;
      y[index] = height * 0.5 + Math.sin(angle) * radius;
    } else {
      x[index] = Math.random() * width;
      y[index] = Math.random() * height;
    }
    randomVelocity(index);
  }

  function setCount(nextCount) {
    const oldCount = state.count;
    state.count = Math.min(MAX_BOIDS, Math.max(1, Math.round(nextCount)));
    if (initialized && state.count > oldCount) {
      for (let i = oldCount; i < state.count; i += 1) createBoid(i);
    }
    document.getElementById('metric-count').textContent = state.count;
  }

  function scatter(centered = false) {
    for (let i = 0; i < state.count; i += 1) createBoid(i, centered);
    ctx.fillStyle = '#101715';
    ctx.fillRect(0, 0, width, height);
  }

  function updateRangeStyle(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const progress = ((Number(input.value) - min) / (max - min)) * 100;
    input.style.setProperty('--range-progress', `${progress}%`);
  }

  function syncControl(key) {
    const control = controls[key];
    if (!control || control.type === 'checkbox') return;
    control.value = state[key];
    outputs[key].textContent = formatters[key](state[key]);
    updateRangeStyle(control);
  }

  function syncAllControls() {
    Object.keys(outputs).forEach(syncControl);
    controls.trails.checked = state.trails;
    document.getElementById('metric-count').textContent = state.count;
  }

  function setPreset(name) {
    const preset = presets[name];
    if (!preset) return;
    Object.keys(preset).forEach((key) => {
      if (key !== 'label') state[key] = preset[key];
    });
    syncAllControls();
    document.getElementById('scene-name').textContent = preset.label;
  }

  function markCustom() {
    const preset = document.getElementById('preset');
    preset.value = 'custom';
    document.getElementById('scene-name').textContent = '自定义演化';
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#101715';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < state.count; i += 1) {
      x[i] = Math.min(width - 1, Math.max(1, x[i] || Math.random() * width));
      y[i] = Math.min(height - 1, Math.max(1, y[i] || Math.random() * height));
    }
  }

  function rebuildGrid() {
    const cellSize = state.perception;
    gridCols = Math.max(1, Math.ceil(width / cellSize));
    gridRows = Math.max(1, Math.ceil(height / cellSize));
    const required = gridCols * gridRows;
    if (gridHead.length !== required) gridHead = new Int32Array(required);
    gridHead.fill(-1);

    for (let i = 0; i < state.count; i += 1) {
      const col = Math.min(gridCols - 1, Math.max(0, Math.floor(x[i] / cellSize)));
      const row = Math.min(gridRows - 1, Math.max(0, Math.floor(y[i] / cellSize)));
      const cell = row * gridCols + col;
      next[i] = gridHead[cell];
      gridHead[cell] = i;
    }
  }

  function calculateSteer(index, targetX, targetY, weight, maxForce) {
    let dx = targetX - x[index];
    let dy = targetY - y[index];
    const length = Math.hypot(dx, dy) || 1;
    dx = (dx / length) * state.speed - vx[index];
    dy = (dy / length) * state.speed - vy[index];
    const forceLength = Math.hypot(dx, dy) || 1;
    const limited = Math.min(maxForce, forceLength);
    steerResultX = (dx / forceLength) * limited * weight;
    steerResultY = (dy / forceLength) * limited * weight;
  }

  function updateBoids(dt) {
    rebuildGrid();
    const perceptionSq = state.perception * state.perception;
    const separationRadius = state.perception * 0.42;
    const separationSq = separationRadius * separationRadius;
    const cellSize = state.perception;
    const maxForce = state.force * dt;
    let meanVx = 0;
    let meanVy = 0;
    let meanSpeed = 0;

    for (let i = 0; i < state.count; i += 1) {
      const baseCol = Math.min(gridCols - 1, Math.max(0, Math.floor(x[i] / cellSize)));
      const baseRow = Math.min(gridRows - 1, Math.max(0, Math.floor(y[i] / cellSize)));
      let alignX = 0;
      let alignY = 0;
      let cohesionX = 0;
      let cohesionY = 0;
      let separationX = 0;
      let separationY = 0;
      let neighbors = 0;
      let closeNeighbors = 0;

      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        let row = baseRow + rowOffset;
        if (state.boundary === 'wrap') row = (row + gridRows) % gridRows;
        if (row < 0 || row >= gridRows) continue;

        for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
          let col = baseCol + colOffset;
          if (state.boundary === 'wrap') col = (col + gridCols) % gridCols;
          if (col < 0 || col >= gridCols) continue;

          let neighbor = gridHead[row * gridCols + col];
          while (neighbor !== -1) {
            if (neighbor !== i) {
              let dx = x[neighbor] - x[i];
              let dy = y[neighbor] - y[i];
              if (state.boundary === 'wrap') {
                if (dx > width * 0.5) dx -= width;
                else if (dx < -width * 0.5) dx += width;
                if (dy > height * 0.5) dy -= height;
                else if (dy < -height * 0.5) dy += height;
              }
              const distanceSq = dx * dx + dy * dy;
              if (distanceSq > 0 && distanceSq < perceptionSq) {
                alignX += vx[neighbor];
                alignY += vy[neighbor];
                cohesionX += dx;
                cohesionY += dy;
                neighbors += 1;

                if (distanceSq < separationSq) {
                  const inverse = 1 / Math.max(1, distanceSq);
                  separationX -= dx * inverse;
                  separationY -= dy * inverse;
                  closeNeighbors += 1;
                }
              }
            }
            neighbor = next[neighbor];
          }
        }
      }

      let accelerationX = 0;
      let accelerationY = 0;

      if (neighbors > 0) {
        calculateSteer(i, x[i] + alignX / neighbors, y[i] + alignY / neighbors, state.alignment, maxForce);
        accelerationX += steerResultX;
        accelerationY += steerResultY;
        calculateSteer(i, x[i] + cohesionX / neighbors, y[i] + cohesionY / neighbors, state.cohesion, maxForce);
        accelerationX += steerResultX;
        accelerationY += steerResultY;
      }

      if (closeNeighbors > 0) {
        calculateSteer(i, x[i] + separationX / closeNeighbors, y[i] + separationY / closeNeighbors, state.separation, maxForce * 1.25);
        accelerationX += steerResultX;
        accelerationY += steerResultY;
      }

      if (pointer.active && state.tool !== 'obstacle') {
        const dx = pointer.x - x[i];
        const dy = pointer.y - y[i];
        const distanceSq = dx * dx + dy * dy;
        const radius = state.tool === 'attract' ? 260 : 190;
        if (distanceSq < radius * radius) {
          const direction = state.tool === 'attract' ? 1 : -1;
          const influence = (1 - Math.sqrt(distanceSq) / radius) * direction;
          accelerationX += dx * 0.00075 * influence * dt;
          accelerationY += dy * 0.00075 * influence * dt;
        }
      }

      for (let obstacleIndex = 0; obstacleIndex < obstacles.length; obstacleIndex += 1) {
        const obstacle = obstacles[obstacleIndex];
        const dx = x[i] - obstacle.x;
        const dy = y[i] - obstacle.y;
        const safeRadius = obstacle.radius + state.perception * 0.55;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < safeRadius * safeRadius) {
          const distance = Math.sqrt(distanceSq) || 1;
          const influence = 1 - distance / safeRadius;
          accelerationX += (dx / distance) * maxForce * 4.8 * influence;
          accelerationY += (dy / distance) * maxForce * 4.8 * influence;
        }
      }

      vx[i] += accelerationX;
      vy[i] += accelerationY;

      const currentSpeed = Math.hypot(vx[i], vy[i]) || 1;
      const minSpeed = state.speed * 0.36;
      if (currentSpeed > state.speed) {
        vx[i] = (vx[i] / currentSpeed) * state.speed;
        vy[i] = (vy[i] / currentSpeed) * state.speed;
      } else if (currentSpeed < minSpeed) {
        vx[i] = (vx[i] / currentSpeed) * minSpeed;
        vy[i] = (vy[i] / currentSpeed) * minSpeed;
      }

      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;

      if (state.boundary === 'wrap') {
        if (x[i] < -5) x[i] = width + 5;
        else if (x[i] > width + 5) x[i] = -5;
        if (y[i] < -5) y[i] = height + 5;
        else if (y[i] > height + 5) y[i] = -5;
      } else {
        const margin = 18;
        const edgeForce = maxForce * 5;
        if (x[i] < margin) vx[i] += edgeForce;
        else if (x[i] > width - margin) vx[i] -= edgeForce;
        if (y[i] < margin) vy[i] += edgeForce;
        else if (y[i] > height - margin) vy[i] -= edgeForce;
        x[i] = Math.min(width, Math.max(0, x[i]));
        y[i] = Math.min(height, Math.max(0, y[i]));
      }

      const normalizedSpeed = Math.hypot(vx[i], vy[i]) || 1;
      meanVx += vx[i] / normalizedSpeed;
      meanVy += vy[i] / normalizedSpeed;
      meanSpeed += normalizedSpeed;
    }

    const directionalOrder = Math.hypot(meanVx, meanVy) / state.count;
    const speedOrder = Math.min(1, meanSpeed / state.count / Math.max(0.1, state.speed));
    coherence = coherence * 0.94 + (directionalOrder * 0.76 + speedOrder * 0.24) * 100 * 0.06;
  }

  function drawBoidPath(start, step, color, scale = 1) {
    ctx.beginPath();
    for (let i = start; i < state.count; i += step) {
      const speed = Math.hypot(vx[i], vy[i]) || 1;
      const nx = vx[i] / speed;
      const ny = vy[i] / speed;
      const length = (5.3 + Math.min(2.4, speed * 0.4)) * scale;
      const halfWidth = 2.15 * scale;
      const px = -ny;
      const py = nx;
      ctx.moveTo(x[i] + nx * length, y[i] + ny * length);
      ctx.lineTo(x[i] - nx * length * 0.58 + px * halfWidth, y[i] - ny * length * 0.58 + py * halfWidth);
      ctx.lineTo(x[i] - nx * length * 0.2, y[i] - ny * length * 0.2);
      ctx.lineTo(x[i] - nx * length * 0.58 - px * halfWidth, y[i] - ny * length * 0.58 - py * halfWidth);
      ctx.closePath();
    }
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawObstacles() {
    for (let i = 0; i < obstacles.length; i += 1) {
      const obstacle = obstacles[i];
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, TAU);
      ctx.fillStyle = 'rgba(242, 125, 104, 0.08)';
      ctx.fill();
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(242, 125, 104, 0.62)';
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y, 2, 0, TAU);
      ctx.fillStyle = '#f27d68';
      ctx.fill();
    }
  }

  function drawPointerField() {
    if (!pointer.inside || state.tool === 'obstacle') return;
    const radius = state.tool === 'attract' ? 34 : 42;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, radius, 0, TAU);
    ctx.setLineDash([3, 6]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = state.tool === 'attract' ? 'rgba(147, 224, 188, 0.55)' : 'rgba(242, 188, 84, 0.62)';
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, pointer.active ? 4 : 2, 0, TAU);
    ctx.fillStyle = state.tool === 'attract' ? '#93e0bc' : '#f2bc54';
    ctx.fill();
  }

  function render() {
    if (state.trails && !state.paused) {
      ctx.fillStyle = 'rgba(16, 23, 21, 0.25)';
    } else {
      ctx.fillStyle = '#101715';
    }
    ctx.fillRect(0, 0, width, height);

    drawObstacles();
    const visualScale = Math.min(1, Math.max(0.68, width / 720));
    drawBoidPath(0, 1, 'rgba(238, 242, 229, 0.83)', visualScale);
    drawBoidPath(3, 17, '#93e0bc', visualScale * 1.18);
    drawBoidPath(11, 37, '#f2bc54', visualScale * 1.12);
    drawPointerField();
  }

  function frame(time) {
    const elapsed = Math.min(32, time - lastTime);
    const dt = elapsed / 16.6667;
    lastTime = time;

    if (!state.paused) updateBoids(dt);
    render();

    fpsFrames += 1;
    if (time - fpsTime >= 500) {
      const fps = Math.round((fpsFrames * 1000) / (time - fpsTime));
      document.getElementById('metric-fps').textContent = Math.min(99, fps);
      document.getElementById('metric-coherence').textContent = Math.round(coherence);
      fpsFrames = 0;
      fpsTime = time;
    }
    animationId = requestAnimationFrame(frame);
  }

  function setPressed(group, value) {
    group.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.value === value));
    });
  }

  Object.entries(controls).forEach(([key, control]) => {
    if (key === 'trails') {
      control.addEventListener('change', () => {
        state.trails = control.checked;
      });
      return;
    }

    control.addEventListener('input', () => {
      const value = Number(control.value);
      if (key === 'count') setCount(value);
      else state[key] = value;
      outputs[key].textContent = formatters[key](value);
      updateRangeStyle(control);
      markCustom();
    });
  });

  document.getElementById('preset').addEventListener('change', (event) => {
    if (event.target.value === 'custom') return;
    setPreset(event.target.value);
  });

  document.getElementById('boundary-control').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-value]');
    if (!button) return;
    state.boundary = button.dataset.value;
    setPressed(event.currentTarget, state.boundary);
  });

  document.getElementById('tool-control').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-value]');
    if (!button) return;
    state.tool = button.dataset.value;
    setPressed(event.currentTarget, state.tool);
    const names = { attract: '引导力场', repel: '驱散力场', obstacle: '障碍布置' };
    document.getElementById('tool-indicator').textContent = names[state.tool];
    canvas.style.cursor = state.tool === 'obstacle' ? 'crosshair' : 'default';
  });

  document.getElementById('pause').addEventListener('click', () => {
    state.paused = !state.paused;
    document.getElementById('pause-label').textContent = state.paused ? '继续' : '暂停';
    document.getElementById('pause-icon').textContent = state.paused ? '▶' : 'Ⅱ';
    document.getElementById('pause').setAttribute('aria-pressed', String(state.paused));
    if (!state.paused) lastTime = performance.now();
  });

  document.getElementById('scatter').addEventListener('click', () => scatter(true));

  document.getElementById('clear-obstacles').addEventListener('click', () => {
    obstacles.length = 0;
    document.getElementById('obstacle-count').textContent = '0 个障碍';
  });

  document.getElementById('reset-settings').addEventListener('click', () => {
    state.count = 420;
    state.boundary = 'wrap';
    state.tool = 'attract';
    state.trails = true;
    setPreset('natural');
    document.getElementById('preset').value = 'natural';
    setCount(420);
    setPressed(document.getElementById('boundary-control'), state.boundary);
    setPressed(document.getElementById('tool-control'), state.tool);
    document.getElementById('tool-indicator').textContent = '引导力场';
    canvas.style.cursor = 'default';
  });

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  }

  canvas.addEventListener('pointerenter', (event) => {
    pointer.inside = true;
    pointerPosition(event);
  });

  canvas.addEventListener('pointermove', pointerPosition);

  canvas.addEventListener('pointerleave', () => {
    pointer.inside = false;
    pointer.active = false;
  });

  canvas.addEventListener('pointerdown', (event) => {
    pointerPosition(event);
    pointer.active = true;
    canvas.setPointerCapture(event.pointerId);
    if (state.tool === 'obstacle') {
      obstacles.push({ x: pointer.x, y: pointer.y, radius: 24 + Math.random() * 14 });
      if (obstacles.length > 16) obstacles.shift();
      document.getElementById('obstacle-count').textContent = `${obstacles.length} 个障碍`;
    }
  });

  canvas.addEventListener('pointerup', (event) => {
    pointer.active = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointercancel', () => {
    pointer.active = false;
  });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  syncAllControls();
  resize();
  initialized = true;
  scatter(true);
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(frame);
})();
