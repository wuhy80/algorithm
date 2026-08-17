(() => {
  "use strict";

  const catalog = Array.isArray(window.ALGORITHM_CATALOG)
    ? window.ALGORITHM_CATALOG
    : [];
  const bySlug = new Map(catalog.map((entry) => [entry.slug, entry]));
  const categoryOrder = [...new Set(catalog.map((entry) => entry.category))];
  const state = { query: "", difficulty: "全部", category: "", stage: 0 };
  const search = document.getElementById("search");
  const list = document.getElementById("algorithm-list");
  const empty = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");
  const activeFilters = document.getElementById("active-filters");
  const categoryList = document.getElementById("category-list");
  const clearTrack = document.getElementById("clear-track");

  function difficultyClass(value) {
    return value === "基础"
      ? "basic"
      : value === "进阶"
        ? "intermediate"
        : "advanced";
  }

  function normalizedText(entry) {
    return [
      entry.name,
      entry.slug,
      entry.category,
      entry.summary,
      ...entry.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("zh-CN");
  }

  function filteredCatalog() {
    const query = state.query.trim().toLocaleLowerCase("zh-CN");
    return catalog.filter(
      (entry) =>
        (!query || normalizedText(entry).includes(query)) &&
        (state.difficulty === "全部" ||
          entry.difficulty === state.difficulty) &&
        (!state.category || entry.category === state.category) &&
        (!state.stage || entry.stage === state.stage),
    );
  }

  function sourceLink(entry) {
    return `<a href="${entry.source}" target="_blank" rel="noreferrer"><span>${entry.name}</span><i data-lucide="external-link" aria-hidden="true"></i></a>`;
  }

  function prerequisiteLinks(entry) {
    if (!entry.prerequisites.length) return "<span>无硬性先修</span>";
    return entry.prerequisites
      .map((slug) => {
        const item = bySlug.get(slug);
        return item
          ? `<a href="${item.source}" target="_blank" rel="noreferrer">${item.name.split(/\s+/)[0]}</a>`
          : slug;
      })
      .join(" · ");
  }

  function renderCategories() {
    categoryList.innerHTML = categoryOrder
      .map((category) => {
        const count = catalog.filter(
          (entry) => entry.category === category,
        ).length;
        return `<button type="button" data-category="${category}" aria-pressed="${state.category === category}"><span>${category}</span><b>${count}</b></button>`;
      })
      .join("");
    categoryList.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", () => {
        state.category =
          state.category === button.dataset.category
            ? ""
            : button.dataset.category;
        render();
        document
          .getElementById("catalog-title")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      }),
    );
  }

  function render() {
    const entries = filteredCatalog();
    const groups = categoryOrder
      .map((category) => [
        category,
        entries.filter((entry) => entry.category === category),
      ])
      .filter(([, items]) => items.length);
    list.innerHTML = groups
      .map(
        ([
          category,
          items,
        ]) => `<section class="category-group" aria-labelledby="group-${categoryOrder.indexOf(category)}">
      <header class="category-group-header"><h3 id="group-${categoryOrder.indexOf(category)}">${category}</h3><span>${items.length} ITEMS</span></header>
      <div class="algorithm-rows">${items
        .map(
          (entry) => `<article class="algorithm-row">
        <div class="algorithm-name">${sourceLink(entry)}<div class="meta-line"><span class="difficulty ${difficultyClass(entry.difficulty)}">${entry.difficulty}</span><span class="stage-label">STAGE ${entry.stage}</span><span>${entry.tags.slice(0, 2).join(" · ")}</span></div></div>
        <p class="summary">${entry.summary}</p>
        <div class="prerequisite"><b>先修内容</b>${prerequisiteLinks(entry)}</div>
        <div class="row-actions"><a href="${entry.source}" target="_blank" rel="noreferrer"><i data-lucide="code-2" aria-hidden="true"></i>源码</a><a href="guides/?slug=${encodeURIComponent(entry.slug)}"><i data-lucide="book-open" aria-hidden="true"></i>指南</a><a class="demo" href="${entry.demo}"><i data-lucide="play" aria-hidden="true"></i>演示</a></div>
      </article>`,
        )
        .join("")}</div>
    </section>`,
      )
      .join("");
    resultCount.textContent = `${entries.length} 项结果`;
    activeFilters.textContent = [
      state.category,
      state.difficulty !== "全部" ? state.difficulty : "",
      state.stage ? `阶段 ${state.stage}` : "",
      state.query ? `“${state.query}”` : "",
    ]
      .filter(Boolean)
      .join(" · ");
    empty.hidden = entries.length !== 0;
    list.hidden = entries.length === 0;
    document
      .querySelectorAll("[data-difficulty]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.difficulty === state.difficulty),
        ),
      );
    document
      .querySelectorAll("[data-stage]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(Number(button.dataset.stage) === state.stage),
        ),
      );
    clearTrack.hidden = !state.stage;
    renderCategories();
    if (window.lucide)
      window.lucide.createIcons({ attrs: { width: 16, height: 16 } });
  }

  function resetFilters() {
    state.query = "";
    state.difficulty = "全部";
    state.category = "";
    state.stage = 0;
    search.value = "";
    render();
  }

  search.addEventListener("input", () => {
    state.query = search.value;
    render();
  });
  document.querySelectorAll("[data-difficulty]").forEach((button) =>
    button.addEventListener("click", () => {
      state.difficulty = button.dataset.difficulty;
      render();
    }),
  );
  document.querySelectorAll("[data-stage]").forEach((button) =>
    button.addEventListener("click", () => {
      const stage = Number(button.dataset.stage);
      state.stage = state.stage === stage ? 0 : stage;
      render();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    }),
  );
  document.getElementById("clear-track").addEventListener("click", () => {
    state.stage = 0;
    render();
  });
  document.getElementById("clear-category").addEventListener("click", () => {
    state.category = "";
    render();
  });
  document
    .getElementById("reset-filters")
    .addEventListener("click", resetFilters);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    } else if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      state.query = "";
      search.blur();
      render();
    }
  });

  function startCanvas() {
    const canvas = document.getElementById("atlas-canvas"),
      ctx = canvas.getContext("2d"),
      reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1,
      height = 1,
      dpr = 1,
      time = 0;
    const nodes = Array.from({ length: 22 }, (_, i) => ({
      x: 0.08 + (((i * 47) % 91) / 100) * 0.84,
      y: 0.08 + (((i * 31) % 89) / 100) * 0.84,
      phase: i * 0.73,
      size: i % 5 === 0 ? 4.2 : 2.5,
      group: i % 5,
    }));
    const edges = [];
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x,
          dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < 0.075) edges.push([i, j]);
      }
    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    new ResizeObserver(resize).observe(canvas);
    resize();
    function frame() {
      time += reduced ? 0 : 0.008;
      ctx.clearRect(0, 0, width, height);
      const palette = ["#63c7d0", "#e7ad4f", "#e77b6f", "#69bb8c", "#a99add"],
        positions = nodes.map((node) => ({
          x: (node.x + Math.sin(time + node.phase) * 0.012) * width,
          y: (node.y + Math.cos(time * 0.8 + node.phase) * 0.016) * height,
        }));
      ctx.lineWidth = 1;
      edges.forEach(([a, b], i) => {
        ctx.strokeStyle =
          i % 4 === 0 ? "rgba(99,199,208,.23)" : "rgba(220,236,231,.12)";
        ctx.beginPath();
        ctx.moveTo(positions[a].x, positions[a].y);
        ctx.lineTo(positions[b].x, positions[b].y);
        ctx.stroke();
      });
      positions.forEach((point, i) => {
        const node = nodes[i];
        ctx.beginPath();
        ctx.arc(
          point.x,
          point.y,
          node.size + (i % 4 === 0 ? Math.sin(time * 3 + node.phase) * 0.8 : 0),
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = palette[node.group];
        ctx.fill();
        if (i % 5 === 0) {
          ctx.strokeStyle = "rgba(255,255,255,.35)";
          ctx.beginPath();
          ctx.arc(point.x, point.y, 9, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      if (!reduced) requestAnimationFrame(frame);
    }
    frame();
  }

  document.getElementById("total-count").textContent = String(catalog.length);
  document.getElementById("category-count").textContent = String(
    categoryOrder.length,
  );
  render();
  startCanvas();
})();
