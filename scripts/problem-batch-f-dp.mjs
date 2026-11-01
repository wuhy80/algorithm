const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchFDP = {
  'weighted-interval-scheduling': {
    statement: '加权区间调度：从带权区间集合中选出互不重叠（端点相接不算重叠）的子集使总权重最大。按结束时间排序后 DP：dp[i] = max(dp[i-1], w_i + dp[p(i)])，重建时「严格大于才选」保证确定。返回 {"total": 最大权重, "chosen": 选中区间下标（升序）}。',
    input: 'data 为 {"intervals": [[start, end, weight], ...]}，start < end，weight ≥ 0。',
    output: '返回 {"total": 整数, "chosen": 升序下标数组}；并列时优先「不选」（重建条件为严格大于）。',
    constraints: ['1 <= intervals.length <= 500', '0 <= start < end <= 10^6', '0 <= weight <= 100'],
    examples: [
      example({ intervals: [[1, 4, 3], [3, 5, 2], [5, 7, 4], [6, 8, 1]] }, { total: 7, chosen: [0, 2] }, '[1,4] 与 [5,7] 相接不重叠'),
    ],
    tests: [
      example({ intervals: [[0, 3, 2], [3, 6, 2], [6, 9, 2]] }, { total: 6, chosen: [0, 1, 2] }),
      example({ intervals: [[0, 10, 5], [1, 2, 1], [2, 3, 1]] }, { total: 5, chosen: [0] }),
      example({ intervals: [] }, { total: 0, chosen: [] }),
    ],
    insights: ['排序后「p(i) 是与区间 i 相容的最靠后区间」可二分求得，dp 一维即可——贪心按权重选会错在「长而重」的区间上。', '重建时的并列抉择（选或不选价值相同）必须固定一个方向，本题约定不选。'],
    pitfalls: ['区间相接 [1,4] 与 [4,6] 不算重叠，二分找 p(i) 时用 start >= end 而不是 >。', 'chosen 要按原始下标升序输出，DP 顺序与输出顺序无关。'],
    solution: `import bisect


def solve(data):
    intervals = [(int(s), int(e), int(w), i) for i, (s, e, w) in enumerate(data["intervals"])]
    order = sorted(intervals, key=lambda x: (x[1], x[0], x[3]))
    n = len(order)
    ends = [x[1] for x in order]
    dp = [0] * (n + 1)
    take = [False] * n
    for idx, (s, e, w, original) in enumerate(order):
        p = bisect.bisect_right(ends, s, 0, idx)
        take_from = w + dp[p]
        skip = dp[idx]
        if take_from > skip:
            dp[idx + 1] = take_from
            take[idx] = True
        else:
            dp[idx + 1] = skip
    chosen = []
    idx = n - 1
    while idx >= 0:
        if take[idx]:
            chosen.append(order[idx][3])
            s = order[idx][0]
            idx = bisect.bisect_right(ends, s, 0, idx) - 1
        else:
            idx -= 1
    return {"total": dp[n], "chosen": sorted(chosen)}
`,
  },

  'interval-covering': {
    statement: '最少区间覆盖：给定若干闭区间与目标区间 [L, R]，选出最少的区间把 [L, R] 完全覆盖（允许超出）。贪心：按起点排序，每轮在「起点不超过当前覆盖端点」的区间中选终点最远者。返回最少个数；无法覆盖返回 -1。',
    input: 'data 为 {"intervals": [[s, e], ...], "target": [L, R]}，s <= e，L < R。',
    output: '返回整数（最少区间数或 -1）。',
    constraints: ['1 <= intervals.length <= 500', '-10^6 <= 坐标 <= 10^6'],
    examples: [
      example({ intervals: [[0, 2], [1, 5], [4, 8], [7, 10]], target: [0, 10] }, 4, '0-2 → 1-5 → 4-8 → 7-10，贪心四步覆盖'),
    ],
    tests: [
      example({ intervals: [[0, 5], [5, 10]], target: [0, 10] }, 2),
      example({ intervals: [[0, 4], [6, 10]], target: [0, 10] }, -1),
      example({ intervals: [[-5, 12]], target: [0, 10] }, 1),
      example({ intervals: [[0, 6], [4, 8], [6, 10], [2, 7]], target: [0, 10] }, 2),
    ],
    insights: ['贪心的不变量：已选区间把 [L, cur] 覆盖且区间数最少——下一轮在「起点 ≤ cur」中选终点最远者，覆盖端点单调推进。', '起点超过 cur 时断链，若此时 cur < R 则不可覆盖。'],
    pitfalls: ['「起点 ≤ cur」中的等号必须保留（闭区间相接合法）。', '先按起点排序再贪心，否则最远扩展不成立。'],
    solution: `def solve(data):
    intervals = sorted((int(s), int(e)) for s, e in data["intervals"])
    target_l, target_r = int(data["target"][0]), int(data["target"][1])
    count = 0
    covered = target_l
    i = 0
    n = len(intervals)
    while covered < target_r:
        best_end = None
        while i < n and intervals[i][0] <= covered:
            if best_end is None or intervals[i][1] > best_end:
                best_end = intervals[i][1]
            i += 1
        if best_end is None or best_end <= covered:
            return -1
        covered = best_end
        count += 1
    return count
`,
  },

  'job-sequencing': {
    statement: '带期限的单位时间任务排序：每个任务收益 profit、期限 deadline（必须在时刻 1..deadline 内完成，每时刻一个任务）。按收益降序尝试，把任务安排到「不超过期限的最晚空闲时刻」。返回 {"profit": 总收益, "chosen": 任务下标（升序）}。',
    input: 'data 为 {"jobs": [[profit, deadline], ...]}，deadline ≥ 1。',
    output: '返回 {"profit": 整数, "chosen": 升序下标数组}；并列收益时先处理输入顺序靠前者（稳定排序）。',
    constraints: ['1 <= jobs.length <= 100', '1 <= profit <= 100', '1 <= deadline <= 100'],
    examples: [
      example({ jobs: [[20, 2], [15, 2], [10, 1], [5, 3], [1, 3]] }, { profit: 40, chosen: [0, 1, 3] }, '时刻 2 放 (20,2)、时刻 1 放 (15,2)、时刻 3 放 (5,3)'),
    ],
    tests: [
      example({ jobs: [[10, 1], [20, 1]] }, { profit: 20, chosen: [1] }),
      example({ jobs: [[5, 3], [4, 3], [3, 3]] }, { profit: 12, chosen: [0, 1, 2] }),
      example({ jobs: [] }, { profit: 0, chosen: [] }),
    ],
    insights: ['收益降序是贪心的核心：高收益任务优先占据它期限内「最晚的空位」，把早期时刻留给期限更紧的后续任务。', '占用用「向前的空闲时刻链」或布尔槽位数组实现，deadline 可能超过任务数，槽位上限取 min(deadline, 任务数)。'],
    pitfalls: ['期限可能大于任务总数，槽位下标要钳制到可用范围。', 'chosen 按输入下标升序输出，与调度时刻无关。'],
    solution: `def solve(data):
    jobs = [(int(p), int(d), i) for i, (p, d) in enumerate(data["jobs"])]
    order = sorted(jobs, key=lambda x: (-x[0], x[2]))
    slot_limit = min(len(jobs), max((d for _, d, _ in jobs), default=0))
    occupied = [False] * (slot_limit + 1)
    total = 0
    chosen = []
    for profit, deadline, idx in order:
        slot = min(deadline, slot_limit)
        while slot >= 1 and occupied[slot]:
            slot -= 1
        if slot >= 1:
            occupied[slot] = True
            total += profit
            chosen.append(idx)
    return {"profit": total, "chosen": sorted(chosen)}
`,
  },

  'stable-marriage': {
    statement: '用 Gale–Shapley 算法求稳定婚姻：未婚男士按自己的偏好序依次向未拒绝过的女士求婚，女士在当前对象与新追求者中留下偏好更高者。返回每位男士匹配到的女士编号（数组下标即男士编号）。',
    input: 'data 为 {"men": [[女士编号偏好序], ...], "women": [[男士编号偏好序], ...]}，人数相等且偏好为完整排列。',
    output: '返回 {"matches": 长度 n 的数组，元素为该男士的配偶编号}。',
    constraints: ['1 <= n <= 20', '偏好为 0..n-1 的排列'],
    examples: [
      example({ men: [[0, 1], [0, 1]], women: [[0, 1], [0, 1]] }, { matches: [0, 1] }, '两人都偏爱女士 0，先求婚的男士 0 得手'),
    ],
    tests: [
      example({ men: [[1, 0], [0, 1]], women: [[1, 0], [0, 1]] }, { matches: [1, 0] }),
      example({ men: [[0]], women: [[0]] }, { matches: [0] }),
      example({ men: [[2, 0, 1], [2, 1, 0], [0, 1, 2]], women: [[0, 1, 2], [1, 2, 0], [2, 0, 1]] }, { matches: [2, 1, 0] }),
    ],
    insights: ['男士主动版 Gale–Shapley 对男士最优、对女士最差——这一不对称性是算法最著名的结论。', '「求婚记录 + 女士当前对象」两张状态表是全部状态；每轮只有被甩的男士重新排队，总求婚次数 O(n²)。'],
    pitfalls: ['女士的比较要按她自己的偏好序的「名次」而不是编号大小，先建名次反查表。', '被拒绝的男士要回到队列头部继续按序求婚，跳过已拒绝过的女士。'],
    solution: `from collections import deque


def solve(data):
    men = [list(p) for p in data["men"]]
    women = [list(p) for p in data["women"]]
    n = len(men)
    rank = [{woman: pos for pos, woman in enumerate(women[w])} for w in range(n)]
    man_queue = deque(range(n))
    next_proposal = [0] * n
    current_partner = [-1] * n
    while man_queue:
        m = man_queue.popleft()
        while next_proposal[m] < n:
            w = men[m][next_proposal[m]]
            next_proposal[m] += 1
            if current_partner[w] == -1:
                current_partner[w] = m
                break
            rival = current_partner[w]
            if rank[w][m] < rank[w][rival]:
                current_partner[w] = m
                man_queue.append(rival)
                break
    matches = [0] * n
    for w, m in enumerate(current_partner):
        matches[m] = w
    return {"matches": matches}
`,
  },

  'traveling-salesman-bitmask': {
    statement: '用状态压缩 DP（Held–Karp）求 TSP 最短回路：从 0 号城市出发、访问每个城市恰好一次并回到 0。dp[S][j] = 经过 S 内城市、停在 j 的最短路径。返回最短回路总长。',
    input: 'data 为 {"dist": n×n 对称距离矩阵}。',
    output: '返回最短回路总长（整数）。',
    constraints: ['2 <= n <= 10', '0 <= dist[i][j] <= 10^4', 'dist[i][i] = 0'],
    examples: [
      example({ dist: [[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]] }, 80, '经典 4 城最优回路 0→1→3→2→0'),
    ],
    tests: [
      example({ dist: [[0, 1], [1, 0]] }, 2),
      example({ dist: [[0, 5, 2], [5, 0, 5], [2, 5, 0]] }, 12),
      example({ dist: [[0, 2, 9, 10], [1, 0, 6, 4], [15, 7, 0, 8], [6, 3, 12, 0]] }, 21),
    ],
    insights: ['dp[S][j] 的含义「恰含 S、终点 j」使状态间只差一个城市——2^n × n 状态、每状态 O(n) 转移，把 n! 压到 n²·2^n。', '答案 = min over j 的 dp[full][j] + dist[j][0]：回路在「回到起点」一步闭合。'],
    pitfalls: ['S 必须包含起点 0，枚举子集从 1 开始。', 'n = 2 时回路就是去 1 再回来，别让边界分支漏掉。'],
    solution: `def solve(data):
    dist = data["dist"]
    n = len(dist)
    full = 1 << n
    INF = float("inf")
    dp = [[INF] * n for _ in range(full)]
    dp[1][0] = 0
    for subset in range(1, full):
        if not subset & 1:
            continue
        for last in range(n):
            if dp[subset][last] == INF or not subset & (1 << last):
                continue
            for nxt in range(1, n):
                if subset & (1 << nxt):
                    continue
                new_subset = subset | (1 << nxt)
                candidate = dp[subset][last] + dist[last][nxt]
                if candidate < dp[new_subset][nxt]:
                    dp[new_subset][nxt] = candidate
    best = min(dp[full - 1][j] + dist[j][0] for j in range(1, n)) if n > 1 else 0
    return best
`,
  },

  'digit-dp': {
    statement: '数位 DP：统计 [lo, hi] 内「十进制表示中不存在相邻两位相等」的整数的个数。按位从高到低填数，状态记录上一位数字与是否处于紧上界/前导零状态。',
    input: 'data 为 {"lo": 非负整数, "hi": 非负整数}，lo <= hi。',
    output: '返回满足条件的整数个数（整数）。',
    constraints: ['0 <= lo <= hi <= 10^9'],
    examples: [
      example({ lo: 1, hi: 20 }, 19, '只有 11 不满足（相邻两位相等）'),
    ],
    tests: [
      example({ lo: 0, hi: 0 }, 1),
      example({ lo: 11, hi: 11 }, 0),
      example({ lo: 0, hi: 99 }, 91),
      example({ lo: 100, hi: 121 }, 11),
    ],
    insights: ['「无相邻相等」的数位约束只依赖前一位数字，状态 (位置, 上一位, 紧上界, 前导零) 完整刻画子问题。', '前导零要特殊处理：前导零之间不算相邻相等（如 101 中的 0 与 0 相邻但 0101 的前导 0 不算）。'],
    pitfalls: ['记忆化只在「非紧上界」状态下复用，紧上界分支必须老实枚举。', '区间 [lo, hi] 用 f(hi) - f(lo - 1) 计算，lo = 0 时 f(-1) 当作 0。'],
    solution: `def solve(data):
    lo = int(data["lo"])
    hi = int(data["hi"])

    def count_up_to(limit):
        if limit < 0:
            return 0
        digits = [int(ch) for ch in str(limit)]
        from functools import lru_cache

        @lru_cache(maxsize=None)
        def dfs(pos, prev, tight, started):
            if pos == len(digits):
                return 1
            upper = digits[pos] if tight else 9
            total = 0
            for d in range(upper + 1):
                next_tight = tight and d == upper
                if not started:
                    if d == 0:
                        total += dfs(pos + 1, -1, next_tight, False)
                    else:
                        total += dfs(pos + 1, d, next_tight, True)
                else:
                    if d == prev:
                        continue
                    total += dfs(pos + 1, d, next_tight, True)
            return total

        return dfs(0, -1, True, False)

    return count_up_to(hi) - count_up_to(lo - 1)
`,
  },

  'profile-dp': {
    statement: '用轮廓线 DP 统计 n×m 棋盘用 1×2 多米诺骨牌铺满的方案数：逐格扫描，状态为「当前行已覆盖轮廓」的位掩码，转移考虑竖放（填两格）与横放（占相邻两格）。',
    input: 'data 为 {"n": 行数, "m": 列数}。',
    output: '返回铺满方案数（整数）；面积为奇数返回 0。',
    constraints: ['1 <= n, m <= 8', 'n * m <= 40'],
    examples: [
      example({ n: 2, m: 2 }, 2, '两块横放或两块竖放'),
    ],
    tests: [
      example({ n: 1, m: 4 }, 1),
      example({ n: 3, m: 3 }, 0),
      example({ n: 2, m: 3 }, 3),
      example({ n: 8, m: 2 }, 34),
    ],
    insights: ['逐格扫描时只有「当前位置右侧 m-1 个格子」的覆盖状态影响未来——轮廓线把二维状态压成 m 位掩码。', '竖放的判定「当前格与下行格都空闲」是转移中唯一改变下一行状态的动作。'],
    pitfalls: ['扫描到行末要把掩码整体左移一位再补新位，移位方向错了状态会串行。', '面积为奇数直接返回 0，不必进入 DP。'],
    solution: `def solve(data):
    n = int(data["n"])
    m = int(data["m"])
    if (n * m) % 2 == 1:
        return 0
    current = {0: 1}
    for row in range(n):
        for col in range(m):
            nxt = {}
            for state, ways in current.items():
                if state & 1:
                    new_state = state >> 1
                    nxt[new_state] = nxt.get(new_state, 0) + ways
                    continue
                base = state >> 1
                vertical = base | (1 << (m - 1))
                nxt[vertical] = nxt.get(vertical, 0) + ways
                if col < m - 1 and (state & 2) == 0:
                    horizontal = (state | 2) >> 1
                    nxt[horizontal] = nxt.get(horizontal, 0) + ways
            current = nxt
    return current.get(0, 0)
`,
  },

  'sos-dp': {
    statement: '子集和 DP（Sum over Subsets）：对长度 2^k 的数组 a，求 f[mask] = Σ_{sub ⊆ mask} a[sub]，用「逐位松弛」SOS DP 在 O(k·2^k) 完成。返回结果数组。',
    input: 'data 为 {"array": 长度 2^k 的整数数组}。',
    output: '返回长度 2^k 的整数数组。',
    constraints: ['1 <= k <= 10', '|a[i]| <= 100'],
    examples: [
      example({ array: [1, 2, 3, 4] }, [1, 3, 4, 10], 'f[01]=a00+a01=3，f[11]=全部和=10'),
    ],
    tests: [
      example({ array: [0, 0, 0, 1] }, [0, 0, 0, 1]),
      example({ array: [5, 0, 0, 0] }, [5, 5, 5, 5]),
      example({ array: [1, -1, 2, -2] }, [1, 0, 3, 0]),
    ],
    insights: ['逐位松弛的不变量：处理完第 i 位后，f[mask] 已包含「第 i 位以上与 mask 相同的子集」的和——每一位让子集枚举翻倍而非全枚举。', '它与快速莫比乌斯变换互为逆操作，是高维前缀和的位运算形态。'],
    pitfalls: ['松弛方向：遍历位从 0 到 k-1、mask 从 0 到 2^k-1，f[mask] += f[mask ^ (1<<i)] 用同轮新值即可。', '数组长度必须是 2 的幂。'],
    solution: `def solve(data):
    f = [int(v) for v in data["array"]]
    size = len(f)
    k = size.bit_length() - 1
    if (1 << k) != size:
        raise ValueError("length must be a power of two")
    for i in range(k):
        for mask in range(size):
            if mask & (1 << i):
                f[mask] += f[mask ^ (1 << i)]
    return f
`,
  },

  'probability-dp': {
    statement: '圆桌上 n 个人围成一圈传球，球从 0 号手中出发，每一步等概率传给左右相邻的人之一。求 m 步后球回到 0 号手中的概率（DP：prob[i][j] 为 i 步后球在 j 号手的概率）。返回概率（round 到 6 位小数）。',
    input: 'data 为 {"n": 人数, "m": 步数}，n ≥ 2。',
    output: '返回概率（0..1 的浮点数，round 6）。',
    constraints: ['2 <= n <= 20', '1 <= m <= 100'],
    examples: [
      example({ n: 2, m: 1 }, 0.0, '只有 1 个人可传，球必在 1 号手'),
    ],
    tests: [
      example({ n: 2, m: 2 }, 1.0),
      example({ n: 3, m: 1 }, 0.0),
      example({ n: 3, m: 2 }, 0.5),
      example({ n: 4, m: 4 }, 0.5),
    ],
    insights: ['转移只依赖上一步的位置：prob[i+1][(j±1) mod n] += prob[i][j] / 2——圆环的左右邻居用取模统一处理。', '概率 DP 与计数 DP 只差一个除以 2^m：先数方案再除总步数组合也能得到同样结果。'],
    pitfalls: ['n = 2 时左右邻居是同一人，概率会叠加（两条转移都到 1 号），取模写法天然正确但手工推会漏。', 'round 到 6 位后再比较，浮点累加顺序造成的 1e-16 抖动可忽略。'],
    solution: `def solve(data):
    n = int(data["n"])
    m = int(data["m"])
    prob = [0.0] * n
    prob[0] = 1.0
    for _ in range(m):
        nxt = [0.0] * n
        for j in range(n):
            if prob[j] == 0.0:
                continue
            nxt[(j + 1) % n] += prob[j] / 2.0
            nxt[(j - 1) % n] += prob[j] / 2.0
        prob = nxt
    return round(prob[0], 6)
`,
  },

  'divide-conquer-dp-optimization': {
    statement: '分治优化 DP：把数组切成恰好 k 个连续段，最小化「每段元素和的平方」之和。代价函数满足四边形不等式，opt[i][j]（j 段覆盖前 i 个元素的分割点）单调，用分治求 opt 使复杂度降到 O(k·n·log n)。返回最小总代价。',
    input: 'data 为 {"array": 正整数数组, "k": 正整数}，k <= len(array)。',
    output: '返回最小总代价（整数）。',
    constraints: ['1 <= len(array) <= 400', '1 <= k <= min(len(array), 20)', '1 <= array[i] <= 100'],
    examples: [
      example({ array: [1, 2, 3], k: 2 }, 18, '切段 [1,2][3]：9 + 9 = 18'),
    ],
    tests: [
      example({ array: [1, 2, 3], k: 1 }, 36),
      example({ array: [1, 2, 3], k: 3 }, 14),
      example({ array: [5, 5, 5, 5], k: 2 }, 200),
      example({ array: [10], k: 1 }, 100),
    ],
    insights: ['分治优化的引擎是 opt 的单调性：cost(i, j) 的四边形不等式保证 opt[i][j] 落在 [opt[i-1][j], opt[i][j+1]] 之间，分治枚举区间即可避免全扫。', '代价用前缀和 O(1) 计算：(prefix[j] - prefix[i])²，平方项恰好满足区间包含时的不等式。'],
    pitfalls: ['k=1 时整段是一个区间，不要遗漏「不切分」的方案。', '切段数目必须恰好 k，dp 初始化按段数分层而非滚动。'],
    solution: `def solve(data):
    array = [int(v) for v in data["array"]]
    n = len(array)
    k = int(data["k"])
    prefix = [0]
    for v in array:
        prefix.append(prefix[-1] + v)

    def cost(i, j):
        total = prefix[j] - prefix[i]
        return total * total

    INF = float("inf")
    dp = [cost(0, j) for j in range(n + 1)]
    dp[0] = 0
    for seg in range(2, k + 1):
        new_dp = [INF] * (n + 1)
        new_dp[0] = 0

        def compute(lo, hi, opt_lo, opt_hi):
            if lo > hi:
                return
            mid = (lo + hi) // 2
            best = INF
            best_opt = opt_lo
            for split in range(opt_lo, min(mid, opt_hi) + 1):
                if dp[split] == INF:
                    continue
                candidate = dp[split] + cost(split, mid)
                if candidate < best:
                    best = candidate
                    best_opt = split
            new_dp[mid] = best
            compute(lo, mid - 1, opt_lo, best_opt)
            compute(mid + 1, hi, best_opt, opt_hi)

        compute(1, n, 0, n - 1)
        dp = new_dp
    return dp[n]
`,
  },

  'knuth-optimization': {
    statement: '石子合并（Knuth 优化）：n 堆石子每次只能合并相邻两堆，代价为两堆之和，求合并为一堆的最小总代价。区间 DP 中 opt[i][j-1] <= opt[i][j] 的单调性（Knuth 条件）把枚举降到 O(n²)。',
    input: 'data 为 {"stones": 正整数数组}。',
    output: '返回最小总代价（整数）；单堆返回 0。',
    constraints: ['1 <= n <= 300', '1 <= stones[i] <= 100'],
    examples: [
      example({ stones: [4, 3, 3, 4] }, 28, '先合 4+3=7，再 3+4=7，最后 7+7=14，总代价 28'),
    ],
    tests: [
      example({ stones: [1] }, 0),
      example({ stones: [3, 5] }, 8),
      example({ stones: [1, 2, 3] }, 9),
      example({ stones: [10, 20, 30, 40] }, 190),
    ],
    insights: ['Knuth 条件（quadrangle inequality + 单调性）让 opt[i][j] 夹在 opt[i][j-1] 与 opt[i+1][j] 之间，区间 DP 的枚举从 O(n) 降到均摊 O(1)。', '合并代价 = 区间和，前缀和 O(1) 取用；总代价是每次合并代价之和，而非最后堆的大小。'],
    pitfalls: ['opt 枚举上界是 min(opt[i+1][j], j-1)，边界写错会越界或漏最优分割点。', '单堆代价为 0，dp[i][i] = 0 是所有转移的地基。'],
    solution: `def solve(data):
    stones = [int(v) for v in data["stones"]]
    n = len(stones)
    if n == 1:
        return 0
    prefix = [0]
    for v in stones:
        prefix.append(prefix[-1] + v)

    def cost(i, j):
        return prefix[j + 1] - prefix[i]

    INF = float("inf")
    dp = [[0] * n for _ in range(n)]
    opt = [[0] * n for _ in range(n)]
    for i in range(n):
        opt[i][i] = i
    for length in range(2, n + 1):
        for i in range(0, n - length + 1):
            j = i + length - 1
            dp[i][j] = INF
            lo = opt[i][j - 1]
            hi = opt[i + 1][j] if i + 1 < j else j - 1
            for split in range(lo, hi + 1):
                candidate = dp[i][split] + dp[split + 1][j] + cost(i, j)
                if candidate < dp[i][j]:
                    dp[i][j] = candidate
                    opt[i][j] = split
    return dp[0][n - 1]
`,
  },

  'convex-hull-trick': {
    statement: '用凸壳优化（Convex Hull Trick）回答「给定一组直线，逐点求最小值」：直线按斜率降序插入（并列斜率取截距最小者），维护下凸壳，插入时弹出被完全支配的线，查询对相邻交点二分。返回每个查询点的最小 y = a·x + b。',
    input: 'data 为 {"lines": [[a, b], ...]（斜率 a 严格递增）, "queries": [x, ...]}，全部为整数。',
    output: '返回与 queries 等长的整数数组。',
    constraints: ['1 <= lines.length <= 100', '1 <= queries.length <= 200', '-1000 <= a, b, x <= 1000'],
    examples: [
      example({ lines: [[1, 0], [-1, 10]], queries: [0, 10, -10] }, [0, 0, -10]),
    ],
    tests: [
      example({ lines: [[2, 1]], queries: [0, 5] }, [1, 11]),
      example({ lines: [[0, -3], [1, 2]], queries: [42] }, [-3]),
      example({ lines: [[1, 0], [-1, 0], [0, -5]], queries: [0, 3, -3] }, [-5, -5, -5]),
    ],
    insights: ['斜率递增 + 最小值查询对应「下凸壳」：新线的加入让壳尾被支配的线段失去意义，弹出均摊 O(1)。', '查询二分的是「壳上相邻两线交点的位置」，交点用整数交叉相乘比较避免除法误差。'],
    pitfalls: ['斜率递增是题目前提，乱序输入要先排序（本题保证已排好）。', '相等查询值时取哪条线不影响输出，但壳的弹出判断必须用严格的「完全被支配」。'],
    solution: `def solve(data):
    raw = {}
    for a, b in data["lines"]:
        a, b = int(a), int(b)
        if a not in raw or b < raw[a]:
            raw[a] = b
    lines = sorted(raw.items(), key=lambda kv: -kv[0])
    hull = []
    for a3, b3 in lines:
        while len(hull) >= 2:
            a1, b1 = hull[-2]
            a2, b2 = hull[-1]
            if (b2 - b1) * (a2 - a3) >= (b3 - b2) * (a1 - a2):
                hull.pop()
            else:
                break
        if hull and hull[-1][0] == a3:
            if hull[-1][1] <= b3:
                continue
            hull.pop()
        hull.append((a3, b3))

    def query(x):
        lo, hi = 0, len(hull) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            a1, b1 = hull[mid]
            a2, b2 = hull[mid + 1]
            if (b2 - b1) >= x * (a1 - a2):
                hi = mid
            else:
                lo = mid + 1
        a, b = hull[lo]
        return a * x + b

    return [query(int(x)) for x in data["queries"]]
`,
  },
};
