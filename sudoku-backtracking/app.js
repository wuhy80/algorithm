(() => {
  "use strict";
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const puzzles = {
    easy: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    medium: "000260701680070090190004500820100040004602900050003028009300074040050036703018000",
    hard: "000000907000420180000705026100904000050000040000507009920108000034059000507000000",
    expert: "005300000800000020070010500400005300010070006003200080060500009004000030000009700"
  };
  const puzzleNames = { easy: "EASY", medium: "MEDIUM", hard: "HARD", expert: "EXPERT" };
  const puzzleSelect = document.getElementById("puzzle");
  const orderSelect = document.getElementById("digit-order");
  const speedInput = document.getElementById("speed");
  const speedOutput = document.getElementById("speed-value");
  const attemptsMetric = document.getElementById("attempts");
  const filledMetric = document.getElementById("filled");
  const backtrackMetric = document.getElementById("backtracks");
  const fpsMetric = document.getElementById("fps");
  const eventLabel = document.getElementById("event-label");
  const constraintLabel = document.getElementById("constraint-label");
  const puzzleNote = document.getElementById("puzzle-note");
  const runState = document.getElementById("run-state");
  const pauseButton = document.getElementById("pause");
  const pauseIcon = document.getElementById("pause-icon");
  const pauseLabel = document.getElementById("pause-label");

  let board = new Uint8Array(81);
  let givens = new Uint8Array(81);
  let solver = null;
  let candidateIndex = -1;
  let candidateDigit = 0;
  let conflicts = [];
  let eventType = "idle";
  let attempts = 0;
  let filled = 0;
  let backtracks = 0;
  let paused = false;
  let accumulator = 0;
  let previousTime = performance.now();
  let fpsFrames = 0;
  let fpsStartedAt = previousTime;
  let dirty = true;
  let resizeTimer = 0;

  function updateRange() {
    const value = (Number(speedInput.value) - Number(speedInput.min)) / (Number(speedInput.max) - Number(speedInput.min)) * 100;
    speedInput.style.setProperty("--progress", `${value}%`);
    speedOutput.value = `${speedInput.value} 步/秒`;
  }
  function digitOrder() {
    if (orderSelect.value === "descending") return [9,8,7,6,5,4,3,2,1];
    if (orderSelect.value === "center") return [5,4,6,3,7,2,8,1,9];
    return [1,2,3,4,5,6,7,8,9];
  }
  function conflictCells(index, digit) {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    const result = [];
    const seen = new Uint8Array(81);
    for (let i = 0; i < 9; i += 1) {
      const rowIndex = row * 9 + i;
      const colIndex = i * 9 + col;
      if (board[rowIndex] === digit && !seen[rowIndex]) { result.push(rowIndex); seen[rowIndex] = 1; }
      if (board[colIndex] === digit && !seen[colIndex]) { result.push(colIndex); seen[colIndex] = 1; }
      const boxIndex = (boxRow + Math.floor(i / 3)) * 9 + boxCol + i % 3;
      if (board[boxIndex] === digit && !seen[boxIndex]) { result.push(boxIndex); seen[boxIndex] = 1; }
    }
    return result;
  }
  function selectCell() {
    let best = -1;
    let bestCount = 10;
    for (let index = 0; index < 81; index += 1) {
      if (board[index] !== 0) continue;
      let count = 0;
      for (let digit = 1; digit <= 9; digit += 1) if (conflictCells(index, digit).length === 0) count += 1;
      if (count < bestCount) { best = index; bestCount = count; if (count === 0) break; }
    }
    return best;
  }
  function createSolver() {
    function* search() {
      const index = selectCell();
      if (index < 0) { yield { type: "solution" }; return true; }
      for (const digit of digitOrder()) {
        const blockedBy = conflictCells(index, digit);
        yield { type: "try", index, digit, conflicts: blockedBy };
        if (blockedBy.length) { yield { type: "reject", index, digit, conflicts: blockedBy }; continue; }
        board[index] = digit;
        yield { type: "place", index, digit };
        if (yield* search()) return true;
        board[index] = 0;
        yield { type: "remove", index, digit };
      }
      return false;
    }
    return search();
  }
  function reset() {
    const source = puzzles[puzzleSelect.value];
    board = Uint8Array.from(source, (char) => Number(char));
    givens = Uint8Array.from(board, (value) => value ? 1 : 0);
    filled = board.reduce((sum, value) => sum + (value ? 1 : 0), 0);
    solver = createSolver();
    candidateIndex = -1;
    candidateDigit = 0;
    conflicts = [];
    eventType = "idle";
    attempts = 0;
    backtracks = 0;
    setPaused(false);
    eventLabel.textContent = "选择下一个空格";
    constraintLabel.textContent = "等待候选";
    puzzleNote.textContent = `${puzzleNames[puzzleSelect.value]} · ${81 - filled} EMPTY CELLS`;
    updateMetrics();
    dirty = true;
  }
  function applyStep() {
    const result = solver.next();
    if (result.done) { setPaused(true); runState.textContent = "搜索已结束"; return; }
    const event = result.value;
    eventType = event.type;
    if (event.type === "try") {
      candidateIndex = event.index;
      candidateDigit = event.digit;
      conflicts = event.conflicts;
      attempts += 1;
      const row = Math.floor(event.index / 9) + 1;
      const col = event.index % 9 + 1;
      eventLabel.textContent = `尝试 R${row} · C${col} = ${event.digit}`;
      constraintLabel.textContent = conflicts.length ? `${conflicts.length} 处约束冲突` : "行、列、宫均可用";
    } else if (event.type === "reject") {
      conflicts = event.conflicts;
      eventLabel.textContent = `拒绝数字 ${event.digit}`;
      constraintLabel.textContent = "尝试下一个候选";
    } else if (event.type === "place") {
      candidateIndex = event.index;
      candidateDigit = event.digit;
      conflicts = [];
      filled += 1;
      eventLabel.textContent = `填入数字 ${event.digit}`;
      constraintLabel.textContent = "递归处理下一个空格";
    } else if (event.type === "remove") {
      candidateIndex = event.index;
      candidateDigit = event.digit;
      conflicts = [];
      filled -= 1;
      backtracks += 1;
      eventLabel.textContent = `撤销数字 ${event.digit}`;
      constraintLabel.textContent = "后续无解，返回上一层";
    } else {
      candidateIndex = -1;
      conflicts = [];
      setPaused(true);
      runState.textContent = "数独求解完成";
      eventLabel.textContent = "81 个格子全部满足约束";
      constraintLabel.textContent = `尝试 ${attempts} 次 · 撤销 ${backtracks} 次`;
    }
    updateMetrics();
    dirty = true;
  }
  function updateMetrics() {
    attemptsMetric.textContent = attempts.toLocaleString("zh-CN");
    filledMetric.textContent = `${filled}/81`;
    backtrackMetric.textContent = backtracks.toLocaleString("zh-CN");
  }
  function setPaused(value) {
    paused = value;
    pauseIcon.textContent = paused ? "▶" : "Ⅱ";
    pauseLabel.textContent = paused ? "继续" : "暂停";
    if (filled < 81) runState.textContent = paused ? "求解已暂停" : "约束搜索中";
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
  function draw() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    ctx.fillStyle = "#111719";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const top = 92 * dpr;
    const bottom = 52 * dpr;
    const availableHeight = canvas.height - top - bottom;
    const size = Math.min(canvas.width * .82, availableHeight * .94);
    const cell = size / 9;
    const x0 = (canvas.width - size) / 2;
    const y0 = top + (availableHeight - size) / 2;
    const conflictSet = new Set(conflicts);
    for (let index = 0; index < 81; index += 1) {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const alternate = (Math.floor(row / 3) + Math.floor(col / 3)) % 2;
      let fill = alternate ? "#d9e2dd" : "#edf0eb";
      if (conflictSet.has(index)) fill = "#e6a199";
      if (index === candidateIndex) {
        if (eventType === "remove" || conflicts.length) fill = "#c7685f";
        else fill = "#e9c873";
      }
      ctx.fillStyle = fill;
      ctx.fillRect(x0 + col * cell, y0 + row * cell, cell + .5, cell + .5);
      const value = board[index];
      if (value) {
        ctx.fillStyle = givens[index] ? "#24302d" : "#238879";
        ctx.font = `${givens[index] ? 600 : 500} ${cell * .43}px "Segoe UI",sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(value), x0 + (col + .5) * cell, y0 + (row + .53) * cell);
      }
    }
    if (candidateIndex >= 0 && (eventType === "try" || eventType === "reject" || eventType === "remove")) {
      const row = Math.floor(candidateIndex / 9);
      const col = candidateIndex % 9;
      ctx.fillStyle = eventType === "remove" || conflicts.length ? "#7d2f2c" : "#6e5828";
      ctx.globalAlpha = eventType === "remove" ? .58 : 1;
      ctx.font = `600 ${cell * .43}px "Segoe UI",sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(candidateDigit), x0 + (col + .5) * cell, y0 + (row + .53) * cell);
      ctx.globalAlpha = 1;
    }
    for (let i = 0; i <= 9; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = i % 3 === 0 ? "#27312f" : "rgba(39,49,47,.28)";
      ctx.lineWidth = (i % 3 === 0 ? 2.4 : .7) * dpr;
      ctx.moveTo(x0 + i * cell, y0); ctx.lineTo(x0 + i * cell, y0 + size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0, y0 + i * cell); ctx.lineTo(x0 + size, y0 + i * cell); ctx.stroke();
    }
    dirty = false;
  }
  function frame(now) {
    const delta = Math.min(100, now - previousTime); previousTime = now;
    if (!paused) { accumulator += delta; const interval = 1000 / Number(speedInput.value); let updates = 0; while (accumulator >= interval && updates < 12) { applyStep(); accumulator -= interval; updates += 1; if (paused) break; } if (updates === 12) accumulator = 0; }
    if (dirty) draw();
    fpsFrames += 1;
    if (now - fpsStartedAt >= 500) { fpsMetric.textContent = String(Math.round(fpsFrames * 1000 / (now - fpsStartedAt))); fpsFrames = 0; fpsStartedAt = now; }
    requestAnimationFrame(frame);
  }
  speedInput.addEventListener("input", updateRange);
  puzzleSelect.addEventListener("change", reset);
  orderSelect.addEventListener("change", reset);
  document.getElementById("reset").addEventListener("click", reset);
  document.getElementById("step").addEventListener("click", () => { setPaused(true); applyStep(); });
  pauseButton.addEventListener("click", () => setPaused(!paused));
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeCanvas, 160); });
  updateRange();
  resizeCanvas();
  reset();
  requestAnimationFrame(frame);
})();
