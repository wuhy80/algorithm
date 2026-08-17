(() => {
  'use strict';

  const tools = [
    {name:'Netron',category:'模型检查',url:'https://netron.app/',tags:['ONNX','PyTorch','TensorFlow'],description:'直接打开常见模型文件，检查计算图、张量形状、参数和算子属性。'},
    {name:'TensorBoard Graphs',category:'训练诊断',url:'https://www.tensorflow.org/tensorboard/graphs',tags:['TensorFlow','Graph'],description:'结合训练日志查看模型计算图，定位命名空间、依赖关系和图结构问题。'},
    {name:'TensorBoard Projector',category:'训练诊断',url:'https://projector.tensorflow.org/',tags:['Embedding','Browser'],description:'投影高维向量并探索邻域、簇与标签分布，适合检查表示学习结果。'},
    {name:'Net2Vis',category:'架构设计',url:'https://viscom.net2vis.uni-ulm.de/',tags:['Keras','CNN','Export'],description:'从 Keras 网络生成紧凑的层级架构图，适合卷积网络结构沟通。'},
    {name:'NN-SVG',category:'架构设计',url:'https://alexlenail.me/NN-SVG/',tags:['Browser','SVG','Export'],description:'在浏览器中配置全连接、LeNet 或 AlexNet 风格网络并导出矢量图。'},
    {name:'visualkeras',category:'代码绘图',url:'https://github.com/paulgavrikov/visualkeras',tags:['Python','Keras','CNN'],description:'用 Python 从 Keras 模型生成层叠视图或图结构视图，可继续定制样式。'},
    {name:'PlotNeuralNet',category:'论文绘图',url:'https://github.com/HarisIqbal88/PlotNeuralNet',tags:['LaTeX','TikZ','Export'],description:'用 LaTeX 与 TikZ 组合三维网络层，适合论文和演示文稿中的结构图。'},
    {name:'draw_convnet',category:'论文绘图',url:'https://github.com/gwding/draw_convnet',tags:['Python','CNN','Export'],description:'通过 Python 脚本绘制卷积层、特征图与连接关系，便于按论文版式修改。'},
    {name:'Keras plot_model',category:'代码绘图',url:'https://keras.io/api/utils/model_plotting_utils/',tags:['Keras','Graphviz','Python'],description:'从 Functional 或 Sequential 模型输出结构图，并可显示形状、数据类型和层名。'},
    {name:'Graphviz',category:'论文绘图',url:'https://graphviz.org/',tags:['DOT','Graph','Export'],description:'用声明式 DOT 语言自动布局计算图，适合需要完全控制节点与边的场景。'},
    {name:'TensorSpace',category:'交互学习',url:'https://tensorspace.org/',tags:['3D','Browser','TensorFlow.js'],description:'在浏览器中以三维层结构展示预训练网络，强调特征图和层间流动。'},
    {name:'GAN Lab',category:'交互学习',url:'https://poloclub.github.io/ganlab/',tags:['GAN','Browser','Training'],description:'交互观察生成器、判别器和数据分布如何在对抗训练中相互改变。'},
    {name:'Neataptic',category:'交互学习',url:'https://wagenaartje.github.io/neataptic/',tags:['JavaScript','Evolution','Browser'],description:'在 JavaScript 中构造灵活网络并进行神经进化，适合浏览器实验和教学。'},
    {name:'Conx',category:'训练诊断',url:'https://conx.readthedocs.io/en/latest/',tags:['Python','Activation','Jupyter'],description:'在教学环境中显示网络连接、激活值和中间状态，帮助串联结构与运行结果。'},
    {name:'Quiver',category:'交互学习',url:'https://github.com/keplr-io/quiver',tags:['Keras','Feature Map','Browser'],description:'逐层检查卷积网络的特征图，直观看到输入图像激活了哪些模式。'},
    {name:'Netscope',category:'模型检查',url:'https://dgschwend.github.io/netscope/quickstart.html',tags:['Caffe','Browser','Graph'],description:'解析 Caffe 网络定义并展示层连接、张量尺寸和估算的计算开销。'},
  ];
  const categories = ['全部', ...new Set(tools.map((tool) => tool.category))];
  const state = {category:'全部',query:''};
  const groups = document.getElementById('tool-groups');
  const filters = document.getElementById('category-filters');

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const refreshIcons = () => window.lucide?.createIcons({attrs:{width:16,height:16}});

  function renderFilters() {
    filters.innerHTML = categories.map((category) => `<button type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === state.category}">${escapeHtml(category)}</button>`).join('');
    filters.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {state.category=button.dataset.category;renderFilters();renderTools();}));
  }

  function renderTools() {
    const query = state.query.trim().toLocaleLowerCase('zh-CN');
    const visible = tools.filter((tool) => (state.category === '全部' || tool.category === state.category) && (!query || [tool.name,tool.category,tool.description,...tool.tags].join(' ').toLocaleLowerCase('zh-CN').includes(query)));
    const visibleCategories = categories.slice(1).filter((category) => visible.some((tool) => tool.category === category));
    groups.innerHTML = visibleCategories.map((category) => {
      const entries = visible.filter((tool) => tool.category === category);
      return `<section class="tool-group"><h3>${escapeHtml(category)}<span>${entries.length} TOOLS</span></h3><div class="tool-list">${entries.map((tool) => `<article class="tool-card"><h4><a href="${escapeHtml(tool.url)}" target="_blank" rel="noreferrer">${escapeHtml(tool.name)}<i data-lucide="arrow-up-right" aria-hidden="true"></i></a></h4><div class="meta">${tool.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div><p>${escapeHtml(tool.description)}</p></article>`).join('')}</div></section>`;
    }).join('');
    document.getElementById('result-count').textContent = `${visible.length} 个工具`;
    document.getElementById('empty-state').hidden = visible.length !== 0;
    refreshIcons();
  }

  const search = document.getElementById('tool-search');
  search.addEventListener('input', () => {state.query=search.value;renderTools();});
  document.getElementById('reset-filter').addEventListener('click', () => {state.category='全部';state.query='';search.value='';renderFilters();renderTools();});

  const canvas = document.getElementById('architecture-canvas');
  const context = canvas.getContext('2d');
  let phase = 0;
  function draw() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {canvas.width=width*ratio;canvas.height=height*ratio;context.setTransform(ratio,0,0,ratio,0,0);}
    context.clearRect(0,0,width,height);
    const layers = [4,6,5,3];
    const points = layers.map((count,column) => Array.from({length:count},(_,row) => ({x:width*(.13+column*.245),y:height*(.2+(row+1)*.62/(count+1))})));
    context.lineWidth=1;
    for (let column=0;column<points.length-1;column++) for (const source of points[column]) for (const target of points[column+1]) {
      const strength = .12 + .16 * (1 + Math.sin(phase + source.y*.025 + target.y*.018 + column)) / 2;
      context.strokeStyle=`rgba(112,196,181,${strength})`;context.beginPath();context.moveTo(source.x,source.y);context.lineTo(target.x,target.y);context.stroke();
    }
    points.forEach((layer,column) => layer.forEach((point,row) => {
      const pulse=(1+Math.sin(phase*1.4+column*.8+row*.65))/2;
      context.beginPath();context.arc(point.x,point.y,5+pulse*2.2,0,Math.PI*2);context.fillStyle=column===points.length-1?'#e0a34b':'#55bfc4';context.fill();
      context.beginPath();context.arc(point.x,point.y,11+pulse*3,0,Math.PI*2);context.strokeStyle=`rgba(99,199,208,${.13+pulse*.14})`;context.stroke();
    }));
    phase += .015;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(draw);
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) new ResizeObserver(draw).observe(canvas);
  renderFilters();renderTools();refreshIcons();draw();
})();
