(function () {
  "use strict";

  const canvas = document.getElementById("voronoi-canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const MAX_SITES = 240;
  const x = new Float64Array(MAX_SITES);
  const y = new Float64Array(MAX_SITES);
  const fromX = new Float64Array(MAX_SITES);
  const fromY = new Float64Array(MAX_SITES);
  const toX = new Float64Array(MAX_SITES);
  const toY = new Float64Array(MAX_SITES);
  const colorIndex = new Uint8Array(MAX_SITES);
  const palette = [
    [231, 185, 80], [112, 211, 181], [104, 169, 214],
    [232, 118, 101], [171, 151, 218], [117, 190, 145]
  ];
  const presetNames = { random: "随机散布", clusters: "聚类分布", ring: "环形分布", bands: "带状分布" };

  const state = {
    width: 0, height: 0, dpr: 1, count: 90,
    preset: "random", strength: 0.65, speed: 1,
    auto: true, paused: false, showSites: true, showCentroids: false, filled: true,
    tool: "move", cells: [], centroids: [], energy: 0, displacement: 0,
    iteration: 0, moving: false, moveStart: 0, moveDuration: 900, nextStepAt: 0,
    pauseAt: 0, dirty: true, lastDiagramAt: 0,
    pointer: { down: false, x: 0, y: 0, site: -1 },
    hoverSite: -1, fps: 60, frames: 0, fpsAt: performance.now()
  };

  const elements = {
    preset: document.getElementById("preset"), count: document.getElementById("site-count"),
    strength: document.getElementById("strength"), speed: document.getElementById("speed"),
    auto: document.getElementById("auto-relax"), sites: document.getElementById("show-sites"),
    centroids: document.getElementById("show-centroids"), filled: document.getElementById("filled-cells"),
    sceneName: document.getElementById("scene-name"), energy: document.getElementById("metric-energy"),
    displacement: document.getElementById("metric-displacement"), iteration: document.getElementById("metric-iteration"),
    fps: document.getElementById("metric-fps"), siteStatus: document.getElementById("site-status"),
    pause: document.getElementById("pause"), pauseIcon: document.getElementById("pause-icon"),
    pauseLabel: document.getElementById("pause-label"), hint: document.getElementById("interaction-hint"),
    toolIndicator: document.getElementById("tool-indicator")
  };

  function random(min, max) { return min + Math.random() * (max - min); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function clipPolygon(polygon, nx, ny, limit) {
    if (polygon.length === 0) return polygon;
    const result = [];
    let previous = polygon[polygon.length - 1];
    let previousValue = previous.x * nx + previous.y * ny - limit;
    let previousInside = previousValue <= 1e-7;
    for (let i = 0; i < polygon.length; i++) {
      const current = polygon[i];
      const currentValue = current.x * nx + current.y * ny - limit;
      const currentInside = currentValue <= 1e-7;
      if (currentInside !== previousInside) {
        const t = previousValue / (previousValue - currentValue);
        result.push({ x: previous.x + (current.x - previous.x) * t, y: previous.y + (current.y - previous.y) * t });
      }
      if (currentInside) result.push(current);
      previous = current;
      previousValue = currentValue;
      previousInside = currentInside;
    }
    return result;
  }

  function polygonMetrics(polygon, siteX, siteY) {
    let crossSum = 0;
    let cxSum = 0;
    let cySum = 0;
    let x2Sum = 0;
    let y2Sum = 0;
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const cross = a.x * b.y - b.x * a.y;
      crossSum += cross;
      cxSum += (a.x + b.x) * cross;
      cySum += (a.y + b.y) * cross;
      x2Sum += (a.x * a.x + a.x * b.x + b.x * b.x) * cross;
      y2Sum += (a.y * a.y + a.y * b.y + b.y * b.y) * cross;
    }
    const area = crossSum * 0.5;
    if (Math.abs(area) < 1e-8) return { x: siteX, y: siteY, area: 0, energy: 0 };
    const cx = cxSum / (6 * area);
    const cy = cySum / (6 * area);
    const firstX = cx * area;
    const firstY = cy * area;
    const second = (x2Sum + y2Sum) / 12;
    const energy = second - 2 * siteX * firstX - 2 * siteY * firstY + (siteX * siteX + siteY * siteY) * area;
    return { x: cx, y: cy, area: Math.abs(area), energy: Math.abs(energy) };
  }

  function buildDiagram() {
    const cells = new Array(state.count);
    const centroids = new Array(state.count);
    let totalEnergy = 0;
    let totalDisplacement = 0;
    const w = state.width;
    const h = state.height;
    for (let i = 0; i < state.count; i++) {
      let polygon = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }];
      const neighbors = [];
      for (let j = 0; j < state.count; j++) {
        if (i !== j) neighbors.push(j);
      }
      neighbors.sort((a, b) => {
        const adx = x[a] - x[i]; const ady = y[a] - y[i];
        const bdx = x[b] - x[i]; const bdy = y[b] - y[i];
        return adx * adx + ady * ady - bdx * bdx - bdy * bdy;
      });
      for (let n = 0; n < neighbors.length && polygon.length; n++) {
        const j = neighbors[n];
        const nx = x[j] - x[i];
        const ny = y[j] - y[i];
        const limit = (x[j] * x[j] + y[j] * y[j] - x[i] * x[i] - y[i] * y[i]) * 0.5;
        polygon = clipPolygon(polygon, nx, ny, limit);
        if (n + 1 < neighbors.length && polygon.length) {
          let maxRadius2 = 0;
          for (let v = 0; v < polygon.length; v++) {
            const dx = polygon[v].x - x[i]; const dy = polygon[v].y - y[i];
            maxRadius2 = Math.max(maxRadius2, dx * dx + dy * dy);
          }
          const next = neighbors[n + 1];
          const nextDx = x[next] - x[i]; const nextDy = y[next] - y[i];
          if (nextDx * nextDx + nextDy * nextDy > maxRadius2 * 4 + 1e-7) break;
        }
      }
      const metrics = polygonMetrics(polygon, x[i], y[i]);
      const dx = metrics.x - x[i];
      const dy = metrics.y - y[i];
      cells[i] = polygon;
      centroids[i] = metrics;
      totalEnergy += metrics.energy;
      totalDisplacement += Math.sqrt(dx * dx + dy * dy);
    }
    state.cells = cells;
    state.centroids = centroids;
    state.energy = totalEnergy / Math.max(1, w * h);
    state.displacement = totalDisplacement / state.count;
    state.dirty = false;
    updateMetrics();
  }

  function distributeSites() {
    const w = state.width;
    const h = state.height;
    const margin = Math.min(55, Math.min(w, h) * 0.08);
    state.count = Number(elements.count.value);
    for (let i = 0; i < state.count; i++) {
      colorIndex[i] = i % palette.length;
      if (state.preset === "clusters") {
        const centers = [[0.27, 0.3], [0.7, 0.32], [0.48, 0.72]];
        const center = centers[i % centers.length];
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * Math.min(w, h) * 0.19;
        x[i] = clamp(center[0] * w + Math.cos(angle) * radius, margin, w - margin);
        y[i] = clamp(center[1] * h + Math.sin(angle) * radius, margin, h - margin);
      } else if (state.preset === "ring") {
        const angle = i / state.count * Math.PI * 2 + random(-0.05, 0.05);
        const radius = Math.min(w, h) * random(0.22, 0.39);
        x[i] = w * 0.5 + Math.cos(angle) * radius;
        y[i] = h * 0.52 + Math.sin(angle) * radius;
      } else if (state.preset === "bands") {
        const bands = 4;
        const band = i % bands;
        x[i] = random(margin, w - margin);
        y[i] = (band + 0.65) / (bands + 0.3) * h + random(-h * 0.045, h * 0.045);
      } else {
        x[i] = random(margin, w - margin);
        y[i] = random(margin, h - margin);
      }
    }
    state.iteration = 0;
    state.moving = false;
    state.nextStepAt = performance.now() + 300;
    state.dirty = true;
    buildDiagram();
  }

  function startRelaxation(now, forced) {
    if (state.moving || state.pointer.down || (!forced && (!state.auto || state.paused))) return;
    if (state.dirty) buildDiagram();
    const strength = state.strength;
    for (let i = 0; i < state.count; i++) {
      fromX[i] = x[i]; fromY[i] = y[i];
      toX[i] = x[i] + (state.centroids[i].x - x[i]) * strength;
      toY[i] = y[i] + (state.centroids[i].y - y[i]) * strength;
    }
    state.moveStart = now;
    state.moveDuration = 820 / state.speed;
    state.moving = true;
  }

  function updateMovement(now) {
    if (!state.moving || state.paused) return;
    const raw = clamp((now - state.moveStart) / state.moveDuration, 0, 1);
    const eased = raw * raw * (3 - 2 * raw);
    for (let i = 0; i < state.count; i++) {
      x[i] = fromX[i] + (toX[i] - fromX[i]) * eased;
      y[i] = fromY[i] + (toY[i] - fromY[i]) * eased;
    }
    state.dirty = true;
    if (raw >= 1) {
      state.moving = false;
      state.iteration++;
      state.nextStepAt = now + 120 / state.speed;
    }
  }

  function drawPolygon(polygon) {
    if (!polygon || !polygon.length) return false;
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (let i = 1; i < polygon.length; i++) ctx.lineTo(polygon[i].x, polygon[i].y);
    ctx.closePath();
    return true;
  }

  function draw() {
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.fillStyle = "#edece6";
    ctx.fillRect(0, 0, state.width, state.height);
    ctx.lineJoin = "round";

    for (let i = 0; i < state.count; i++) {
      const polygon = state.cells[i];
      if (!drawPolygon(polygon)) continue;
      const color = palette[colorIndex[i]];
      if (state.filled) {
        ctx.fillStyle = `rgb(${color[0]} ${color[1]} ${color[2]} / .72)`;
        ctx.fill();
      }
      ctx.strokeStyle = state.filled ? "rgba(255,255,250,.84)" : "rgba(28,32,31,.5)";
      ctx.lineWidth = state.filled ? 1.35 : 1;
      ctx.stroke();
    }

    if (state.showCentroids) {
      ctx.save();
      ctx.strokeStyle = "rgba(28,32,31,.48)";
      ctx.fillStyle = "rgba(255,255,250,.72)";
      ctx.setLineDash([3, 4]);
      for (let i = 0; i < state.count; i++) {
        const centroid = state.centroids[i];
        ctx.beginPath(); ctx.moveTo(x[i], y[i]); ctx.lineTo(centroid.x, centroid.y); ctx.stroke();
        ctx.beginPath(); ctx.arc(centroid.x, centroid.y, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }

    if (state.showSites) {
      for (let i = 0; i < state.count; i++) {
        const highlighted = i === state.pointer.site || i === state.hoverSite;
        ctx.fillStyle = highlighted ? "#ffffff" : "#17201e";
        ctx.strokeStyle = highlighted ? "#17201e" : "rgba(255,255,250,.92)";
        ctx.lineWidth = highlighted ? 2 : 1.5;
        ctx.beginPath(); ctx.arc(x[i], y[i], highlighted ? 5.5 : 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }
  }

  function updateMetrics() {
    elements.energy.textContent = state.energy < 1000 ? state.energy.toFixed(0) : `${(state.energy / 1000).toFixed(1)}K`;
    elements.displacement.textContent = state.displacement.toFixed(1);
    elements.iteration.textContent = state.iteration;
    elements.siteStatus.textContent = `${state.count} SITES`;
  }

  function animate(now) {
    updateMovement(now);
    if (!state.moving && now >= state.nextStepAt) startRelaxation(now, false);
    if (state.dirty && now - state.lastDiagramAt >= 45) {
      buildDiagram();
      state.lastDiagramAt = now;
    }
    draw();
    state.frames++;
    if (now - state.fpsAt >= 500) {
      state.fps = Math.round(state.frames * 1000 / (now - state.fpsAt));
      state.frames = 0; state.fpsAt = now;
      elements.fps.textContent = Math.min(99, state.fps);
    }
    requestAnimationFrame(animate);
  }

  function updateRange(input, output, formatter) {
    const min = Number(input.min); const max = Number(input.max); const value = Number(input.value);
    input.style.setProperty("--range-progress", `${(value - min) / (max - min) * 100}%`);
    output.textContent = formatter(value);
  }

  function syncControls() {
    state.strength = Number(elements.strength.value);
    state.speed = Number(elements.speed.value);
    updateRange(elements.count, document.getElementById("site-count-value"), value => String(value));
    updateRange(elements.strength, document.getElementById("strength-value"), value => value.toFixed(2));
    updateRange(elements.speed, document.getElementById("speed-value"), value => `${value.toFixed(1)}×`);
  }

  function applyPreset(name) {
    state.preset = name;
    elements.preset.value = name;
    elements.sceneName.textContent = presetNames[name];
    distributeSites();
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
    if (state.count && oldW > 0 && oldH > 0) {
      const sx = state.width / oldW; const sy = state.height / oldH;
      for (let i = 0; i < state.count; i++) { x[i] *= sx; y[i] *= sy; }
    }
    state.moving = false;
    state.dirty = true;
    buildDiagram();
  }

  function nearestSite(px, py, radius) {
    let nearest = -1; let best = radius * radius;
    for (let i = 0; i < state.count; i++) {
      const dx = x[i] - px; const dy = y[i] - py; const d2 = dx * dx + dy * dy;
      if (d2 < best) { best = d2; nearest = i; }
    }
    return nearest;
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: clamp(event.clientX - rect.left, 0, state.width), y: clamp(event.clientY - rect.top, 0, state.height) };
  }

  canvas.addEventListener("pointerdown", event => {
    const p = pointerPosition(event);
    state.pointer.down = true; state.pointer.x = p.x; state.pointer.y = p.y;
    state.moving = false;
    if (state.tool === "move") {
      state.pointer.site = nearestSite(p.x, p.y, 18);
    } else if (state.count < MAX_SITES) {
      const i = state.count++;
      x[i] = p.x; y[i] = p.y; colorIndex[i] = i % palette.length;
      state.pointer.site = i;
      elements.count.value = Math.min(Number(elements.count.max), state.count);
      updateRange(elements.count, document.getElementById("site-count-value"), value => String(value));
      state.iteration = 0; state.dirty = true;
      buildDiagram();
    }
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", event => {
    const p = pointerPosition(event);
    state.pointer.x = p.x; state.pointer.y = p.y;
    if (state.pointer.down && state.pointer.site >= 0) {
      x[state.pointer.site] = p.x; y[state.pointer.site] = p.y;
      state.dirty = true;
    } else {
      state.hoverSite = nearestSite(p.x, p.y, 12);
    }
  });

  function endPointer() {
    state.pointer.down = false; state.pointer.site = -1;
    state.nextStepAt = performance.now() + 220;
  }
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("pointerleave", () => { if (!state.pointer.down) state.hoverSite = -1; });

  elements.preset.addEventListener("change", () => applyPreset(elements.preset.value));
  elements.count.addEventListener("input", () => updateRange(elements.count, document.getElementById("site-count-value"), String));
  elements.count.addEventListener("change", distributeSites);
  elements.strength.addEventListener("input", syncControls);
  elements.speed.addEventListener("input", syncControls);
  elements.auto.addEventListener("change", () => { state.auto = elements.auto.checked; state.nextStepAt = performance.now(); });
  elements.sites.addEventListener("change", () => { state.showSites = elements.sites.checked; });
  elements.centroids.addEventListener("change", () => { state.showCentroids = elements.centroids.checked; });
  elements.filled.addEventListener("change", () => { state.filled = elements.filled.checked; });
  document.getElementById("randomize").addEventListener("click", distributeSites);
  document.getElementById("reset-settings").addEventListener("click", () => {
    elements.count.value = 90; elements.strength.value = 0.65; elements.speed.value = 1;
    syncControls(); applyPreset("random");
  });
  document.getElementById("step-once").addEventListener("click", () => {
    state.moving = false;
    if (state.paused) {
      if (state.dirty) buildDiagram();
      for (let i = 0; i < state.count; i++) {
        x[i] += (state.centroids[i].x - x[i]) * state.strength;
        y[i] += (state.centroids[i].y - y[i]) * state.strength;
      }
      state.iteration++;
      state.dirty = true;
      buildDiagram();
    } else {
      startRelaxation(performance.now(), true);
    }
  });
  elements.pause.addEventListener("click", () => {
    state.paused = !state.paused;
    if (state.paused) state.pauseAt = performance.now();
    else { state.moveStart += performance.now() - state.pauseAt; state.nextStepAt = performance.now(); }
    elements.pauseIcon.textContent = state.paused ? "▶" : "Ⅱ";
    elements.pauseLabel.textContent = state.paused ? "继续" : "暂停";
    elements.pause.setAttribute("aria-pressed", String(state.paused));
  });

  document.getElementById("tool-control").addEventListener("click", event => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    state.tool = button.dataset.value;
    document.querySelectorAll("#tool-control button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    elements.toolIndicator.textContent = state.tool === "move" ? "移动模式" : "添加模式";
    elements.hint.textContent = state.tool === "move" ? "拖动任意站点，实时重建它周围的区域" : "点击画布空白处添加一个新的 Voronoi 站点";
    canvas.style.cursor = state.tool === "move" ? "grab" : "crosshair";
  });

  window.addEventListener("resize", resize, { passive: true });
  syncControls();
  resize();
  distributeSites();
  requestAnimationFrame(animate);
})();
