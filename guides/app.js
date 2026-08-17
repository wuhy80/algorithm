(() => {
  'use strict';

  const catalog = Array.isArray(window.ALGORITHM_CATALOG) ? window.ALGORITHM_CATALOG : [];
  const bySlug = new Map(catalog.map((entry) => [entry.slug, entry]));
  const $ = (id) => document.getElementById(id);
  const state = { query: '', category: '', slug: '' };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  function safeUrl(value) {
    const decoded = String(value).replace(/&amp;/g, '&');
    return /^(https?:\/\/|\.\.\/|\.\/|#)/.test(decoded) ? value : '#';
  }

  function inline(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)]\(([^)]+)\)/g, (_match, label, url) => {
        const href = safeUrl(url);
        const external = /^https?:\/\//.test(href) ? ' target="_blank" rel="noreferrer"' : '';
        return `<a href="${href}"${external}>${label}</a>`;
      });
  }

  function tableCells(line) {
    return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
  }

  function isTableDivider(line) {
    const cells = tableCells(line);
    return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    const html = [];
    let index = 0;
    let headingIndex = 0;
    while (index < lines.length) {
      const line = lines[index];
      if (!line.trim()) { index += 1; continue; }
      if (line.startsWith('```')) {
        const language = line.slice(3).trim();
        const code = [];
        index += 1;
        while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++]);
        index += 1;
        html.push(`<pre><code${language ? ` data-language="${escapeHtml(language)}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`);
        continue;
      }
      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        headingIndex += 1;
        html.push(`<h${level} id="section-${headingIndex}">${inline(heading[2])}</h${level}>`);
        index += 1;
        continue;
      }
      if (line.includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
        const headers = tableCells(line);
        const rows = [];
        index += 2;
        while (index < lines.length && lines[index].includes('|') && lines[index].trim()) rows.push(tableCells(lines[index++]));
        html.push(`<div class="table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
        continue;
      }
      if (/^>\s?/.test(line)) {
        const quote = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ''));
        html.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
        continue;
      }
      if (/^-\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^-\s+/.test(lines[index])) items.push(lines[index++].replace(/^-\s+/, ''));
        html.push(`<ul>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
        continue;
      }
      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^\d+\.\s+/.test(lines[index])) items.push(lines[index++].replace(/^\d+\.\s+/, ''));
        html.push(`<ol>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ol>`);
        continue;
      }
      const paragraph = [line.trim()];
      index += 1;
      while (index < lines.length && lines[index].trim() && !/^(#{1,6})\s+|^```|^>\s?|^-\s+|^\d+\.\s+/.test(lines[index]) && !(lines[index].includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1]))) {
        paragraph.push(lines[index++].trim());
      }
      html.push(`<p>${inline(paragraph.join(' '))}</p>`);
    }
    return html.join('');
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16 } });
  }

  function visibleEntries() {
    const query = state.query.trim().toLocaleLowerCase('zh-CN');
    return catalog.filter((entry) => {
      const text = [entry.name,entry.slug,entry.summary,entry.category,...entry.tags].join(' ').toLocaleLowerCase('zh-CN');
      return (!query || text.includes(query)) && (!state.category || entry.category === state.category);
    });
  }

  function renderList() {
    const entries = visibleEntries();
    $('guide-count').textContent = `${entries.length} 个专题`;
    $('guide-list').innerHTML = entries.map((entry) => `<button type="button" data-slug="${entry.slug}" aria-current="${entry.slug === state.slug ? 'page' : 'false'}"><span>${String(entry.stage).padStart(2,'0')}</span><span><b>${escapeHtml(entry.name)}</b><small>${escapeHtml(entry.category)}</small></span></button>`).join('');
    document.querySelectorAll('[data-slug]').forEach((button) => button.addEventListener('click', () => loadGuide(button.dataset.slug)));
  }

  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    $('sidebar-backdrop').hidden = true;
  }

  async function loadGuide(slug, replace = false) {
    const entry = bySlug.get(slug);
    if (!entry) return;
    state.slug = slug;
    renderList();
    closeSidebar();
    $('topic-position').textContent = `STAGE ${entry.stage} · GUIDE ${String(catalog.indexOf(entry) + 1).padStart(3,'0')}`;
    $('topic-title').textContent = entry.name;
    $('topic-meta').textContent = `${entry.category} · ${entry.difficulty} · ${entry.tags.slice(0,3).join(' / ')}`;
    $('topic-demo').href = entry.demo;
    $('topic-source').href = entry.source;
    $('topic-problems').href = `../problems/?id=${encodeURIComponent(entry.slug)}`;
    $('guide-content').innerHTML = '<p class="loading">正在加载学习指南...</p>';
    document.title = `${entry.name} · 学习指南`;
    if (replace) history.replaceState({slug}, '', `?slug=${encodeURIComponent(slug)}`);
    else history.pushState({slug}, '', `?slug=${encodeURIComponent(slug)}`);
    try {
      const response = await fetch(`../${encodeURIComponent(slug)}/README.md`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      $('guide-content').innerHTML = renderMarkdown(await response.text());
    } catch (error) {
      $('guide-content').innerHTML = `<p class="guide-error">学习指南加载失败：${escapeHtml(error.message)}</p>`;
    }
    refreshIcons();
    window.scrollTo(0, 0);
  }

  const categories = [...new Set(catalog.map((entry) => entry.category))];
  $('guide-category').insertAdjacentHTML('beforeend', categories.map((category) => `<option>${escapeHtml(category)}</option>`).join(''));
  $('guide-search').addEventListener('input', () => { state.query = $('guide-search').value; renderList(); });
  $('guide-category').addEventListener('change', () => { state.category = $('guide-category').value; renderList(); });
  $('open-sidebar').addEventListener('click', () => { document.body.classList.add('sidebar-open'); $('sidebar-backdrop').hidden = false; });
  $('close-sidebar').addEventListener('click', closeSidebar);
  $('sidebar-backdrop').addEventListener('click', closeSidebar);
  addEventListener('popstate', () => loadGuide(new URLSearchParams(location.search).get('slug') || catalog[0]?.slug, true));

  const initialSlug = new URLSearchParams(location.search).get('slug');
  loadGuide(bySlug.has(initialSlug) ? initialSlug : catalog[0]?.slug, true);
  refreshIcons();
})();
