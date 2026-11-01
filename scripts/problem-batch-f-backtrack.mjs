const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchFBacktrack = {
  'knights-tour': {
    statement: '用 Warnsdorff 启发式求骑士巡游：从起点出发，每步从 8 个马步方向中选「后续出路最少」的格子（并列时取方向表中的最早者），访问遍 n×n 全部格子。返回按访问顺序排列的坐标数组；走入死路返回 null。方向表固定为 [(1,2),(2,1),(2,-1),(1,-2),(-1,-2),(-2,-1),(-2,1),(-1,2)]。',
    input: 'data 为 {"n": 棋盘边长, "start": [r, c]}。',
    output: '返回 [[r, c], ...]（长度 n²）或 null。',
    constraints: ['1 <= n <= 7', 'start 在棋盘内'],
    examples: [
      example({ n: 1, start: [0, 0] }, [[0, 0]]),
    ],
    tests: [
      example({ n: 5, start: [0, 0] }, [[0, 0], [1, 2], [0, 4], [2, 3], [4, 4], [3, 2], [4, 0], [2, 1], [3, 3], [4, 1], [2, 0], [0, 1], [1, 3], [3, 4], [4, 2], [3, 0], [1, 1], [0, 3], [2, 4], [4, 3], [3, 1], [1, 0], [2, 2], [1, 4], [0, 2]]),
      example({ n: 3, start: [0, 0] }, null, '3×3 从角落出发无法遍历全图（中心孤立）'),
      example({ n: 2, start: [0, 0] }, null),
    ],
    insights: ['Warnsdorff 的贪心是「先走窄路」：出路越少的格子越早访问，避免留下孤岛；它对标准棋盘几乎总能一次成功，但不保证完备。', '并列出路数时用固定的方向表顺序打破平局，结果因此完全确定。'],
    pitfalls: ['统计「后续出路」时要排除已访问格子，漏排除会走回头路。', '小棋盘（3×3、2×2）Warnsdorff 会走进死路，要如约返回 null 而不是死循环。'],
    solution: `def solve(data):
    n = int(data["n"])
    sr, sc = int(data["start"][0]), int(data["start"][1])
    moves = ((1, 2), (2, 1), (2, -1), (1, -2), (-1, -2), (-2, -1), (-2, 1), (-1, 2))

    def onward(r, c):
        count = 0
        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                count += 1
        return count

    visited = [[False] * n for _ in range(n)]
    tour = []
    r, c = sr, sc
    for step in range(n * n):
        visited[r][c] = True
        tour.append([r, c])
        best = None
        best_count = 9
        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                count = onward(nr, nc)
                if count < best_count:
                    best_count = count
                    best = (nr, nc)
        if best is None:
            break
        r, c = best
    if len(tour) == n * n:
        return tour
    return None
`,
  },

  'sudoku-backtracking': {
    statement: '用回溯法解数独：按行优先顺序找第一个空格，依次尝试 1~9（检查行、列、3×3 宫无重复），递归求解；全部填满返回解，无解返回 null。',
    input: 'data 为 {"grid": 9×9 数组，0 表示空格}。',
    output: '返回解开的 9×9 数组或 null。',
    constraints: ['grid 为 9×9，元素 0..9', 'tests 的题目要么有唯一解要么无解'],
    examples: [
      example({ grid: [[5, 3, 0, 6, 7, 8, 9, 1, 2], [6, 7, 0, 1, 9, 5, 0, 0, 8], [0, 9, 8, 0, 4, 0, 5, 6, 7], [8, 5, 9, 0, 6, 1, 4, 0, 0], [4, 2, 0, 8, 0, 3, 7, 9, 0], [7, 1, 3, 9, 0, 0, 8, 5, 6], [0, 6, 0, 0, 3, 7, 2, 8, 0], [2, 8, 7, 4, 0, 9, 6, 0, 5], [3, 4, 5, 2, 0, 6, 1, 7, 9]] },
        [[5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7], [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6], [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9]], '经典解盘挖空 22 格（唯一解），按行优先回溯直接得到唯一解盘'),
    ],
    tests: [
      example({ grid: [[1, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]] }, null, '初始盘面第一行出现两个 1，直接判定非法'),
      example({ grid: [[0, 0], [0, 0]] }, [[1, 2], [2, 1]], '退化 2×2：规则同数独（行、列、宫无重复），按 1..n 尝试'),
    ],
    insights: ['回溯的正确性来自「当前前缀始终合法」：每次填数前查行、列、宫三个约束，失败立即回退，不合法状态绝不向下传播。', '初始盘面的预填数字也要通过同一套约束校验，非法输入直接短路返回 null。'],
    pitfalls: ['3×3 宫的左上角用 (r // 3) * 3 与 (c // 3) * 3 定位，写错会检查到错误区域。', '无解时要把所有试探撤干净并返回 null，不能返回部分填写的盘面。'],
    solution: `def solve(data):
    grid = [list(row) for row in data["grid"]]
    n = len(grid)
    box = max(1, int(n ** 0.5))

    def initial_valid():
        for r in range(n):
            for c in range(n):
                value = grid[r][c]
                if value == 0:
                    continue
                for i in range(n):
                    if i != c and grid[r][i] == value:
                        return False
                    if i != r and grid[i][c] == value:
                        return False
                br, bc = r - r % box, c - c % box
                for i in range(br, br + box):
                    for j in range(bc, bc + box):
                        if (i, j) != (r, c) and grid[i][j] == value:
                            return False
        return True

    def placeable(r, c, value):
        for i in range(n):
            if grid[r][i] == value or grid[i][c] == value:
                return False
        br, bc = r - r % box, c - c % box
        for i in range(br, br + box):
            for j in range(bc, bc + box):
                if grid[i][j] == value:
                    return False
        return True

    def backtrack():
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 0:
                    for value in range(1, n + 1):
                        if placeable(r, c, value):
                            grid[r][c] = value
                            result = backtrack()
                            if result is not None:
                                return result
                            grid[r][c] = 0
                    return None
        return [row[:] for row in grid]

    if not initial_valid():
        return None
    return backtrack()
`,
  },

  'dancing-links': {
    statement: '用 Algorithm X（Dancing Links 的算法内核）求解精确覆盖：选出若干行，使每一列恰好被一行覆盖。实现取「剩余列数最少的列」（并列取最靠左）为分支列，按行序尝试覆盖它的行，递归求解。返回选中行的下标（升序）；无解返回 null。',
    input: 'data 为 {"matrix": 0/1 二维数组}，每行是一个候选集合。',
    output: '返回行下标数组（升序）或 null。',
    constraints: ['1 <= rows <= 20', '1 <= cols <= 12'],
    examples: [
      example({ matrix: [[1, 0, 0, 1], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 1, 0]] }, [0, 1], '第 0 行覆盖列 0、3，第 1 行覆盖列 1、2'),
    ],
    tests: [
      example({ matrix: [[1, 0], [0, 1]] }, [0, 1]),
      example({ matrix: [[0, 1], [0, 1]] }, null),
      example({ matrix: [[1, 1], [1, 0]] }, [0]),
      example({ matrix: [[1, 0, 1], [0, 1, 1], [1, 1, 0]] }, null, 'col 2 无论选哪行都覆盖 col 0 或 col 1，无法恰好覆盖'),
    ],
    insights: ['分支列选「剩余候选最少」是精确覆盖的效率关键：约束最紧的地方最先决策，失败的分支最快被剪掉。', '覆盖/撤销一组行的操作必须完全对称——回溯后状态精确还原是回溯法的不变量。'],
    pitfalls: ['选行后要把该行所有 1 所在列的其他行一并移除，只移除本列的行会留下重复覆盖。', '无解要一路返回 null，不能返回部分覆盖。'],
    solution: `def solve(data):
    matrix = [list(row) for row in data["matrix"]]
    rows = len(matrix)
    cols = len(matrix[0]) if rows else 0
    active_rows = set(range(rows))
    active_cols = set(range(cols))
    chosen = []

    def cover(row_selected):
        removed = []
        active_rows.remove(row_selected)
        chosen.append(row_selected)
        covered_cols = [c for c in range(cols) if matrix[row_selected][c]]
        for c in covered_cols:
            active_cols.discard(c)
            for r in list(active_rows):
                if matrix[r][c]:
                    active_rows.remove(r)
                    removed.append(r)
        return removed

    def uncover(removed, row_selected):
        chosen.pop()
        active_rows.add(row_selected)
        covered_cols = [c for c in range(cols) if matrix[row_selected][c]]
        for c in covered_cols:
            active_cols.add(c)
        for r in removed:
            active_rows.add(r)

    def search():
        if not active_cols:
            return sorted(chosen)
        target = min(active_cols, key=lambda c: (sum(1 for r in active_rows if matrix[r][c]), c))
        candidates = [r for r in sorted(active_rows) if matrix[r][target]]
        if not candidates:
            return None
        for r in candidates:
            removed = cover(r)
            result = search()
            if result is not None:
                return result
            uncover(removed, r)
        return None

    return search()
`,
  },

  'minimax-alpha-beta': {
    statement: '对一棵完全二叉博弈树执行带 α-β 剪枝的极小极大搜索：叶值按层序给出，根为最大化层，逐层交替。按从左到右顺序访问，剪枝发生时跳过未评估的叶。返回 {"value": 根值, "evaluated": 被评估的叶节点数}。',
    input: 'data 为 {"leaves": 叶值数组（长度为 2^depth）}，depth 由数组长度决定。',
    output: '返回 {"value": 整数, "evaluated": 整数}。',
    constraints: ['1 <= depth <= 8', '2 <= len(leaves) <= 256', '|叶值| <= 100'],
    examples: [
      example({ leaves: [3, 5, 6, 9] }, { value: 6, evaluated: 4 }, '6 > α=3 未触发剪枝，四个叶全部评估'),
    ],
    tests: [
      example({ leaves: [3, 5, 6, 9, 1, 2, 0, -1] }, { value: 5, evaluated: 5 }),
      example({ leaves: [1, 2, 3, 4] }, { value: 3, evaluated: 4 }),
      example({ leaves: [9, 1, 2, 4, 6, 8, 0, 7] }, { value: 7, evaluated: 8 }),
      example({ leaves: [5] }, { value: 5, evaluated: 1 }),
    ],
    insights: ['α 是最大化层已保证的下界、β 是最小化层已保证的上界；某层出现 β ≤ α 时，剩余兄弟不可能改变祖先决策，整枝可剪。', '剪枝只减少评估次数、不改变根值——这是它成为博弈搜索标配的原因。'],
    pitfalls: ['剪枝条件用 β ≤ α（含等号），小于号会漏剪相等情形。', 'min 层内部传递 α 不变、更新 β；max 层反之，写反会让评估计数错乱。'],
    solution: `def solve(data):
    leaves = list(data["leaves"])
    counter = [0]

    def search(node, depth, alpha, beta, maximizing):
        if depth == 0:
            counter[0] += 1
            return leaves[node]
        if maximizing:
            best = None
            for i in range(2):
                child = node * 2 + i
                value = search(child, depth - 1, alpha, beta, False)
                if best is None or value > best:
                    best = value
                if best > alpha:
                    alpha = best
                if beta <= alpha:
                    break
            return best
        best = None
        for i in range(2):
            child = node * 2 + i
            value = search(child, depth - 1, alpha, beta, True)
            if best is None or value < best:
                best = value
            if best < beta:
                beta = best
            if beta <= alpha:
                break
        return best

    depth = 0
    size = len(leaves)
    while (1 << depth) < size:
        depth += 1
    value = search(0, depth, float("-inf"), float("inf"), True)
    return {"value": value, "evaluated": counter[0]}
`,
  },

  'branch-and-bound': {
    statement: '用分支限界法解 0/1 背包（最大价值）：按「价值/重量」降序排序物品，递归每个物品的选/不选两个分支，用「剩余容量装满价值密度最高的物品」的贪心分数作为上界剪枝。返回最大总价值。',
    input: 'data 为 {"items": [[w, v], ...], "capacity": 正整数}。',
    output: '返回最大总价值（整数）。',
    constraints: ['1 <= items.length <= 15', '1 <= w, v <= 100', '1 <= capacity <= 500'],
    examples: [
      example({ items: [[2, 3], [3, 4], [4, 5], [5, 6]], capacity: 5 }, 7, '选 (2,3)+(3,4) 总重 5 价值 7'),
    ],
    tests: [
      example({ items: [[10, 60], [20, 100], [30, 120]], capacity: 50 }, 220),
      example({ items: [[5, 10]], capacity: 4 }, 0),
      example({ items: [[1, 1], [1, 2], [1, 3]], capacity: 2 }, 5),
      example({ items: [[7, 21], [3, 9], [4, 16], [5, 20]], capacity: 10 }, 36),
    ],
    insights: ['上界的质量决定剪枝效率：分数背包贪心（剩余容量按密度装满）是可行解价值的紧上界，计算只要一次排序。', '分支顺序按密度降序先行「选」的分支，通常更快碰到好可行解，从而让上界剪枝更早生效。'],
    pitfalls: ['上界用「当前价值 + 分数贪心」要与已消耗容量联动，漏算已用容量会剪掉正确分支。', '答案是最优可行解的价值，分数解本身不可作为答案。'],
    solution: `def solve(data):
    items = [(int(w), int(v)) for w, v in data["items"]]
    capacity = int(data["capacity"])
    order = sorted(range(len(items)), key=lambda i: -(items[i][1] / items[i][0]))
    best = [0]

    def bound(idx, weight_left):
        total = 0
        for i in order[idx:]:
            w, v = items[i]
            if w <= weight_left:
                weight_left -= w
                total += v
            else:
                total += v * weight_left / w
                break
        return total

    def search(idx, weight_used, value):
        if value > best[0]:
            best[0] = value
        if idx == len(items):
            return
        w, v = items[order[idx]]
        if weight_used + w <= capacity and value + v + bound(idx + 1, capacity - weight_used - w) > best[0]:
            search(idx + 1, weight_used + w, value + v)
        if value + bound(idx + 1, capacity - weight_used) > best[0]:
            search(idx + 1, weight_used, value)

    search(0, 0, 0)
    return best[0]
`,
  },

  'dpll-sat': {
    statement: '用 DPLL 算法判定 CNF 可满足性：反复做单子句传播（unit propagation）与纯文字消除（pure literal），无单子句与纯文字时取编号最小的未赋值变量先试 False 再试 True。可满足时返回一组满足赋值（未出现变量取 False），否则返回 null。',
    input: 'data 为 {"num_vars": 变量数 n, "clauses": [[正负整数], ...]}，文字 ±1..±n（正为真、负为假）。',
    output: '返回 {"satisfiable": 布尔, "assignment": 长度 n 的布尔数组或 null}。',
    constraints: ['1 <= num_vars <= 12', '1 <= clauses.length <= 60', '无空子句输入'],
    examples: [
      example({ num_vars: 3, clauses: [[1, 2], [-1, 3], [-2, -3]] }, { satisfiable: true, assignment: [false, true, false] }, 'DPLL 先试 False：1 假时子句 1 由 2 满足，2 真由子句 3 传播 3 假'),
    ],
    tests: [
      example({ num_vars: 2, clauses: [[1], [-1]] }, { satisfiable: false, assignment: null }),
      example({ num_vars: 3, clauses: [[-1, -2, -3], [1], [2], [3]] }, { satisfiable: false, assignment: null }),
      example({ num_vars: 2, clauses: [[1, -2]] }, { satisfiable: true, assignment: [true, false] }),
      example({ num_vars: 4, clauses: [[1, 2], [-1, 3], [-2, 4], [-3, -4]] }, { satisfiable: true, assignment: [false, true, false, true] }),
    ],
    insights: ['单子句传播是 DPLL 的引擎：只剩一个文字的子句强行赋值，传播可能触发新的单子句——连锁推理远快于盲目枚举。', '纯文字（某变量只以一种极性出现）直接取该极性，不会破坏任何子句。'],
    pitfalls: ['传播后要清空子句中的已满足文字、删除含假文字子句前的空判——出现空子句即当前分支不可满足。', '未在子句中出现的变量默认 False，保证赋值数组长度为 n。'],
    solution: `def solve(data):
    num_vars = int(data["num_vars"])

    def dpll(clauses, assignment):
        clauses = [list(c) for c in clauses]
        changed = True
        while changed:
            changed = False
            units = [c[0] for c in clauses if len(c) == 1]
            for unit in units:
                new_clauses = []
                for c in clauses:
                    if unit in c:
                        continue
                    if -unit in c:
                        c = [lit for lit in c if lit != -unit]
                        if not c:
                            return None
                    new_clauses.append(c)
                clauses = new_clauses
                assignment = dict(assignment)
                assignment[abs(unit)] = unit > 0
                changed = True
            if not clauses:
                return assignment
            counts = {}
            for c in clauses:
                for lit in c:
                    counts.setdefault(abs(lit), set()).add(lit > 0)
            for var, polarities in counts.items():
                if len(polarities) == 1:
                    value = next(iter(polarities))
                    new_clauses = []
                    for c in clauses:
                        if (var if value else -var) in c:
                            continue
                        if (var if not value else -var) in c:
                            c = [lit for lit in c if lit != (-var if value else var)]
                            if not c:
                                return None
                        new_clauses.append(c)
                    clauses = new_clauses
                    assignment = dict(assignment)
                    assignment[var] = value
                    changed = True
                    break
        var = None
        for candidate in range(1, num_vars + 1):
            if candidate not in assignment:
                var = candidate
                break
        if var is None:
            return assignment
        for value in (False, True):
            new_clauses = [c for c in clauses if (var if value else -var) not in c]
            stripped = []
            conflict = False
            for c in new_clauses:
                c = [lit for lit in c if lit != (-var if value else var)]
                if not c:
                    conflict = True
                    break
                stripped.append(c)
            if conflict:
                continue
            result = dpll(stripped, {**assignment, var: value})
            if result is not None:
                return result
        return None

    result = dpll([list(c) for c in data["clauses"]], {})
    if result is None:
        return {"satisfiable": False, "assignment": None}
    assignment = [bool(result.get(v, False)) for v in range(1, num_vars + 1)]
    return {"satisfiable": True, "assignment": assignment}
`,
  },

  'ac3-constraint-propagation': {
    statement: '用 AC-3 算法做约束传播：把所有弧 (x, y) 放入队列，逐条修订——从 x 的域中删去「在 y 中没有任何取值与之相容」的值；域发生变化则把 (z, x)（z 为 x 的其他邻居）重新入队。某域被删空则不一致。返回传播后的域与一致性。',
    input: 'data 为 {"num_vars": 变量数, "domains": [[值, ...], ...], "constraints": [[x, y, [[a, b], ...]], ...]}，constraint 表示 x=a 与 y=b 相容（双向使用）。',
    output: '返回 {"domains": [[值, ...], ...], "consistent": 布尔}，各域内保持原相对顺序。',
    constraints: ['1 <= num_vars <= 8', '每域 1..6 个值', '1 <= constraints.length <= 12'],
    examples: [
      example({ num_vars: 2, domains: [[1, 2, 3], [2, 3]], constraints: [[0, 1, [[2, 2], [3, 3]]]] } , { domains: [[2, 3], [2, 3]], consistent: true }, 'x0 只能取 2、3'),
    ],
    tests: [
      example({ num_vars: 3, domains: [[1, 2], [1, 2], [1, 2]], constraints: [[0, 1, [[1, 2], [2, 1]]], [1, 2, [[1, 2], [2, 1]]], [2, 0, [[1, 1], [2, 2]]]] }, { domains: [[1, 2], [1, 2], [1, 2]], consistent: true }, 'x0≠x1、x1≠x2、x2=x0 有解（1,2,1），AC-3 无需删值'),
      example({ num_vars: 2, domains: [[1, 2], [1, 2]], constraints: [[0, 1, [[1, 1], [2, 2]]]] }, { domains: [[1, 2], [1, 2]], consistent: true }),
      example({ num_vars: 2, domains: [[1], [2]], constraints: [[0, 1, [[1, 1]]]] }, { domains: [[], [2]], consistent: false }, '弧 (0,1) 先处理：x0=1 在 x1={2} 中无支持，x0 被删空'),
    ],
    insights: ['弧相容是局部一致性：每条弧 (x,y) 要求 x 的每个值在 y 中都有支持；删值只影响反向弧，所以只需把 (z,x) 重新入队。', 'AC-3 一定会终止——每次修订至少删一个值，域有限；删空即不可满足的充分条件（但非必要）。'],
    pitfalls: ['相容关系是双向的：(x,y) 修订后要重新入队的弧是 (z,x)（z 的邻 x），不是 (x,z)。', '值对 [a, b] 表示 x 取 a 且 y 取 b 相容，校验方向别写反。'],
    solution: `from collections import deque


def solve(data):
    num_vars = int(data["num_vars"])
    domains = [list(d) for d in data["domains"]]
    neighbors = {}
    allowed = {}
    for x, y, pairs in data["constraints"]:
        x, y = int(x), int(y)
        pairs = [(int(a), int(b)) for a, b in pairs]
        allowed[(x, y)] = set(pairs)
        neighbors.setdefault(x, set()).add(y)
        neighbors.setdefault(y, set()).add(x)

    def compatible(x, a, y, b):
        if (x, y) in allowed:
            return (a, b) in allowed[(x, y)]
        return (b, a) in allowed.get((y, x), set())

    queue = deque()
    for x, y in allowed:
        queue.append((x, y))
        queue.append((y, x))
    consistent = True
    while queue:
        x, y = queue.popleft()
        revised = False
        for a in list(domains[x]):
            if not any(compatible(x, a, y, b) for b in domains[y]):
                domains[x].remove(a)
                revised = True
                if not domains[x]:
                    consistent = False
                    queue.clear()
                    break
        if not consistent:
            break
        if revised:
            for z in neighbors.get(x, ()):
                if z != y:
                    queue.append((z, x))
    return {"domains": [list(d) for d in domains], "consistent": consistent}
`,
  },

  'recursion-call-stack': {
    statement: '观测递归的调用栈行为：对 mode 为 "factorial" 或 "fib" 的朴素递归（factorial(n) = n·factorial(n-1)，factorial(0)=1；fib(n) = fib(n-1)+fib(n-2)，fib(0)=fib(1)=1），统计 {"value": 返回值, "calls": 总调用次数, "max_depth": 调用栈最大深度（顶层调用深度为 1）}。',
    input: 'data 为 {"n": 非负整数, "mode": "factorial" 或 "fib"}。',
    output: '返回 {"value": 整数, "calls": 整数, "max_depth": 整数}。',
    constraints: ['0 <= n <= 15'],
    examples: [
      example({ n: 4, mode: "factorial" }, { value: 24, calls: 5, max_depth: 5 }, 'factorial(4..0) 共 5 次调用，栈深 5'),
    ],
    tests: [
      example({ n: 0, mode: "factorial" }, { value: 1, calls: 1, max_depth: 1 }),
      example({ n: 5, mode: "fib" }, { value: 8, calls: 15, max_depth: 5 }),
      example({ n: 3, mode: "fib" }, { value: 3, calls: 5, max_depth: 3 }),
      example({ n: 10, mode: "factorial" }, { value: 3628800, calls: 11, max_depth: 11 }),
    ],
    insights: ['朴素 fib 的调用次数是指数级的：calls(fib(n)) = 2·calls(fib(n-1)) + 1——递归树几乎翻倍生长，这正是记忆化要治的病。', '栈深对应递归树的一条最长路径：factorial 是一条链（深 n+1），fib 的深度也只有 n（沿第一分支一路向下）。'],
    pitfalls: ['fib 的深度沿左分支走到 fib(1) 才最深，是 n 而不是调用总数。', '计数器要在递归函数入口统一加一，出口不计。'],
    solution: `def solve(data):
    n = int(data["n"])
    mode = data["mode"]
    calls = [0]
    depth = [0]
    max_depth = [0]

    def rec(k):
        calls[0] += 1
        depth[0] += 1
        if depth[0] > max_depth[0]:
            max_depth[0] = depth[0]
        if mode == "factorial":
            value = 1 if k == 0 else k * rec(k - 1)
        else:
            value = 1 if k <= 1 else rec(k - 1) + rec(k - 2)
        depth[0] -= 1
        return value

    value = rec(n)
    return {"value": value, "calls": calls[0], "max_depth": max_depth[0]}
`,
  },

  'permutation-generation': {
    statement: '按字典序生成输入数组的全部「不重复」排列：先对元素排序，再用回溯逐位选定（跳过重复元素），返回排列的二维数组。',
    input: 'data 为 {"nums": 整数数组}（可能含重复元素），长度 1..5。',
    output: '返回所有唯一排列（每个为整数数组），按字典序升序。',
    constraints: ['1 <= n <= 5', '-10 <= nums[i] <= 10'],
    examples: [
      example({ nums: [1, 2, 3] }, [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]),
    ],
    tests: [
      example({ nums: [1, 1, 2] }, [[1, 1, 2], [1, 2, 1], [2, 1, 1]]),
      example({ nums: [2] }, [[2]]),
      example({ nums: [0, -1] }, [[-1, 0], [0, -1]]),
    ],
    insights: ['去重的关键在回溯的每一层：同层中相同的值只允许第一个未使用的被选中（排序后跳过 nums[i] == nums[i-1] 且前一个未用的分支）。', '按值排序后回溯天然产出字典序，无需事后排序。'],
    pitfalls: ['跳过重复分支的判断要在「排序后的同层」内进行，写成全局判断会把合法排列也丢掉。', '负数参与排序时字典序按数值大小。'],
    solution: `def solve(data):
    nums = sorted(data["nums"])
    n = len(nums)
    used = [False] * n
    results = []
    current = []

    def backtrack():
        if len(current) == n:
            results.append(current[:])
            return
        for i in range(n):
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            used[i] = True
            current.append(nums[i])
            backtrack()
            current.pop()
            used[i] = False

    backtrack()
    return results
`,
  },

  'combination-generation': {
    statement: '生成 1..n 中所有 k 元组合，按字典序（组合内升序，组合间按逐元素比较）排列。回溯时保证候选起点递增即可天然有序。',
    input: 'data 为 {"n": 正整数, "k": 非负整数}。',
    output: '返回组合的二维数组（每个为升序数组）；k = 0 返回 [[]]。',
    constraints: ['1 <= n <= 6', '0 <= k <= n'],
    examples: [
      example({ n: 4, k: 2 }, [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]),
    ],
    tests: [
      example({ n: 3, k: 0 }, [[]]),
      example({ n: 3, k: 3 }, [[1, 2, 3]]),
      example({ n: 3, k: 1 }, [[1], [2], [3]]),
      example({ n: 2, k: 3 }, []),
    ],
    insights: ['组合与排列的差别在于「顺序无关」：回溯时候选起点从当前值 +1 开始，天然避免重复且保持字典序。', '剪枝条件「剩余可选元素不足 k」能砍掉不可能完成的分支。'],
    pitfalls: ['起点是 start + 1 而不是 start，否则会产出重复元素的组合。', 'k = 0 的空组合是一个合法结果（[[]]），不要返回空数组。'],
    solution: `def solve(data):
    n = int(data["n"])
    k = int(data["k"])
    results = []
    current = []

    def backtrack(start):
        if len(current) == k:
            results.append(current[:])
            return
        if n - start + 1 < k - len(current):
            return
        for value in range(start, n + 1):
            current.append(value)
            backtrack(value + 1)
            current.pop()

    backtrack(1)
    return results
`,
  },

  'subset-enumeration': {
    statement: '枚举 1..n 的全部子集：每个子集表示为升序的元素数组，按「先按元素个数升序、同个数按字典序」排列。用回溯按「是否包含当前元素」二叉分支亦可，但输出必须满足上述全序。',
    input: 'data 为 {"n": 非负整数}。',
    output: '返回子集的二维数组（按上述全序）；n = 0 返回 [[]]。',
    constraints: ['0 <= n <= 6'],
    examples: [
      example({ n: 3 }, [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]),
    ],
    tests: [
      example({ n: 0 }, [[]]),
      example({ n: 1 }, [[], [1]]),
      example({ n: 2 }, [[], [1], [2], [1, 2]]),
      example({ n: 4 }, [[], [1], [2], [3], [4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4], [1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4], [1, 2, 3, 4]]),
    ],
    insights: ['2^n 个子集按「个数优先、字典序其次」排序，就是组合生成结果按 k = 0..n 依次拼接——同一套回溯循环 k 即可。', '子集与组合的唯一区别是 k 遍历全部取值：理解了这一点，两者共享同一模板。'],
    pitfalls: ['空集是合法子集且排在最前，不要漏掉。', '同个数层内要字典序，用「起点递增」的回溯天然满足。'],
    solution: `def solve(data):
    n = int(data["n"])
    results = []
    for k in range(n + 1):
        current = []

        def backtrack(start):
            if len(current) == k:
                results.append(current[:])
                return
            for value in range(start, n + 1):
                current.append(value)
                backtrack(value + 1)
                current.pop()

        backtrack(1)
    return results
`,
  },

  'parentheses-generation': {
    statement: '生成 n 对括号的全部合法组合，按字典序排列。回溯时维护已用左括号数 open 与右括号数 close：open < n 可加 "("，close < open 可加 ")"。',
    input: 'data 为 {"n": 非负整数}。',
    output: '返回字符串数组；n = 0 返回 [""]。',
    constraints: ['0 <= n <= 6'],
    examples: [
      example({ n: 3 }, ["((()))", "(()())", "(())()", "()(())", "()()()"]),
    ],
    tests: [
      example({ n: 0 }, [""]),
      example({ n: 1 }, ["()"]),
      example({ n: 2 }, ["(())", "()()"]),
      example({ n: 4 }, ["(((())))", "((()()))", "((())())", "((()))()", "(()(()))", "(()()())", "(()())()", "(())(())", "(())()()", "()((()))", "()(()())", "()(())()", "()()(())", "()()()()"]),
    ],
    insights: ['合法前缀的不变量：任意前缀中 ")" 不多于 "("；在该不变量下先加 "(" 后加 ")" 的分支顺序恰好产出字典序。', '第 n 个卡特兰数 C(2n, n)/(n+1) 给出结果总数，n=6 时已上千——回溯每一步都合法，没有无效分支。'],
    pitfalls: ['n = 0 的空串是唯一结果，不要返回空数组。', 'close < open（而不是 close <= open）才允许加右括号，等号会让右括号跑在左括号前面。'],
    solution: `def solve(data):
    n = int(data["n"])
    results = []
    current = []

    def backtrack(open_count, close_count):
        if len(current) == 2 * n:
            results.append("".join(current))
            return
        if open_count < n:
            current.append("(")
            backtrack(open_count + 1, close_count)
            current.pop()
        if close_count < open_count:
            current.append(")")
            backtrack(open_count, close_count + 1)
            current.pop()

    backtrack(0, 0)
    return results
`,
  },
};
