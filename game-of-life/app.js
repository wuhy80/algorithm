(() => {
  "use strict";

  const canvas = document.getElementById("simulation");
  const context = canvas.getContext("2d", { alpha: false });
  const pixelCanvas = document.createElement("canvas");
  const pixelContext = pixelCanvas.getContext("2d", { alpha: false });

  const patternRows = {
    glider: [".O.", "..O", "OOO"],
    pulsar: [
      "..OOO...OOO..",
      ".............",
      "O....O.O....O",
      "O....O.O....O",
      "O....O.O....O",
      "..OOO...OOO..",
      ".............",
      "..OOO...OOO..",
      "O....O.O....O",
      "O....O.O....O",
      "O....O.O....O",
      ".............",
      "..OOO...OOO.."
    ],
    gosper: [
      "........................O...........",
      "......................O.O...........",
      "............OO......OO............OO",
      "...........O...O....OO............OO",
      "OO........O.....O...OO..............",
      "OO........O...O.OO....O.O...........",
      "..........O.....O.......O...........",
      "...........O...O....................",
      "............OO......................"
    ],
    lwss: [".O..O", "O....", "O...O", "OOOO."],
    rpentomino: [".OO", "OO.", ".O."],
    acorn: [".O.....", "...O...", "OO..OOO"]
  };

  const patternNames = {
    random: "随机星云",
    glider: "滑翔机",
    pulsar: "脉冲星",
    gosper: "高斯帕滑翔机枪",
    lwss: "轻量级飞船",
    rpentomino: "R 五连块",
    acorn: "橡实",
    custom: "自定义画布"
  };

  const controls = {
    pattern: document.getElementById("pattern"),
    randomDensity: document.getElementById("random-density"),
    density: document.getElementById("density"),
    speed: document.getElementById("speed")
  };

  const outputs = {
    randomDensity: document.getElementById("random-density-value"),
    density: document.getElementById("density-value"),
    speed: document.getElementById("speed-value")
  };

  const metrics = {
    generation: document.getElementById("metric-generation"),
    alive: document.getElementById("metric-alive"),
    change: document.getElementById("metric-change"),
    fps: document.getElementById("metric-fps")
  };

  const patternName = document.getElementById("pattern-name");
  const runState = document.getElementById("run-state");
  const gridStatus = document.getElementById("grid-status");
  const toolStatus = document.getElementById("tool-status");
  const pauseButton = document.getElementById("pause");
  const pauseIcon = document.getElementById("pause-icon");
  const pauseLabel = document.getElementById("pause-label");

  let columns = 0;
  let rows = 0;
  let stride = 0;
  let cells = new Uint8Array(0);
  let nextCells = new Uint8Array(0);
  let ages = new Uint16Array(0);
  let nextAges = new Uint16Array(0);
  let pixels = null;
  let generation = 0;
  let aliveCount = 0;
  let changeRate = 0;
  let boundary = "wrap";
  let drawMode = "draw";
  let paused = false;
  let pointerDown = false;
  let lastPaintX = -1;
  let lastPaintY = -1;
  let dirty = true;
  let previousTime = performance.now();
  let accumulator = 0;
  let fpsStartedAt = previousTime;
  let fpsFrames = 0;
  let lastMetricAt = 0;
  let resizeTimer = 0;

  function numeric(control) {
    return Number(control.value);
  }

  function updateRangeProgress(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const progress = ((Number(input.value) - min) / (max - min)) * 100;
    input.style.setProperty("--progress", `${progress}%`);
  }

  function syncControls() {
    outputs.randomDensity.value = `${controls.randomDensity.value}%`;
    outputs.density.value = `${controls.density.value} 列`;
    outputs.speed.value = `${controls.speed.value} 代/秒`;
    [controls.randomDensity, controls.density, controls.speed].forEach(updateRangeProgress);
  }

  function markCustom() {
    controls.pattern.value = "custom";
    patternName.textContent = patternNames.custom;
  }

  function clearWorld(updatePattern = true) {
    cells.fill(0);
    nextCells.fill(0);
    ages.fill(0);
    nextAges.fill(0);
    generation = 0;
    aliveCount = 0;
    changeRate = 0;
    if (updatePattern) markCustom();
    dirty = true;
    updateMetrics(true);
  }

  function setCell(x, y, alive) {
    if (x < 0 || x >= columns || y < 0 || y >= rows) return;
    const index = (y + 1) * stride + x + 1;
    const nextValue = alive ? 1 : 0;
    if (cells[index] === nextValue) return;
    cells[index] = nextValue;
    ages[index] = nextValue;
    aliveCount += nextValue ? 1 : -1;
    dirty = true;
  }

  function loadRows(pattern) {
    clearWorld(false);
    const source = patternRows[pattern];
    if (!source) return;
    const sourceWidth = Math.max(...source.map((row) => row.length));
    const offsetX = Math.floor((columns - sourceWidth) / 2);
    const offsetY = Math.floor((rows - source.length) / 2);
    source.forEach((row, y) => {
      for (let x = 0; x < row.length; x += 1) {
        if (row[x] === "O") setCell(offsetX + x, offsetY + y, true);
      }
    });
    controls.pattern.value = pattern;
    patternName.textContent = patternNames[pattern];
    updateMetrics(true);
  }

  function randomize() {
    clearWorld(false);
    const probability = numeric(controls.randomDensity) / 100;
    for (let y = 1; y <= rows; y += 1) {
      const row = y * stride;
      for (let x = 1; x <= columns; x += 1) {
        if (Math.random() < probability) {
          cells[row + x] = 1;
          ages[row + x] = 1;
          aliveCount += 1;
        }
      }
    }
    controls.pattern.value = "random";
    patternName.textContent = patternNames.random;
    dirty = true;
    updateMetrics(true);
  }

  function resizeWorld() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    columns = numeric(controls.density);
    rows = Math.max(32, Math.round(columns * rect.height / rect.width));
    stride = columns + 2;
    const size = stride * (rows + 2);
    cells = new Uint8Array(size);
    nextCells = new Uint8Array(size);
    ages = new Uint16Array(size);
    nextAges = new Uint16Array(size);
    pixelCanvas.width = columns;
    pixelCanvas.height = rows;
    pixels = pixelContext.createImageData(columns, rows);
    context.imageSmoothingEnabled = false;
    gridStatus.textContent = `${columns} × ${rows} CELLS`;

    const selected = controls.pattern.value;
    if (patternRows[selected]) loadRows(selected);
    else randomize();
    render();
  }

  function prepareBoundary() {
    const top = 0;
    const first = stride;
    const last = rows * stride;
    const bottom = (rows + 1) * stride;

    if (boundary === "wrap") {
      for (let x = 1; x <= columns; x += 1) {
        cells[top + x] = cells[last + x];
        cells[bottom + x] = cells[first + x];
      }
      for (let y = 1; y <= rows; y += 1) {
        const row = y * stride;
        cells[row] = cells[row + columns];
        cells[row + columns + 1] = cells[row + 1];
      }
      cells[top] = cells[last + columns];
      cells[top + columns + 1] = cells[last + 1];
      cells[bottom] = cells[first + columns];
      cells[bottom + columns + 1] = cells[first + 1];
    } else {
      cells.fill(0, top, first);
      cells.fill(0, bottom, bottom + stride);
      for (let y = 1; y <= rows; y += 1) {
        const row = y * stride;
        cells[row] = 0;
        cells[row + columns + 1] = 0;
      }
    }
  }

  function evolve() {
    prepareBoundary();
    let nextAlive = 0;
    let changed = 0;

    for (let y = 1; y <= rows; y += 1) {
      const row = y * stride;
      for (let x = 1; x <= columns; x += 1) {
        const index = row + x;
        const neighbors =
          cells[index - stride - 1] + cells[index - stride] + cells[index - stride + 1] +
          cells[index - 1] + cells[index + 1] +
          cells[index + stride - 1] + cells[index + stride] + cells[index + stride + 1];
        const current = cells[index];
        const alive = neighbors === 3 || (current === 1 && neighbors === 2) ? 1 : 0;
        nextCells[index] = alive;
        nextAges[index] = alive ? (current ? Math.min(65535, ages[index] + 1) : 1) : 0;
        nextAlive += alive;
        changed += alive !== current ? 1 : 0;
      }
    }

    let swap = cells;
    cells = nextCells;
    nextCells = swap;
    swap = ages;
    ages = nextAges;
    nextAges = swap;
    aliveCount = nextAlive;
    changeRate = changed / (columns * rows) * 100;
    generation += 1;
    dirty = true;
  }

  function render() {
    if (!pixels) return;
    const data = pixels.data;
    let pixel = 0;
    for (let y = 1; y <= rows; y += 1) {
      const row = y * stride;
      for (let x = 1; x <= columns; x += 1) {
        const index = row + x;
        const age = ages[index];
        if (cells[index] === 0) {
          data[pixel] = 14;
          data[pixel + 1] = 22;
          data[pixel + 2] = 23;
        } else if (age <= 2) {
          data[pixel] = 115;
          data[pixel + 1] = 219;
          data[pixel + 2] = 197;
        } else if (age <= 7) {
          data[pixel] = 239;
          data[pixel + 1] = 198;
          data[pixel + 2] = 95;
        } else {
          data[pixel] = 239;
          data[pixel + 1] = 121;
          data[pixel + 2] = 106;
        }
        data[pixel + 3] = 255;
        pixel += 4;
      }
    }
    pixelContext.putImageData(pixels, 0, 0);
    context.drawImage(pixelCanvas, 0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / columns;
    const cellHeight = canvas.height / rows;
    if (Math.min(cellWidth, cellHeight) >= 5) {
      context.beginPath();
      context.strokeStyle = "rgba(210, 232, 225, 0.10)";
      context.lineWidth = 1;
      for (let x = 1; x < columns; x += 1) {
        const px = Math.round(x * cellWidth) + 0.5;
        context.moveTo(px, 0);
        context.lineTo(px, canvas.height);
      }
      for (let y = 1; y < rows; y += 1) {
        const py = Math.round(y * cellHeight) + 0.5;
        context.moveTo(0, py);
        context.lineTo(canvas.width, py);
      }
      context.stroke();
    }
    dirty = false;
  }

  function updateMetrics(force = false, now = performance.now()) {
    if (!force && now - lastMetricAt < 180) return;
    metrics.generation.textContent = generation.toLocaleString("zh-CN");
    metrics.alive.textContent = aliveCount.toLocaleString("zh-CN");
    metrics.change.textContent = changeRate.toFixed(1);
    lastMetricAt = now;
  }

  function frame(now) {
    const delta = Math.min(100, now - previousTime);
    previousTime = now;
    if (!paused) {
      accumulator += delta;
      const interval = 1000 / numeric(controls.speed);
      let updates = 0;
      while (accumulator >= interval && updates < 8) {
        evolve();
        accumulator -= interval;
        updates += 1;
      }
      if (updates === 8) accumulator = 0;
    }
    if (dirty) render();
    updateMetrics(false, now);

    fpsFrames += 1;
    if (now - fpsStartedAt >= 500) {
      metrics.fps.textContent = String(Math.round(fpsFrames * 1000 / (now - fpsStartedAt)));
      fpsFrames = 0;
      fpsStartedAt = now;
    }
    requestAnimationFrame(frame);
  }

  function setPaused(value) {
    paused = value;
    pauseIcon.textContent = paused ? "▶" : "Ⅱ";
    pauseLabel.textContent = paused ? "继续" : "暂停";
    runState.textContent = paused ? "演化已暂停" : "自动演化";
    pauseButton.setAttribute("aria-pressed", String(paused));
    accumulator = 0;
  }

  function pointerCell(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((event.clientX - rect.left) / rect.width * columns),
      y: Math.floor((event.clientY - rect.top) / rect.height * rows)
    };
  }

  function paintLine(x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const steps = Math.max(dx, dy, 1);
    const alive = drawMode === "draw";
    for (let step = 0; step <= steps; step += 1) {
      const x = Math.round(x0 + (x1 - x0) * step / steps);
      const y = Math.round(y0 + (y1 - y0) * step / steps);
      setCell(x, y, alive);
    }
    markCustom();
    changeRate = 0;
    updateMetrics(true);
  }

  function paint(event) {
    const point = pointerCell(event);
    if (lastPaintX < 0) paintLine(point.x, point.y, point.x, point.y);
    else paintLine(lastPaintX, lastPaintY, point.x, point.y);
    lastPaintX = point.x;
    lastPaintY = point.y;
  }

  controls.pattern.addEventListener("change", () => {
    if (controls.pattern.value === "random") randomize();
    else if (patternRows[controls.pattern.value]) loadRows(controls.pattern.value);
  });
  controls.randomDensity.addEventListener("input", syncControls);
  controls.randomDensity.addEventListener("change", () => {
    if (controls.pattern.value === "random") randomize();
  });
  controls.density.addEventListener("input", syncControls);
  controls.density.addEventListener("change", resizeWorld);
  controls.speed.addEventListener("input", syncControls);

  document.getElementById("boundary-mode").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-boundary]");
    if (!button) return;
    boundary = button.dataset.boundary;
    document.querySelectorAll("#boundary-mode button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  });

  document.getElementById("draw-mode").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]");
    if (!button) return;
    drawMode = button.dataset.mode;
    document.querySelectorAll("#draw-mode button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    toolStatus.textContent = drawMode === "draw" ? "绘制细胞" : "擦除细胞";
  });

  document.getElementById("randomize").addEventListener("click", randomize);
  document.getElementById("clear").addEventListener("click", () => clearWorld(true));
  document.getElementById("center-pattern").addEventListener("click", () => {
    const selected = controls.pattern.value;
    if (patternRows[selected]) loadRows(selected);
    else loadRows("glider");
  });
  document.getElementById("step").addEventListener("click", () => {
    setPaused(true);
    evolve();
    render();
    updateMetrics(true);
  });
  pauseButton.addEventListener("click", () => setPaused(!paused));

  canvas.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    lastPaintX = -1;
    lastPaintY = -1;
    canvas.setPointerCapture(event.pointerId);
    paint(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (pointerDown) paint(event);
  });
  canvas.addEventListener("pointerup", (event) => {
    pointerDown = false;
    lastPaintX = -1;
    lastPaintY = -1;
    canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointercancel", () => {
    pointerDown = false;
    lastPaintX = -1;
    lastPaintY = -1;
  });

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resizeWorld, 180);
  });

  syncControls();
  resizeWorld();
  requestAnimationFrame(frame);
})();
