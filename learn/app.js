(() => {
  'use strict';

  // ---------- 数据源（catalog-data.js / problems/problem-data.js / explain-data.js 均在页面中先行加载） ----------
  const catalog = Array.isArray(window.ALGORITHM_CATALOG) ? window.ALGORITHM_CATALOG : [];
  const problemRows = Array.isArray(window.PROBLEM_DATA) ? window.PROBLEM_DATA : [];
  const EXPLAIN = window.LEARNING_EXPLAIN || { topics: {}, categoryFallback: {} };

  const coreBySlug = new Map();
  problemRows.forEach((row) => {
    if (row && row.variant === 'core' && row.baseSlug) coreBySlug.set(row.baseSlug, row);
  });

  const bySlug = new Map(catalog.map((entry) => [entry.slug, entry]));
  const dependentsBySlug = new Map(); // slug -> 以该主题为前置的条目（反向依赖）
  catalog.forEach((entry) => {
    (Array.isArray(entry.prerequisites) ? entry.prerequisites : []).forEach((pre) => {
      if (!dependentsBySlug.has(pre)) dependentsBySlug.set(pre, []);
      dependentsBySlug.get(pre).push(entry);
    });
  });

  const categories = [...new Set(catalog.map((entry) => entry.category))];
  const DIFF_CLASS = { '基础': 'basic', '进阶': 'intermediate', '高级': 'advanced' };
  const STAGES = [1, 2, 3, 4];

  // ---------- 原创兜底文案（explain-data.js 未覆盖时使用） ----------
  const GENERIC_BRUTE = '先放下所有技巧，把问题拆成三个最直白的动作：枚举每一个候选答案，逐项检查它是否满足全部约束，再在可行的候选里保留当前最优。用最朴素的多层循环把这条流程实现一遍，它足以处理小规模数据，也能帮我们确认状态定义和答案判定没有想错。跑通之后再回头观察：哪一层循环在做重复计算？哪个中间结果可以被缓存？哪一整批候选可以提前剪掉？这些答案就是通往高效解法的路标。';

  const NON_READY_HINT = '本主题的判题样例与输入契约将随题库批次补充，先结合下方讲解与动画理解思路，等题库开放后再回来动手验证。';

  const SOLUTION_PLACEHOLDER = '参考实现将随题库批次补全。当前可以先观看上方动画，对照「核心思路与不变量」自己写出第一版实现，再到在线题库提交验证。';

  const VIZ_TIP = '拖动进度条或调整参数，观察每一步操作之后状态是否仍与上方的不变量保持一致；先在心里预测下一步，再让动画给你答案。';

  const $ = (id) => document.getElementById(id);
  const article = $('topic-article');
  const state = { query: '', category: '', slug: '' };
  let renderSeq = 0; // 异步填充（参考实现）时防止竞态

  // ---------- 基础工具 ----------
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  // 样例的 input / output 可能是对象、数字或字符串，统一转成可读文本
  function formatValue(value) {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16 } });
  }

  function slugFromURL() {
    return new URLSearchParams(location.search).get('slug');
  }

  // ---------- HTML 片段 ----------
  function codeBlock(code) {
    return `<pre class="code-block"><code>${escapeHtml(code)}</code></pre>`;
  }

  function codeFrame(label, code) {
    return `<div class="code-frame"><div class="code-frame-head"><span>${escapeHtml(label)}</span></div>${codeBlock(code)}</div>`;
  }

  function section(num, icon, title, body) {
    return `<section class="topic-section"><h2 class="section-title"><span class="section-num">${num}</span><i data-lucide="${icon}" aria-hidden="true"></i>${escapeHtml(title)}</h2>${body}</section>`;
  }

  function exampleBlock(example, index) {
    const note = example && example.explanation
      ? `<p class="example-note"><span>说明</span>${escapeHtml(example.explanation)}</p>`
      : '';
    return `<div class="example-block">
      <div class="example-head">样例 ${index + 1}</div>
      ${codeFrame('输入', formatValue(example && example.input))}
      ${codeFrame('输出', formatValue(example && example.output))}
      ${note}
    </div>`;
  }

  function topicChip(target) {
    return `<button type="button" class="topic-chip" data-target-slug="${escapeHtml(target.slug)}"><i data-lucide="chevron-right" aria-hidden="true"></i>${escapeHtml(target.name)}</button>`;
  }

  // ---------- 正文各板块 ----------
  function renderHero(entry, index) {
    const tags = Array.isArray(entry.tags) ? entry.tags : [];
    const complexity = entry.complexity || '暂无复杂度信息。';
    return `<header class="topic-hero">
      <p class="topic-eyebrow">STAGE ${Number(entry.stage) || '?'} · 第 ${index + 1} / ${catalog.length} 讲 · ${escapeHtml(entry.category)}</p>
      <h1>${escapeHtml(entry.name)}</h1>
      <div class="chip-row">
        <span class="chip diff-${DIFF_CLASS[entry.difficulty] || 'basic'}">${escapeHtml(entry.difficulty || '未分级')}</span>
        <span class="chip chip-cat">${escapeHtml(entry.category)}</span>
        <span class="chip chip-stage">阶段 S${entry.stage}</span>
        ${tags.map((tag) => `<span class="chip chip-tag">#${escapeHtml(tag)}</span>`).join('')}
      </div>
      <p class="complexity-line"><i data-lucide="gauge" aria-hidden="true"></i>${escapeHtml(complexity)}</p>
    </header>`;
  }

  function renderIntro(entry, core) {
    const judgeReady = core.judgeReady === true;
    if (!judgeReady) {
      return section('02', 'lightbulb', '问题引入', `<div class="prose"><p>${escapeHtml(entry.problem || entry.summary)}</p></div>
        <p class="pending-note"><i data-lucide="clock" aria-hidden="true"></i>${NON_READY_HINT}</p>`);
    }
    const examples = Array.isArray(core.examples) ? core.examples : [];
    const constraints = Array.isArray(core.constraints) ? core.constraints : [];
    const exampleHtml = examples.length
      ? examples.map((example, index) => exampleBlock(example, index)).join('')
      : '<p class="pending-note"><i data-lucide="clock" aria-hidden="true"></i>该主题已具备判题能力，但展示样例尚未配置，可直接前往在线题库查看。</p>';
    return section('02', 'lightbulb', '问题引入', `
      <div class="prose"><p>${escapeHtml(core.statement || entry.summary)}</p></div>
      <div class="io-grid">
        <div class="io-card"><h3><i data-lucide="log-in" aria-hidden="true"></i>输入约定</h3><p>${escapeHtml(core.input || '见约束与样例。')}</p></div>
        <div class="io-card"><h3><i data-lucide="log-out" aria-hidden="true"></i>输出约定</h3><p>${escapeHtml(core.output || '见判题样例。')}</p></div>
      </div>
      <h3 class="sub-title">约束条件</h3>
      <ul class="constraint-list">${constraints.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>暂无约束说明。</li>'}</ul>
      <h3 class="sub-title">判题样例</h3>
      ${exampleHtml}`);
  }

  function renderBrute(entry, explain) {
    const topicBrute = explain && typeof explain.brute === 'string' && explain.brute.trim();
    const text = topicBrute
      ? explain.brute
      : (EXPLAIN.categoryFallback && EXPLAIN.categoryFallback[entry.category]) || GENERIC_BRUTE;
    const badge = topicBrute
      ? '<span class="badge badge-fine">精修</span><span class="source-note">来自本主题的定制讲解</span>'
      : '<span class="badge badge-generic">通用</span><span class="source-note">该类目的通用思路，后续会逐主题精修</span>';
    const code = topicBrute && typeof explain.bruteCode === 'string' && explain.bruteCode.trim()
      ? codeFrame('暴力参考代码 · Python', explain.bruteCode)
      : '';
    return section('03', 'hammer', '先想暴力解', `<div class="source-row">${badge}</div><div class="prose"><p>${escapeHtml(text)}</p></div>${code}`);
  }

  function renderIdea(entry, core) {
    const exp = core.explanation || {};
    const mental = exp.mental || entry.summary;
    const invariant = exp.invariant;
    const body = `<div class="prose"><p>${escapeHtml(mental)}</p></div>${invariant
      ? `<div class="invariant-box"><span class="invariant-tag"><i data-lucide="anchor" aria-hidden="true"></i>核心不变量</span><p>${escapeHtml(invariant)}</p></div>`
      : ''}`;
    return section('04', 'anchor', '核心思路与不变量', body);
  }

  function renderSteps(entry, explain, core) {
    const exp = core.explanation || {};
    const steps = Array.isArray(exp.steps) ? exp.steps : [];
    let body = steps.length
      ? `<ol class="step-list">${steps.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`
      : '<p class="muted-note">本主题暂未配置分步推导，可以先观看下方动画，自己归纳出关键步骤。</p>';
    const walk = explain && explain.walkthrough;
    if (walk && Array.isArray(walk.steps) && walk.steps.length) {
      body += `<div class="walkthrough">
        <div class="walkthrough-head"><i data-lucide="footprints" aria-hidden="true"></i>跟一个例子走一遍</div>
        ${walk.input ? `<p class="walkthrough-input">${escapeHtml(String(walk.input))}</p>` : ''}
        <ol class="walkthrough-steps">${walk.steps.map((item, index) => `<li><span class="step-no">${index + 1}</span><p>${escapeHtml(String(item))}</p></li>`).join('')}</ol>
      </div>`;
    }
    return section('05', 'list-ordered', '分步推导', body);
  }

  function renderComplexity(entry, core) {
    const text = entry.complexity || core.complexity || '暂无复杂度信息。';
    return section('06', 'gauge', '复杂度', `<p class="complexity-box"><i data-lucide="gauge" aria-hidden="true"></i>${escapeHtml(text)}</p>`);
  }

  function renderPitfalls(core) {
    const exp = core.explanation || {};
    const pitfalls = Array.isArray(exp.pitfalls) ? exp.pitfalls : [];
    const body = pitfalls.length
      ? `<ul class="pitfall-list">${pitfalls.map((item) => `<li><i data-lucide="alert-triangle" aria-hidden="true"></i><span>${escapeHtml(item)}</span></li>`).join('')}</ul>`
      : '<p class="muted-note">暂无记录。实现时重点关注：每一次操作之后，上方的不变量是否依然成立。</p>';
    return section('07', 'alert-triangle', '常见错误', body);
  }

  function renderVisualization(entry) {
    return section('08', 'monitor-play', '动手可视化', `
      <div class="viz-frame">
        <div class="viz-bar">
          <span><i data-lucide="monitor-play" aria-hidden="true"></i>${escapeHtml(entry.name)} · 交互演示</span>
          <a href="../${encodeURIComponent(entry.slug)}/" target="_blank" rel="noreferrer">在新窗口打开<i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
        </div>
        <iframe src="../${encodeURIComponent(entry.slug)}/" title="${escapeHtml(entry.name)} 交互演示" loading="lazy"></iframe>
      </div>
      <p class="viz-tip">${VIZ_TIP}</p>`);
  }

  function renderSolution(entry, core) {
    if (core.judgeReady === true) {
      return section('09', 'file-code', '参考实现', `<div class="code-frame" id="solution-frame"><div class="code-frame-head"><span>参考实现 · solution.py</span></div><pre class="code-block" id="solution-code"><code>正在加载参考实现…</code></pre></div>`);
    }
    return section('09', 'file-code', '参考实现', `<p class="pending-note"><i data-lucide="clock" aria-hidden="true"></i>${SOLUTION_PLACEHOLDER}</p>`);
  }

  function renderNext(entry) {
    const prereqs = (Array.isArray(entry.prerequisites) ? entry.prerequisites : [])
      .map((slug) => bySlug.get(slug))
      .filter(Boolean);
    const dependents = dependentsBySlug.get(entry.slug) || [];
    return section('10', 'compass', '继续学习', `
      <div class="next-grid">
        <div class="next-block"><h3>前置主题</h3><div class="chip-row">${prereqs.length ? prereqs.map(topicChip).join('') : '<span class="chip-empty">没有前置要求，可以直接从这里开始。</span>'}</div></div>
        <div class="next-block"><h3>后续主题</h3><div class="chip-row">${dependents.length ? dependents.map(topicChip).join('') : '<span class="chip-empty">暂时没有以本主题为先修的条目。</span>'}</div></div>
      </div>
      <div class="link-buttons">
        <a class="btn btn-primary" href="../problems/?id=${encodeURIComponent(entry.slug)}"><i data-lucide="code-2" aria-hidden="true"></i>在线题库</a>
        <a class="btn" href="../guides/?slug=${encodeURIComponent(entry.slug)}"><i data-lucide="book-open" aria-hidden="true"></i>图文指南</a>
        <a class="btn" href="${escapeHtml(entry.source || '#')}" target="_blank" rel="noreferrer"><i data-lucide="github" aria-hidden="true"></i>查看源码</a>
      </div>`);
  }

  function renderTopicArticle(entry) {
    const core = coreBySlug.get(entry.slug) || {};
    const explain = (EXPLAIN.topics && EXPLAIN.topics[entry.slug]) || null;
    return [
      renderHero(entry, catalog.indexOf(entry)),
      renderIntro(entry, core),
      renderBrute(entry, explain),
      renderIdea(entry, core),
      renderSteps(entry, explain, core),
      renderComplexity(entry, core),
      renderPitfalls(core),
      renderVisualization(entry),
      renderSolution(entry, core),
      renderNext(entry),
    ].join('');
  }

  // ---------- 参考实现（异步加载，带渲染序号防竞态） ----------
  function showSolutionMessage(message) {
    const frame = document.getElementById('solution-frame');
    if (!frame) return;
    const note = document.createElement('p');
    note.className = 'pending-note error';
    note.textContent = message;
    frame.replaceWith(note);
  }

  async function fetchSolution(slug, seq) {
    try {
      const response = await fetch(`../${encodeURIComponent(slug)}/solution.py`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const code = await response.text();
      if (seq !== renderSeq) return;
      if (!code.trim()) {
        showSolutionMessage('参考实现文件存在但内容为空，先自行实现一版，再到题库中比对结果。');
        return;
      }
      const target = document.getElementById('solution-code');
      if (target) target.innerHTML = `<code>${escapeHtml(code.replace(/\s+$/, ''))}</code>`;
    } catch (error) {
      if (seq === renderSeq) {
        showSolutionMessage(`参考实现加载失败（${escapeHtml(error.message)}）。可以前往该主题目录直接查看源码，或先自行实现。`);
      }
    }
  }

  // ---------- 侧栏列表 ----------
  function visibleEntries() {
    const query = state.query.trim().toLocaleLowerCase('zh-CN');
    return catalog.filter((entry) => {
      const tags = Array.isArray(entry.tags) ? entry.tags : [];
      const text = [entry.name, entry.slug, entry.summary, ...tags].join(' ').toLocaleLowerCase('zh-CN');
      return (!query || text.includes(query)) && (!state.category || entry.category === state.category);
    });
  }

  function renderList() {
    const list = $('learn-list');
    const entries = visibleEntries();
    $('learn-count').textContent = `${entries.length} 个主题`;
    if (!entries.length) {
      list.innerHTML = '<p class="list-empty">没有匹配的主题，换个关键词试试。</p>';
      return;
    }
    list.innerHTML = STAGES
      .map((stage) => {
        const items = entries.filter((entry) => Number(entry.stage) === stage);
        if (!items.length) return '';
        return `<p class="stage-head"><span>阶段 ${stage}</span><small>${items.length} 个</small></p>${items
          .map((entry) => `<button type="button" data-slug="${escapeHtml(entry.slug)}" aria-current="${entry.slug === state.slug ? 'page' : 'false'}"><b>${escapeHtml(entry.name)}</b><small>${escapeHtml(entry.category)} · ${escapeHtml(entry.difficulty || '')}</small></button>`)
          .join('')}`;
      })
      .join('');
    list.querySelectorAll('[data-slug]').forEach((button) => {
      button.addEventListener('click', () => loadTopic(button.dataset.slug));
    });
  }

  // ---------- 主题切换 ----------
  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    $('sidebar-backdrop').hidden = true;
  }

  function loadTopic(slug, options = {}) {
    const push = options.push !== false;
    const entry = bySlug.get(slug) || catalog[0];
    if (!entry) {
      article.innerHTML = '<p class="loading">目录为空，暂无可展示的主题。</p>';
      return;
    }
    state.slug = entry.slug;
    renderList();
    closeSidebar();

    const seq = ++renderSeq;
    article.innerHTML = renderTopicArticle(entry);
    refreshIcons();
    const core = coreBySlug.get(entry.slug);
    if (core && core.judgeReady === true) fetchSolution(entry.slug, seq);

    document.title = `${entry.name} · 结构化讲解`;
    $('mobile-topic').textContent = entry.name;
    const url = `?slug=${encodeURIComponent(entry.slug)}`;
    if (push) history.pushState({ slug: entry.slug }, '', url);
    else history.replaceState({ slug: entry.slug }, '', url);
    window.scrollTo(0, 0);
  }

  // ---------- 事件绑定 ----------
  $('learn-search').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderList();
  });

  const categorySelect = $('learn-category');
  categorySelect.insertAdjacentHTML('beforeend', categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join(''));
  categorySelect.addEventListener('change', () => {
    state.category = categorySelect.value;
    renderList();
  });

  $('open-sidebar').addEventListener('click', () => {
    document.body.classList.add('sidebar-open');
    $('sidebar-backdrop').hidden = false;
  });
  $('close-sidebar').addEventListener('click', closeSidebar);
  $('sidebar-backdrop').addEventListener('click', closeSidebar);

  // 正文内所有「主题跳转 chip」统一走事件委托
  article.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-target-slug]');
    if (chip) loadTopic(chip.dataset.targetSlug);
  });

  addEventListener('popstate', () => {
    loadTopic(slugFromURL() || (catalog[0] && catalog[0].slug), { push: false });
  });

  // ---------- 首载（无 slug 或 slug 不存在时取第一个主题） ----------
  const initialSlug = slugFromURL();
  loadTopic(bySlug.has(initialSlug) ? initialSlug : (catalog[0] && catalog[0].slug), { push: false });
  refreshIcons();
})();
