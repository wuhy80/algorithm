const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchFML = {
  'activation-functions': {
    statement: '对一组标量逐个计算三种最常用的激活函数：ReLU(x) = max(0, x)；Sigmoid(x) = 1/(1+e^(-x))；Tanh(x) = 双曲正切。每个 x 产出三元组 [ReLU 值, Sigmoid 值, Tanh 值]，三个分量各自 round(x, 6)，按输入顺序排成二维数组返回；values 为空数组时返回 []。约定 |x| <= 20，直接按公式计算即可，无需做防溢出处理。',
    input: 'data 为 {"values": 数值数组}，元素可含整数与小数。',
    output: '返回二维数组，第 i 行为 [max(0, x_i), 1/(1+e^(-x_i)), tanh(x_i)]，三个分量均 round 6；空输入返回 []。',
    constraints: ['0 <= values.length <= 1000', '-20 <= 每个元素 <= 20'],
    examples: [
      example({ values: [0, 2, -1] }, [[0, 0.5, 0], [2, 0.880797, 0.964028], [0, 0.268941, -0.761594]], 'x=2 时 sigmoid=1/(1+e^-2)≈0.880797，tanh(2)≈0.964028'),
    ],
    tests: [
      example({ values: [] }, []),
      example({ values: [20, -20] }, [[20, 1, 1], [0, 0, -1]], '大幅值下 sigmoid 趋近 1/0，tanh 趋近 ±1'),
      example({ values: [0.5] }, [[0.5, 0.622459, 0.462117]]),
    ],
    insights: [
      'ReLU 在正半轴是恒等映射、负半轴输出 0，既没有饱和区又只做一次比较，是深网络默认首选；Sigmoid 与 Tanh 在 |x| 增大时导数趋近 0，容易出现梯度消失。',
      'Tanh 只是 Sigmoid 的零中心缩放版：tanh(x) = 2·sigmoid(2x) - 1，两者曲线形状相同，差别仅在值域 (0,1) 与 (-1,1)——零中心输出对下一层梯度更友好。',
    ],
    pitfalls: [
      'ReLU 在 x = 0 处不可导，本题约定 x <= 0 一律输出 0，正负分支的边界归属要写清。',
      'x 很负时 e^(-x) 会直接上溢，本题限定 |x| <= 20 才允许裸算；写通用实现时应按 x 的符号拆成两种等价算式。',
    ],
    solution: `import math

def solve(data):
    result = []
    for x in data["values"]:
        relu = x if x > 0 else 0.0
        sigmoid = 1.0 / (1.0 + math.exp(-x))
        tanh = math.tanh(x)
        result.append([round(float(relu), 6), round(sigmoid, 6), round(tanh, 6)])
    return result
`,
  },

  'perceptron-classifier': {
    statement: '训练一个二维感知机。参数初始化为 w1 = 0、w2 = 0、b = 1，学习率固定 lr = 0.1。每一轮（epoch）按 points 给定顺序逐点处理：先算 z = w1·x + w2·y + b，当且仅当 z > 0 预测为类 1（z = 0 视为类 0）；若预测与标签不符，立即同步更新 w1 += lr·(label - pred)·x、w2 += lr·(label - pred)·y、b += lr·(label - pred)。共跑 epochs 轮，但若某个完整一轮内一次更新都没有发生则提前停止。返回 {"weights": [w1, w2, b]（各 round 6）, "accuracy": 用停止时的最终参数在全部样本上的正确率（round 6）}。',
    input: 'data 为 {"points": [[x, y, label], ...], "epochs": 正整数}，label 取 0 或 1，数据保证线性可分。',
    output: '返回 {"weights": 长度 3 的数组, "accuracy": [0,1] 内小数}，浮点值均 round 6。',
    constraints: ['1 <= points.length <= 100', '|x| <= 100 且 |y| <= 100，label ∈ {0, 1}', '数据线性可分，1 <= epochs <= 10000'],
    examples: [
      example({ points: [[1, 1, 1], [2, 2, 1], [-1, -1, 0], [-2, -1, 0]], epochs: 10 }, { weights: [0.4, 0.3, 0.7], accuracy: 1 }, '第 3 轮全部分对后提前停机'),
    ],
    tests: [
      example({ points: [[0, 0, 0], [2, 2, 1], [-1, 1, 0]], epochs: 20 }, { weights: [0.5, -0.1, -0.1], accuracy: 1 }),
      example({ points: [[1, 1, 1], [-1, -1, 0], [-1, 1, 0]], epochs: 1 }, { weights: [0.2, 0, 0.8], accuracy: 0.333333 }, '只训 1 轮尚未收敛，正确率 1/3'),
    ],
    insights: [
      '更新量 (label - pred) 只在误分类时非零：把正例误判成 0 时权重沿该样本方向前推一步，反之回拉，这等价于最小化感知机准则 Σ(-label·w·样本)，且保证每步都朝分对的方向走。',
      '线性可分时感知机收敛定理保证有限次更新内停机；「一整轮零更新」这一提前终止条件恰好说明当前参数已把训练集全部分对，再迭代也不会变化。',
    ],
    pitfalls: [
      'z 恰好为 0 的归属必须写死：本题约定仅 z > 0 判类 1，z = 0 判类 0，边界样本因此可能仍触发更新。',
      '更新必须逐点立即生效——后一个点要用前一个点更新过的参数来预测；先收集一轮梯度再统一应用是另一套算法，结果不同。',
    ],
    solution: `def solve(data):
    points = data["points"]
    epochs = int(data["epochs"])
    lr = 0.1
    w1, w2, b = 0.0, 0.0, 1.0
    for _ in range(epochs):
        updated = False
        for px, py, label in points:
            pred = 1 if w1 * px + w2 * py + b > 0 else 0
            err = label - pred
            if err != 0:
                w1 += lr * err * px
                w2 += lr * err * py
                b += lr * err
                updated = True
        if not updated:
            break
    correct = 0
    for px, py, label in points:
        pred = 1 if w1 * px + w2 * py + b > 0 else 0
        if pred == label:
            correct += 1
    return {
        "weights": [round(w1, 6), round(w2, 6), round(b, 6)],
        "accuracy": round(correct / len(points), 6),
    }
`,
  },

  'neural-network-forward-pass': {
    statement: '实现两层全连接网络的前向传播。第一层：hidden[j] = ReLU(sum_i weights1[j][i]·input[i] + bias1[j])；第二层：output[k] = Sigmoid(sum_j weights2[k][j]·hidden[j] + bias2[k])，Sigmoid 直接按 1/(1+e^(-t)) 计算。weights1 形状为 隐层维数×输入维数、weights2 形状为 输出维数×隐层维数，均按「行=输出维、列=输入维」的行主序存放。返回 {"hidden": [...], "output": [...]}，每个分量 round 6。',
    input: 'data 为 {"input": [...], "weights1": 二维数组, "bias1": [...], "weights2": 二维数组, "bias2": [...]}。',
    output: '返回 {"hidden": 隐层激活向量, "output": 输出层激活向量}，每个分量 round 6。',
    constraints: ['1 <= 输入维数、隐层维数、输出维数 <= 32', '所有权重与偏置绝对值 <= 10'],
    examples: [
      example({ input: [1, 2], weights1: [[0.5, -0.5], [0.3, 0.8]], bias1: [0.1, -0.2], weights2: [[1, 2]], bias2: [0.5] }, { hidden: [0, 1.7], output: [0.98016] }, '隐层加权和 -0.4 被 ReLU 截成 0，另一路 1.7 通过'),
    ],
    tests: [
      example({ input: [0, 0], weights1: [[0.5, -0.5], [0.3, 0.8]], bias1: [0.1, -0.2], weights2: [[1, 2]], bias2: [0.5] }, { hidden: [0.1, 0], output: [0.645656] }),
      example({ input: [3], weights1: [[1], [-2]], bias1: [0, 1], weights2: [[0.5, 0.5]], bias2: [0] }, { hidden: [3, 0], output: [0.817574] }),
    ],
    insights: [
      '前向传播就是「仿射变换 + 逐元素激活」的交替：行主序矩阵的每一行对应一个神经元的权重，一层计算恰好退化为一串点积加偏置。',
      'ReLU 的分段线性让正信号原样通过、保留尺度信息；末层用 Sigmoid 把任意实数压进 (0,1)，天然适合作为概率输出。',
    ],
    pitfalls: [
      '矩阵按 行=输出维、列=输入维 存放，转置着乘要么形状对不上、要么数值全错。',
      '激活函数位置不能互换：隐层 ReLU、输出层 Sigmoid；若把 Sigmoid 放进隐层，负的加权和也会被压成 (0,1) 的正数，整网输出随之改变。',
    ],
    solution: `import math

def sig(t):
    if t >= 0:
        return 1.0 / (1.0 + math.exp(-t))
    e = math.exp(t)
    return e / (1.0 + e)

def r6(v):
    if isinstance(v, list):
        return [r6(x) for x in v]
    return round(v, 6)

def solve(data):
    x = data["input"]
    hidden = []
    for row, bj in zip(data["weights1"], data["bias1"]):
        pre = sum(row[i] * x[i] for i in range(len(x))) + bj
        hidden.append(pre if pre > 0 else 0.0)
    output = []
    for row, bj in zip(data["weights2"], data["bias2"]):
        pre = sum(row[j] * hidden[j] for j in range(len(hidden))) + bj
        output.append(sig(pre))
    return {"hidden": r6(hidden), "output": r6(output)}
`,
  },

  backpropagation: {
    statement: '在「隐层 ReLU、输出层 Sigmoid」的两层网络上做一步反向传播。前向：h_pre[j] = sum_i weights1[j][i]·x[i] + bias1[j]，h[j] = ReLU(h_pre[j])，o_pre[k] = sum_j weights2[k][j]·h[j] + bias2[k]，o[k] = Sigmoid(o_pre[k])。损失按 MSE = (1/K)·sum_k (o[k]-label[k])^2 计量（K 为输出维数，损失值本身不进返回值）。梯度约定输出层误差信号 dOut[k] = (o[k]-label[k])·o[k]·(1-o[k])·(1/K)（把 MSE 求导产生的因子 2 并入该约定的简写）。随后：dW2[k][j] = dOut[k]·h[j]，db2[k] = dOut[k]；dHid[j] = (sum_k dOut[k]·W2旧[k][j])·g[j]，其中 g[j] = 1 当且仅当 h_pre[j] > 0（含 h_pre[j] = 0 时取 0）；dW1[j][i] = dHid[j]·x[i]，db1[j] = dHid[j]。所有梯度均基于更新前的参数计算，最后统一执行 参数 <- 参数 - lr·梯度。返回更新后的 {"weights1", "bias1", "weights2", "bias2"}，每个分量 round 6。',
    input: 'data 为 {"input", "weights1", "bias1", "weights2", "bias2", "label": 长度为输出维数的数组, "lr": 正数}。',
    output: '返回 {"weights1", "bias1", "weights2", "bias2"}，结构与输入一致，每个分量 round 6。',
    constraints: ['1 <= 输入维数、隐层维数、输出维数 <= 32', '权重、偏置与 label 分量绝对值 <= 10', '0 < lr <= 1'],
    examples: [
      example({ input: [1, 2], weights1: [[0.5, -0.5], [0.3, 0.8]], bias1: [0.1, -0.2], weights2: [[1, 2]], bias2: [0.5], label: [0], lr: 0.5 }, { weights1: [[0.5, -0.5], [0.280939, 0.761878]], bias1: [0.1, -0.219061], weights2: [[1, 1.983798]], bias2: [0.49047] }, '预测 0.98016 远高于标签 0，正通路权重被压低'),
    ],
    tests: [
      example({ input: [0, 0], weights1: [[0.5, -0.5], [0.3, 0.8]], bias1: [0.1, -0.2], weights2: [[1, 2]], bias2: [0.5], label: [1], lr: 0.5 }, { weights1: [[0.5, -0.5], [0.3, 0.8]], bias1: [0.140534, -0.2], weights2: [[1.004053, 2]], bias2: [0.540534] }, '输入为 0 时权重梯度为 0，只有偏置移动'),
      example({ input: [1], weights1: [[2], [-1]], bias1: [0, 0.5], weights2: [[1, -1], [0.5, 2]], bias2: [0, 0.1], label: [1, 0], lr: 0.2 }, { weights1: [[1.994223], [-1]], bias1: [-0.005777, 0.5], weights2: [[1.002503, -1], [0.471885, 2]], bias2: [0.001252, 0.085942] }, '第二个隐单元 h_pre=-0.5 被 ReLU 门控关断，参数不动'),
    ],
    insights: [
      '链式法则在层间只传递一个误差向量：输出误差先与旧权重 W2 加权求和，再乘上 ReLU 的 0/1 门控就得到隐层误差——反向传播正是靠这种「只带一个向量」的复用把计算量压到与前向同阶。',
      'Sigmoid 配 MSE 时输出误差里带 o·(1-o) 因子，输出饱和到接近 0 或 1 时梯度趋近 0；这解释了为什么后续实践改用交叉熵损失来抵消这一因子。',
    ],
    pitfalls: [
      '计算 dHid 必须使用更新前的 W2：若先更新了 W2 再回传隐层梯度，一步训练的结果就会偏差，这是手写反向传播最常见的顺序错误。',
      'ReLU 在 h_pre = 0 处约定导数为 0（仅 h_pre > 0 才回传梯度），边界写反会让恰落在 0 的单元意外收到梯度。',
    ],
    solution: `import math

def sig(t):
    if t >= 0:
        return 1.0 / (1.0 + math.exp(-t))
    e = math.exp(t)
    return e / (1.0 + e)

def r6(v):
    if isinstance(v, list):
        return [r6(x) for x in v]
    return round(v, 6)

def solve(data):
    x = data["input"]
    w1 = [row[:] for row in data["weights1"]]
    b1 = data["bias1"][:]
    w2 = [row[:] for row in data["weights2"]]
    b2 = data["bias2"][:]
    label = data["label"]
    lr = float(data["lr"])
    nin = len(x)
    nhid = len(w1)
    nout = len(w2)
    h_pre = []
    for j in range(nhid):
        h_pre.append(sum(w1[j][i] * x[i] for i in range(nin)) + b1[j])
    h = [p if p > 0 else 0.0 for p in h_pre]
    o = []
    for k in range(nout):
        pre = sum(w2[k][j] * h[j] for j in range(nhid)) + b2[k]
        o.append(sig(pre))
    d_out = [(o[k] - label[k]) * o[k] * (1.0 - o[k]) / nout for k in range(nout)]
    new_w2 = []
    new_b2 = []
    for k in range(nout):
        new_w2.append([w2[k][j] - lr * d_out[k] * h[j] for j in range(nhid)])
        new_b2.append(b2[k] - lr * d_out[k])
    new_w1 = []
    new_b1 = []
    for j in range(nhid):
        back = sum(d_out[k] * w2[k][j] for k in range(nout))
        gate = 1.0 if h_pre[j] > 0 else 0.0
        dh = back * gate
        new_w1.append([w1[j][i] - lr * dh * x[i] for i in range(nin)])
        new_b1.append(b1[j] - lr * dh)
    return {
        "weights1": r6(new_w1),
        "bias1": r6(new_b1),
        "weights2": r6(new_w2),
        "bias2": r6(new_b2),
    }
`,
  },

  'optimizer-comparison': {
    statement: '在凸函数 f(x) = (x-3)^2 上比较两种优化器，均从 x0 = 0 出发、独立迭代 steps 步，梯度 g(x) = 2(x-3)。(a) SGD：lr = 0.1，每步 x <- x - lr·g(x)。(b) 动量法：lr = 0.1、β = 0.9，速度 v 初始为 0；每步先用当前 x 计算 g，再更新 v <- β·v + lr·g，最后 x <- x - v（先更 v 后更 x，且 v 使用本步的 g）。返回 {"sgd_x": SGD 终点, "momentum_x": 动量法终点}，各 round 6。',
    input: 'data 为 {"steps": 正整数}。',
    output: '返回 {"sgd_x": ..., "momentum_x": ...}，两个标量均 round 6。',
    constraints: ['1 <= steps <= 100000'],
    examples: [
      example({ steps: 4 }, { sgd_x: 1.7712, momentum_x: 3.9258 }, '动量法第 4 步已经冲过最优点 3，SGD 还在缓慢逼近'),
    ],
    tests: [
      example({ steps: 1 }, { sgd_x: 0.6, momentum_x: 0.6 }, 'v 从 0 出发，两法第一步重合'),
      example({ steps: 12 }, { sgd_x: 2.793842, momentum_x: 1.71517 }, '动量法过冲后阻尼振荡，第 12 步摆到谷底另一侧'),
    ],
    insights: [
      '二次面上 SGD 每步把到最优点的距离乘以 (1 - lr·L) = 0.8，故闭式解 x_t = 3·(1 - 0.8^t)，几何收敛但永远不越过谷底。',
      '动量法把历史梯度指数加权成速度，等效步长被放大为 lr/(1-β)，因此会冲过最优点再阻尼振荡收敛；本组参数下振幅衰减率约 0.89，体现了「快但会抖」的典型权衡。',
    ],
    pitfalls: [
      '动量法必须先用当前 x 的 g 更新 v、再用新 v 移动 x；若先移动 x 再取梯度，轨迹从第 1 步起就不同。',
      '两条轨迹只是第一步重合（v0 = 0），之后动量法一路领先甚至过冲，不要把 SGD 的收敛值套用到动量法上。',
    ],
    solution: `def solve(data):
    steps = int(data["steps"])
    xs = 0.0
    for _ in range(steps):
        g = 2.0 * (xs - 3.0)
        xs -= 0.1 * g
    xm = 0.0
    v = 0.0
    for _ in range(steps):
        g = 2.0 * (xm - 3.0)
        v = 0.9 * v + 0.1 * g
        xm -= v
    return {"sgd_x": round(xs, 6), "momentum_x": round(xm, 6)}
`,
  },

  'convolutional-neural-network': {
    statement: '实现二维有效互相关（valid，无填充、步幅 1、卷积核不翻转）：输出尺寸为 (H-kh+1)×(W-kw+1)，out[i][j] = sum_{ki,kj} input[i+ki][j+kj]·kernel[ki][kj]。输出每个元素 round 6，按行主序作为二维数组返回。',
    input: 'data 为 {"input": H×W 二维数组, "kernel": kh×kw 二维数组}，保证 kh < H 且 kw < W。',
    output: '返回 (H-kh+1)×(W-kw+1) 的二维数组，每个元素 round 6。',
    constraints: ['2 <= H, W <= 16', '1 <= kh < H 且 1 <= kw < W', '所有元素绝对值 <= 100'],
    examples: [
      example({ input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], kernel: [[1, 0], [0, -1]] }, [[-4, -4], [-4, -4]], '对角差分核：每个窗口等于左上角减右下角'),
    ],
    tests: [
      example({ input: [[2.5, -1], [0, 3.25]], kernel: [[1]] }, [[2.5, -1], [0, 3.25]], '1×1 核退化为逐元素拷贝'),
      example({ input: [[1, 0, 2], [3, 1, 4], [5, 2, 6], [7, 3, 8]], kernel: [[1, 1, 1], [0, 0, 1]] }, [[7], [14], [21]], '4×3 输入配 2×3 核：上一整行求和，下一行只取末列'),
    ],
    insights: [
      '深度学习里的 conv 层实现的其实是互相关（核不翻转）：卷积与互相关只差 180° 翻转，而核参数靠训练学得，翻转与否会被参数自行吸收。',
      '有效卷积只保留核完全落入输入的窗口，输出比输入小一圈；想保持空间尺寸才需要 padding，这也是「valid / same」两种模式的由来。',
    ],
    pitfalls: [
      '本题是互相关而非翻转卷积：把 kernel 旋转 180° 再滑窗，遇到非对称核会得到完全不同的特征图。',
      'out[i][j] 对应以 (i, j) 为左上角的窗口，循环上界是 H-kh+1 与 W-kw+1；直接循环到 H、W 会越界读数据。',
    ],
    solution: `def solve(data):
    inp = data["input"]
    ker = data["kernel"]
    ih, iw = len(inp), len(inp[0])
    kh, kw = len(ker), len(ker[0])
    out = []
    for i in range(ih - kh + 1):
        row = []
        for j in range(iw - kw + 1):
            s = 0.0
            for ki in range(kh):
                for kj in range(kw):
                    s += inp[i + ki][j + kj] * ker[ki][kj]
            row.append(round(s, 6))
        out.append(row)
    return out
`,
  },

  'recurrent-neural-network': {
    statement: '实现单层 Elman RNN 的时间展开。h_0 为全 0 向量（维数等于 len(b)）；对序列中每个输入 x_t 依次执行：pre[j] = b[j] + sum_i wx[j][i]·x_t[i] + sum_k wh[j][k]·h_prev[k]，然后 h_new[j] = tanh(pre[j])。wx 为 隐×输入 矩阵、wh 为 隐×隐 矩阵，均按行主序。逐步更新并记录每一步得到的 h_t。返回 {"states": [h_1, h_2, ...]}，第 i 行（从 0 计）是处理完第 i+1 个输入后的隐状态，每个分量 round 6。',
    input: 'data 为 {"wx": 二维数组, "wh": 二维数组, "b": [...], "sequence": [[...], ...]}，sequence 的每行是该时间步的输入向量。',
    output: '返回 {"states": 序列长度×隐层维数 的二维数组，不含初始状态 h_0}，每个分量 round 6。',
    constraints: ['1 <= 隐层维数、输入维数 <= 16', '1 <= 序列长度 <= 64', '所有参数绝对值 <= 5'],
    examples: [
      example({ wx: [[0.5]], wh: [[0.8]], b: [0.1], sequence: [[1], [0], [0]] }, { states: [[0.53705], [0.485106], [0.452695]] }, '输入归零后状态仍沿 wh·h + b 持续演化'),
    ],
    tests: [
      example({ wx: [[0.1, 0.2], [0.3, -0.1]], wh: [[0.5, 0], [0.1, 0.4]], b: [0, 0.1], sequence: [[1, 2], [0.5, -0.5]] }, { states: [[0.462117, 0.197375], [0.179106, 0.40127]] }),
      example({ wx: [[-0.3]], wh: [[9.9]], b: [0.2], sequence: [[2]] }, { states: [[-0.379949]] }, '单步时 wh·h0 = 0，再大的 wh 也不影响结果'),
    ],
    insights: [
      'RNN 的全部记忆都折叠在隐状态里：h_t = tanh(Wx·x_t + Wh·h_{t-1} + b)，同一组权重在时间维反复共享，序列越长计算量线性增长而参数量不变。',
      'h_0 取全 0 等价于「开局无记忆」；tanh 把每一步状态压回 (-1,1)，抑制了状态幅度随序列长度指数膨胀，但过长的依赖仍会因梯度消失而难以学习。',
    ],
    pitfalls: [
      '当前步的 pre 必须同时含 wx·x_t 与 wh·h_{t-1} 以及偏置三项；把 wh 误乘到当前输入上，会从第二步起全部偏离。',
      'states 不包含初始状态 h_0，第一行就是用第一个输入算出的 h_1；输出行数等于序列长度而不是再加一。',
    ],
    solution: `import math

def solve(data):
    wx, wh, b = data["wx"], data["wh"], data["b"]
    seq = data["sequence"]
    hdim = len(b)
    h = [0.0] * hdim
    states = []
    for x in seq:
        nxt = []
        for j in range(hdim):
            s = b[j]
            for i in range(len(x)):
                s += wx[j][i] * x[i]
            for k in range(hdim):
                s += wh[j][k] * h[k]
            nxt.append(math.tanh(s))
        h = nxt
        states.append([round(v, 6) for v in h])
    return {"states": states}
`,
  },

  'transformer-self-attention': {
    statement: '实现单头缩放点积自注意力。分数 s[i][j] = (sum_t q[i][t]·k[j][t]) / sqrt(d)，d 为每个向量的维数；对每一行 i 在 j 方向上做数值稳定的 softmax：先减去该行最大值再取指数、归一化，得到注意力矩阵 A（每行和为 1）。输出 output[i] = sum_j A[i][j]·v[j]，该乘法必须使用未舍入的 A。返回 {"attention": A, "output": output}，每个分量 round 6。',
    input: 'data 为 {"q": 二维数组, "k": 二维数组, "v": 二维数组}，三者形状均为 seq_len × d。',
    output: '返回 {"attention": seq_len×seq_len 矩阵, "output": seq_len×d 矩阵}，每个分量 round 6。',
    constraints: ['1 <= seq_len <= 16', '1 <= d <= 16', 'q/k/v 元素绝对值 <= 10'],
    examples: [
      example({ q: [[1, 0], [0, 1]], k: [[1, 0], [0, 1]], v: [[1, 2], [3, 4]] }, { attention: [[0.669762, 0.330238], [0.330238, 0.669762]], output: [[1.660477, 2.660477], [2.339523, 3.339523]] }, '单位查询各自更关注同向的键'),
    ],
    tests: [
      example({ q: [[1], [2], [3]], k: [[1], [1], [1]], v: [[1], [0], [2]] }, { attention: [[0.333333, 0.333333, 0.333333], [0.333333, 0.333333, 0.333333], [0.333333, 0.333333, 0.333333]], output: [[1], [1], [1]] }, 'd=1 且键全同时，每行注意力均匀、输出同值'),
      example({ q: [[5]], k: [[-2]], v: [[7]] }, { attention: [[1]], output: [[7]] }, '单 token 序列：softmax 退化为 1，直接搬运 v'),
    ],
    insights: [
      '缩放因子 1/sqrt(d) 是稳定器：d 维点积的方差随 d 线性放大，不缩放会让 softmax 逼近 one-hot、梯度集中到单个位置；除以 sqrt(d) 使分数方差与 d 无关。',
      'softmax 前减去行最大值在数学上不改变结果（分子分母同乘同一常数），却把指数的参数压进安全区，是所有注意力实现的标准防溢出写法。',
    ],
    pitfalls: [
      'softmax 沿 j（键的方向）逐行归一化，得到每行和为 1 的矩阵；沿查询方向按列归一化是常见方向性错误。',
      '计算 output 必须用未舍入的注意力权重；若先用 round 6 的 A 去乘 v，第 6 位小数就会带入可判为错的舍入差。',
    ],
    solution: `import math

def solve(data):
    q, k, v = data["q"], data["k"], data["v"]
    n = len(q)
    d = len(q[0])
    scale = math.sqrt(d)
    att_raw = []
    att = []
    for i in range(n):
        scores = []
        for j in range(n):
            s = sum(q[i][t] * k[j][t] for t in range(d)) / scale
            scores.append(s)
        mx = max(scores)
        exps = [math.exp(s - mx) for s in scores]
        total = sum(exps)
        raw = [e / total for e in exps]
        att_raw.append(raw)
        att.append([round(a, 6) for a in raw])
    out = []
    ncols = len(v[0])
    for i in range(n):
        row = []
        for c in range(ncols):
            s = sum(att_raw[i][j] * v[j][c] for j in range(n))
            row.append(round(s, 6))
        out.append(row)
    return {"attention": att, "output": out}
`,
  },

  autoencoder: {
    statement: '实现线性自编码器的一次前向传播。编码：code[j] = Sigmoid(sum_i w_enc[j][i]·x[i] + b_enc[j])，得到瓶颈层表示；解码：recon[i] = Sigmoid(sum_j w_dec[i][j]·code[j] + b_dec[i])，得到重建。w_enc 形状为 隐×输入、w_dec 形状为 输入×隐，均行主序；Sigmoid 按 1/(1+e^(-t)) 计算。重建误差取均方误差 (1/输入维数)·sum_i (recon[i] - x[i])^2，必须用未舍入的 recon 计算。返回 {"code": [...], "reconstruction": [...], "reconstruction_error": ...}，所有数值 round 6。',
    input: 'data 为 {"input": [...], "w_enc": 二维数组, "b_enc": [...], "w_dec": 二维数组, "b_dec": [...]}。',
    output: '返回 {"code": 瓶颈向量, "reconstruction": 重建向量, "reconstruction_error": 标量}，均 round 6。',
    constraints: ['1 <= 输入维数、隐层维数 <= 16', '权重与偏置绝对值 <= 10，输入分量绝对值 <= 10'],
    examples: [
      example({ input: [1, 0], w_enc: [[0.5, -0.5]], b_enc: [0], w_dec: [[1], [2]], b_dec: [0.1, 0] }, { code: [0.622459], reconstruction: [0.673148, 0.776419], reconstruction_error: 0.354829 }, '一维瓶颈先压后放，重建已偏离原输入'),
    ],
    tests: [
      example({ input: [0, 0], w_enc: [[1, 1]], b_enc: [0.3], w_dec: [[-1], [0.5]], b_dec: [0.2, -0.1] }, { code: [0.574443], reconstruction: [0.407468, 0.546669], reconstruction_error: 0.232439 }),
      example({ input: [2], w_enc: [[1]], b_enc: [0], w_dec: [[1]], b_dec: [0] }, { code: [0.880797], reconstruction: [0.706987], reconstruction_error: 1.671882 }, '输入超出 (0,1) 时 Sigmoid 重建必然失真'),
    ],
    insights: [
      '瓶颈维数低于输入维数时网络无法照抄输入，被迫把主要信息压进低维编码——「重建输入」这个自监督目标让无标签数据也能训练出有用表示。',
      '本题编码、解码都以 Sigmoid 收尾，code 与 recon 全部落在 (0,1)；把输入先归一化到同一区间，正是这类结构的隐含前提。',
    ],
    pitfalls: [
      '重建误差必须用未舍入的重建值算完再整体 round 6；先舍入再平方会把误差放大到小数点后四五位。',
      'w_dec 的形状是 输入维×隐层维，与 w_enc 方向相反；统一按「行=输出维、列=输入维」读这两个矩阵即可避免转置错误。',
    ],
    solution: `import math

def sig(t):
    if t >= 0:
        return 1.0 / (1.0 + math.exp(-t))
    e = math.exp(t)
    return e / (1.0 + e)

def solve(data):
    x = data["input"]
    we, be = data["w_enc"], data["b_enc"]
    wd, bd = data["w_dec"], data["b_dec"]
    code = []
    for row, bj in zip(we, be):
        code.append(sig(sum(row[i] * x[i] for i in range(len(x))) + bj))
    recon = []
    for row, bj in zip(wd, bd):
        recon.append(sig(sum(row[j] * code[j] for j in range(len(code))) + bj))
    err = sum((recon[i] - x[i]) ** 2 for i in range(len(x))) / len(x)
    return {
        "code": [round(c, 6) for c in code],
        "reconstruction": [round(r, 6) for r in recon],
        "reconstruction_error": round(err, 6),
    }
`,
  },

  'generative-adversarial-network': {
    statement: '极简一维 GAN 的单步训练。生成器 G(t) = w_g·t + b_g，判别器 D(t) = Sigmoid(w_d·t + b_d)，Sigmoid 按 1/(1+e^(-t)) 计算。第一步更新判别器：先用更新前的生成器算假样本 fake = G(noise)；判别器把真实样本当标签 1、假样本当标签 0，对两个样本的梯度取平均后走一步：dw_d = [(D(real)-1)·real + D(fake)·fake] / 2，db_d = [(D(real)-1) + D(fake)] / 2，随后 w_d <- w_d - lr·dw_d，b_d <- b_d - lr·db_d。第二步更新生成器（判别器参数保持第二步开始时的值不再变动）：记 p = D_新(fake)，其中 fake 仍是第一步那个旧样本；按「希望 D(fake) 趋近 1」求梯度 dw_g = (p-1)·w_d·noise，db_g = (p-1)·w_d（此处 w_d 为刚更新后的判别器权重），随后 w_g <- w_g - lr·dw_g，b_g <- b_g - lr·db_g。返回 {"d_prob_real": 更新后的判别器对 real 的输出, "d_prob_fake": 更新后的判别器对第一步假样本 fake 的输出, "fake_sample": 更新后的生成器输出 G(noise)}，各 round 6。',
    input: 'data 为 {"w_g", "b_g", "w_d", "b_d": 初始参数（数值）, "real": 真实样本值, "noise": 噪声 z, "lr": 正数}。',
    output: '返回 {"d_prob_real", "d_prob_fake", "fake_sample"} 三个标量，均 round 6。',
    constraints: ['所有参数、real、noise 的绝对值 <= 10', '0 < lr <= 1'],
    examples: [
      example({ w_g: 0.5, b_g: 0, w_d: 1, b_d: 0, real: 1, noise: 1, lr: 0.1 }, { d_prob_real: 0.72715, d_prob_fake: 0.618047, fake_sample: 0.576229 }, '一步之后生成器输出从 0.5 朝真实值 1 移动'),
    ],
    tests: [
      example({ w_g: 1, b_g: 0.5, w_d: -0.5, b_d: 0.2, real: 0.5, noise: 3, lr: 0.2 }, { d_prob_real: 0.491479, d_prob_fake: 0.162322, fake_sample: 2.602587 }, '假样本 3.5 明显偏高，一步后被拉回 2.602587'),
      example({ w_g: 0, b_g: 0, w_d: 0, b_d: 0, real: 2, noise: 1, lr: 0.5 }, { d_prob_real: 0.622459, d_prob_fake: 0.5, fake_sample: 0.125 }, '全零初始化：判别器只被 real 样本推动'),
    ],
    insights: [
      'GAN 的单步训练是两个极小化目标的交替：判别器沿「真样本给 1、假样本给 0」的交叉熵梯度走一步，生成器再沿「让判别器把假样本误判为真」的方向挪动，双方在同一把尺子上博弈。',
      '生成器梯度 (D(fake)-1)·w_d 中携带判别器的权重 w_d：先变强的判别器给生成器提供更强的学习信号，这种「在更新后的对手身上估梯度」正是交替优化的博弈结构。',
    ],
    pitfalls: [
      '生成器更新用的 fake 必须由旧生成器参数算出，而梯度中的 w_d 必须是刚更新过的判别器权重——两处新旧弄反是手写 GAN 最常见的错误。',
      '判别器两样本的梯度要先除以样本数 2 取平均再更新，漏掉这个 1/2 等于把学习率翻倍，所有数值随之不同。',
    ],
    solution: `import math

def sig(t):
    if t >= 0:
        return 1.0 / (1.0 + math.exp(-t))
    e = math.exp(t)
    return e / (1.0 + e)

def solve(data):
    w_g = float(data["w_g"])
    b_g = float(data["b_g"])
    w_d = float(data["w_d"])
    b_d = float(data["b_d"])
    real = float(data["real"])
    noise = float(data["noise"])
    lr = float(data["lr"])
    fake = w_g * noise + b_g
    p_real = sig(w_d * real + b_d)
    p_fake = sig(w_d * fake + b_d)
    dw_d = ((p_real - 1.0) * real + p_fake * fake) / 2.0
    db_d = ((p_real - 1.0) + p_fake) / 2.0
    w_d -= lr * dw_d
    b_d -= lr * db_d
    d_prob_real = sig(w_d * real + b_d)
    d_prob_fake = sig(w_d * fake + b_d)
    dw_g = (d_prob_fake - 1.0) * w_d * noise
    db_g = (d_prob_fake - 1.0) * w_d
    w_g -= lr * dw_g
    b_g -= lr * db_g
    fake_new = w_g * noise + b_g
    return {
        "d_prob_real": round(d_prob_real, 6),
        "d_prob_fake": round(d_prob_fake, 6),
        "fake_sample": round(fake_new, 6),
    }
`,
  },
};
