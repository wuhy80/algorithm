(() => {
  "use strict";
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const sizeInput = document.getElementById("board-size");
  const speedInput = document.getElementById("speed");
  const orderSelect = document.getElementById("search-order");
  const sizeOutput = document.getElementById("board-size-value");
  const speedOutput = document.getElementById("speed-value");
  const attemptsMetric = document.getElementById("attempts");
  const placedMetric = document.getElementById("placed");
  const backtrackMetric = document.getElementById("backtracks");
  const fpsMetric = document.getElementById("fps");
  const eventLabel = document.getElementById("event-label");
  const constraintLabel = document.getElementById("constraint-label");
  const boardNote = document.getElementById("board-note");
  const runState = document.getElementById("run-state");
  const pauseButton = document.getElementById("pause");
  const pauseIcon = document.getElementById("pause-icon");
  const pauseLabel = document.getElementById("pause-label");

  let size = 8;
  let queens = new Int16Array(size);
  let steps = [];
  let stepIndex = 0;
  let candidateRow = -1;
  let candidateCol = -1;
  let conflictRow = -1;
  let attempts = 0;
  let placed = 0;
  let backtracks = 0;
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
    sizeOutput.value = `${sizeInput.value} × ${sizeInput.value}`;
    speedOutput.value = `${speedInput.value} 步/秒`;
    [sizeInput, speedInput].forEach(updateRange);
  }
  function columnOrder() {
    const columns = Array.from({ length: size }, (_, index) => index);
    if (orderSelect.value === "center") columns.sort((a, b) => Math.abs(a - (size - 1) / 2) - Math.abs(b - (size - 1) / 2));
    if (orderSelect.value === "alternating") columns.sort((a, b) => {
      const rank = (value) => value % 2 === 0 ? value / 2 : size - 1 - Math.floor(value / 2);
      return rank(a) - rank(b);
    });
    return columns;
  }
  function buildSteps() {
    const board = new Int16Array(size);
    board.fill(-1);
    const columns = columnOrder();
    steps = [];
    function findConflict(row, col) {
      for (let previous = 0; previous < row; previous += 1) {
        const previousCol = board[previous];
        if (previousCol === col || Math.abs(previousCol - col) === row - previous) return previous;
      }
      return -1;
    }
    function search(row) {
      if (row === size) { steps.push({ type: "solution" }); return true; }
      for (const col of columns) {
        const conflict = findConflict(row, col);
        steps.push({ type: "try", row, col, conflict });
        if (conflict >= 0) { steps.push({ type: "reject", row, col, conflict }); continue; }
        board[row] = col;
        steps.push({ type: "place", row, col });
        if (search(row + 1)) return true;
        board[row] = -1;
        steps.push({ type: "remove", row, col });
      }
      return false;
    }
    search(0);
  }
  function reset() {
    size = Number(sizeInput.value);
    queens = new Int16Array(size);
    queens.fill(-1);
    candidateRow = -1;
    candidateCol = -1;
    conflictRow = -1;
    attempts = 0;
    placed = 0;
    backtracks = 0;
    stepIndex = 0;
    buildSteps();
    setPaused(false);
    eventLabel.textContent = "准备第一行";
    constraintLabel.textContent = "等待尝试";
    boardNote.textContent = `${size} QUEENS · ${steps.length} EVENTS`;
    updateMetrics();
    dirty = true;
  }
  function applyStep() {
    if (stepIndex >= steps.length) { setPaused(true); runState.textContent = "搜索已结束"; return; }
    const event = steps[stepIndex++];
    if (event.type === "try") {
      candidateRow = event.row;
      candidateCol = event.col;
      conflictRow = event.conflict;
      attempts += 1;
      eventLabel.textContent = `尝试 R${event.row + 1} · C${event.col + 1}`;
      constraintLabel.textContent = event.conflict >= 0 ? `与 R${event.conflict + 1} 皇后冲突` : "列与对角线安全";
    } else if (event.type === "reject") {
      conflictRow = event.conflict;
      eventLabel.textContent = "冲突，尝试下一列";
    } else if (event.type === "place") {
      queens[event.row] = event.col;
      placed += 1;
      candidateRow = -1;
      conflictRow = -1;
      eventLabel.textContent = `放置第 ${event.row + 1} 个皇后`;
      constraintLabel.textContent = "进入下一行";
    } else if (event.type === "remove") {
      queens[event.row] = -1;
      placed -= 1;
      backtracks += 1;
      candidateRow = event.row;
      candidateCol = event.col;
      conflictRow = -1;
      eventLabel.textContent = `撤销 R${event.row + 1} · C${event.col + 1}`;
      constraintLabel.textContent = "本行后续无解，返回上一层";
    } else {
      candidateRow = -1;
      conflictRow = -1;
      setPaused(true);
      runState.textContent = "找到可行解";
      eventLabel.textContent = `${size} 个皇后互不攻击`;
      constraintLabel.textContent = `尝试 ${attempts} 次 · 撤销 ${backtracks} 次`;
    }
    updateMetrics();
    dirty = true;
  }
  function updateMetrics() {
    attemptsMetric.textContent = attempts.toLocaleString("zh-CN");
    placedMetric.textContent = `${placed}/${size}`;
    backtrackMetric.textContent = backtracks.toLocaleString("zh-CN");
  }
  function setPaused(value) {
    paused = value;
    pauseIcon.textContent = paused ? "▶" : "Ⅱ";
    pauseLabel.textContent = paused ? "继续" : "暂停";
    if (stepIndex < steps.length) runState.textContent = paused ? "搜索已暂停" : "回溯搜索中";
    pauseButton.setAttribute("aria-pressed", String(paused));
    accumulator = 0;
  }
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    dirty = true;
  }
  function drawQueen(row, col, x0, y0, cell, color, label) {
    const x = x0 + (col + .5) * cell;
    const y = y0 + (row + .5) * cell;
    ctx.beginPath();
    ctx.arc(x, y, cell * .31, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.72)";
    ctx.lineWidth = Math.max(1, cell * .025);
    ctx.stroke();
    ctx.fillStyle = "#121719";
    ctx.font = `600 ${cell * .34}px Georgia,serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + cell * .01);
  }
  function draw() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    ctx.fillStyle = "#121719";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const top = 92 * dpr;
    const bottom = 52 * dpr;
    const availableHeight = canvas.height - top - bottom;
    const boardSize = Math.min(canvas.width * .82, availableHeight * .94);
    const cell = boardSize / size;
    const x0 = (canvas.width - boardSize) / 2;
    const y0 = top + (availableHeight - boardSize) / 2;
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const light = (row + col) % 2 === 0;
        let fill = light ? "#dce5df" : "#4b615d";
        if (row === candidateRow && col === candidateCol) fill = conflictRow >= 0 ? "#9a4f49" : "#9b8248";
        ctx.fillStyle = fill;
        ctx.fillRect(x0 + col * cell, y0 + row * cell, cell + .5, cell + .5);
      }
    }
    if (candidateRow >= 0) {
      const cx = x0 + (candidateCol + .5) * cell;
      const cy = y0 + (candidateRow + .5) * cell;
      ctx.strokeStyle = conflictRow >= 0 ? "#ef776b" : "#efc15e";
      ctx.lineWidth = Math.max(2, cell * .055);
      ctx.strokeRect(x0 + candidateCol * cell + 2, y0 + candidateRow * cell + 2, cell - 4, cell - 4);
      if (conflictRow >= 0) {
        const qx = x0 + (queens[conflictRow] + .5) * cell;
        const qy = y0 + (conflictRow + .5) * cell;
        ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(cx, cy); ctx.stroke();
      }
      drawQueen(candidateRow, candidateCol, x0, y0, cell, conflictRow >= 0 ? "#ef776b" : "#efc15e", "?");
    }
    for (let row = 0; row < size; row += 1) if (queens[row] >= 0) drawQueen(row, queens[row], x0, y0, cell, row === conflictRow ? "#ef776b" : "#76d9c9", "Q");
    if (cell > 34 * dpr) {
      ctx.fillStyle = "rgba(238,243,238,.58)";
      ctx.font = `${9 * dpr}px ui-monospace,Consolas,monospace`;
      ctx.textAlign = "center";
      for (let col = 0; col < size; col += 1) ctx.fillText(String(col + 1), x0 + (col + .5) * cell, y0 + boardSize + 13 * dpr);
    }
    dirty = false;
  }
  function frame(now) {
    const delta = Math.min(100, now - previousTime); previousTime = now;
    if (!paused) { accumulator += delta; const interval = 1000 / Number(speedInput.value); while (accumulator >= interval) { applyStep(); accumulator -= interval; if (paused) break; } }
    if (dirty) draw();
    fpsFrames += 1;
    if (now - fpsStartedAt >= 500) { fpsMetric.textContent = String(Math.round(fpsFrames * 1000 / (now - fpsStartedAt))); fpsFrames = 0; fpsStartedAt = now; }
    requestAnimationFrame(frame);
  }
  sizeInput.addEventListener("input", syncControls);
  sizeInput.addEventListener("change", reset);
  speedInput.addEventListener("input", syncControls);
  orderSelect.addEventListener("change", reset);
  document.getElementById("reset").addEventListener("click", reset);
  document.getElementById("step").addEventListener("click", () => { setPaused(true); applyStep(); });
  pauseButton.addEventListener("click", () => setPaused(!paused));
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeCanvas, 160); });
  syncControls();
  resizeCanvas();
  reset();
  requestAnimationFrame(frame);
})();
