const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchECompression = {
  'run-length-encoding': {
    statement: '实现行程编码（RLE）的编码与解码：encode 模式把每个由相同字符组成的连续段写成「字符 + 次数」（次数至少为 1，如 aa → a2，单个 a → a1）；decode 模式把「字符 + 次数」序列还原为原串。',
    input: 'data 为 {"mode": "encode" 或 "decode", "text": 字符串}。encode 的 text 只含小写字母；decode 的 text 保证是合法的 RLE 串。',
    output: '返回处理后的字符串；空串返回空串。',
    constraints: ['0 <= len(text) <= 10^4', 'decode 的输入保证可合法解析'],
    examples: [
      example({ mode: "encode", text: "aaabbc" }, "a3b2c1", '三个 a、两个 b、一个 c'),
    ],
    tests: [
      example({ mode: "encode", text: "" }, ""),
      example({ mode: "encode", text: "abc" }, "a1b1c1"),
      example({ mode: "decode", text: "a3b2c1" }, "aaabbc"),
      example({ mode: "decode", text: "a1" }, "a"),
      example({ mode: "encode", text: "aaaaaaaaaa" }, "a10"),
    ],
    insights: ['RLE 的信息来自「重复次数」：扫描时只维护当前段的字符与长度，段结束的瞬间即可输出，不需要回看。', '编解码互逆的前提是编码格式无歧义：本约定里次数永远显式出现，因此解码可以严格按「一字符 + 一段数字」配对。'],
    pitfalls: ['单个字符也要输出次数 1，漏写会让解码无法配对。', '解码时次数可能多位数（如 a10），只读一位数字会截断。'],
    solution: `def solve(data):
    text = data["text"]
    if data["mode"] == "encode":
        out = []
        i = 0
        n = len(text)
        while i < n:
            j = i
            while j < n and text[j] == text[i]:
                j += 1
            out.append(text[i] + str(j - i))
            i = j
        return "".join(out)
    out = []
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        j = i + 1
        while j < n and text[j].isdigit():
            j += 1
        out.append(ch * int(text[i + 1:j]))
        i = j
    return "".join(out)
`,
  },

  'huffman-coding': {
    statement: '对给定符号频率构建 Huffman 编码树：每轮从候选中取出频率最小的两棵树合并，频率较小的作为 0 分支、较大的作为 1 分支；候选用 (频率, 序号) 排序，叶节点序号按符号字母序 0..k-1，合并节点序号从 k 起递增。频率并列时取序号小者。返回每个符号的编码与总比特数。',
    input: 'data 为 {"freqs": {符号: 频率}}，符号为小写字母。',
    output: '返回 {"codes": {符号: 编码串}, "total_bits": 总比特数}，codes 按符号排序。只有一个符号时编码为 "0"。',
    constraints: ['1 <= 符号数 <= 26', '1 <= 频率 <= 10^6'],
    examples: [
      example({ freqs: { a: 2, b: 2, c: 2 } }, { codes: { a: "10", b: "11", c: "0" }, total_bits: 10 }, 'a、b 先合并，再与 c 合并'),
    ],
    tests: [
      example({ freqs: { a: 1, b: 1 } }, { codes: { a: "0", b: "1" }, total_bits: 2 }),
      example({ freqs: { x: 7 } }, { codes: { x: "0" }, total_bits: 7 }),
      example({ freqs: { a: 5, b: 9, c: 12, d: 13, e: 16, f: 45 } }, { codes: { a: "1100", b: "1101", c: "100", d: "101", e: "111", f: "0" }, total_bits: 224 }),
    ],
    insights: ['贪心正确性的根源是「最优树中频率最小的两个符号一定互为兄弟且在最深层」：合并后把子树当作一个新符号递归求解，展开即得原树。', '总比特数 = Σ 频率 × 码长，等于所有合并节点频率之和——两种算法互为验证。'],
    pitfalls: ['并列频率时的取树顺序不固定会导致码表不同，必须按题目的 (频率, 序号) 约定实现。', '只算出码长而随意指定 0/1 方向不满足本题判定，方向必须与约定一致。'],
    solution: `import heapq


def solve(data):
    freqs = data["freqs"]
    symbols = sorted(freqs)
    heap = []
    counter = 0
    for sym in symbols:
        heap.append((freqs[sym], counter, ("leaf", sym)))
        counter += 1
    heapq.heapify(heap)
    if len(heap) == 1:
        return {"codes": {symbols[0]: "0"}, "total_bits": freqs[symbols[0]]}
    while len(heap) > 1:
        f1, s1, t1 = heapq.heappop(heap)
        f2, s2, t2 = heapq.heappop(heap)
        heapq.heappush(heap, (f1 + f2, counter, ("node", t1, t2)))
        counter += 1
    root = heap[0][2]
    codes = {}
    stack = [(root, "")]
    while stack:
        tree, prefix = stack.pop()
        if tree[0] == "leaf":
            codes[tree[1]] = prefix
        else:
            stack.append((tree[2], prefix + "1"))
            stack.append((tree[1], prefix + "0"))
    total = sum(freqs[s] * len(codes[s]) for s in symbols)
    return {"codes": {s: codes[s] for s in symbols}, "total_bits": total}
`,
  },

  'lz77': {
    statement: '实现 LZ77 贪心编码：从左到右，每步在前向缓冲区（长度 lookahead）内寻找滑动窗口（长度 window）中最长的匹配；并列时取偏移量最小（最近）者。有匹配输出 [offset, length, 匹配后的下一个字符]（匹配延伸到串尾时下一字符为空串），无匹配输出 [0, 0, 当前字符]。偏移量为 1-based 回看距离，匹配允许与当前位置重叠。',
    input: 'data 为 {"text": 字符串, "window": 正整数, "lookahead": 正整数}。',
    output: '返回三元组数组。',
    constraints: ['0 <= len(text) <= 200', '1 <= window, lookahead <= 100', 'text 只含小写字母'],
    examples: [
      example({ text: "aabcaabxaaz", window: 20, lookahead: 20 }, [[0, 0, "a"], [1, 1, "b"], [0, 0, "c"], [4, 3, "x"], [4, 2, "z"]]),
    ],
    tests: [
      example({ text: "", window: 5, lookahead: 5 }, []),
      example({ text: "aaa", window: 10, lookahead: 10 }, [[0, 0, "a"], [1, 2, ""]], '匹配延伸到串尾，第三项为空串'),
      example({ text: "abcabc", window: 3, lookahead: 3 }, [[0, 0, "a"], [0, 0, "b"], [0, 0, "c"], [3, 3, ""]]),
    ],
    insights: ['每个输出三元组把「重复出现的历史」替换成一对指针，滑动窗口限制了查找范围——这正是压缩率与查找成本的折中。', '允许重叠匹配是 LZ77 的关键技巧：偏移 1、长度 n 就能表达「同一字符连续 n+1 次」的游程。'],
    pitfalls: ['并列最长匹配必须取最小偏移，遍历偏移时用严格大于更新即可天然满足。', '匹配可以越过当前窗口边界与自身重叠，比较时不能把「待编码区」当成独立缓冲区复制后越界。'],
    solution: `def solve(data):
    text = data["text"]
    window = int(data["window"])
    lookahead = int(data["lookahead"])
    n = len(text)
    out = []
    pos = 0
    while pos < n:
        best_len = 0
        best_off = 0
        start = max(0, pos - window)
        max_len = min(lookahead, n - pos)
        for off in range(1, pos - start + 1):
            length = 0
            while length < max_len and text[pos - off + length] == text[pos + length]:
                length += 1
            if length > best_len:
                best_len = length
                best_off = off
        if best_len == 0:
            out.append([0, 0, text[pos]])
            pos += 1
        else:
            literal = text[pos + best_len] if pos + best_len < n else ""
            out.append([best_off, best_len, literal])
            pos += best_len + 1
    return out
`,
  },

  'lzw': {
    statement: '实现 LZW 编码：初始字典为全部 256 个单字节字符（ASCII 码即码值），从左到右贪心扩展当前串——下一字符能并入字典命中就继续，否则输出当前串的码、把「当前串 + 下一字符」注册为新条目（码值从 256 递增）并从下一字符重新开始。扫描结束后若还有剩余串则输出其码。',
    input: 'data 为 {"text": 字符串}，只含 ASCII 可见字符。',
    output: '返回码值数组。',
    constraints: ['0 <= len(text) <= 10^4'],
    examples: [
      example({ text: "abab" }, [97, 98, 256], 'a、b 先单独输出，随后 ab 以新码 256 输出'),
    ],
    tests: [
      example({ text: "" }, []),
      example({ text: "aaaa" }, [97, 256, 97]),
      example({ text: "abcabcabc" }, [97, 98, 99, 256, 258, 257]),
    ],
    insights: ['LZW 不需要传输字典：解码端能按同样的「读到什么就注册什么」规则重建字典，压缩率来自越来越长的字典命中。', '编码与解码同步生长是 LZW 的核心不变量——每输出一个码，两端各新增恰好一个字典条目。'],
    pitfalls: ['新条目是「当前串 + 下一字符」，方向接反会让两端字典错位。', '扫描结束后剩余串必须补输出，空串则不输出任何码。'],
    solution: `def solve(data):
    text = data["text"]
    dictionary = {chr(i): i for i in range(256)}
    next_code = 256
    out = []
    current = ""
    for ch in text:
        candidate = current + ch
        if candidate in dictionary:
            current = candidate
        else:
            out.append(dictionary[current])
            dictionary[candidate] = next_code
            next_code += 1
            current = ch
    if current:
        out.append(dictionary[current])
    return out
`,
  },

  'burrows-wheeler-transform': {
    statement: '实现 Burrows-Wheeler 变换：在文本末尾追加哨兵 $（$ 小于所有小写字母），生成全部 n+1 个循环旋转串并按字典序排序，输出排序后各旋转串的最后一个字符组成的串。',
    input: 'data 为 {"text": 字符串}，只含小写字母。',
    output: '返回长度 len(text) + 1 的变换串。',
    constraints: ['1 <= len(text) <= 2000'],
    examples: [
      example({ text: "banana" }, "annb$aa", '经典结果：banana$ 的六个旋转排序后取末列'),
    ],
    tests: [
      example({ text: "a" }, "a$"),
      example({ text: "ab" }, "b$a"),
      example({ text: "mississippi" }, "ipssm$pissii"),
    ],
    insights: ['BWT 把「局部性」变成「聚类」：同一上下文前出现的字符往往在末列相邻，这正是后续 MTF + RLE 能进一步压缩的原因。', '哨兵 $ 使所有旋转互不相同且排序唯一，逆变换因此无需任何额外信息。'],
    pitfalls: ['旋转是循环移位，排序时必须比较完整的旋转串而不是前缀。', '哨兵必须参与旋转与排序，漏掉会导致逆变换歧义。'],
    solution: `def solve(data):
    text = data["text"] + "$"
    n = len(text)
    rotations = sorted(text[i:] + text[:i] for i in range(n))
    return "".join(rot[-1] for rot in rotations)
`,
  },

  'arithmetic-coding': {
    statement: '用精确有理数实现算术编码与解码。符号按字母序排列，每个符号的子区间按频率比例（freq/total）从左到右划分 [0,1)。encode：从 [0,1) 出发逐符号把当前区间缩放到该符号的子区间，返回最终区间 [low, high) 的分子分母。decode：给定区间内的一个精确值与消息长度，每轮找到值落入的符号子区间、输出该符号并把值重标定到子区间，重复 length 次。',
    input: 'data 为 {"mode": "encode" 或 "decode", ...}。encode 含 {"freqs": {符号: 正整数}, "message": 字符串}；decode 含 {"freqs": {...}, "value": [分子, 分母], "length": 正整数}（保证 0 <= value < 1 且为编码某消息的中间值）。',
    output: 'encode 返回 {"low": [分子, 分母], "high": [分子, 分母]}（已约分）；decode 返回符号数组。',
    constraints: ['1 <= 消息长度 <= 30', '1 <= 符号数 <= 8', '分数可能很大但 Python 精确有理数可处理'],
    examples: [
      example({ mode: "encode", freqs: { a: 1, b: 1 }, message: "ab" }, { low: [1, 4], high: [1, 2] }),
    ],
    tests: [
      example({ mode: "encode", freqs: { a: 1, b: 3 }, message: "b" }, { low: [1, 4], high: [1, 1] }),
      example({ mode: "decode", freqs: { a: 1, b: 1 }, value: [3, 8], length: 2 }, ["a", "b"]),
      example({ mode: "encode", freqs: { a: 2, b: 1, c: 1 }, message: "cab" }, { low: [13, 16], high: [27, 32] }),
      example({ mode: "decode", freqs: { a: 2, b: 1, c: 1 }, value: [53, 64], length: 3 }, ["c", "a", "b"]),
    ],
    insights: ['编码是区间的嵌套缩放：每读一个符号，新区间 = 旧区间按频率比例再切一刀；解码用同一个划分逆向定位。', '用精确有理数（分数）实现可以完全回避浮点误差与提前终止问题——工程实现才需要二进制重整化。'],
    pitfalls: ['区间是左闭右开，解码时边界值归属必须与编码端一致。', '缩放公式是「low + width × 子区间端点」，先把宽度乘对再用，顺序错了区间会翻转。'],
    solution: `from fractions import Fraction


def solve(data):
    freqs = data["freqs"]
    alphabet = sorted(freqs)
    total = sum(freqs[s] for s in alphabet)
    bounds = {}
    acc = Fraction(0)
    for s in alphabet:
        bounds[s] = (acc, acc + Fraction(freqs[s], total))
        acc = bounds[s][1]
    if data["mode"] == "encode":
        low, high = Fraction(0), Fraction(1)
        for ch in data["message"]:
            width = high - low
            lo, hi = bounds[ch]
            high = low + width * hi
            low = low + width * lo
        return {"low": [low.numerator, low.denominator], "high": [high.numerator, high.denominator]}
    num, den = data["value"]
    value = Fraction(num, den)
    length = int(data["length"])
    message = []
    for _ in range(length):
        for s in alphabet:
            lo, hi = bounds[s]
            if lo <= value < hi:
                message.append(s)
                value = (value - lo) / (hi - lo)
                break
    return message
`,
  },
};
