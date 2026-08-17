(() => {
  'use strict';

  const problems = Array.isArray(window.PROBLEM_DATA) ? window.PROBLEM_DATA : [];
  const bySlug = new Map(problems.map((problem) => [problem.slug, problem]));
  const $ = (id) => document.getElementById(id);
  const storageKey = 'algorithm-problem-progress-v1';
  const draftKey = 'algorithm-problem-drafts-v1';
  const state = { query: '', category: '', difficulty: '', stage: '', status: '', sort: 'id' };
  let progress = loadJson(storageKey);
  let drafts = loadJson(draftKey);
  let current = null;
  let referenceVisible = false;
  let runner = null;
  let runnerReady = false;
  let runnerPromise = null;
  let requestSequence = 0;
  const pendingRuns = new Map();

  function loadJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  }
  function saveProgress() { localStorage.setItem(storageKey, JSON.stringify(progress)); }
  function saveDrafts() { localStorage.setItem(draftKey, JSON.stringify(drafts)); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
  function json(value) { return JSON.stringify(value, null, 2); }
  function difficultyClass(value) { return value === '基础' ? 'basic' : value === '进阶' ? 'intermediate' : 'advanced'; }
  function statusOf(slug) { return progress[slug]?.solved ? 'solved' : progress[slug]?.attempted ? 'attempted' : 'todo'; }
  function icon(name) { return `<i data-lucide="${name}" aria-hidden="true"></i>`; }
  function refreshIcons() { if (window.lucide) window.lucide.createIcons({attrs:{width:16,height:16}}); }

  function configureFilters() {
    const categories = [...new Set(problems.map((problem) => problem.category))];
    $('category-filter').insertAdjacentHTML('beforeend', categories.map((category) => `<option>${escapeHtml(category)}</option>`).join(''));
    const bindings = [['problem-search','query','input'],['category-filter','category','change'],['difficulty-filter','difficulty','change'],['stage-filter','stage','change'],['status-filter','status','change'],['sort-filter','sort','change']];
    bindings.forEach(([id,key,event]) => $(id).addEventListener(event, () => { state[key] = $(id).value; renderList(); }));
    $('reset-filters').addEventListener('click', resetFilters);
    $('empty-reset').addEventListener('click', resetFilters);
  }

  function resetFilters() {
    Object.assign(state, {query:'',category:'',difficulty:'',stage:'',status:'',sort:'id'});
    ['problem-search','category-filter','difficulty-filter','stage-filter','status-filter'].forEach((id) => $(id).value = '');
    $('sort-filter').value = 'id';
    renderList();
  }

  function filteredProblems() {
    const query = state.query.trim().toLocaleLowerCase('zh-CN');
    const ranks = {基础:1,进阶:2,高级:3};
    return problems.filter((problem) => {
      const text = [problem.title,problem.slug,problem.summary,problem.statement,problem.category,...problem.tags].join(' ').toLocaleLowerCase('zh-CN');
      const status = statusOf(problem.slug);
      return (!query || text.includes(query)) && (!state.category || problem.category === state.category) && (!state.difficulty || problem.difficulty === state.difficulty) && (!state.stage || problem.stage === Number(state.stage)) && (!state.status || (state.status === 'ready' ? problem.judgeReady : state.status === 'favorite' ? progress[problem.slug]?.favorite : status === state.status));
    }).sort((a,b) => state.sort === 'title' ? a.title.localeCompare(b.title,'zh-CN') : state.sort === 'difficulty' ? ranks[a.difficulty]-ranks[b.difficulty] || a.id-b.id : a.id-b.id);
  }

  function renderList() {
    const entries = filteredProblems();
    $('bank-total').textContent = problems.length;
    $('bank-ready').textContent = problems.filter((problem) => problem.judgeReady).length;
    $('bank-solved').textContent = Object.values(progress).filter((item) => item.solved).length;
    $('result-summary').textContent = `${entries.length} 道题目`;
    $('active-filter').textContent = [state.category,state.difficulty,state.stage&&`阶段 ${state.stage}`,state.status,state.query&&`“${state.query}”`].filter(Boolean).join(' · ');
    $('problem-rows').innerHTML = entries.map((problem) => {
      const status = statusOf(problem.slug);
      const statusIcon = status === 'solved' ? 'circle-check' : status === 'attempted' ? 'circle-dot' : 'circle';
      const favorite = Boolean(progress[problem.slug]?.favorite);
      return `<tr data-slug="${problem.slug}">
        <td><span class="status-icon ${status}" aria-label="${status === 'solved' ? '已通过' : status === 'attempted' ? '尝试过' : '未开始'}">${icon(statusIcon)}</span></td>
        <td>${String(problem.id).padStart(3,'0')}</td>
        <td><a class="problem-link" href="?id=${problem.slug}" data-open="${problem.slug}">${escapeHtml(problem.title)}</a><div class="row-subtitle"><span>${problem.tags.slice(0,2).map(escapeHtml).join(' · ')}</span><span class="${problem.judgeReady?'ready':'pending'}">${problem.judgeReady?'Python 可运行':'讲解已收录'}</span></div></td>
        <td>${escapeHtml(problem.category)}</td>
        <td><span class="difficulty ${difficultyClass(problem.difficulty)}">${problem.difficulty}</span></td>
        <td>STAGE ${problem.stage}</td>
        <td><button class="favorite-button ${favorite?'active':''}" type="button" data-favorite="${problem.slug}" aria-label="${favorite?'取消收藏':'收藏'}">${icon('bookmark')}</button></td>
      </tr>`;
    }).join('');
    $('empty-state').hidden = entries.length !== 0;
    document.querySelector('.table-wrap').hidden = entries.length === 0;
    document.querySelectorAll('[data-open]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); openProblem(link.dataset.open); }));
    document.querySelectorAll('[data-favorite]').forEach((button) => button.addEventListener('click', () => toggleFavorite(button.dataset.favorite)));
    refreshIcons();
  }

  function toggleFavorite(slug) {
    progress[slug] = {...progress[slug], favorite:!progress[slug]?.favorite};
    saveProgress();
    if (current?.slug === slug) updateFavoriteButton();
    renderList();
  }

  function updateFavoriteButton() {
    if (!current) return;
    const active = Boolean(progress[current.slug]?.favorite);
    $('detail-favorite').classList.toggle('active', active);
    $('detail-favorite').setAttribute('aria-label', active ? '取消收藏' : '收藏题目');
  }

  function openProblem(slug, replace = false) {
    const problem = bySlug.get(slug);
    if (!problem) return showList(replace);
    current = problem;
    referenceVisible = false;
    if (replace) history.replaceState({slug},'',`?id=${slug}`); else history.pushState({slug},'',`?id=${slug}`);
    $('list-view').hidden = true; $('detail-view').hidden = false;
    $('detail-id').textContent = `#${String(problem.id).padStart(3,'0')}`;
    $('detail-title').textContent = problem.title;
    $('detail-meta').innerHTML = `<span class="difficulty ${difficultyClass(problem.difficulty)}">${problem.difficulty}</span><span>${escapeHtml(problem.category)}</span><span>STAGE ${problem.stage}</span><span>${problem.judgeReady?'PYTHON READY':'EXPLANATION READY'}</span>`;
    $('detail-demo').href = problem.demo; $('detail-source').href = problem.source;
    renderStatement(problem); renderExplanation(problem);
    $('code-editor').value = drafts[problem.slug] || problem.starterCode;
    $('code-editor').hidden = false; $('reference-code').hidden = true;
    $('show-reference').innerHTML = `${icon('book-open')}参考实现`;
    $('judge-unavailable').hidden = problem.judgeReady;
    ['run-code','submit-code','show-reference','reset-code'].forEach((id) => $(id).disabled = !problem.judgeReady);
    $('judge-results').innerHTML = `<p>${problem.judgeReady?'选择“运行样例”检查公开用例，或提交全部测试。':'本题已进入题库与讲解体系，Python 实现按 TODO 批次开发。'}</p>`;
    $('python-status').textContent = problem.judgeReady ? (runnerReady?'Python 已就绪':'首次运行时加载 Python') : '判题开发中';
    updateFavoriteButton(); setContentTab('statement'); setMobilePane('statement'); refreshIcons(); window.scrollTo(0,0);
  }

  function showList(replace = false) {
    current = null;
    if (replace) history.replaceState({},'',location.pathname); else history.pushState({},'',location.pathname);
    $('detail-view').hidden = true; $('list-view').hidden = false; renderList(); window.scrollTo(0,0);
  }

  function renderStatement(problem) {
    const examples = problem.examples.length ? problem.examples.map((item,index) => `<div class="example-block"><b>示例 ${index+1}</b><code>输入：${escapeHtml(json(item.input))}<br>输出：${escapeHtml(json(item.output))}</code>${item.explanation?`<p>${escapeHtml(item.explanation)}</p>`:''}</div>`).join('') : '<p>本题的可执行样例将在对应 Python 批次中补充；当前可以先结合动画理解状态变化。</p>';
    $('statement-content').innerHTML = `<h2>${escapeHtml(problem.title)}</h2><p>${escapeHtml(problem.statement)}</p><h3>输入</h3><p>${escapeHtml(problem.input)}</p><h3>输出</h3><p>${escapeHtml(problem.output)}</p><h3>约束</h3><ul>${problem.constraints.map((item)=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h3>示例</h3>${examples}<h3>复杂度目标</h3><p>${escapeHtml(problem.complexity)}</p>`;
  }

  function renderExplanation(problem) {
    const exp = problem.explanation;
    $('explanation-content').innerHTML = `<h2>先抓住核心</h2><p>${escapeHtml(exp.mental)}</p><h3>核心不变量</h3><div class="example-block"><p>${escapeHtml(exp.invariant)}</p></div><h3>分步推导</h3><ol>${exp.steps.map((item)=>`<li>${escapeHtml(item)}</li>`).join('')}</ol><h3>容易写错的地方</h3><ul>${exp.pitfalls.map((item)=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h3>与动画一起学习</h3><p>${escapeHtml(problem.summary)}。先在动画中预测下一步，再回到代码里找到维护同一状态的变量。</p>`;
  }

  function setContentTab(name) {
    document.querySelectorAll('[data-content-tab]').forEach((button) => button.setAttribute('aria-selected',String(button.dataset.contentTab===name)));
    $('statement-content').hidden = name !== 'statement'; $('explanation-content').hidden = name !== 'explanation';
  }
  function setMobilePane(name) {
    document.querySelector('.problem-workspace').dataset.mobilePane = name;
    document.querySelectorAll('[data-pane]').forEach((button)=>button.setAttribute('aria-pressed',String(button.dataset.pane===name)));
  }

  async function showReference() {
    if (!current?.judgeReady) return;
    if (referenceVisible) {
      referenceVisible = false; $('code-editor').hidden = false; $('reference-code').hidden = true;
      $('show-reference').innerHTML = `${icon('book-open')}参考实现`;
    } else {
      $('show-reference').disabled = true;
      try {
        const response = await fetch(current.solutionPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        $('reference-code').querySelector('code').textContent = await response.text();
        referenceVisible = true; $('code-editor').hidden = true; $('reference-code').hidden = false;
        $('show-reference').innerHTML = `${icon('file-edit')}返回编辑`;
      } catch (error) { renderJudgeError(`参考实现加载失败：${error.message}`); }
      finally { $('show-reference').disabled = false; refreshIcons(); }
    }
  }

  function ensureRunner() {
    if (runnerReady) return Promise.resolve();
    if (runnerPromise) return runnerPromise;
    $('python-status').textContent = '正在加载 Python…';
    runnerPromise = new Promise((resolve,reject) => {
      runner = new Worker('python-worker.js');
      const timer = setTimeout(()=>reject(new Error('Python 运行环境加载超时')),60000);
      runner.onmessage = (event) => {
        if (event.data.type === 'ready') { clearTimeout(timer); runnerReady=true; $('python-status').textContent='Python 已就绪'; resolve(); }
        else if (event.data.type === 'init-error') { clearTimeout(timer); reject(new Error(event.data.error)); }
        else if (event.data.type === 'result') { const pending=pendingRuns.get(event.data.id); if(pending){pendingRuns.delete(event.data.id);pending.resolve(event.data.payload);} }
      };
      runner.onerror = (event) => { clearTimeout(timer); reject(new Error(event.message || 'Python Worker 加载失败')); };
    }).catch((error)=>{runnerPromise=null;runnerReady=false;if(runner){runner.terminate();runner=null;}throw error;});
    return runnerPromise;
  }

  async function execute(submit) {
    if (!current?.judgeReady) return;
    const code = $('code-editor').value;
    drafts[current.slug] = code; saveDrafts();
    progress[current.slug] = {...progress[current.slug],attempted:true}; saveProgress();
    setBusy(true); $('judge-title').textContent = submit ? '提交结果' : '样例结果'; $('judge-results').innerHTML='<p>正在执行 Python…</p>';
    try {
      await ensureRunner();
      const cases = submit ? current.tests : current.examples;
      const payload = await runInWorker(code,cases);
      renderResults(payload,submit);
    } catch (error) { renderJudgeError(error.message); }
    finally { setBusy(false); renderList(); }
  }

  function runInWorker(code, tests) {
    const id=++requestSequence;
    return new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>{pendingRuns.delete(id);if(runner)runner.terminate();runner=null;runnerReady=false;runnerPromise=null;reject(new Error('执行超过 8 秒，运行环境已重置'));},8000);
      pendingRuns.set(id,{resolve:(payload)=>{clearTimeout(timeout);resolve(payload);}});
      runner.postMessage({type:'run',id,code,tests});
    });
  }

  function renderResults(payload, submit) {
    const allPassed = payload.results.length > 0 && payload.results.every((item)=>item.passed);
    if (submit && allPassed) { progress[current.slug] = {...progress[current.slug],attempted:true,solved:true}; saveProgress(); }
    const rows = payload.results.map((item,index)=>`<div class="case-result ${item.passed?'pass':'fail'}">${icon(item.passed?'circle-check':'circle-x')}<code>${item.error?escapeHtml(item.error):`用例 ${index+1} · 实际 ${escapeHtml(json(item.actual))}${item.passed?'':` · 期望 ${escapeHtml(json(item.expected))}`}`}</code><span>${item.passed?'通过':'失败'}</span></div>`).join('');
    const stdout = payload.stdout ? `<div class="case-result"><span></span><code>输出：${escapeHtml(payload.stdout)}</code><span></span></div>` : '';
    $('judge-results').innerHTML = rows + stdout;
    $('python-status').textContent = `${allPassed?'全部通过':'存在失败'} · ${payload.duration.toFixed(1)} ms`;
    refreshIcons();
  }
  function renderJudgeError(message) { $('judge-results').innerHTML=`<div class="case-result fail">${icon('circle-x')}<code>${escapeHtml(message)}</code><span>错误</span></div>`;$('python-status').textContent='执行失败';refreshIcons(); }
  function setBusy(value) { $('run-code').disabled=value||!current?.judgeReady;$('submit-code').disabled=value||!current?.judgeReady; }

  configureFilters();
  $('back-to-list').addEventListener('click',()=>showList());
  $('detail-favorite').addEventListener('click',()=>current&&toggleFavorite(current.slug));
  $('reset-code').addEventListener('click',()=>{if(current){$('code-editor').value=current.starterCode;delete drafts[current.slug];saveDrafts();}});
  $('show-reference').addEventListener('click',showReference);
  $('run-code').addEventListener('click',()=>execute(false));
  $('submit-code').addEventListener('click',()=>execute(true));
  $('code-editor').addEventListener('input',()=>{if(current){drafts[current.slug]=$('code-editor').value;saveDrafts();}});
  $('code-editor').addEventListener('keydown',(event)=>{if(event.key==='Tab'){event.preventDefault();const editor=event.currentTarget,start=editor.selectionStart,end=editor.selectionEnd;editor.setRangeText('    ',start,end,'end');}});
  document.querySelectorAll('[data-content-tab]').forEach((button)=>button.addEventListener('click',()=>setContentTab(button.dataset.contentTab)));
  document.querySelectorAll('[data-pane]').forEach((button)=>button.addEventListener('click',()=>setMobilePane(button.dataset.pane)));
  addEventListener('popstate',()=>{const slug=new URLSearchParams(location.search).get('id');if(slug)openProblem(slug,true);else showList(true);});
  const initialSlug = new URLSearchParams(location.search).get('id');
  if (initialSlug && bySlug.has(initialSlug)) openProblem(initialSlug,true); else { history.replaceState({},'',location.pathname); renderList(); }
  refreshIcons();
})();
