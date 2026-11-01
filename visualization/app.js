/* 可视化速查 · 算法可视化图谱
 * 数据来源：window.ALGORITHM_CATALOG（由 ../catalog-data.js 注入）。
 * 功能：分类速查索引（搜索 + 难度筛选）、预览抽屉（iframe 就地加载动画）。
 * 动画页均为独立 demo，站内跳转一律使用相对路径 ../<slug>/。
 */
(function () {
  'use strict';

  var DIFF_CLASS = { '基础': 'diff-1', '进阶': 'diff-2', '高级': 'diff-3' };
  var LOAD_TIMEOUT = 10000;

  var catalog = Array.isArray(window.ALGORITHM_CATALOG) ? window.ALGORITHM_CATALOG : [];

  /* ---------- DOM 引用 ---------- */

  var catalogEl = document.getElementById('catalog');
  var searchInput = document.getElementById('catalog-search');
  var emptyState = document.getElementById('empty-state');
  var resultCountEl = document.getElementById('result-count');
  var resultTotalEl = document.getElementById('result-total');

  var statTopics = document.getElementById('stat-topics');
  var statCategories = document.getElementById('stat-categories');
  var statBasic = document.getElementById('stat-basic');
  var statMedium = document.getElementById('stat-medium');
  var statHard = document.getElementById('stat-hard');

  var drawer = document.getElementById('preview-drawer');
  var backdrop = document.getElementById('preview-backdrop');
  var drawerClose = document.getElementById('preview-close');
  var drawerTitle = document.getElementById('preview-title');
  var drawerOpenLink = document.getElementById('preview-open');
  var loadingEl = document.getElementById('preview-loading');
  var frame = document.getElementById('preview-frame');

  /* ---------- 运行时状态 ---------- */

  var query = '';
  var difficulty = '全部';
  var rows = [];            // [{ el, group, searchText, difficulty }]
  var groups = [];          // [{ el, cards }]
  var drawerOpen = false;
  var pendingLoad = false;
  var loadTimer = 0;
  var lastTrigger = null;

  /* ---------- 工具函数 ---------- */

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
      } catch (err) { /* 图标库异常不影响功能 */ }
    }
  }

  function setSearchText(entry) {
    return [
      entry.name || '',
      entry.summary || '',
      (entry.tags || []).join(' ')
    ].join(' ').toLowerCase();
  }

  /* ---------- 统计条 ---------- */

  function renderStats() {
    var counts = { '基础': 0, '进阶': 0, '高级': 0 };
    var categories = {};
    catalog.forEach(function (entry) {
      if (!entry || !entry.slug) return;
      if (counts[entry.difficulty] != null) counts[entry.difficulty] += 1;
      categories[entry.category] = true;
    });
    var categoryCount = Object.keys(categories).length;

    statTopics.textContent = String(catalog.length);
    statCategories.textContent = String(categoryCount);
    statBasic.textContent = String(counts['基础']);
    statMedium.textContent = String(counts['进阶']);
    statHard.textContent = String(counts['高级']);
    resultTotalEl.textContent = String(catalog.length);
  }

  /* ---------- 分类索引渲染 ---------- */

  function buildCard(entry) {
    var li = document.createElement('li');
    li.className = 'topic-card';
    li.innerHTML = ''
      + '<h3 class="card-name" title="' + escapeHtml(entry.name) + '">' + escapeHtml(entry.name) + '</h3>'
      + '<p class="card-summary" title="' + escapeHtml(entry.summary || '') + '">' + escapeHtml(entry.summary || '') + '</p>'
      + '<div class="card-meta">'
      +   '<span class="diff-chip ' + (DIFF_CLASS[entry.difficulty] || '') + '">' + escapeHtml(entry.difficulty || '基础') + '</span>'
      +   '<span class="stage-tag" title="学习阶段 ' + escapeHtml(entry.stage) + '">S' + escapeHtml(entry.stage) + '</span>'
      + '</div>'
      + '<div class="card-actions">'
      +   '<button type="button" class="card-btn primary" data-preview><i data-lucide="play" aria-hidden="true"></i>预览</button>'
      +   '<a class="card-btn" href="../' + encodeURIComponent(entry.slug) + '/" target="_blank" rel="noreferrer">'
      +     '<i data-lucide="external-link" aria-hidden="true"></i>新窗口打开'
      +   '</a>'
      + '</div>';

    var previewBtn = li.querySelector('[data-preview]');
    if (previewBtn) {
      previewBtn.addEventListener('click', function () {
        openPreview(entry, previewBtn);
      });
    }
    return li;
  }

  function renderCatalog() {
    if (!catalogEl) return;
    catalogEl.textContent = '';

    var seen = {};
    groups = [];
    rows = [];

    catalog.forEach(function (entry) {
      if (!entry || !entry.slug || !entry.category) return;
      var group = seen[entry.category];
      if (!group) {
        var section = document.createElement('section');
        section.className = 'group';
        var category = entry.category;
        section.setAttribute('aria-label', category + '分类');
        section.innerHTML = ''
          + '<div class="group-head">'
          +   '<h2>' + escapeHtml(category) + '</h2>'
          +   '<span class="group-count" data-group-count>0</span>'
          + '</div>'
          + '<ul class="card-grid"></ul>';
        catalogEl.appendChild(section);
        group = {
          category: category,
          el: section,
          grid: section.querySelector('.card-grid'),
          countEl: section.querySelector('[data-group-count]'),
          cards: []
        };
        seen[category] = group;
        groups.push(group);
      }
      var card = buildCard(entry);
      group.grid.appendChild(card);
      group.cards.push(card);
      rows.push({
        el: card,
        group: group,
        searchText: setSearchText(entry),
        difficulty: entry.difficulty || ''
      });
    });

    groups.forEach(function (group) {
      group.countEl.textContent = String(group.cards.length);
    });
    refreshIcons();
  }

  /* ---------- 筛选 ---------- */

  function applyFilter() {
    var needle = query.trim().toLowerCase();
    var visibleTotal = 0;

    rows.forEach(function (row) {
      var match = (difficulty === '全部' || row.difficulty === difficulty)
        && (!needle || row.searchText.indexOf(needle) !== -1);
      row.el.hidden = !match;
      if (match) visibleTotal += 1;
    });

    groups.forEach(function (group) {
      var visible = 0;
      group.cards.forEach(function (card) {
        if (!card.hidden) visible += 1;
      });
      group.el.hidden = visible === 0;
    });

    resultCountEl.textContent = String(visibleTotal);
    emptyState.hidden = visibleTotal !== 0;
    catalogEl.hidden = visibleTotal === 0;
  }

  function bindToolbar() {
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        query = searchInput.value;
        applyFilter();
      });
    }

    var buttons = document.querySelectorAll('.diff-btn');
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('aria-pressed') === 'true') return;
        difficulty = btn.getAttribute('data-diff') || '全部';
        Array.prototype.forEach.call(buttons, function (other) {
          other.setAttribute('aria-pressed', other === btn ? 'true' : 'false');
        });
        applyFilter();
      });
    });
  }

  /* ---------- 预览抽屉 ---------- */

  function showLoading() {
    loadingEl.hidden = false;
    frame.hidden = true;
  }

  function handleFrameLoad() {
    if (!pendingLoad) return;
    pendingLoad = false;
    window.clearTimeout(loadTimer);
    loadingEl.hidden = true;
    frame.hidden = false;
  }

  function openPreview(entry, trigger) {
    if (!entry || !drawer) return;
    drawerTitle.textContent = entry.name || entry.slug;
    drawerOpen = true;
    if (trigger) lastTrigger = trigger;

    showLoading();
    pendingLoad = true;
    frame.src = '../' + encodeURIComponent(entry.slug) + '/';
    drawerOpenLink.href = '../' + encodeURIComponent(entry.slug) + '/';

    window.clearTimeout(loadTimer);
    loadTimer = window.setTimeout(function () {
      // 加载过慢时不再永久阻塞：直接露出 iframe，由用户自行判断
      if (pendingLoad) {
        pendingLoad = false;
        loadingEl.hidden = true;
        frame.hidden = false;
      }
    }, LOAD_TIMEOUT);

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    document.body.classList.add('drawer-lock');
    drawerClose.focus({ preventScroll: true });
  }

  function closePreview() {
    if (!drawer || !drawerOpen) return;
    drawerOpen = false;
    pendingLoad = false;
    window.clearTimeout(loadTimer);

    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    document.body.classList.remove('drawer-lock');

    // 停掉抽屉里的动画，避免后台继续占用资源
    frame.hidden = true;
    showLoading();
    frame.src = 'about:blank';

    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus({ preventScroll: true });
      lastTrigger = null;
    }
  }

  function focusablesInDrawer() {
    return drawer.querySelectorAll('a[href], button:not([disabled])');
  }

  function bindDrawer() {
    if (frame) frame.addEventListener('load', handleFrameLoad);
    if (drawerClose) drawerClose.addEventListener('click', closePreview);
    if (backdrop) backdrop.addEventListener('click', closePreview);

    document.addEventListener('keydown', function (event) {
      if (!drawerOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closePreview();
        return;
      }
      if (event.key === 'Tab') {
        // 简易焦点圈：Tab 在抽屉内的可聚焦元素间循环
        var items = focusablesInDrawer();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------- 启动 ---------- */

  function init() {
    renderStats();
    renderCatalog();
    bindToolbar();
    bindDrawer();
    applyFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
