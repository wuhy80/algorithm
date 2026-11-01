const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchD = {
  'segment-tree': {
    statement: '维护一个整数数组，支持单点赋值更新与闭区间求和查询。要求使用线段树完成，每次更新与查询都只访问 O(log n) 个节点。',
    input: 'data 为 {"nums": [...], "ops": [...]}。ops 中 ["update", idx, value] 表示把下标 idx 赋值为 value，["sum", l, r] 表示查询闭区间 [l, r] 的元素和。下标均从 0 开始。',
    output: '按顺序返回所有 sum 查询的结果数组。',
    constraints: ['1 <= n <= 10^4，0 <= ops.length <= 10^4', '查询区间保证合法：0 <= l <= r < n'],
    examples: [
      example({ nums: [2, 4, 1, 7, 3], ops: [['sum', 0, 4], ['update', 2, 9], ['sum', 1, 3], ['sum', 2, 2]] }, [17, 20, 9], '初始总和 17；更新后 [2,4,9,7,3]，区间 [1,3] 和为 20，单点和为 9'),
    ],
    tests: [
      example({ nums: [5], ops: [['sum', 0, 0], ['update', 0, -2], ['sum', 0, 0]] }, [5, -2]),
      example({ nums: [], ops: [] }, []),
      example({ nums: [1, 2, 3, 4], ops: [['sum', 0, 3], ['update', 0, 10], ['sum', 0, 0], ['sum', 1, 3]] }, [10, 10, 9]),
    ],
    insights: ['树上每个节点代表一个固定区间，单点更新只影响从叶子到根的一条路径；区间查询把目标区间拆成 O(log n) 个互不重叠的节点。', '自底向上的迭代线段树把原数组放在叶子位 n..2n-1，父节点 i 的两个儿子是 2i 与 2i+1，更新沿 i>>=1 回填。'],
    pitfalls: ['查询时左指针与右指针的收缩顺序必须每轮同时处理，先处理一侧再平移会漏加端点。', '单点赋值是覆盖而非累加，更新分支不要再加旧值。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    tree = [0] * (2 * n) if n else []
    for i in range(n):
        tree[n + i] = nums[i]
    for i in range(n - 1, 0, -1):
        tree[i] = tree[2 * i] + tree[2 * i + 1]
    out = []
    for op in data["ops"]:
        if op[0] == "update":
            pos = op[1] + n
            tree[pos] = op[2]
            pos >>= 1
            while pos:
                tree[pos] = tree[2 * pos] + tree[2 * pos + 1]
                pos >>= 1
        else:
            left = op[1] + n
            right = op[2] + n + 1
            total = 0
            while left < right:
                if left & 1:
                    total += tree[left]
                    left += 1
                if right & 1:
                    right -= 1
                    total += tree[right]
                left >>= 1
                right >>= 1
            out.append(total)
    return out
`,
  },

  'lazy-segment-tree': {
    statement: '维护一个整数数组，支持区间整体加值与闭区间求和查询。要求使用带懒标记的线段树，保证每次操作 O(log n)。',
    input: 'data 为 {"nums": [...], "ops": [...]}。ops 中 ["add", l, r, v] 表示把闭区间 [l, r] 内每个元素加 v，["sum", l, r] 表示查询闭区间 [l, r] 的元素和。',
    output: '按顺序返回所有 sum 查询的结果数组。',
    constraints: ['1 <= n <= 10^4，1 <= ops.length <= 10^4', '查询区间保证合法：0 <= l <= r < n', '-100 <= v <= 100'],
    examples: [
      example({ nums: [1, 2, 3, 4, 5], ops: [['add', 1, 3, 10], ['sum', 0, 4], ['sum', 1, 2]] }, [45, 25], '加值后数组为 [1,12,13,14,5]，总和 45，区间 [1,2] 和 25'),
    ],
    tests: [
      example({ nums: [7], ops: [['add', 0, 0, -3], ['sum', 0, 0]] }, [4]),
      example({ nums: [], ops: [] }, []),
      example({ nums: [0, 0, 0], ops: [['add', 0, 2, 1], ['add', 1, 2, 1], ['sum', 0, 0], ['sum', 1, 1], ['sum', 0, 2]] }, [1, 2, 5]),
    ],
    insights: ['懒标记把“整段都被更新的节点”记在身上，只有真正下钻穿过它时才把标记结算给儿子；任何时刻节点自身的 sum 字段始终正确。', '递归下钻前先 pushdown（结算标记），回溯时用儿子重算 pullup，保证标记只延迟一层。'],
    pitfalls: ['pushdown 忘记清零父标记会导致同一段被重复加分。', '部分覆盖区间递归后必须用儿子重算当前 sum，否则区间加不会反映到祖先。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    seg = [0] * (4 * n)
    lazy = [0] * (4 * n)

    def build(node, lo, hi):
        if lo == hi:
            seg[node] = nums[lo]
            return
        mid = (lo + hi) // 2
        build(2 * node, lo, mid)
        build(2 * node + 1, mid + 1, hi)
        seg[node] = seg[2 * node] + seg[2 * node + 1]

    def push_down(node, lo, mid, hi):
        if lazy[node]:
            left_len = mid - lo + 1
            right_len = hi - mid
            seg[2 * node] += lazy[node] * left_len
            lazy[2 * node] += lazy[node]
            seg[2 * node + 1] += lazy[node] * right_len
            lazy[2 * node + 1] += lazy[node]
            lazy[node] = 0

    def update(node, lo, hi, l, r, v):
        if r < lo or hi < l:
            return
        if l <= lo and hi <= r:
            seg[node] += v * (hi - lo + 1)
            lazy[node] += v
            return
        mid = (lo + hi) // 2
        push_down(node, lo, mid, hi)
        update(2 * node, lo, mid, l, r, v)
        update(2 * node + 1, mid + 1, hi, l, r, v)
        seg[node] = seg[2 * node] + seg[2 * node + 1]

    def query(node, lo, hi, l, r):
        if r < lo or hi < l:
            return 0
        if l <= lo and hi <= r:
            return seg[node]
        mid = (lo + hi) // 2
        push_down(node, lo, mid, hi)
        return query(2 * node, lo, mid, l, r) + query(2 * node + 1, mid + 1, hi, l, r)

    build(1, 0, n - 1)
    out = []
    for op in data["ops"]:
        if op[0] == "add":
            update(1, 0, n - 1, op[1], op[2], op[3])
        else:
            out.append(query(1, 0, n - 1, op[1], op[2]))
    return out
`,
  },

  'segment-tree-beats': {
    statement: '维护一个整数数组，支持区间取最小值（对区间内每个元素执行 a[i] = min(a[i], x)）与闭区间最大值查询。要求使用 Segment Tree Beats 的“最大值、次大值、最大值个数”结构，均摊复杂度远优于逐点更新。',
    input: 'data 为 {"nums": [...], "ops": [...]}。ops 中 ["chmin", l, r, x] 表示区间 [l, r] 取 min，["max", l, r] 表示查询闭区间最大值。',
    output: '按顺序返回所有 max 查询的结果数组。',
    constraints: ['1 <= n <= 10^4，1 <= ops.length <= 10^4', '查询区间保证合法：0 <= l <= r < n'],
    examples: [
      example({ nums: [1, 5, 2, 8], ops: [['chmin', 0, 3, 4], ['max', 0, 3], ['chmin', 1, 2, 1], ['max', 0, 3]] }, [4, 4], '第一次 chmin 后数组 [1,4,2,4]，最大 4；第二次后 [1,1,1,4]，最大 4'),
    ],
    tests: [
      example({ nums: [3], ops: [['chmin', 0, 0, 9], ['max', 0, 0], ['chmin', 0, 0, 1], ['max', 0, 0]] }, [3, 1]),
      example({ nums: [5, 5, 5], ops: [['max', 0, 2], ['chmin', 0, 2, 5], ['max', 0, 2]] }, [5, 5]),
      example({ nums: [9, 1, 9, 1, 9], ops: [['chmin', 0, 4, 2], ['max', 0, 4], ['max', 1, 3], ['chmin', 2, 2, 0], ['max', 0, 4]] }, [2, 2, 2]),
    ],
    insights: ['每个节点维护 (最大值 max1、最大值个数 cnt、严格次大值 max2)：当 chmin 的 x 落在 (max2, max1) 之间时，只需把本节点 max1 改为 x 并打懒标记，不必下钻。', '标记下传时对儿子执行同样的“安全 chmin”，若 x 不小于儿子 max1 则直接返回，这是 Beats 均摊正确的关键。'],
    pitfalls: ['只改 max1 而不检查次大值会破坏结构——x 小于等于次大值时必须继续下钻。', '合并子节点时严格次大值要取两侧 max2 与另一侧 max1 的最大值，漏掉跨节点组合会出错。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    NEG = float("-inf")
    mx = [NEG] * (4 * n)
    cnt = [0] * (4 * n)
    second = [NEG] * (4 * n)
    lazy = [None] * (4 * n)

    def pull(node):
        a, b = 2 * node, 2 * node + 1
        if mx[a] == mx[b]:
            mx[node] = mx[a]
            cnt[node] = cnt[a] + cnt[b]
            second[node] = max(second[a], second[b])
        elif mx[a] > mx[b]:
            mx[node] = mx[a]
            cnt[node] = cnt[a]
            second[node] = max(second[a], mx[b])
        else:
            mx[node] = mx[b]
            cnt[node] = cnt[b]
            second[node] = max(second[b], mx[a])

    def build(node, lo, hi):
        if lo == hi:
            mx[node] = nums[lo]
            cnt[node] = 1
            return
        mid = (lo + hi) // 2
        build(2 * node, lo, mid)
        build(2 * node + 1, mid + 1, hi)
        pull(node)

    def push_down(node):
        if lazy[node] is None:
            return
        apply_chmin(2 * node, lazy[node])
        apply_chmin(2 * node + 1, lazy[node])
        lazy[node] = None

    def apply_chmin(node, x):
        if x >= mx[node]:
            return
        if second[node] < x:
            mx[node] = x
            lazy[node] = x if lazy[node] is None else min(lazy[node], x)
            return
        push_down(node)
        apply_chmin(2 * node, x)
        apply_chmin(2 * node + 1, x)
        pull(node)

    def chmin(node, lo, hi, l, r, x):
        if r < lo or hi < l or x >= mx[node]:
            return
        if l <= lo and hi <= r:
            apply_chmin(node, x)
            return
        push_down(node)
        mid = (lo + hi) // 2
        chmin(2 * node, lo, mid, l, r, x)
        chmin(2 * node + 1, mid + 1, hi, l, r, x)
        pull(node)

    def query_max(node, lo, hi, l, r):
        if r < lo or hi < l:
            return NEG
        if l <= lo and hi <= r:
            return mx[node]
        push_down(node)
        mid = (lo + hi) // 2
        return max(query_max(2 * node, lo, mid, l, r), query_max(2 * node + 1, mid + 1, hi, l, r))

    build(1, 0, n - 1)
    out = []
    for op in data["ops"]:
        if op[0] == "chmin":
            chmin(1, 0, n - 1, op[1], op[2], op[3])
        else:
            out.append(query_max(1, 0, n - 1, op[1], op[2]))
    return out
`,
  },

  'sparse-table': {
    statement: '对静态整数数组回答多次闭区间最小值查询（RMQ）。要求使用倍增稀疏表，预处理 O(n log n)，每次查询 O(1)。',
    input: 'data 为 {"nums": [...], "queries": [[l, r], ...]}，查询为 0 开始的闭区间。',
    output: '按顺序返回每个查询区间内的最小值。',
    constraints: ['1 <= n <= 10^5', '1 <= queries.length <= 10^5', '0 <= l <= r < n'],
    examples: [
      example({ nums: [3, 1, 4, 1, 5, 9, 2, 6], queries: [[0, 7], [1, 3], [5, 6]] }, [1, 1, 2]),
    ],
    tests: [
      example({ nums: [7], queries: [[0, 0]] }, [7]),
      example({ nums: [2, 2, 2], queries: [[0, 2], [1, 1]] }, [2, 2]),
      example({ nums: [5, -3, 8, -3, 0], queries: [[0, 4], [0, 1], [3, 4]] }, [-3, -3, -3]),
    ],
    insights: ['min 满足可重复贡献性（重叠不影响结果），所以查询可以用两个长度为 2^k 的重叠区间拼出任意 [l, r]。', 'table[k][i] 表示从 i 开始长 2^k 的区间最值，由两个 2^(k-1) 区间合并而来；查询 k 取 (r-l+1) 的最高位。'],
    pitfalls: ['查询右端点是 r - 2^k + 1 而不是 r - 2^k，差一位就取错区间。', '稀疏表只适合静态数组，若题目出现更新就不能直接套用。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    table = [list(nums)]
    k = 1
    while (1 << k) <= n:
        prev = table[k - 1]
        half = 1 << (k - 1)
        table.append([min(prev[i], prev[i + half]) for i in range(n - (1 << k) + 1)])
        k += 1
    out = []
    for l, r in data["queries"]:
        level = (r - l + 1).bit_length() - 1
        out.append(min(table[level][l], table[level][r - (1 << level) + 1]))
    return out
`,
  },

  'disjoint-sparse-table': {
    statement: '对静态字符串数组回答多次区间拼接查询：每次查询 [l, r] 内所有字符串按原顺序连接的结果。拼接不可交换也不可重复贡献，要求使用不相交稀疏表（Disjoint Sparse Table）在 O(1) 内回答。',
    input: 'data 为 {"words": [...], "queries": [[l, r], ...]}，查询为 0 开始的闭区间。',
    output: '按顺序返回每个查询的拼接字符串。',
    constraints: ['1 <= n <= 64', '1 <= queries.length <= 10^3', '每个单词长度 1..8，0 <= l <= r < n'],
    examples: [
      example({ words: ["ab", "cd", "ef"], queries: [[0, 2], [1, 1], [0, 1]] }, ["abcdef", "cd", "abcd"]),
    ],
    tests: [
      example({ words: ["x"], queries: [[0, 0]] }, ["x"]),
      example({ words: ["a", "b"], queries: [[0, 1], [0, 0]] }, ["ab", "a"]),
      example({ words: ["w1", "w2", "w3", "w4", "w5"], queries: [[0, 4], [2, 3], [1, 4], [3, 4]] }, ["w1w2w3w4w5", "w3w4", "w2w3w4w5", "w4w5"]),
    ],
    insights: ['在块长 2^(j+1) 的对齐块中，预处理左半的后缀积与右半的前缀积；l 与 r 的最高异或位 j 指出两者恰好在同一块的两侧，答案 = 后缀积 × 前缀积。', '区间被两个不重叠的预计算段无缝覆盖，因此即使乘法不可交换、不可重叠，也能 O(1) 回答。'],
    pitfalls: ['块的右半可能越过数组末尾，预计算必须按 min(start+size, n) 截断，否则查询末尾区间会取到未定义值。', '左右两半拼接顺序不能颠倒，这是与普通稀疏表最本质的区别。'],
    solution: `def solve(data):
    words = list(data["words"])
    n = len(words)
    if n == 0:
        return []
    levels = {}
    j = 0
    while (1 << j) < n:
        size = 1 << (j + 1)
        suf = [None] * n
        pre = [None] * n
        start = 0
        while start < n:
            end = min(start + size, n)
            mid = start + (size >> 1)
            if mid < end:
                acc = ""
                for i in range(mid - 1, start - 1, -1):
                    acc = words[i] + acc
                    suf[i] = acc
                acc = ""
                for i in range(mid, end):
                    acc = acc + words[i]
                    pre[i] = acc
            start += size
        levels[j] = (suf, pre)
        j += 1
    out = []
    for l, r in data["queries"]:
        if l == r:
            out.append(words[l])
            continue
        j = (l ^ r).bit_length() - 1
        suf, pre = levels[j]
        out.append(suf[l] + pre[r])
    return out
`,
  },

  'fenwick-tree': {
    statement: '维护一个整数数组，支持单点加值与前缀和查询（前缀指从下标 0 到 i 的闭区间和）。要求使用树状数组（Fenwick Tree），每次操作 O(log n)。',
    input: 'data 为 {"nums": [...], "ops": [...]}。ops 中 ["add", idx, v] 表示下标 idx 的元素加 v，["prefix", i] 表示查询 nums[0..i] 的和。',
    output: '按顺序返回所有 prefix 查询的结果数组。',
    constraints: ['1 <= n <= 10^4，1 <= ops.length <= 10^4', '0 <= i < n'],
    examples: [
      example({ nums: [1, 3, 5, 7], ops: [['prefix', 2], ['add', 1, 2], ['prefix', 2], ['prefix', 3]] }, [9, 11, 18]),
    ],
    tests: [
      example({ nums: [4], ops: [['prefix', 0]] }, [4]),
      example({ nums: [1, 1, 1, 1, 1], ops: [['prefix', 4], ['add', 2, -1], ['prefix', 2], ['prefix', 3]] }, [5, 2, 3]),
      example({ nums: [], ops: [] }, []),
    ],
    insights: ['下标 i 管辖的区间长度是 i & (-i)（最低位的 1），父节点就是 i + i & (-i)，沿这条链向上聚合、向下分解，恰好形成一颗隐式树。', '前缀查询把 [1, i] 拆成若干管辖区间依次累加；单点更新把增量沿着管辖链向上传递。'],
    pitfalls: ['树状数组下标习惯从 1 开始，0 会让 i & (-i) 死循环，必须整体偏移一位。', '区间更新单点查询需要另一个差分树状数组，与单点更新前缀和的用法不同。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    tree = [0] * (n + 1)

    def add(i, v):
        i += 1
        while i <= n:
            tree[i] += v
            i += i & (-i)

    def prefix(i):
        i += 1
        total = 0
        while i > 0:
            total += tree[i]
            i -= i & (-i)
        return total

    for i, v in enumerate(nums):
        add(i, v)
    out = []
    for op in data["ops"]:
        if op[0] == "add":
            add(op[1], op[2])
        else:
            out.append(prefix(op[1]))
    return out
`,
  },

  'interval-tree': {
    statement: '给定一组闭区间，回答多个点查询：对每个点找出所有包含它的区间（stabbing query）。要求使用以中位点组织的区间树，单次查询只走访必要的路径。',
    input: 'data 为 {"intervals": [[start, end], ...], "points": [x, ...]}。区间与点均为整数，intervals 中可能出现相同区间。',
    output: '对每个点返回包含它的区间在输入中的下标列表（升序）。没有匹配时返回空列表。',
    constraints: ['1 <= intervals.length <= 10^3', '1 <= points.length <= 10^3', 'start <= end'],
    examples: [
      example({ intervals: [[1, 5], [3, 7], [8, 9], [2, 4]], points: [4, 8] }, [[0, 1, 3], [2]]), 
    ],
    tests: [
      example({ intervals: [[0, 10]], points: [5, -1, 10] }, [[0], [], [0]]),
      example({ intervals: [], points: [1, 2] }, [[], []]),
      example({ intervals: [[1, 2], [1, 2], [6, 7]], points: [2, 3] }, [[0, 1], []]),
    ],
    insights: ['以某个中位值为界，与中位值相交的区间按起点升序存一份、按终点降序存一份：查询点在中位值左侧时扫起点升序表，右侧时扫终点降序表，找到第一个不满足的就可以停。', '树高由中位分割保证 log 级，每个点只被一条根到叶路径处理，相交表扫描长度由命中数决定。'],
    pitfalls: ['按起点升序扫描时，起点已大于 x 就可以剪枝；按终点降序扫描时，终点已小于 x 才剪枝，两个方向的条件不能写反。', '返回结果必须按原始下标升序整理，否则判题不稳定。'],
    solution: `def solve(data):
    intervals = data["intervals"]
    items = [(s, e, i) for i, (s, e) in enumerate(intervals)]

    def build(nodes):
        if not nodes:
            return None
        endpoints = sorted(v for s, e, _ in nodes for v in (s, e))
        center = endpoints[len(endpoints) // 2]
        left = [it for it in nodes if it[1] < center]
        right = [it for it in nodes if it[0] > center]
        here = [it for it in nodes if it[0] <= center <= it[1]]
        return {
            "center": center,
            "by_start": sorted(here, key=lambda it: (it[0], it[2])),
            "by_end": sorted(here, key=lambda it: (-it[1], it[2])),
            "left": build(left),
            "right": build(right),
        }

    root = build(items)

    def query(node, x, acc):
        if node is None:
            return
        if x < node["center"]:
            for s, e, i in node["by_start"]:
                if s <= x:
                    acc.append(i)
                else:
                    break
            query(node["left"], x, acc)
        else:
            for s, e, i in node["by_end"]:
                if e >= x:
                    acc.append(i)
                else:
                    break
            query(node["right"], x, acc)

    out = []
    for x in data["points"]:
        acc = []
        query(root, x, acc)
        out.append(sorted(acc))
    return out
`,
  },

  'merge-sort-tree': {
    statement: '对静态整数数组回答多次“区间 [l, r] 内有多少个元素 <= x”的查询。要求使用归并排序树（每个节点存该区间排序后的列表），单次查询 O(log² n)。',
    input: 'data 为 {"nums": [...], "queries": [[l, r, x], ...]}，查询为 0 开始的闭区间。',
    output: '按顺序返回每个查询的计数。',
    constraints: ['1 <= n <= 10^4', '1 <= queries.length <= 10^4'],
    examples: [
      example({ nums: [4, 1, 3, 2], queries: [[0, 3, 3], [1, 2, 2], [0, 0, 10]] }, [3, 1, 1]),
    ],
    tests: [
      example({ nums: [5], queries: [[0, 0, 4], [0, 0, 5]] }, [0, 1]),
      example({ nums: [], queries: [] }, []),
      example({ nums: [2, 2, 2], queries: [[0, 2, 2], [1, 2, 1]] }, [3, 0]),
    ],
    insights: ['构建时父节点把两个儿子的有序列表归并成自己的有序列表，区间被完整节点覆盖后用二分统计，整体是“归并排序过程 + 树上二分”的组合。', '查询拆分的正确性来自线段树的覆盖性质：完整覆盖节点内部有序，二分数就是该段贡献。'],
    pitfalls: ['统计 <= x 用 bisect_right，用 bisect_left 会把等于 x 的漏掉。', '构建时必须真的归并而不是 sorted 拼接——那会退化成本题想训练的结构理解。'],
    solution: `import bisect


def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    seg = [[] for _ in range(4 * n)]

    def build(node, lo, hi):
        if lo == hi:
            seg[node] = [nums[lo]]
            return
        mid = (lo + hi) // 2
        build(2 * node, lo, mid)
        build(2 * node + 1, mid + 1, hi)
        a, b = seg[2 * node], seg[2 * node + 1]
        merged = []
        i = j = 0
        while i < len(a) and j < len(b):
            if a[i] <= b[j]:
                merged.append(a[i])
                i += 1
            else:
                merged.append(b[j])
                j += 1
        merged.extend(a[i:])
        merged.extend(b[j:])
        seg[node] = merged

    build(1, 0, n - 1)
    out = []
    for l, r, x in data["queries"]:
        count = 0
        stack = [(1, 0, n - 1)]
        while stack:
            node, lo, hi = stack.pop()
            if r < lo or hi < l:
                continue
            if l <= lo and hi <= r:
                count += bisect.bisect_right(seg[node], x)
                continue
            mid = (lo + hi) // 2
            stack.append((2 * node, lo, mid))
            stack.append((2 * node + 1, mid + 1, hi))
        out.append(count)
    return out
`,
  },

  'li-chao-tree': {
    statement: '在线维护一组一次函数 y = a·x + b（整数系数），对给定的多个查询点 x 求所有已插入函数的最小函数值。要求使用 Li Chao Tree，域为整数 [-100, 100]，插入与查询均为 O(log 域长)。',
    input: 'data 为 {"lines": [[a, b], ...], "queries": [x, ...]}。lines 按顺序插入，queries 中的 x 均为整数。',
    output: '按顺序返回每个查询点的最小函数值（整数）。',
    constraints: ['1 <= lines.length <= 10^3', '1 <= queries.length <= 10^3', '-100 <= x <= 100，-100 <= a, b <= 100'],
    examples: [
      example({ lines: [[1, 0], [-1, 10]], queries: [0, 10, -10] }, [0, 0, -10]),
    ],
    tests: [
      example({ lines: [[2, 1]], queries: [0, 5] }, [1, 11]),
      example({ lines: [[0, -3], [0, 7]], queries: [42] }, [-3]),
      example({ lines: [[1, 0], [-1, 0], [0, -5]], queries: [0, 3, -3] }, [-5, -5, -5]),
    ],
    insights: ['每个线段树节点存“在中点处最优”的一条线；插入的新线只会在中点占优的一半子树里继续下钻，路径长 O(log 域长)。', '判断新线去左子树还是右子树，只看它是否在区间左端点仍占优：占优则去左，否则去右。'],
    pitfalls: ['比较必须用具体整数点求值，不能直接比斜率——斜率小不代表整段都小。', '交换当前线与新线后，原来的当前线要继续向下插入，忘记交换会丢函数。'],
    solution: `def solve(data):
    LO, HI = -100, 100
    tree = [None] * (4 * (HI - LO + 1))

    def better(line, other, x):
        if line is None:
            return False
        if other is None:
            return True
        return line[0] * x + line[1] < other[0] * x + other[1]

    def insert(node, lo, hi, line):
        if line is None:
            return
        mid = (lo + hi) // 2
        if better(line, tree[node], mid):
            tree[node], line = line, tree[node]
        if lo == hi:
            return
        if better(line, tree[node], lo):
            insert(2 * node, lo, mid, line)
        else:
            insert(2 * node + 1, mid + 1, hi, line)

    def query(node, lo, hi, x):
        best = None
        if tree[node] is not None:
            best = tree[node][0] * x + tree[node][1]
        if lo == hi:
            return best
        mid = (lo + hi) // 2
        if x <= mid:
            child = query(2 * node, lo, mid, x)
        else:
            child = query(2 * node + 1, mid + 1, hi, x)
        if child is not None and (best is None or child < best):
            best = child
        return best

    for a, b in data["lines"]:
        insert(1, LO, HI, [a, b])
    return [query(1, LO, HI, x) for x in data["queries"]]
`,
  },

  'sqrt-decomposition': {
    statement: '维护一个整数数组，支持区间整体加值与闭区间求和。要求使用平方根分解：把数组切成 O(√n) 块，每块维护块内和与整块加法懒值，单次操作 O(√n)。',
    input: 'data 为 {"nums": [...], "ops": [...]}。ops 中 ["add", l, r, v] 表示闭区间 [l, r] 每个元素加 v，["sum", l, r] 表示查询闭区间和。',
    output: '按顺序返回所有 sum 查询的结果数组。',
    constraints: ['1 <= n <= 10^4，1 <= ops.length <= 10^4', '0 <= l <= r < n'],
    examples: [
      example({ nums: [1, 2, 3, 4, 5, 6], ops: [['add', 1, 4, 10], ['sum', 0, 5], ['sum', 1, 2]] }, [61, 25], '加值后 [1,12,13,14,15,6]，总和 61，区间 [1,2] 和 25'),
    ],
    tests: [
      example({ nums: [8], ops: [['add', 0, 0, 2], ['sum', 0, 0]] }, [10]),
      example({ nums: [], ops: [] }, []),
      example({ nums: [0, 0, 0, 0], ops: [['add', 0, 3, 1], ['add', 2, 3, 1], ['sum', 0, 1], ['sum', 2, 3], ['sum', 1, 2]] }, [2, 4, 3]),
    ],
    insights: ['整段落在块内时打块级懒值不碰元素，散落在两端的元素直接改值并同步修正块和；查询时散块逐个元素算（含懒值），整块直接用块和。', '复杂度来源于“块内元素数 × 块数”在块长 √n 时取到最小，两头散块的处理不超过一个块长。'],
    pitfalls: ['给整块打懒值后，散块查询必须把懒值算进每个元素，漏算会得到旧值。', '最后一块可能不满，块大小要用 min(block, n - 块起点) 计算块和增量。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    block = max(1, int(n ** 0.5))
    block_count = (n + block - 1) // block
    block_sum = [0] * block_count
    block_lazy = [0] * block_count
    for b in range(block_count):
        total = 0
        for i in range(b * block, min(n, (b + 1) * block)):
            total += nums[i]
        block_sum[b] = total

    def range_add(l, r, v):
        b1, b2 = l // block, r // block
        if b1 == b2:
            for i in range(l, r + 1):
                nums[i] += v
            block_sum[b1] += v * (r - l + 1)
            return
        for i in range(l, (b1 + 1) * block):
            nums[i] += v
        block_sum[b1] += v * ((b1 + 1) * block - l)
        for b in range(b1 + 1, b2):
            block_lazy[b] += v
            block_sum[b] += v * min(block, n - b * block)
        for i in range(b2 * block, r + 1):
            nums[i] += v
        block_sum[b2] += v * (r - b2 * block + 1)

    def range_sum(l, r):
        b1, b2 = l // block, r // block
        total = 0
        if b1 == b2:
            for i in range(l, r + 1):
                total += nums[i] + block_lazy[b1]
            return total
        for i in range(l, (b1 + 1) * block):
            total += nums[i] + block_lazy[b1]
        for b in range(b1 + 1, b2):
            total += block_sum[b]
        for i in range(b2 * block, r + 1):
            total += nums[i] + block_lazy[b2]
        return total

    out = []
    for op in data["ops"]:
        if op[0] == "add":
            range_add(op[1], op[2], op[3])
        else:
            out.append(range_sum(op[1], op[2]))
    return out
`,
  },

  'wavelet-matrix': {
    statement: '对静态整数数组回答多次“区间 [l, r] 中第 k 小”的查询（k 从 1 开始）。要求使用小波矩阵（Wavelet Matrix）：逐位稳定分区 + 每层 0/1 前缀计数，单次查询 O(log 值域位数)。',
    input: 'data 为 {"nums": [...], "queries": [[l, r, k], ...]}，区间为 0 开始的闭区间，1 <= k <= r - l + 1。',
    output: '按顺序返回每个查询的第 k 小值。',
    constraints: ['1 <= n <= 10^4', '1 <= queries.length <= 10^4', '-10^6 <= nums[i] <= 10^6'],
    examples: [
      example({ nums: [3, 1, 4, 1, 5], queries: [[0, 4, 1], [0, 4, 5], [1, 3, 2], [2, 4, 2]] }, [1, 5, 1, 4]),
    ],
    tests: [
      example({ nums: [7], queries: [[0, 0, 1]] }, [7]),
      example({ nums: [], queries: [] }, []),
      example({ nums: [-2, -1, -2, 3], queries: [[0, 3, 1], [0, 3, 4], [0, 1, 1]] }, [-2, 3, -2]),
    ],
    insights: ['先把值压缩成排名，再从高位到低位把序列稳定分区：0 放前、1 放后，查询区间同步映射到下层，比较剩余第 k 与区间内 0 的个数决定走向。', '每层用 0 的前缀和数组在 O(1) 内完成区间映射，总位数决定查询复杂度。'],
    pitfalls: ['分区必须稳定（保持原相对顺序），否则下一层区间映射会错位。', '走 1 分支时新起点要加上本层 0 的总数，漏加会把 0、1 两段混在一起。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    values = sorted(set(nums))
    rank = {v: i for i, v in enumerate(values)}
    bits = max(1, (len(values) - 1).bit_length())
    cur = [rank[v] for v in nums]
    layers = []
    for b in range(bits - 1, -1, -1):
        bit_arr = [(x >> b) & 1 for x in cur]
        zeros = [0]
        for v in bit_arr:
            zeros.append(zeros[-1] + (1 - v))
        layers.append((bit_arr, zeros))
        zero_total = zeros[-1]
        nxt = [0] * n
        zi = 0
        oi = zero_total
        for i, v in enumerate(bit_arr):
            if v == 0:
                nxt[zi] = cur[i]
                zi += 1
            else:
                nxt[oi] = cur[i]
                oi += 1
        cur = nxt
    out = []
    for l, r, k in data["queries"]:
        lo, hi = l, r + 1
        k -= 1
        for bit_arr, zeros in layers:
            zero_total = zeros[-1]
            zeros_in = zeros[hi] - zeros[lo]
            if k < zeros_in:
                lo, hi = zeros[lo], zeros[hi]
            else:
                k -= zeros_in
                lo = zero_total + (lo - zeros[lo])
                hi = zero_total + (hi - zeros[hi])
        out.append(values[cur[lo]])
    return out
`,
  },

  'binary-search-tree': {
    statement: '按给定顺序把一串互不相同的键插入二叉搜索树（重复键跳过），返回整棵树的层序遍历（从根逐层、每层从左到右）。',
    input: 'data 为 {"keys": [...]}，keys 为按插入顺序排列的整数。',
    output: '返回层序遍历的键数组；空树返回空数组。',
    constraints: ['0 <= keys.length <= 10^3', '-10^6 <= keys[i] <= 10^6'],
    examples: [
      example({ keys: [8, 3, 10, 1, 6, 14, 4, 7] }, [8, 3, 10, 1, 6, 14, 4, 7]),
    ],
    tests: [
      example({ keys: [2, 1, 3] }, [2, 1, 3]),
      example({ keys: [5, 5, 5] }, [5]),
      example({ keys: [1, 2, 3, 4] }, [1, 2, 3, 4]),
      example({ keys: [] }, []),
    ],
    insights: ['BST 的插入路径由键值比较唯一决定：小于当前节点向左、大于向右，第一次落到空位就停；这就是“查找失败的位置即插入位置”。', '层序遍历用队列按层收集，BST 的形状完全由插入顺序决定，退化链是最坏情况。'],
    pitfalls: ['重复键直接跳过而不是覆盖或报错。', '层序遍历要用队列（先进先出），用栈会变成 DFS 顺序。'],
    solution: `def solve(data):
    keys = list(data["keys"])
    nodes = []
    root = -1
    for k in keys:
        if root == -1:
            nodes.append([k, -1, -1])
            root = 0
            continue
        cur = root
        while True:
            if k == nodes[cur][0]:
                break
            side = 1 if k < nodes[cur][0] else 2
            if nodes[cur][side] == -1:
                nodes.append([k, -1, -1])
                nodes[cur][side] = len(nodes) - 1
                break
            cur = nodes[cur][side]
    order = []
    queue = [root] if root != -1 else []
    while queue:
        nxt = []
        for idx in queue:
            order.append(nodes[idx][0])
            if nodes[idx][1] != -1:
                nxt.append(nodes[idx][1])
            if nodes[idx][2] != -1:
                nxt.append(nodes[idx][2])
        queue = nxt
    return order
`,
  },

  'avl-tree': {
    statement: '按给定顺序把一串互不相同的键插入 AVL 平衡树（重复键跳过），插入过程中执行 LL/RR/LR/RL 旋转维持平衡，返回最终树的先序遍历。',
    input: 'data 为 {"keys": [...]}，keys 为按插入顺序排列的整数。',
    output: '返回先序遍历的键数组；空树返回空数组。',
    constraints: ['0 <= keys.length <= 10^3', '-10^6 <= keys[i] <= 10^6'],
    examples: [
      example({ keys: [10, 20, 30] }, [20, 10, 30], '插入 30 后根 10 失衡（RR），左旋后 20 成为新根'),
    ],
    tests: [
      example({ keys: [10, 20, 30, 40, 50, 25] }, [30, 20, 10, 25, 40, 50]),
      example({ keys: [3, 2, 1] }, [2, 1, 3]),
      example({ keys: [1, 1] }, [1]),
      example({ keys: [] }, []),
    ],
    insights: ['每个节点记录高度，插入回溯时检查左右高度差：|差|>1 时按“失衡方向与插入方向一致为单旋、相反为双旋”恢复平衡。', '先序遍历直接暴露树的形状，是验证旋转结果最直观的输出。'],
    pitfalls: ['双旋必须先旋儿子再旋自己，顺序颠倒得不到平衡树。', '旋转后要自底向上重新计算高度，漏掉被换下去的节点会让后续失衡判断失效。'],
    solution: `def solve(data):
    nodes = []

    def height(i):
        return nodes[i][3] if i != -1 else 0

    def update(i):
        nodes[i][3] = 1 + max(height(nodes[i][1]), height(nodes[i][2]))

    def rotate_right(i):
        l = nodes[i][1]
        nodes[i][1] = nodes[l][2]
        nodes[l][2] = i
        update(i)
        update(l)
        return l

    def rotate_left(i):
        r = nodes[i][2]
        nodes[i][2] = nodes[r][1]
        nodes[r][1] = i
        update(i)
        update(r)
        return r

    def insert(i, key):
        if i == -1:
            nodes.append([key, -1, -1, 1])
            return len(nodes) - 1
        if key < nodes[i][0]:
            nodes[i][1] = insert(nodes[i][1], key)
        elif key > nodes[i][0]:
            nodes[i][2] = insert(nodes[i][2], key)
        else:
            return i
        update(i)
        balance = height(nodes[i][1]) - height(nodes[i][2])
        if balance > 1:
            if key < nodes[nodes[i][1]][0]:
                return rotate_right(i)
            nodes[i][1] = rotate_left(nodes[i][1])
            return rotate_right(i)
        if balance < -1:
            if key > nodes[nodes[i][2]][0]:
                return rotate_left(i)
            nodes[i][2] = rotate_right(nodes[i][2])
            return rotate_left(i)
        return i

    root = -1
    for k in data["keys"]:
        root = insert(root, k)
    order = []
    stack = [root] if root != -1 else []
    while stack:
        i = stack.pop()
        order.append(nodes[i][0])
        if nodes[i][2] != -1:
            stack.append(nodes[i][2])
        if nodes[i][1] != -1:
            stack.append(nodes[i][1])
    return order
`,
  },

  'red-black-tree': {
    statement: '按给定顺序把一串互不相同的键插入红黑树（重复键跳过），执行标准插入修复（变色、左旋、右旋），返回最终树的先序遍历，每个元素为 [key, color]，color 为 "R" 或 "B"。',
    input: 'data 为 {"keys": [...]}，keys 为按插入顺序排列的整数。',
    output: '返回先序遍历的 [key, color] 数组；空树返回空数组。',
    constraints: ['0 <= keys.length <= 10^3', '-10^6 <= keys[i] <= 10^6'],
    examples: [
      example({ keys: [10, 20, 30] }, [[20, "B"], [10, "R"], [30, "R"]], '插入 30 触发叔节点为黑的镜像情形：父变黑、祖父变红后左旋'),
    ],
    tests: [
      example({ keys: [10] }, [[10, "B"]]),
      example({ keys: [10, 20] }, [[10, "B"], [20, "R"]]),
      example({ keys: [10, 20, 30, 15] }, [[20, "B"], [10, "B"], [15, "R"], [30, "B"]]),
      example({ keys: [] }, []),
    ],
    insights: ['新节点先染红插入：不破坏黑高，只可能破坏“红父红子”；修复按叔节点颜色分路——红叔变色上溯，黑叔旋转变色后终止。', '修复循环向上时 z 指针移动到祖父，最后强制根为黑，保证五条红黑性质恢复。'],
    pitfalls: ['NIL 叶子按黑色参与判断，忘记这点会在空叔节点分支走错。', '先判断 z 是左孩子还是右孩子再选旋转方向，与叔节点所在侧配对，写镜像分支时容易左右颠倒。'],
    solution: `def solve(data):
    nil = 0
    nodes = [[0, 0, 0, 0, "B"]]
    root = 0

    def left_rotate(x):
        y = nodes[x][2]
        nodes[x][2] = nodes[y][1]
        if nodes[y][1] != nil:
            nodes[nodes[y][1]][3] = x
        nodes[y][3] = nodes[x][3]
        if nodes[x][3] == nil:
            nonlocal_root[0] = y
        elif nodes[nodes[x][3]][1] == x:
            nodes[nodes[x][3]][1] = y
        else:
            nodes[nodes[x][3]][2] = y
        nodes[y][1] = x
        nodes[x][3] = y

    def right_rotate(x):
        y = nodes[x][1]
        nodes[x][1] = nodes[y][2]
        if nodes[y][2] != nil:
            nodes[nodes[y][2]][3] = x
        nodes[y][3] = nodes[x][3]
        if nodes[x][3] == nil:
            nonlocal_root[0] = y
        elif nodes[nodes[x][3]][2] == x:
            nodes[nodes[x][3]][2] = y
        else:
            nodes[nodes[x][3]][1] = y
        nodes[y][2] = x
        nodes[x][3] = y

    def insert(key):
        y = nil
        x = nonlocal_root[0]
        while x != nil:
            y = x
            if key < nodes[x][0]:
                x = nodes[x][1]
            elif key > nodes[x][0]:
                x = nodes[x][2]
            else:
                return
        z = len(nodes)
        nodes.append([key, nil, nil, y, "R"])
        if y == nil:
            nonlocal_root[0] = z
        elif key < nodes[y][0]:
            nodes[y][1] = z
        else:
            nodes[y][2] = z
        while nodes[z][3] != nil and nodes[nodes[z][3]][4] == "R":
            p = nodes[z][3]
            g = nodes[p][3]
            if p == nodes[g][1]:
                uncle = nodes[g][2]
                if nodes[uncle][4] == "R":
                    nodes[p][4] = "B"
                    nodes[uncle][4] = "B"
                    nodes[g][4] = "R"
                    z = g
                else:
                    if z == nodes[p][2]:
                        z = p
                        left_rotate(z)
                        p = nodes[z][3]
                        g = nodes[p][3]
                    nodes[p][4] = "B"
                    nodes[g][4] = "R"
                    right_rotate(g)
            else:
                uncle = nodes[g][1]
                if nodes[uncle][4] == "R":
                    nodes[p][4] = "B"
                    nodes[uncle][4] = "B"
                    nodes[g][4] = "R"
                    z = g
                else:
                    if z == nodes[p][1]:
                        z = p
                        right_rotate(z)
                        p = nodes[z][3]
                        g = nodes[p][3]
                    nodes[p][4] = "B"
                    nodes[g][4] = "R"
                    left_rotate(g)
        nodes[nonlocal_root[0]][4] = "B"

    nonlocal_root = [0]
    for k in data["keys"]:
        insert(k)
    order = []
    stack = [nonlocal_root[0]] if nonlocal_root[0] != nil else []
    while stack:
        i = stack.pop()
        order.append([nodes[i][0], nodes[i][4]])
        if nodes[i][2] != nil:
            stack.append(nodes[i][2])
        if nodes[i][1] != nil:
            stack.append(nodes[i][1])
    return order
`,
  },

  'treap': {
    statement: '把一串互不相同的键按顺序插入 Treap（树堆）：BST 性质按键、堆性质按优先级，插入后按需旋转。优先级由给定种子驱动 32 位 LCG（state = (state × 1664525 + 1013904223) mod 2^32）逐键生成，重复键跳过但不消耗优先级。返回最终树的先序遍历，每个元素为 [key, priority]。',
    input: 'data 为 {"keys": [...], "seed": 非负整数}。',
    output: '返回先序遍历的 [key, priority] 数组；空树返回空数组。',
    constraints: ['0 <= keys.length <= 10^3', '0 <= seed < 2^32'],
    examples: [
      example({ keys: [5, 3, 8], seed: 7 }, [[3, 3923423697], [8, 2630631676], [5, 1025555898]], '节点 3 的优先级最大，成为根'),
    ],
    tests: [
      example({ keys: [1, 2, 3], seed: 0 }, [[3, 3519870697], [2, 1196435762], [1, 1013904223]]),
      example({ keys: [4, 4, 9], seed: 42 }, [[4, 1083814273], [9, 378494188]]),
      example({ keys: [], seed: 1 }, []),
    ],
    insights: ['优先级是随机化的“平衡预算”：期望树高 O(log n)；旋转只改局部父子关系，同时保住 BST 中序与堆序。', '期望的证明依赖优先级独立同分布——这正是用确定性 LCG 也能得到固定形状的原因。'],
    pitfalls: ['重复键跳过时不能消耗下一个优先级，否则后续节点的优先级全部错位。', '旋转方向判断按“孩子优先级大于父”进行，与普通 BST 插入不同。'],
    solution: `def solve(data):
    keys = list(data["keys"])
    state = int(data["seed"]) & 0xffffffff
    nodes = []

    def insert(i, key, pri):
        if i == -1:
            nodes.append([key, pri, -1, -1])
            return len(nodes) - 1
        node = nodes[i]
        if key < node[0]:
            node[2] = insert(node[2], key, pri)
            if nodes[node[2]][1] > node[1]:
                left = node[2]
                node[2] = nodes[left][3]
                nodes[left][3] = i
                return left
        elif key > node[0]:
            node[3] = insert(node[3], key, pri)
            if nodes[node[3]][1] > node[1]:
                right = node[3]
                node[3] = nodes[right][2]
                nodes[right][2] = i
                return right
        return i

    root = -1
    for k in keys:
        if any(existing[0] == k for existing in nodes):
            continue
        state = (state * 1664525 + 1013904223) & 0xffffffff
        root = insert(root, k, state)
    order = []
    stack = [root] if root != -1 else []
    while stack:
        i = stack.pop()
        order.append([nodes[i][0], nodes[i][1]])
        if nodes[i][3] != -1:
            stack.append(nodes[i][3])
        if nodes[i][2] != -1:
            stack.append(nodes[i][2])
    return order
`,
  },

  'splay-tree': {
    statement: '按给定顺序把一串互不相同的键插入伸展树（Splay Tree）：每次插入后把新节点伸展到根（zig / zig-zig / zig-zag），重复键只做伸展不插入。返回最终树的先序遍历。',
    input: 'data 为 {"keys": [...]}，keys 为按插入顺序排列的整数。',
    output: '返回先序遍历的键数组；空树返回空数组。',
    constraints: ['0 <= keys.length <= 10^3', '-10^6 <= keys[i] <= 10^6'],
    examples: [
      example({ keys: [1, 2, 3] }, [3, 2, 1], '顺序插入后每次都把最新节点伸展到根，形成左斜链'),
    ],
    tests: [
      example({ keys: [1, 2, 3, 4] }, [4, 3, 2, 1]),
      example({ keys: [5, 3, 8, 3] }, [3, 5, 8], '第四次插入命中已有键 3，只把 3 伸展到根'),
      example({ keys: [] }, []),
    ],
    insights: ['zig-zig 必须先旋父节点再旋自己（而不是连旋两次自己），这是摊扑 O(log n) 上界成立的关键。', '访问即伸展：把热点节点搬到根附近，静态的 BST 形状因此随访问序列自适应变化。'],
    pitfalls: ['查找命中已有键也要伸展，否则后续操作的摊扑分析不成立。', '旋转时要同步维护祖父与被旋下节点的父指针，漏更新会让下一次旋转接错位置。'],
    solution: `def solve(data):
    keys = list(data["keys"])
    nodes = []
    root_holder = [-1]

    def rotate_up(c):
        p = nodes[c][3]
        if nodes[p][1] == c:
            nodes[p][1] = nodes[c][2]
            if nodes[c][2] != -1:
                nodes[nodes[c][2]][3] = p
            nodes[c][2] = p
        else:
            nodes[p][2] = nodes[c][1]
            if nodes[c][1] != -1:
                nodes[nodes[c][1]][3] = p
            nodes[c][1] = p
        nodes[c][3] = nodes[p][3]
        nodes[p][3] = c
        if nodes[c][3] != -1:
            if nodes[nodes[c][3]][1] == p:
                nodes[nodes[c][3]][1] = c
            else:
                nodes[nodes[c][3]][2] = c

    def splay(c):
        while nodes[c][3] != -1:
            p = nodes[c][3]
            g = nodes[p][3]
            if g == -1:
                rotate_up(c)
            elif (nodes[g][1] == p) == (nodes[p][1] == c):
                rotate_up(p)
                rotate_up(c)
            else:
                rotate_up(c)
                rotate_up(c)
        root_holder[0] = c

    for key in keys:
        root = root_holder[0]
        if root == -1:
            nodes.append([key, -1, -1, -1])
            root_holder[0] = 0
            continue
        cur = root
        while True:
            if key == nodes[cur][0]:
                splay(cur)
                break
            side = 1 if key < nodes[cur][0] else 2
            if nodes[cur][side] == -1:
                nodes.append([key, -1, -1, cur])
                nodes[cur][side] = len(nodes) - 1
                splay(len(nodes) - 1)
                break
            cur = nodes[cur][side]
    order = []
    stack = [root_holder[0]] if root_holder[0] != -1 else []
    while stack:
        i = stack.pop()
        order.append(nodes[i][0])
        if nodes[i][2] != -1:
            stack.append(nodes[i][2])
        if nodes[i][1] != -1:
            stack.append(nodes[i][1])
    return order
`,
  },

  'skip-list': {
    statement: '把一串互不相同的整数键插入跳表（重复键跳过）：每个节点的层数由种子驱动的 32 位 LCG 决定——每次抽层时更新 state = (state × 1664525 + 1013904223) mod 2^32，层数 = state % 4 + 1（范围 1..4）。返回自顶层到底层每层的键序列。',
    input: 'data 为 {"keys": [...], "seed": 非负整数}。',
    output: '返回长度 4 的数组，第 0 项是第 4 层的键（升序），依次到第 3 项的第 1 层；每层只包含层数达到该层的键。',
    constraints: ['0 <= keys.length <= 10^3', '0 <= seed < 2^32'],
    examples: [
      example({ keys: [3, 1, 4], seed: 5 }, [[1], [1, 4], [1, 4], [1, 3, 4]], 'LCG 序列给出层数 1、4、3：只有 1 到第 4 层，1、4 到第 3 层，1、3、4 都在第 1 层'),
    ],
    tests: [
      example({ keys: [], seed: 0 }, [[], [], [], []]),
      example({ keys: [2, 2, 10], seed: 9 }, [[10], [10], [10], [2, 10]]),
      example({ keys: [5, 6, 7, 8], seed: 1 }, [[6], [6, 7], [6, 7, 8], [5, 6, 7, 8]]),
    ],
    insights: ['跳表用“掷硬币”的层数把有序链表变成多层索引：期望查找 O(log n)，每层都是下层的子序列。', '期望高度 2^i 概率 2^-i，因此顶层节点极少、底层包含全部——这就是输出里各层逐渐变密的原因。'],
    pitfalls: ['重复键跳过时同样不能消耗抽层机会，否则层序列全部偏移。', '每层必须保持升序输出，跳表的有序性是查询能力的前提。'],
    solution: `def solve(data):
    keys = list(data["keys"])
    state = int(data["seed"]) & 0xffffffff
    level_of = {}
    for k in keys:
        if k in level_of:
            continue
        state = (state * 1664525 + 1013904223) & 0xffffffff
        level_of[k] = state % 4 + 1
    out = []
    for level in range(4, 0, -1):
        out.append(sorted(k for k, lv in level_of.items() if lv >= level))
    return out
`,
  },

  'cartesian-tree': {
    statement: '对给定数组构建小根笛卡尔树：每个节点的键值是数组元素，中序遍历等于原数组下标顺序，且每个节点小于其子树内所有节点。返回父指针数组（根为 -1）。',
    input: 'data 为 {"nums": [...]}。',
    output: '返回长度 n 的数组，第 i 项是下标 i 的父节点下标，根为 -1。',
    constraints: ['1 <= n <= 10^5', '-10^6 <= nums[i] <= 10^6'],
    examples: [
      example({ nums: [3, 1, 2] }, [1, -1, 1], '最小值 1 是根，3 和 2 是它的左右孩子'),
    ],
    tests: [
      example({ nums: [9] }, [-1]),
      example({ nums: [5, 4, 3, 2, 1] }, [1, 2, 3, 4, -1]),
      example({ nums: [1, 2, 3, 4] }, [-1, 0, 1, 2]),
    ],
    insights: ['从左到右维护最右链（一条值递减的脊柱）：新元素沿脊柱上跳直到找到比自己小的祖先，弹出的链挂到新元素左子树，新元素挂到停下位置的右孩子。', '整棵树等价于“区间最小值分治”的堆结构，与 RMQ 问题一一对应。'],
    pitfalls: ['相等元素按“先出现者为小”处理可以保证结构唯一，遍历方向不要用错。', '弹出脊柱时被弹节点的父指针要改为指向新节点，只改孩子指针会丢失父子关系。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    parent = [-1] * n
    stack = []
    for i in range(n):
        last = -1
        while stack and nums[stack[-1]] > nums[i]:
            last = stack.pop()
        if stack:
            parent[i] = stack[-1]
        if last != -1:
            parent[last] = i
        stack.append(i)
    return parent
`,
  },

  'b-tree': {
    statement: '把一串互不相同的键插入最小度 t = 2 的 B 树（每个节点 1..3 个键，满节点在下行前分裂，重复键跳过）。返回广度优先顺序下每个节点的键列表（同一层从左到右，每个节点内部升序）。',
    input: 'data 为 {"keys": [...]}，keys 为按插入顺序排列的整数。',
    output: '返回二维数组，第 i 项是 BFS 序第 i 个节点的键数组；空树返回空数组。',
    constraints: ['0 <= keys.length <= 10^3', '-10^6 <= keys[i] <= 10^6'],
    examples: [
      example({ keys: [1, 2, 3, 4, 5] }, [[2], [1], [3, 4, 5]], '插入 4 时根满，分裂后 2 成为根'),
    ],
    tests: [
      example({ keys: [1, 2, 3] }, [[1, 2, 3]]),
      example({ keys: [10, 20, 30, 40, 50, 60] }, [[20, 40], [10], [30], [50, 60]]),
      example({ keys: [7, 7] }, [[7]]),
      example({ keys: [] }, []),
    ],
    insights: ['满节点（2t-1 个键）在“下行途中”被分裂：中位键上提到父节点，两侧键带着对半的孩子分开——自顶向下分裂保证到达叶节点时一定能插入。', 'B 树的每层把键域切成互不重叠的区间，这正是它在磁盘页上高效的核心。'],
    pitfalls: ['孩子下标与键下标在分裂时是“右半孩子插到 i+1”，错位一格整棵树就散了。', '叶节点分裂时没有孩子可分，分支要单独处理。'],
    solution: `import bisect


def solve(data):
    t = 2
    root = {"keys": [], "children": []}

    def split_child(parent, i):
        child = parent["children"][i]
        mid_key = child["keys"][t - 1]
        right = {"keys": child["keys"][t:], "children": child["children"][t:]}
        child["keys"] = child["keys"][:t - 1]
        if child["children"]:
            child["children"] = child["children"][:t]
        parent["keys"].insert(i, mid_key)
        parent["children"].insert(i + 1, right)

    def insert_nonfull(node, key):
        pos = bisect.bisect_left(node["keys"], key)
        if pos < len(node["keys"]) and node["keys"][pos] == key:
            return
        if not node["children"]:
            node["keys"].insert(pos, key)
            return
        if len(node["children"][pos]["keys"]) == 2 * t - 1:
            split_child(node, pos)
            if key == node["keys"][pos]:
                return
            if key > node["keys"][pos]:
                pos += 1
        insert_nonfull(node["children"][pos], key)

    def insert(key):
        if len(root["keys"]) == 2 * t - 1:
            new_root = {"keys": [], "children": [root]}
            split_child(new_root, 0)
            nonlocal_root[0] = new_root
        insert_nonfull(nonlocal_root[0], key)

    nonlocal_root = [root]
    for k in data["keys"]:
        insert(k)
    if not nonlocal_root[0]["keys"]:
        return []
    out = []
    queue = [nonlocal_root[0]]
    while queue:
        nxt = []
        for nd in queue:
            out.append(list(nd["keys"]))
            nxt.extend(nd["children"])
        queue = nxt
    return out
`,
  },

  'b-plus-tree': {
    statement: '把一串互不相同的键插入 4 阶 B+ 树（每个节点最多 3 个键；叶满分裂时右节点拿后半、首键复制上提；内部满分裂时中位键移上提）。返回广度优先顺序下每个节点的键列表。',
    input: 'data 为 {"keys": [...]}，keys 为按插入顺序排列的整数。',
    output: '返回二维数组，第 i 项是 BFS 序第 i 个节点的键数组；空树返回空数组。',
    constraints: ['0 <= keys.length <= 10^3', '-10^6 <= keys[i] <= 10^6'],
    examples: [
      example({ keys: [1, 2, 3, 4] }, [[3], [1, 2], [3, 4]], '叶 [1,2,3] 插入 4 后溢出，右节点 [3,4] 的首键 3 复制上提成为根'),
    ],
    tests: [
      example({ keys: [5, 6, 7] }, [[5, 6, 7]]),
      example({ keys: [1, 2, 3, 4, 5] }, [[3], [1, 2], [3, 4, 5]]),
      example({ keys: [9, 9] }, [[9]]),
      example({ keys: [] }, []),
    ],
    insights: ['B+ 树与 B 树的差别：数据全部在叶子，内部节点只存路由键；叶分裂把右半首键“复制”上提，内部分裂把中位键“移动”上提。', '叶子之间串成有序链表，区间扫描只需定位起点后沿链右移。'],
    pitfalls: ['上提路由键后，新右孩子的插入下标在父节点是 pos+1，不能沿用叶分裂的写法。', '复制上提与移动上提的区别会同时影响左右节点键数，两者写反会让节点超出 3 键上限。'],
    solution: `import bisect


def solve(data):
    max_keys = 3
    root_holder = [{"leaf": True, "keys": [], "children": []}]

    def insert(node, key):
        pos = bisect.bisect_left(node["keys"], key)
        if node["leaf"]:
            if pos < len(node["keys"]) and node["keys"][pos] == key:
                return None
            node["keys"].insert(pos, key)
            if len(node["keys"]) <= max_keys:
                return None
            mid = (max_keys + 1) // 2
            right = {"leaf": True, "keys": node["keys"][mid:], "children": []}
            node["keys"] = node["keys"][:mid]
            return (right["keys"][0], right)
        split = insert(node["children"][pos], key)
        if split is None:
            return None
        router, rnode = split
        node["keys"].insert(pos, router)
        node["children"].insert(pos + 1, rnode)
        if len(node["keys"]) <= max_keys:
            return None
        mid = len(node["keys"]) // 2
        up = node["keys"][mid]
        right = {"leaf": False, "keys": node["keys"][mid + 1:], "children": node["children"][mid + 1:]}
        node["keys"] = node["keys"][:mid]
        node["children"] = node["children"][:mid + 1]
        return (up, right)

    for key in data["keys"]:
        split = insert(root_holder[0], key)
        if split is not None:
            router, rnode = split
            root_holder[0] = {"leaf": False, "keys": [router], "children": [root_holder[0], rnode]}
    if not root_holder[0]["keys"]:
        return []
    out = []
    queue = [root_holder[0]]
    while queue:
        nxt = []
        for nd in queue:
            out.append(list(nd["keys"]))
            nxt.extend(nd["children"])
        queue = nxt
    return out
`,
  },

  'order-statistic-tree': {
    statement: '维护一棵保存子树大小的二叉搜索树：按顺序插入互不相同的键（重复键跳过），然后回答两类查询——["kth", k] 返回第 k 小的键（k 从 1 开始），["rank", x] 返回键 x 的 1-based 排名（不存在返回 -1）。',
    input: 'data 为 {"keys": [...], "queries": [...]}, queries 中 ["kth", k] 或 ["rank", x]。',
    output: '按顺序返回每个查询的结果数组。',
    constraints: ['1 <= keys.length <= 10^4', '1 <= queries.length <= 10^4', 'kth 的 k 保证合法'],
    examples: [
      example({ keys: [20, 8, 22, 4, 12], queries: [["kth", 3], ["rank", 20], ["rank", 9]] }, [12, 4, -1]),
    ],
    tests: [
      example({ keys: [5], queries: [["kth", 1], ["rank", 5]] }, [5, 1]),
      example({ keys: [3, 1, 2, 1], queries: [["kth", 1], ["kth", 3], ["rank", 2]] }, [1, 3, 2]),
      example({ keys: [10, 5, 15, 12], queries: [["rank", 12], ["kth", 4]] }, [3, 15]),
    ],
    insights: ['节点多存一个 size，第 k 小的比较在左子树大小上进行：k <= 左 size 走左，k == 左 size + 1 命中，否则减去左侧贡献走右。', '排名查询在下降路径上累计“严格小于 x 的节点数 + 1”，本质与 kth 是同一个信息流。'],
    pitfalls: ['插入重复键时不能漏掉 size 的维护路径，直接 return 前父链已更新过的 size 必须保持一致。', 'rank 不存在时返回 -1，不要返回 0 或节点计数。'],
    solution: `def solve(data):
    nodes = []
    root = -1

    def insert(i, key):
        if i == -1:
            nodes.append([key, -1, -1, 1])
            return len(nodes) - 1
        if key < nodes[i][0]:
            nodes[i][1] = insert(nodes[i][1], key)
        elif key > nodes[i][0]:
            nodes[i][2] = insert(nodes[i][2], key)
        else:
            return i
        left_size = nodes[nodes[i][1]][3] if nodes[i][1] != -1 else 0
        right_size = nodes[nodes[i][2]][3] if nodes[i][2] != -1 else 0
        nodes[i][3] = 1 + left_size + right_size
        return i

    def kth(i, k):
        while True:
            left = nodes[i][1]
            left_size = nodes[left][3] if left != -1 else 0
            if k <= left_size:
                i = left
            elif k == left_size + 1:
                return nodes[i][0]
            else:
                k -= left_size + 1
                i = nodes[i][2]

    def rank_of(x):
        total = 1
        cur = root
        while cur != -1:
            left = nodes[cur][1]
            left_size = nodes[left][3] if left != -1 else 0
            if x == nodes[cur][0]:
                return total + left_size
            if x < nodes[cur][0]:
                cur = left
            else:
                total += left_size + 1
                cur = nodes[cur][2]
        return -1

    for key in data["keys"]:
        root = insert(root, key)
    out = []
    for query in data["queries"]:
        if query[0] == "kth":
            out.append(kth(root, query[1]))
        else:
            out.append(rank_of(query[1]))
    return out
`,
  },

  'rope': {
    statement: '用平衡二叉片段（隐式键 Treap：按位置隐式编号、优先级由种子驱动的 32 位 LCG state = (state × 1664525 + 1013904223) mod 2^32 生成）实现字符串的插入、删除与提取。初始文本为空，按顺序执行操作并返回所有 report 的结果。',
    input: 'data 为 {"seed": 非负整数, "ops": [...]}。ops 中 ["insert", pos, s] 表示在位置 pos（0-based，允许等于当前长度）前插入字符串 s；["delete", pos, length] 表示删除从 pos 开始的 length 个字符；["report", pos, length] 表示提取从 pos 开始的 length 个字符。',
    output: '按顺序返回所有 report 的子串数组。',
    constraints: ['1 <= ops.length <= 200', '所有 pos / length 保证合法（0 <= pos，pos + length <= 当前长度）', '单个字符串片段长度 1..20'],
    examples: [
      example({ seed: 3, ops: [["insert", 0, "hello"], ["insert", 5, " world"], ["report", 0, 11], ["delete", 5, 6], ["report", 0, 5]] }, ["hello world", "hello"]),
    ],
    tests: [
      example({ seed: 1, ops: [["insert", 0, "abc"], ["insert", 1, "xy"], ["report", 0, 5]] }, ["axybc"]),
      example({ seed: 2, ops: [["insert", 0, "abcdef"], ["delete", 2, 3], ["report", 0, 3]] }, ["abf"]),
      example({ seed: 4, ops: [["insert", 0, "a"], ["report", 0, 1]] }, ["a"]),
    ],
    insights: ['隐式键 Treap 把“子树字符数”当作键：split(k) 按前 k 个字符切分，merge 按优先级随机合并，插入与删除都退化成 O(log n) 次 split/merge。', '每个节点只需维护自身片段与子树总长，位置信息不必真实存进节点。'],
    pitfalls: ['split 的第二段切分点是 k - 左子树长 - 本节点片段长，忘记减本节点长度会切错位置。', 'report 之后必须把拆下的片段按原顺序 merge 回去，否则后续操作作用在残缺文本上。'],
    solution: `def solve(data):
    state = int(data["seed"]) & 0xffffffff
    nodes = []

    def pull(i):
        nodes[i][4] = len(nodes[i][0])
        for c in (nodes[i][2], nodes[i][3]):
            if c != -1:
                nodes[i][4] += nodes[c][4]

    def merge(a, b):
        if a == -1:
            return b
        if b == -1:
            return a
        if nodes[a][1] > nodes[b][1]:
            nodes[a][3] = merge(nodes[a][3], b)
            pull(a)
            return a
        nodes[b][2] = merge(a, nodes[b][2])
        pull(b)
        return b

    def split(i, k):
        if i == -1:
            return -1, -1
        left_size = nodes[nodes[i][2]][4] if nodes[i][2] != -1 else 0
        if k <= left_size:
            l, r = split(nodes[i][2], k)
            nodes[i][2] = r
            pull(i)
            return l, i
        if k < left_size + len(nodes[i][0]):
            cut = k - left_size
            frag = nodes[i][0]
            left_child = nodes[i][2]
            nodes[i][0] = frag[cut:]
            nodes[i][2] = -1
            nodes.append([frag[:cut], nodes[i][1], left_child, -1, 0])
            j = len(nodes) - 1
            pull(j)
            pull(i)
            return j, i
        l, r = split(nodes[i][3], k - left_size - len(nodes[i][0]))
        nodes[i][3] = l
        pull(i)
        return i, r

    root = -1
    out = []
    for op in data["ops"]:
        if op[0] == "insert":
            nodes.append([op[2], -1, -1, -1, len(op[2])])
            idx = len(nodes) - 1
            state = (state * 1664525 + 1013904223) & 0xffffffff
            nodes[idx][1] = state
            left, right = split(root, op[1])
            root = merge(merge(left, idx), right)
        elif op[0] == "delete":
            left, mid_right = split(root, op[1])
            mid, right = split(mid_right, op[2])
            root = merge(left, right)
        else:
            left, mid_right = split(root, op[1])
            mid, right = split(mid_right, op[2])
            buf = []
            stack = []
            i = mid
            while stack or i != -1:
                while i != -1:
                    stack.append(i)
                    i = nodes[i][2]
                i = stack.pop()
                buf.append(nodes[i][0])
                i = nodes[i][3]
            out.append("".join(buf))
            root = merge(merge(left, mid), right)
    return out
`,
  },

  'pairing-heap': {
    statement: '实现配对堆（Pairing Heap）的操作序列：["push", v] 入堆、["top"] 查看最小值（空堆返回 None）、["pop"] 弹出最小值并返回（空堆返回 None）。pop 使用两趟合并：先成对合并孩子，再从右往左合并。',
    input: 'data 为 {"ops": [...]}。',
    output: '按顺序返回 top / pop 的结果数组（push 不产生输出）。',
    constraints: ['1 <= ops.length <= 10^4', '-10^6 <= v <= 10^6'],
    examples: [
      example({ ops: [["push", 3], ["push", 1], ["top"], ["pop"], ["top"]] }, [1, 1, 3]),
    ],
    tests: [
      example({ ops: [["pop"], ["top"]] }, [null, null]),
      example({ ops: [["push", 2], ["push", -1], ["push", 2], ["pop"], ["pop"], ["top"]] }, [-1, 2, 2]),
      example({ ops: [["push", 5], ["pop"], ["push", 7], ["pop"], ["pop"]] }, [5, 7, null]),
    ],
    insights: ['配对堆只有一个合并操作：push 是与单节点合并，pop 是把根的孩子两两合并再串起来；top 只是读根。', '两趟合并让树保持低度——第一趟减半、第二趟从右往左合并保证最深的兄弟先沉底。'],
    pitfalls: ['单趟合并会让最坏情况退化成链，两趟顺序不能省。', '合并时较小值做根、较大值的兄弟指针接到根的孩子链头，方向接反会破坏堆序。'],
    solution: `def solve(data):
    nodes = []

    def merge(a, b):
        if a == -1:
            return b
        if b == -1:
            return a
        if nodes[b][0] < nodes[a][0]:
            a, b = b, a
        nodes[b][2] = nodes[a][1]
        nodes[a][1] = b
        return a

    root = -1
    out = []
    for op in data["ops"]:
        if op[0] == "push":
            nodes.append([op[1], -1, -1])
            root = merge(root, len(nodes) - 1)
        elif op[0] == "top":
            out.append(nodes[root][0] if root != -1 else None)
        else:
            if root == -1:
                out.append(None)
                continue
            out.append(nodes[root][0])
            children = []
            child = nodes[root][1]
            nodes[root][1] = -1
            while child != -1:
                nxt = nodes[child][2]
                nodes[child][2] = -1
                children.append(child)
                child = nxt
            pairs = []
            for i in range(0, len(children) - 1, 2):
                pairs.append(merge(children[i], children[i + 1]))
            if len(children) % 2 == 1:
                pairs.append(children[-1])
            root = -1
            for p in reversed(pairs):
                root = merge(root, p)
    return out
`,
  },

  'radix-tree': {
    statement: '把一串单词插入压缩前缀树（Patricia / Radix Tree）：公共前缀合并为一条边，无公共前缀的分支按首字符分裂。返回所有节点的 [前缀, 是否单词结尾]，按先序遍历（孩子按首字符升序）输出，根节点前缀为空串。',
    input: 'data 为 {"words": [...]}，单词为小写字母，重复插入视为单词结尾标记。',
    output: '返回 [prefix, is_end] 数组，第一个元素是根 ["", false]。',
    constraints: ['1 <= words.length <= 10^3', '单词长度 1..20'],
    examples: [
      example({ words: ["rome", "roman", "romane", "romulus", "rubens", "ruber", "rub", "roc"] },
        [["", false], ["r", false], ["o", false], ["c", true], ["m", false], ["an", true], ["e", true], ["e", true], ["ulus", true], ["ub", true], ["e", false], ["ns", true], ["r", true]]),
    ],
    tests: [
      example({ words: ["a"] }, [["", false], ["a", true]]),
      example({ words: ["ab", "abc"] }, [["", false], ["ab", true], ["c", true]]),
      example({ words: ["team", "tea"] }, [["", false], ["tea", true], ["m", true]]),
    ],
    insights: ['插入时沿边匹配最长公共前缀：整条边匹配就下潜；部分匹配就把边从中间劈开，生成一个分支节点，这正是“压缩”的来源。', '分支节点按首字符索引孩子，查找与插入都只需要比较每个节点的边标签，而不是逐字符走普通 Trie。'],
    pitfalls: ['劈边时旧边的标签要改成本公共前缀之后的剩余部分，改漏会把子树挂错。', '单词恰好是已有前缀时（k == len(rest)）只把分支节点标记为结尾，不再建孩子。'],
    solution: `def solve(data):
    root = {"prefix": "", "end": False, "children": {}}

    def insert(word):
        if not word:
            root["end"] = True
            return
        cur = root
        rest = word
        while True:
            edge = cur["children"].get(rest[0])
            if edge is None:
                cur["children"][rest[0]] = {"prefix": rest, "end": True, "children": {}}
                return
            label = edge["prefix"]
            k = 0
            while k < len(label) and k < len(rest) and label[k] == rest[k]:
                k += 1
            if k == len(label):
                rest = rest[k:]
                if not rest:
                    edge["end"] = True
                    return
                cur = edge
                continue
            middle = {"prefix": label[:k], "end": False, "children": {label[k]: edge}}
            edge["prefix"] = label[k:]
            cur["children"][rest[0]] = middle
            if k == len(rest):
                middle["end"] = True
            else:
                middle["children"][rest[k]] = {"prefix": rest[k:], "end": True, "children": {}}
            return

    for w in data["words"]:
        insert(w)
    out = []
    stack = [root]
    while stack:
        node = stack.pop()
        out.append([node["prefix"], node["end"]])
        for key in sorted(node["children"], reverse=True):
            stack.append(node["children"][key])
    return out
`,
  },

  'trie': {
    statement: '维护一棵前缀树：先把单词逐个插入，再回答两类查询——["count_prefix", p] 返回以 p 为前缀的单词个数（重复单词按次数计），["count_word", w] 返回单词 w 的插入次数。',
    input: 'data 为 {"words": [...], "queries": [...]}，单词与小写前缀均为小写字母。',
    output: '按顺序返回每个查询的计数。',
    constraints: ['1 <= words.length <= 10^4', '1 <= queries.length <= 10^3', '单词与前缀长度 1..20'],
    examples: [
      example({ words: ["apple", "app", "apple", "apricot"], queries: [["count_prefix", "ap"], ["count_word", "apple"], ["count_prefix", "app"], ["count_word", "banana"]] }, [4, 2, 3, 0]),
    ],
    tests: [
      example({ words: ["a"], queries: [["count_word", "a"], ["count_prefix", "a"], ["count_prefix", "b"]] }, [1, 1, 0]),
      example({ words: [], queries: [["count_prefix", "x"]] }, [0]),
      example({ words: ["ab", "ac", "ab"], queries: [["count_prefix", "a"], ["count_prefix", "ab"], ["count_word", "ab"]] }, [3, 2, 2]),
    ],
    insights: ['每个节点带两个计数：经过次数（回答前缀查询）与结尾次数（回答单词查询），插入时沿路径全部 +1，查询只是读对应节点。', '前缀查询的答案在“前缀最后一个字符所在节点”，不用再往下遍历子树——这就是用空间换时间的统计点。'],
    pitfalls: ['前缀不存在时返回 0 而不是报错。', '经过计数必须在每个字符节点上都 +1，只在结尾计数会导致前缀查询漏统计。'],
    solution: `def solve(data):
    END = "$"
    root = {}
    for word in data["words"]:
        cur = root
        cur["#"] = cur.get("#", 0) + 1
        for ch in word:
            cur = cur.setdefault(ch, {})
            cur["#"] = cur.get("#", 0) + 1
        cur[END] = cur.get(END, 0) + 1
    out = []
    for kind, arg in data["queries"]:
        cur = root
        ok = True
        for ch in arg:
            if ch in cur:
                cur = cur[ch]
            else:
                ok = False
                break
        if not ok:
            out.append(0)
            continue
        if kind == "count_word":
            out.append(cur.get(END, 0))
        else:
            out.append(cur.get("#", 0))
    return out
`,
  },

  'bloom-filter': {
    statement: '实现位数组长度 m 的 Bloom Filter：对每个字符串计算两个确定性哈希——djb2（初始 5381，逐字符 h = h × 33 + ord(ch)，mod 2^32）与 FNV-1a（初始 2166136261，逐字符 h = (h XOR ord(ch)) × 16777619，mod 2^32），第三个哈希取两者异或；三个哈希对 m 取模作为置位点。执行插入序列后，对查询序列返回每个字符串“可能存在”的布尔值（允许假阳性）。',
    input: 'data 为 {"bits": 正整数 m, "inserts": [...], "checks": [...]}，字符串为小写字母。',
    output: '按顺序返回每个 check 的布尔值数组。',
    constraints: ['1 <= bits <= 10^6', '1 <= inserts.length + checks.length <= 10^4'],
    examples: [
      example({ bits: 64, inserts: ["cat", "dog"], checks: ["cat", "dog", "cow", "bird"] }, [true, true, false, false], "cow 与 bird 的三个哈希位未被 cat、dog 置位，本例无假阳性，如实返回 false"),
    ],
    tests: [
      example({ bits: 1024, inserts: [], checks: ["anything"] }, [false]),
      example({ bits: 16, inserts: ["a"], checks: ["a"] }, [true]),
      example({ bits: 8, inserts: ["x", "y", "z"], checks: ["x", "y", "z", "w"] }, [true, true, true, true]),
    ],
    insights: ['k 个独立哈希把误判率压到 (1 - e^(-kn/m))^k：位数组只有 0 就一定不存在，全为 1 才可能存在。', '双哈希加异或派生是工程上常用的低开销三哈希方案，比三次独立计算便宜且足够独立。'],
    pitfalls: ['Python 内置 hash() 对字符串加盐（PYTHONHASHSEED），结果跨进程不可复现，必须手写确定性哈希。', '假阳性是特性不是错误，题目输出要如实返回 True。'],
    solution: `def solve(data):
    m = int(data["bits"])
    bits = [0] * m

    def positions(word):
        djb2 = 5381
        fnv = 2166136261
        for ch in word:
            code = ord(ch)
            djb2 = (djb2 * 33 + code) & 0xffffffff
            fnv = ((fnv ^ code) * 16777619) & 0xffffffff
        mixed = djb2 ^ fnv
        return [djb2 % m, fnv % m, mixed % m]

    for word in data["inserts"]:
        for pos in positions(word):
            bits[pos] = 1
    return [all(bits[pos] for pos in positions(word)) for word in data["checks"]]
`,
  },

  'lru-cache': {
    statement: '实现容量为 capacity 的 LRU 缓存，要求哈希表 + 双向链表，get / put 都是 O(1)：["get", k] 返回值（不存在返回 None）并把该键变为最近使用；["put", k, v] 写入键值并变为最近使用，容量超限时淘汰最久未使用的键。',
    input: 'data 为 {"capacity": 正整数, "ops": [...]}。',
    output: '按顺序返回所有 get 的结果数组。',
    constraints: ['1 <= capacity <= 10^3', '1 <= ops.length <= 10^4', '0 <= k, v <= 10^6'],
    examples: [
      example({ capacity: 2, ops: [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["put", 4, 4], ["get", 1], ["get", 3], ["get", 4]] }, [1, null, null, 3, 4], 'put 3 淘汰 2；put 4 淘汰最久未用的 1'),
    ],
    tests: [
      example({ capacity: 1, ops: [["put", 5, 5], ["get", 5], ["put", 6, 6], ["get", 5], ["get", 6]] }, [5, null, 6]),
      example({ capacity: 2, ops: [["get", 1], ["put", 1, 1], ["get", 1]] }, [null, 1]),
      example({ capacity: 2, ops: [["put", 1, 1], ["put", 2, 2], ["put", 1, 10], ["get", 1], ["put", 3, 3], ["get", 2]] }, [10, null]),
    ],
    insights: ['双向链表维护使用顺序（头=最新，尾=最旧），哈希表把键直接映射到链表节点，get/put 都只需 O(1) 的摘除 + 头插。', '哨兵头尾节点让“摘除尾节点”“判空”等边界逻辑统一，不用为空链写特殊分支。'],
    pitfalls: ['put 已存在的键要先更新值再移动到头部，不能当作新键重复插入。', '淘汰时先删哈希表项再摘链表节点（或反之），两份状态必须同步，漏一边会留下幽灵键。'],
    solution: `def solve(data):
    capacity = int(data["capacity"])
    nodes = [[0, 0, 0, 0], [0, 0, 0, 1]]  # [key, value, prev, next]; 0/1 为哨兵
    head, tail = 0, 1
    nodes[0][3] = 1
    nodes[1][2] = 0
    key_node = {}

    def detach(i):
        p, n = nodes[i][2], nodes[i][3]
        nodes[p][3] = n
        nodes[n][2] = p

    def push_front(i):
        first = nodes[head][3]
        nodes[i][2] = head
        nodes[i][3] = first
        nodes[head][3] = i
        nodes[first][2] = i

    size = 0
    out = []
    for op in data["ops"]:
        if op[0] == "get":
            k = op[1]
            if k in key_node:
                i = key_node[k]
                detach(i)
                push_front(i)
                out.append(nodes[i][1])
            else:
                out.append(None)
        else:
            k, v = op[1], op[2]
            if k in key_node:
                i = key_node[k]
                nodes[i][1] = v
                detach(i)
                push_front(i)
            else:
                if size >= capacity:
                    last = nodes[tail][2]
                    detach(last)
                    del key_node[nodes[last][0]]
                    size -= 1
                nodes.append([k, v, -1, -1])
                key_node[k] = len(nodes) - 1
                push_front(len(nodes) - 1)
                size += 1
    return out
`,
  },

  'persistent-segment-tree': {
    statement: '维护可持久化线段树（主席树）：版本 0 是初始数组，每次 update 基于某个历史版本生成新版本（版本号按执行顺序递增），sum 查询任意历史版本的区间和。要求只复制被修改的路径，共享其余节点。',
    input: 'data 为 {"nums": [...], "ops": [...]}。ops 中 ["update", ver, idx, v] 表示基于版本 ver 把下标 idx 赋值为 v 并产生新版本；["sum", ver, l, r] 表示查询版本 ver 的闭区间 [l, r] 和。',
    output: '按顺序返回所有 sum 查询的结果数组。',
    constraints: ['1 <= n <= 10^4，1 <= ops.length <= 10^4', 'ver 引用的版本保证已存在', '0 <= l <= r < n'],
    examples: [
      example({ nums: [1, 2, 3], ops: [["sum", 0, 0, 2], ["update", 0, 1, 10], ["sum", 1, 0, 2], ["sum", 0, 1, 2]] }, [6, 14, 5], '版本 1 是 [1,10,3]；版本 0 的 [1,2] 仍是 5'),
    ],
    tests: [
      example({ nums: [5], ops: [["sum", 0, 0, 0]] }, [5]),
      example({ nums: [1, 2], ops: [["update", 0, 0, 7], ["sum", 1, 0, 1], ["sum", 0, 0, 0]] }, [9, 1]),
      example({ nums: [4, -1], ops: [["sum", 0, 1, 1], ["update", 0, 1, 6], ["update", 1, 0, 2], ["sum", 2, 0, 1], ["sum", 0, 0, 1]] }, [-1, 8, 3]),
    ],
    insights: ['每次修改只新建从根到目标叶子的 O(log n) 个节点，兄弟指针直接指向旧版本节点——历史版本因此天然可查。', '节点用 (左孩, 右孩, 区间和) 三元组表示，node 0 充当空哨兵，查询遇到 0 直接返回 0。'],
    pitfalls: ['更新时先复制当前节点的左右指针再改其中一侧，改错顺序会把旧版本的指针一并改掉。', '版本数组按操作顺序追加，sum 的 ver 参数是历史版本号而非最新版本。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    left = [0]
    right = [0]
    total = [0]

    def build(lo, hi):
        idx = len(total)
        left.append(0)
        right.append(0)
        total.append(0)
        if lo == hi:
            total[idx] = nums[lo]
            return idx
        mid = (lo + hi) // 2
        l = build(lo, mid)
        r = build(mid + 1, hi)
        left[idx] = l
        right[idx] = r
        total[idx] = total[l] + total[r]
        return idx

    versions = [build(0, n - 1)]

    def update(node, lo, hi, pos, v):
        idx = len(total)
        left.append(left[node])
        right.append(right[node])
        total.append(total[node])
        if lo == hi:
            total[idx] = v
            return idx
        mid = (lo + hi) // 2
        if pos <= mid:
            left[idx] = update(left[node], lo, mid, pos, v)
        else:
            right[idx] = update(right[node], mid + 1, hi, pos, v)
        total[idx] = total[left[idx]] + total[right[idx]]
        return idx

    def query(node, lo, hi, l, r):
        if node == 0 or r < lo or hi < l:
            return 0
        if l <= lo and hi <= r:
            return total[node]
        mid = (lo + hi) // 2
        return query(left[node], lo, mid, l, r) + query(right[node], mid + 1, hi, l, r)

    out = []
    for op in data["ops"]:
        if op[0] == "update":
            versions.append(update(versions[op[1]], 0, n - 1, op[2], op[3]))
        else:
            out.append(query(versions[op[1]], 0, n - 1, op[2], op[3]))
    return out
`,
  },

  'persistent-trie': {
    statement: '维护可持久化 Trie：版本 0 是空 Trie，每次 insert 基于某个历史版本插入一个单词并产生新版本（只复制插入路径），count 查询某历史版本中以给定前缀开头的单词个数。',
    input: 'data 为 {"ops": [...]}。ops 中 ["insert", ver, word] 表示基于版本 ver 插入单词；["count", ver, prefix] 表示查询版本 ver 的前缀计数。',
    output: '按顺序返回所有 count 查询的结果数组。',
    constraints: ['1 <= ops.length <= 10^4', '单词为小写字母，长度 1..20', 'ver 引用的版本保证已存在'],
    examples: [
      example({ ops: [["insert", 0, "apple"], ["insert", 0, "app"], ["count", 0, "ap"], ["insert", 0, "banana"], ["count", 0, "ap"], ["count", 1, "app"]] }, [0, 0, 1], '版本 1 只含 apple，前缀 app 计数 1'),
    ],
    tests: [
      example({ ops: [["count", 0, "a"]] }, [0]),
      example({ ops: [["insert", 0, "a"], ["count", 1, "a"], ["count", 1, "b"]] }, [1, 0]),
      example({ ops: [["insert", 0, "ab"], ["insert", 1, "ac"], ["insert", 2, "ab"], ["count", 3, "a"], ["count", 3, "ab"]] }, [3, 2]),
    ],
    insights: ['路径复制：新版本的每个路径节点都是“旧节点内容 + 一处修改”的浅拷贝，子节点字典共享给所有未受影响的分支。', '每个节点存经过计数 pass，插入路径上全部 +1；前缀计数就是前缀末节点（或 0 哨兵）的 pass 值。'],
    pitfalls: ['复制节点时必须浅拷贝子节点字典，直接引用会让旧版本跟着变。', 'node 0 是空 Trie 哨兵（pass = 0），前缀不存在时查询路径落到 0 返回 0。'],
    solution: `def solve(data):
    children_list = [{}]
    pass_count = [0]
    versions = [0]
    out = []
    for op in data["ops"]:
        if op[0] == "insert":
            new_root = len(children_list)
            old_root = versions[op[1]]
            children_list.append(dict(children_list[old_root]))
            pass_count.append(pass_count[old_root] + 1)
            cur = new_root
            for ch in op[2]:
                old_child = children_list[cur].get(ch, 0)
                child_idx = len(children_list)
                children_list.append(dict(children_list[old_child]))
                pass_count.append(pass_count[old_child] + 1)
                children_list[cur][ch] = child_idx
                cur = child_idx
            versions.append(new_root)
        else:
            cur = versions[op[1]]
            for ch in op[2]:
                cur = children_list[cur].get(ch, 0)
                if cur == 0:
                    break
            out.append(pass_count[cur])
    return out
`,
  },

  'rollback-union-find': {
    statement: '实现可回滚并查集：["union", a, b] 合并集合，["connected", a, b] 判断连通，["checkpoint"] 记录当前快照点，["rollback"] 撤销到最近一个检查点（没有检查点则回到初始状态）。要求按秩合并 + 记录历史栈，不做路径压缩。',
    input: 'data 为 {"n": 节点数, "ops": [...]}，节点编号 0..n-1。',
    output: '按顺序返回所有 connected 的布尔值数组。',
    constraints: ['1 <= n <= 10^4，1 <= ops.length <= 10^4'],
    examples: [
      example({ n: 4, ops: [["union", 0, 1], ["connected", 0, 1], ["checkpoint"], ["union", 1, 2], ["connected", 0, 2], ["rollback"], ["connected", 0, 2], ["connected", 0, 1]] }, [true, true, false, true]),
    ],
    tests: [
      example({ n: 2, ops: [["connected", 0, 1]] }, [false]),
      example({ n: 3, ops: [["union", 0, 1], ["union", 1, 2], ["connected", 0, 2], ["checkpoint"], ["rollback"], ["connected", 0, 2]] }, [true, true]),
      example({ n: 1, ops: [["connected", 0, 0]] }, [true]),
    ],
    insights: ['没有路径压缩时 find 是纯指针攀爬，深度按秩对数级；每次 union 把“被挂子树的根”压栈，回滚就是按栈逆序还原 parent 与 size。', '这正是离线动态连通性、可持久化 DFS 等场景的基础件——撤销顺序与合并顺序严格相反。'],
    pitfalls: ['rollback 必须只撤销到最近检查点，多撤或少撤一步后面全错；撤销时要同时恢复 size。', '自根合并（a == b）不产生历史记录，回滚不能把它算进撤销步数。'],
    solution: `def solve(data):
    n = int(data["n"])
    parent = list(range(n))
    size = [1] * n
    history = []
    checkpoints = []

    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x

    out = []
    for op in data["ops"]:
        kind = op[0]
        if kind == "union":
            a, b = find(op[1]), find(op[2])
            if a == b:
                continue
            if size[a] < size[b]:
                a, b = b, a
            parent[b] = a
            size[a] += size[b]
            history.append(b)
        elif kind == "connected":
            out.append(find(op[1]) == find(op[2]))
        elif kind == "checkpoint":
            checkpoints.append(len(history))
        else:
            target = checkpoints.pop() if checkpoints else 0
            while len(history) > target:
                b = history.pop()
                size[parent[b]] -= size[b]
                parent[b] = b
    return out
`,
  },

  'heavy-light-decomposition': {
    statement: '对给定的根树执行重链剖分（Heavy-Light Decomposition）：先 DFS 求子树大小并给每个节点标记重儿子（子树最大的孩子），再沿重链给整棵树分配连续的 DFS 序位置。返回剖分编码结果。',
    input: 'data 为 {"n": 节点数, "edges": [[u, v], ...], "root": 根编号}，无向边列表，节点 0..n-1。',
    output: '返回 {"parent": 父节点数组（根为 -1）, "size": 子树大小, "heavy": 重儿子数组（叶为 -1）, "head": 所在重链链顶, "pos": 剖分位置}。重儿子并列时取邻接表中较早出现的孩子；链内按根到叶顺序连续编号。',
    constraints: ['1 <= n <= 10^4', '0 <= root < n', '输入保证是一棵树'],
    examples: [
      example({ n: 5, edges: [[0, 1], [0, 2], [1, 3], [1, 4]], root: 0 },
        { parent: [-1, 0, 0, 1, 1], size: [5, 3, 1, 1, 1], heavy: [1, 3, -1, -1, -1], head: [0, 0, 2, 0, 4], pos: [0, 1, 3, 2, 4] }),
    ],
    tests: [
      example({ n: 1, edges: [], root: 0 }, { parent: [-1], size: [1], heavy: [-1], head: [0], pos: [0] }),
      example({ n: 3, edges: [[0, 1], [1, 2]], root: 0 }, { parent: [-1, 0, 1], size: [3, 2, 1], heavy: [1, 2, -1], head: [0, 0, 0], pos: [0, 1, 2] }),
      example({ n: 4, edges: [[0, 1], [0, 2], [2, 3]], root: 0 }, { parent: [-1, 0, 0, 2], size: [4, 1, 2, 1], heavy: [2, -1, 3, -1], head: [0, 1, 0, 0], pos: [0, 3, 1, 2] }),
    ],
    insights: ['重儿子保证任意节点到根的重链条数不超过 O(log n)——这是路径查询能拆成 O(log n) 段连续区间的前提。', '分配 pos 时沿重链一次性走完（head 相同），保证链上节点位置连续，可直接丢给线段树。'],
    pitfalls: ['重儿子并列时约定取邻接表中第一个最大者，否则结果不确定。', 'DFS 必须迭代实现或加大递归上限，链式树在默认递归限制下会爆栈。'],
    solution: `def solve(data):
    n = int(data["n"])
    root = int(data["root"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    parent = [-1] * n
    order = []
    stack = [root]
    visited = [False] * n
    visited[root] = True
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                parent[v] = u
                stack.append(v)
    size = [1] * n
    heavy = [-1] * n
    for u in reversed(order):
        total = 1
        best = -1
        best_size = 0
        for v in adj[u]:
            if v == parent[u]:
                continue
            total += size[v]
            if size[v] > best_size:
                best_size = size[v]
                best = v
        size[u] = total
        heavy[u] = best
    head = [0] * n
    pos = [0] * n
    is_heavy = [False] * n
    for u in order:
        p = parent[u]
        if p != -1 and heavy[p] == u:
            is_heavy[u] = True
    timer = 0
    for u in order:
        if u == root or not is_heavy[u]:
            v = u
            while v != -1:
                head[v] = u
                pos[v] = timer
                timer += 1
                v = heavy[v]
    return {"parent": parent, "size": size, "heavy": heavy, "head": head, "pos": pos}
`,
  },

  'centroid-decomposition': {
    statement: '对给定的树执行点分治（Centroid Decomposition）：每轮找出当前连通块的重心（删去后最大子树不超过一半），记录它并从树上删除，再对剩余各连通块递归。返回重心序列与分治树父指针。',
    input: 'data 为 {"n": 节点数, "edges": [[u, v], ...]}，无向边列表。',
    output: '返回 {"order": 重心被选出的顺序（节点编号数组）, "parent": 分治树父指针数组（首个重心为 -1）}。重心并列时取编号最小者。',
    constraints: ['1 <= n <= 10^4', '输入保证是一棵树'],
    examples: [
      example({ n: 4, edges: [[0, 1], [1, 2], [2, 3]] }, { order: [1, 0, 2, 3], parent: [1, -1, 1, 2] }, '路径 0-1-2-3 的第一个重心是 1'),
    ],
    tests: [
      example({ n: 1, edges: [] }, { order: [0], parent: [-1] }),
      example({ n: 2, edges: [[0, 1]] }, { order: [0, 1], parent: [-1, 0] }),
      example({ n: 5, edges: [[0, 1], [0, 2], [0, 3], [0, 4]] }, { order: [0, 1, 2, 3, 4], parent: [-1, 0, 0, 0, 0] }),
    ],
    insights: ['重心保证每个子树大小 ≤ n/2，因此分治树深度只有 O(log n)，这是“点分治套数据结构”复杂度正确的根源。', '找重心：以任意点为根统计子树大小，从起点出发不断走向“超过总数一半”的那一侧，停下来的点就是重心。'],
    pitfalls: ['判定父侧大小时用“总大小 - 当前子树大小”，与孩子侧条件方向相反，写串会死循环。', '每轮组件必须重新 BFS 收集并算大小，不能复用上一轮的 parent。'],
    solution: `def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    removed = [False] * n
    cparent = [-1] * n
    order = []

    def process(start, cpar):
        comp = [start]
        parent_of = {start: -1}
        qi = 0
        while qi < len(comp):
            u = comp[qi]
            qi += 1
            for v in adj[u]:
                if not removed[v] and v not in parent_of:
                    parent_of[v] = u
                    comp.append(v)
        total = len(comp)
        sz = {u: 1 for u in comp}
        for u in reversed(comp):
            p = parent_of[u]
            if p != -1:
                sz[p] += sz[u]
        centroid = start
        while True:
            moved = False
            for v in adj[centroid]:
                if removed[v] or v == parent_of.get(centroid, -1):
                    continue
                if sz[v] * 2 > total:
                    centroid = v
                    moved = True
                    break
            if moved:
                continue
            p = parent_of.get(centroid, -1)
            if p != -1 and (total - sz[centroid]) * 2 > total:
                centroid = p
                continue
            break
        cparent[centroid] = cpar
        order.append(centroid)
        removed[centroid] = True
        for v in adj[centroid]:
            if not removed[v]:
                process(v, centroid)

    process(0, -1)
    return {"order": order, "parent": cparent}
`,
  },

  'dsu-on-tree': {
    statement: '对根树的每个节点求其子树内的不同颜色种数。要求使用 DSU on Tree（重儿子信息保留、轻儿子信息暴力合并的小至大合并）思想完成。',
    input: 'data 为 {"n": 节点数, "colors": 每个节点的颜色数组, "edges": [[u, v], ...], "root": 根编号}。',
    output: '返回每个节点子树内不同颜色种数的数组（按节点编号）。',
    constraints: ['1 <= n <= 10^4', '颜色为正整数', '输入保证是一棵树'],
    examples: [
      example({ n: 5, colors: [1, 2, 1, 3, 2], edges: [[0, 1], [0, 2], [1, 3], [1, 4]], root: 0 }, [3, 2, 1, 1, 1]),
    ],
    tests: [
      example({ n: 1, colors: [7], edges: [], root: 0 }, [1]),
      example({ n: 3, colors: [1, 1, 2], edges: [[0, 1], [1, 2]], root: 0 }, [2, 2, 1]),
      example({ n: 4, colors: [1, 2, 3, 4], edges: [[0, 1], [0, 2], [0, 3]], root: 0 }, [4, 1, 1, 1]),
    ],
    insights: ['每个节点只建一个集合：重儿子的集合直接继承（不搬元素），轻儿子的集合逐个 update 进来——每个元素最多被搬 O(log n) 次。', '答案在合并完成时统计集合大小，与离线询问无关。'],
    pitfalls: ['继承重儿子集合后必须把它的引用置空，防止后续误改共享集合。', 'DFS 要迭代实现，链式树会超出默认递归深度。'],
    solution: `def solve(data):
    n = int(data["n"])
    colors = list(data["colors"])
    root = int(data["root"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    post = []
    parent = {root: -1}
    stack = [(root, False)]
    while stack:
        u, done = stack.pop()
        if done:
            post.append(u)
            continue
        stack.append((u, True))
        for v in adj[u]:
            if v != parent[u]:
                parent[v] = u
                stack.append((v, False))
    sets = [None] * n
    ans = [0] * n
    for u in post:
        children = [v for v in adj[u] if v != parent[u]]
        big = None
        big_len = -1
        for v in children:
            if len(sets[v]) > big_len:
                big_len = len(sets[v])
                big = v
        if big is None:
            sets[u] = {colors[u]}
        else:
            merged = sets[big]
            sets[big] = None
            merged.add(colors[u])
            for v in children:
                if v == big:
                    continue
                merged.update(sets[v])
                sets[v] = None
            sets[u] = merged
        ans[u] = len(sets[u])
    return ans
`,
  },

  'euler-tour-tree': {
    statement: '对根树做 Euler 游标编号：给每个节点分配进入时间 tin，子树对应一段连续区间；统计每个节点的子树点权和。返回时间戳与子树和。',
    input: 'data 为 {"n": 节点数, "values": 点权数组, "edges": [[u, v], ...], "root": 根编号}。',
    output: '返回 {"tin": 进入时间数组, "tout": 子树内最大 tin 数组, "subtree_sum": 子树点权和数组}。DFS 访问孩子按邻接表顺序入栈（后进先出）。',
    constraints: ['1 <= n <= 10^4', '输入保证是一棵树'],
    examples: [
      example({ n: 5, values: [1, 2, 3, 4, 5], edges: [[0, 1], [0, 2], [1, 3], [1, 4]], root: 0 },
        { tin: [0, 2, 1, 4, 3], tout: [4, 4, 1, 4, 3], subtree_sum: [15, 11, 3, 4, 5] }),
    ],
    tests: [
      example({ n: 1, values: [9], edges: [], root: 0 }, { tin: [0], tout: [0], subtree_sum: [9] }),
      example({ n: 3, values: [1, 1, 1], edges: [[0, 1], [1, 2]], root: 0 }, { tin: [0, 1, 2], tout: [2, 2, 2], subtree_sum: [3, 2, 1] }),
      example({ n: 4, values: [4, 3, 2, 1], edges: [[0, 1], [1, 2], [2, 3]], root: 2 }, { tin: [3, 2, 0, 1], tout: [3, 3, 3, 1], subtree_sum: [4, 7, 10, 1] }),
    ],
    insights: ['先序时间戳把子树变成连续区间 [tin[u], tout[u]]，子树统计从此可以丢给任何区间结构。', 'tout[u] = tin[u] + 子树大小 - 1，只需一次先序 DFS 与一次逆序 size 累加。'],
    pitfalls: ['DFS 必须迭代实现；孩子按邻接表顺序入栈意味着先入的后访问，输出要与这个约定一致。', 'subtree_sum 要在逆先序上累加，顺序错了会把孩子的贡献漏进父亲。'],
    solution: `def solve(data):
    n = int(data["n"])
    values = list(data["values"])
    root = int(data["root"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    order = []
    parent = {root: -1}
    stack = [root]
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if v not in parent:
                parent[v] = u
                stack.append(v)
    tin = [0] * n
    for i, u in enumerate(order):
        tin[u] = i
    size = [1] * n
    subtree_sum = list(values)
    for u in reversed(order):
        p = parent[u]
        if p != -1:
            size[p] += size[u]
            subtree_sum[p] += subtree_sum[u]
    tout = [0] * n
    for u in range(n):
        tout[u] = tin[u] + size[u] - 1
    return {"tin": tin, "tout": tout, "subtree_sum": subtree_sum}
`,
  },

  'link-cut-tree': {
    statement: '维护一片森林，支持 ["link", u, v]（若 u、v 不连通则连一条边）、["cut", u, v]（若边 u-v 存在则删除）、["connected", u, v]（判断连通）。要求使用 Link-Cut Tree（access / makeroot / splay）完成。',
    input: 'data 为 {"n": 节点数, "ops": [...]}，节点编号 0..n-1，操作按顺序执行。',
    output: '按顺序返回所有 connected 的布尔值数组。',
    constraints: ['1 <= n <= 10^4，0 <= ops.length <= 10^4', 'cut 的边保证存在或属于提示中的“不存在则忽略”情形——本题约定：不存在的边执行 cut 时忽略'],
    examples: [
      example({ n: 3, ops: [["link", 0, 1], ["link", 1, 2], ["connected", 0, 2], ["cut", 1, 2], ["connected", 0, 2]] }, [true, false]),
    ],
    tests: [
      example({ n: 2, ops: [["connected", 0, 1]] }, [false]),
      example({ n: 4, ops: [["link", 0, 1], ["link", 2, 3], ["connected", 0, 2], ["link", 1, 2], ["connected", 0, 3], ["cut", 0, 1], ["connected", 0, 1], ["connected", 0, 3]] }, [false, true, false, false]),
      example({ n: 1, ops: [] }, []),
    ],
    insights: ['access 把根到 x 的路径变成实链，makeroot 借助翻转标记把任意点变成根，connectivity 等价于 find_root 相同。', '每次 access 摊扑 O(log n)，link/cut/connected 都由这三种原语组合而成。'],
    pitfalls: ['cut 前必须验证边真实存在（makeroot(u) 后 access(v)，v 的父指针是 u 且 v 无左孩子），否则会切断不存在的边。', 'splay 前要把祖先链的翻转标记自顶向下推开，漏推会让左右孩子在 represented tree 里颠倒。'],
    solution: `def solve(data):
    n = int(data["n"])
    ch = [[0, 0] for _ in range(n + 1)]
    fa = [0] * (n + 1)
    rev = [False] * (n + 1)

    def is_root(x):
        return fa[x] == 0 or (ch[fa[x]][0] != x and ch[fa[x]][1] != x)

    def push_down(x):
        if rev[x]:
            rev[x] = False
            ch[x][0], ch[x][1] = ch[x][1], ch[x][0]
            rev[ch[x][0]] = not rev[ch[x][0]]
            rev[ch[x][1]] = not rev[ch[x][1]]

    def rotate(x):
        y = fa[x]
        z = fa[y]
        k = 0 if ch[y][0] == x else 1
        if not is_root(y):
            if ch[z][0] == y:
                ch[z][0] = x
            else:
                ch[z][1] = x
        fa[x] = z
        ch[y][k] = ch[x][k ^ 1]
        if ch[x][k ^ 1]:
            fa[ch[x][k ^ 1]] = y
        ch[x][k ^ 1] = y
        fa[y] = x

    def splay(x):
        path = []
        y = x
        while True:
            path.append(y)
            if is_root(y):
                break
            y = fa[y]
        for u in reversed(path):
            push_down(u)
        while not is_root(x):
            y = fa[x]
            if not is_root(y):
                if (ch[fa[y]][0] == y) == (ch[y][0] == x):
                    rotate(y)
                else:
                    rotate(x)
            rotate(x)

    def access(x):
        last = 0
        y = x
        while y:
            splay(y)
            ch[y][1] = last
            last = y
            y = fa[y]
        splay(x)
        return last

    def make_root(x):
        access(x)
        rev[x] = not rev[x]

    def find_root(x):
        access(x)
        while True:
            push_down(x)
            if ch[x][0] == 0:
                break
            x = ch[x][0]
        splay(x)
        return x

    out = []
    for op in data["ops"]:
        kind = op[0]
        u, v = op[1] + 1, op[2] + 1
        if kind == "link":
            make_root(u)
            if find_root(v) != u:
                fa[u] = v
        elif kind == "cut":
            make_root(u)
            if find_root(v) == u:
                access(v)
                splay(u)
                if fa[v] == u and ch[v][0] == 0:
                    ch[u][1] = 0
                    fa[v] = 0
        else:
            out.append(find_root(u) == find_root(v))
    return out
`,
  },

  'tree-diameter': {
    statement: '求无权树的直径：返回直径长度与直径端点。使用两次 BFS：从任意点出发找到最远点 a，再从 a 出发找到最远点 b，a-b 即直径。',
    input: 'data 为 {"n": 节点数, "edges": [[u, v], ...]}。',
    output: '返回 {"length": 直径边数, "ends": [a, b]（升序）}。两次 BFS 的最远点都取“严格更远才更新”的队列中第一个。',
    constraints: ['1 <= n <= 10^4', '输入保证是一棵树'],
    examples: [
      example({ n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4]] }, { length: 4, ends: [0, 4] }),
    ],
    tests: [
      example({ n: 1, edges: [] }, { length: 0, ends: [0, 0] }),
      example({ n: 2, edges: [[0, 1]] }, { length: 1, ends: [0, 1] }),
      example({ n: 4, edges: [[0, 1], [0, 2], [0, 3]] }, { length: 2, ends: [1, 2] }),
    ],
    insights: ['第一次 BFS 的最远点一定是某条直径的端点——反证：若它不在任何直径端点上，把路径接上会更长。', '树上所有点的最大距离由直径端点决定，这个性质同时给出树的偏心距算法。'],
    pitfalls: ['最远点更新必须用严格大于，并列时保留先入队者，输出才有唯一确定形式。', 'n=1 时直径长度为 0，端点是节点自身。'],
    solution: `def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)

    def bfs(start):
        dist = [-1] * n
        dist[start] = 0
        queue = [start]
        qi = 0
        far = start
        while qi < len(queue):
            u = queue[qi]
            qi += 1
            if dist[u] > dist[far]:
                far = u
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    queue.append(v)
        return far, dist[far]

    a, _ = bfs(0)
    b, d = bfs(a)
    return {"length": d, "ends": sorted([a, b])}
`,
  },

  'tree-isomorphism-ahu': {
    statement: '判断两棵无根树是否同构。使用 AHU 算法：先找树的中心（直径中点，可能 1 或 2 个），分别以每个中心为根计算括号序列规范化形式，两棵树同构当且仅当存在中心对使得规范化形式相等。',
    input: 'data 为 {"treeA": {"n": 节点数, "edges": [...]}, "treeB": {"n": 节点数, "edges": [...]}}，节点均从 0 编号。',
    output: '返回布尔值。',
    constraints: ['1 <= n <= 10^3', '输入保证各是一棵树'],
    examples: [
      example({ treeA: { n: 3, edges: [[0, 1], [1, 2]] }, treeB: { n: 3, edges: [[0, 1], [0, 2]] } }, true, '两条 3 节点路径同构'),
    ],
    tests: [
      example({ treeA: { n: 1, edges: [] }, treeB: { n: 1, edges: [] } }, true),
      example({ treeA: { n: 4, edges: [[0, 1], [1, 2], [2, 3]] }, treeB: { n: 4, edges: [[0, 1], [0, 2], [0, 3]] } }, false),
      example({ treeA: { n: 4, edges: [[0, 1], [0, 2], [0, 3]] }, treeB: { n: 4, edges: [[3, 0], [3, 1], [3, 2]] } }, true),
    ],
    insights: ['中心把“无根”化归为“有根”：同构映射必须把中心映到中心，所以只需比较以中心为根的括号序列。', '括号序列自底向上合成：孩子形式排序后拼接，排序抵消了孩子顺序的差异。'],
    pitfalls: ['中心可能有两个（直径为偶数），两个中心都要尝试配对，只试一个会漏判。', '节点数不同直接返回 false，不要进入递归。'],
    solution: `def solve(data):
    def centroids(n, edges):
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        if n == 1:
            return [0]
        order = []
        parent = [-1] * n
        stack = [0]
        visited = [False] * n
        visited[0] = True
        while stack:
            u = stack.pop()
            order.append(u)
            for v in adj[u]:
                if not visited[v]:
                    visited[v] = True
                    parent[v] = u
                    stack.append(v)
        sz = [1] * n
        for u in reversed(order):
            p = parent[u]
            if p != -1:
                sz[p] += sz[u]
        best = []
        best_val = None
        for u in range(n):
            mx = n - sz[u]
            for v in adj[u]:
                if v != parent[u] and sz[v] > mx:
                    mx = sz[v]
            if best_val is None or mx < best_val:
                best_val = mx
                best = [u]
            elif mx == best_val:
                best.append(u)
        return best

    def ahu_form(n, edges, root):
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        labels = [None] * n
        order = []
        parent = {root: -1}
        stack = [root]
        while stack:
            u = stack.pop()
            order.append(u)
            for v in adj[u]:
                if v not in parent:
                    parent[v] = u
                    stack.append(v)
        for u in reversed(order):
            child_labels = sorted(labels[v] for v in adj[u] if v != parent[u])
            labels[u] = "(" + "".join(child_labels) + ")"
        return labels[root]

    info_a = data["treeA"]
    info_b = data["treeB"]
    n_a, n_b = int(info_a["n"]), int(info_b["n"])
    if n_a != n_b:
        return False
    for ra in centroids(n_a, info_a["edges"]):
        form_a = ahu_form(n_a, info_a["edges"], ra)
        for rb in centroids(n_b, info_b["edges"]):
            if form_a == ahu_form(n_b, info_b["edges"], rb):
                return True
    return False
`,
  },

  'rerooting-dp': {
    statement: '对无权树上的每个节点 v 求“以 v 为根时，所有节点到 v 的距离之和”。使用换根 DP：先以 0 为根算出子树答案，再自顶向下把根从父节点换到孩子，用 O(1) 转移更新。',
    input: 'data 为 {"n": 节点数, "edges": [[u, v], ...]}。',
    output: '返回每个节点的距离和数组（按节点编号）。',
    constraints: ['1 <= n <= 10^4', '输入保证是一棵树'],
    examples: [
      example({ n: 4, edges: [[0, 1], [1, 2], [2, 3]] }, [6, 4, 4, 6]),
    ],
    tests: [
      example({ n: 1, edges: [] }, [0]),
      example({ n: 2, edges: [[0, 1]] }, [1, 1]),
      example({ n: 4, edges: [[0, 1], [0, 2], [0, 3]] }, [3, 5, 5, 5]),
    ],
    insights: ['换根转移：ans[child] = ans[parent] + (n - sz[child]) - sz[child]——跨过一条边，child 一侧加 n - sz[child]，parent 一侧减 sz[child]。', '第一次 DFS 只算子树内部的贡献，第二次 DFS 把“上方世界”的贡献传递下来，两步合起来覆盖整棵树。'],
    pitfalls: ['换根必须按先序（父在子前）进行，用逆序会把未更新的父答案传给孩子。', 'sz 与 down 的累加在逆先序上做，方向记反会得到空值。'],
    solution: `def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    order = []
    parent = [-1] * n
    stack = [0]
    visited = [False] * n
    visited[0] = True
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                parent[v] = u
                stack.append(v)
    sz = [1] * n
    down = [0] * n
    for u in reversed(order):
        p = parent[u]
        if p != -1:
            sz[p] += sz[u]
            down[p] += down[u] + sz[u]
    ans = [0] * n
    ans[0] = down[0]
    for u in order:
        if u == 0:
            continue
        ans[u] = ans[parent[u]] + (n - sz[u]) - sz[u]
    return ans
`,
  },

  'mo-algorithm': {
    statement: '对静态整数数组回答多次“区间 [l, r] 内不同元素个数”。要求使用莫队算法：按左端点所在块排序（块序号奇偶交替决定右端点方向），双指针增量维护计数。',
    input: 'data 为 {"nums": [...], "queries": [[l, r], ...]}，查询为 0 开始的闭区间。',
    output: '按查询原顺序返回每个区间的不同元素个数。',
    constraints: ['1 <= n <= 10^4', '1 <= queries.length <= 10^4'],
    examples: [
      example({ nums: [1, 2, 1, 3, 2], queries: [[0, 4], [1, 3], [2, 2]] }, [3, 3, 1]),
    ],
    tests: [
      example({ nums: [1, 1, 1], queries: [[0, 2]] }, [1]),
      example({ nums: [], queries: [] }, []),
      example({ nums: [1, 2, 3, 2, 1], queries: [[0, 4], [1, 2], [3, 4]] }, [3, 2, 2]),
    ],
    insights: ['排序后指针总移动量是 O((n + q) √n)：左端点块内单调、跨块跳 O(√n)，右端点每块至多扫全轴一次（奇偶优化再省一半）。', '增量维护只需一张计数表：进入元素首次出现则 distinct +1，移除元素计数归零则 distinct -1。'],
    pitfalls: ['指针增删的四个 while 顺序写错会导致窗口为空时越界，先扩右、再缩右、再扩左、最后缩左是安全顺序。', '返回必须按查询原顺序，排序只影响计算顺序不影响输出顺序。'],
    solution: `def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    queries = list(data["queries"])
    if not queries or n == 0:
        return [0] * len(queries)
    block = max(1, int(n ** 0.5))
    order = sorted(
        range(len(queries)),
        key=lambda i: (
            queries[i][0] // block,
            queries[i][1] if (queries[i][0] // block) % 2 == 0 else -queries[i][1],
        ),
    )
    count = {}
    cur_l, cur_r = 0, -1
    distinct = 0
    out = [0] * len(queries)
    for i in order:
        l, r = queries[i]
        while cur_r < r:
            cur_r += 1
            v = nums[cur_r]
            c = count.get(v, 0)
            if c == 0:
                distinct += 1
            count[v] = c + 1
        while cur_r > r:
            v = nums[cur_r]
            c = count[v] - 1
            count[v] = c
            if c == 0:
                distinct -= 1
            cur_r -= 1
        while cur_l < l:
            v = nums[cur_l]
            c = count[v] - 1
            count[v] = c
            if c == 0:
                distinct -= 1
            cur_l += 1
        while cur_l > l:
            cur_l -= 1
            v = nums[cur_l]
            c = count.get(v, 0)
            if c == 0:
                distinct += 1
            count[v] = c + 1
        out[i] = distinct
    return out
`,
  },

  'offline-dynamic-connectivity': {
    statement: '每条边只在时间段 [l, r] 内存在。对若干时刻的询问“u 与 v 是否连通”作答。要求使用线段树分治：把每条边挂到覆盖其存活区间的 O(log T) 个节点上，DFS 整棵时间线段树，进入节点时用可回滚并查集合并挂上的边，离开时按栈逆序撤销。',
    input: 'data 为 {"n": 节点数, "edges": [[u, v, l, r], ...]（边在时刻 l..r 存在）, "queries": [[t, u, v], ...]}。',
    output: '按询问原顺序返回布尔值数组。',
    constraints: ['1 <= n <= 10^4', '1 <= queries.length <= 10^3', '0 <= l <= r <= 10^5', '询问时刻保证在 0..10^5 内'],
    examples: [
      example({ n: 3, edges: [[0, 1, 0, 3], [1, 2, 1, 2]], queries: [[0, 0, 2], [1, 0, 2], [2, 1, 2], [3, 0, 1]] }, [false, true, true, true]),
    ],
    tests: [
      example({ n: 2, edges: [], queries: [[0, 0, 1]] }, [false]),
      example({ n: 2, edges: [[0, 1, 1, 2]], queries: [[0, 0, 1], [1, 0, 1], [2, 0, 1]] }, [false, true, true]),
      example({ n: 4, edges: [[0, 1, 0, 10], [2, 3, 2, 5]], queries: [[3, 0, 1], [3, 2, 3], [6, 2, 3], [6, 0, 3]] }, [true, true, false, false]),
    ],
    insights: ['一条存活 [l, r] 的边被拆到时间线段树的 O(log T) 个节点上；DFS 进入节点时合并这些边，叶子处回答询问，回溯时按历史栈撤销——每个操作只做一次。', '可回滚并查集（按秩合并 + 撤销栈）提供 O(log n) 的合并与 O(1) 撤销，两者相乘得到整体 O((m + q) log T log n)。'],
    pitfalls: ['撤销必须按合并的逆序进行，栈里记录被挂靠的子树根。', '时间线段树的叶子是单个时刻，询问要按时刻挂到对应叶子上，DFS 到叶子时统一回答。'],
    solution: `def solve(data):
    n = int(data["n"])
    queries = list(data["queries"])
    if not queries:
        return []
    max_time = max(q[0] for q in queries)
    span_edges = {}

    def add_edge(node, lo, hi, l, r, edge):
        if r < lo or hi < l:
            return
        if l <= lo and hi <= r:
            span_edges.setdefault(node, []).append(edge)
            return
        mid = (lo + hi) // 2
        add_edge(2 * node, lo, mid, l, r, edge)
        add_edge(2 * node + 1, mid + 1, hi, l, r, edge)

    for u, v, l, r in data["edges"]:
        add_edge(1, 0, max_time, l, r, (u, v))

    parent = list(range(n))
    size = [1] * n
    history = []

    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x

    def union(a, b):
        a, b = find(a), find(b)
        if a == b:
            return
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        history.append(b)

    ids_by_time = {}
    pairs_by_time = {}
    for i, (t, u, v) in enumerate(queries):
        ids_by_time.setdefault(t, []).append(i)
        pairs_by_time.setdefault(t, []).append((u, v))
    out = [None] * len(queries)

    def dfs(node, lo, hi):
        snap = len(history)
        for u, v in span_edges.get(node, ()):
            union(u, v)
        if lo == hi:
            for idx, (u, v) in zip(ids_by_time.get(lo, ()), pairs_by_time.get(lo, ())):
                out[idx] = find(u) == find(v)
        else:
            mid = (lo + hi) // 2
            dfs(2 * node, lo, mid)
            dfs(2 * node + 1, mid + 1, hi)
        while len(history) > snap:
            b = history.pop()
            size[parent[b]] -= size[b]
            parent[b] = b

    dfs(1, 0, max_time)
    return out
`,
  },
};




