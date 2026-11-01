/* 学习路线图 · 算法可视化图谱
 * 数据来源：window.ALGORITHM_CATALOG（由 ../catalog-data.js 注入）；
 * 学习主线：window.ROADMAP_PATH（由 path-data.js 注入，scripts/generate-roadmap-path.mjs 生成）。
 * 进度存储：algorithm-roadmap-progress-v1（{[slug]: true}）；
 * 视图偏好：algorithm-roadmap-view-v1（'path' | 'board'）；
 * 打卡状态与题库 algorithm-problem-progress-v1 的 solved 字段合并统计。
 */
(function () {
  'use strict';

  var ROADMAP_KEY = 'algorithm-roadmap-progress-v1';
  var PROBLEM_KEY = 'algorithm-problem-progress-v1';
  var VIEW_KEY = 'algorithm-roadmap-view-v1';
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var MOBILE_BP = 980;

  var STAGE_META = [
    { stage: 1, name: '基础入门', en: 'STAGE 01', icon: 'sprout', blurb: '从数组、指针与基础结构开始，建立算法直觉。' },
    { stage: 2, name: '进阶技巧', en: 'STAGE 02', icon: 'layers', blurb: '掌握排序、堆、哈希与经典优化套路。' },
    { stage: 3, name: '高级专题', en: 'STAGE 03', icon: 'boxes', blurb: '攻克几何、数论变换与树分解等硬骨头。' },
    { stage: 4, name: '前沿与综合', en: 'STAGE 04', icon: 'rocket', blurb: '挑战机器学习、群体智能与综合建模。' }
  ];

  var DIFF_CLASS = { '基础': '1', '进阶': '2', '高级': '3' };

  var catalog = Array.isArray(window.ALGORITHM_CATALOG) ? window.ALGORITHM_CATALOG : [];
  var bySlug = new Map();
  var dependents = new Map();
  var searchTexts = new Map();

  catalog.forEach(function (entry) {
    if (!entry || !entry.slug) return;
    bySlug.set(entry.slug, entry);
  });
  catalog.forEach(function (entry) {
    if (!entry || !entry.slug) return;
    (entry.prerequisites || []).forEach(function (pre) {
      if (!bySlug.has(pre)) return;
      if (!dependents.has(pre)) dependents.set(pre, []);
      dependents.get(pre).push(entry);
    });
    var text = [
      entry.name,
      entry.slug,
      entry.category,
      entry.summary,
      (entry.tags || []).join(' ')
    ].join(' ').toLowerCase();
    searchTexts.set(entry.slug, text);
  });

  /* ---------- 学习主线数据 ---------- */

  var pathData = (function () {
    var raw = window.ROADMAP_PATH;
    if (!raw || !Array.isArray(raw.stages)) return null;
    var stages = [];
    var coreBySlug = new Map();
    raw.stages.forEach(function (stageInfo) {
      var core = (stageInfo.core || []).filter(function (item) { return bySlug.has(item.slug); });
      core.forEach(function (item) {
        coreBySlug.set(item.slug, { slug: item.slug, order: item.order, stage: stageInfo.stage });
      });
      stages.push({
        stage: stageInfo.stage,
        name: stageInfo.name,
        core: core,
        extensions: (stageInfo.extensions || []).filter(function (slug) { return bySlug.has(slug); })
      });
    });
    return stages.length
      ? { coreTotal: coreBySlug.size, stages: stages, coreBySlug: coreBySlug }
      : null;
  })();

  /* ---------- DOM 引用 ---------- */

  var board = document.getElementById('board');
  var pathView = document.getElementById('path-view');
  var edgesSvg = document.getElementById('edges');
  var searchInput = document.getElementById('roadmap-search');
  var searchHint = document.getElementById('search-hint');
  var totalDoneEl = document.getElementById('total-done');
  var totalCountEl = document.getElementById('total-count');
  var progressFill = document.getElementById('progress-fill');
  var progressTrack = document.getElementById('progress-track');
  var resetBtn = document.getElementById('reset-progress');
  var nextUpBtn = document.getElementById('next-up');
  var viewPathBtn = document.getElementById('view-path');
  var viewBoardBtn = document.getElementById('view-board');
  var drawer = document.getElementById('drawer');
  var drawerBody = document.getElementById('drawer-body');
  var drawerClose = document.getElementById('drawer-close');
  var backdrop = document.getElementById('drawer-backdrop');

  /* ---------- 运行时状态 ---------- */

  var roadmapProgress = readStore(ROADMAP_KEY);
  var chipEls = new Map();
  var stageDoneEls = new Map();
  var pathChipEls = new Map();
  var pathStageDoneEls = new Map();
  var activeView = 'path';
  var edgeEls = [];
  var linkedChips = [];
  var hoverSlug = null;
  var firstMatchSlug = null;
  var drawerSlug = null;
  var lastTrigger = null;
  var resizeRaf = 0;
  var resizeTimer = 0;

  /* ---------- 工具函数 ---------- */

  function readStore(key) {
    try {
      var parsed = JSON.parse(localStorage.getItem(key) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) { /* 存储不可用时静默降级 */ }
  }

  function saveRoadmap() {
    writeStore(ROADMAP_KEY, roadmapProgress);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function diffClassOf(difficulty) {
    return DIFF_CLASS[difficulty] || '1';
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
      } catch (err) { /* 图标库异常不影响功能 */ }
    }
  }

  function isDone(slug) {
    if (roadmapProgress[slug] === true) return true;
    var problemState = readStore(PROBLEM_KEY);
    return !!(problemState[slug] && problemState[slug].solved);
  }

  function slugFromLocation() {
    try {
      return new URLSearchParams(location.search).get('focus') || '';
    } catch (err) {
      return '';
    }
  }

  /* ---------- 搭建四列阶段布局 ---------- */

  function chipHTML(entry) {
    var minis = (entry.prerequisites || []).map(function (slug) {
      var pre = bySlug.get(slug);
      if (!pre) return '';
      return '<button type="button" class="prereq-mini" data-goto="' + escapeHtml(slug) + '">'
        + escapeHtml(pre.name) + '</button>';
    }).join('');

    return '<div class="node">'
      + '<button type="button" class="chip diff-' + diffClassOf(entry.difficulty) + '" data-slug="' + escapeHtml(entry.slug) + '">'
      + '<i class="dot" aria-hidden="true"></i>'
      + '<span class="chip-name">' + escapeHtml(entry.name) + '</span>'
      + '<span class="chip-check" aria-hidden="true">✓</span>'
      + '</button>'
      + (minis ? '<div class="node-prereqs"><span class="prereq-label">前置</span>' + minis + '</div>' : '')
      + '</div>';
  }

  function buildBoard() {
    if (!catalog.length) {
      totalCountEl.textContent = '0';
      board.insertAdjacentHTML('beforeend',
        '<p class="board-empty">主题数据未能加载：请确认 catalog-data.js 可访问后刷新页面。</p>');
      return;
    }

    var categoryOrder = [];
    catalog.forEach(function (entry) {
      if (categoryOrder.indexOf(entry.category) === -1) categoryOrder.push(entry.category);
    });

    var html = STAGE_META.map(function (meta) {
      var stageEntries = catalog.filter(function (entry) { return entry.stage === meta.stage; });
      var groups = categoryOrder.map(function (cat) {
        var items = stageEntries.filter(function (entry) { return entry.category === cat; });
        if (!items.length) return '';
        return '<section class="group">'
          + '<header class="group-head"><span class="group-name">' + escapeHtml(cat) + '</span>'
          + '<span class="group-count">' + items.length + ' 项</span></header>'
          + '<div class="group-body">' + items.map(chipHTML).join('') + '</div>'
          + '</section>';
      }).join('');

      return '<section class="stage-col" data-stage="' + meta.stage + '">'
        + '<header class="stage-head">'
        + '<span class="stage-icon"><i data-lucide="' + meta.icon + '" aria-hidden="true"></i></span>'
        + '<div class="stage-title"><span class="stage-en">' + meta.en + '</span>'
        + '<h2>阶段 ' + meta.stage + ' · ' + meta.name + '</h2></div>'
        + '<span class="stage-count"><b data-stage-done="' + meta.stage + '">0</b>'
        + '<span>/' + stageEntries.length + ' 已学</span></span>'
        + '</header>'
        + '<p class="stage-blurb">' + meta.blurb + '</p>'
        + groups
        + '</section>';
    }).join('');

    board.insertAdjacentHTML('beforeend', html);

    board.querySelectorAll('.chip').forEach(function (chip) {
      chipEls.set(chip.getAttribute('data-slug'), chip);
    });
    board.querySelectorAll('[data-stage-done]').forEach(function (el) {
      stageDoneEls.set(Number(el.getAttribute('data-stage-done')), el);
    });
    if (progressTrack) progressTrack.setAttribute('aria-valuemax', String(catalog.length));
  }

  /* ---------- 学习主线视图 ---------- */

  function pathNodeHTML(item) {
    var entry = bySlug.get(item.slug);
    return '<button type="button" class="path-node diff-' + diffClassOf(entry.difficulty) + '"'
      + ' data-slug="' + escapeHtml(item.slug) + '" title="' + escapeHtml(entry.summary || '') + '">'
      + '<span class="node-order" aria-hidden="true">' + item.order + '</span>'
      + '<i class="dot" aria-hidden="true"></i>'
      + '<span class="chip-name">' + escapeHtml(entry.name) + '</span>'
      + '<span class="chip-check" aria-hidden="true">✓</span>'
      + '</button>';
  }

  function extChipHTML(entry) {
    return '<button type="button" class="path-ext-chip diff-' + diffClassOf(entry.difficulty) + '" data-slug="' + escapeHtml(entry.slug) + '">'
      + '<i class="dot" aria-hidden="true"></i>'
      + '<span class="chip-name">' + escapeHtml(entry.name) + '</span>'
      + '<span class="chip-check" aria-hidden="true">✓</span>'
      + '</button>';
  }

  function buildPathView() {
    if (!catalog.length) return;
    if (!pathData || !pathView) {
      if (pathView) {
        pathView.insertAdjacentHTML('beforeend',
          '<p class="board-empty">主线数据未能加载：请确认 path-data.js 可访问后刷新页面，或切换到全景图谱。</p>');
      }
      return;
    }

    var html = pathData.stages.map(function (stageInfo) {
      var meta = STAGE_META[stageInfo.stage - 1] || {};
      var items = stageInfo.core.slice().sort(function (a, b) { return a.order - b.order; });
      var flow = '<section class="group">'
        + '<header class="group-head"><span class="group-name">按编号顺序学习</span>'
        + '<span class="group-count">' + items.length + ' 项</span></header>'
        + '<div class="path-flow">' + items.map(pathNodeHTML).join('') + '</div>'
        + '</section>';

      var ext = stageInfo.extensions;
      var extBlock = ext.length
        ? '<details class="path-ext">'
          + '<summary>扩展主题<span class="ext-count">' + ext.length + '</span><small>不在主线上，需要时再学</small></summary>'
          + '<div class="path-ext-body">' + ext.map(function (slug) {
              return extChipHTML(bySlug.get(slug));
            }).join('') + '</div>'
          + '</details>'
        : '';

      return '<section class="path-stage" data-stage="' + stageInfo.stage + '">'
        + '<header class="stage-head">'
        + '<span class="stage-icon"><i data-lucide="' + (meta.icon || 'map') + '" aria-hidden="true"></i></span>'
        + '<div class="stage-title"><span class="stage-en">PATH 0' + stageInfo.stage + '</span>'
        + '<h2>阶段 ' + stageInfo.stage + ' · ' + escapeHtml(stageInfo.name || meta.name || '') + '</h2></div>'
        + '<span class="stage-count"><b data-path-stage-done="' + stageInfo.stage + '">0</b>'
        + '<span>/' + stageInfo.core.length + ' 已学</span></span>'
        + '</header>'
        + (meta.blurb ? '<p class="stage-blurb">' + escapeHtml(meta.blurb) + '</p>' : '')
        + flow
        + extBlock
        + '</section>';
    }).join('');

    pathView.insertAdjacentHTML('beforeend', html);

    pathView.querySelectorAll('.path-node, .path-ext-chip').forEach(function (node) {
      pathChipEls.set(node.getAttribute('data-slug'), node);
    });
    pathView.querySelectorAll('[data-path-stage-done]').forEach(function (el) {
      pathStageDoneEls.set(Number(el.getAttribute('data-path-stage-done')), el);
    });
  }

  /* ---------- 视图切换 ---------- */

  function requestedView() {
    try {
      var param = new URLSearchParams(location.search).get('view');
      if (param === 'board' || param === 'path') return param;
    } catch (err) { /* 忽略 */ }
    try {
      var stored = localStorage.getItem(VIEW_KEY);
      if (stored === 'board' || stored === 'path') return stored;
    } catch (err) { /* 忽略 */ }
    return 'path';
  }

  function setView(view) {
    if (view !== 'path' && view !== 'board') view = 'path';
    if (!pathData && view === 'path') view = 'board';
    activeView = view;
    var isPath = view === 'path';
    if (pathView) pathView.hidden = !isPath;
    if (board) board.hidden = isPath;
    if (viewPathBtn) viewPathBtn.setAttribute('aria-pressed', String(isPath));
    if (viewBoardBtn) viewBoardBtn.setAttribute('aria-pressed', String(!isPath));
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch (err) { /* 存储不可用时静默降级 */ }
    if (isPath) {
      clearEdges();
    } else {
      scheduleRedraw();
      setTimeout(drawEdges, 400);
    }
  }

  /* ---------- 继续学习 ---------- */

  function continueLearning() {
    if (!pathData) return;
    var items = [];
    pathData.stages.forEach(function (stageInfo) {
      items.push.apply(items, stageInfo.core);
    });
    items.sort(function (a, b) { return a.order - b.order; });
    for (var i = 0; i < items.length; i++) {
      if (!isDone(items[i].slug)) {
        if (activeView !== 'path') setView('path');
        openDrawer(items[i].slug, { push: true, focus: true });
        scrollChipIntoView(items[i].slug);
        return;
      }
    }
    if (searchHint) {
      searchHint.textContent = '主线 ' + pathData.coreTotal + ' 个主题都已掌握，可在全景图谱里继续挑战扩展主题。';
    }
  }

  /* ---------- 先修连线 ---------- */

  function rectRelativeTo(el, boardRect) {
    var r = el.getBoundingClientRect();
    return {
      left: r.left - boardRect.left,
      right: r.right - boardRect.left,
      cy: r.top - boardRect.top + r.height / 2
    };
  }

  function clearEdges() {
    while (edgesSvg.firstChild) edgesSvg.removeChild(edgesSvg.firstChild);
    edgeEls = [];
  }

  function drawEdges() {
    if (!edgesSvg || !board) return;
    if (window.innerWidth < MOBILE_BP || !catalog.length) {
      clearEdges();
      return;
    }

    var width = board.offsetWidth;
    var height = board.offsetHeight;
    if (!width || !height) return;

    edgesSvg.setAttribute('width', String(width));
    edgesSvg.setAttribute('height', String(height));
    edgesSvg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    var boardRect = board.getBoundingClientRect();
    var frag = document.createDocumentFragment();

    catalog.forEach(function (entry) {
      var toChip = chipEls.get(entry.slug);
      if (!toChip) return;
      var target = rectRelativeTo(toChip, boardRect);
      (entry.prerequisites || []).forEach(function (pre) {
        var fromChip = chipEls.get(pre);
        if (!fromChip || pre === entry.slug) return;
        var source = rectRelativeTo(fromChip, boardRect);
        var x1 = source.right;
        var y1 = source.cy;
        var x2 = target.left;
        var y2 = target.cy;
        var dx = Math.max(28, Math.abs(x2 - x1) / 2);
        var path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', 'M' + x1 + ' ' + y1
          + ' C' + (x1 + dx) + ' ' + y1 + ', ' + (x2 - dx) + ' ' + y2 + ', ' + x2 + ' ' + y2);
        path.setAttribute('class', 'edge');
        path.setAttribute('data-from', pre);
        path.setAttribute('data-to', entry.slug);
        frag.appendChild(path);
      });
    });

    clearEdges();
    edgesSvg.appendChild(frag);
    edgeEls = Array.prototype.slice.call(edgesSvg.querySelectorAll('.edge'));
    if (hoverSlug) highlightEdges(hoverSlug);
  }

  function highlightEdges(slug) {
    var partners = slug ? [] : null;
    edgeEls.forEach(function (el) {
      var from = el.getAttribute('data-from');
      var to = el.getAttribute('data-to');
      var active = !!slug && (from === slug || to === slug);
      el.classList.toggle('edge-active', active);
      el.classList.toggle('edge-dim', !!slug && !active);
      if (active) partners.push(from === slug ? to : from);
    });

    linkedChips.forEach(function (chip) { chip.classList.remove('chip-linked'); });
    linkedChips = [];
    (partners || []).forEach(function (partner) {
      var chip = chipEls.get(partner);
      if (chip && linkedChips.indexOf(chip) === -1) {
        chip.classList.add('chip-linked');
        linkedChips.push(chip);
      }
    });
  }

  /* ---------- 搜索 ---------- */

  function applySearch() {
    var query = searchInput.value.trim().toLowerCase();
    firstMatchSlug = null;
    var matches = 0;

    if (!query) {
      chipEls.forEach(function (chip) { chip.classList.remove('search-dim'); });
      pathChipEls.forEach(function (chip) { chip.classList.remove('search-dim'); });
      searchHint.textContent = '';
      return;
    }

    catalog.forEach(function (entry) {
      var hit = searchTexts.get(entry.slug).indexOf(query) !== -1;
      var chip = chipEls.get(entry.slug);
      if (chip) chip.classList.toggle('search-dim', !hit);
      var pathChip = pathChipEls.get(entry.slug);
      if (pathChip) pathChip.classList.toggle('search-dim', !hit);
      if (hit) {
        matches++;
        if (!firstMatchSlug) firstMatchSlug = entry.slug;
      }
    });
    searchHint.textContent = firstMatchSlug
      ? '匹配 ' + matches + ' 个主题，Enter 查看首个'
      : '没有匹配的主题';
  }

  function clearSearch() {
    if (!searchInput.value && !firstMatchSlug) return;
    searchInput.value = '';
    applySearch();
  }

  /* ---------- 进度 ---------- */

  function updateAll() {
    var doneByStage = { 1: 0, 2: 0, 3: 0, 4: 0 };
    var doneTotal = 0;

    catalog.forEach(function (entry) {
      var done = isDone(entry.slug);
      var chip = chipEls.get(entry.slug);
      if (chip) chip.classList.toggle('done', done);
      if (done) {
        doneTotal++;
        doneByStage[entry.stage] = (doneByStage[entry.stage] || 0) + 1;
      }
    });

    if (totalDoneEl) totalDoneEl.textContent = String(doneTotal);
    if (totalCountEl) totalCountEl.textContent = String(catalog.length);
    if (progressFill && catalog.length) {
      progressFill.style.width = Math.round((doneTotal / catalog.length) * 1000) / 10 + '%';
    }
    if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(doneTotal));
    stageDoneEls.forEach(function (el, stage) {
      el.textContent = String(doneByStage[stage] || 0);
    });

    pathChipEls.forEach(function (chip, slug) {
      chip.classList.toggle('done', isDone(slug));
    });
    if (pathData) {
      pathData.stages.forEach(function (stageInfo) {
        var el = pathStageDoneEls.get(stageInfo.stage);
        if (!el) return;
        var done = stageInfo.core.filter(function (item) { return isDone(item.slug); }).length;
        el.textContent = String(done);
      });
    }

    if (drawerSlug) renderDrawer(bySlug.get(drawerSlug));
  }

  function toggleMark(slug) {
    if (!slug || !bySlug.has(slug)) return;
    if (roadmapProgress[slug] === true) {
      delete roadmapProgress[slug];
    } else {
      roadmapProgress[slug] = true;
    }
    saveRoadmap();
    updateAll();
  }

  function resetProgress() {
    var message = '确定要清空全部路线图打卡记录吗？\n（题库做题记录不会被删除，已做题的主题仍会显示为已掌握。）';
    if (!window.confirm(message)) return;
    roadmapProgress = {};
    try {
      localStorage.removeItem(ROADMAP_KEY);
    } catch (err) { /* 忽略 */ }
    updateAll();
  }

  /* ---------- 详情抽屉 ---------- */

  function relChipHTML(entry) {
    var done = isDone(entry.slug);
    return '<button type="button" class="rel-chip' + (done ? ' done' : '') + '" data-goto="' + escapeHtml(entry.slug) + '">'
      + '<i class="dot diff-' + diffClassOf(entry.difficulty) + '" aria-hidden="true"></i>'
      + '<span class="chip-name">' + escapeHtml(entry.name) + '</span>'
      + (done ? '<span class="rel-done">✓</span>' : '')
      + '</button>';
  }

  function renderDrawer(entry) {
    if (!entry || !drawerBody) return;
    var done = isDone(entry.slug);
    var pres = (entry.prerequisites || []).map(function (slug) { return bySlug.get(slug); }).filter(Boolean);
    var deps = dependents.get(entry.slug) || [];
    var tags = entry.tags || [];

    drawerBody.innerHTML = ''
      + '<div class="drawer-meta">'
      + '<span class="meta-chip">' + escapeHtml(entry.category) + '</span>'
      + '<span class="meta-chip">阶段 ' + escapeHtml(entry.stage) + '</span>'
      + '<span class="meta-chip diff-' + diffClassOf(entry.difficulty) + '">' + escapeHtml(entry.difficulty) + '</span>'
      + '</div>'
      + '<h2 id="drawer-title">' + escapeHtml(entry.name) + '</h2>'
      + (tags.length ? '<div class="drawer-tags">' + tags.map(function (tag) {
          return '<span class="tag">#' + escapeHtml(tag) + '</span>';
        }).join('') + '</div>' : '')
      + '<p class="drawer-summary">' + escapeHtml(entry.summary || '') + '</p>'
      + (entry.complexity
        ? '<div class="drawer-block"><span class="block-label"><i data-lucide="gauge" aria-hidden="true"></i>复杂度</span>'
          + '<p class="block-empty">' + escapeHtml(entry.complexity) + '</p></div>'
        : '')
      + '<div class="drawer-block"><span class="block-label"><i data-lucide="corner-down-right" aria-hidden="true"></i>前置主题</span>'
      + (pres.length
        ? '<div class="rel-chips">' + pres.map(relChipHTML).join('') + '</div>'
        : '<p class="block-empty">没有前置主题，可以直接开始。</p>')
      + '</div>'
      + '<div class="drawer-block"><span class="block-label"><i data-lucide="git-branch" aria-hidden="true"></i>解锁后续</span>'
      + (deps.length
        ? '<div class="rel-chips">' + deps.map(relChipHTML).join('') + '</div>'
        : '<p class="block-empty">暂时没有以本主题为先修的主题。</p>')
      + '</div>'
      + '<div class="drawer-actions">'
      + '<a class="action action-primary" href="../' + encodeURIComponent(entry.slug) + '/" target="_blank" rel="noreferrer">'
      + '<i data-lucide="play" aria-hidden="true"></i>打开动画</a>'
      + '<a class="action" href="../learn/?slug=' + encodeURIComponent(entry.slug) + '">'
      + '<i data-lucide="book-open" aria-hidden="true"></i>结构化讲解</a>'
      + '<a class="action" href="../problems/?id=' + encodeURIComponent(entry.slug) + '">'
      + '<i data-lucide="code-2" aria-hidden="true"></i>在线题库</a>'
      + '<a class="action" href="' + escapeHtml(entry.source || '#') + '" target="_blank" rel="noreferrer">'
      + '<i data-lucide="github" aria-hidden="true"></i>查看源码</a>'
      + '<button type="button" id="drawer-mark" class="action action-mark' + (done ? ' is-done' : '') + '">'
      + (done
        ? '<i data-lucide="x" aria-hidden="true"></i>取消标记'
        : '<i data-lucide="check" aria-hidden="true"></i>标记已学')
      + '</button>'
      + '</div>';

    refreshIcons();
  }

  function syncURL(slug) {
    try {
      var params = new URLSearchParams();
      if (slug) params.set('focus', slug);
      if (activeView === 'board') params.set('view', 'board');
      var query = params.toString();
      if (location.search.replace(/^\?/, '') === query) return;
      history.pushState({ roadmapFocus: slug || null }, '', location.pathname + (query ? '?' + query : ''));
    } catch (err) { /* 受限环境忽略历史操作 */ }
  }

  function openDrawer(slug, options) {
    var entry = bySlug.get(slug);
    if (!entry || !drawer) return;
    var opts = options || {};

    drawerSlug = slug;
    renderDrawer(entry);
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.hidden = false;
    document.body.classList.add('drawer-lock');

    if (opts.trigger) lastTrigger = opts.trigger;
    if (opts.push !== false) syncURL(slug);
    if (opts.focus !== false) drawerClose.focus({ preventScroll: true });
  }

  function closeDrawer(push) {
    if (!drawer || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove('drawer-lock');
    drawerSlug = null;

    if (push !== false) syncURL(null);
    if (lastTrigger && document.contains(lastTrigger)) {
      lastTrigger.focus({ preventScroll: true });
    }
    lastTrigger = null;
  }

  function scrollChipIntoView(slug) {
    var map = activeView === 'path' ? pathChipEls : chipEls;
    var chip = map.get(slug) || chipEls.get(slug) || pathChipEls.get(slug);
    if (!chip) return;
    requestAnimationFrame(function () {
      chip.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
  }

  /* 重绘调度：rAF 节流 + 定时器兜底（页面在后台或动画帧被挂起时仍能重算连线） */
  function scheduleRedraw() {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    if (resizeTimer) clearTimeout(resizeTimer);
    var run = function () {
      resizeRaf = 0;
      resizeTimer = 0;
      drawEdges();
    };
    resizeRaf = requestAnimationFrame(run);
    resizeTimer = setTimeout(run, 150);
  }

  /* ---------- 事件绑定 ---------- */

  function wireEvents() {
    board.addEventListener('click', function (event) {
      var chip = event.target.closest('.chip');
      if (chip) {
        openDrawer(chip.getAttribute('data-slug'), { push: true, trigger: chip, focus: true });
        return;
      }
      var mini = event.target.closest('.prereq-mini');
      if (mini) {
        openDrawer(mini.getAttribute('data-goto'), { push: true, focus: true });
      }
    });

    board.addEventListener('mouseover', function (event) {
      var chip = event.target.closest('.chip');
      if (!chip || chip.getAttribute('data-slug') === hoverSlug) return;
      hoverSlug = chip.getAttribute('data-slug');
      highlightEdges(hoverSlug);
    });

    board.addEventListener('mouseout', function (event) {
      var chip = event.target.closest('.chip');
      if (!chip) return;
      if (event.relatedTarget && chip.contains(event.relatedTarget)) return;
      hoverSlug = null;
      highlightEdges(null);
    });

    board.addEventListener('focusin', function (event) {
      var chip = event.target.closest('.chip');
      if (!chip) return;
      hoverSlug = chip.getAttribute('data-slug');
      highlightEdges(hoverSlug);
    });

    board.addEventListener('focusout', function (event) {
      var chip = event.target.closest('.chip');
      if (!chip) return;
      if (event.relatedTarget && chip.contains(event.relatedTarget)) return;
      hoverSlug = null;
      highlightEdges(null);
    });

    searchInput.addEventListener('input', applySearch);
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && firstMatchSlug) {
        event.preventDefault();
        openDrawer(firstMatchSlug, { push: true, focus: true });
      }
    });

    resetBtn.addEventListener('click', resetProgress);
    if (nextUpBtn) nextUpBtn.addEventListener('click', continueLearning);
    if (viewPathBtn) viewPathBtn.addEventListener('click', function () { setView('path'); });
    if (viewBoardBtn) viewBoardBtn.addEventListener('click', function () { setView('board'); });

    if (pathView) {
      pathView.addEventListener('click', function (event) {
        var node = event.target.closest('.path-node, .path-ext-chip');
        if (node) openDrawer(node.getAttribute('data-slug'), { push: true, trigger: node, focus: true });
      });
    }

    drawerBody.addEventListener('click', function (event) {
      var mark = event.target.closest('#drawer-mark');
      if (mark) {
        toggleMark(drawerSlug);
        return;
      }
      var rel = event.target.closest('[data-goto]');
      if (rel) {
        openDrawer(rel.getAttribute('data-goto'), { push: true, focus: true });
      }
    });

    drawerClose.addEventListener('click', function () { closeDrawer(true); });
    backdrop.addEventListener('click', function () { closeDrawer(true); });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (drawer.classList.contains('open')) {
        closeDrawer(true);
      } else if (searchInput.value) {
        clearSearch();
      }
    });

    window.addEventListener('resize', function () {
      scheduleRedraw();
    });

    window.addEventListener('popstate', function () {
      var slug = slugFromLocation();
      if (slug && bySlug.has(slug)) {
        openDrawer(slug, { push: false, focus: false });
        scrollChipIntoView(slug);
      } else {
        closeDrawer(false);
      }
    });
  }

  /* ---------- 启动 ---------- */

  function init() {
    buildBoard();
    buildPathView();
    wireEvents();
    refreshIcons();
    updateAll();
    setView(requestedView());
    drawEdges();

    if (document.fonts && typeof document.fonts.ready === 'object' && document.fonts.ready.then) {
      document.fonts.ready.then(function () { drawEdges(); });
    }
    window.addEventListener('load', function () { drawEdges(); });

    /* 视口就绪节奏因环境而异，短窗口内多次重算保证连线与最终布局对齐 */
    [80, 250, 600, 1200].forEach(function (delay) {
      setTimeout(drawEdges, delay);
    });

    var initial = slugFromLocation();
    if (initial && bySlug.has(initial)) {
      openDrawer(initial, { push: false, focus: false });
      scrollChipIntoView(initial);
    }
  }

  init();
})();
