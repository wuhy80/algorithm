const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchFStructures = {
  'monotonic-stack-queue': {
    statement: '用单调双端队列求滑动窗口最大值：队头到队尾存下标且对应值严格递减，窗口右移时队头出界即弹、新元素从队尾弹掉所有更小者。返回每个窗口的最大值数组。',
    input: 'data 为 {"nums": 整数数组, "k": 窗口宽度}，1 <= k <= len(nums)。',
    output: '返回长度 len(nums) - k + 1 的整数数组。',
    constraints: ['1 <= len(nums) <= 10^5', '1 <= k <= len(nums)', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      example({ nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, [3, 3, 5, 5, 6, 7]),
    ],
    tests: [
      example({ nums: [1], k: 1 }, [1]),
      example({ nums: [9, 8, 7, 6], k: 2 }, [9, 8, 7]),
      example({ nums: [2, 2, 2], k: 2 }, [2, 2]),
      example({ nums: [4, -2], k: 2 }, [4]),
    ],
    insights: ['队列里的下标对应的值单调递减，队头恒为窗口最大值——每个元素至多入队一次出队一次，整体 O(n)。', '「弹掉队尾更小者」的正确性：被弹元素比新元素早过期且更小，永远不可能再成为答案。'],
    pitfalls: ['队内存下标而非值，才能判断队头是否滑出窗口（i - deque[0] >= k 时弹出）。', '窗口左边界从 0 开始右移，输出从 i = k-1 时开始记录。'],
    solution: `from collections import deque


def solve(data):
    nums = list(data["nums"])
    k = int(data["k"])
    dq = deque()
    out = []
    for i, value in enumerate(nums):
        while dq and nums[dq[-1]] <= value:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out
`,
  },

  'bitset-bitmap': {
    statement: '用位图对非负整数去重排序：把每个数对应的位清点置 1，再按位序扫描输出升序去重结果。返回 {"sorted_unique": 升序去重数组, "bits_used": 置 1 的位数}。',
    input: 'data 为 {"nums": 非负整数数组, "bits": 位图长度（大于最大值）}。',
    output: '返回 {"sorted_unique": 整数数组, "bits_used": 整数}。',
    constraints: ['0 <= len(nums) <= 10^5', '0 <= nums[i] < bits <= 10^6'],
    examples: [
      example({ nums: [5, 3, 5, 1, 3], bits: 8 }, { sorted_unique: [1, 3, 5], bits_used: 3 }),
    ],
    tests: [
      example({ nums: [], bits: 4 }, { sorted_unique: [], bits_used: 0 }),
      example({ nums: [0, 0, 0], bits: 1 }, { sorted_unique: [0], bits_used: 1 }),
      example({ nums: [7, 6, 7, 0], bits: 8 }, { sorted_unique: [0, 6, 7], bits_used: 3 }),
    ],
    insights: ['位图排序把「比较排序」换成「基数思维」：值域即地址，置 1 O(1)、输出按位扫描，时间和空间都与值域线性相关。', '去重是置位操作的天生属性——第二次置 1 是幂等的。'],
    pitfalls: ['bits 上限必须大于最大值，越界下标要提前拒绝（本题输入保证合法）。', '空数组输出空列表与 0，不要输出整张 0 位图。'],
    solution: `def solve(data):
    bits = int(data["bits"])
    bitmap = bytearray(bits)
    for value in data["nums"]:
        bitmap[int(value)] = 1
    unique_sorted = [i for i in range(bits) if bitmap[i]]
    return {"sorted_unique": unique_sorted, "bits_used": len(unique_sorted)}
`,
  },

  'doubly-linked-list': {
    statement: '用哨兵双向链表实现操作序列：pushFront/pushBack 头尾插入，popFront/popBack 弹出并返回值（空表返回 null），remove 删除第一个等于给定值的节点并返回是否成功。返回操作输出数组与最终链表的正反遍历。',
    input: 'data 为 {"ops": [...]}，op 形如 ["pushFront", v]、["pushBack", v]、["popFront"]、["popBack"]、["remove", v]。',
    output: '返回 {"outputs": 操作输出数组, "forward": 正序数组, "backward": 逆序数组}。',
    constraints: ['1 <= ops.length <= 200', '|v| <= 10^6'],
    examples: [
      example({ ops: [["pushBack", 1], ["pushFront", 2], ["popFront"], ["remove", 1], ["popBack"]] }, { outputs: [2, true, null], forward: [], backward: [] }),
    ],
    tests: [
      example({ ops: [["pushBack", 1], ["pushBack", 2], ["pushFront", 0]] }, { outputs: [], forward: [0, 1, 2], backward: [2, 1, 0] }),
      example({ ops: [["popFront"]] }, { outputs: [null], forward: [], backward: [] }),
      example({ ops: [["pushBack", 5], ["remove", 5], ["remove", 5]] }, { outputs: [true, false], forward: [], backward: [] }),
      example({ ops: [["pushFront", 3], ["pushBack", 4], ["popBack"], ["pushBack", 7]] }, { outputs: [4], forward: [3, 7], backward: [7, 3] }),
    ],
    insights: ['哨兵头尾节点让「空表弹出的边界」「O(1) 尾插」都退化成统一的指针改写，这是双向链表实现 LRU、Deque 的地基。', 'remove 按值删除要同时摘除前驱后继两根指针，漏一根就断链。'],
    pitfalls: ['空表 pop 返回 null 而不是报错。', 'backward 遍历从尾哨兵前驱出发，方向别写反。'],
    solution: `def solve(data):
    head = ["H", None, None]
    tail = ["T", head, None]
    head[2] = tail
    nodes = {}

    def push_front(value):
        node = [value, head, head[2]]
        head[2][1] = node
        head[2] = node

    def push_back(value):
        node = [value, tail[1], tail]
        tail[1][2] = node
        tail[1] = node

    def pop_front():
        first = head[2]
        if first is tail:
            return None
        first[1][2] = first[2]
        first[2][1] = first[1]
        return first[0]

    def pop_back():
        last = tail[1]
        if last is head:
            return None
        last[1][2] = last[2]
        last[2][1] = last[1]
        return last[0]

    def remove_value(value):
        node = head[2]
        while node is not tail:
            if node[0] == value:
                node[1][2] = node[2]
                node[2][1] = node[1]
                return True
            node = node[2]
        return False

    outputs = []
    for op in data["ops"]:
        kind = op[0]
        if kind == "pushFront":
            push_front(op[1])
        elif kind == "pushBack":
            push_back(op[1])
        elif kind == "popFront":
            outputs.append(pop_front())
        elif kind == "popBack":
            outputs.append(pop_back())
        else:
            outputs.append(remove_value(op[1]))
    forward = []
    node = head[2]
    while node is not tail:
        forward.append(node[0])
        node = node[2]
    backward = []
    node = tail[1]
    while node is not head:
        backward.append(node[0])
        node = node[1]
    return {"outputs": outputs, "forward": forward, "backward": backward}
`,
  },

  'circular-linked-list': {
    statement: '用循环链表实现约瑟夫环：n 个人围成一圈从 1 号开始报数，报到 k 的人出列，下一个人从 1 重新报数。返回 {"order": 出列顺序（n-1 人）, "survivor": 幸存者编号}，编号从 1 开始。',
    input: 'data 为 {"n": 人数, "k": 报数上限}，1 <= k。',
    output: '返回 {"order": 整数数组, "survivor": 整数}。',
    constraints: ['1 <= n <= 100', '1 <= k <= 100'],
    examples: [
      example({ n: 5, k: 2 }, { order: [2, 4, 1, 5], survivor: 3 }, '经典约瑟夫环'),
    ],
    tests: [
      example({ n: 1, k: 3 }, { order: [], survivor: 1 }),
      example({ n: 6, k: 3 }, { order: [3, 6, 4, 2, 5], survivor: 1 }),
      example({ n: 4, k: 4 }, { order: [4, 1, 3], survivor: 2 }),
    ],
    insights: ['循环链表的出列操作只改一根指针；报数指针走到 k-1 时跳过下一节点，天然处理环形回绕。', '约瑟夫环有 O(n) 递推公式 f(1)=0, f(m) = (f(m-1)+k) mod m——链表模拟是它的直观版本。'],
    pitfalls: ['编号从 1 开始而链表下标从 0 开始，差一错误是本题主陷阱。', '只剩一人时停止循环，幸存者不再入 order。'],
    solution: `def solve(data):
    n = int(data["n"])
    k = int(data["k"])
    if n == 1:
        return {"order": [], "survivor": 1}
    ring = list(range(1, n + 1))
    pos = 0
    order = []
    while len(ring) > 1:
        pos = (pos + k - 1) % len(ring)
        order.append(ring.pop(pos))
    return {"order": order, "survivor": ring[0]}
`,
  },

  'n-ary-tree': {
    statement: '对以 parent 数组给出的有根树（parent[root] = -1，其余 parent[i] 为父节点下标）统计每个节点的深度（根为 0）与子树大小（含自身）。用迭代后序与逐层传播实现。返回 {"depth": [...], "subtree_size": [...]}。',
    input: 'data 为 {"parent": 整数数组}。',
    output: '返回 {"depth": 整数数组, "subtree_size": 整数数组}。',
    constraints: ['1 <= n <= 500', '输入保证是一棵合法的树'],
    examples: [
      example({ parent: [-1, 0, 0, 1, 1] }, { depth: [0, 1, 1, 2, 2], subtree_size: [5, 3, 1, 1, 1] }),
    ],
    tests: [
      example({ parent: [-1] }, { depth: [0], subtree_size: [1] }),
      example({ parent: [-1, 0, 1, 2] }, { depth: [0, 1, 2, 3], subtree_size: [4, 3, 2, 1] }),
      example({ parent: [-1, 0, 0, 0] }, { depth: [0, 1, 1, 1], subtree_size: [4, 1, 1, 1] }),
    ],
    insights: ['parent 数组天然是「子指向父」的链：深度沿链上溯可缓存，子树大小按逆 BFS 序累加一次完成。', 'BFS 序保证父亲先于孩子出现，逆序累加即后序语义。'],
    pitfalls: ['parent 数组的节点顺序未必保证父在前，直接顺序递推深度会用到未算好的值——必须先 BFS。'],
    solution: `def solve(data):
    parent = [int(p) for p in data["parent"]]
    n = len(parent)
    root = parent.index(-1)
    children = [[] for _ in range(n)]
    for i, p in enumerate(parent):
        if p != -1:
            children[p].append(i)
    depth = [0] * n
    order = []
    queue = [root]
    head = 0
    while head < len(queue):
        u = queue[head]
        head += 1
        order.append(u)
        for v in children[u]:
            depth[v] = depth[u] + 1
            queue.append(v)
    size = [1] * n
    for u in reversed(order):
        p = parent[u]
        if p != -1:
            size[p] += size[u]
    return {"depth": depth, "subtree_size": size}
`,
  },

  'open-addressing-hash-table': {
    statement: '实现线性探测哈希表：槽位数 size，插入从 hash(key) = key % size 起找第一个空槽（循环回绕），find 沿同一路径查找直到遇空槽。返回 find 的输出数组与最终槽位表（空槽为 null）。',
    input: 'data 为 {"size": 槽位数, "ops": [["insert", k], ["find", k], ...]}，key 为非负整数且 < size 的键域由取模映射。',
    output: '返回 {"outputs": find 的布尔数组, "table": 长度 size 的数组（整数或 null）}。',
    constraints: ['1 <= size <= 32', '1 <= ops.length <= 100', '插入数不超过槽位数', '0 <= key < size * 4'],
    examples: [
      example({ size: 5, ops: [["insert", 1], ["insert", 6], ["find", 6], ["find", 2]] }, { outputs: [true, false], table: [null, 1, 6, null, null] }, '6 % 5 = 1 已占用，线性探测落到槽 2'),
    ],
    tests: [
      example({ size: 3, ops: [["insert", 0], ["insert", 1], ["insert", 2], ["find", 2]] }, { outputs: [true], table: [0, 1, 2] }),
      example({ size: 4, ops: [["insert", 4], ["find", 4], ["insert", 8], ["find", 8]] }, { outputs: [true, true], table: [4, 8, null, null] }, '4 与 8 都映射槽 0，8 线性探测落到槽 1'),
      example({ size: 2, ops: [["find", 1]] }, { outputs: [false], table: [null, null] }),
    ],
    insights: ['线性探测的「聚集」效应：连续占用的槽越长，后续键的探测路径越长——这也是负载因子要控制在 0.7 以下的原因。', '插入与查找共用同一探测序列，才能保证「插入过就能找到」。'],
    pitfalls: ['探测到表尾要回绕到 0，忘取模会越界。', 'find 遇到空槽即可断言不存在，不能继续扫全表。'],
    solution: `def solve(data):
    size = int(data["size"])
    table = [None] * size
    outputs = []

    def probe(key):
        return key % size

    for op in data["ops"]:
        kind, key = op[0], int(op[1])
        idx = probe(key)
        if kind == "insert":
            while table[idx] is not None:
                if table[idx] == key:
                    break
                idx = (idx + 1) % size
            if table[idx] is None:
                table[idx] = key
        else:
            found = False
            steps = 0
            while steps < size:
                if table[idx] is None:
                    break
                if table[idx] == key:
                    found = True
                    break
                idx = (idx + 1) % size
                steps += 1
            outputs.append(found)
    return {"outputs": outputs, "table": table}
`,
  },

  'string-builder': {
    statement: '用可增长缓冲实现字符串构建器：append 尾接、insert 在指定位置插入、delete 删除指定区段、charAt 返回字符（越界返回 null）。返回 charAt 的输出数组与最终字符串。',
    input: 'data 为 {"ops": [["append", s], ["insert", pos, s], ["delete", pos, length], ["charAt", pos], ...]}。',
    output: '返回 {"outputs": charAt 的字符数组或 null, "final": 字符串}。',
    constraints: ['1 <= ops.length <= 100', '位置参数保证合法（charAt 可越界）', '单段字符串长度 1..20'],
    examples: [
      example({ ops: [["append", "hello"], ["insert", 0, ">>"], ["charAt", 1], ["delete", 0, 2]] }, { outputs: [">"], final: "hello" }, 'delete 掉前缀后恢复原串'),
    ],
    tests: [
      example({ ops: [["append", "ab"], ["append", "cd"], ["charAt", 2]] }, { outputs: ["c"], final: "abcd" }),
      example({ ops: [["append", "abc"], ["insert", 1, "XY"]] }, { outputs: [], final: "aXYbc" }),
      example({ ops: [["append", "abcdef"], ["delete", 1, 3], ["charAt", 1], ["charAt", 99]] }, { outputs: ["e", null], final: "aef" }),
    ],
    insights: ['构建器的要点是「均摊尾接 O(1)」：缓冲区倍增扩容让 append 的均摊成本常数化，中间插入才是 O(n)。', 'delete 用切片拼接最直观，工程实现会搬移缓冲区避免多次分配。'],
    pitfalls: ['charAt 越界返回 null 而不是抛错。', 'insert 的 pos 允许等于当前长度（等价 append）。'],
    solution: `def solve(data):
    buf = ""
    outputs = []
    for op in data["ops"]:
        kind = op[0]
        if kind == "append":
            buf += op[1]
        elif kind == "insert":
            pos = int(op[1])
            buf = buf[:pos] + op[2] + buf[pos:]
        elif kind == "delete":
            pos, length = int(op[1]), int(op[2])
            buf = buf[:pos] + buf[pos + length:]
        else:
            pos = int(op[1])
            outputs.append(buf[pos] if 0 <= pos < len(buf) else None)
    return {"outputs": outputs, "final": buf}
`,
  },

  'median-of-medians': {
    statement: '用中位数的中位数（median of medians）选择算法求第 k 小（k 从 1 开始）：按 5 个一组取中位数、递归求组中位数的中位数作为 pivot 三分划，保证最坏 O(n)。返回第 k 小的值。',
    input: 'data 为 {"nums": 整数数组, "k": 序数}，1 <= k <= len(nums)。',
    output: '返回第 k 小的值（整数）。',
    constraints: ['1 <= len(nums) <= 2000', '-10^6 <= nums[i] <= 10^6'],
    examples: [
      example({ nums: [7, 1, 5, 3, 9, 2], k: 3 }, 3),
    ],
    tests: [
      example({ nums: [5], k: 1 }, 5),
      example({ nums: [2, 2, 2, 2], k: 2 }, 2),
      example({ nums: [9, -1, 4, 4, 0], k: 4 }, 4),
      example({ nums: [100, -100], k: 1 }, -100),
    ],
    insights: ['按 5 分组取中位数使 pivot 至少把 30% 元素甩到一侧——这个常数保证最坏线性，是它与普通 quickselect 的本质区别。', '三分划分（<、=、>）让大量重复元素不退化。'],
    pitfalls: ['k 是 1-based，三分后进入分支时要把等于区的计数扣掉。', '递归求「中位数的中位数」也要走同一个选择函数，不要用 sorted 兜底。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    k = int(data["k"])

    def select(arr, target):
        if len(arr) <= 5:
            return sorted(arr)[target]
        groups = [sorted(arr[i:i + 5])[len(arr[i:i + 5]) // 2] for i in range(0, len(arr), 5)]
        pivot = select(groups, len(groups) // 2)
        smaller = [v for v in arr if v < pivot]
        equal = [v for v in arr if v == pivot]
        larger = [v for v in arr if v > pivot]
        if target < len(smaller):
            return select(smaller, target)
        if target < len(smaller) + len(equal):
            return pivot
        return select(larger, target - len(smaller) - len(equal))

    return select(nums, k - 1)
`,
  },

  'meet-in-the-middle': {
    statement: '用折半搜索（Meet in the Middle）统计「从 n 个数中选出一个子集（可为空），元素和恰为 target」的方案数：前半枚举 2^(n/2) 个子集和排序，后半枚举后在有序表中二分配对。',
    input: 'data 为 {"nums": 整数数组（n ≤ 20）, "target": 整数}。',
    output: '返回方案数（整数）。',
    constraints: ['1 <= n <= 20', '-10^7 <= nums[i], target <= 10^7'],
    examples: [
      example({ nums: [1, 2, 3], target: 3 }, 2, '{3} 与 {1,2}'),
    ],
    tests: [
      example({ nums: [0], target: 0 }, 2, '空子集与 {0}'),
      example({ nums: [1, -1, 1], target: 0 }, 3, '空集、{1,-1}（前一个 1）、{1,-1}（后一个 1）'),
      example({ nums: [5, 5, 5, 5], target: 10 }, 6, '四个 5 中任取两个，C(4,2)=6 个子集'),
      example({ nums: [1, 2, 4], target: 8 }, 0),
    ],
    insights: ['2^n 枚举撑不住 n=20，折半后两次 2^10 加一次二分，复杂度从 2^20 降到 2^10·10。', '排序后半的和表后用 bisect 统计「target - 前半和」的区间宽度，重复值天然被计入。'],
    pitfalls: ['空子集也算一个方案（和为 0），target = 0 时别漏。', '两半的划分按下标切，元素值可负，排序后的区间统计才正确。'],
    solution: `import bisect


def solve(data):
    nums = [int(v) for v in data["nums"]]
    target = int(data["target"])
    half = len(nums) // 2
    left = nums[:half]
    right = nums[half:]

    def subset_sums(arr):
        sums = [0]
        for value in arr:
            sums += [s + value for s in sums]
        return sums

    left_sums = subset_sums(left)
    right_sums = sorted(subset_sums(right))
    total = 0
    for s in left_sums:
        lo = bisect.bisect_left(right_sums, target - s)
        hi = bisect.bisect_right(right_sums, target - s)
        total += hi - lo
    return total
`,
  },

  introsort: {
    statement: '实现内省排序（Introsort）：快排（Lomuto 划分、取中位数为 pivot）递归深度超过 2·log2(n) 时切换堆排序，子区间长度 ≤ 16 用插入排序收尾。返回升序结果。',
    input: 'data 为 {"nums": 整数数组}。',
    output: '返回升序整数数组。',
    constraints: ['0 <= len(nums) <= 2000', '|nums[i]| <= 10^6'],
    examples: [
      example({ nums: [5, 2, 9, 1, 5, 6] }, [1, 2, 5, 5, 6, 9]),
    ],
    tests: [
      example({ nums: [] }, []),
      example({ nums: [1] }, [1]),
      example({ nums: [3, 3, 3] }, [3, 3, 3]),
      example({ nums: [9, -4, 0, 7, -4] }, [-4, -4, 0, 7, 9]),
    ],
    insights: ['Introsort 的聪明在于「给快排设保险」：深度超限说明划分严重偏斜，切换堆排序保住 O(n log n) 最坏界。', '小区间切插入排序是常数优化：小规模下插入排序的简单性跑赢分治开销。'],
    pitfalls: ['深度上限在首次调用时算好并随递归递减，每层都重算会失去保护意义。', '堆排序要在原区间内建堆，堆属性只对该子区间成立。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    limit = 2 * max(1, n.bit_length())

    def insertion(lo, hi):
        for i in range(lo + 1, hi + 1):
            value = nums[i]
            j = i - 1
            while j >= lo and nums[j] > value:
                nums[j + 1] = nums[j]
                j -= 1
            nums[j + 1] = value

    def heapsort(lo, hi):
        size = hi - lo + 1

        def sift(start, end):
            root = start
            while root * 2 + 1 <= end:
                child = root * 2 + 1
                if child + 1 <= end and nums[lo + child] < nums[lo + child + 1]:
                    child += 1
                if nums[lo + root] < nums[lo + child]:
                    nums[lo + root], nums[lo + child] = nums[lo + child], nums[lo + root]
                    root = child
                else:
                    return

        end = size - 1
        start = (size - 2) // 2
        while start >= 0:
            sift(start, end)
            start -= 1
        while end > 0:
            nums[lo], nums[lo + end] = nums[lo + end], nums[lo]
            end -= 1
            sift(0, end)

    def partition(lo, hi):
        mid = (lo + hi) // 2
        a, b, c = nums[lo], nums[mid], nums[hi]
        pivot = sorted([a, b, c])[1]
        i = lo
        for j in range(lo, hi + 1):
            if nums[j] < pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        return i

    def quick(lo, hi, depth):
        while lo < hi:
            if hi - lo + 1 <= 16:
                insertion(lo, hi)
                return
            if depth == 0:
                heapsort(lo, hi)
                return
            depth -= 1
            split = partition(lo, hi)
            quick(lo, split - 1, depth)
            lo = split

    quick(0, n - 1, limit)
    return nums
`,
  },

  timsort: {
    statement: '实现 Timsort 的主循环（教学简化版）：识别天然升/降游程（降游程原位反转），短于 minrun=32 的游程用二分插入补齐，再用「合并相邻游程并保持栈不变量」的归并策略合成有序数组。返回升序结果。',
    input: 'data 为 {"nums": 整数数组}。',
    output: '返回升序整数数组。',
    constraints: ['0 <= len(nums) <= 2000', '|nums[i]| <= 10^6'],
    examples: [
      example({ nums: [5, 4, 3, 2, 1, 0, 9] }, [0, 1, 2, 3, 4, 5, 9], '天然降游程反转变升游程'),
    ],
    tests: [
      example({ nums: [] }, []),
      example({ nums: [2, 1, 3, 1, 1] }, [1, 1, 1, 2, 3]),
      example({ nums: [1, 2, 3, 4] }, [1, 2, 3, 4], '天然有序直接返回'),
      example({ nums: [7, 7, 7, 1, 9, 9] }, [1, 7, 7, 7, 9, 9]),
    ],
    insights: ['Timsort 的核心观察：真实数据几乎总带天然有序片段——识别并保留游程比从零划分省得多。', '合并时遵循「游程栈的不变量」（栈顶三段长度关系），保证归并的平衡与整体 O(n log n)。'],
    pitfalls: ['降游程必须先原位反转再入栈，方向判错会把有序段打乱。', '合并时若右游程先耗尽要把剩余左游程接回去，指针越界是本实现最常见的错误。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n < 2:
        return nums
    runs = []
    i = 0
    while i < n:
        run_start = i
        i += 1
        if i < n and nums[i] < nums[i - 1]:
            while i < n and nums[i] < nums[i - 1]:
                i += 1
            nums[run_start:i] = reversed(nums[run_start:i])
        while i < n and nums[i] >= nums[i - 1]:
            i += 1
        end = i
        while end - run_start < 32 and i < n:
            value = nums[i]
            j = i - 1
            while j >= run_start and nums[j] > value:
                nums[j + 1] = nums[j]
                j -= 1
            nums[j + 1] = value
            i += 1
            end = i
        runs.append((run_start, end))

    def merge(start, mid, end):
        left = nums[start:mid]
        right = nums[mid:end]
        i = j = 0
        k = start
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                nums[k] = left[i]
                i += 1
            else:
                nums[k] = right[j]
                j += 1
            k += 1
        while i < len(left):
            nums[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            nums[k] = right[j]
            j += 1
            k += 1

    while len(runs) > 1:
        start_a, end_a = runs[-2]
        start_b, end_b = runs[-1]
        merge(start_a, end_a, end_b)
        runs[-2:] = [(start_a, end_b)]
    return nums
`,
  },

  'external-merge-sort': {
    statement: '外排归并：给定若干已排序的顺串（runs）与内存可同时容纳的路数 memory，用 k 路归并（每次取 memory 个顺串合并成新顺串）迭代到只剩一个顺串。返回 {"sorted": 最终升序数组, "passes": 归并轮数}。',
    input: 'data 为 {"runs": [[整数], ...], "memory": ≥ 2 的整数}，每个 run 已升序。',
    output: '返回 {"sorted": 整数数组, "passes": 整数}；只有 1 个 run 时轮数为 0。',
    constraints: ['1 <= runs.length <= 20', '每个 run 长度 0..100', '2 <= memory <= 10', 'run 内元素已升序'],
    examples: [
      example({ runs: [[1, 4], [2, 3], [0, 5]], memory: 2 }, { sorted: [0, 1, 2, 3, 4, 5], passes: 2 }, '先并前两个，再与第三个合并'),
    ],
    tests: [
      example({ runs: [[1, 2]], memory: 2 }, { sorted: [1, 2], passes: 0 }),
      example({ runs: [[], []], memory: 2 }, { sorted: [], passes: 1 }),
      example({ runs: [[1, 3, 5], [2, 4, 6], [0, 9], [7, 8]], memory: 3 }, { sorted: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], passes: 2 }),
      example({ runs: [[5], [1], [3]], memory: 2 }, { sorted: [1, 3, 5], passes: 2 }),
    ],
    insights: ['k 路归并的轮数是对数级的：每轮把顺串数量除以 memory——这正是外排面对「内存装不下数据」的分层思想。', '每轮内部用小顶堆（或两两归并）合并一批顺串，新顺串写回「磁盘」等下一轮。'],
    pitfalls: ['空顺串参与合并不改变结果但计入轮数。', '最后一轮不足 memory 个时有多少合并多少。'],
    solution: `import heapq


def solve(data):
    runs = [list(run) for run in data["runs"]]
    memory = int(data["memory"])
    passes = 0
    while len(runs) > 1:
        next_runs = []
        for start in range(0, len(runs), memory):
            merged = []
            heap = []
            for run_idx, run in enumerate(runs[start:start + memory]):
                if run:
                    heap.append((run[0], run_idx, 0))
            heapq.heapify(heap)
            while heap:
                value, run_idx, pos = heapq.heappop(heap)
                merged.append(value)
                if pos + 1 < len(runs[start + run_idx]):
                    nxt = runs[start + run_idx][pos + 1]
                    heapq.heappush(heap, (nxt, run_idx, pos + 1))
            next_runs.append(merged)
        runs = next_runs
        passes += 1
    return {"sorted": runs[0] if runs else [], "passes": passes}
`,
  },
};
