const example = (input, output, explanation = '') => ({ input, output, explanation });

function sortProblem(name, solution) {
  return {
    statement: `给定一个整数数组，使用 ${name} 的核心过程返回升序结果。不能直接调用 sorted() 或 list.sort()。`,
    input: 'data 是长度为 n 的整数数组。',
    output: '返回一个新的升序数组，不修改调用方传入的数据。',
    constraints: ['0 <= n <= 200', '-10^6 <= data[i] <= 10^6'],
    examples: [example([5, 1, 4, 2, 8], [1, 2, 4, 5, 8], '比较或划分过程最终让所有元素进入正确次序。')],
    tests: [example([], []), example([3], [3]), example([5, -1, 5, 0, 2], [-1, 0, 2, 5, 5]), example([9, 8, 7, 6, 5], [5, 6, 7, 8, 9])],
    insights: ['先说清楚每一轮确定了哪一段有序区域。', '重复元素和已经有序的输入不能破坏区间收缩。'],
    pitfalls: ['直接调用语言内置排序会绕过本题要练习的状态变化。', '原地算法也要复制输入，避免修改判题数据。'],
    solution,
  };
}

function traversalProblem(order, body, expected) {
  return {
    statement: `给定按层序数组表示的二叉树，返回它的${order}遍历序列。null 表示缺失节点。`,
    input: 'data 是二叉树层序数组，例如 [8,4,12,2,6,10,14]。',
    output: `返回节点值的${order}遍历数组。`,
    constraints: ['0 <= 节点数 <= 127', '节点值互不要求相同'],
    examples: [example([8,4,12,2,6,10,14], expected)],
    tests: [example([], []), example([1], [1]), example([1,2,3,null,4], body === 'pre' ? [1,2,4,3] : body === 'in' ? [2,4,1,3] : body === 'post' ? [4,2,3,1] : [1,2,3,4])],
    insights: ['数组下标 i 的左右孩子分别是 2i+1 和 2i+2。', '遍历顺序只改变访问节点的时机，不改变递归边界。'],
    pitfalls: ['不能从 null 节点继续访问孩子。', '空树应返回空数组。'],
    solution: body === 'level' ? `from collections import deque

def solve(data):
    if not data or data[0] is None:
        return []
    result = []
    queue = deque([0])
    while queue:
        index = queue.popleft()
        if index >= len(data) or data[index] is None:
            continue
        result.append(data[index])
        queue.append(index * 2 + 1)
        queue.append(index * 2 + 2)
    return result
` : `def solve(data):
    result = []

    def visit(index):
        if index >= len(data) or data[index] is None:
            return
${body === 'pre' ? '        result.append(data[index])\n        visit(index * 2 + 1)\n        visit(index * 2 + 2)' : body === 'in' ? '        visit(index * 2 + 1)\n        result.append(data[index])\n        visit(index * 2 + 2)' : '        visit(index * 2 + 1)\n        visit(index * 2 + 2)\n        result.append(data[index])'}

    visit(0)
    return result
`,
  };
}

export const problemBatchA = {
  'linear-search': {
    statement: '给定整数数组和目标值，按从左到右的顺序寻找目标第一次出现的位置。',
    input: 'data 为 {"nums": [...], "target": int}。',
    output: '找到时返回最小下标，否则返回 -1。',
    constraints: ['0 <= len(nums) <= 10^4'],
    examples: [example({nums:[7,2,9,2],target:2}, 1)],
    tests: [example({nums:[],target:1},-1), example({nums:[4],target:4},0), example({nums:[1,3,5],target:2},-1)],
    insights: ['扫描到下标 i 时，0..i-1 已经被证明不等于目标。'],
    pitfalls: ['命中后继续扫描会错误返回最后一次出现位置。'],
    solution: `def solve(data):
    for index, value in enumerate(data["nums"]):
        if value == data["target"]:
            return index
    return -1
`,
  },
  'binary-search': {
    statement: '在非递减整数数组中寻找目标值，使用闭区间二分查找。',
    input: 'data 为 {"nums": sorted list[int], "target": int}。',
    output: '找到时返回任意一个目标下标，否则返回 -1。',
    constraints: ['数组已经按非递减顺序排列', '0 <= len(nums) <= 10^5'],
    examples: [example({nums:[1,3,5,7,9],target:7},3)],
    tests: [example({nums:[],target:2},-1), example({nums:[2],target:2},0), example({nums:[1,3,5],target:4},-1)],
    insights: ['每轮开始时，若目标存在，它一定仍在 [left,right] 中。'],
    pitfalls: ['循环条件和边界更新必须来自同一种区间定义。'],
    solution: `def solve(data):
    nums, target = data["nums"], data["target"]
    left, right = 0, len(nums) - 1
    while left <= right:
        middle = left + (right - left) // 2
        if nums[middle] == target:
            return middle
        if nums[middle] < target:
            left = middle + 1
        else:
            right = middle - 1
    return -1
`,
  },
  'binary-search-boundaries': {
    statement: '在非递减数组中求目标值的左边界和右边界。',
    input: 'data 为 {"nums": sorted list[int], "target": int}。',
    output: '返回 [first,last]；目标不存在时返回 [-1,-1]。',
    constraints: ['数组可以包含重复值'],
    examples: [example({nums:[1,2,2,2,4],target:2},[1,3])],
    tests: [example({nums:[],target:1},[-1,-1]), example({nums:[1,3,5],target:2},[-1,-1]), example({nums:[2,2],target:2},[0,1])],
    insights: ['lower_bound 找第一个不小于 target 的位置，upper_bound 找第一个大于 target 的位置。'],
    pitfalls: ['找到相等值就返回无法确定边界。'],
    solution: `def solve(data):
    nums, target = data["nums"], data["target"]

    def lower(value):
        left, right = 0, len(nums)
        while left < right:
            middle = (left + right) // 2
            if nums[middle] < value:
                left = middle + 1
            else:
                right = middle
        return left

    first = lower(target)
    if first == len(nums) or nums[first] != target:
        return [-1, -1]
    return [first, lower(target + 1) - 1]
`,
  },
  'insertion-sort': sortProblem('插入排序', `def solve(data):
    values = list(data)
    for index in range(1, len(values)):
        key = values[index]
        cursor = index - 1
        while cursor >= 0 and values[cursor] > key:
            values[cursor + 1] = values[cursor]
            cursor -= 1
        values[cursor + 1] = key
    return values
`),
  'bubble-sort': sortProblem('冒泡排序', `def solve(data):
    values = list(data)
    for end in range(len(values) - 1, 0, -1):
        changed = False
        for index in range(end):
            if values[index] > values[index + 1]:
                values[index], values[index + 1] = values[index + 1], values[index]
                changed = True
        if not changed:
            break
    return values
`),
  'selection-sort': sortProblem('选择排序', `def solve(data):
    values = list(data)
    for start in range(len(values)):
        minimum = start
        for index in range(start + 1, len(values)):
            if values[index] < values[minimum]:
                minimum = index
        values[start], values[minimum] = values[minimum], values[start]
    return values
`),
  'merge-sort': sortProblem('归并排序', `def solve(data):
    def merge_sort(values):
        if len(values) <= 1:
            return values
        middle = len(values) // 2
        left = merge_sort(values[:middle])
        right = merge_sort(values[middle:])
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i]); i += 1
            else:
                result.append(right[j]); j += 1
        return result + left[i:] + right[j:]
    return merge_sort(list(data))
`),
  'quick-sort': sortProblem('快速排序', `def solve(data):
    values = list(data)

    def quick(left, right):
        if left >= right:
            return
        pivot = values[(left + right) // 2]
        i, j = left, right
        while i <= j:
            while values[i] < pivot: i += 1
            while values[j] > pivot: j -= 1
            if i <= j:
                values[i], values[j] = values[j], values[i]
                i += 1; j -= 1
        quick(left, j)
        quick(i, right)

    quick(0, len(values) - 1)
    return values
`),
  'heap-sort': sortProblem('堆排序', `def solve(data):
    values = list(data)

    def sift(root, size):
        while root * 2 + 1 < size:
            child = root * 2 + 1
            if child + 1 < size and values[child] < values[child + 1]:
                child += 1
            if values[root] >= values[child]:
                return
            values[root], values[child] = values[child], values[root]
            root = child

    for root in range(len(values) // 2 - 1, -1, -1):
        sift(root, len(values))
    for end in range(len(values) - 1, 0, -1):
        values[0], values[end] = values[end], values[0]
        sift(0, end)
    return values
`),
  'counting-sort': sortProblem('计数排序', `def solve(data):
    if not data:
        return []
    low, high = min(data), max(data)
    counts = [0] * (high - low + 1)
    for value in data:
        counts[value - low] += 1
    result = []
    for offset, count in enumerate(counts):
        result.extend([offset + low] * count)
    return result
`),
  'prefix-sum': {
    statement: '预处理数组前缀和，回答多个闭区间 [left,right] 的元素和。',
    input: 'data 为 {"nums": [...], "queries": [[l,r], ...]}。', output: '按查询顺序返回区间和数组。',
    constraints: ['0 <= len(nums) <= 10^5', '0 <= l <= r < len(nums)'],
    examples: [example({nums:[3,1,4,1,5],queries:[[0,2],[2,4]]},[8,10])],
    tests: [example({nums:[7],queries:[[0,0]]},[7]), example({nums:[1,-1,2],queries:[[0,1],[0,2],[2,2]]},[0,2,2])],
    insights: ['prefix[i] 保存前 i 个元素的和，区间和等于 prefix[r+1]-prefix[l]。'], pitfalls: ['前缀数组多留一个 0 可以统一处理 left=0。'],
    solution: `def solve(data):
    prefix = [0]
    for value in data["nums"]:
        prefix.append(prefix[-1] + value)
    return [prefix[right + 1] - prefix[left] for left, right in data["queries"]]
`,
  },
  'difference-array': {
    statement: '初始数组全为 0，执行多次闭区间加法后返回最终数组。',
    input: 'data 为 {"length": n, "updates": [[l,r,delta], ...]}。', output: '返回全部更新后的长度 n 数组。',
    constraints: ['0 <= n <= 10^5'], examples: [example({length:5,updates:[[1,3,2],[2,4,1]]},[0,2,3,3,1])],
    tests: [example({length:0,updates:[]},[]), example({length:3,updates:[[0,2,-2]]},[-2,-2,-2])],
    insights: ['区间 [l,r] 加 delta 只需在差分边界 l 加、r+1 减。'], pitfalls: ['r+1 等于数组长度时不能越界写入。'],
    solution: `def solve(data):
    n = data["length"]
    diff = [0] * (n + 1)
    for left, right, delta in data["updates"]:
        diff[left] += delta
        if right + 1 < n:
            diff[right + 1] -= delta
    result, current = [], 0
    for index in range(n):
        current += diff[index]
        result.append(current)
    return result
`,
  },
  'sliding-window': {
    statement: '给定整数数组和窗口长度 k，求所有长度为 k 的连续子数组中的最大元素和。',
    input: 'data 为 {"nums": [...], "k": int}。', output: '返回最大窗口和；空数组或 k=0 时返回 0。',
    constraints: ['0 <= k <= len(nums)'], examples: [example({nums:[2,1,5,1,3,2],k:3},9)],
    tests: [example({nums:[],k:0},0), example({nums:[-5,-2,-3],k:2},-5), example({nums:[4,1],k:2},5)],
    insights: ['窗口右移时只减去离开的元素并加上进入的元素。'], pitfalls: ['全部为负数时不能把答案初始化为 0。'],
    solution: `def solve(data):
    nums, k = data["nums"], data["k"]
    if not nums or k == 0:
        return 0
    current = sum(nums[:k])
    best = current
    for right in range(k, len(nums)):
        current += nums[right] - nums[right - k]
        best = max(best, current)
    return best
`,
  },
  'two-pointers': {
    statement: '在非递减数组中寻找和为 target 的两个元素下标。',
    input: 'data 为 {"nums": sorted list[int], "target": int}。', output: '返回 [left,right]；不存在则返回 []。',
    constraints: ['同一元素不能使用两次'], examples: [example({nums:[1,2,4,6,10],target:8},[1,3])],
    tests: [example({nums:[1],target:2},[]), example({nums:[-3,0,3,7],target:4},[0,3]), example({nums:[1,2,3],target:10},[])],
    insights: ['和偏小时只能右移左指针，和偏大时只能左移右指针。'], pitfalls: ['输入无序时这个单调排除理由不成立。'],
    solution: `def solve(data):
    nums, target = data["nums"], data["target"]
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        if total < target:
            left += 1
        else:
            right -= 1
    return []
`,
  },
  'frequency-counting': {
    statement: '统计序列中每个值出现的次数，并按首次出现顺序返回键值对。',
    input: 'data 是由 JSON 基本值组成的数组。', output: '返回 [[value,count], ...]。', constraints: ['值为字符串或整数'],
    examples: [example(['a','b','a','c','b','a'],[['a',3],['b',2],['c',1]])], tests: [example([],[]),example([2,2,1],[[2,2],[1,1]])],
    insights: ['哈希表保存频次，单独记录第一次出现顺序。'], pitfalls: ['不能依赖不同运行时对字典顺序的隐含保证。'],
    solution: `def solve(data):
    counts, order = {}, []
    for value in data:
        if value not in counts:
            counts[value] = 0
            order.append(value)
        counts[value] += 1
    return [[value, counts[value]] for value in order]
`,
  },
  'array-operations': {
    statement: '在数组上依次执行 append、insert、set、delete 操作并返回最终结果。',
    input: 'data 为 {"values": [...], "operations": [[op,...], ...]}。', output: '返回操作后的数组。', constraints: ['所有操作下标均合法'],
    examples: [example({values:[1,2],operations:[['append',3],['insert',1,9],['delete',0]]},[9,2,3])],
    tests: [example({values:[],operations:[['append',5]]},[5]),example({values:[1,2],operations:[['set',1,7]]},[1,7])],
    insights: ['每个操作执行后，数组长度可能改变，后续下标针对新状态。'], pitfalls: ['删除后继续使用旧下标会产生错位。'],
    solution: `def solve(data):
    values = list(data["values"])
    for operation in data["operations"]:
        name = operation[0]
        if name == "append": values.append(operation[1])
        elif name == "insert": values.insert(operation[1], operation[2])
        elif name == "set": values[operation[1]] = operation[2]
        elif name == "delete": values.pop(operation[1])
    return values
`,
  },
  'matrix-traversal': {
    statement: '按 row、column 或 spiral 指定顺序遍历矩阵。',
    input: 'data 为 {"matrix": rectangular list[list], "order": "row"|"column"|"spiral"}。', output: '返回访问元素序列。',
    constraints: ['矩阵可以为空'], examples: [example({matrix:[[1,2,3],[4,5,6]],order:'spiral'},[1,2,3,6,5,4])],
    tests: [example({matrix:[],order:'row'},[]),example({matrix:[[1,2],[3,4]],order:'column'},[1,3,2,4])],
    insights: ['螺旋遍历每完成一条边就收缩相应边界。'], pitfalls: ['单行或单列时需要防止重复访问。'],
    solution: `def solve(data):
    matrix, order = data["matrix"], data["order"]
    if not matrix:
        return []
    rows, cols = len(matrix), len(matrix[0])
    if order == "row":
        return [matrix[r][c] for r in range(rows) for c in range(cols)]
    if order == "column":
        return [matrix[r][c] for c in range(cols) for r in range(rows)]
    result = []
    top, bottom, left, right = 0, rows - 1, 0, cols - 1
    while top <= bottom and left <= right:
        result.extend(matrix[top][left:right + 1]); top += 1
        for row in range(top, bottom + 1): result.append(matrix[row][right])
        right -= 1
        if top <= bottom:
            result.extend(reversed(matrix[bottom][left:right + 1])); bottom -= 1
        if left <= right:
            for row in range(bottom, top - 1, -1): result.append(matrix[row][left])
            left += 1
    return result
`,
  },
  'palindrome-check': {
    statement: '忽略非字母数字字符和大小写，判断字符串是否为回文。', input: 'data 是字符串。', output: '返回布尔值。', constraints: ['字符串长度 <= 10^5'],
    examples: [example('A man, a plan, a canal: Panama',true)], tests: [example('',true),example('race a car',false),example('0P',false)],
    insights: ['左右指针跳过无关字符，只比较规范化后的有效字符。'], pitfalls: ['Unicode/ASCII 字符分类要使用一致规则。'],
    solution: `def solve(data):
    left, right = 0, len(data) - 1
    while left < right:
        while left < right and not data[left].isalnum(): left += 1
        while left < right and not data[right].isalnum(): right -= 1
        if data[left].lower() != data[right].lower(): return False
        left += 1; right -= 1
    return True
`,
  },
  'anagram-check': {
    statement: '判断两个字符串是否互为字母异位词，比较时区分字符但忽略顺序。', input: 'data 为 {"a": str, "b": str}。', output: '返回布尔值。', constraints: ['字符串可为空'],
    examples: [example({a:'listen',b:'silent'},true)], tests: [example({a:'',b:''},true),example({a:'rat',b:'car'},false),example({a:'aab',b:'aba'},true)],
    insights: ['两个字符串的字符频次向量必须完全相同。'], pitfalls: ['只比较字符集合会漏掉重复次数。'],
    solution: `from collections import Counter

def solve(data):
    return Counter(data["a"]) == Counter(data["b"])
`,
  },
  'longest-common-prefix': {
    statement: '返回字符串数组的最长公共前缀。', input: 'data 是字符串数组。', output: '返回公共前缀字符串。', constraints: ['0 <= 字符串数量 <= 10^4'],
    examples: [example(['flower','flow','flight'],'fl')], tests: [example([],''),example(['alone'],'alone'),example(['dog','racecar','car'],'')],
    insights: ['候选前缀只会缩短，不会再次增长。'], pitfalls: ['空数组与空字符串都要单独成立。'],
    solution: `def solve(data):
    if not data:
        return ""
    prefix = data[0]
    for text in data[1:]:
        while not text.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix
`,
  },
  'parentheses-matching': {
    statement: '判断字符串中的圆括号、方括号和花括号是否正确嵌套。', input: 'data 是只包含括号字符的字符串。', output: '返回布尔值。', constraints: ['长度 <= 10^5'],
    examples: [example('([]{})',true)], tests: [example('',true),example('([)]',false),example('(((',false)],
    insights: ['栈顶始终是下一个右括号唯一允许匹配的左括号。'], pitfalls: ['遇到右括号时必须先检查栈是否为空。'],
    solution: `def solve(data):
    pairs = {')':'(', ']':'[', '}':'{'}
    stack = []
    for char in data:
        if char in '([{':
            stack.append(char)
        elif not stack or stack.pop() != pairs[char]:
            return False
    return not stack
`,
  },
  'naive-string-search': {
    statement: '使用朴素逐位置比较，在文本中寻找模式串第一次出现的位置。', input: 'data 为 {"text": str, "pattern": str}。', output: '返回下标；不存在时返回 -1。', constraints: ['空模式返回 0'],
    examples: [example({text:'abracadabra',pattern:'cada'},4)], tests: [example({text:'abc',pattern:''},0),example({text:'aaaa',pattern:'aa'},0),example({text:'abc',pattern:'d'},-1)],
    insights: ['每个起点只需要比较到首次不相等位置。'], pitfalls: ['最后一个合法起点是 n-m。'],
    solution: `def solve(data):
    text, pattern = data["text"], data["pattern"]
    for start in range(len(text) - len(pattern) + 1):
        if text[start:start + len(pattern)] == pattern:
            return start
    return -1
`,
  },
  'kmp-search': {
    statement: '使用 KMP 前缀函数寻找模式串第一次出现位置。', input: 'data 为 {"text": str, "pattern": str}。', output: '返回下标；不存在时返回 -1。', constraints: ['空模式返回 0'],
    examples: [example({text:'ababcabcacbab',pattern:'abcac'},5)], tests: [example({text:'abc',pattern:''},0),example({text:'aaaaa',pattern:'aaa'},0),example({text:'abc',pattern:'abd'},-1)],
    insights: ['失配后 j 回退到 pi[j-1]，已经匹配的可复用前缀无需重比。'], pitfalls: ['构建前缀表与文本匹配阶段使用同一回退规则。'],
    solution: `def solve(data):
    text, pattern = data["text"], data["pattern"]
    if not pattern:
        return 0
    prefix = [0] * len(pattern)
    j = 0
    for i in range(1, len(pattern)):
        while j and pattern[i] != pattern[j]: j = prefix[j - 1]
        if pattern[i] == pattern[j]: j += 1
        prefix[i] = j
    j = 0
    for i, char in enumerate(text):
        while j and char != pattern[j]: j = prefix[j - 1]
        if char == pattern[j]: j += 1
        if j == len(pattern): return i - j + 1
    return -1
`,
  },
  'fibonacci-memoization': {
    statement: '使用记忆化递归计算第 n 个斐波那契数，F(0)=0，F(1)=1。', input: 'data 是整数 n。', output: '返回 F(n)。', constraints: ['0 <= n <= 500'],
    examples: [example(10,55)], tests: [example(0,0),example(1,1),example(20,6765)],
    insights: ['每个 n 只真正展开一次，之后从缓存读取。'], pitfalls: ['递归缓存必须覆盖基本情况。'],
    solution: `def solve(data):
    cache = {0: 0, 1: 1}
    def fib(n):
        if n not in cache:
            cache[n] = fib(n - 1) + fib(n - 2)
        return cache[n]
    return fib(data)
`,
  },
  'climbing-stairs': {
    statement: '每次可以爬 1 或 2 级台阶，求到达第 n 级的不同方法数。', input: 'data 是非负整数 n。', output: '返回方法数；n=0 时返回 1。', constraints: ['0 <= n <= 500'],
    examples: [example(5,8)], tests: [example(0,1),example(1,1),example(2,2),example(10,89)],
    insights: ['到达 i 的最后一步来自 i-1 或 i-2。'], pitfalls: ['空路径使 n=0 有一种方案。'],
    solution: `def solve(data):
    previous, current = 1, 1
    for _ in range(data):
        previous, current = current, previous + current
    return previous
`,
  },
  'grid-path-dp': {
    statement: '在含障碍的网格中只能向右或向下移动，求左上到右下的路径数。1 表示障碍。', input: 'data 是 0/1 矩阵。', output: '返回路径数量。', constraints: ['空网格返回 0'],
    examples: [example([[0,0,0],[0,1,0],[0,0,0]],2)], tests: [example([],0),example([[0]],1),example([[1]],0),example([[0,1],[0,0]],1)],
    insights: ['dp[c] 在处理当前格前代表来自上方的方案，更新后代表当前格方案。'], pitfalls: ['起点或终点是障碍时答案为 0。'],
    solution: `def solve(data):
    if not data or not data[0] or data[0][0] == 1:
        return 0
    dp = [0] * len(data[0])
    dp[0] = 1
    for row in data:
        for column, blocked in enumerate(row):
            if blocked:
                dp[column] = 0
            elif column:
                dp[column] += dp[column - 1]
    return dp[-1]
`,
  },
  'stack': {
    statement: '模拟栈的 push、pop、top 操作并返回所有产生的查询结果。', input: 'data 是操作数组，例如 [["push",1],["top"],["pop"]]。', output: '返回 top/pop 的结果数组。', constraints: ['不会对空栈 pop 或 top'],
    examples: [example([['push',1],['push',2],['top'],['pop'],['top']],[2,2,1])], tests: [example([],[]),example([['push','x'],['pop']],['x'])],
    insights: ['所有操作只接触列表尾部。'], pitfalls: ['pop 既删除又返回元素。'],
    solution: `def solve(data):
    stack, output = [], []
    for operation in data:
        if operation[0] == "push": stack.append(operation[1])
        elif operation[0] == "pop": output.append(stack.pop())
        else: output.append(stack[-1])
    return output
`,
  },
  'queue': {
    statement: '模拟队列的 enqueue、dequeue、front 操作并返回查询结果。', input: 'data 是操作数组。', output: '返回 dequeue/front 的结果数组。', constraints: ['不会查询空队列'],
    examples: [example([['enqueue',1],['enqueue',2],['front'],['dequeue'],['front']],[1,1,2])], tests: [example([],[]),example([['enqueue','x'],['dequeue']],['x'])],
    insights: ['deque 能让队首删除保持 O(1)。'], pitfalls: ['使用 list.pop(0) 会导致每次搬移剩余元素。'],
    solution: `from collections import deque

def solve(data):
    queue, output = deque(), []
    for operation in data:
        if operation[0] == "enqueue": queue.append(operation[1])
        elif operation[0] == "dequeue": output.append(queue.popleft())
        else: output.append(queue[0])
    return output
`,
  },
  'deque': {
    statement: '模拟双端队列两端的 push/pop 操作。', input: 'data 是 push_left、push_right、pop_left、pop_right 操作数组。', output: '返回所有 pop 结果。', constraints: ['不会从空队列弹出'],
    examples: [example([['push_left',2],['push_right',3],['push_left',1],['pop_right'],['pop_left']],[3,1])], tests: [example([],[]),example([['push_right',5],['pop_left']],[5])],
    insights: ['双端队列在两个端点都维持 O(1) 更新。'], pitfalls: ['区分操作方向与返回方向。'],
    solution: `from collections import deque

def solve(data):
    values, output = deque(), []
    for operation in data:
        name = operation[0]
        if name == "push_left": values.appendleft(operation[1])
        elif name == "push_right": values.append(operation[1])
        elif name == "pop_left": output.append(values.popleft())
        else: output.append(values.pop())
    return output
`,
  },
  'static-array': {
    statement: '在固定长度数组上执行 read 和 set 操作，禁止改变长度。', input: 'data 为 {"values": [...], "operations": [[op,index,value?],...]}。', output: '返回 read 结果和最终数组。', constraints: ['下标均合法'],
    examples: [example({values:[1,2,3],operations:[['read',1],['set',1,9],['read',1]]},{reads:[2,9],values:[1,9,3]})], tests: [example({values:[],operations:[]},{reads:[],values:[]})],
    insights: ['固定容量意味着只能覆盖已有槽位。'], pitfalls: ['set 不得追加新元素。'],
    solution: `def solve(data):
    values, reads = list(data["values"]), []
    for operation in data["operations"]:
        if operation[0] == "read": reads.append(values[operation[1]])
        else: values[operation[1]] = operation[2]
    return {"reads": reads, "values": values}
`,
  },
  'dynamic-array': {
    statement: '模拟动态数组追加时的容量翻倍，返回最终元素、容量和搬移次数。', input: 'data 为 {"initial_capacity": int, "values": [...]}。', output: '返回 {"values", "capacity", "moves"}。', constraints: ['初始容量 >= 1'],
    examples: [example({initial_capacity:2,values:[1,2,3,4,5]},{values:[1,2,3,4,5],capacity:8,moves:6})], tests: [example({initial_capacity:1,values:[]},{values:[],capacity:1,moves:0}),example({initial_capacity:4,values:[1,2]},{values:[1,2],capacity:4,moves:0})],
    insights: ['扩容时搬移当前长度个元素，总搬移次数形成几何级数。'], pitfalls: ['扩容发生在写入新元素之前。'],
    solution: `def solve(data):
    capacity, values, moves = data["initial_capacity"], [], 0
    for value in data["values"]:
        if len(values) == capacity:
            moves += len(values)
            capacity *= 2
        values.append(value)
    return {"values": values, "capacity": capacity, "moves": moves}
`,
  },
  'matrix-2d-array': {
    statement: '执行二维矩阵的 read 和 set 操作。', input: 'data 为 {"matrix": [...], "operations": [[op,row,col,value?],...]}。', output: '返回读取结果和最终矩阵。', constraints: ['矩阵为矩形且下标合法'],
    examples: [example({matrix:[[1,2],[3,4]],operations:[['read',1,0],['set',0,1,9]]},{reads:[3],matrix:[[1,9],[3,4]]})], tests: [example({matrix:[[1]],operations:[['read',0,0]]},{reads:[1],matrix:[[1]]})],
    insights: ['复制每一行才能避免修改调用方的嵌套列表。'], pitfalls: ['只复制外层列表仍会共享内部行。'],
    solution: `def solve(data):
    matrix = [row[:] for row in data["matrix"]]
    reads = []
    for operation in data["operations"]:
        if operation[0] == "read": reads.append(matrix[operation[1]][operation[2]])
        else: matrix[operation[1]][operation[2]] = operation[3]
    return {"reads": reads, "matrix": matrix}
`,
  },
  'linked-list': {
    statement: '构造单链表，依次执行 prepend、append、delete_first，返回最终值序列。', input: 'data 为 {"values": [...], "operations": [...]}。', output: '返回链表从头到尾的值。', constraints: ['delete_first 删除首次匹配，不存在时不操作'],
    examples: [example({values:[1,2],operations:[['prepend',0],['append',3],['delete_first',2]]},[0,1,3])], tests: [example({values:[],operations:[['append',1]]},[1])],
    insights: ['虚拟头节点可以统一删除头节点和中间节点。'], pitfalls: ['删除后必须让前驱直接指向后继。'],
    solution: `class Node:
    def __init__(self, value, next_node=None):
        self.value, self.next = value, next_node

def solve(data):
    dummy = Node(None)
    tail = dummy
    for value in data["values"]:
        tail.next = Node(value); tail = tail.next
    for operation in data["operations"]:
        name, value = operation
        if name == "prepend": dummy.next = Node(value, dummy.next)
        elif name == "append":
            cursor = dummy
            while cursor.next: cursor = cursor.next
            cursor.next = Node(value)
        else:
            cursor = dummy
            while cursor.next and cursor.next.value != value: cursor = cursor.next
            if cursor.next: cursor.next = cursor.next.next
    result, cursor = [], dummy.next
    while cursor: result.append(cursor.value); cursor = cursor.next
    return result
`,
  },
  'circular-buffer': {
    statement: '在固定容量循环缓冲区上执行 push 和 pop；满时 push 覆盖最旧元素。', input: 'data 为 {"capacity": int, "operations": [[op,value?],...]}。', output: '返回 pop 结果和最终队列。', constraints: ['capacity >= 1'],
    examples: [example({capacity:3,operations:[['push',1],['push',2],['push',3],['push',4],['pop']]},{popped:[2],values:[3,4]})], tests: [example({capacity:1,operations:[['push',7]]},{popped:[],values:[7]})],
    insights: ['head 指向最旧元素，长度达到容量时覆盖后同步移动 head。'], pitfalls: ['物理下标需要对容量取模。'],
    solution: `def solve(data):
    capacity = data["capacity"]
    buffer = [None] * capacity
    head = size = 0
    popped = []
    for operation in data["operations"]:
        if operation[0] == "push":
            index = (head + size) % capacity
            buffer[index] = operation[1]
            if size == capacity: head = (head + 1) % capacity
            else: size += 1
        elif size:
            popped.append(buffer[head]); head = (head + 1) % capacity; size -= 1
    values = [buffer[(head + i) % capacity] for i in range(size)]
    return {"popped": popped, "values": values}
`,
  },
  'union-find': {
    statement: '处理无向集合的 union 和 connected 操作。', input: 'data 为 {"n": int, "operations": [[op,a,b],...]}。', output: '返回所有 connected 查询结果。', constraints: ['0 <= a,b < n'],
    examples: [example({n:5,operations:[['union',0,1],['union',1,2],['connected',0,2],['connected',0,4]]},[true,false])], tests: [example({n:1,operations:[['connected',0,0]]},[true])],
    insights: ['路径压缩缩短查找链，按大小合并避免树高快速增长。'], pitfalls: ['connected 必须比较根而不是直接父节点。'],
    solution: `def solve(data):
    parent = list(range(data["n"]))
    size = [1] * data["n"]
    def find(node):
        while node != parent[node]:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node
    output = []
    for name, a, b in data["operations"]:
        ra, rb = find(a), find(b)
        if name == "connected": output.append(ra == rb)
        elif ra != rb:
            if size[ra] < size[rb]: ra, rb = rb, ra
            parent[rb] = ra; size[ra] += size[rb]
    return output
`,
  },
  'heap-priority-queue': {
    statement: '模拟最小优先队列的 push、peek、pop 操作。', input: 'data 是操作数组。', output: '返回 peek/pop 的结果。', constraints: ['不会查询空堆'],
    examples: [example([['push',5],['push',2],['peek'],['push',1],['pop'],['pop']],[2,1,2])], tests: [example([['push',3],['pop']],[3])],
    insights: ['堆只保证父节点不大于孩子，不保证整体有序。'], pitfalls: ['peek 不删除堆顶。'],
    solution: `import heapq

def solve(data):
    heap, output = [], []
    for operation in data:
        if operation[0] == "push": heapq.heappush(heap, operation[1])
        elif operation[0] == "pop": output.append(heapq.heappop(heap))
        else: output.append(heap[0])
    return output
`,
  },
  'hash-table': {
    statement: '实现键值表的 put、get、remove 操作并返回查询结果。', input: 'data 是操作数组。', output: '返回 get 的值；键不存在返回 null。', constraints: ['键为字符串'],
    examples: [example([['put','a',1],['put','b',2],['get','a'],['remove','a'],['get','a']],[1,null])], tests: [example([],[]),example([['put','x',1],['put','x',2],['get','x']],[2])],
    insights: ['相同键再次 put 应覆盖原值。'], pitfalls: ['remove 不存在的键不应报错。'],
    solution: `def solve(data):
    table, output = {}, []
    for operation in data:
        if operation[0] == "put": table[operation[1]] = operation[2]
        elif operation[0] == "remove": table.pop(operation[1], None)
        else: output.append(table.get(operation[1]))
    return output
`,
  },
  'set-map-adt': {
    statement: '对集合执行 add、remove、contains，并返回 contains 结果与最终升序元素。', input: 'data 是操作数组。', output: '返回 {"queries": [...], "values": [...]}。', constraints: ['元素为整数'],
    examples: [example([['add',3],['add',1],['contains',3],['remove',3],['contains',3]],{queries:[true,false],values:[1]})], tests: [example([],{queries:[],values:[]})],
    insights: ['集合只表达成员关系，不保存重复次数。'], pitfalls: ['重复 add 不应产生多个元素。'],
    solution: `def solve(data):
    values, queries = set(), []
    for operation in data:
        if operation[0] == "add": values.add(operation[1])
        elif operation[0] == "remove": values.discard(operation[1])
        else: queries.append(operation[1] in values)
    return {"queries": queries, "values": sorted(values)}
`,
  },
  'graph-representations': {
    statement: '把边列表转换为按节点名称排序的邻接表。', input: 'data 为 {"edges": [[u,v],...], "directed": bool}。', output: '返回 {node:[neighbors...]}，邻居排序且去重。', constraints: ['节点为字符串'],
    examples: [example({edges:[['A','B'],['A','C'],['B','C']],directed:false},{A:['B','C'],B:['A','C'],C:['A','B']})], tests: [example({edges:[],directed:true},{}),example({edges:[['A','B']],directed:true},{A:['B'],B:[]})],
    insights: ['无向边需要写入两个方向，有向边只写一次。'], pitfalls: ['没有出边的终点也必须出现在邻接表中。'],
    solution: `def solve(data):
    graph = {}
    for start, end in data["edges"]:
        graph.setdefault(start, set()).add(end)
        graph.setdefault(end, set())
        if not data["directed"]: graph[end].add(start)
    return {node: sorted(graph[node]) for node in sorted(graph)}
`,
  },
  'bfs': {
    statement: '从起点开始对无向图执行广度优先搜索，返回访问顺序。邻居按字典序入队。', input: 'data 为 {"edges": [[u,v],...], "start": node}。', output: '返回 BFS 顺序。', constraints: ['起点可能是孤立节点'],
    examples: [example({edges:[['A','B'],['A','C'],['B','D']],start:'A'},['A','B','C','D'])], tests: [example({edges:[],start:'X'},['X']),example({edges:[['A','B'],['C','D']],start:'C'},['C','D'])],
    insights: ['入队时立即标记访问，保证每个节点只入队一次。'], pitfalls: ['出队时才标记会让同一节点重复入队。'],
    solution: `from collections import deque

def solve(data):
    graph = {}
    for a, b in data["edges"]:
        graph.setdefault(a, []).append(b); graph.setdefault(b, []).append(a)
    queue, seen, order = deque([data["start"]]), {data["start"]}, []
    while queue:
        node = queue.popleft(); order.append(node)
        for neighbor in sorted(graph.get(node, [])):
            if neighbor not in seen:
                seen.add(neighbor); queue.append(neighbor)
    return order
`,
  },
  'dfs': {
    statement: '从起点开始对无向图执行递归深度优先搜索，邻居按字典序访问。', input: 'data 为 {"edges": [[u,v],...], "start": node}。', output: '返回 DFS 先序。', constraints: ['节点数量 <= 1000'],
    examples: [example({edges:[['A','B'],['A','C'],['B','D']],start:'A'},['A','B','D','C'])], tests: [example({edges:[],start:'X'},['X']),example({edges:[['A','B'],['C','D']],start:'C'},['C','D'])],
    insights: ['进入节点时标记访问，然后完整处理一个邻居子树。'], pitfalls: ['无向图必须使用 visited 阻止沿父边返回。'],
    solution: `def solve(data):
    graph = {}
    for a, b in data["edges"]:
        graph.setdefault(a, []).append(b); graph.setdefault(b, []).append(a)
    seen, order = set(), []
    def visit(node):
        seen.add(node); order.append(node)
        for neighbor in sorted(graph.get(node, [])):
            if neighbor not in seen: visit(neighbor)
    visit(data["start"])
    return order
`,
  },
  'connected-components': {
    statement: '统计无向图的连通分量，并返回每个分量的升序节点数组，分量按首节点排序。', input: 'data 为 {"nodes": [...], "edges": [[u,v],...]}。', output: '返回二维数组。', constraints: ['nodes 包含孤立点'],
    examples: [example({nodes:['A','B','C','D'],edges:[['A','B'],['C','D']]},[['A','B'],['C','D']])], tests: [example({nodes:[],edges:[]},[]),example({nodes:['A'],edges:[]},[['A']])],
    insights: ['每次从未访问节点启动一次搜索就得到一个完整分量。'], pitfalls: ['不能遗漏没有边的孤立节点。'],
    solution: `def solve(data):
    graph = {node: [] for node in data["nodes"]}
    for a, b in data["edges"]:
        graph[a].append(b); graph[b].append(a)
    seen, components = set(), []
    for start in sorted(data["nodes"]):
        if start in seen: continue
        stack, component = [start], []
        seen.add(start)
        while stack:
            node = stack.pop(); component.append(node)
            for neighbor in graph[node]:
                if neighbor not in seen: seen.add(neighbor); stack.append(neighbor)
        components.append(sorted(component))
    return components
`,
  },
  'flood-fill': {
    statement: '从指定格子开始，把四方向连通且颜色相同的区域替换成新颜色。', input: 'data 为 {"image": matrix, "row": int, "col": int, "color": int}。', output: '返回填充后的新矩阵。', constraints: ['起点下标合法'],
    examples: [example({image:[[1,1,0],[1,0,0],[1,1,0]],row:0,col:0,color:2},[[2,2,0],[2,0,0],[2,2,0]])], tests: [example({image:[[0]],row:0,col:0,color:0},[[0]])],
    insights: ['队列中只放原颜色且尚未替换的格子，替换本身就是访问标记。'], pitfalls: ['新旧颜色相同时应立即返回，避免无限重复。'],
    solution: `from collections import deque

def solve(data):
    image = [row[:] for row in data["image"]]
    r0, c0, new = data["row"], data["col"], data["color"]
    old = image[r0][c0]
    if old == new: return image
    queue = deque([(r0, c0)]); image[r0][c0] = new
    while queue:
        row, col = queue.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = row + dr, col + dc
            if 0 <= nr < len(image) and 0 <= nc < len(image[0]) and image[nr][nc] == old:
                image[nr][nc] = new; queue.append((nr, nc))
    return image
`,
  },
  'topological-sort': {
    statement: '对有向无环图执行 Kahn 拓扑排序；有环时返回空数组。', input: 'data 为 {"nodes": [...], "edges": [[u,v],...]}。', output: '返回拓扑序，多个零入度点按字典序选择。', constraints: ['节点名称为字符串'],
    examples: [example({nodes:['A','B','C'],edges:[['A','B'],['A','C']]},['A','B','C'])], tests: [example({nodes:['A','B'],edges:[['A','B'],['B','A']]},[]),example({nodes:['A'],edges:[]},['A'])],
    insights: ['队列中始终是所有前驱已经完成的节点。'], pitfalls: ['输出数量小于节点数说明存在环。'],
    solution: `import heapq

def solve(data):
    graph = {node: [] for node in data["nodes"]}
    indegree = {node: 0 for node in data["nodes"]}
    for start, end in data["edges"]:
        graph[start].append(end); indegree[end] += 1
    heap = [node for node in data["nodes"] if indegree[node] == 0]
    heapq.heapify(heap); order = []
    while heap:
        node = heapq.heappop(heap); order.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0: heapq.heappush(heap, neighbor)
    return order if len(order) == len(data["nodes"]) else []
`,
  },
  'binary-tree-basics': {
    statement: '给定二叉树层序数组，统计有效节点数、叶子数和树高。null 表示缺失节点。',
    input: 'data 是层序数组。', output: '返回 {"nodes": n, "leaves": l, "height": h}，空树高度为 0。', constraints: ['节点下标沿用完全二叉树布局'],
    examples: [example([8,4,12,2,6,null,14],{nodes:6,leaves:3,height:3})], tests: [example([],{nodes:0,leaves:0,height:0}),example([1],{nodes:1,leaves:1,height:1})],
    insights: ['只有值非 null 且从根可达的下标才属于树。'], pitfalls: ['数组尾部的值若父节点为 null，不应被视为可达节点。'],
    solution: `def solve(data):
    if not data or data[0] is None:
        return {"nodes": 0, "leaves": 0, "height": 0}
    stack = [(0, 1)]
    nodes = leaves = height = 0
    while stack:
        index, depth = stack.pop()
        if index >= len(data) or data[index] is None:
            continue
        nodes += 1
        height = max(height, depth)
        left, right = index * 2 + 1, index * 2 + 2
        has_left = left < len(data) and data[left] is not None
        has_right = right < len(data) and data[right] is not None
        if not has_left and not has_right:
            leaves += 1
        if has_left: stack.append((left, depth + 1))
        if has_right: stack.append((right, depth + 1))
    return {"nodes": nodes, "leaves": leaves, "height": height}
`,
  },
  'tree-properties': {
    statement: '判断层序数组表示的二叉树是否高度平衡，并返回高度。', input: 'data 是层序数组，null 表示缺失节点。', output: '返回 {"height": h, "balanced": bool}。', constraints: ['空树平衡且高度为 0'],
    examples: [example([3,9,20,null,null,15,7],{height:3,balanced:true})], tests: [example([],{height:0,balanced:true}),example([1,2,null,3],{height:3,balanced:false})],
    insights: ['后序计算子树高度，遇到高度差大于 1 时向上返回失败标记。'], pitfalls: ['只比较根的左右高度无法发现更深层失衡。'],
    solution: `def solve(data):
    def inspect(index):
        if index >= len(data) or data[index] is None:
            return 0, True
        left_height, left_ok = inspect(index * 2 + 1)
        right_height, right_ok = inspect(index * 2 + 2)
        current = max(left_height, right_height) + 1
        return current, left_ok and right_ok and abs(left_height - right_height) <= 1
    height, balanced = inspect(0)
    return {"height": height, "balanced": balanced}
`,
  },
  'preorder-traversal': traversalProblem('前序', 'pre', [8,4,2,6,12,10,14]),
  'inorder-traversal': traversalProblem('中序', 'in', [2,4,6,8,10,12,14]),
  'postorder-traversal': traversalProblem('后序', 'post', [2,6,4,10,14,12,8]),
  'level-order-traversal': traversalProblem('层序', 'level', [8,4,12,2,6,10,14]),
};
