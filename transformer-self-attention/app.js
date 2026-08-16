(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const parts = decodeURIComponent(location.pathname).split('/').filter(Boolean);
  const slug = parts.at(-1) === 'index.html' ? parts.at(-2) : parts.at(-1);

  const configs = {
    'activation-functions': {
      title: '激活函数', mono: 'AF', eye: 'NEURAL / ACTIVATION', theme: '',
      textLabel: '观察点 x', text: '1.25', selectLabel: '显示曲线',
      options: [['all','全部函数'],['sigmoid','Sigmoid'],['tanh','Tanh'],['relu','ReLU'],['leaky','Leaky ReLU']],
      a: ['Leaky 负半轴斜率',0.01,0.5,0.01,0.1,''], b: ['横轴范围',3,10,1,6,''],
      metrics: ['采样点','观察位置','函数值','局部导数'],
      principle: '激活函数把线性加权和映射为非线性输出；导数决定反向传播时梯度能否继续穿过该神经元。',
      complexity: 'ELEMENT-WISE FORWARD / BACKWARD · O(N)'
    },
    'perceptron-classifier': {
      title: '感知机分类', mono: 'PC', eye: 'NEURAL / PERCEPTRON', theme: 'theme-amber',
      textLabel: '训练轮数', text: '10', selectLabel: '样本分布',
      options: [['separable','线性可分'],['margin','窄间隔'],['overlap','含冲突样本']],
      a: ['学习率',0.02,0.5,0.01,0.16,''], b: ['分类间隔',0,0.5,0.01,0.05,''],
      metrics: ['已读样本','训练轮次','权重更新','准确率'],
      principle: '只有样本被错分或落入间隔时才更新权重；线性可分数据会在有限步内找到一条分隔直线。',
      complexity: 'ONE EPOCH · O(ND) · MODEL SPACE O(D)'
    },
    'neural-network-forward-pass': {
      title: '神经网络前向传播', mono: 'FP', eye: 'NEURAL / FORWARD PASS', theme: 'theme-green',
      textLabel: '输入 x₁,x₂', text: '0.8,-0.4', selectLabel: '隐藏层激活',
      options: [['tanh','Tanh'],['sigmoid','Sigmoid'],['relu','ReLU']],
      a: ['偏置缩放',0,2,0.05,1,'x'], b: ['权重缩放',0.2,2,0.05,1,'x'],
      metrics: ['当前层','已算神经元','最大激活','预测类别'],
      principle: '每层先计算 z=W·a+b，再执行非线性激活；后一层只能读取前一层已经完成的输出。',
      complexity: 'DENSE FORWARD · O(SUM N[L-1] × N[L])'
    },
    'backpropagation': {
      title: '反向传播', mono: 'BP', eye: 'NEURAL / BACKPROPAGATION', theme: 'theme-rose',
      textLabel: '训练更新次数', text: '400', selectLabel: '训练任务',
      options: [['xor','XOR'],['or','OR'],['and','AND']],
      a: ['学习率',0.02,1,0.01,0.35,''], b: ['隐藏层宽度',2,5,1,3,''],
      metrics: ['参数更新','当前损失','梯度范数','训练准确率'],
      principle: '输出误差沿计算图反向乘以局部导数；每个参数只接收所有下游路径贡献之和。',
      complexity: 'BACKWARD COST ≈ FORWARD COST'
    },
    'optimizer-comparison': {
      title: '神经网络优化器', mono: 'OP', eye: 'NEURAL / OPTIMIZATION', theme: 'theme-violet',
      textLabel: '优化步数', text: '70', selectLabel: '初始位置',
      options: [['left','左上方'],['right','右下方'],['center','谷底附近']],
      a: ['学习率',0.01,0.18,0.005,0.08,''], b: ['动量 / β₁',0.5,0.98,0.01,0.86,''],
      metrics: ['优化步数','SGD 损失','Momentum','Adam 损失'],
      principle: 'SGD 只看当前梯度；Momentum 累积速度抑制来回震荡；Adam 再按每个参数的二阶矩自适应缩放。',
      complexity: 'EACH UPDATE · O(P) · ADAM STATE O(P)'
    },
    'convolutional-neural-network': {
      title: '卷积神经网络', mono: 'CN', eye: 'NEURAL / CONVOLUTION', theme: 'theme-green',
      textLabel: '图案编号（0-2）', text: '0', selectLabel: '卷积核',
      options: [['edge','垂直边缘'],['sharpen','锐化'],['blur','均值模糊']],
      a: ['步幅 stride',1,2,1,1,''], b: ['零填充 padding',0,1,1,0,''],
      metrics: ['窗口位置','累计乘加','输出尺寸','当前响应'],
      principle: '同一组卷积核权重滑过所有局部感受野，因此既保留空间邻域，又显著减少独立参数。',
      complexity: 'CONVOLUTION · O(HWKC_IN C_OUT)'
    },
    'recurrent-neural-network': {
      title: '循环神经网络', mono: 'RN', eye: 'NEURAL / RECURRENT STATE', theme: 'theme-amber',
      textLabel: '输入序列（逗号分隔）', text: '0.9,0.2,-0.7,0.4,1,-0.3,0.6', selectLabel: '状态激活',
      options: [['tanh','Tanh'],['relu','ReLU'],['sigmoid','Sigmoid']],
      a: ['循环权重 Wₕ',-1.2,1.2,0.05,0.68,''], b: ['输入权重 Wₓ',-1.5,1.5,0.05,0.9,''],
      metrics: ['时间步','当前输入','隐藏状态','历史贡献'],
      principle: '同一个循环单元在每个时间步共享参数，隐藏状态 hₜ 同时接收新输入和上一时刻记忆。',
      complexity: 'SEQUENCE LENGTH T · O(T(H² + DH))'
    },
    'transformer-self-attention': {
      title: 'Transformer 自注意力', mono: 'AT', eye: 'NEURAL / SELF-ATTENTION', theme: 'theme-violet',
      textLabel: '词元（空格分隔，最多 8 个）', text: '算法 可视化 让 学习 更 直观', selectLabel: '投影模式',
      options: [['mixed','内容 + 位置'],['semantic','偏重内容'],['position','偏重位置']],
      a: ['Softmax 温度',0.2,2.5,0.05,0.9,''], b: ['键/查询维度',2,6,1,4,''],
      metrics: ['当前查询','最相关词','最大权重','注意力熵'],
      principle: '每个查询 Q 与所有键 K 做缩放点积，再经 Softmax 得到权重，最后加权聚合对应的值 V。',
      complexity: 'STANDARD ATTENTION · TIME / MEMORY O(T²)'
    },
    'autoencoder': {
      title: '自动编码器', mono: 'AE', eye: 'NEURAL / REPRESENTATION', theme: 'theme-rose',
      textLabel: '训练更新次数', text: '150', selectLabel: '目标图案',
      options: [['zero','数字 0'],['one','数字 1'],['cross','交叉图案']],
      a: ['输入噪声概率',0,0.45,0.01,0.16,''], b: ['瓶颈维度',2,6,1,3,''],
      metrics: ['训练更新','瓶颈维度','重建损失','像素准确率'],
      principle: '编码器把输入压缩到信息瓶颈，解码器只能依靠这组低维表示恢复原始结构。',
      complexity: 'ENCODER + DECODER FORWARD / BACKWARD'
    },
    'generative-adversarial-network': {
      title: '生成对抗网络', mono: 'GN', eye: 'NEURAL / ADVERSARIAL', theme: 'theme-rose',
      textLabel: '对抗训练轮数', text: '140', selectLabel: '真实分布',
      options: [['right','右侧高斯'],['left','左侧高斯'],['wide','宽高斯']],
      a: ['学习率',0.005,0.12,0.005,0.035,''], b: ['批量大小',8,64,4,32,''],
      metrics: ['训练轮次','判别器损失','生成器损失','均值距离'],
      principle: '判别器学习区分真实与生成样本，生成器则沿着“更像真实”的梯度移动；两者必须交替更新。',
      complexity: 'ONE ROUND · D FORWARD/BACKWARD + G FORWARD/BACKWARD'
    }
  };

  const config = configs[slug];
  if (!config) throw new Error(`Unknown neural-network demo: ${slug}`);
  document.body.className = config.theme;
  document.body.dataset.demo = slug;
  document.title = `${config.title} · Neural Network Lab`;
  canvas.setAttribute('aria-label', `${config.title}计算过程可视化`);

  function configure() {
    $('title').textContent = config.title;
    $('monogram').textContent = config.mono;
    $('eyebrow').textContent = config.eye;
    $('text-label').textContent = config.textLabel;
    $('input-text').value = config.text;
    $('select-label').textContent = config.selectLabel;
    $('option').innerHTML = config.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
    setRange('param-a', config.a);
    setRange('param-b', config.b);
    config.metrics.forEach((label, index) => $(`metric-label-${index + 1}`).textContent = label);
    $('principle').textContent = config.principle;
    $('complexity').textContent = config.complexity;
  }

  function setRange(id, spec) {
    const input = $(id);
    const [label, min, max, step, value] = spec;
    $(`${id}-label`).textContent = label;
    Object.assign(input, { min, max, step, value });
    updateRange(id, spec);
  }

  function updateRange(id, spec) {
    const input = $(id);
    const suffix = spec[5] || '';
    const numeric = Number(input.value);
    const decimals = String(spec[3]).includes('.') ? String(spec[3]).split('.')[1].length : 0;
    $(`${id}-value`).textContent = `${numeric.toFixed(decimals)}${suffix}`;
  }

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const sigmoid = (value) => 1 / (1 + Math.exp(-clamp(value, -30, 30)));
  const softmax = (values) => {
    const peak = Math.max(...values);
    const exp = values.map((value) => Math.exp(value - peak));
    const total = exp.reduce((sum, value) => sum + value, 0);
    return exp.map((value) => value / total);
  };
  const fixed = (value, digits = 3) => Number.isFinite(value) ? value.toFixed(digits) : '--';
  const parseNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const parseList = (text, max = 16) => text.split(/[\s,，;；]+/).filter(Boolean).slice(0, max).map(Number);
  const seeded = (seed = 1234567) => () => {
    seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };

  let palette = null;
  function readPalette() {
    const style = getComputedStyle(document.body);
    return Object.fromEntries(['bg','panel','panel-2','text','muted','line','accent','accent-2','good','danger','rose'].map((name) => [name.replace('-2','2'), style.getPropertyValue(`--${name}`).trim()]));
  }

  function roundRect(x, y, width, height, radius = 6) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, r);
  }
  function panel(x, y, width, height, fill = palette.panel, stroke = palette.line) {
    roundRect(x, y, width, height, 6); ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  }
  function label(value, x, y, color = palette.text, size = 12, align = 'left', weight = 400) {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px Inter, "Segoe UI", sans-serif`;
    ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(String(value), x, y);
  }
  function mono(value, x, y, color = palette.muted, size = 10, align = 'left') {
    ctx.fillStyle = color; ctx.font = `400 ${size}px ui-monospace, Consolas, monospace`;
    ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(String(value), x, y);
  }
  function line(x1, y1, x2, y2, color = palette.line, width = 1) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  function dot(x, y, radius, fill, stroke = null, width = 1) {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  }
  function sectionTitle(title, x, y, detail = '') {
    mono(title.toUpperCase(), x, y, palette.muted, 9);
    if (detail) mono(detail, x + 4, y + 18, palette.accent, 10);
  }
  function plotFrame(x, y, width, height, xLabel = '', yLabel = '') {
    panel(x, y, width, height, palette.bg, palette.line);
    ctx.save(); ctx.globalAlpha = 0.45;
    for (let i = 1; i < 5; i++) line(x + width * i / 5, y, x + width * i / 5, y + height, palette.line);
    for (let i = 1; i < 4; i++) line(x, y + height * i / 4, x + width, y + height * i / 4, palette.line);
    ctx.restore();
    if (xLabel) mono(xLabel, x + width - 5, y + height + 16, palette.muted, 9, 'right');
    if (yLabel) mono(yLabel, x - 7, y + 5, palette.muted, 9, 'right');
  }
  function drawPolyline(points, color, width = 2) {
    if (points.length < 2) return;
    ctx.beginPath(); points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
  }
  function canvasArea() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    return { width, height, top: width < 1120 ? 162 : 112, bottom: height - 48, pad: width < 520 ? 18 : 28 };
  }

  function activationDemo(params) {
    const range = params.b;
    const alpha = params.a;
    const sample = clamp(parseNumber(params.text, 1.25), -range, range);
    const functions = {
      sigmoid: { name:'Sigmoid', color:'accent', fn:sigmoid, df:(x) => { const y = sigmoid(x); return y * (1 - y); } },
      tanh: { name:'Tanh', color:'accent2', fn:Math.tanh, df:(x) => 1 - Math.tanh(x) ** 2 },
      relu: { name:'ReLU', color:'good', fn:(x) => Math.max(0, x), df:(x) => x > 0 ? 1 : 0 },
      leaky: { name:'Leaky ReLU', color:'rose', fn:(x) => x >= 0 ? x : alpha * x, df:(x) => x >= 0 ? 1 : alpha }
    };
    const shown = params.option === 'all' ? Object.keys(functions) : [params.option];
    let count = 5;
    const total = 121;
    return {
      get complete() { return count >= total; },
      step() { count = Math.min(total, count + 8); },
      status: () => count >= total ? '曲线采样完成' : `正在计算第 ${count} / ${total} 个采样`,
      metrics: () => {
        const key = params.option === 'all' ? 'sigmoid' : params.option;
        return [count, fixed(sample,2), fixed(functions[key].fn(sample),3), fixed(functions[key].df(sample),3)];
      },
      note: () => '比较饱和区、零点附近和负半轴的输出与导数',
      draw(area) {
        const { width:w, top, bottom, pad } = area;
        const x = pad + 30, y = top + 24, pw = w - pad * 2 - 44, ph = Math.max(210, bottom - top - 76);
        sectionTitle('activation response', pad, top);
        plotFrame(x, y, pw, ph, 'INPUT x', 'OUTPUT f(x)');
        const maxY = Math.max(1.2, range);
        const sx = (value) => x + (value + range) / (range * 2) * pw;
        const sy = (value) => y + ph - (value + maxY) / (maxY * 2) * ph;
        line(sx(0), y, sx(0), y + ph, palette.muted, 1);
        line(x, sy(0), x + pw, sy(0), palette.muted, 1);
        shown.forEach((key, index) => {
          const item = functions[key];
          const points = [];
          for (let i = 0; i < count; i++) {
            const vx = -range + i / (total - 1) * range * 2;
            points.push([sx(vx), sy(clamp(item.fn(vx), -maxY, maxY))]);
          }
          drawPolyline(points, palette[item.color], 2.2);
          const lx = x + 10 + index * Math.min(122, pw / shown.length);
          line(lx, y + 17, lx + 18, y + 17, palette[item.color], 3);
          mono(item.name, lx + 24, y + 17, palette.text, 9);
        });
        const key = params.option === 'all' ? 'sigmoid' : params.option;
        const item = functions[key];
        const px = sx(sample), py = sy(clamp(item.fn(sample), -maxY, maxY));
        line(px, y, px, y + ph, palette.line, 1); dot(px, py, 5, palette[item.color], palette.text, 1);
        mono(`x=${fixed(sample,2)}  f(x)=${fixed(item.fn(sample),3)}  f'(x)=${fixed(item.df(sample),3)}`, clamp(px + 10, x + 8, x + pw - 200), clamp(py - 18, y + 38, y + ph - 14), palette.text, 10);
      }
    };
  }

  const perceptronData = {
    separable: [[-.85,-.55,-1],[-.72,.05,-1],[-.55,-.7,-1],[-.42,-.18,-1],[-.25,-.78,-1],[-.12,-.3,-1],[.18,.35,1],[.28,.78,1],[.45,.12,1],[.55,.56,1],[.72,.25,1],[.82,.78,1]],
    margin: [[-.8,-.35,-1],[-.62,.2,-1],[-.42,-.24,-1],[-.18,.05,-1],[-.05,-.3,-1],[.03,.2,1],[.18,-.02,1],[.28,.38,1],[.55,.1,1],[.68,.65,1],[.82,.28,1]],
    overlap: [[-.8,-.5,-1],[-.62,.16,-1],[-.42,-.24,-1],[-.18,.05,1],[-.05,-.35,-1],[.08,.18,1],[.22,-.08,1],[.38,.42,1],[.52,.08,-1],[.7,.64,1],[.84,.24,1]]
  };
  function perceptronDemo(params) {
    const data = perceptronData[params.option];
    const epochs = clamp(Math.round(parseNumber(params.text, 10)), 1, 60);
    let w = [0.08, -0.05, 0], index = 0, epoch = 0, updates = 0, active = null, changed = false;
    const score = (point) => w[0] * point[0] + w[1] * point[1] + w[2];
    const accuracy = () => data.filter((point) => (score(point) >= 0 ? 1 : -1) === point[2]).length / data.length;
    return {
      get complete() { return epoch >= epochs; },
      step() {
        if (epoch >= epochs) return;
        active = data[index]; changed = active[2] * score(active) <= params.b;
        if (changed) { w[0] += params.a * active[2] * active[0]; w[1] += params.a * active[2] * active[1]; w[2] += params.a * active[2]; updates++; }
        index++;
        if (index >= data.length) { index = 0; epoch++; }
      },
      status: () => active ? (changed ? '误分类：执行权重更新' : '分类正确：保持当前边界') : '等待读取第一个训练样本',
      metrics: () => [epoch * data.length + index, `${epoch}/${epochs}`, updates, `${(accuracy() * 100).toFixed(0)}%`],
      note: () => params.option === 'overlap' ? '冲突样本不可被一条直线完全分开，更新会持续震荡' : '更新方向 y·x 会把决策边界推向正确分类的一侧',
      draw(area) {
        const { width:wCanvas, top, bottom, pad } = area;
        const size = Math.min(wCanvas - pad * 2 - 48, bottom - top - 45, 560);
        const x = (wCanvas - size) / 2, y = top + 26;
        sectionTitle('decision boundary', x - 28, top);
        plotFrame(x, y, size, size, 'FEATURE x₁', 'FEATURE x₂');
        const sx = (value) => x + (value + 1) / 2 * size;
        const sy = (value) => y + size - (value + 1) / 2 * size;
        if (Math.abs(w[1]) > 0.0001) {
          const y1 = -(w[0] * -1 + w[2]) / w[1], y2 = -(w[0] * 1 + w[2]) / w[1];
          line(sx(-1), sy(y1), sx(1), sy(y2), palette.accent, 2.5);
        }
        data.forEach((point) => {
          const isActive = point === active;
          dot(sx(point[0]), sy(point[1]), isActive ? 8 : 6, point[2] > 0 ? palette.good : palette.rose, isActive ? palette.text : palette.bg, isActive ? 2 : 1);
          if (isActive) mono(changed ? 'UPDATE' : 'KEEP', sx(point[0]) + 12, sy(point[1]) - 12, changed ? palette.danger : palette.good, 9);
        });
        mono(`w=[${fixed(w[0],2)}, ${fixed(w[1],2)}]  b=${fixed(w[2],2)}`, x + 8, y + size - 14, palette.text, 10);
      }
    };
  }

  function activationByName(name, value) {
    return name === 'sigmoid' ? sigmoid(value) : name === 'relu' ? Math.max(0, value) : Math.tanh(value);
  }
  function forwardDemo(params) {
    const input = parseList(params.text, 2);
    if (input.length !== 2 || input.some((value) => !Number.isFinite(value))) throw new Error('请输入两个有效数字，例如 0.8,-0.4');
    const hiddenW = [[.8,-.4],[-.3,.9],[.5,.6]].map((row) => row.map((value) => value * params.b));
    const hiddenB = [.1,-.2,.05].map((value) => value * params.a);
    const outputW = [[.7,-.5,.8],[-.6,.9,-.2]].map((row) => row.map((value) => value * params.b));
    const outputB = [.08,-.03].map((value) => value * params.a);
    const hiddenZ = hiddenW.map((row, i) => row[0] * input[0] + row[1] * input[1] + hiddenB[i]);
    const hidden = hiddenZ.map((value) => activationByName(params.option, value));
    const logits = outputW.map((row, i) => row.reduce((sum, value, j) => sum + value * hidden[j], outputB[i]));
    const output = softmax(logits);
    let phase = 0;
    return {
      get complete() { return phase >= 5; },
      step() { phase = Math.min(5, phase + 1); },
      status: () => phase === 0 ? '输入层已就绪' : phase <= 3 ? `计算隐藏神经元 H${phase}` : `计算输出神经元 O${phase - 3}`,
      metrics: () => [phase <= 3 ? 'HIDDEN' : 'OUTPUT', phase, phase ? fixed(Math.max(...hidden.slice(0, Math.min(phase,3))),3) : '--', phase >= 5 ? `CLASS ${output[1] > output[0] ? 1 : 0}` : '--'],
      note: () => '点击单步，沿高亮连接核对一次“乘权重、求和、加偏置、激活”',
      draw(area) {
        const { width:w, top, bottom, pad } = area;
        const layerX = w < 600 ? [pad + 34, w / 2, w - pad - 34] : [pad + 90, w / 2, w - pad - 90];
        const center = (top + bottom) / 2 + 16;
        const positions = [
          input.map((_, i) => [layerX[0], center + (i - .5) * 120]),
          hidden.map((_, i) => [layerX[1], center + (i - 1) * 92]),
          output.map((_, i) => [layerX[2], center + (i - .5) * 120])
        ];
        ['INPUT','HIDDEN','SOFTMAX'].forEach((name, i) => sectionTitle(name, layerX[i] - 28, top + 10));
        hiddenW.forEach((row, hi) => row.forEach((weight, ii) => {
          ctx.save(); ctx.globalAlpha = phase === hi + 1 ? .95 : .25;
          line(...positions[0][ii], ...positions[1][hi], weight >= 0 ? palette.accent : palette.rose, 1 + Math.abs(weight) * 1.5); ctx.restore();
        }));
        outputW.forEach((row, oi) => row.forEach((weight, hi) => {
          ctx.save(); ctx.globalAlpha = phase === oi + 4 ? .95 : .25;
          line(...positions[1][hi], ...positions[2][oi], weight >= 0 ? palette.good : palette.rose, 1 + Math.abs(weight) * 1.5); ctx.restore();
        }));
        positions[0].forEach(([x,y], i) => { dot(x,y,24,palette.panel2,palette.accent,2); mono(fixed(input[i],2),x,y,palette.text,11,'center'); mono(`x${i+1}`,x,y+36,palette.muted,9,'center'); });
        positions[1].forEach(([x,y], i) => { const ready = phase >= i + 1; dot(x,y,27,ready ? palette.accent : palette.panel2,ready ? palette.accent : palette.line,2); mono(ready ? fixed(hidden[i],2) : '?',x,y,ready ? palette.bg : palette.muted,11,'center'); mono(`H${i+1}  z=${ready ? fixed(hiddenZ[i],2) : '--'}`,x,y+40,palette.muted,9,'center'); });
        positions[2].forEach(([x,y], i) => { const ready = phase >= i + 4; dot(x,y,27,ready ? palette.good : palette.panel2,ready ? palette.good : palette.line,2); mono(ready ? fixed(output[i],2) : '?',x,y,ready ? palette.bg : palette.muted,11,'center'); mono(`O${i+1}`,x,y+40,palette.muted,9,'center'); });
      }
    };
  }

  function backpropDemo(params) {
    const tasks = { xor:[[0,0,0],[0,1,1],[1,0,1],[1,1,0]], or:[[0,0,0],[0,1,1],[1,0,1],[1,1,1]], and:[[0,0,0],[0,1,0],[1,0,0],[1,1,1]] };
    const data = tasks[params.option], hiddenCount = Math.round(params.b), maxSteps = clamp(Math.round(parseNumber(params.text,120)), 4, 1200);
    const random = seeded(params.option === 'xor' ? 13 : 37 + hiddenCount);
    const w1 = Array.from({length:hiddenCount}, () => [(random()-.5)*1.2,(random()-.5)*1.2]);
    const b1 = Array(hiddenCount).fill(0), w2 = Array.from({length:hiddenCount}, () => (random()-.5)*1.2); let b2 = 0;
    let step = 0, loss = .5, gradNorm = 0, active = data[0], hidden = [], output = .5; const history = [];
    const forward = (sample) => {
      const h = w1.map((row,i) => Math.tanh(row[0]*sample[0]+row[1]*sample[1]+b1[i]));
      return { hidden:h, output:sigmoid(h.reduce((sum,value,i) => sum + value*w2[i], b2)) };
    };
    const accuracy = () => data.filter((sample) => (forward(sample).output >= .5 ? 1 : 0) === sample[2]).length / data.length;
    return {
      get complete() { return step >= maxSteps; },
      step() {
        for (let repeat = 0; repeat < 4 && step < maxSteps; repeat++) {
          active = data[step % data.length]; const pass = forward(active); hidden = pass.hidden; output = pass.output;
          loss = -active[2] * Math.log(output + 1e-8) - (1 - active[2]) * Math.log(1 - output + 1e-8);
          const deltaOut = output - active[2]; const gradients = [];
          const oldW2 = [...w2];
          for(let i=0;i<hiddenCount;i++){const g=deltaOut*hidden[i];gradients.push(g);w2[i]-=params.a*g;}
          gradients.push(deltaOut); b2 -= params.a*deltaOut;
          for(let i=0;i<hiddenCount;i++){
            const delta=deltaOut*oldW2[i]*(1-hidden[i]**2); gradients.push(delta*active[0],delta*active[1],delta);
            w1[i][0]-=params.a*delta*active[0]; w1[i][1]-=params.a*delta*active[1]; b1[i]-=params.a*delta;
          }
          gradNorm=Math.sqrt(gradients.reduce((sum,value)=>sum+value*value,0)); history.push(loss); step++;
        }
      },
      status: () => `样本 (${active[0]}, ${active[1]}) → 目标 ${active[2]}，预测 ${fixed(output,3)}`,
      metrics: () => [step, fixed(loss,4), fixed(gradNorm,4), `${(accuracy()*100).toFixed(0)}%`],
      note: () => '先完成前向预测，再从输出误差沿每条连接反向累积梯度',
      draw(area) {
        const { width:w, top, bottom, pad } = area; const split = w > 720 ? w*.55 : w; const graphBottom = w > 720 ? bottom : top + (bottom-top)*.57;
        const layerX=[pad+42,split/2,split-pad-32], center=(top+graphBottom)/2+18;
        const inputPos=[[layerX[0],center-55],[layerX[0],center+55]];
        const hiddenPos=Array.from({length:hiddenCount},(_,i)=>[layerX[1],center+(i-(hiddenCount-1)/2)*Math.min(74,210/Math.max(1,hiddenCount-1))]);
        const outPos=[layerX[2],center]; sectionTitle('gradient flow',pad,top+8);
        inputPos.forEach((from,ii)=>hiddenPos.forEach((to,hi)=>{ctx.save();ctx.globalAlpha=.28+Math.min(.6,Math.abs(w1[hi][ii]));line(...from,...to,w1[hi][ii]>=0?palette.accent:palette.rose,1.5);ctx.restore();}));
        hiddenPos.forEach((from,i)=>{ctx.save();ctx.globalAlpha=.28+Math.min(.6,Math.abs(w2[i]));line(...from,...outPos,w2[i]>=0?palette.good:palette.rose,1.5);ctx.restore();});
        inputPos.forEach(([x,y],i)=>{dot(x,y,21,palette.panel2,palette.accent,1.5);mono(active[i],x,y,palette.text,11,'center');});
        hiddenPos.forEach(([x,y],i)=>{dot(x,y,22,palette.panel2,palette.accent2,1.5);mono(hidden.length?fixed(hidden[i],2):'h',x,y,palette.text,10,'center');});
        dot(...outPos,25,palette.panel2,palette.good,2);mono(fixed(output,2),outPos[0],outPos[1],palette.text,10,'center');
        const px=w>720?split+28:pad, py=w>720?top+28:graphBottom+26, pw=w>720?w-split-pad-28:w-pad*2, ph=bottom-py-4;
        sectionTitle('loss history',px,py-18); plotFrame(px,py,pw,ph,'UPDATE','LOSS');
        if(history.length>1){const max=Math.max(.12,...history);drawPolyline(history.map((value,i)=>[px+i/Math.max(1,maxSteps-1)*pw,py+ph-clamp(value/max,0,1)*ph]),palette.rose,2);}
      }
    };
  }

  function optimizerDemo(params) {
    const starts={left:[-3.8,3.2],right:[3.8,-3.1],center:[1.6,1.2]}; const maxSteps=clamp(Math.round(parseNumber(params.text,70)),5,400);
    const loss=([x,y])=>.18*(x+y)**2+2.6*(x-y)**2;
    const gradient=([x,y])=>[.36*(x+y)+5.2*(x-y),.36*(x+y)-5.2*(x-y)];
    const create=()=>({p:[...starts[params.option]],path:[[...starts[params.option]]],v:[0,0],m:[0,0],s:[0,0]});
    const models={sgd:create(),momentum:create(),adam:create()}; let step=0;
    return {
      get complete(){return step>=maxSteps;},
      step(){
        step++;
        let g=gradient(models.sgd.p); models.sgd.p=models.sgd.p.map((v,i)=>v-params.a*g[i]); models.sgd.path.push([...models.sgd.p]);
        g=gradient(models.momentum.p); models.momentum.v=models.momentum.v.map((v,i)=>params.b*v+(1-params.b)*g[i]); models.momentum.p=models.momentum.p.map((v,i)=>v-params.a*models.momentum.v[i]); models.momentum.path.push([...models.momentum.p]);
        g=gradient(models.adam.p); models.adam.m=models.adam.m.map((v,i)=>params.b*v+(1-params.b)*g[i]); models.adam.s=models.adam.s.map((v,i)=>.98*v+.02*g[i]*g[i]);
        models.adam.p=models.adam.p.map((v,i)=>v-params.a*(models.adam.m[i]/(1-params.b**step))/(Math.sqrt(models.adam.s[i]/(1-.98**step))+1e-8)); models.adam.path.push([...models.adam.p]);
      },
      status:()=>step?`三种优化器完成第 ${step} 次参数更新`:'从相同位置出发，等待第一次梯度',
      metrics:()=>[step,fixed(loss(models.sgd.p),3),fixed(loss(models.momentum.p),3),fixed(loss(models.adam.p),3)],
      note:()=> '狭长谷底会放大横向震荡；比较三条轨迹的方向、步长和收敛速度',
      draw(area){
        const {width:w,top,bottom,pad}=area,x=pad+28,y=top+22,pw=w-pad*2-40,ph=bottom-top-40; sectionTitle('loss landscape',pad,top);
        plotFrame(x,y,pw,ph,'PARAMETER θ₁','PARAMETER θ₂'); const sx=v=>x+(v+4.5)/9*pw,sy=v=>y+ph-(v+4.5)/9*ph;
        const cols=28,rows=20;ctx.save();for(let iy=0;iy<rows;iy++)for(let ix=0;ix<cols;ix++){const vx=-4.5+(ix+.5)/cols*9,vy=-4.5+(iy+.5)/rows*9,l=Math.log1p(loss([vx,vy]));ctx.globalAlpha=clamp(l/5,.03,.3);ctx.fillStyle=palette.accent;ctx.fillRect(x+ix/cols*pw,y+(rows-iy-1)/rows*ph,pw/cols+1,ph/rows+1);}ctx.restore();
        const defs=[['sgd','SGD','rose'],['momentum','MOMENTUM','accent2'],['adam','ADAM','good']];
        defs.forEach(([key,name,color],i)=>{drawPolyline(models[key].path.map(([vx,vy])=>[sx(vx),sy(vy)]),palette[color],2);const p=models[key].p;dot(sx(p[0]),sy(p[1]),5,palette[color],palette.text,1);line(x+12+i*112,y+18,x+30+i*112,y+18,palette[color],3);mono(name,x+36+i*112,y+18,palette.text,9);});
        dot(sx(0),sy(0),6,palette.bg,palette.text,2);mono('MIN',sx(0)+10,sy(0)-10,palette.text,9);
      }
    };
  }

  const imagePatterns=[
    ['0011100','0111110','1100011','1100011','1111111','1100011','1100011'],
    ['0011000','0111000','0011000','0011000','0011000','0011000','0111100'],
    ['1000001','0100010','0010100','0001000','0010100','0100010','1000001']
  ];
  const kernels={edge:[[-1,0,1],[-1,0,1],[-1,0,1]],sharpen:[[0,-1,0],[-1,5,-1],[0,-1,0]],blur:[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]]};
  function cnnDemo(params){
    const pattern=imagePatterns[clamp(Math.round(parseNumber(params.text,0)),0,2)],input=pattern.map(row=>[...row].map(Number)),kernel=kernels[params.option];
    const stride=Math.round(params.a),padding=Math.round(params.b),outSize=Math.floor((7+padding*2-3)/stride)+1;
    const output=Array.from({length:outSize},()=>Array(outSize).fill(null)),positions=[];for(let r=0;r<outSize;r++)for(let c=0;c<outSize;c++)positions.push([r,c]);
    let index=-1,current=0; const get=(r,c)=>r<0||c<0||r>=7||c>=7?0:input[r][c];
    return {
      get complete(){return index>=positions.length-1;},
      step(){if(index>=positions.length-1)return;index++;const [r,c]=positions[index];current=0;for(let kr=0;kr<3;kr++)for(let kc=0;kc<3;kc++)current+=get(r*stride+kr-padding,c*stride+kc-padding)*kernel[kr][kc];output[r][c]=current;},
      status:()=>index<0?'卷积核尚未进入第一个感受野':`输出 (${positions[index][0]}, ${positions[index][1]}) = ${fixed(current,2)}`,
      metrics:()=>[index<0?'--':positions[index].join(','),Math.max(0,index+1)*9,`${outSize}×${outSize}`,index<0?'--':fixed(current,2)],
      note:()=> '高亮的 3×3 感受野与卷积核逐项相乘，九个乘积之和写入一个输出格',
      draw(area){
        const {width:w,top,bottom,pad}=area;const gap=w<600?18:42;const maxCell=Math.min(38,(w-pad*2-gap*2)/(7+3+outSize));const cell=Math.max(15,maxCell);const total=(7+3+outSize)*cell+gap*2;let x=(w-total)/2;const y=top+58;
        const drawGrid=(matrix,gx,gy,size,activeCells=[],normalize=false)=>{matrix.forEach((row,r)=>row.forEach((value,c)=>{const active=activeCells.some(([ar,ac])=>ar===r&&ac===c);const numeric=value??0;const magnitude=normalize?clamp(Math.abs(numeric)/3,0,1):clamp(numeric,0,1);ctx.save();ctx.globalAlpha=value===null?.12:.18+magnitude*.72;ctx.fillStyle=numeric<0?palette.rose:palette.accent;ctx.fillRect(gx+c*size+1,gy+r*size+1,size-2,size-2);ctx.restore();ctx.strokeStyle=active?palette.accent2:palette.line;ctx.lineWidth=active?2:1;ctx.strokeRect(gx+c*size+.5,gy+r*size+.5,size-1,size-1);if(size>=24&&value!==null)mono(Math.abs(numeric)>=10?fixed(numeric,0):fixed(numeric,1),gx+(c+.5)*size,gy+(r+.5)*size,palette.text,8,'center');}));};
        sectionTitle('input',x,top+22);let receptive=[];if(index>=0){const [r,c]=positions[index];for(let kr=0;kr<3;kr++)for(let kc=0;kc<3;kc++){const ir=r*stride+kr-padding,ic=c*stride+kc-padding;if(ir>=0&&ic>=0&&ir<7&&ic<7)receptive.push([ir,ic]);}}drawGrid(input,x,y,cell,receptive);x+=7*cell+gap;
        sectionTitle('kernel',x,top+22);drawGrid(kernel,x,y+2*cell,cell);x+=3*cell+gap;
        sectionTitle('feature map',x,top+22);drawGrid(output,x,y+Math.max(0,(7-outSize)/2)*cell,cell,index>=0?[positions[index]]:[],true);
        mono(`stride=${stride} · padding=${padding} · shared weights`,pad,bottom-10,palette.muted,9);
      }
    };
  }

  function rnnDemo(params){
    const values=parseList(params.text,10);if(!values.length||values.some(v=>!Number.isFinite(v)))throw new Error('请输入 1 到 10 个有效数字');
    let index=-1,h=0;const hidden=[];const activate=(z)=>params.option==='relu'?Math.max(0,z):params.option==='sigmoid'?sigmoid(z):Math.tanh(z);
    return {
      get complete(){return index>=values.length-1;},
      step(){if(index>=values.length-1)return;index++;h=activate(params.b*values[index]+params.a*h);hidden.push(h);},
      status:()=>index<0?'隐藏状态 h₀ = 0':`h${index+1} = ${params.option}(${fixed(params.b,2)}·${fixed(values[index],2)} + ${fixed(params.a,2)}·h${index})`,
      metrics:()=>[index+1,index<0?'--':fixed(values[index],2),index<0?'0.000':fixed(h,3),index<0?'--':fixed(params.a*(index?hidden[index-1]:0),3)],
      note:()=> Math.abs(params.a)>1?'循环权重绝对值大于 1，长序列中状态可能快速放大或饱和':'循环权重控制旧记忆保留比例，激活函数再限制新状态范围',
      draw(area){
        const {width:w,top,bottom,pad}=area,n=values.length,usable=w-pad*2,spacing=usable/n,hiddenY=top+150,inputY=top+260;
        sectionTitle('unrolled recurrent cell',pad,top+18);
        for(let i=0;i<n;i++){
          const x=pad+spacing*(i+.5),ready=i<=index;if(i<n-1)line(x+18,hiddenY,x+spacing-18,hiddenY,ready&&i<index?palette.accent:palette.line,2);
          line(x,inputY-18,x,hiddenY+23,ready?palette.accent2:palette.line,1.5);dot(x,hiddenY,23,ready?palette.accent:palette.panel2,ready?palette.accent:palette.line,1.5);mono(ready?fixed(hidden[i],2):`h${i+1}`,x,hiddenY,ready?palette.bg:palette.muted,9,'center');dot(x,inputY,17,palette.panel2,ready?palette.accent2:palette.line,1.5);mono(fixed(values[i],1),x,inputY,palette.text,8,'center');mono(`t${i+1}`,x,inputY+30,palette.muted,8,'center');
        }
        const py=Math.min(bottom-110,inputY+72),ph=bottom-py-10;plotFrame(pad,py,usable,ph,'TIME','HIDDEN');if(hidden.length){const max=Math.max(1,...hidden.map(Math.abs));drawPolyline(hidden.map((v,i)=>[pad+(i+.5)/n*usable,py+ph/2-v/max*(ph*.42)]),palette.good,2);line(pad,py+ph/2,pad+usable,py+ph/2,palette.line,1);}
      }
    };
  }

  function attentionDemo(params){
    const tokens=params.text.trim().split(/\s+/).filter(Boolean).slice(0,8);if(tokens.length<2)throw new Error('请至少输入两个以空格分隔的词元');
    const dim=Math.round(params.b); const base=tokens.map((token,index)=>Array.from({length:dim},(_,d)=>{const code=[...token].reduce((sum,ch,i)=>sum+ch.charCodeAt(0)*(i+d+1),0);return Math.sin(code*.017+d*1.7)+Math.cos((index+1)*(d+1)*.63);}));
    const q=base.map((row,i)=>row.map((v,d)=>params.option==='position'?Math.sin((i+1)*(d+1)):(params.option==='semantic'?v:v+.45*Math.sin((i+1)*(d+1)))));
    const k=base.map((row,i)=>row.map((v,d)=>params.option==='position'?Math.cos((i+1)*(d+1)):(params.option==='semantic'?v:v+.45*Math.cos((i+1)*(d+1)))));
    const matrix=q.map(row=>softmax(k.map(key=>row.reduce((sum,v,d)=>sum+v*key[d],0)/Math.sqrt(dim)/params.a)));
    let row=-1;
    return {
      get complete(){return row>=tokens.length-1;},step(){row=Math.min(tokens.length-1,row+1);},
      status:()=>row<0?'等待选择第一个查询词':`查询“${tokens[row]}”正在聚合全部 ${tokens.length} 个位置`,
      metrics:()=>{if(row<0)return ['--','--','--','--'];const weights=matrix[row],max=Math.max(...weights),key=weights.indexOf(max),entropy=-weights.reduce((s,v)=>s+(v? v*Math.log(v):0),0);return [tokens[row],tokens[key],fixed(max,3),fixed(entropy,3)];},
      note:()=> '每一行权重之和等于 1；降低温度会让最大点积获得更集中的注意力',
      draw(area){
        const {width:w,top,bottom,pad}=area,n=tokens.length;const cell=Math.floor(Math.min(54,(w-pad*2-86)/n,(bottom-top-104)/(n+1)));const size=Math.max(28,cell),gridW=size*n,x=(w-gridW)/2,y=top+70;
        sectionTitle('scaled dot-product attention',pad,top+18,`QKᵀ / √${dim}`);
        tokens.forEach((token,i)=>{mono(token.slice(0,4),x+(i+.5)*size,y-18,palette.text,9,'center');mono(token.slice(0,4),x-12,y+(i+.5)*size,palette.text,9,'right');});
        for(let r=0;r<n;r++)for(let c=0;c<n;c++){const revealed=r<=row,value=matrix[r][c];ctx.save();ctx.globalAlpha=revealed?.12+value*.85:.08;ctx.fillStyle=r===row?palette.accent2:palette.accent;ctx.fillRect(x+c*size+1,y+r*size+1,size-2,size-2);ctx.restore();ctx.strokeStyle=r===row?palette.accent2:palette.line;ctx.lineWidth=r===row?1.5:1;ctx.strokeRect(x+c*size+.5,y+r*size+.5,size-1,size-1);if(revealed&&size>=34)mono(fixed(value,2),x+(c+.5)*size,y+(r+.5)*size,value>.42?palette.bg:palette.text,8,'center');}
        if(row>=0){const weights=matrix[row],barY=y+gridW+31;mono(`QUERY: ${tokens[row]}`,x,barY,palette.accent2,9);let bx=x+Math.min(120,gridW*.28),remaining=Math.max(80,gridW-(bx-x));weights.forEach((value,i)=>{ctx.fillStyle=i%2?palette.good:palette.accent;ctx.globalAlpha=.4+value*.6;ctx.fillRect(bx,barY-7,remaining*value,14);bx+=remaining*value;});ctx.globalAlpha=1;}
      }
    };
  }

  const autoPatterns={
    zero:['00111100','01100110','11000011','11000011','11000011','11000011','01100110','00111100'],
    one:['00011000','00111000','00011000','00011000','00011000','00011000','00011000','00111100'],
    cross:['10000001','01000010','00100100','00011000','00011000','00100100','01000010','10000001']
  };
  function autoencoderDemo(params){
    const target=autoPatterns[params.option].flatMap(row=>[...row].map(Number)),latentSize=Math.round(params.b),maxSteps=clamp(Math.round(parseNumber(params.text,150)),10,1200),random=seeded(991+latentSize);
    const w1=Array.from({length:latentSize},()=>Array.from({length:64},()=>(random()-.5)*.28)),b1=Array(latentSize).fill(0);
    const w2=Array.from({length:64},(_,j)=>Array.from({length:latentSize},(_,i)=>w1[i][j])),b2=Array(64).fill(0);
    let step=0,noisy=[...target],latent=Array(latentSize).fill(.5),recon=Array(64).fill(.5),loss=.25;
    const train=()=>{
      noisy=target.map(value=>random()<params.a?1-value:value); latent=w1.map((row,i)=>sigmoid(row.reduce((s,v,j)=>s+v*noisy[j],b1[i])));recon=w2.map((row,j)=>sigmoid(row.reduce((s,v,i)=>s+v*latent[i],b2[j])));
      const dOut=recon.map((value,j)=>(value-target[j])*value*(1-value));const oldW2=w2.map(row=>[...row]);
      for(let j=0;j<64;j++){for(let i=0;i<latentSize;i++)w2[j][i]-=.45*dOut[j]*latent[i];b2[j]-=.45*dOut[j];}
      const dLat=latent.map((value,i)=>dOut.reduce((s,d,j)=>s+d*oldW2[j][i],0)*value*(1-value));
      for(let i=0;i<latentSize;i++){for(let j=0;j<64;j++)w1[i][j]-=.45*dLat[i]*noisy[j];b1[i]-=.45*dLat[i];}
      loss=recon.reduce((s,value,j)=>s+(value-target[j])**2,0)/64;
    };
    return {
      get complete(){return step>=maxSteps;},step(){for(let i=0;i<3&&step<maxSteps;i++){train();step++;}},
      status:()=>step?`编码 → ${latentSize} 维瓶颈 → 解码，已更新 ${step} 次`:'等待第一次去噪重建',
      metrics:()=>[step,latentSize,fixed(loss,4),`${(recon.filter((v,i)=>(v>=.5?1:0)===target[i]).length/64*100).toFixed(0)}%`],
      note:()=> '左侧输入含随机翻转噪声；瓶颈越窄，模型越必须保留真正稳定的结构',
      draw(area){
        const {width:w,top,bottom,pad}=area;const cell=Math.max(14,Math.min(27,(w-pad*2-150)/16,(bottom-top-70)/8));const grid=cell*8;const left=pad+(w-pad*2-grid*2-110)/2,y=top+62,right=left+grid+110;
        const drawPixels=(values,x,title)=>{sectionTitle(title,x,top+25);values.forEach((value,i)=>{ctx.save();ctx.globalAlpha=.12+value*.86;ctx.fillStyle=palette.accent;ctx.fillRect(x+(i%8)*cell+1,y+Math.floor(i/8)*cell+1,cell-2,cell-2);ctx.restore();ctx.strokeStyle=palette.line;ctx.strokeRect(x+(i%8)*cell+.5,y+Math.floor(i/8)*cell+.5,cell-1,cell-1);});};
        drawPixels(noisy,left,'noisy input');drawPixels(recon,right,'reconstruction');const cx=left+grid+55;sectionTitle('latent',cx-25,top+25);latent.forEach((value,i)=>{const by=y+i*(grid/latentSize),bh=Math.max(8,grid/latentSize-6);panel(cx-21,by,42,bh,palette.panel2,null);ctx.fillStyle=palette.accent2;ctx.fillRect(cx-21,by,42*value,bh);mono(fixed(value,2),cx,by+bh/2,palette.text,8,'center');});line(left+grid+8,y+grid/2,cx-26,y+grid/2,palette.line,2);line(cx+26,y+grid/2,right-8,y+grid/2,palette.line,2);
        mono(`noise ${(params.a*100).toFixed(0)}%`,left,y+grid+23,palette.muted,9);mono(`MSE ${fixed(loss,4)}`,right,y+grid+23,palette.muted,9);
      }
    };
  }

  function ganDemo(params){
    const settings={right:[1.5,.62],left:[-1.35,.55],wide:[.7,1.05]},[targetMean,targetStd]=settings[params.option],maxSteps=clamp(Math.round(parseNumber(params.text,140)),10,1000),batch=Math.round(params.b),random=seeded(2027);
    let spare=null;const normal=()=>{if(spare!==null){const value=spare;spare=null;return value;}let u=Math.max(1e-8,random()),v=random(),mag=Math.sqrt(-2*Math.log(u));spare=mag*Math.sin(2*Math.PI*v);return mag*Math.cos(2*Math.PI*v);};
    let mu=-2,logSigma=Math.log(1.05),da=.15,db=0,step=0,dLoss=1.386,gLoss=.693;
    return {
      get complete(){return step>=maxSteps;},
      step(){
        let ga=0,gb=0,dl=0;for(let i=0;i<batch;i++){const real=targetMean+targetStd*normal(),fake=mu+Math.exp(logSigma)*normal(),dr=sigmoid(da*real+db),df=sigmoid(da*fake+db);ga+=(dr-1)*real+df*fake;gb+=(dr-1)+df;dl+=-Math.log(dr+1e-8)-Math.log(1-df+1e-8);}da-=params.a*ga/batch;db-=params.a*gb/batch;da=clamp(da,-8,8);db=clamp(db,-8,8);dLoss=dl/batch;
        let gm=0,gs=0,gl=0;const sigma=Math.exp(logSigma);for(let i=0;i<batch;i++){const z=normal(),fake=mu+sigma*z,d=sigmoid(da*fake+db),dx=(d-1)*da;gm+=dx;gs+=dx*sigma*z;gl+=-Math.log(d+1e-8);}mu-=params.a*1.1*gm/batch;logSigma-=params.a*.55*gs/batch;mu=clamp(mu,-3.5,3.5);logSigma=clamp(logSigma,Math.log(.18),Math.log(2));gLoss=gl/batch;step++;
      },
      status:()=>step?`判别器与生成器完成第 ${step} 轮交替更新`:'生成器从错误分布开始，等待对抗训练',
      metrics:()=>[step,fixed(dLoss,3),fixed(gLoss,3),fixed(Math.abs(mu-targetMean),3)],
      note:()=> '生成分布应逐渐靠近真实分布；判别器过强或过弱都会让生成器拿不到有用梯度',
      draw(area){
        const {width:w,top,bottom,pad}=area,x=pad+32,y=top+42,pw=w-pad*2-46,ph=bottom-top-80;sectionTitle('adversarial distributions',pad,top+10);plotFrame(x,y,pw,ph,'SAMPLE x','DENSITY / D(x)');
        const min=-4,max=4,sx=v=>x+(v-min)/(max-min)*pw,sy=v=>y+ph-v*ph*.82;const density=(v,m,s)=>Math.exp(-.5*((v-m)/s)**2)/(s*Math.sqrt(2*Math.PI));const real=[],fake=[],disc=[];
        for(let i=0;i<=100;i++){const v=min+i/100*(max-min);real.push([sx(v),sy(density(v,targetMean,targetStd))]);fake.push([sx(v),sy(density(v,mu,Math.exp(logSigma)))]);disc.push([sx(v),y+ph-sigmoid(da*v+db)*ph*.72]);}
        drawPolyline(real,palette.good,2.5);drawPolyline(fake,palette.rose,2.5);drawPolyline(disc,palette.accent2,1.8);
        [['REAL','good'],['GENERATED','rose'],['DISCRIMINATOR','accent2']].forEach(([name,color],i)=>{line(x+12+i*126,y+18,x+30+i*126,y+18,palette[color],3);mono(name,x+36+i*126,y+18,palette.text,9);});
        line(sx(targetMean),y+ph-14,sx(targetMean),y+ph,palette.good,2);line(sx(mu),y+ph-14,sx(mu),y+ph,palette.rose,2);mono(`μreal=${fixed(targetMean,2)}  μgen=${fixed(mu,2)}  σgen=${fixed(Math.exp(logSigma),2)}`,x+10,y+ph-17,palette.text,9);
      }
    };
  }

  const factories = {
    'activation-functions': activationDemo,
    'perceptron-classifier': perceptronDemo,
    'neural-network-forward-pass': forwardDemo,
    'backpropagation': backpropDemo,
    'optimizer-comparison': optimizerDemo,
    'convolutional-neural-network': cnnDemo,
    'recurrent-neural-network': rnnDemo,
    'transformer-self-attention': attentionDemo,
    'autoencoder': autoencoderDemo,
    'generative-adversarial-network': ganDemo
  };

  let demo = null, playing = false, timer = 0, framePending = false;
  function params() { return { text:$('input-text').value.trim(), option:$('option').value, a:Number($('param-a').value), b:Number($('param-b').value) }; }
  function stop() { playing=false;clearTimeout(timer);timer=0;if(demo&&demo.complete)$('play').textContent='重播';else $('play').textContent='播放'; }
  function reset() {
    stop(); $('error').textContent='';
    try { demo=factories[slug](params()); update(); }
    catch(error) { demo=null;$('error').textContent=error.message;$('status').textContent='参数无效';invalidate(); }
  }
  function update() {
    if(!demo)return;$('status').textContent=demo.status();demo.metrics().forEach((value,index)=>$(`metric-${index+1}`).textContent=value);$('note').textContent=demo.note();
    if(demo.complete)stop();invalidate();
  }
  function stepOnce() { if(!demo)return;if(demo.complete){reset();return;}demo.step();update(); }
  function schedule() { if(!playing)return;stepOnce();if(!playing||!demo||demo.complete)return;timer=setTimeout(schedule,Math.max(45,520/Number($('speed').value))); }
  function togglePlay() { if(!demo)return;if(demo.complete)reset();playing=!playing;$('play').textContent=playing?'暂停':'播放';clearTimeout(timer);if(playing)schedule(); }
  function invalidate() { if(framePending)return;framePending=true;requestAnimationFrame(draw); }
  function draw() {
    framePending=false;const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}ctx.setTransform(dpr,0,0,dpr,0,0);palette=readPalette();ctx.fillStyle=palette.bg;ctx.fillRect(0,0,rect.width,rect.height);
    if(demo)demo.draw(canvasArea());else{label('请修正参数后重新应用',rect.width/2,rect.height/2,palette.danger,13,'center',500);}
  }

  configure();
  $('apply').addEventListener('click',reset);$('reset').addEventListener('click',reset);$('step').addEventListener('click',stepOnce);$('play').addEventListener('click',togglePlay);
  $('option').addEventListener('change',reset);
  ['param-a','param-b'].forEach((id,index)=>$(id).addEventListener('input',()=>{updateRange(id,index?config.b:config.a);reset();}));
  $('speed').addEventListener('input',()=>{$('speed-value').textContent=`${Number($('speed').value).toFixed(2).replace(/0$/,'')}x`;});
  $('input-text').addEventListener('keydown',(event)=>{if(event.key==='Enter')reset();});
  new ResizeObserver(invalidate).observe(canvas);window.addEventListener('beforeunload',stop);reset();
})();
