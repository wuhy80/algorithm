(() => {
  "use strict";

  const canvas = document.getElementById("simulation");
  const context = canvas.getContext("2d", { alpha: false });
  const pixelCanvas = document.createElement("canvas");
  const pixelContext = pixelCanvas.getContext("2d", { alpha: false });

  const presets = {
    coral: { name: "珊瑚生长", feed: 0.0545, kill: 0.0620, diffA: 1.0, diffB: 0.5 },
    mitosis: { name: "细胞分裂", feed: 0.0367, kill: 0.0649, diffA: 1.0, diffB: 0.5 },
    worms: { name: "蠕虫网络", feed: 0.0780, kill: 0.0610, diffA: 1.0, diffB: 0.5 },
    solitons: { name: "孤立波", feed: 0.0300, kill: 0.0620, diffA: 1.0, diffB: 0.5 },
    maze: { name: "迷宫纹理", feed: 0.0290, kill: 0.0570, diffA: 1.0, diffB: 0.5 }
  };

  const controls = {
    preset: document.getElementById("preset"),
    feed: document.getElementById("feed"),
    kill: document.getElementById("kill"),
    diffA: document.getElementById("diff-a"),
    diffB: document.getElementById("diff-b"),
    iterations: document.getElementById("iterations"),
    resolution: document.getElementById("resolution"),
    brushSize: document.getElementById("brush-size")
  };

  const outputs = {
    feed: document.getElementById("feed-value"),
    kill: document.getElementById("kill-value"),
    diffA: document.getElementById("diff-a-value"),
    diffB: document.getElementById("diff-b-value"),
    iterations: document.getElementById("iterations-value"),
    resolution: document.getElementById("resolution-value"),
    brushSize: document.getElementById("brush-size-value")
  };

  const metricFps = document.getElementById("metric-fps");
  const metricGeneration = document.getElementById("metric-generation");
  const metricActivity = document.getElementById("metric-activity");
  const gridStatus = document.getElementById("grid-status");
  const brushStatus = document.getElementById("brush-status");
  const patternName = document.getElementById("pattern-name");
  const runState = document.getElementById("run-state");
  const pauseButton = document.getElementById("pause");
  const pauseIcon = document.getElementById("pause-icon");
  const pauseLabel = document.getElementById("pause-label");

  let width = 0;
  let height = 0;
  let a = new Float32Array(0);
  let b = new Float32Array(0);
  let nextA = new Float32Array(0);
  let nextB = new Float32Array(0);
  let pixels = null;
  let generation = 0;
  let paused = false;
  let pointerDown = false;
  let brushMode = "add";
  let fpsFrames = 0;
  let fpsStartedAt = performance.now();
  let lastMetricAt = 0;
  let resizeTimer = 0;
  const paletteLut = createPalette();

  function number(control) {
    return Number(control.value);
  }

  function updateRangeProgress(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const progress = ((Number(input.value) - min) / (max - min)) * 100;
    input.style.setProperty("--progress", `${progress}%`);
  }

  function syncOutputs() {
    outputs.feed.value = number(controls.feed).toFixed(4);
    outputs.kill.value = number(controls.kill).toFixed(4);
    outputs.diffA.value = number(controls.diffA).toFixed(2);
    outputs.diffB.value = number(controls.diffB).toFixed(2);
    outputs.iterations.value = `${controls.iterations.value} 次`;
    outputs.resolution.value = controls.resolution.value;
    outputs.brushSize.value = `${controls.brushSize.value} px`;
    Object.values(controls).forEach((control) => {
      if (control.type === "range") updateRangeProgress(control);
    });
  }

  function markCustom() {
    controls.preset.value = "custom";
    patternName.textContent = "自定义形态";
  }

  function setCell(cx, cy, radius, mode) {
    const radiusSquared = radius * radius;
    const x0 = Math.floor(cx - radius);
    const x1 = Math.ceil(cx + radius);
    const y0 = Math.floor(cy - radius);
    const y1 = Math.ceil(cy + radius);

    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy > radiusSquared) continue;
        const wrappedX = (x + width) % width;
        const wrappedY = (y + height) % height;
        const index = wrappedY * width + wrappedX;
        if (mode === "add") {
          const falloff = 1 - Math.sqrt(dx * dx + dy * dy) / radius;
          a[index] = Math.max(0.18, 0.52 - falloff * 0.18);
          b[index] = Math.min(1, 0.72 + falloff * 0.28);
        } else {
          a[index] = 1;
          b[index] = 0;
        }
      }
    }
  }

  function seedPattern() {
    a.fill(1);
    b.fill(0);
    nextA.fill(1);
    nextB.fill(0);

    const baseRadius = Math.max(3, Math.round(width * 0.018));
    const centerX = width * 0.5;
    const centerY = height * 0.52;
    setCell(centerX, centerY, baseRadius * 1.8, "add");

    const seedCount = Math.max(10, Math.round(width / 13));
    for (let i = 0; i < seedCount; i += 1) {
      const angle = (i / seedCount) * Math.PI * 2 + Math.random() * 0.22;
      const distance = Math.min(width, height) * (0.14 + Math.random() * 0.22);
      setCell(
        centerX + Math.cos(angle) * distance,
        centerY + Math.sin(angle) * distance,
        baseRadius * (0.6 + Math.random() * 0.65),
        "add"
      );
    }

    generation = 0;
    metricGeneration.textContent = "0";
  }

  function resizeSimulation() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    width = number(controls.resolution);
    height = Math.max(64, Math.round(width * rect.height / rect.width));
    const size = width * height;
    a = new Float32Array(size);
    b = new Float32Array(size);
    nextA = new Float32Array(size);
    nextB = new Float32Array(size);
    pixelCanvas.width = width;
    pixelCanvas.height = height;
    pixels = pixelContext.createImageData(width, height);
    context.imageSmoothingEnabled = true;
    gridStatus.textContent = `${width} × ${height} CELLS`;
    seedPattern();
    render();
  }

  function evolve() {
    const feed = number(controls.feed);
    const kill = number(controls.kill);
    const diffA = number(controls.diffA);
    const diffB = number(controls.diffB);

    for (let y = 0; y < height; y += 1) {
      const row = y * width;
      const rowUp = (y === 0 ? height - 1 : y - 1) * width;
      const rowDown = (y === height - 1 ? 0 : y + 1) * width;

      for (let x = 0; x < width; x += 1) {
        const left = x === 0 ? width - 1 : x - 1;
        const right = x === width - 1 ? 0 : x + 1;
        const index = row + x;
        const av = a[index];
        const bv = b[index];
        const lapA =
          -av +
          0.2 * (a[row + left] + a[row + right] + a[rowUp + x] + a[rowDown + x]) +
          0.05 * (a[rowUp + left] + a[rowUp + right] + a[rowDown + left] + a[rowDown + right]);
        const lapB =
          -bv +
          0.2 * (b[row + left] + b[row + right] + b[rowUp + x] + b[rowDown + x]) +
          0.05 * (b[rowUp + left] + b[rowUp + right] + b[rowDown + left] + b[rowDown + right]);
        const reaction = av * bv * bv;
        const updatedA = av + diffA * lapA - reaction + feed * (1 - av);
        const updatedB = bv + diffB * lapB + reaction - (kill + feed) * bv;
        nextA[index] = updatedA < 0 ? 0 : updatedA > 1 ? 1 : updatedA;
        nextB[index] = updatedB < 0 ? 0 : updatedB > 1 ? 1 : updatedB;
      }
    }

    let swap = a;
    a = nextA;
    nextA = swap;
    swap = b;
    b = nextB;
    nextB = swap;
    generation += 1;
  }

  function createPalette() {
    const table = new Uint8ClampedArray(256 * 3);
    for (let index = 0; index < 256; index += 1) {
      const t = index / 255;
      let r;
      let g;
      let blue;
      if (t < 0.34) {
        const p = t / 0.34;
        r = 14 + p * 17;
        g = 22 + p * 48;
        blue = 23 + p * 50;
      } else if (t < 0.68) {
        const p = (t - 0.34) / 0.34;
        r = 31 + p * 92;
        g = 70 + p * 151;
        blue = 73 + p * 130;
      } else if (t < 0.86) {
        const p = (t - 0.68) / 0.18;
        r = 123 + p * 120;
        g = 221 - p * 24;
        blue = 203 - p * 111;
      } else {
        const p = (t - 0.86) / 0.14;
        r = 243 - p * 2;
        g = 197 - p * 74;
        blue = 92 + p * 15;
      }
      const offset = index * 3;
      table[offset] = r;
      table[offset + 1] = g;
      table[offset + 2] = blue;
    }
    return table;
  }

  function render() {
    if (!pixels) return;
    const data = pixels.data;
    for (let i = 0; i < a.length; i += 1) {
      const contrast = (b[i] - a[i] + 1) * 1.18;
      const t = Math.max(0, Math.min(1, contrast));
      const paletteIndex = Math.round(t * t * (3 - 2 * t) * 255) * 3;
      const pixelIndex = i * 4;
      data[pixelIndex] = paletteLut[paletteIndex];
      data[pixelIndex + 1] = paletteLut[paletteIndex + 1];
      data[pixelIndex + 2] = paletteLut[paletteIndex + 2];
      data[pixelIndex + 3] = 255;
    }
    pixelContext.putImageData(pixels, 0, 0);
    context.drawImage(pixelCanvas, 0, 0, canvas.width, canvas.height);
  }

  function activityPercent() {
    if (!b.length) return 0;
    const stride = Math.max(1, Math.floor(b.length / 3500));
    let active = 0;
    let samples = 0;
    for (let i = 0; i < b.length; i += stride) {
      if (b[i] > 0.08) active += 1;
      samples += 1;
    }
    return active / samples * 100;
  }

  function frame(now) {
    if (!paused) {
      const iterations = number(controls.iterations);
      for (let i = 0; i < iterations; i += 1) evolve();
      render();
    }

    fpsFrames += 1;
    if (now - fpsStartedAt >= 500) {
      const fps = Math.round(fpsFrames * 1000 / (now - fpsStartedAt));
      metricFps.textContent = String(fps);
      fpsFrames = 0;
      fpsStartedAt = now;
    }
    if (now - lastMetricAt >= 250) {
      metricGeneration.textContent = generation.toLocaleString("zh-CN");
      metricActivity.textContent = activityPercent().toFixed(1);
      lastMetricAt = now;
    }
    requestAnimationFrame(frame);
  }

  function paintFromPointer(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * width;
    const y = (event.clientY - rect.top) / rect.height * height;
    const brush = number(controls.brushSize) * width / 180;
    setCell(x, y, brush, brushMode);
    if (paused) render();
  }

  controls.preset.addEventListener("change", () => {
    const preset = presets[controls.preset.value];
    if (!preset) return;
    controls.feed.value = preset.feed;
    controls.kill.value = preset.kill;
    controls.diffA.value = preset.diffA;
    controls.diffB.value = preset.diffB;
    patternName.textContent = preset.name;
    syncOutputs();
    seedPattern();
  });

  [controls.feed, controls.kill, controls.diffA, controls.diffB].forEach((control) => {
    control.addEventListener("input", () => {
      markCustom();
      syncOutputs();
    });
  });

  [controls.iterations, controls.brushSize].forEach((control) => {
    control.addEventListener("input", syncOutputs);
  });

  controls.resolution.addEventListener("input", syncOutputs);
  controls.resolution.addEventListener("change", resizeSimulation);

  document.getElementById("brush-mode").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]");
    if (!button) return;
    brushMode = button.dataset.mode;
    document.querySelectorAll("#brush-mode button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    brushStatus.textContent = brushMode === "add" ? "注入物质 B" : "清除纹理";
  });

  document.getElementById("reset").addEventListener("click", () => {
    seedPattern();
    render();
  });

  pauseButton.addEventListener("click", () => {
    paused = !paused;
    pauseIcon.textContent = paused ? "▶" : "Ⅱ";
    pauseLabel.textContent = paused ? "继续" : "暂停";
    runState.textContent = paused ? "演化已暂停" : "持续演化";
    pauseButton.setAttribute("aria-pressed", String(paused));
  });

  canvas.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    canvas.setPointerCapture(event.pointerId);
    paintFromPointer(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (pointerDown) paintFromPointer(event);
  });
  canvas.addEventListener("pointerup", (event) => {
    pointerDown = false;
    canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointercancel", () => { pointerDown = false; });

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resizeSimulation, 180);
  });

  syncOutputs();
  resizeSimulation();
  requestAnimationFrame(frame);
})();
