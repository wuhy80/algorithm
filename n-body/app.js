(function () {
  "use strict";

  const canvas = document.getElementById("space-canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const MAX_BODIES = 1000;
  const TAU = Math.PI * 2;
  const x = new Float64Array(MAX_BODIES);
  const y = new Float64Array(MAX_BODIES);
  const vx = new Float64Array(MAX_BODIES);
  const vy = new Float64Array(MAX_BODIES);
  const ax = new Float64Array(MAX_BODIES);
  const ay = new Float64Array(MAX_BODIES);
  const mass = new Float64Array(MAX_BODIES);
  const kind = new Uint8Array(MAX_BODIES);
  const hue = new Uint16Array(MAX_BODIES);

  const presets = {
    solar: { name: "原行星盘", count: 240, gravity: 14, dt: 0.12, softening: 4 },
    binary: { name: "双星系统", count: 180, gravity: 13, dt: 0.1, softening: 5 },
    collision: { name: "星系相遇", count: 360, gravity: 11, dt: 0.1, softening: 6 },
    cluster: { name: "球状星团", count: 300, gravity: 9, dt: 0.08, softening: 7 }
  };

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    count: 240,
    gravity: 14,
    dt: 0.12,
    softening: 4,
    preset: "solar",
    paused: false,
    trails: true,
    vectors: false,
    tool: "launch",
    elapsed: 0,
    pointer: { down: false, x: 0, y: 0, startX: 0, startY: 0 },
    stars: [],
    frameCounter: 0,
    fps: 60,
    fpsClock: performance.now()
  };

  const elements = {
    preset: document.getElementById("preset"),
    count: document.getElementById("body-count"),
    gravity: document.getElementById("gravity"),
    dt: document.getElementById("time-step"),
    softening: document.getElementById("softening"),
    trails: document.getElementById("trails"),
    vectors: document.getElementById("vectors"),
    pause: document.getElementById("pause"),
    pauseIcon: document.getElementById("pause-icon"),
    pauseLabel: document.getElementById("pause-label"),
    sceneName: document.getElementById("scene-name"),
    metricCount: document.getElementById("metric-count"),
    metricFps: document.getElementById("metric-fps"),
    metricPairs: document.getElementById("metric-pairs"),
    elapsed: document.getElementById("elapsed-time"),
    toolIndicator: document.getElementById("tool-indicator"),
    hint: document.getElementById("interaction-hint")
  };

  function rand(min, max) { return min + Math.random() * (max - min); }
  function normal() {
    const u = Math.max(Math.random(), 1e-7);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * Math.random());
  }

  function addBody(px, py, pvx, pvy, bodyMass, bodyKind, bodyHue) {
    if (state.count >= MAX_BODIES) return;
    const i = state.count++;
    x[i] = px; y[i] = py; vx[i] = pvx; vy[i] = pvy;
    mass[i] = bodyMass; kind[i] = bodyKind; hue[i] = bodyHue;
  }

  function setBody(i, px, py, pvx, pvy, bodyMass, bodyKind, bodyHue) {
    x[i] = px; y[i] = py; vx[i] = pvx; vy[i] = pvy;
    mass[i] = bodyMass; kind[i] = bodyKind; hue[i] = bodyHue;
  }

  function orbitalBody(i, cx, cy, centralMass, minR, maxR, direction, tone, driftX, driftY) {
    const angle = Math.random() * TAU;
    const radius = minR + Math.pow(Math.random(), 0.62) * (maxR - minR);
    const jitter = normal() * Math.min(5, radius * 0.025);
    const px = cx + Math.cos(angle) * radius + normal() * 2;
    const py = cy + Math.sin(angle) * (radius * 0.68) + normal() * 2;
    const speed = Math.sqrt(state.gravity * centralMass / Math.max(radius, 8)) * rand(0.91, 1.08);
    const bodyMass = rand(0.35, 2.2);
    setBody(i, px, py,
      driftX - Math.sin(angle) * speed * direction + jitter * 0.01,
      driftY + Math.cos(angle) * speed * direction + jitter * 0.01,
      bodyMass, 0, tone + Math.floor(rand(-12, 13)));
  }

  function buildScene() {
    const w = state.width;
    const h = state.height;
    const cx = w * 0.5;
    const cy = h * 0.54;
    const target = Number(elements.count.value);
    state.count = target;
    state.elapsed = 0;

    if (state.preset === "solar") {
      setBody(0, cx, cy, 0, 0, 1900, 2, 42);
      const maxR = Math.max(120, Math.min(w, h) * 0.43);
      for (let i = 1; i < target; i++) orbitalBody(i, cx, cy, 1900, 48, maxR, 1, i % 5 === 0 ? 192 : 39, 0, 0);
    } else if (state.preset === "binary") {
      const separation = Math.min(190, Math.min(w, h) * 0.3);
      const starMass = 1050;
      const starSpeed = Math.sqrt(state.gravity * starMass / (separation * 4));
      setBody(0, cx - separation * 0.5, cy, 0, -starSpeed, starMass, 2, 32);
      setBody(1, cx + separation * 0.5, cy, 0, starSpeed, starMass, 2, 202);
      const maxR = Math.max(separation, Math.min(w, h) * 0.44);
      for (let i = 2; i < target; i++) orbitalBody(i, cx, cy, starMass * 2, separation * 0.72, maxR, 1, i % 4 ? 202 : 32, 0, 0);
    } else if (state.preset === "collision") {
      const offset = Math.min(190, w * 0.2);
      const coreMass = 760;
      const drift = 2.25;
      setBody(0, cx - offset, cy - 48, drift, 0.35, coreMass, 2, 190);
      setBody(1, cx + offset, cy + 48, -drift, -0.35, coreMass, 2, 15);
      for (let i = 2; i < target; i++) {
        const left = i % 2 === 0;
        orbitalBody(i, cx + (left ? -offset : offset), cy + (left ? -48 : 48), coreMass,
          24, Math.min(150, Math.min(w, h) * 0.29), left ? 1 : -1,
          left ? 190 : 15, left ? drift : -drift, left ? 0.35 : -0.35);
      }
    } else {
      const radius = Math.min(w, h) * 0.34;
      for (let i = 0; i < target; i++) {
        const angle = Math.random() * TAU;
        const r = Math.sqrt(Math.random()) * radius;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r * 0.88;
        const spin = Math.sqrt(state.gravity * target * 3 / Math.max(r, 30)) * 0.47;
        setBody(i, px, py, -Math.sin(angle) * spin + normal() * 1.3,
          Math.cos(angle) * spin + normal() * 1.3, rand(1.5, 5.5), i < 4 ? 1 : 0,
          i % 7 === 0 ? 278 : (i % 3 === 0 ? 42 : 198));
      }
    }
    clearCanvas();
    updateMetrics();
  }

  function calculateAcceleration() {
    ax.fill(0, 0, state.count);
    ay.fill(0, 0, state.count);
    const soft2 = state.softening * state.softening;
    const G = state.gravity;
    for (let i = 0; i < state.count - 1; i++) {
      for (let j = i + 1; j < state.count; j++) {
        const dx = x[j] - x[i];
        const dy = y[j] - y[i];
        const d2 = dx * dx + dy * dy + soft2;
        const invD = 1 / Math.sqrt(d2);
        const scale = G * invD * invD * invD;
        ax[i] += dx * scale * mass[j];
        ay[i] += dy * scale * mass[j];
        ax[j] -= dx * scale * mass[i];
        ay[j] -= dy * scale * mass[i];
      }
    }

    if (state.tool === "probe" && state.pointer.down) {
      const probeMass = 1200;
      for (let i = 0; i < state.count; i++) {
        const dx = state.pointer.x - x[i];
        const dy = state.pointer.y - y[i];
        const d2 = dx * dx + dy * dy + 144;
        const invD = 1 / Math.sqrt(d2);
        const scale = G * probeMass * invD * invD * invD;
        ax[i] += dx * scale;
        ay[i] += dy * scale;
      }
    }
  }

  function step() {
    calculateAcceleration();
    const dt = state.dt;
    for (let i = 0; i < state.count; i++) {
      vx[i] += ax[i] * dt;
      vy[i] += ay[i] * dt;
      const speed2 = vx[i] * vx[i] + vy[i] * vy[i];
      if (speed2 > 6400) {
        const limit = 80 / Math.sqrt(speed2);
        vx[i] *= limit; vy[i] *= limit;
      }
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
    }
    state.elapsed += dt;
  }

  function bodyRadius(i) {
    if (kind[i] === 2) return Math.min(10, 4.2 + Math.log10(mass[i]) * 1.45);
    if (kind[i] === 1) return 2.2;
    return 0.75 + Math.min(1.2, Math.sqrt(mass[i]) * 0.36);
  }

  function clearCanvas() {
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.fillStyle = "#090a0d";
    ctx.fillRect(0, 0, state.width, state.height);
    drawStars(1);
  }

  function drawStars(alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    for (const star of state.stars) {
      ctx.fillStyle = star.color;
      ctx.fillRect(star.x, star.y, star.r, star.r);
    }
    ctx.restore();
  }

  function draw() {
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    if (state.trails && !state.paused) {
      ctx.fillStyle = "rgba(9, 10, 13, 0.115)";
      ctx.fillRect(0, 0, state.width, state.height);
      drawStars(0.12);
    } else {
      clearCanvas();
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < state.count; i++) {
      if (x[i] < -40 || x[i] > state.width + 40 || y[i] < -40 || y[i] > state.height + 40) continue;
      const radius = bodyRadius(i);
      const color = `hsl(${hue[i]} 74% ${kind[i] === 2 ? 67 : 72}%)`;
      if (kind[i] === 2) {
        ctx.fillStyle = `hsla(${hue[i]} 82% 60% / .12)`;
        ctx.beginPath(); ctx.arc(x[i], y[i], radius * 3.1, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x[i], y[i], radius, 0, TAU); ctx.fill();
    }
    ctx.restore();

    if (state.vectors) {
      ctx.strokeStyle = "rgba(114, 217, 220, .34)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      const stride = Math.max(1, Math.ceil(state.count / 180));
      for (let i = 0; i < state.count; i += stride) {
        ctx.moveTo(x[i], y[i]); ctx.lineTo(x[i] + vx[i] * 1.9, y[i] + vy[i] * 1.9);
      }
      ctx.stroke();
    }

    if (state.pointer.down) drawPointerInteraction();
  }

  function drawPointerInteraction() {
    const p = state.pointer;
    ctx.save();
    if (state.tool === "launch") {
      ctx.strokeStyle = "rgba(239, 189, 88, .9)";
      ctx.fillStyle = "#efbd58";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(p.startX, p.startY); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(p.startX, p.startY, 5, 0, TAU); ctx.fill();
    } else {
      const pulse = 16 + Math.sin(performance.now() * 0.008) * 4;
      ctx.strokeStyle = "rgba(239, 121, 102, .75)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, pulse, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, TAU); ctx.fillStyle = "#ef7966"; ctx.fill();
    }
    ctx.restore();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const oldW = state.width || rect.width;
    const oldH = state.height || rect.height;
    state.width = Math.max(1, rect.width);
    state.height = Math.max(1, rect.height);
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    if (state.count && (Math.abs(oldW - state.width) > 2 || Math.abs(oldH - state.height) > 2)) {
      const sx = state.width / oldW;
      const sy = state.height / oldH;
      for (let i = 0; i < state.count; i++) { x[i] *= sx; y[i] *= sy; vx[i] *= sx; vy[i] *= sy; }
    }
    state.stars = Array.from({ length: Math.min(220, Math.floor(state.width * state.height / 6500)) }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      r: Math.random() < 0.12 ? 1.2 : 0.65,
      color: Math.random() < 0.2 ? "rgba(114,217,220,.42)" : "rgba(246,243,235,.36)"
    }));
    clearCanvas();
  }

  function updateMetrics() {
    elements.metricCount.textContent = state.count;
    elements.metricPairs.textContent = (state.count * (state.count - 1) / 2000).toFixed(1);
    elements.elapsed.textContent = `T + ${state.elapsed.toFixed(1)}`;
  }

  function animate(now) {
    if (!state.paused) step();
    draw();
    state.frameCounter++;
    if (now - state.fpsClock >= 500) {
      state.fps = Math.round(state.frameCounter * 1000 / (now - state.fpsClock));
      state.frameCounter = 0;
      state.fpsClock = now;
      elements.metricFps.textContent = Math.min(99, state.fps);
      updateMetrics();
    }
    requestAnimationFrame(animate);
  }

  function updateRange(input, output, formatter) {
    const min = Number(input.min); const max = Number(input.max); const value = Number(input.value);
    input.style.setProperty("--range-progress", `${(value - min) / (max - min) * 100}%`);
    output.textContent = formatter(value);
  }

  function applyPreset(name) {
    const preset = presets[name];
    state.preset = name;
    elements.preset.value = name;
    elements.count.value = preset.count;
    elements.gravity.value = preset.gravity;
    elements.dt.value = preset.dt;
    elements.softening.value = preset.softening;
    syncControls();
    elements.sceneName.textContent = preset.name;
    buildScene();
  }

  function syncControls() {
    state.gravity = Number(elements.gravity.value);
    state.dt = Number(elements.dt.value);
    state.softening = Number(elements.softening.value);
    updateRange(elements.count, document.getElementById("body-count-value"), value => String(value));
    updateRange(elements.gravity, document.getElementById("gravity-value"), value => value.toFixed(1));
    updateRange(elements.dt, document.getElementById("time-step-value"), value => value.toFixed(2));
    updateRange(elements.softening, document.getElementById("softening-value"), value => `${value} px`);
  }

  elements.preset.addEventListener("change", () => applyPreset(elements.preset.value));
  elements.count.addEventListener("input", () => updateRange(elements.count, document.getElementById("body-count-value"), String));
  elements.count.addEventListener("change", buildScene);
  [elements.gravity, elements.dt, elements.softening].forEach(input => input.addEventListener("input", syncControls));
  elements.trails.addEventListener("change", () => { state.trails = elements.trails.checked; clearCanvas(); });
  elements.vectors.addEventListener("change", () => { state.vectors = elements.vectors.checked; });
  document.getElementById("restart").addEventListener("click", buildScene);
  document.getElementById("reset-settings").addEventListener("click", () => applyPreset(state.preset));
  elements.pause.addEventListener("click", () => {
    state.paused = !state.paused;
    elements.pauseIcon.textContent = state.paused ? "▶" : "Ⅱ";
    elements.pauseLabel.textContent = state.paused ? "继续" : "暂停";
    elements.pause.setAttribute("aria-pressed", String(state.paused));
  });

  document.getElementById("tool-control").addEventListener("click", event => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    state.tool = button.dataset.value;
    document.querySelectorAll("#tool-control button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    elements.toolIndicator.textContent = state.tool === "launch" ? "发射模式" : "引力探针";
    elements.hint.textContent = state.tool === "launch" ? "在画布拖拽，方向与长度决定新天体速度" : "在画布按住指针，临时施加一个强引力源";
  });

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  canvas.addEventListener("pointerdown", event => {
    const p = pointerPosition(event);
    state.pointer.down = true;
    state.pointer.x = state.pointer.startX = p.x;
    state.pointer.y = state.pointer.startY = p.y;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", event => {
    const p = pointerPosition(event);
    state.pointer.x = p.x; state.pointer.y = p.y;
  });
  function endPointer(event) {
    if (!state.pointer.down) return;
    const p = pointerPosition(event);
    if (state.tool === "launch") {
      const dx = p.x - state.pointer.startX;
      const dy = p.y - state.pointer.startY;
      addBody(state.pointer.startX, state.pointer.startY, dx * 0.09, dy * 0.09, 8, 1, 48);
      elements.count.value = Math.min(Number(elements.count.max), state.count);
      updateMetrics();
    }
    state.pointer.down = false;
  }
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", () => { state.pointer.down = false; });

  window.addEventListener("resize", resize, { passive: true });
  resize();
  applyPreset("solar");
  requestAnimationFrame(animate);
})();
