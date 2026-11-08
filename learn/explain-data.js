/* 结构化讲解页数据：每个主题给出「先想暴力解」与一个具体输入的逐步推演。
 * 由 scripts/merge-explain-data.mjs 合并生成（learn/explain-batches/ 为中间产物，合并后删除）。
 * 纯数据文件，无依赖，挂载到 window.LEARNING_EXPLAIN 供讲解页读取。 */
window.LEARNING_EXPLAIN = {
 "topics": {
  "insertion-sort": {
   "brute": "先想暴力解：每轮把未排序区间整个扫一遍，找出最小值与区间起点交换（选择式思路），n 轮共 O(n²) 次比较，且无论数据多有序都省不掉这些扫描。关键观察：反过来维护一个已排好序的前缀，新元素只需向前比较，把比它大的元素逐个右移一格，最后把暂存的键值放进空出的位置；输入几乎有序时每轮几乎不移动，最好可达 O(n)，且相等元素不会被跨越，排序是稳定的。",
   "bruteCode": "def brute(nums):\n    values = list(nums)\n    for start in range(len(values)):\n        smallest = start\n        for index in range(start + 1, len(values)):\n            if values[index] < values[smallest]:\n                smallest = index\n        values[start], values[smallest] = values[smallest], values[start]\n    return values",
   "walkthrough": {
    "input": "values = [5, 2, 4, 3, 1]，按升序插入排序",
    "steps": [
     "index=1 暂存 key=2：5>2 右移一格腾出位置，key 插到下标 0，得 [2, 5, 4, 3, 1]，前缀 [2, 5] 有序。",
     "index=2 暂存 key=4：5>4 右移一格，2≤4 停住，key 落在下标 1，得 [2, 4, 5, 3, 1]，前 3 个有序。",
     "index=3 暂存 key=3：5、4 依次右移两格，2≤3 停住，key 插到下标 1，得 [2, 3, 4, 5, 1]。",
     "index=4 暂存 key=1：5、4、3、2 全部右移，cursor 一路退到 -1，key 插到下标 0，得 [1, 2, 3, 4, 5]。",
     "整个过程中前缀始终有序；选择式暴力每轮必须扫完整个未排序区间，插入排序却能做到几乎有序就几乎不移动——本例第 2、3 步各只移动 1~2 格。"
    ]
   }
  },
  "difference-array": {
   "brute": "先想暴力解：每来一个区间更新 [l, r] 加 delta，就遍历区间内每个下标逐个加，单次更新 O(r-l+1)，m 个长区间合计 O(mL)，更新一多就撑不住。关键观察：区间加 delta 只改变「从 l 开始累计值抬升、到 r+1 恢复」两件事——在差分数组的两个边界落笔 diff[l]+=delta、diff[r+1]-=delta，单次更新 O(1)；全部更新做完后，一次从左到右的前缀累加就能恢复整个数组。",
   "bruteCode": "def brute(length, updates):\n    values = [0] * length\n    for left, right, delta in updates:\n        for index in range(left, right + 1):\n            values[index] += delta\n    return values",
   "walkthrough": {
    "input": "length = 6，初始数组全 0，更新依次为 [1, 3, +2]、[2, 5, -1]、[0, 0, +4]",
    "steps": [
     "建长度 7 的 diff（末位给停止标记留位），初始全 0。更新 [1,3,+2]：diff[1]+=2、diff[4]-=2，两次落笔替代区间内 3 个位置逐个加。",
     "更新 [2,5,-1]：diff[2]-=1；右边界 r+1=6 越过末尾，无需回补——这正是闭区间打到末尾时的特殊情形。",
     "更新 [0,0,+4]：diff[0]+=4、diff[1]-=4。三次更新累计只写 5 次边界，diff = [4, -2, -1, 0, -2, 0, 0]。",
     "前缀累加恢复：i=0 得 4，i=1 得 4-2=2，i=2 得 1，i=3 得 1，i=4 越过 -2 边界得 -1，i=5 保持 -1，结果 [4, 2, 1, 1, -1, -1]。",
     "逐元素暴力共要写 3+4+1=8 个位置；差分只写 5 次，更新再多也保持每次 O(1)，恢复一步 O(n)。"
    ]
   }
  },
  "heap-sort": {
   "brute": "先想暴力解：不用堆，每轮线性扫描未排序段找出最大值换到段末尾（选择式），每轮 O(n)、共 n 轮，总 O(n²)，而且每轮扫描的信息下一轮完全不复用。关键观察：把数组先组织成最大堆，当前最大值恒在堆顶；取走堆顶后只需把末元素补上并向下调整 O(log n) 即可恢复堆序；建堆自底向上每个非叶节点各下沉一次，总共只要 O(n)，排序整体降到 O(n log n)。",
   "bruteCode": "def brute(nums):\n    values = list(nums)\n    for end in range(len(values) - 1, 0, -1):\n        biggest = 0\n        for index in range(1, end + 1):\n            if values[index] > values[biggest]:\n                biggest = index\n        values[biggest], values[end] = values[end], values[biggest]\n    return values",
   "walkthrough": {
    "input": "values = [3, 7, 1, 8, 2]，用最大堆升序排序",
    "steps": [
     "自底向上建堆：先调下标 1（值 7），它小于孩子 8，交换得 [3, 8, 1, 7, 2]；再调下标 0（值 3），先后与 8、7 交换下沉两格，得到最大堆 [8, 7, 1, 3, 2]。",
     "第 1 次提取：堆顶 8 是全局最大，与末尾 values[4]=2 交换，8 归位；新堆顶 2 沿孩子 7 下沉、再与 3 交换，得 [7, 3, 1, 2 | 8]。",
     "第 2 次提取：堆顶 7 与下标 3 的 2 交换归位，2 下沉一格与 3 换位，得 [3, 2, 1 | 7, 8]。",
     "第 3、4 次提取：3 与 1 交换归位后得 [2, 1 | 3, 7, 8]；最后 2 与 1 交换，得 [1, 2, 3, 7, 8]，有序后缀从右往左逐轮增长。",
     "每次提取只做 O(log n) 下沉、建堆一次 O(n)；选择式暴力每轮都要重新扫整段找最大值，n 轮是 O(n²)，n 大时差距是数量级的。"
    ]
   }
  },
  "binary-search": {
   "brute": "先想暴力解：从左到右逐个比对，nums[i] 等于 target 就返回下标，扫完没找到返回 -1。它完全没有利用有序性，n 个元素最坏要比 n 次，时间 O(n)。关键观察是：数组有序，所以在中点比一次，就能确定目标在哪一半，直接排除一半候选。",
   "bruteCode": "def brute(nums, target):\n    for i, x in enumerate(nums):\n        if x == target:\n            return i\n    return -1",
   "walkthrough": {
    "input": "nums = [1, 3, 5, 7, 9]，target = 7，数组已升序",
    "steps": [
     "初始 lo=0，hi=4，候选区间 [0,4] 共 5 个元素。取中点 mid=(0+4)/2=2，nums[2]=5。",
     "5 < 7，说明目标只可能在右半边，令 lo=mid+1=3，区间缩到 [3,4]。这一次比较排除了 3 个元素。",
     "区间 [3,4] 的中点 mid=(3+4)/2=3，nums[3]=7，正好等于 target，命中。",
     "总共只做了 2 次比较。线性扫描要到第 4 个元素才能命中；n 越大，二分「每次砍一半」的优势越明显，O(n) 对 O(log n)。"
    ]
   }
  },
  "merge-sort": {
   "brute": "先想暴力解：相邻元素两两比较、逆序就交换，把最大值一步步冒到末尾，O(n^2)。关键观察是：把两个已排序的数组合并成一个，只需双指针各扫一遍，O(n) 就够。于是自顶向下对半分、自底向上逐层合并，总代价 O(n log n)，而且相等元素不会跨越彼此，排序是稳定的。",
   "walkthrough": {
    "input": "nums = [5, 1, 4, 2]",
    "steps": [
     "分：[5, 1, 4, 2] 拆成 [5, 1] 与 [4, 2]。",
     "继续拆：[5, 1] 拆成 [5] 与 [1]，[4, 2] 拆成 [4] 与 [2]。单元素天然有序。",
     "合并 [5] 与 [1]：比较 5 和 1，先取 1 再取 5，得 [1, 5]。同理合并 [4] 与 [2] 得 [2, 4]。",
     "合并 [1, 5] 与 [2, 4]：1<2 取 1；2<5 取 2；5>4 取 4；右半耗尽，左半剩下的 5 直接接到末尾，得 [1, 2, 4, 5]。",
     "每层合并的总搬运量是 O(n)，共 log n 层，O(n log n)。合并时相等先取左半，所以 [3a, 3b] 的相对顺序不会被打乱。"
    ]
   }
  },
  "sliding-window": {
   "brute": "先想暴力解：求最长无重复字符子串，就枚举每个起点 i，从 i 向右逐字符扩展到第一个重复字符为止，记录最长长度。同一段子串会被反复扫描，时间 O(n^2)。关键观察是：右端前进时窗口的重复信息可以增量维护，而左端遇到重复后只需收缩、永不回退，两边界都单调前进，整体 O(n)。",
   "bruteCode": "def brute(s):\n    best = 0\n    for i in range(len(s)):\n        seen = set()\n        for j in range(i, len(s)):\n            if s[j] in seen:\n                break\n            seen.add(s[j])\n        best = max(best, len(seen))\n    return best",
   "walkthrough": {
    "input": "s = \"abca\"，求最长无重复字符的连续子串",
    "steps": [
     "右端 r=0 加入 s[0]='a'，窗口 [0,0] 为 \"a\"，无重复，当前最长记 1。",
     "r=1 加入 'b'，窗口 \"ab\"，无重复，最长更新为 2。",
     "r=2 加入 'c'，窗口 \"abc\"，无重复，最长更新为 3。",
     "r=3 加入 'a' 时发现窗口内已有 'a'，左端开始收缩：移出 s[0]='a' 后 l=1，窗口变为 \"bca\"，重复消除。",
     "扫描结束，答案是 \"abc\"，长度 3。右端走了 n 步、左端累计也只前进 n 步，所以是 O(n) 而不是 O(n^2)。"
    ]
   }
  },
  "radix-sort": {
   "brute": "先想暴力解：套用两两比较的排序，受信息论下界约束至少要 Ω(n log n) 次比较，重复值再多也得逐对比出顺序。关键观察：输入全是非负整数时可以完全绕开比较——按数位从低位到高位逐轮处理，每轮按「当前数位」把元素稳定分进 0~9 十个桶、再按桶序收回；只要每轮分桶是稳定的，低位的排序结果在高位排序时不会被打乱，d 轮后整体有序，时间 O(d(n+k))。",
   "bruteCode": "def brute(nums):\n    values = list(nums)\n    for index in range(1, len(values)):\n        key = values[index]\n        cursor = index - 1\n        while cursor >= 0 and values[cursor] > key:\n            values[cursor + 1] = values[cursor]\n            cursor -= 1\n        values[cursor + 1] = key\n    return values",
   "walkthrough": {
    "input": "values = [170, 45, 75, 90, 802, 24, 2, 66]，最大值 802 共 3 位，做 3 轮分桶",
    "steps": [
     "第 1 轮按个位分桶：170、90 进桶 0，802、2 进桶 2，24 进桶 4，45、75 进桶 5，66 进桶 6；按桶序收回得 [170, 90, 802, 2, 24, 45, 75, 66]，个位已升序。",
     "第 2 轮按十位分桶：802、2 进桶 0，24 进桶 2，45 进桶 4，66 进桶 6，170、75 进桶 7，90 进桶 9；收回得 [802, 2, 24, 45, 66, 170, 75, 90]。",
     "稳定性在第 2 轮发挥作用：170 和 75 的十位都是 7，收回时保持上一轮的相对顺序（170 在 75 前），个位信息没有丢。",
     "第 3 轮按百位分桶：2、24、45、66、75、90 进桶 0，170 进桶 1，802 进桶 8；收回得 [2, 24, 45, 66, 75, 90, 170, 802]，排序完成。",
     "最大值 802 有 3 位，恰好 3 轮、每轮 n 次入桶加 n 次收回，共 O(d(n+k))；比较排序受 Ω(n log n) 下界限制，这里一次比较都没做。"
    ]
   }
  },
  "counting-sort": {
   "brute": "先想暴力解：仍用两两比较的排序，n 个元素至少 Ω(n log n) 次比较，重复值再多也得逐对比出先后。关键观察：值域已知且不大（k 远小于 n²）时，可以完全放弃比较——开一个长度 k 的计数数组统计每个值出现几次，然后按值从小到大、每个值重放它自己的次数，结果天然有序，时间和空间都只有 O(n+k)。",
   "bruteCode": "def brute(nums):\n    values = list(nums)\n    for end in range(len(values) - 1, 0, -1):\n        for index in range(end):\n            if values[index] > values[index + 1]:\n                values[index], values[index + 1] = values[index + 1], values[index]\n    return values",
   "walkthrough": {
    "input": "values = [1, 4, 1, 3, 4, 1, 2]，值域 [1, 4]",
    "steps": [
     "min=1、max=4，开长度 4 的计数数组，下标对应「值减 1」，全程没有一次元素间比较。",
     "扫一遍输入统计频次：值 1 出现 3 次、值 2 出现 1 次、值 3 出现 1 次、值 4 出现 2 次，counts = [3, 1, 1, 2]。",
     "按下标从小到大重放：值 1 重放 3 次、值 2 重放 1 次、值 3 重放 1 次、值 4 重放 2 次，得到 [1, 1, 1, 2, 3, 4, 4]。",
     "总成本 = 统计 O(n) + 重放 O(n+k)，这里 n=7、k=4；重复值越多重放越省，比较排序对重复值仍要做完整比较。",
     "代价是 O(k) 额外空间且要求值可映射为连续整数下标；值域远大于 n 时计数数组会爆内存，应改用比较排序。"
    ]
   }
  },
  "quick-sort": {
   "brute": "先想暴力解：排序的朴素做法是冒泡或选择排序——每轮找出最值放好，共 n 轮，每轮 O(n)，总 O(n^2)。关键观察是：一趟划分能把小于基准的元素挪到左边、大于的挪到右边，基准随之落到最终位置，左右两半成了互相独立的更小排序问题，平均 O(n log n)。",
   "bruteCode": "def brute(nums):\n    arr = list(nums)\n    for i in range(len(arr)):\n        m = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[m]:\n                m = j\n        arr[i], arr[m] = arr[m], arr[i]\n    return arr",
   "walkthrough": {
    "input": "nums = [5, 2, 8, 1, 9]，取第一个元素 5 为基准",
    "steps": [
     "以 5 为基准做一趟划分：小于 5 的是 {2,1}，大于 5 的是 {8,9}。",
     "划分完成，数组变为 [2, 1, 5, 8, 9]：5 已落在它的最终位置下标 2，左边全小、右边全大。",
     "递归左半 [2, 1]：以 2 为基准，划分后得 [1, 2]，2 归位，左半只剩 [1] 无需再排。",
     "递归右半 [8, 9]：以 8 为基准，9 停在右侧，8 归位，子区间长度归 0 或 1 时递归终止。",
     "得到 [1, 2, 5, 8, 9]。每层划分总工作量 O(n)，约 log n 层，平均 O(n log n)；若基准总选到极值（如对已序数组取端点），会退化成 O(n^2)。"
    ]
   }
  },
  "quickselect": {
   "brute": "先想暴力解：整体排序后直接取下标 k 的元素，任何比较排序都要 O(n log n)——可我们只需要一个位置的答案，其余位置排好了纯属浪费。关键观察：快速分区后基准落在它的最终位置 store，左边全 ≤ 基准、右边全 ≥ 基准；若 store 恰为 k，基准就是答案，否则只需进入包含 k 的那一侧，另一半从此不再访问，每轮工作量约减半，平均 O(n)。",
   "bruteCode": "def brute(nums, k):\n    return sorted(nums)[k]",
   "walkthrough": {
    "input": "nums = [7, 2, 9, 4, 1, 8]，k = 2（下标从 0 计，即返回第 3 小的元素）",
    "steps": [
     "第 1 轮取右端 8 为基准：7、2、4、1 依次换到左段，基准落位下标 4，数组变 [7, 2, 4, 1, 8, 9]。store=4 > k=2，答案在左侧，right 缩到 3，右边的 8、9 从此不再看。",
     "第 2 轮区间 [0, 3] 取基准 1：7、2、4 都大于 1，没有元素换位，基准交换到下标 0，得 [1, 2, 4, 7, 8, 9]。store=0 < k=2，答案在右侧，left 提到 1。",
     "第 3 轮区间 [1, 3] 取基准 7：2、4 都 ≤ 7 依次换位，store 落在下标 3 > k=2，答案在左侧，right 缩到 2。",
     "第 4 轮区间 [1, 2] 取基准 4：2 ≤ 4 换到左段，store 停在下标 2 恰好等于 k，返回 values[2] = 4——四轮分别处理 6、4、3、2 个元素，每轮都整体抛弃不含 k 的一侧。",
     "最坏情形（总抽到极端基准）每轮只缩 1 个元素，退化为 O(n²)；工程上常随机选基准或三数取中来规避。"
    ]
   }
  },
  "bubble-sort": {
   "brute": "先想暴力解：不加任何优化，固定跑满 n-1 轮、每轮从头扫到尾交换所有逆序相邻对——即使数组早已有序，也要做满 O(n²) 次比较才能收工。关键观察：冒泡的性质是「一轮零交换 ⇔ 整个数组已有序」，于是给每轮立一个 changed 标志，一旦整轮没有发生交换就立即提前结束；对已有序输入，比较次数从 O(n²) 降到 O(n)。",
   "bruteCode": "def brute(nums):\n    values = list(nums)\n    for _ in range(len(values)):\n        for index in range(len(values) - 1):\n            if values[index] > values[index + 1]:\n                values[index], values[index + 1] = values[index + 1], values[index]\n    return values",
   "walkthrough": {
    "input": "values = [2, 1, 3, 4, 5]，带提前结束标志的冒泡",
    "steps": [
     "第 1 轮（end=4）扫 4 对相邻元素：只有开头的 2>1 发生交换，得 [1, 2, 3, 4, 5]；本轮末尾 5 归位，changed=True。",
     "第 2 轮（end=3）扫剩余前缀 [1, 2, 3, 4] 的 3 对：1<2、2<3、3<4 全部不交换，changed 保持 False。",
     "一整轮零交换证明所有相邻对都有序，立即提前结束，后续轮次全部省掉。",
     "总共 7 次比较、1 次交换就结束；若按暴力固定跑满 5 轮、每轮 4 次比较，20 次比较里有 13 次是空跑。",
     "代价：逆序输入仍要 O(n²) 次交换；冒泡只交换相邻元素、不跨越相等元素，是稳定的，但交换次数远多于选择排序的 O(n)。"
    ]
   }
  },
  "prefix-sum": {
   "brute": "先想暴力解：每次询问区间和 [l, r] 都从 l 累加到 r，单次 O(n)，m 次询问就是 O(nm)。关键观察是：先花 O(n) 算出前缀和 S[i]（前 i 个元素之和），任意区间和都等于 S[r+1] - S[l]，一次减法出结果。前提是数组在询问期间不被修改。",
   "bruteCode": "def brute(nums, queries):\n    for l, r in queries:\n        total = 0\n        for i in range(l, r + 1):\n            total += nums[i]\n        print(total)",
   "walkthrough": {
    "input": "nums = [2, 4, 6, 8]，依次询问区间 [1, 3] 的元素和",
    "steps": [
     "预处理前缀和：S[0]=0，S[1]=2，S[2]=2+4=6，S[3]=12，S[4]=20。",
     "询问 [1, 3]：区间和 = S[4] - S[1] = 20 - 2 = 18。",
     "手工验证：nums[1]+nums[2]+nums[3] = 4+6+8 = 18，一致。",
     "之后每次询问都是一次减法 O(1)。注意适用条件：数组静态时前缀和才可复用；若频繁改点，就该换树状数组或线段树。"
    ]
   }
  },
  "two-pointers": {
   "brute": "先想暴力解：在有序数组里找两数之和等于 target，朴素做法是两两枚举所有配对逐一求和，时间 O(n^2)，n=1000 时约 50 万次比较。关键观察是：数组有序时，最大加最小若偏大就只有右指针左移才有救，偏小就只有左指针右移才有救——每个指针全程只单向移动，一次扫描 O(n)。",
   "walkthrough": {
    "input": "nums = [1, 3, 5, 7, 9]（升序），target = 12，找两个下标使其和为 12",
    "steps": [
     "左指针 i=0 指向 1，右指针 j=4 指向 9，当前和 1+9=10。",
     "10 < 12：和偏小，而 j 已是最大值，唯一能增大和的移动是把 i 右移。i=1，和变为 3+9=12。",
     "12 == 12，命中，返回下标对 [1, 4]。",
     "全程指针没有回退，最多 n-1 次移动就结束，O(n)。反证一下方向：若 1+9=13 偏大，就只能 j 左移，因为换更大的 i 只会让和更大。"
    ]
   }
  },
  "reservoir-sampling": {
   "brute": "先想暴力解：把整条流读完存进内存，再随机抽 k 个（例如整体洗牌后取前 k 个）——空间 O(n)，流的长度未知或远超内存时直接不可行。关键观察：只需维护 k 个槽位的水塘：前 k 个元素直接入塘；处理第 i 个元素（i 从 1 计）时以 k/i 的概率让它随机替换塘中一个位置。归纳可证每个元素最终留下的概率恰为 k/n，全程单遍读取、空间 O(k)。",
   "bruteCode": "import random\n\ndef brute(stream, k):\n    pool = list(stream)\n    random.shuffle(pool)\n    return pool[:k]",
   "walkthrough": {
    "input": "stream = [10, 20, 30, 40, 50]，k = 2，seed = 1（LCG 确定性复现随机数）",
    "steps": [
     "前 k=2 个元素直接入塘，reservoir = [10, 20]；此后每读一个新元素，用 LCG 生成随机数决定它的去留。",
     "index=2 读到 30：state=1015568748，chosen = state % 3 = 0 < 2，命中槽位 0，30 换下 10，塘变 [30, 20]——新元素以 k/3 = 2/3 的概率入选。",
     "index=3 读到 40：state=1586005467，chosen = 3 ≥ 2，不命中，塘保持 [30, 20]——此时入选概率已降为 k/4 = 1/2。",
     "index=4 读到 50：state=2165703038，chosen = 3 ≥ 2，仍不命中，最终样本 [30, 20]。",
     "第 i 个元素的入选概率 k/i 逐个递减，但归纳可得任何元素最终留在塘中的概率都是 k/n = 2/5；全程只扫一遍流、只占 k 个槽位，这就是未知长度流中等概率采样的关键。"
    ]
   }
  },
  "bucket-sort": {
   "brute": "先想暴力解：对全部元素直接插入排序，最坏 O(n²)——元素分散在很宽的值域上时，大部分比较都发生在注定不相邻的元素之间，纯属浪费。关键观察：值域范围已知时，先按值把元素分进约 √n 个桶，每个桶的值域缩小约 √n 倍、桶内期望元素也只有约 √n 个；桶内各自排序、按桶序拼接，均匀分布下总成本接近线性。",
   "bruteCode": "def brute(nums):\n    values = list(nums)\n    result = []\n    for value in values:\n        result.append(value)\n        cursor = len(result) - 1\n        while cursor > 0 and result[cursor - 1] > result[cursor]:\n            result[cursor - 1], result[cursor] = result[cursor], result[cursor - 1]\n            cursor -= 1\n    return result",
   "walkthrough": {
    "input": "values = [32, 17, 89, 11, 65, 4]，n = 6，桶数取 ⌊√6⌋ = 2",
    "steps": [
     "值域 [4, 89]，桶宽 (89-4)/2 = 42.5，映射公式为 (值-4)/42.5 向下取整、并封顶到最后一个桶。",
     "分桶：32、17、11、4 映射到桶 0；65（61/42.5≈1.4）、89（85/42.5=2.0 封顶）映射到桶 1。桶 0 = [32, 17, 11, 4]，桶 1 = [89, 65]。",
     "按桶序把元素逐个插入结果数组，桶内用插入排序：桶 0 依次插入 32、17、11、4，得 [4, 11, 17, 32]。",
     "桶 1 插入：89 直接追加到尾部，65 比 89 小、右移一格插入，最终 [4, 11, 17, 32, 65, 89]。",
     "若 6 个元素直接插入排序，最坏要比较 1+2+3+4+5=15 次；数据均匀时每桶期望约 √n 个元素、整体近线性，但所有元素挤进一个桶时退化回 O(n²)。"
    ]
   }
  },
  "shell-sort": {
   "brute": "先想暴力解：普通插入排序每步只能把元素向左挪一格，最小元素若在数组末尾就要移动 n-1 次，逆序输入总移动 1+2+…+(n-1)=O(n²) 次。关键观察：先按较大间隔 gap 把数组分成 gap 组、组内做插入排序，元素一次就能跨 gap 大步跳到大致正确的位置；间隔逐轮减半直到 1，最后一轮虽是普通插入排序，但数组已基本有序，移动量大幅缩水。",
   "bruteCode": "def brute(nums):\n    values = list(nums)\n    for index in range(1, len(values)):\n        key = values[index]\n        cursor = index - 1\n        while cursor >= 0 and values[cursor] > key:\n            values[cursor + 1] = values[cursor]\n            cursor -= 1\n        values[cursor + 1] = key\n    return values",
   "walkthrough": {
    "input": "values = [8, 7, 6, 5, 4, 3, 2, 1]，n = 8，间隔序列 4 → 2 → 1",
    "steps": [
     "gap=4 分 4 组（下标 i 与 i+4 配对）：8 与 4、7 与 3、6 与 2、5 与 1 组内插入排序，8 一步就跨过 4 格换到 4 的位置，得 [4, 3, 2, 1, 8, 7, 6, 5]。",
     "gap=2 分两组：偶数列 [4, 2, 8, 6] 排成 [2, 4, 6, 8]，奇数列 [3, 1, 7, 5] 排成 [1, 3, 5, 7]，数组变 [2, 1, 4, 3, 6, 5, 8, 7]，只剩相邻逆序。",
     "gap=1 退化为普通插入排序：只有下标 1、3、5、7 各把 1、3、5、7 左移一格，共 4 次移动完成 [1, 2, 3, 4, 5, 6, 7, 8]。",
     "对比暴力：同样的逆序输入直接插入排序要移动 1+2+…+7 = 28 次；大间隔前几轮让元素大步就位，最后一轮几乎不动，这就是希尔排序的优势。"
    ]
   }
  },
  "linear-search": {
   "brute": "先想暴力解：线性查找本身就是最朴素的方案——探针从左到右逐个比对，命中即返回下标，扫完返回 -1；它不要任何预处理，对无序数据也没有更快的单次查询方法（最坏总要看遍每个元素），单次 O(n) 已是下界。关键观察：短板在查询次数——同一批数据反复查询时，先排序再二分（单次 O(log n)）或建哈希表（单次 O(1)）更划算；只查一两次或需要「第一个匹配」语义时，线性扫描反而最省。",
   "bruteCode": "def brute(nums, target):\n    for index in range(len(nums)):\n        if nums[index] == target:\n            return index\n    return -1",
   "walkthrough": {
    "input": "nums = [12, 7, 25, 3, 18]，target = 3",
    "steps": [
     "探针从下标 0 开始：nums[0]=12 ≠ 3，继续右移。",
     "下标 1：7 ≠ 3；下标 2：25 ≠ 3，已比较 3 次仍未命中。",
     "下标 3：nums[3]=3 == target，立即返回 3；下标 4 的 18 一次都没被访问。",
     "命中位置决定成本：target 在开头只需 1 次比较（最好 O(1)），在末尾或不存在则要比较满 5 次（最坏 O(n)）。",
     "把 target 换成 9 重跑：扫完 5 个元素返回 -1，同样 O(n)；这批数据若要反复查询，先排序二分或建哈希表更划算，只查一次则线性扫描最简单直接。"
    ]
   }
  },
  "selection-sort": {
   "brute": "先想暴力解：更原始的做法是相邻交换反复扫描（冒泡式），一次交换只前进一步，逆序输入要交换 O(n²) 次。关键观察：排序每轮真正需要的只是「最小值在哪」这一个信息——用一次线性扫描把最小元素的下标记下来，再让它与区间起点直接交换，每轮的交换次数从一串压到 1 次，全程交换 O(n)、比较仍是 O(n²)。",
   "bruteCode": "def brute(nums):\n    values = list(nums)\n    changed = True\n    while changed:\n        changed = False\n        for index in range(len(values) - 1):\n            if values[index] > values[index + 1]:\n                values[index], values[index + 1] = values[index + 1], values[index]\n                changed = True\n    return values",
   "walkthrough": {
    "input": "values = [29, 10, 14, 37, 13]",
    "steps": [
     "start=0：扫描 10、14、37、13，最小值 10 在下标 1，与起点 29 交换，得 [10, 29, 14, 37, 13]——只 1 次交换就让最小值归位。",
     "start=1：在剩余的 29、14、37、13 中扫出最小值 13（下标 4），交换得 [10, 13, 14, 37, 29]。",
     "start=2：最小值恰是起点自己（14），与自己交换等于原地不动；start=3 时 29 与 37 交换，得 [10, 13, 14, 29, 37]。",
     "全程比较 4+3+2+1 = 10 次，但真正的交换只有 3 次；交换次数固定 O(n) 是它区别于冒泡的关键优点。",
     "短板：数组已有序时每轮仍要完整扫描找最小值，比较固定 O(n²)；且远距离交换会跳过中间的相等元素，排序不稳定。"
    ]
   }
  },
  "fisher-yates-shuffle": {
   "brute": "先想暴力解：要无偏，可以生成全部 n! 种排列再均匀抽一个——n=10 已是 362 万种，n=20 直接天文数字，时间空间都爆炸。关键观察：不必枚举排列——从尾到头处理，第 i 步只在未固定的前 i+1 个位置里均匀随机选一个与位置 i 交换；归纳可证每个位置拿到任一元素的概率都是 1/(i+1)，最终 n! 种排列各以 1/n! 出现，且原地一次线性扫描、O(n) 完成。",
   "bruteCode": "import random\nfrom itertools import permutations\n\ndef brute(nums):\n    return list(random.choice(list(permutations(nums))))",
   "walkthrough": {
    "input": "values = [1, 2, 3, 4, 5]，seed = 42（LCG 确定性复现随机数）",
    "steps": [
     "i=4：state=1083814273，chosen = state % 5 = 3，位置 4 与位置 3 交换，得 [1, 2, 3, 5, 4]——位置 4 从此固定。",
     "i=3：state=378494188，chosen = state % 4 = 0，位置 3 与位置 0 交换，得 [5, 2, 3, 1, 4]——位置 3 固定为 1。",
     "i=2：state=2479403867，chosen = state % 3 = 2，位置 2 与自己交换（值 3 留在原地），数组不变。",
     "i=1：state=955863294，chosen = state % 2 = 0，位置 1 与位置 0 交换，得 [2, 5, 3, 1, 4]，最终排列确定。",
     "每一步的候选范围是 [0, i] 共 i+1 个位置，候选数依次 5、4、3、2，总可能性 5×4×3×2 = 120 = 5!，每种排列恰对应一条交换路径、概率 1/120；全程 O(n) 时间、原地 O(1) 空间。"
    ]
   }
  },
  "floyd-cycle-detection": {
   "brute": "先想暴力解：把沿途访问过的每个节点下标存进哈希集合，第一次重复出现的节点就是环入口——正确，但集合要记住所有走过的节点，最坏 O(n) 额外空间。关键观察：把链表看成跑道，慢指针每步 1 格、快指针每步 2 格：有环时快指针先入环绕圈，两者相对速度每步差 1 格，必然在环内相遇；相遇后把一个指针拨回起点，两指针同步每次 1 格，再次相遇处由 a = k·r - x 可证就是环入口——全程只用两个变量。",
   "bruteCode": "def brute(links, start):\n    seen = set()\n    cursor = start\n    while cursor != -1:\n        if cursor in seen:\n            return cursor\n        seen.add(cursor)\n        cursor = links[cursor]\n    return -1",
   "walkthrough": {
    "input": "links = [1, 2, 3, 4, 2]（即 0→1→2→3→4→回到 2），start = 0，尾巴长 2、环长 3",
    "steps": [
     "慢、快指针同从节点 0 出发。第 1 步：慢 0→1、快 0→2；第 2 步：慢 1→2、快 2→4；第 3 步：慢 2→3、快 4→2→3——两者在节点 3 相遇，确认有环。",
     "相遇时慢指针走了 3 步（尾巴 a=2 加环内 x=1），快指针走了 6 步 = 2×3；由 2(a+x) = a+x+k·r 解出 a = k·r - x，即起点到入口的距离恰好等于相遇点绕回入口的距离。",
     "把 cursor 拨回起点 0，与慢指针同步每次走 1 格：1 步后 cursor=1、slow=4；再 1 步后 cursor=2、slow=2，两者在节点 2 重逢。",
     "返回环入口节点 2，与构造一致（环是 2→3→4→2）；哈希集合暴力同样能给出入口，但要用 O(n) 空间记住每个访问过的节点。",
     "快慢指针全程 O(n) 时间（入环前至多 n 步、环内至多再绕一圈），加上定位入口的 O(n)，空间 O(1)——这正是本题对空间敏感场景的价值。"
    ]
   }
  },
  "zero-one-bfs": {
   "brute": "先想暴力解：普通 BFS 把所有边当等权逐层扩展，一旦边权有 0 有 1，层数不再等于真实距离，答案会错；换用 Dijkstra 堆松弛虽然正确，却要付出 O(E log V) 的堆操作。关键观察：边权只有 0 和 1——松弛成功时若代价 0，新距离不大于队首，插入队首让它优先扩展；若代价 1 插入队尾。双端队列始终保持队列内距离单调、极差不超过 1，每个点至多松弛常数次，O(V+E)。",
   "bruteCode": "import heapq\n\ndef brute(grid, start, target):\n    rows, cols = len(grid), len(grid[0])\n    best = {start: 0}\n    heap = [(0, start)]\n    while heap:\n        dist, node = heapq.heappop(heap)\n        if node == target:\n            return dist\n        if dist > best.get(node, float('inf')):\n            continue\n        row, col = node\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            nr, nc = row + dr, col + dc\n            if 0 <= nr < rows and 0 <= nc < cols:\n                candidate = dist + grid[nr][nc]\n                if candidate < best.get((nr, nc), float('inf')):\n                    best[(nr, nc)] = candidate\n                    heapq.heappush(heap, (candidate, (nr, nc)))\n    return -1",
   "walkthrough": {
    "input": "grid = [[0,0,0],[0,1,1],[0,1,0]]（格中数字为进入该格的代价），start = (0,0)，target = (2,2)",
    "steps": [
     "起点 (0,0) 距离 0 出队：走进 (1,0)、(0,1) 都免费，两者距离 0 依次插到队首；队列成为「0 段在前、1 段在后」的双端结构。",
     "(0,1) 出队：走进 (1,1) 要付 1，距离 1 插队尾；走进 (0,2) 免费、距离 0 插队首。随后 (0,2) 出队，把付 1 的 (1,2) 插队尾。",
     "(1,0) 出队：沿免费边走进 (2,0)，距离 0 插队首——免费边让 (2,0) 直接插到距离 1 的 (1,1)、(1,2) 前面，这是普通 BFS 做不到的。",
     "(2,0) 出队后把付 1 的 (2,1) 插队尾；(1,2) 出队（距离 1）松弛 (2,2)：走进 (2,2) 免费，距离 = 1+0 = 1，插到队首。",
     "(2,2) 出队，答案 1——顶行 (0,0)→(0,1)→(0,2)→(1,2)→(2,2) 或左列 (0,0)→(1,0)→(2,0)→(2,1)→(2,2) 两条最优路径都恰好付一次过路费；Dijkstra 同样得到 1 但要 O(E log V)，0-1 BFS 用双端队列把代价压回 O(V+E)。"
    ]
   }
  },
  "two-sat": {
   "brute": "先想暴力解：枚举全部 2^n 种赋值逐一验证子句，n=30 就有 10 亿种，指数爆炸。关键观察：子句 (a∨b) 等价于两条蕴含 ¬a→b 与 ¬b→a——每个变量拆成「真、假」两个节点建蕴含图，若某变量 x 与 ¬x 落在同一个强连通分量，意味着公式同时强制 x 为真又为假，必不可满足；否则用 Tarjan 一次 DFS 求出所有强连通分量即可线性判定。",
   "bruteCode": "from itertools import product\n\ndef brute(variables, clauses):\n    for assignment in product([False, True], repeat=variables):\n        if all(assignment[abs(a) - 1] == (a > 0) or\n               assignment[abs(b) - 1] == (b > 0)\n               for a, b in clauses):\n            return True\n    return False",
   "walkthrough": {
    "input": "variables = 2，clauses = [(1, 2), (-1, -2)]（要求 x1、x2 至少一真，且不能同时为真）",
    "steps": [
     "节点编号：0=x1、1=¬x1、2=x2、3=¬x2。子句 (x1∨x2) 生成蕴含 ¬x1→x2、¬x2→x1；子句 (¬x1∨¬x2) 生成 x1→¬x2、x2→¬x1，全图共 4 条边。",
     "Tarjan 从节点 0 开始 DFS：0→3 后发现 3 有边指回 0，回溯时 low[3] 更新为 dfn[0]=0，进而 low[0]=0，弹出强连通分量 {0, 3}——x1 与 ¬x2 互相可达。",
     "再从节点 1 出发：1→2、2 指回 1，弹出分量 {1, 2}——¬x1 与 x2 互相可达。全图只有这两个分量。",
     "逐变量检查：component[x1]=0 而 component[¬x1]=1，component[x2]=1 而 component[¬x2]=0，没有任何变量与自己的否定同分量，公式可满足。",
     "结论符合直觉：两个子句强制 x1、x2 恰好一真一假，取 x1=真、x2=假即可；暴力要试 2² = 4 种赋值，蕴含图加 Tarjan 一次 O(V+E) 判定，n 大时差距是指数级的。"
    ]
   }
  },
  "bipartite-matching": {
   "brute": "先想暴力解：枚举边集合的所有子集，逐个检查是否互不共享端点并记录最大规模——E 条边有 2^E 个子集，E=20 就要查 100 万次起步。关键观察：若当前匹配补不上一条新边，不必推倒重来——找一条未匹配边、已匹配边交替且首尾都是未匹配边的增广路，把路上匹配关系整体取反，匹配数恰好加 1；Berge 定理保证找不到增广路时匹配已最大。",
   "bruteCode": "from itertools import combinations\n\ndef brute(left, edges):\n    for size in range(len(edges), 0, -1):\n        for combo in combinations(edges, size):\n            lefts = [l for l, _ in combo]\n            rights = [r for _, r in combo]\n            if len(set(lefts)) == size and len(set(rights)) == size:\n                return size\n    return 0",
   "walkthrough": {
    "input": "left = 3，right = 3，edges = [[0,0], [0,1], [1,0], [2,2]]",
    "steps": [
     "左 0 先找增广路：右 0 空闲，直接配上，匹配 {右0: 左0}。",
     "左 1 也想要右 0，但右 0 已被左 0 占用——递归先给左 0 找新位置：左 0 的另一条边通向空闲的右 1，于是左 0 挪去右 1、右 0 让给左 1，匹配变 {右0: 左1, 右1: 左0}。",
     "路径 左1→右0→左0→右1 就是增广路：两端是未匹配边、中间是已匹配边，整体取反后匹配数从 1 变 2。",
     "左 2 的边通向空闲的右 2，直接配上，最终 3 条边全部配对，最大匹配 = 3。",
     "若不允许重新安排，左 1 会因右 0 被占而直接放弃，只能得到 2 对；每个左点做一次 DFS 增广（单次 O(E)），总体 O(V·E)。"
    ]
   }
  },
  "bridges-articulation": {
   "brute": "先想暴力解：对每条边删掉后数一遍连通分量，分量变多即桥；对每个点同样删点数分量判断割点——单次检查 O(V+E)，所有边、点各查一遍代价极高。关键观察：一次 DFS 就够——dfn[u] 记访问时间戳，low[u] 是 u 子树借助至多一条返祖边能回到的最小时间戳；孩子 v 满足 low[v] > dfn[u] 时 (u,v) 是桥，low[v] ≥ dfn[u] 且 u 非根时 u 是割点，根节点看 DFS 树孩子数是否 ≥ 2。",
   "bruteCode": "def brute(n, edges):\n    def component_count(skip_edge=None, skip_node=None):\n        adjacency = [[] for _ in range(n)]\n        for i, (a, b) in enumerate(edges):\n            if i == skip_edge or a == skip_node or b == skip_node:\n                continue\n            adjacency[a].append(b)\n            adjacency[b].append(a)\n        seen = set()\n        count = 0\n        for start in range(n):\n            if start == skip_node or start in seen:\n                continue\n            count += 1\n            stack = [start]\n            while stack:\n                node = stack.pop()\n                if node in seen:\n                    continue\n                seen.add(node)\n                stack.extend(adjacency[node])\n        return count\n    base = component_count()\n    bridges = [sorted(edges[i]) for i in range(len(edges)) if component_count(skip_edge=i) > base]\n    articulation = [v for v in range(n) if component_count(skip_node=v) > base]\n    return {'bridges': sorted(bridges), 'articulation': sorted(articulation)}",
   "walkthrough": {
    "input": "n = 4，edges = [[0,1], [1,2], [2,0], [2,3]]（三角形 0-1-2 加挂点 3）",
    "steps": [
     "DFS 从 0 出发沿树边 0→1→2→3 前进，dfn 依次为 0、1、2、3；dfn 是访问时间戳，low 是子树经返祖边能回到的最小时间戳，初始 low=dfn。",
     "节点 2 处理邻边时遇到返祖边 (2,0)：low[2] 从 2 降到 0——三角形子树能绕回 0，说明 0-1、1-2 都在环上，不成桥。",
     "节点 3 除了父亲边没有其他邻边，low[3]=3 保持：low[3] > dfn[2]=2，子树 3 无路绕回，边 (2,3) 记为桥；同时 low[3] ≥ dfn[2] 且 2 非根，节点 2 记为割点。",
     "回溯到 1：收到 low[2]=0，low[1] 变 0；条件 low[2]=0 ≥ dfn[1]=1 不成立，1 不是割点，边 (1,2) 也不是桥。",
     "根节点 0 的 DFS 树孩子只有 1 个（0→1），不满足「根孩子数 ≥ 2」，0 也不是割点；最终输出桥 [[2, 3]]、割点 {2}，一次 DFS O(V+E)，而暴力要逐边逐点各跑一次连通性检查。"
    ]
   }
  },
  "bfs": {
   "brute": "先想暴力解：网格或图中求起点到终点的最少步数，朴素做法是用 DFS 枚举所有能走通的路径再取最小，路径数量随格数指数增长。关键观察是：每步代价相同（都是 1）时，按「离起点的层数」逐层向外扩散，第一次碰到某个格子的层数就是它的最短距离——这正是 BFS 的队列顺序。",
   "walkthrough": {
    "input": "2 行 3 列网格：第 0 行是 S . .，第 1 行是 . # E。S 在 (0,0)，E 在 (1,2)，(1,1) 是墙",
    "steps": [
     "起点 (0,0) 入队，dist=0。出队它，把未访问的邻居 (0,1) 和 (1,0) 标记 dist=1 入队。",
     "出队 (0,1)（dist=1）：邻居 (0,2) 标 dist=2 入队；(1,1) 是墙跳过。",
     "出队 (1,0)（dist=1）：右邻 (1,1) 是墙、上邻 (0,0) 已访问，无新节点。",
     "出队 (0,2)（dist=2）：下方 (1,2) 正是终点，标 dist=3 入队。",
     "出队 (1,2)，是 E，返回步数 3。第一次到达即最短：队列按层处理，若存在更短路径，它对应的层会更早出队。"
    ]
   }
  },
  "eulerian-path": {
   "brute": "先想暴力解：枚举所有边的排列，逐条检查相邻两条边能否首尾相接、且恰好用完每条边——E 条边共 E! 种排列，E=10 已是 362 万，边数稍多即不可行。关键观察：一笔画有度数判据——有向图存在欧拉路径当且仅当起点 out=in+1、终点 in=out+1、其余点入=出（或全部入=出构成回路）；存在时用 Hierholzer 栈沿未用边深入、无路可走就弹栈回退，弹栈序的逆序即完整路径，O(V+E)。",
   "bruteCode": "from itertools import permutations\n\ndef brute(n, edges):\n    for order in permutations(edges):\n        if all(order[i][1] == order[i + 1][0] for i in range(len(order) - 1)):\n            return [order[0][0]] + [edge[1] for edge in order]\n    return []",
   "walkthrough": {
    "input": "n = 4，edges = [[0,1], [1,2], [2,0], [1,3], [3,1]]（每个点入度=出度，构成欧拉回路）",
    "steps": [
     "度数检查：0、1、2、3 四个点全部入度=出度，没有 out=in+1 的点，构成欧拉回路；从第一个有出边的点 0 出发，邻接表降序排列后用栈深入。",
     "栈轨迹：0→1，在 1 处先走 1→2（降序表 pop 取到 2），2→0 走完回到 0；此时 0 已无未用边，0 弹栈进 path，2 也无路可走弹栈。",
     "回到栈顶 1：还剩边 1→3，继续走 3→1；此后 1、3、1、0 相继弹栈，path 收满 6 个节点。",
     "path 逆序即欧拉回路：0→1→3→1→2→0，5 条边每条恰好使用一次，节点数 6 = 边数 5 + 1，校验通过。",
     "Hierholzer 让每条边恰好入栈出栈一次，O(V+E)；度数判据 O(V) 先行，不存在欧拉路径时直接返回空；暴力枚举排列则要 E! = 120 种尝试起步。"
    ]
   }
  },
  "dfs": {
   "brute": "先想暴力解：求从起点出发能到达的所有节点，朴素做法是对每个节点单独跑一次可达性检查，每次都要扫一遍图，总代价 O(V·(V+E))。关键观察是：从起点做一次深度优先遍历，凡是被访问到的节点就是可达的，一次 O(V+E) 全部搞定。",
   "walkthrough": {
    "input": "邻接表：1→[2, 3]，2→[4]，3→[]，4→[]，从节点 1 出发",
    "steps": [
     "访问 1，visited={1}。选它的第一条边深入，进入 2。",
     "访问 2，visited={1,2}。继续深入到 4，此时递归栈是 1→2→4。",
     "访问 4，没有出边，无法再深入，回溯：退栈到 2，2 的其余出边为空，再退回 1。",
     "回到 1 后走第二条边进入 3，访问 3，无出边，回溯到 1。",
     "遍历结束，可达集合为 {1,2,3,4}。当前递归栈恰好是「从起点到当前点」的一条路径，回溯就是退栈；每个点每条边只经过一次，O(V+E)。"
    ]
   }
  },
  "bidirectional-bfs": {
   "brute": "先想暴力解：单向 BFS 从起点逐层向外扩，直到撞见终点；分支因子为 b、最短路长为 d 时要扩展约 b^d 个状态，d 从 5 到 10 规模就是平方级暴涨。关键观察：从起点、终点两侧同时扩，各自走约 d/2 层即在中途相遇——总规模约 2·b^(d/2)，指数上砍半；实现上每轮挑较小的一侧前沿扩展，新邻居若出现在对侧距离表中，两侧距离相加就是最短路长。",
   "bruteCode": "from collections import deque\n\ndef brute(n, edges, start, target):\n    if start == target:\n        return 0\n    graph = [[] for _ in range(n)]\n    for a, b in edges:\n        graph[a].append(b)\n        graph[b].append(a)\n    distance = {start: 0}\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in distance:\n                distance[neighbor] = distance[node] + 1\n                if neighbor == target:\n                    return distance[neighbor]\n                queue.append(neighbor)\n    return -1",
   "walkthrough": {
    "input": "n = 7，edges = [[0,1], [1,2], [2,3], [3,4], [4,5], [1,6]]，start = 0，target = 5",
    "steps": [
     "两侧前沿 front={0}、back={5}，距离表 {0:0}、{5:0}。第 1 轮扩起点侧：0 的邻居 1 记距离 1 入前沿。",
     "第 2 轮扩 {1}：邻居 0 已访问跳过；2 与 6 都记距离 2，前沿变 {2, 6}——支路 6 与主干 2 同层。",
     "规则是每轮挑较小前沿扩展：{2,6} 有 2 个元素、终点侧 {5} 只有 1 个，改扩终点侧：5 的邻居 4 记距离 1；下一轮 {4} 仍较小，继续扩，3 记距离 2。",
     "扩 {3} 时发现邻居 2 已存在于起点侧距离表（距离 2），相遇：答案 = 2 + 1 + 2 = 5，对应路径 0→1→2→3→4→5。",
     "两侧各自只推进了 2~3 层；分支因子 b 大的图里单向要扩约 b^d 个状态，双向只需约 2·b^(d/2)，且始终扩展较小前沿能进一步控制同一层的宽度。"
    ]
   }
  },
  "topological-sort": {
   "brute": "先想暴力解：给带依赖关系的任务排出合法顺序，朴素做法是枚举全部 n! 种排列，逐一验证是否满足所有先修约束，O(n!·m)。关键观察是：入度为 0 的节点不依赖任何人，可以立刻输出；输出后删掉它的出边，会产生新的入度 0 节点——不断重复即可，O(V+E)。",
   "walkthrough": {
    "input": "有向边：a→b，a→c，b→d，c→d（d 依赖 b 和 c）",
    "steps": [
     "统计入度：a 为 0，b、c 各 1，d 为 2。a 入度为 0，进入队列。",
     "取出 a 并输出，删去边 a→b、a→c：b 和 c 的入度都降为 0，依次入队。",
     "取出 b 并输出，删去边 b→d：d 的入度降为 1。",
     "取出 c 并输出，删去边 c→d：d 的入度降为 0，入队。",
     "取出 d 并输出，得到 a, b, c, d（b 与 c 可互换）。若结束时输出个数少于节点数，剩下的节点构成环，说明图不是 DAG。"
    ]
   }
  },
  "hungarian-algorithm": {
   "brute": "先想暴力解：n 个工人和 n 个任务一一对应，把所有 n! 种排列枚举一遍，对每种排列把对应成本加总，取最小值。n! 增长爆炸，n=12 就约 4.8 亿种，完全不可行。关键观察是：给工人 u[i] 与任务 v[j] 维护对偶势能，让所有 cost[i][j]-u[i]-v[j] 保持非负；约化成本为 0 的边构成可增广子图，逐个工人取最小松弛量 delta 调整势能并增广，最终得到总成本最小的完美匹配。",
   "bruteCode": "from itertools import permutations\n\ndef brute(cost):\n    n = len(cost)\n    best = None\n    for perm in permutations(range(n)):\n        total = sum(cost[i][perm[i]] for i in range(n))\n        if best is None or total < best:\n            best = total\n    return best",
   "walkthrough": {
    "input": "cost = [[4, 1], [3, 2]]，2 个工人对应 2 个任务，势能 u、v 初始全 0",
    "steps": [
     "处理工人 1：从虚拟任务 0 出发，两条边的约化成本为 cost[0][0]-u[1]-v[1]=4 和 cost[0][1]-u[1]-v[2]=1，最小松弛量 delta=1 出现在任务 2，更新 u[1]=1、v[0]=-1 后任务 2 的约化成本降为 0。",
     "任务 2 尚未匹配，工人 1 直接增广：沿 way 回溯把 match[任务2]=工人1 配上，匹配成本 1。",
     "处理工人 2：任务 1、2 的约化成本分别是 3 和 2，取 delta=2，更新 u[2]=2、v[0]=-3，minimum[1] 降为 3-2=1。",
     "任务 2 已被工人 1 占用，继续从工人 1 松弛：cost[0][0]-u[1]-v[1]=4-1-0=3 大于已有的 minimum[1]=1，不更新；再取 delta=1，把 u[1] 提到 2、v[2] 降到 -1，minimum[1] 恰好归 0。",
     "任务 1 未匹配，增广后工人 2 拿到任务 1。总成本 1+3=4；另一方案 4+2=6，最优为 4，且全程约化成本始终非负。"
    ]
   }
  },
  "lowest-common-ancestor": {
   "brute": "先想暴力解：分别沿父指针把两个节点爬到根，各记录一条路径，再从根开始逐层比对，最后一个相同的节点就是 LCA。每次查询都要重新爬升并存两条路径，单次 O(深度)，查询一多开销明显。关键观察是：先用一次 BFS 预处理出 parent 与 depth，查询时把较深的节点先升到同层，再让两点同步一步步上移，第一次相遇的位置就是最近公共祖先。",
   "bruteCode": "def brute(n, parent, p, q):\n    def path_to_root(node):\n        path = []\n        while node != -1:\n            path.append(node)\n            node = parent[node]\n        return path\n    first = path_to_root(p)[::-1]\n    second = path_to_root(q)[::-1]\n    answer = first[0]\n    for a, b in zip(first, second):\n        if a != b:\n            break\n        answer = a\n    return answer",
   "walkthrough": {
    "input": "n=6，根 0，边 0-1、0-2、1-3、1-4、2-5，查询 p=3、q=2",
    "steps": [
     "BFS 从根 0 出发先记 parent 与 depth：depth[3]=2（parent[3]=1），depth[2]=1（parent[2]=0），一次遍历拿到查询要用的全部信息。",
     "对齐深度：p=3 比 q=2 深，先把 p 沿父指针上移 3→1，此时 depth[1]=depth[2]=1。",
     "同步上移：p=1 与 q=2 不相等，各自再走一步到 parent[1]=0、parent[2]=0，两点相遇。",
     "返回 LCA=0。若不对齐深度直接同步上移，两点会在更深处错过真正的最近公共祖先，所以必须先补齐高度差。",
     "暴力法要临时存两条路径再逐层比对；这里只依赖 parent、depth 两个数组完成同一次查询，多次查询共享同一次预处理。"
    ]
   }
  },
  "min-cost-max-flow": {
   "brute": "先想暴力解：把流量如何拆到各条 s-t 路径上的方案全部枚举，逐一检查容量与守恒约束，再挑总费用最小且流量最大的。路径组合指数级增长，稍大的网络就不可算。关键观察是：最大流可以逐条增广路逼近，而要费用最小，每一步都应沿当前残量网络中费用和最小的增广路发送瓶颈流量；SPFA（队列优化的 Bellman-Ford）恰好能在含反向边的残量网络上找到这条最短路，反向边保证先前的决策仍可撤销修正。",
   "bruteCode": "from itertools import product\n\ndef brute(n, edges, source, sink):\n    best = (0, 0)\n    ranges = [range(c + 1) for _, _, c, _ in edges]\n    for flows in product(*ranges):\n        balance = [0] * n\n        for (u, v, _, _), f in zip(edges, flows):\n            balance[u] -= f\n            balance[v] += f\n        if any(balance[i] != 0 for i in range(n) if i not in (source, sink)):\n            continue\n        value = balance[sink]\n        cost = sum(f * w for (_, _, _, w), f in zip(edges, flows))\n        if value > best[0] or (value == best[0] and cost < best[1]):\n            best = (value, cost)\n    return [best[0], best[1]]",
   "walkthrough": {
    "input": "n=4，source=0，sink=3，edges = [[0,1,2,1],[0,2,1,2],[1,2,1,1],[1,3,1,3],[2,3,2,1]]（u,v,容量,费用）",
    "steps": [
     "第 1 轮 SPFA 在残量网络上找费用和最小的增广路：dist=[0,1,2,3]，选中 0→1→2→3（费用 1+1+1=3），瓶颈流量 = min(2,1,2)=1，累计费用 3。",
     "沿路更新残量：0→1 剩 1、1→2 剩 0、2→3 剩 1，同时三条反向边容量各加 1——这正是「以后可改道」的凭证。",
     "第 2 轮：1→2 已满，SPFA 找到 0→2→3（费用 2+1=3），瓶颈 1，累计费用 6、流量 2。",
     "第 3 轮：0→2 已满，只剩 0→1→3（费用 1+3=4），瓶颈 1，累计费用 10、流量 3。",
     "第 4 轮：源点出边残量全为 0，找不到增广路，结束。最大流 3 = 源点出边总容量 2+1，最小费用 10；每轮都走当前最便宜的路，费用单调不降。"
    ]
   }
  },
  "astar-pathfinding": {
   "brute": "先想暴力解：从起点做深度优先搜索，枚举所有不重复经过格子的走法，遇到目标就记录长度取最小。路径数指数爆炸，绝大多数方向明显离目标越来越远仍被展开。关键观察是：曼哈顿距离是剩余步数永远不会高估的估计，于是给前沿格子打分 f = g + h（已走代价加启发估计），每次只扩展 f 最小的格子，把搜索方向拉向目标，绕远路几乎不会被碰到。",
   "bruteCode": "def brute(grid, start, target):\n    rows, cols = len(grid), len(grid[0])\n    best = [None]\n\n    def dfs(r, c, cost, visited):\n        if (r, c) == target:\n            if best[0] is None or cost < best[0]:\n                best[0] = cost\n            return\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols and not grid[nr][nc] and (nr, nc) not in visited:\n                visited.add((nr, nc))\n                dfs(nr, nc, cost + 1, visited)\n                visited.discard((nr, nc))\n\n    dfs(start[0], start[1], 0, {tuple(start)})\n    return -1 if best[0] is None else best[0]",
   "walkthrough": {
    "input": "3×3 网格 grid = [[0,0,0],[1,1,0],[0,0,0]]，起点 (0,0)，目标 (2,2)，中间一行前两格为障碍",
    "steps": [
     "起点 (0,0)：g=0，h=|0-2|+|0-2|=4，f=4 入堆。弹出后只生成 (0,1)：f=1+3=4，左下的 (1,0) 是障碍不能走。",
     "弹出 (0,1)（g=1），生成 (0,2)：f=2+2=4；(1,1) 是障碍，回头格 (0,0) 的代价 2 不会更小，跳过。",
     "弹出 (0,2)（g=2），生成 (1,2)：f=3+1=4。整条最优走廊上 f 始终等于 4——h 恰好等于剩余真实步数。",
     "弹出 (1,2)（g=3），生成 (2,2)：f=4+0=4；弹出 (2,2) 时它就是目标，返回 g=4。",
     "左下角 (2,0)、(2,1) 全程从未入堆：到它们的 f 至少 6+2=8，远大于 4；纯 Dijkstra/BFS 则会按层铺满整个连通区域。A* 的方向感全部来自这个不会高估的 h。"
    ]
   }
  },
  "bellman-ford": {
   "brute": "先想暴力解：对每对起点终点用深度优先搜索枚举所有简单路径取最小，路径数指数级；负权边让「绕远反而更近」成为常态，剪枝也很难做对。关键观察是：最短路最多含 n-1 条边，可以按边数分层推进——每轮把全部边松弛一遍，第 k 轮结束后所有用不超过 k 条边的最短路都已收敛；跑满 n-1 轮必然得到答案，且不依赖边的处理顺序。",
   "bruteCode": "def brute(n, edges, start, target):\n    best = [None]\n\n    def dfs(node, cost, visited):\n        if node == target:\n            if best[0] is None or cost < best[0]:\n                best[0] = cost\n            return\n        for u, v, w in edges:\n            if u == node and v not in visited:\n                visited.add(v)\n                dfs(v, cost + w, visited)\n                visited.discard(v)\n\n    dfs(start, 0, {start})\n    return -1 if best[0] is None else best[0]",
   "walkthrough": {
    "input": "n=4，start=0，target=3，edges = [[0,1,4],[0,2,5],[1,2,-3],[2,3,2]]",
    "steps": [
     "初始 dist=[0,∞,∞,∞]。第 1 轮扫边：松 (0,1,4) 得 dist[1]=4，松 (0,2,5) 得 dist[2]=5。",
     "同一轮继续：松 (1,2,-3)：4-3=1 < 5 → dist[2]=1；紧接松 (2,3,2)：1+2=3 → dist[3]=3。一轮之内完成了 0→1→2→3 的接力传播。",
     "第 2 轮再扫全部边：没有任何 candidate 小于现有 dist，changed=False → 提前结束（最坏要扫 n-1=3 轮）。",
     "答案 dist[3]=3：路径 0→1→2→3 = 4-3+2=3，优于直连 0→2→3 = 5+2=7；负权边让「先绕行」反而更便宜，这正是 Dijkstra 失效、必须逐轮全边松弛的场景。"
    ]
   }
  },
  "blossom-matching": {
   "brute": "先想暴力解：把每条边「选或不选」全部枚举，检查选出的边集没有共享端点，统计最大规模。边数为 E 时是 2^E 量级，稍大的图就不可算。关键观察是：匹配可经交替路增广逐步扩大——从未匹配点出发沿「未匹配边、已匹配边」交替搜索，终点未匹配就整体翻转，匹配数加一；一般图比二分图多出的奇环情形，用缩花把整个奇环当成一个节点继续搜索。",
   "bruteCode": "from itertools import combinations\n\ndef brute(n, edges):\n    best = 0\n    for size in range(1, len(edges) + 1):\n        for chosen in combinations(edges, size):\n            used = set()\n            ok = True\n            for u, v in chosen:\n                if u in used or v in used:\n                    ok = False\n                    break\n                used.add(u)\n                used.add(v)\n            if ok and size > best:\n                best = size\n    return best",
   "walkthrough": {
    "input": "n=6，edges = [[0,1],[1,2],[2,3],[3,4],[4,2],[3,5]]——2、3、4 构成三角形，0-1-2 是尾巴，3-5 是出口",
    "steps": [
     "贪心先行：v=0 增广得 0-1；v=2 搜索时把 1、3 依次挂上交替树并增广得 2-3。当前匹配 {0-1, 2-3}。",
     "v=4 从未匹配点 4 做根搜索：4→3 是未匹配边，3 已匹配于 2，把偶点 2 入队；继续扫 4 自己的邻居发现 2-4 边——2 和 4 都是树上的偶点，闭合成奇环。",
     "环是三角形 2-3-4（内含已匹配边 2-3），执行缩花：lca 定出花基 4，base[2]=base[3]=4，奇环整体当作一个已匹配的超节点继续长树。",
     "花内偶点 3 继续探索外沿边 3-5：5 未匹配且空闲 → 增广路 4-2-3-5 成立（未、匹、未交替）。",
     "翻转整条路：2-4 与 3-5 变为已匹配，花内旧匹配边 2-3 让出。最终匹配 {0-1, 2-4, 3-5}，大小 3 = ⌊6/2⌋，最优。",
     "若像二分图那样无视「两端都是偶点」的奇环边，这次搜索会卡死在三角形上，匹配停在 2——缩花的本质是把奇环缩成一个可继续扩展的节点。"
    ]
   }
  },
  "boruvka-mst": {
   "brute": "先想暴力解：枚举全部 C(E, V-1) 种选边组合，逐组检查是否连通所有节点且无环，记录总权重最小的一组。组合数随边数指数膨胀，E=20、V=8 时就要验上万组。关键观察是：割性质保证任一分量的最轻出边一定是安全边，于是让所有分量同时各自挑一条最轻出边并行合并，分量数每轮至少减半，O(log V) 轮完成，天然适合并行。",
   "bruteCode": "from itertools import combinations\n\ndef brute(n, edges):\n    best = None\n    for chosen in combinations(edges, n - 1):\n        parent = list(range(n))\n\n        def find(node):\n            while parent[node] != node:\n                parent[node] = parent[parent[node]]\n                node = parent[node]\n            return node\n\n        total = 0\n        ok = True\n        for u, v, w in chosen:\n            ru, rv = find(u), find(v)\n            if ru == rv:\n                ok = False\n                break\n            parent[ru] = rv\n            total += w\n        if ok and (best is None or total < best):\n            best = total\n    return -1 if best is None else best",
   "walkthrough": {
    "input": "n=4，edges = [[0,1,1],[1,2,3],[2,3,2],[0,3,5]]",
    "steps": [
     "第 1 轮：4 个单点分量同时挑最轻出边——分量 {0} 选 0-1(1)，{1} 也选 0-1(1)，{2} 选 2-3(2)（比 1-2 的 3 轻），{3} 选 2-3(2)。",
     "批量合并：0-1(1) 并成 {0,1}，2-3(2) 并成 {2,3}（同一条边被两侧选中只收一次），总权重 3，分量数 4→2。",
     "第 2 轮：分量 {0,1} 的最轻出边是 1-2(3)，分量 {2,3} 也选 1-2(3)。",
     "合并后分量数 1，结束。MST = {0-1(1), 2-3(2), 1-2(3)}，总权重 6；边 0-3(5) 从未进入候选。",
     "两轮就把 4 个点连起来：分量数每轮至少减半，总轮数 O(log V)——这是经典 MST 算法里唯一「所有分量同时动」的一个。"
    ]
   }
  },
  "chu-liu-edmonds": {
   "brute": "先想暴力解：给每个非根节点从指向它的边里挑一条入边，枚举全部组合，检查是否构成根可达、无环的树形图，取总权重最小。组合数是各节点入度之积，指数级。关键观察是：先让每个非根点直接选最轻入边，唯一障碍是这些边可能首尾相接形成根进不去的有向环——把环缩成超级节点，用「外部入边权减去环内被替掉的入边权」衡量改道附加成本，在缩并图上递归求解。",
   "bruteCode": "from itertools import product\n\ndef brute(n, root, edges):\n    options = {}\n    for u, v, w in edges:\n        if u != v and v != root:\n            options.setdefault(v, []).append((u, w))\n    if len(options) < n - 1:\n        return None\n    keys = sorted(options)\n    best = None\n    for picks in product(*[options[k] for k in keys]):\n        parent = dict(zip(keys, [p[0] for p in picks]))\n        total = sum(p[1] for p in picks)\n        ok = True\n        for v in keys:\n            node, steps = v, 0\n            while node != root and node in parent and steps < n:\n                node = parent[node]\n                steps += 1\n            if node != root:\n                ok = False\n                break\n        if ok and (best is None or total < best):\n            best = total\n    return best",
   "walkthrough": {
    "input": "n=4，root=0，edges = [[0,1,5],[1,2,1],[2,1,1],[2,3,1],[1,3,10]]",
    "steps": [
     "第一轮为每个非根点选最轻入边：1←2(1)（0→1 的 5 更贵）、2←1(1)、3←2(1)（1→3 的 10 被淘汰），共 3 条边、累计 3。",
     "检查所选边：1←2 与 2←1 首尾相接构成有向环 {1,2}，根 0 无法进入 → 必须缩并成超级节点 S。",
     "重标外部入边：0→1 的权 5 减去 1 已选入边权 1 → 附加成本 4，即「打破环、改从 0 进入」要多付的钱；环内边 1→2、2→1 直接丢弃。",
     "缩并图 {0, S, 3} 上再选最轻入边：S←0(4)、3←S(1)，无环 → 求解完成。",
     "展开：进入环的边取 0→1(5)，环内保留 1→2(1)，环出口 2→3(1)。总成本 3+4=7；另一选择 2←1 只会形成同样的环，打破后节点 2 将失去入边，不可行。"
    ]
   }
  },
  "dijkstra": {
   "brute": "先想暴力解：求单源最短路就枚举从起点出发的所有路径，取各终点最小的那条，路径数指数级。关键观察是：边权非负时，未确定节点中 dist 最小的那个已经不可能再被改善，可以安全固定——用它的出边去更新邻居，这就是「贪心固定 + 松弛」。",
   "walkthrough": {
    "input": "有向带权图：A→B(1)，A→C(4)，B→C(2)，B→D(6)，C→D(3)，求 A 到各点的最短路",
    "steps": [
     "初始化 dist：A=0，B、C、D 均为无穷。固定 dist 最小的 A：松弛出边得 dist[B]=1，dist[C]=4。",
     "未固定中 dist 最小的是 B(1)，固定 B：松弛 B→C，1+2=3 < 4，dist[C] 更新为 3；松弛 B→D，1+6=7，dist[D]=7。",
     "未固定中最小的是 C(3)，固定 C：松弛 C→D，3+3=6 < 7，dist[D] 更新为 6。",
     "最后固定 D(6)。答案：A 到 B、C、D 的最短距离分别为 1、3、6。",
     "每个节点只固定一次、每条边至多被松弛一次，用堆取最小节点，总复杂度 O((V+E) log V)。注意：若有负权边，「dist 最小即可固定」不再成立，需换 Bellman-Ford。"
    ]
   }
  },
  "dinic": {
   "brute": "先想暴力解：反复用深度优先搜索随便找一条从源到汇仍有残量的路径，推掉瓶颈流量，直到无路可推。路径选择没有章法，增广次数缺少好的上界，容量大时可能非常慢。关键观察是：先用 BFS 给残量网络分层，只允许沿层次加一的边推进，再用 DFS 在一轮里一口气找出阻塞流——多条路径一次推完，且每轮之后最短增广路长度严格增加，轮数不超过 V。",
   "bruteCode": "def brute(n, edges, source, sink):\n    capacity = [[0] * n for _ in range(n)]\n    for u, v, c in edges:\n        capacity[u][v] += c\n    flow = 0\n\n    def dfs(node, bottleneck, visited):\n        if node == sink:\n            return bottleneck\n        visited[node] = True\n        for nxt in range(n):\n            if not visited[nxt] and capacity[node][nxt] > 0:\n                pushed = dfs(nxt, min(bottleneck, capacity[node][nxt]), visited)\n                if pushed > 0:\n                    capacity[node][nxt] -= pushed\n                    capacity[nxt][node] += pushed\n                    return pushed\n        return 0\n\n    while True:\n        pushed = dfs(source, float(\"inf\"), [False] * n)\n        if pushed == 0:\n            break\n        flow += pushed\n    return flow",
   "walkthrough": {
    "input": "n=4，source=0，sink=3，edges = [[0,1,3],[0,2,2],[1,2,1],[1,3,2],[2,3,2]]",
    "steps": [
     "第 1 轮 BFS 分层：level[0]=0，level[1]=level[2]=1，level[3]=2。",
     "DFS 找阻塞流：第一条 0→1→2→3，瓶颈被 1→2 的容量 1 卡住，推 1；1→2 打满后回头走 0→1→3，推 2；再走 0→2→3，推 1。一轮共推 4，恰好填满汇点全部入边容量 2+2。",
     "游标数组记住每个点扫到了哪条边：1→2 变成死边之后不再重复扫，这就是当前弧优化。",
     "第 2 轮 BFS：1→3、2→3 残量都为 0，level[3] 无法赋值 → 无增广路，结束，最大流 4。",
     "最小割验证：割 {0,1,2}|{3} 容量 = 2+2 = 4，等于流值；Dinic 用不超过 V 轮「分层 + 阻塞流」替代逐条路增广。"
    ]
   }
  },
  "edmonds-karp": {
   "brute": "先想暴力解：像朴素 Ford-Fulkerson 那样任意找一条源到汇的残量路径就推瓶颈流，直到无路可推。选路毫无章法时增广次数没有多项式保证，极端构造下会很慢。关键观察是：把「任意找路」换成 BFS 找边数最少的增广路，每条边最多在正反两个方向上各当一次瓶颈，增广次数被压进 O(VE)，整体 O(VE²)。",
   "bruteCode": "def brute(n, edges, source, sink):\n    capacity = [[0] * n for _ in range(n)]\n    for u, v, c in edges:\n        capacity[u][v] += c\n\n    def find_path():\n        parent = [-1] * n\n        parent[source] = source\n        stack = [source]\n        while stack and parent[sink] == -1:\n            u = stack.pop()\n            for v in range(n):\n                if parent[v] == -1 and capacity[u][v] > 0:\n                    parent[v] = u\n                    stack.append(v)\n        if parent[sink] == -1:\n            return None\n        path = []\n        v = sink\n        while v != source:\n            path.append((parent[v], v))\n            v = parent[v]\n        return path\n\n    flow = 0\n    while True:\n        path = find_path()\n        if path is None:\n            break\n        bottleneck = min(capacity[u][v] for u, v in path)\n        for u, v in path:\n            capacity[u][v] -= bottleneck\n            capacity[v][u] += bottleneck\n        flow += bottleneck\n    return flow",
   "walkthrough": {
    "input": "n=4，source=0，sink=3，edges = [[0,1,2],[0,2,2],[1,3,1],[2,3,3]]",
    "steps": [
     "第 1 轮 BFS：从 0 出发先发现 1、2（都是第 1 层），再从 1 发现 3 → 最短增广路 0→1→3，瓶颈 = min(2,1)=1，流量 1。",
     "更新残量：0→1 剩 1、1→3 剩 0，反向 1→0、3→1 各记 1。",
     "第 2 轮 BFS：1→3 已断，最短路变为 0→2→3，瓶颈 = min(2,3)=2，流量累计 3；0→2 剩 0、2→3 剩 1。",
     "第 3 轮 BFS：0 只能到 1（残量 1），1→3 残量 0，汇点不可达 → 结束，最大流 3。",
     "下界验证：割 {0,1}|{2,3} 容量 = 0→2 的 2 + 1→3 的 1 = 3，恰好等于流值；BFS 选最短路正是收敛性的来源。"
    ]
   }
  },
  "floyd-warshall": {
   "brute": "先想暴力解：对每一对节点单独跑一次最短路算法（如 Dijkstra），n 个节点要跑 n 遍单源计算，稠密图上总代价 O(n²·(n+E))，代码还要重复调用 n 次。关键观察是：全源距离可装进一张 n×n 矩阵，用「逐步放开中转点」的动态规划统一解决——只允许中转 0..k 时 d[i][j] 只依赖 k-1 时的两个子问题，一遍三重循环就从「只准直达」推到「任意中转」。",
   "bruteCode": "import heapq\n\ndef brute(matrix):\n    n = len(matrix)\n    result = []\n    for source in range(n):\n        graph = [[] for _ in range(n)]\n        for u in range(n):\n            for v in range(n):\n                if matrix[u][v] != -1 and u != v:\n                    graph[u].append((v, matrix[u][v]))\n        dist = [None] * n\n        dist[source] = 0\n        heap = [(0, source)]\n        while heap:\n            d, node = heapq.heappop(heap)\n            if d > dist[node]:\n                continue\n            for nxt, weight in graph[node]:\n                nd = d + weight\n                if dist[nxt] is None or nd < dist[nxt]:\n                    dist[nxt] = nd\n                    heapq.heappush(heap, (nd, nxt))\n        result.append([-1 if value is None else value for value in dist])\n    return result",
   "walkthrough": {
    "input": "matrix = [[0,2,10,-1],[-1,0,3,7],[-1,-1,0,1],[-1,-1,-1,0]]，-1 表示无边",
    "steps": [
     "初始化：d[0][1]=2、d[1][2]=3、d[0][2]=10、d[2][3]=1、d[1][3]=7 写入矩阵，对角线 0，其余 -1 表示无穷。",
     "k=0（允许中转 0）：没有任何点能先到 0 再出发（0 的入边为空），矩阵不动。",
     "k=1（允许中转 1）：d[0][1]+d[1][2]=2+3=5 < 10 → d[0][2] 降为 5；d[0][1]+d[1][3]=2+7=9 < ∞ → d[0][3] 先变 9。",
     "k=2（允许中转 2）：d[0][2]+d[2][3]=5+1=6 < 9 → d[0][3] 再降为 6；d[1][2]+d[2][3]=3+1=4 < 7 → d[1][3] 降为 4。",
     "k=3 无更新。最终 0→3=6（0→1→2→3），比经 1 直达 3 的 9 更省；一次三重循环同时得到全部节点对的距离。"
    ]
   }
  },
  "gomory-hu-tree": {
   "brute": "先想暴力解：对全部 V(V-1)/2 个点对各跑一次最大流求最小割，n=100 时要跑约 5000 次网络流，代价难以接受。关键观察是：无向图最小割自带层次结构——某次 s-t 最小割把顶点分成两半后，与 s 同侧的点对的最小割不会跨过这次划分。于是只需 V-1 次最大流：每次对 (s, parent[s]) 求割并记下割值，再用残量网络中源点可达集合把同侧顶点改挂到 s，一棵带权树就能回答任意点对。",
   "bruteCode": "from collections import deque\n\ndef brute(n, edges):\n    capacity = [[0] * n for _ in range(n)]\n    for u, v, c in edges:\n        capacity[u][v] += c\n        capacity[v][u] += c\n\n    def mincut(source, sink):\n        cap = [row[:] for row in capacity]\n        total = 0\n        while True:\n            parent = [-1] * n\n            parent[source] = source\n            queue = deque([source])\n            while queue and parent[sink] == -1:\n                u = queue.popleft()\n                for v in range(n):\n                    if parent[v] == -1 and cap[u][v] > 0:\n                        parent[v] = u\n                        queue.append(v)\n            if parent[sink] == -1:\n                break\n            bottleneck = float(\"inf\")\n            v = sink\n            while v != source:\n                bottleneck = min(bottleneck, cap[parent[v]][v])\n                v = parent[v]\n            v = sink\n            while v != source:\n                cap[parent[v]][v] -= bottleneck\n                cap[v][parent[v]] += bottleneck\n                v = parent[v]\n            total += bottleneck\n        return total\n\n    cuts = {}\n    for a in range(n):\n        for b in range(a + 1, n):\n            cuts[(a, b)] = mincut(a, b)\n    return cuts",
   "walkthrough": {
    "input": "n=4 的链图，edges = [[0,1,2],[1,2,3],[2,3,1]]（无向容量）",
    "steps": [
     "初始化 parent=[0,0,0,0]：1、2、3 都暂挂在根 0 下，总共只需 V-1=3 次最大流。",
     "v=1 对 (1, 0) 求最小割：唯一通道 1→0，容量 2 → 树边记 2；残量网络里 1 仍可达 2（1-2 容量 3）和 3 → 与 1 同侧的 2、3 改挂到 1。",
     "v=2 对 (2, 1) 求割：通道 2→1 容量 3 → 树边记 3；残量里 2 只能到 3（2→1 已满）→ 3 改挂到 2。",
     "v=3 对 (3, 2) 求割：通道 2→3 容量 1 → 树边记 1。",
     "割树为 0—1(2)—2(3)—3(1)，与原链同形。任意点对最小割 = 树路径最小边权：cut(0,3)=min(2,3,1)=1，cut(0,2)=2，cut(1,3)=1——3 次最大流替代了 6 次。"
    ]
   }
  },
  "hopcroft-karp": {
   "brute": "先想暴力解：对每个空闲左部点单独做一次 DFS 增广（Kuhn 算法），一次只找一条增广路，找到就翻转。单次 O(E)、最多 V 次，总 O(V·E)，数据一大就吃力。关键观察是：先把交替图按「未匹配边、已匹配边」分层，最短增广路长度一旦确定，就沿这些层一口气翻转一批互不干扰的增广路；每轮之后最短增广路严格变长，轮数只有 O(√V)。",
   "bruteCode": "def brute(left, right, edges):\n    adj = [[] for _ in range(left)]\n    for l, r in edges:\n        adj[l].append(r)\n    match_r = [-1] * right\n\n    def try_kuhn(u, visited):\n        for v in adj[u]:\n            if v in visited:\n                continue\n            visited.add(v)\n            if match_r[v] == -1 or try_kuhn(match_r[v], visited):\n                match_r[v] = u\n                return True\n        return False\n\n    matching = 0\n    for u in range(left):\n        if try_kuhn(u, set()):\n            matching += 1\n    return matching",
   "walkthrough": {
    "input": "左部 {0,1,2}，右部 {0,1,2}，edges = [[0,0],[0,1],[1,1],[1,2],[2,0]]",
    "steps": [
     "第 1 轮 BFS：所有左点空闲、层次全为 0，每个右点都还没有匹配对象 → 本轮存在长度 1 的增广路。",
     "DFS 批量增广：左 0 配右 0、左 1 配右 1，匹配数 2；左 2 想走 2-0，但右 0 的对象左 0 层次是 0，与左 2 同层、不满足「层次差恰好 1」，本条失败。",
     "第 2 轮 BFS 从空闲的左 2 分层：左2(0) → 右0 → 左0(1) → 右1 → 左1(2) → 右2 空闲，找到一条更长的交替链。",
     "DFS 沿链一次翻转三段：左 1 从右 1 改配右 2，左 0 从右 0 改配右 1，左 2 新配右 0。匹配数 2→3。",
     "第 3 轮 BFS 无空闲左点 → 结束，返回 3（完美匹配）。轮次间最短增广路长度严格递增，总轮数 O(√V)。"
    ]
   }
  },
  "johnson-algorithm": {
   "brute": "先想暴力解：对每个查询点对单独跑一次支持负权的 Bellman-Ford，单次 O(VE)，q 个查询就是 O(qVE)。关键观察是：负权可以被「重标」吸收——先按 Bellman-Ford 求势能 h，把每条边改成 w' = w + h[u] - h[v]，任意路径的权值改变量只依赖端点，相对大小不变且 w' 全部非负；之后每个查询用 Dijkstra 完成，再把势能差减回去还原真实距离。",
   "bruteCode": "def brute(n, edges, source, target):\n    inf = float(\"inf\")\n    dist = [inf] * n\n    dist[source] = 0\n    for _ in range(n - 1):\n        changed = False\n        for u, v, w in edges:\n            if dist[u] != inf and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                changed = True\n        if not changed:\n            break\n    return None if dist[target] == inf else dist[target]",
   "walkthrough": {
    "input": "n=3，edges = [[0,1,4],[1,2,-2],[0,2,7]]，queries = [[0,2],[1,2],[2,0]]",
    "steps": [
     "势能 h 从全 0 开始按 Bellman-Ford 松弛：第 1 轮 (1,2,-2) 使 h[2]=-2，其余不动；第 2 轮无更新 → h=[0,0,-2]。",
     "重标 w' = w + h[u] - h[v]：w'(0,1)=4、w'(1,2)=-2+0-(-2)=0、w'(0,2)=7+0+2=9，全部非负，Dijkstra 的前提成立。",
     "查询 (0,2)：Dijkstra 得 dist'[2]=4（0→1→2：4+0；直连 9 更贵），还原真实距离 4-h[0]+h[2]=2，即 0→1→2 = 4-2=2。",
     "查询 (1,2)：dist'[2]=0（重标后这条边权恰为 0），还原 0-0+(-2)=-2。",
     "查询 (2,0)：节点 2 无出边，不可达 → 返回 None。负权信息全部被势能吸收，每次查询只剩非负图上的 Dijkstra。"
    ]
   }
  },
  "kruskal-mst": {
   "brute": "先想暴力解：枚举全部 C(E, V-1) 种选边组合，逐组检查恰好连通 n 个节点且无环，取总权重最小，组合数指数级。关键观察是：把边按权重从小到大排序后逐条审视——两端不连通时加入绝不会成环（环性质），而它恰是分开两个分量的最轻割边（割性质），所以「不同分量就合并」的贪心每一步都安全。",
   "bruteCode": "def brute(n, edges):\n    edges = sorted(edges, key=lambda e: e[2])\n    best = [None]\n\n    def search(index, chosen, parent, total):\n        if len(chosen) == n - 1:\n            if best[0] is None or total < best[0]:\n                best[0] = total\n            return\n        if index == len(edges):\n            return\n        u, v, w = edges[index]\n        if parent[u] != parent[v]:\n            merged = parent[:]\n            old, new = parent[u], parent[v]\n            for i in range(n):\n                if merged[i] == old:\n                    merged[i] = new\n            search(index + 1, chosen + [(u, v, w)], merged, total + w)\n        search(index + 1, chosen, parent, total)\n\n    search(0, [], list(range(n)), 0)\n    return -1 if best[0] is None else best[0]",
   "walkthrough": {
    "input": "n=4，edges = [[0,1,1],[1,2,3],[2,3,2],[1,3,4],[0,3,5]]",
    "steps": [
     "排序后边序：(0-1,1)、(2-3,2)、(1-2,3)、(1-3,4)、(0-3,5)。",
     "取 0-1(1)：两端根不同 → 合并，总 1；取 2-3(2)：合并，总 3。此时分量 {0,1} 与 {2,3}。",
     "取 1-2(3)：跨分量 → 合并，总 6，已用 3 = n-1 条边。",
     "检查 1-3(4)：find(1) 与 find(3) 已同根，加它会成环 → 跳过；0-3(5) 同理跳过。",
     "总权重 6。暴力要验证 C(5,3)=10 种组合；这里只做一次排序加 3 次合并、2 次拒绝。"
    ]
   }
  },
  "prim-mst": {
   "brute": "先想暴力解：枚举全部 C(E, V-1) 种边组合，检查恰好连通且无环，取总权重最小，组合数指数级。关键观察是：树可以从一个点「长」出来——割性质保证任意时刻树内集合到树外的最轻割边必属于某棵最小生成树，于是每轮把最轻跨割边连同外端点收进树里，n-1 轮完成；用堆维护跨割候选，每轮 O(log E) 取到最轻边。",
   "bruteCode": "def brute(n, edges):\n    m = len(edges)\n    best = None\n    for mask in range(1 << m):\n        if bin(mask).count(\"1\") != n - 1:\n            continue\n        parent = list(range(n))\n\n        def find(node):\n            while parent[node] != node:\n                parent[node] = parent[parent[node]]\n                node = parent[node]\n            return node\n\n        total, ok = 0, True\n        for i in range(m):\n            if mask >> i & 1:\n                u, v, w = edges[i]\n                ru, rv = find(u), find(v)\n                if ru == rv:\n                    ok = False\n                    break\n                parent[ru] = rv\n                total += w\n        if ok and (best is None or total < best):\n            best = total\n    return -1 if best is None else best",
   "walkthrough": {
    "input": "n=4，edges = [[0,1,4],[0,2,1],[1,2,2],[1,3,5],[2,3,8]]",
    "steps": [
     "起点 0 以权重 0 入堆并弹出，加入树；它的跨割边 (4,1)、(1,2) 进堆。",
     "弹出最小 (1,2)：节点 2 入树，总 1；2 的邻居里 (4,0) 因 0 已在树中被跳过，(2,1)、(8,3) 进堆。",
     "弹出 (2,1)：1 入树，总 3；1 的跨割边只有 (5,3) 进堆。",
     "弹出 (4,1)：1 已在树中，这是过期条目，直接跳过；再弹出 (5,3)：3 入树，总 8，4 个节点全部入树。",
     "得到 MST 边集 {0-2(1), 2-1(2), 1-3(5)}，总 8；若改用 0-1(4) 这条边，总重变 10，更差。"
    ]
   }
  },
  "push-relabel": {
   "brute": "先想暴力解：枚举每条边流量的全部取值组合，逐组检查容量与守恒约束，在可行组合里找汇点净流入最大者——边一多组合就爆炸。关键观察是：可以允许中途暂不守恒——先把源点出边一次推满形成预流，超额流量暂存在节点余量 excess 里；每次要么沿「高度恰好低一」的边把余量推出去，要么把自己抬到最低残量邻居高一，余量最终全部汇入汇点或退回源点。",
   "bruteCode": "from itertools import product\n\ndef brute(n, edges, source, sink):\n    best = 0\n    ranges = [range(c + 1) for _, _, c in edges]\n    for flows in product(*ranges):\n        balance = [0] * n\n        for (u, v, _), f in zip(edges, flows):\n            balance[u] -= f\n            balance[v] += f\n        if any(balance[i] != 0 for i in range(n) if i != source and i != sink):\n            continue\n        if balance[sink] > best:\n            best = balance[sink]\n    return best",
   "walkthrough": {
    "input": "n=4，source=0，sink=3，edges = [[0,1,3],[0,2,1],[1,3,2],[2,3,2]]",
    "steps": [
     "预流初始化：height[0]=4；源点出边一次推满——0→1 推 3、0→2 推 1，excess[1]=3、excess[2]=1、excess[0]=-4，1 和 2 进入活跃队列。",
     "处理 1（height 0）：没有「高度差恰好 1」的合法边 → 重标到 1（残量邻居最低是 0 层的汇点），随后沿 1→3 推 2（被容量 2 卡满），excess[3]=2、excess[1]=1。",
     "1→3 已饱和，1 的唯一残量邻居是 height=4 的源点 → 重标 height[1]=5，把剩下 1 单位沿 1→0 推回源点，excess[1] 清零。",
     "处理 2：重标 height[2]=1，沿 2→3 推 1，excess[3]=3、excess[2] 清零。",
     "队列空 → 返回 excess[3]=3。验证：割 {0,1}|{2,3} 容量 = 0→2 的 1 + 1→3 的 2 = 3；重标把卡住的节点抬高，让余量最终「下山」入海。"
    ]
   }
  },
  "stoer-wagner-min-cut": {
   "brute": "先想暴力解：枚举把顶点分成两个非空集合的所有划分（每个点选哪一侧），对每种划分加总跨边权取最小——2^(n-1) 种划分，n=30 已是五亿量级。关键观察是：不必枚举所有割——每轮最大邻接搜索都能免费产出一个可靠割候选：最后加入的顶点 t 到已选集合的累计边权就是某个 s-t 最小割；把 t 缩并到倒数第二个顶点 s 后继续，V-1 轮必覆盖全局最优割。",
   "bruteCode": "def brute(n, edges):\n    weights = [[0] * n for _ in range(n)]\n    for u, v, w in edges:\n        weights[u][v] += w\n        weights[v][u] += w\n    best = None\n    for mask in range(1 << n):\n        if mask == 0 or mask == (1 << n) - 1 or mask & 1:\n            continue\n        total = 0\n        for u in range(n):\n            for v in range(u + 1, n):\n                if ((mask >> u) & 1) != ((mask >> v) & 1):\n                    total += weights[u][v]\n        if best is None or total < best:\n            best = total\n    return best",
   "walkthrough": {
    "input": "n=4，edges = [[0,1,1],[1,2,5],[2,3,1],[3,0,5],[0,2,3]]",
    "steps": [
     "相位 1 最大邻接搜索（从 0 开始）：连接权初值 {1:1, 2:3, 3:5} → 选 3；并入后 2 的权加 w(3,2)=1 变 4 → 选 2；并入后 1 的权加 w(2,1)=5 变 6 → 选 1。顺序 0→3→2→1。",
     "最后加入的 t=1，它到已选集合的累计边权 6 就是本相位候选割 → best=6；把 s=2 与 t=1 缩并：w(2,0)=3+1=4，w(2,3)=1+0=1。",
     "相位 2（图 {0,2,3}）：权初值 {2:4, 3:5} → 选 3，2 的权加 1 变 5 → 选 2。t=2 的候选割 = 4+1=5 → best 降为 5；缩并 3 与 2。",
     "相位 3（图 {0,3}）：唯一候选割 9，不再更新。三相位取最小 → 全局最小割 5。",
     "验证：划分 {0,3}|{1,2} 的跨边 0-1(1)、0-2(3)、2-3(1)，权和恰为 5；暴力要枚举 2³=8 种划分，这里 3 个相位、每个 O(V²) 就锁定了它。"
    ]
   }
  },
  "tarjan-scc": {
   "brute": "先想暴力解：求强连通分量，朴素做法是对每对节点分别验证「互相可达」，每对都要遍历图，总体高到 O(V^2·(V+E))；即使用两遍 DFS 的 Kosaraju，也要先正图再反图跑两次。关键观察是：一次 DFS 中，沿搜索树能走回的祖先记录在 lowlink 里，栈保存当前路径——当某节点 low 等于自己的时间戳时，栈中它以上的部分恰好构成一个强连通分量。",
   "walkthrough": {
    "input": "有向边：1→2，2→3，3→1，3→4（1、2、3 成环，4 独立）",
    "steps": [
     "DFS 进入 1：时间戳 dfn[1]=low[1]=1，1 入栈。",
     "进入 2：dfn[2]=low[2]=2，入栈；进入 3：dfn[3]=low[3]=3，入栈。",
     "3 有一条边指向 1，而 1 仍在栈中（是当前路径的祖先），于是 low[3] 更新为 dfn[1]=1。",
     "回溯：low[3]=1 传给 2，low[2]=1；再传给 1。回到 1 时 low[1]==dfn[1]，1 是该分量的根，把栈中 3、2、1 弹出，得到分量 {1,2,3}。",
     "继续 DFS 进入 4：没有指向栈内节点的回边，low[4]==dfn[4]=4，4 单独弹出成 {4}。一次 DFS 完成，O(V+E)。"
    ]
   }
  },
  "tower-of-hanoi": {
   "brute": "先想暴力解：把「3 根柱子、n 个盘」的所有合法盘面建成状态图，从初始状态广度优先搜索到目标状态的最短移动序列。状态数 3ⁿ，n=10 约 5.9 万，n=20 就完全撑不住。关键观察是：移动 n 个盘的唯一途径是先把上方 n-1 个盘挪到辅助柱、把最大盘移到目标柱、再把 n-1 个盘挪过去——递归式 move(n)=2·move(n-1)+1 直接构造出 2ⁿ-1 步最优解。",
   "bruteCode": "from collections import deque\n\ndef brute(n):\n    start = (tuple(range(n, 0, -1)), (), ())\n    goal = ((), (), tuple(range(n, 0, -1)))\n    queue = deque([(start, 0)])\n    seen = {start}\n    while queue:\n        pegs, depth = queue.popleft()\n        if pegs == goal:\n            return depth\n        for i in range(3):\n            if not pegs[i]:\n                continue\n            disk = pegs[i][-1]\n            for j in range(3):\n                if i == j or (pegs[j] and pegs[j][-1] < disk):\n                    continue\n                nxt = [list(p) for p in pegs]\n                nxt[i].pop()\n                nxt[j].append(disk)\n                state = tuple(tuple(p) for p in nxt)\n                if state not in seen:\n                    seen.add(state)\n                    queue.append((state, depth + 1))\n    return -1",
   "walkthrough": {
    "input": "n=3，三根柱 A、B、C，3 个圆盘全部初始在 A",
    "steps": [
     "递归分解 move(3, A, B, C)：先把 A 顶部的 2 个盘整体搬到辅助柱 B（子调用 move(2, A, C, B)），再把最大盘 3 号 A→C，最后把 B 上的 2 个盘搬到 C。",
     "子问题 move(2, A, C, B) 又拆成：1 号 A→C、2 号 A→B、1 号 C→B。",
     "前半段执行完，A 上只剩 3 号盘，B 上从下到上是 2、1。",
     "执行 3 号 A→C，随后 move(2, B, A, C) 给出：1 号 B→A、2 号 B→C、1 号 A→C。",
     "完整序列：A→C, A→B, C→B, A→C, B→A, B→C, A→C，共 7 = 2³-1 步；每一步后各柱从上到下仍保持小盘在上，不变量始终成立。"
    ]
   }
  },
  "knights-tour": {
   "brute": "先想暴力解：从起点做回溯搜索——每步尝试 8 个方向的合法跳法，走满 n² 格成功，走不动就撤销上一步换方向。决策树 8^(n²-1) 量级，5×5 也要靠剪枝硬熬，再大就跑不动。关键观察是：与其盲目回溯，不如用 Warnsdorff 法则——每步优先跳向「后续出路最少」的格子，先把难走的角落占掉，5×5 棋盘几乎一次就能走完全程而不需要撤销。",
   "bruteCode": "def brute(n, start):\n    moves = ((1, 2), (2, 1), (2, -1), (1, -2), (-1, -2), (-2, -1), (-2, 1), (-1, 2))\n    visited = [[False] * n for _ in range(n)]\n    tour = []\n\n    def dfs(r, c):\n        visited[r][c] = True\n        tour.append((r, c))\n        if len(tour) == n * n:\n            return True\n        for dr, dc in moves:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:\n                if dfs(nr, nc):\n                    return True\n        visited[r][c] = False\n        tour.pop()\n        return False\n\n    return [list(cell) for cell in tour] if dfs(start[0], start[1]) else None",
   "walkthrough": {
    "input": "5×5 棋盘，起点 (0,0)",
    "steps": [
     "(0,0) 的两个候选 (1,2)、(2,1) 的后续出路都是 5，平手取先扫描到的 (1,2)。",
     "在 (1,2) 比较五个候选的出路数：(2,4)→3、(3,3)→3、(3,1)→3、(2,0)→3、(0,4)→1 → 选出路最少的 (0,4)。",
     "(0,4) 只剩 (2,3) 一个未访问邻居，走过去；在 (2,3) 的五个候选中 (4,4) 出路只有 1 → 选它。",
     "(4,4) 唯一去向是 (3,2)；在 (3,2) 的五个候选里 (4,0) 出路只有 1 → 选它；随后一路 (2,1)→(3,3)→(4,1)→(2,0)→(0,1)→(1,3)→(3,4)→(4,2)→(3,0)→(1,1)→(0,3)→(2,4)→(4,3)→(3,1)→(1,0)→(2,2)→(1,4)→(0,2)。",
     "全程 25 格一次走完、0 次回撤；纯回溯要面对 8^24 量级的决策树。",
     "Warnsdorff 是启发式而非保证：极端输入上也可能中途无路，此时本实现出路全被占满就直接返回 None。"
    ]
   }
  },
  "sudoku-backtracking": {
   "brute": "先想暴力解：对 m 个空格枚举 1~n 的全部取值组合，共 n^m 种完整填法，逐一检查整张盘面是否合法；绝大多数尝试在很靠前的空格上就已冲突，却仍要填完整张盘才被判废。关键观察：合法性可以增量判断——每放一个数字，只查它所在行、列、宫有没有重复，冲突就当场放弃该分支、撤销这个数字换下一个候选，这正是 solution.py 里 placeable 加 backtrack 的回溯骨架。",
   "bruteCode": "from itertools import product\n\n\ndef brute(grid):\n    n = len(grid)\n    cells = [(r, c) for r in range(n) for c in range(n) if grid[r][c] == 0]\n\n    def valid(g):\n        for r in range(n):\n            for c in range(n):\n                v = g[r][c]\n                if any(g[r][i] == v and i != c for i in range(n)):\n                    return False\n                if any(g[i][c] == v and i != r for i in range(n)):\n                    return False\n                br, bc = r - r % 2, c - c % 2\n                for i in range(br, br + 2):\n                    for j in range(bc, bc + 2):\n                        if (i, j) != (r, c) and g[i][j] == v:\n                            return False\n        return True\n\n    for combo in product(range(1, n + 1), repeat=len(cells)):\n        g = [row[:] for row in grid]\n        for (r, c), v in zip(cells, combo):\n            g[r][c] = v\n        if valid(g):\n            return g\n    return None",
   "walkthrough": {
    "input": "grid = [[1,2,3,4],[3,4,0,2],[2,0,4,0],[0,3,2,1]]（4×4 数独，0 为空格，共 4 个空格）",
    "steps": [
     "按行优先找到第一个空格 (1,2)，候选 1~4 逐个试：1 在行、列、右上宫（含 3、4、2）都不冲突，placeable 通过，放入 grid[1][2]=1。",
     "下一个空格 (2,1)：试 1——行 [2,_,4,_]、列 [2,4,_,3]、左下宫 [2,_,_,3] 都没有 1，放入。",
     "空格 (2,3)：试 1 与行中已有的 1 冲突、试 2 与列 3 已有的 2 冲突，都被当场否决；试 3 无冲突，放入。",
     "空格 (3,0)：1、2、3 分别与列 0 已有的 1、3、2 冲突，试 4 通过，放入后整盘再无空格。",
     "递归逐层返回，解得 [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]；全程 4 次放置、5 次候选被立即否决，冲突分支在最深处只多花一次判断就被撤销。"
    ]
   }
  },
  "graph-coloring": {
   "brute": "先想暴力解：枚举 k^n 种染色方案，逐一检查每条边两端颜色是否不同，绝大多数方案在前几条边上就已冲突却仍被完整枚举。关键观察：按固定顺序逐个节点上色，每到一站只收集已染色邻居占用的颜色构成 forbidden 集合，跳过它们再试；k 种颜色全被禁用就回溯改上一个节点。再按度数从大到小安排上色顺序，让约束最紧的节点先定色，冲突暴露得更早——这正是 solution.py 的 search 骨架。",
   "bruteCode": "from itertools import product\n\n\ndef brute(n, k, edges):\n    for combo in product(range(k), repeat=n):\n        if all(combo[a] != combo[b] for a, b in edges):\n            return list(combo)\n    return None",
   "walkthrough": {
    "input": "n = 4，k = 3，edges = [[0,1],[1,2],[2,3],[3,0],[0,2]]（两个三角形共享边 0-2）",
    "steps": [
     "按度数排序：节点 0、2 各 3 条邻边，节点 1、3 各 2 条，染色顺序 order = [0, 2, 1, 3]。",
     "节点 0 没有已染色邻居，直接取色 0。",
     "节点 2 的邻居 {0,1,3} 中已染色的 0 用了色 0，forbidden={0}，取色 1。",
     "节点 1 的邻居 {0,2} 用掉色 0、1，forbidden={0,1}，取色 2；节点 3 的邻居 {2,0} 同样禁 0、1，取色 2，四个节点全部上色，返回 True。",
     "本例一次回溯都没发生；若把 k 改成 2，三角形 0-1-2 无两色可行，search 逐层撤销后返回 False——三角形图至少需要 3 种颜色。"
    ]
   }
  },
  "dancing-links": {
   "brute": "先想暴力解：枚举行集合的全部 2^r 个子集，逐一检查每列是否恰好被一个选中行覆盖，绝大多数组合在中途就出现某列被覆盖两次或零次。关键观察：Algorithm X 每轮挑候选行最少的列，只尝试能覆盖它的行；选中一行后，把它覆盖的所有列连同在这些列上有 1 的其他行一起从子问题中删除，失败时再原样恢复现场换下一行。删除与恢复用双向交叉链表实现就是舞蹈链，本实现用活跃行列集合等价表达同一过程。",
   "bruteCode": "from itertools import combinations\n\n\ndef brute(matrix):\n    rows, cols = len(matrix), len(matrix[0])\n    for size in range(rows + 1):\n        for combo in combinations(range(rows), size):\n            if all(sum(1 for r in combo if matrix[r][c]) == 1 for c in range(cols)):\n                return list(combo)\n    return None",
   "walkthrough": {
    "input": "matrix = [[1,0,0,1],[0,1,1,0],[1,0,1,0],[0,0,0,1]]（行 r0~r3，列 c0~c3）",
    "steps": [
     "初始每列的候选行数：c0=2（r0,r2）、c1=1（r1）、c2=2（r1,r2）、c3=2（r0,r3），Algorithm X 选候选最少的 c1。",
     "c1 只有 r1 能覆盖，选 r1 并执行 cover：它的 1 位于 c1、c2，这两列被删，同时在 c2 上有 1 的 r2 也被删（防止再次覆盖）；剩活跃行 {r0,r3}、活跃列 {c0,c3}。",
     "新目标列：c0 只有 r0 有 1，c3 有 r0、r3 两个候选，取 c0，唯一候选行 r0。",
     "选 r0 覆盖 c0、c3 后活跃列清空，所有列各被恰好一行覆盖，返回解 {r0, r1}。",
     "若目标列有多个候选行，会逐个尝试：每次失败都靠 uncover 精确恢复被删的行列再换下一行，保证搜索状态零污染。"
    ]
   }
  },
  "minimax-alpha-beta": {
   "brute": "先想暴力解：纯 Minimax 把博弈树的所有叶子都评估一遍，再逐层取 MAX/MIN 回传，b 叉 d 层要评估 b^d 个叶子。关键观察：有些分支不可能影响根的选择——若 MAX 层已知能拿到 α，而某个 MIN 节点的最好结果已不超过 α，对手绝不会让局面走进那里，剩余孩子可以整段剪掉。solution.py 在每个节点维护 (α, β) 窗口，一旦 β≤α 就 break，理想分支序下评估量降到 O(b^(d/2))。",
   "bruteCode": "def brute(leaves):\n    def search(lo, hi, maximizing):\n        if hi - lo == 1:\n            return leaves[lo]\n        mid = (lo + hi) // 2\n        if maximizing:\n            return max(search(lo, mid, False), search(mid, hi, False))\n        return min(search(lo, mid, True), search(mid, hi, True))\n\n    return search(0, len(leaves), True)",
   "walkthrough": {
    "input": "leaves = [3, 5, 2, 9]，深度 2 的满二叉博弈树，根为 MAX 层",
    "steps": [
     "根（MAX）先进左子树：MIN 节点评估叶子 3、5（计数 2），取最小回传 3，根的 α 收紧为 3。",
     "根再进右子树：该 MIN 节点带着 (α=3, β=+∞) 评估第一个孩子叶子 2（计数 3），其 β 收紧为 2。",
     "β=2 ≤ α=3 触发剪枝：第二个孩子叶子 9 直接跳过不评估——这个 MIN 节点最多回传 2，根绝不会弃 3 选 2。",
     "右子树回传 2，根在 {3, 2} 中取最大，最终值 3；4 个叶子只评估了 3 个。",
     "树越深剪枝越划算：理想分支排序下评估量从 O(b^d) 降到 O(b^(d/2))，等效于免费加深一倍搜索深度。"
    ]
   }
  },
  "n-queens": {
   "brute": "先想暴力解：枚举 n 个皇后在 n×n 棋盘上的全部 n^n 种摆放，再两两检查是否同列或同对角线，绝大多数摆放早在前几行就注定失败，检查本身还是 O(n²) 一轮。关键观察：逐行放置，每行只试 n 列，用列号、行−列、行+列 三个集合分别挡住同列、主对角线、反对角线冲突，每次判断 O(1)；放置后递归，递归返回前把三个标记撤销，这就是 solution.py 的回溯主循环。",
   "bruteCode": "from itertools import product as product_positions\n\n\ndef brute(n):\n    count = 0\n    for cols in product_positions(range(n), repeat=n):\n        if all(cols[a] != cols[b] and abs(cols[a] - cols[b]) != b - a\n               for a in range(n) for b in range(a + 1, n)):\n            count += 1\n    return count",
   "walkthrough": {
    "input": "n = 4 的棋盘，求全部解的个数",
    "steps": [
     "第 0 行放列 0（三个集合记下列 0、r−c=0、r+c=0）；第 1 行列 0 撞列、列 1 撞主对角线（r−c=0），试到列 2 才放下。",
     "第 2 行四列全冲突：列 0、2 已占，列 1 撞反对角线（r+c=3），列 3 撞主对角线（r−c=−1）→ 回溯撤销第 1 行的列 2，改放列 3。",
     "第 2 行放列 1 后第 3 行又无列可用，继续回溯：第 2、第 1 行也相继耗尽候选，列 0 这棵子树整体宣告失败，第 0 行改放列 1。",
     "第 1 行放列 3、第 2 行放列 0、第 3 行放列 2，row=4 触发终止条件，得到第一组解 [1,3,0,2]（每行皇后所在列）。",
     "回溯继续探出第二组解 [2,0,3,1]，search 最终返回 2；三个集合让每次冲突判断 O(1)，全程无需两两检查皇后。"
    ]
   }
  },
  "suffix-tree": {
   "brute": "先想暴力解：把全部 O(n²) 个子串塞进集合去重，或把 n 个后缀各自完整插入普通 Trie，节点数会退化到 O(n²)，长文本根本存不下。关键观察：后缀之间大量共享前缀——插入时若当前字符与某条已有边的标号在中间分叉，就在分叉点把长边切成两段、长出一个新内部节点，让后来者共享公共前缀；末尾补上终止符 $ 后每个后缀都有专属叶子，整棵压缩 Trie 的节点数与边数都是 O(n)。",
   "bruteCode": "def brute(s):\n    subs = set()\n    for i in range(len(s)):\n        for j in range(i + 1, len(s) + 1):\n            subs.add(s[i:j])\n    return len(subs)",
   "walkthrough": {
    "input": "s = 'aba'（补终止符 $ 后为 aba$，逐个插入后缀 aba$、ba$、a$、$）",
    "steps": [
     "插入 aba$：根下没有 a 开头的边，整串直接挂成一条到叶子的边（标号 aba$）；插入 ba$ 同理挂 b 开头的边。",
     "插入 a$：与已有边 aba$ 共享前缀 a，第 2 个字符分叉（b 对 $），在分叉处把长边切成 a + ba$，切点长出内部节点并挂上 $ 叶子。",
     "插入 $：根下直接新增 $ 边。此时根有 a、b、$ 三条边，内部节点下有 ba$ 与 $ 两条边，共 5 条边、4 个叶子（对应 4 个后缀）。",
     "边标号总长 1+3+1+3+1 = 9；由于 $ 保证后缀两两不同，不同子串数 = 9 − 4 = 5。",
     "正是 aba 的 5 个不同子串 a、b、ab、ba、aba；普通 Trie 存这 4 个后缀要 10 个节点 9 条边，压缩后仅 6 个节点 5 条边。"
    ]
   }
  },
  "suffix-array-lcp": {
   "brute": "先想暴力解：对 n 个后缀按字典序做字符串排序，每次比较最多 O(n)，总代价 O(n² log n)；随后求相邻后缀的 LCP 又要逐对从头比较，同样是平方级。关键观察：倍增排序利用「长度 2k 的名次可由两个长度 k 的名次拼接得到」，每轮 O(n log n) 把已知前缀长度翻倍，log n 轮完成；Kasai 则按原串位置顺序求 LCP，借助相邻位置的后缀公共前缀每次至多缩短 1 的性质复用上一轮的 h，总时间 O(n)。",
   "bruteCode": "def brute(s):\n    n = len(s)\n    sa = sorted(range(n), key=lambda i: s[i:])\n    lcp = [0] * n\n    for k in range(1, n):\n        a, b = sa[k - 1], sa[k]\n        h = 0\n        while a + h < n and b + h < n and s[a + h] == s[b + h]:\n            h += 1\n        lcp[k] = h\n    return {\"sa\": sa, \"lcp\": lcp}",
   "walkthrough": {
    "input": "s = 'banana'（6 个后缀参与排序）",
    "steps": [
     "倍增排序：第一轮以（首字符、次字符）为键得 sa=[5,1,3,0,2,4]，第二轮以（前 2 字符名次、后 2 字符名次）为键得 sa=[5,3,1,0,4,2]，此时名次两两互异即停——对应 a、ana、anana、banana、na、nana。",
     "Kasai 按原串位置求 LCP：i=0 的 banana 在 sa 中前一名是 anana，首字符即不同，lcp 记 0。",
     "i=1 的 anana 与前一名 ana 公共前缀 ana，得长度 3；h 携带 3 进入下一轮，先降 1 再继续比。",
     "i=2 的 nana 与前一名 na 公共前缀 na，长度 2；i=3 的 ana 与前一名 a 公共前缀 a，长度 1。",
     "i=4 的 na 与 banana 无公共前缀；最终 lcp=[0,1,3,0,0,2]，h 每步至多减 1 的性质使 Kasai 总代价 O(n)。"
    ]
   }
  },
  "suffix-automaton": {
   "brute": "先想暴力解：枚举全部 O(n²) 个子串放进哈希集合去重，总字符量 O(n³)，且只能回答存在性，出现次数等统计问题无从高效作答。关键观察：一个串的所有子串可按「结束位置集合相同」等价归类，每类对应自动机的一个状态；逐字符增量扩展时从上个状态沿后缀链接回退补转移，遇到既有转移但长度不吻合就克隆一个折中状态，结构规模与转移总数保持 O(n)，不同子串数恰为 Σ(len[v]−len[link[v]])。",
   "bruteCode": "def brute(s):\n    subs = set()\n    for i in range(len(s)):\n        for j in range(i + 1, len(s) + 1):\n            subs.add(s[i:j])\n    return len(subs)",
   "walkthrough": {
    "input": "s = 'abb'（逐字符扩展，返回不同子串总数）",
    "steps": [
     "读入 a：新建状态 1（len=1），状态 0 沿链接补上转移 a→1，后缀链接指向初始态。",
     "读入 b：新建状态 2（len=2）；从 last=1 沿链接到 0 都没有 b 转移，沿途状态全部指向 2。",
     "读入第二个 b：新建状态 3（len=3），状态 2 补上 b→3；沿链接到状态 0 时发现已有 b→2，且 len[0]+1=1 ≠ len[2]=2，触发克隆。",
     "克隆出状态 4（len=1，转移复制自状态 2），把状态 0 的 b 转移改指克隆，状态 2、3 的后缀链接改指克隆。",
     "不同子串数 = Σ(len[v]−len[link[v]]) = (1−0)+(2−1)+(3−1)+(1−0) = 5，正是 a、b、ab、bb、abb；克隆保证每个状态代表的子串集合右端点完全一致。"
    ]
   }
  },
  "palindromic-tree": {
   "brute": "先想暴力解：枚举全部 O(n²) 个子串逐个做回文判断再放入集合去重，判断本身就要 O(n³)，统计出现次数还得再扫一遍文本。关键观察：一个串的所有回文后缀构成嵌套链——任何新回文都由某个旧回文两侧各扩一个相同字符得到，于是每个位置只需沿「最长回文后缀」链接回退，找到第一个能扩展的节点；扩展出的节点以链接相连构成回文树，实节点数恰好等于不同回文个数（不超过 n），计数沿链接聚合即得出现次数。",
   "bruteCode": "def brute(s):\n    distinct = set()\n    total = 0\n    for i in range(len(s)):\n        for j in range(i + 1, len(s) + 1):\n            piece = s[i:j]\n            if piece == piece[::-1]:\n                distinct.add(piece)\n                total += 1\n    return {\"distinct\": len(distinct), \"total\": total}",
   "walkthrough": {
    "input": "s = 'abba'（返回不同回文个数与回文子串总出现次数）",
    "steps": [
     "初始化两棵虚拟根：len=−1 的想象根与 len=0 的空串根，last 指向空串根。",
     "i=0 的 a：沿后缀链接回退到想象根（它总能扩展），造出节点 a（len=1），链接指回空串根。",
     "i=1 的 b 同法造出 b；i=2 的 b 以空串根为底两侧各扩一位得到 bb（len=2），后缀链接指向 b。",
     "i=3 的 a：当前最长回文后缀 bb 的前一个字符恰是 a，两侧各扩一位得到整串回文 abba（len=4），后缀链接指向 a。",
     "逆序沿链接聚合计数：a×2、b×2、bb×1、abba×1 → total=6；树中 4 个实节点即 4 个不同回文，distinct=4。"
    ]
   }
  },
  "regex-matching": {
   "brute": "先想暴力解：对「x*」展开「匹配 0 次」与「多吃一个字符」两条分支，朴素实现指数级枚举，同一对下标被反复重算。关键观察：答案只由两个下标决定，状态共 (n+1)×(m+1) 个——dp[i][j] 记 text 前 i 个字符与 pattern 前 j 个字符能否匹配：普通字符与 . 走对角线转移，「p*」要么整体跳过取 dp[i][j−2]，要么前一字符匹配当前字符并重复一次取 dp[i−1][j]，自底向上填表 O(nm)。",
   "bruteCode": "def brute(pattern, text):\n    def match(i, j):\n        if j == len(pattern):\n            return i == len(text)\n        first = i < len(text) and pattern[j] in (text[i], \".\")\n        if j + 1 < len(pattern) and pattern[j + 1] == \"*\":\n            return match(i, j + 2) or (first and match(i + 1, j))\n        return first and match(i + 1, j + 1)\n\n    return match(0, 0)",
   "walkthrough": {
    "input": "pattern = 'ab*c'，text = 'abbc'（dp[i][j] 表示 text 前 i 个字符与 pattern 前 j 个字符能否匹配）",
    "steps": [
     "初始化：dp[0][0]=True；空串要匹配 ab*c 必须消掉 b*，但 dp[0][3]=dp[0][1]=False，第一行只有 dp[0][0] 为真。",
     "i=1（字符 a）：j=1 处 a==a 走对角线得 dp[1][1]=dp[0][0]=True；j=3 的 * 先试「出现 0 次」dp[1][1]=True → dp[1][3]=True。",
     "i=2（b）：j=2 处 b==b 得 dp[2][2]=dp[1][1]=True；j=3 的 * 试「多用一个 b」：pattern 前一字符 b 等于 text 当前字符且 dp[1][3]=True → dp[2][3]=True。",
     "i=3（b）：同理由 dp[2][3]=True 推出 dp[3][3]=True——* 连续吃掉两个 b。",
     "i=4（c）：j=4 处 c==c，dp[4][4]=dp[3][3]=True → 整体匹配；普通字符只依赖对角线，* 有「跳两格（0 次）」和「向上吃一格（重复）」两条转移。"
    ]
   }
  },
  "aho-corasick": {
   "brute": "先想暴力解：对每个模式单独在文本里做一次线性扫描，p 个模式、文本长 n 就是 O(p·n) 次字符比较，模式间大量共享前缀被反复重比。关键观察：把所有模式插进一棵 Trie 共享前缀；仿照 KMP 为每个节点建失败指针，指向「最长的真后缀且仍在 Trie 中」的节点，并把失败链沿途的模式并入当前节点的命中表；扫描文本时状态沿 Trie 前进、走不动就沿失败指针回跳，一遍 O(文本长) 报出全部模式的所有出现。",
   "bruteCode": "def brute(patterns, text):\n    return [sum(1 for i in range(len(text) - len(p) + 1) if text[i:i + len(p)] == p)\n            for p in patterns]",
   "walkthrough": {
    "input": "patterns = ['he', 'she', 'his', 'hers']，text = 'ushers'",
    "steps": [
     "四个模式插入 Trie，he 与 hers 共享 h→e 前缀路径，she 从根另起 s 分支。",
     "BFS 建失败指针：状态 she（节点 5）的 fail 指向状态 he（节点 2），并把失败链沿途的模式并入命中表——节点 5 的命中表为 [she, he]。",
     "扫描 ushers：u 停在根，s→h 顺 Trie 走到状态 sh；第 4 个字符 e 进入状态 5，按命中表计数 she=1、he=1。",
     "第 5 个字符 r：状态 5 没有 r 转移，沿 fail 跳到状态 2（he）再走 r 到状态 her；第 6 个字符 s 走到 hers → hers=1。",
     "扫描结束 counts=[1,1,0,1]（对应 he、she、his、hers）；his 全程未命中。文本只扫一遍，多模式命中由失败链自动带出。"
    ]
   }
  },
  "booth-minimum-rotation": {
   "brute": "先想暴力解：把字符串翻倍，逐个起点截取长度 n 的旋转串再两两比较取最小，n 个候选、单次比较 O(n)，总代价 O(n²)。关键观察：比较两个候选起点 i、j 时若在第 k 个字符才分出胜负，落败一方以及与胜者共享这 k 个前缀字符的一整段候选可以一并跳过——指针直接推进 i+k+1，且始终保持两个候选错开；每次失配排除一段连续候选，两个指针合计只前进 O(n)，总时间线性。",
   "bruteCode": "def brute(s):\n    n = len(s)\n    doubled = s + s\n    best = 0\n    for i in range(1, n):\n        if doubled[i:i + n] < doubled[best:best + n]:\n            best = i\n    return best",
   "walkthrough": {
    "input": "s = 'bbaa'（4 个旋转 bbaa、baab、aabb、abba，最小为 aabb）",
    "steps": [
     "翻倍得 bbaabbaa；i=0、j=1 是两个候选起点，k 为已比对长度。第 1 位 b=b 相等，k=1。",
     "第 2 位 doubled[1]=b > doubled[2]=a：起点 0 落败，i 跳到 i+k+1=2，一次失配把起点 0 及其同前缀候选整段排除。",
     "交换后 i=2、j=1：doubled[2]=a < doubled[1]=b，这次 j 落败，j 跳到 j+k+1=2 与 i 重合，强制错开为 j=i+1=3。",
     "i=2、j=3 再比：a=a 相等 k=1；接着 doubled[3]=a < doubled[4]=b，j 被跳到 5 越出边界，循环结束。",
     "返回 min(i,j)=2，即最小表示 aabb 从下标 2 开始旋转得到；每个起点至多被排除一次，总时间 O(n)。"
    ]
   }
  },
  "boyer-moore": {
   "brute": "先想暴力解：文本的每个对齐位置都从左到右逐字符比对，失配后只挪一格，最坏 O(n·m)；而且尾部已经比中的信息在下一次对齐时全部作废。关键观察：改从模式尾部开始比，失配时看文本里的「坏字符」在模式中最后出现的位置，把对齐直接挪到能让两者对上的地方——坏字符根本不在模式里时更是一整段跳过，平均跳步远大于 1，常呈次线性扫描。solution.py 用坏字符最后位置表实现这条规则。",
   "bruteCode": "def brute(text, pattern):\n    n, m = len(text), len(pattern)\n    for i in range(n - m + 1):\n        if text[i:i + m] == pattern:\n            return i\n    return -1",
   "walkthrough": {
    "input": "text = 'ababxcabb'，pattern = 'abb'（坏字符表：a→0，b→2，其余按 −1）",
    "steps": [
     "对齐 i=0，从模式尾部比：text[2]=a ≠ 模式尾 b，1 次比较即失配；坏字符 a 在模式中最后出现在下标 0，shift = 2−0 = 2，挪到 i=2。",
     "i=2：尾部 text[4]=x 不在模式里，shift = 2−(−1) = 3，直接跳过 x、c 所在的两段无效对齐，挪到 i=5。",
     "i=5：尾部 text[7]=b 比中、text[6]=a 失配（累计 4 次比较），shift = 1−0 = 1，挪到 i=6。",
     "i=6：从尾部连续比中 b、b、a 三个字符，j 降到 −1，命中 index=6。",
     "全程 7 次比较；朴素逐位比较同一输入要 13 次——尾部起比加坏字符跳步让失配对齐一次跨过多个位置。"
    ]
   }
  },
  "kmp-search": {
   "brute": "先想暴力解：让模式串对齐文本的每个起点逐字符比较，失配后把文本指针退回起点加一、模式指针归零重来，最坏 O(nm)。关键观察是：失配时已经匹配的那段模式前缀，其「最长相等前后缀」是已验证的信息——利用 LPS 表把模式串滑到正确位置，文本指针一次都不回退。",
   "walkthrough": {
    "input": "文本 t = \"abababc\"，模式 p = \"ababc\"",
    "steps": [
     "预处理 LPS 表：模式每个前缀的最长相等前后缀长度。\"ababc\" 对应 [0, 0, 1, 2, 0]——例如前缀 \"abab\" 的开头 \"ab\" 与结尾 \"ab\" 相等，长 2。",
     "开始匹配，j 记录已匹配的模式长度：文本前四个字符 a、b、a、b 与模式前四位依次相等，j 到 4。",
     "文本第 5 个字符 a 与模式第 5 位 c 失配。暴力会退文本指针，KMP 只查 LPS[3]=2，令 j=2——已匹配的 \"abab\" 中，前 2 个字符 \"ab\" 可直接充当新的已匹配前缀。",
     "从 j=2 继续：a、b、c 与模式第 3、4、5 位依次相等，j 达到 5，等于模式长度。",
     "命中：起点 = 当前文本下标 6 减模式长 5 = 2，t[2..6] 恰为 \"ababc\"。文本指针 i 从未回退，总复杂度 O(n+m)。"
    ]
   }
  },
  "manacher": {
   "brute": "先想暴力解：以每个位置为中心向两侧扩展求最长回文，奇数、偶数长度中心还要分开处理，aaaa… 这类输入每个中心都扩到边界，最坏 O(n²)，相邻中心的比较大量重复。关键观察：给字符间插入分隔符 #，奇偶回文统一成奇长度；已算出的回文半径含有镜像信息——当前位置 i 若落在最右回文边界 right 内，其半径至少是 min(right−i, p[镜像])，从这个初值继续扩展即可，right 只增不减，总扩展次数 O(n)。",
   "bruteCode": "def brute(s):\n    best = \"\"\n    for i in range(len(s)):\n        for j in range(i, len(s)):\n            piece = s[i:j + 1]\n            if piece == piece[::-1] and len(piece) > len(best):\n                best = piece\n    return best",
   "walkthrough": {
    "input": "s = 'abba'（变换为 t = #a#b#b#a#，p[i] 为以 t[i] 为中心的回文半径）",
    "steps": [
     "i=4（正中的 #）：两侧逐层比中 b=b、#=#、a=a、#=#，半径扩到 4，最右边界 right 推进到 8，中心记 4。",
     "i=5 落在 right 内：镜像位置 2×4−5=3 的半径是 1，与 right−i=3 取小得初值 1；向外试扩一步 b 对 a 失败，p[5]=1——省掉了从零比较。",
     "i=6：初值取 min(8−6=2, p[2]=0)=0，试扩 b 对 a 失败，p[6]=0。",
     "i=7：初值 min(8−7=1, p[1]=1)=1，右侧已到串尾无法再扩，p[7]=1；i=8 同理为 0。",
     "最终 p=[0,1,0,1,4,1,0,1,0]；最大半径 4 出现在 i=4，对应原串最长回文 abba，长度恰等于半径值——# 变换让奇偶回文统一按半径读取。"
    ]
   }
  },
  "rabin-karp": {
   "brute": "先想暴力解：文本每个长度 m 的窗口都与模式逐字符比较，最坏 O(n·m)。关键观察：相邻窗口只差一头一尾两个字符，窗口哈希可 O(1) 滚动更新——减去出窗字符乘 base^(m−1) 的贡献、整体乘 base、加上入窗字符，再对大素数取模；哈希不等必然不匹配，相等时才逐字符校验以排除碰撞，期望 O(n+m) 完成匹配。solution.py 取 base=131、模 10^9+7，首窗哈希与滚动更新都按此实现。",
   "bruteCode": "def brute(text, pattern):\n    n, m = len(text), len(pattern)\n    return [i for i in range(n - m + 1) if text[i:i + m] == pattern]",
   "walkthrough": {
    "input": "text = 'aabab'，pattern = 'ab'（base=131，模 10^9+7）",
    "steps": [
     "模式哈希 H(ab) = 97×131 + 98 = 12805（a=97、b=98）；top = base^(m−1) = 131。首个窗口 aa 的哈希 = 97×131+97 = 12804，不等，直接滑过。",
     "滚动更新：去掉出窗 a 的贡献、整体乘 base、加入窗 b：(12804 − 97×131)×131 + 98 = 12805，与模式相等 → 逐字符校验 text[1:3]=ab 通过，命中位置 1。",
     "窗口滑到 ba：哈希 = 98×131+97 = 12935，不等，滑过，未做任何字符比较。",
     "再滚动：(12935 − 98×131)×131 + 98 = 12805 → 校验 text[3:5]=ab 通过，命中位置 3。",
     "输出 [1, 3]。哈希只负责快速筛掉不匹配窗口，相等时仍逐字符校验以杜绝哈希碰撞误报。"
    ]
   }
  },
  "z-algorithm": {
   "brute": "先想暴力解：对每个位置 i 从头逐字符比较 s[i:] 与整串求最长公共前缀，aaaa… 这类输入最坏 O(n²)，且相邻后缀的比较结果几乎完全重复。关键观察：维护最右匹配区间 Z Box [left, right)，若 i 落在盒内，z[i] 至少是 min(right−i, z[i−left])——镜像位置已经比过的前缀不必重比，只需从这个初值继续向右扩展；盒的右边界只增不减，总比较次数线性，一趟 O(n) 求出全部 z 值。",
   "bruteCode": "def brute(s):\n    n = len(s)\n    z = [0] * n\n    if n:\n        z[0] = n\n    for i in range(1, n):\n        while i + z[i] < n and s[z[i]] == s[i + z[i]]:\n            z[i] += 1\n    return z",
   "walkthrough": {
    "input": "s = 'aabxaab'（z[i] = 后缀 s[i:] 与整串的最长公共前缀长度）",
    "steps": [
     "z[0]=7 为哨兵；i=1 无 Z Box 可复用，从零比较：aa 匹配、第 3 字符 a 对 b 失配 → z[1]=1，Box 更新为 [1,2)。",
     "i=2、i=3 分别与整串首字符即失配，z 均为 0。",
     "i=4：从零比较 a、a、b 三位全中，z[4]=3，Box 扩到 [4,7)——s[4:] 正是整串前缀 aab 的重现。",
     "i=5 在盒内：初值取 min(right−i=2, z[5−4]=z[1]=1)=1，试扩一步 a 对 b 失败，z[5]=1，镜像位置已比过的部分没有重比。",
     "i=6 同法复用镜像 z[2]=0 → z[6]=0。最终 z=[7,1,0,0,3,1,0]；z[4]=3 表明前缀 aab 在位置 4 处重新匹配上。"
    ]
   }
  },
  "knapsack-dp": {
   "brute": "先想暴力解：每件物品只有选与不选两种可能，2^n 种组合逐一验证重量是否超容量、记录最大价值，n=30 就要 10 亿多次。关键观察是：大量组合在「前 i 件、剩余容量 c」这个视角下完全等价——重叠子问题记进一张表，每个状态 O(1) 由「不选第 i 件」和「选第 i 件」两种转移合成。",
   "bruteCode": "def brute(items, cap):\n    n = len(items)\n    best = 0\n    for mask in range(1 << n):\n        w = v = 0\n        for i in range(n):\n            if mask >> i & 1:\n                w += items[i][0]\n                v += items[i][1]\n        if w <= cap:\n            best = max(best, v)\n    return best",
   "walkthrough": {
    "input": "容量 5；物品：A（重 2 价 3）、B（重 3 价 4）、C（重 4 价 5）",
    "steps": [
     "定义 dp[i][c] = 只考虑前 i 件物品、容量 c 时的最大价值。第 0 行（无物品可选）全为 0。",
     "处理物品 A（重 2 价 3）：c < 2 时只能不选，dp 保持 0；c=2..5 时选 A 更优，dp[1][2..5] = 3。",
     "处理物品 B（重 3 价 4）：以 c=5 为例，选 B 则 4 + dp[1][5-3] = 4+3 = 7，不选则 3，取 7。整行：dp[2][3..4]=4，dp[2][5]=7。",
     "处理物品 C（重 4 价 5）：c=5 时选 C 得 5 + dp[2][1] = 5+0 = 5，小于不选的 7，dp[3][5] 仍为 7。",
     "答案是 dp[3][5] = 7，对应方案选 A 和 B（重 2+3=5，价 3+4=7）。n×c 个状态、每状态 O(1)，O(nc)——把 2^n 的枚举压成了一张表。"
    ]
   }
  },
  "edit-distance": {
   "brute": "先想暴力解：把两个单词变成相同，可以枚举所有插入、删除、替换的操作序列，直到两侧一致再取最短，组合数是 3 的 (m+n) 次方级别。关键观察是：一个操作序列的结果只由「两串各自的前缀长度」决定，用 dp[i][j] 表示两前缀的最小编辑距离，三种操作对应三个邻居取最小。",
   "bruteCode": "def brute(a, b):\n    if not a:\n        return len(b)\n    if not b:\n        return len(a)\n    if a[-1] == b[-1]:\n        return brute(a[:-1], b[:-1])\n    return 1 + min(brute(a[:-1], b), brute(a, b[:-1]), brute(a[:-1], b[:-1]))",
   "walkthrough": {
    "input": "a = \"horse\"，b = \"ros\"，求最少编辑次数",
    "steps": [
     "边界：dp[i][0]=i、dp[0][j]=j——空串变成对方，只需相应次数的插入或删除。",
     "逐格填表，规则：末字符相同时直接抄左上角 dp[i-1][j-1]；不同时取删除、插入、替换三个邻居的最小值再加 1。",
     "例如 dp[1][1]（h 对 r）：不同，1 + min(dp[0][1], dp[1][0], dp[0][0]) = 1+0 = 1，含义是把 h 替换成 r。",
     "例如 dp[2][2]（ho 对 ro）：末字符 o 相同，直接取 dp[1][1] = 1，没有新增操作。",
     "填完 6×4 的表，右下角 dp[5][3] = 3。对应方案：horse→rorse（替换 h）、rorse→rose（删 r）、rose→ros（删 e）。",
     "m×n 个状态、每状态 O(1)，O(mn)。指数级的操作序列被压缩成一张二维表，这正是「记录子问题答案」的力量。"
    ]
   }
  },
  "weighted-interval-scheduling": {
   "brute": "先想暴力解：枚举任务集合的全部 2^n 个子集，逐一检查两两是否时间重叠并累加权重取最大，n 稍大就不可行。关键观察：任务按结束时间排序后，「选不选第 k 个任务」只需比较两种情形——选它则加上它的权重并跳到结束时间不晚于其开始的最优前驱 dp[p]，跳过则继承 dp[k−1]；dp[k] 取二者较大，p 用二分查找定位，最后沿 take 标记回溯即可还原选中的任务集合。",
   "bruteCode": "def brute(intervals):\n    n = len(intervals)\n    best_total, best_set = 0, []\n    for mask in range(1 << n):\n        chosen = [i for i in range(n) if mask >> i & 1]\n        if any(intervals[a][0] < intervals[b][1] and intervals[b][0] < intervals[a][1]\n               for a in chosen for b in chosen if a < b):\n            continue\n        total = sum(intervals[i][2] for i in chosen)\n        if total > best_total:\n            best_total, best_set = total, chosen\n    return {\"total\": best_total, \"chosen\": sorted(best_set)}",
   "walkthrough": {
    "input": "intervals = [[1,4,3],[2,6,4],[5,8,6],[7,9,3]]（格式：起点, 结束, 权重）",
    "steps": [
     "按结束时间排序为 [1,4,3]、[2,6,4]、[5,8,6]、[7,9,3]，ends=[4,6,8,9]；dp[k] 表示前 k 个区间的最优总权。",
     "区间 0（1-4，权 3）：兼容前驱 p=0，选它 3+dp[0]=3 > 跳过 dp[0]=0 → dp[1]=3，记 take。",
     "区间 1（2-6，权 4）：与区间 0 重叠，p=0；选它 4+0=4 > 跳过 3 → dp[2]=4（为此放弃区间 0）。",
     "区间 2（5-8，权 6）：二分得 p=1（区间 0 结束于 4 ≤ 5，兼容），选它 6+dp[1]=9 > 跳过 4 → dp[3]=9。",
     "区间 3（7-9，权 3）：p=2，选它 3+dp[2]=7 < 跳过 dp[3]=9 → dp[4]=9，不选。",
     "回溯 take 标记：跳过区间 3、选区间 2、跳到其兼容前驱再选区间 0 → 最优集 {0,2}，总权 9。"
    ]
   }
  },
  "matrix-chain-multiplication": {
   "brute": "先想暴力解：枚举整条矩阵链的全部加括号方式，n 个矩阵对应卡特兰数量级（指数级）种方案。关键观察：最优方案的最后一次矩阵乘法一定把链切成两段，且两段各自最优——记 dp[i][j] 为合并矩阵 i..j 的最少标量乘法次数，则 dp[i][j] = min over 断点 k 的 dp[i][k] + dp[k+1][j] + p_i·p_{k+1}·p_{j+1}；按区间长度从小到大填表即得 O(n³) 解法。",
   "bruteCode": "def brute(dims):\n    def cost(lo, hi):\n        if hi <= lo:\n            return 0\n        return min(cost(lo, m) + cost(m + 1, hi)\n                   + dims[lo] * dims[m + 1] * dims[hi + 1]\n                   for m in range(lo, hi))\n\n    return cost(0, len(dims) - 2) if len(dims) > 2 else 0",
   "walkthrough": {
    "input": "dimensions = [10, 30, 5, 60]，即 A1(10×30)、A2(30×5)、A3(5×60)",
    "steps": [
     "按区间长度从小到大填 dp[i][j]（合并矩阵 i..j 的最少标量乘法次数）。",
     "长度 2：dp[0][1] = 10×30×5 = 1500（先合并 A1、A2），dp[1][2] = 30×5×60 = 9000（先合并 A2、A3）。",
     "长度 3、断点 k=0（先算 A2·A3）：dp[0][0]+dp[1][2]+10×30×60 = 9000+18000 = 27000。",
     "断点 k=1（先算 A1·A2）：dp[0][1]+dp[2][2]+10×5×60 = 1500+3000 = 4500。",
     "dp[0][2] = 4500，最优括号为 (A1·A2)·A3；两种切法相差 22500——让 30×5 的小矩阵先相乘，中间维度尽早消掉。"
    ]
   }
  },
  "coin-change": {
   "brute": "先想暴力解：递归枚举每一步用哪枚硬币直到金额清零，同一剩余金额在状态树里被反复求解，分支指数级；贪心「先拿最大面值」又会在 [1,3,4] 这类面值上给出非最优解。关键观察：凑出金额 a 的最优解必然由某个更小金额的最优解再加一枚硬币构成——dp[a] = min over coin≤a 的 dp[a−coin]+1；金额从 1 到 A 自底向上填表，每个状态 O(n) 次转移，总时间 O(nA)、空间 O(A)。",
   "bruteCode": "def brute(coins, amount):\n    if amount == 0:\n        return 0\n    best = -1\n    for coin in coins:\n        if coin <= amount:\n            sub = brute(coins, amount - coin)\n            if sub != -1:\n                cand = sub + 1\n                if best == -1 or cand < best:\n                    best = cand\n    return best",
   "walkthrough": {
    "input": "coins = [1, 3, 4]，amount = 6",
    "steps": [
     "dp[a] 表示凑出金额 a 的最少硬币数，dp[0]=0，其余初始化为不可达值 amount+1=7。",
     "dp[1]=dp[0]+1=1；dp[2]=dp[1]+1=2（暂时只有 1 元硬币可用）。",
     "dp[3]：用 1 得 dp[2]+1=3，用 3 得 dp[0]+1=1 → dp[3]=1。",
     "dp[4]：用 4 得 dp[0]+1=1 最优 → dp[4]=1；dp[5]=min(dp[4]+1, dp[1]+1)=2。",
     "dp[6]：用 1 得 dp[5]+1=3，用 3 得 dp[3]+1=2，用 4 得 dp[2]+1=3 → dp[6]=2，对应 3+3 两枚。",
     "贪心先拿最大面值 4 会给出 4+1+1 三枚；DP 枚举「最后一枚是哪枚」的所有转移，才拿到 2 的最优解。"
    ]
   }
  },
  "traveling-salesman-bitmask": {
   "brute": "先想暴力解：枚举全部 (n−1)! 条城市排列，累加路径长度取最小，n=13 时已是数十亿量级。关键观察：前缀路径的优劣只取决于「访问过哪些城市、当前停在哪」，用位掩码压成状态 dp[subset][last] = 从起点 0 出发遍历 subset、停在 last 的最短距离；每个状态只从去掉 last 的子集转移，共 n·2^n 个状态、各 O(n) 次转移，最后用 min_j dp[全集][j]+dist[j][0] 闭合回路。",
   "bruteCode": "from itertools import permutations\n\n\ndef brute(dist):\n    n = len(dist)\n    if n <= 1:\n        return 0\n    best = None\n    for perm in permutations(range(1, n)):\n        total = dist[0][perm[0]] + sum(dist[a][b] for a, b in zip(perm, perm[1:])) + dist[perm[-1]][0]\n        if best is None or total < best:\n            best = total\n    return best",
   "walkthrough": {
    "input": "dist = [[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]（4 个城市，从 0 出发回到 0）",
    "steps": [
     "dp[subset][last] = 从 0 出发遍历 subset、停在 last 的最短距离；dp[{0}][0]=0，其余置无穷。",
     "第一层扩展：dp[{0,1}][1]=10、dp[{0,2}][2]=15、dp[{0,3}][3]=20，即 0 到各城的直达边。",
     "三元子集继续扩展，如 dp[{0,1,3}][3] = dp[{0,1}][1]+d[1][3] = 10+25 = 35；每个状态只由「去掉 last 的子集」转移而来，重叠子问题全部复用。",
     "满集收尾：dp[{0,1,2,3}][1]=70、dp[全][2]=65、dp[全][3]=75（各取前驱子集转移的最小值，如 dp[全][2] = min(35+35, 35+30) = 65）。",
     "闭合回路：min(70+10, 65+15, 75+20) = min(80, 80, 95) = 80，最优回路 0→1→3→2→0；n²2ⁿ 的状态空间远小于 (n−1)! 条排列的暴力枚举。"
    ]
   }
  },
  "tree-dp": {
   "brute": "先想暴力解：枚举每个节点「选或不选」的全部 2^n 种组合，逐一检查组合里没有边的两端同时被选，再取权值和最大者，时间 O(2^n)，节点一多完全不可行。关键观察是：树天然递归——一个节点的决策只和直接孩子的状态有关，各子树内部怎么选互不影响；给每个节点保留「选它」与「不选它」两个状态，在后序遍历中自底向上合并，一趟 O(n) 即可。",
   "bruteCode": "def brute(data):\n    n = data[\"n\"]\n    weights = data[\"weights\"]\n    edges = data[\"edges\"]\n    best = 0\n    for mask in range(1 << n):\n        ok = True\n        for a, b in edges:\n            if mask >> a & 1 and mask >> b & 1:\n                ok = False\n                break\n        if ok:\n            total = sum(weights[i] for i in range(n) if mask >> i & 1)\n            best = max(best, total)\n    return best",
   "walkthrough": {
    "input": "n=5，weights=[4,2,7,1,3]，edges=[[0,1],[0,2],[1,3],[1,4]]：节点 0 连 1、2，节点 1 连 3、4",
    "steps": [
     "后序遍历先处理叶子：节点 3 得到（选，不选）=(1,0)，节点 4 得 (3,0)，节点 2 也是叶子得 (7,0)。",
     "合并节点 1：选它则两个孩子都不选，take=2+0+0=2；不选它则孩子各取较优，skip=max(1,0)+max(3,0)=1+3=4。",
     "合并根节点 0：选它则孩子必须不选，take=4+skip(1)+skip(2)=4+4+0=8；不选它则 skip=max(2,4)+max(7,0)=4+7=11。",
     "答案 max(8,11)=11，对应方案：不选 0 和 1，选 2、3、4，权值 7+1+3=11。",
     "暴力枚举 2^5=32 个子集同样得 11，但树形 DP 每条边只在后序中合并一次，n 个节点 O(n) 完成。"
    ]
   }
  },
  "digit-dp": {
   "brute": "先想暴力解：把 [lo,hi] 里每个整数逐个转成字符串，检查相邻两位是否相同并计数，时间与区间长度成正比，区间大到 10^9 时逐个检查根本跑不完。关键观察是：答案只由数位结构决定，且「顶着上界」的前缀每层只有一条，其余前缀的计数只依赖（位数、上一位数字、是否已出现非零位）这三个量，按位决策并记忆化即可，复杂度骤降到 O(位数×状态数×10)。",
   "bruteCode": "def brute(lo, hi):\n    count = 0\n    for n in range(lo, hi + 1):\n        s = str(n)\n        ok = True\n        for i in range(len(s) - 1):\n            if s[i] == s[i + 1]:\n                ok = False\n                break\n        if ok:\n            count += 1\n    return count",
   "walkthrough": {
    "input": "lo=1，hi=20，统计区间内「相邻两位都不相同」的数的个数",
    "steps": [
     "逐位决策的状态是（位置 pos、上一位数字 prev、是否顶着上界 tight、是否已出现非零位 started）。count_up_to(20) 把 20 拆成数位 [2,0]。",
     "首位在 tight 下只能取 0、1、2：取 0 表示还没开始，退化为统计 0 与一位数，得 10 个（0~9 都没有相邻位）。",
     "首位取 1 后不再顶上界：第二位除 prev=1 外任取，得到 10、12~19 共 9 个，11 因「上一位是 1」在状态里被直接跳过。",
     "首位取 2 顶着上界：第二位只能取 0，且 0≠2 合法，得到 20 这 1 个。count_up_to(20)=10+9+1=20。",
     "同理 count_up_to(0)=1（只有数字 0 本身），答案 20-1=19：1~20 里只有 11 违反相邻不同。"
    ]
   }
  },
  "subset-sum": {
   "brute": "先想暴力解：枚举全部 2^n 个子集，逐个求和检查是否等于 target，时间 O(2^n)。n=30 时就是十亿量级的组合。关键观察是：我们并不关心具体选了哪些元素，只关心「当前已经能凑出哪些和」——有用的和都不超过 target，状态最多 target+1 种；逐个元素把旧可达集合整体加上新值再合并，就能 O(nS) 判定。",
   "bruteCode": "def brute(nums, target):\n    n = len(nums)\n    for mask in range(1 << n):\n        total = 0\n        for i in range(n):\n            if mask >> i & 1:\n                total += nums[i]\n        if total == target:\n            return True\n    return False",
   "walkthrough": {
    "input": "nums=[3,34,4,12,5,2]，target=9",
    "steps": [
     "初始 reachable={0}，表示一个元素都不选时只能凑出 0。",
     "处理 3 → {0,3}；处理 34 → {0,3,34,37}；处理 4 → {0,3,4,7,34,37,38,41}。",
     "处理 12：旧和各加 12 得 12、15、16、19、46、49、50、53，集合扩到 16 个元素，仍未出现 9。",
     "处理 5：旧和 4 加 5 得 9，target 出现在可达集合里，立即返回 True，对应子集 4+5。",
     "暴力要枚举 2^6=64 个子集；可达集合以 target 为上界只有有限状态，逐元素合并把指数爆炸压成 O(nS)。"
    ]
   }
  },
  "longest-increasing-subsequence": {
   "brute": "先想暴力解：枚举所有 2^n 个子序列，逐一检查是否严格递增、取最长；即使写成 O(n^2) 的「以 i 结尾」DP，也还是要对每个 i 扫前面所有 j。关键观察是：维护 tails[k] = 长度为 k+1 的递增子序列中最小的结尾值——它单调递增，因此新元素可以用二分定位，整体 O(n log n)。",
   "bruteCode": "def brute(nums):\n    n = len(nums)\n    dp = [1] * n\n    for i in range(n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp) if n else 0",
   "walkthrough": {
    "input": "nums = [2, 5, 3, 4]，求最长严格递增子序列长度",
    "steps": [
     "tails 初始为空。读 2：追加，tails=[2]——长度 1 的子序列目前最小结尾是 2。",
     "读 5：比 tails 末尾大，接上，tails=[2, 5]。",
     "读 3：在 tails 中二分找第一个大于等于 3 的位置，是 5，替换为 3，tails=[2, 3]——长度 2 的子序列结尾变小了，未来更容易扩展。",
     "读 4：比 3 大，追加，tails=[2, 3, 4]。",
     "tails 的长度 3 就是 LIS 长度（如 2,3,4）。注意 tails 本身未必是一条真实子序列，但长度一定正确；每个元素一次二分，O(n log n)。"
    ]
   }
  },
  "longest-common-subsequence": {
   "brute": "先想暴力解：枚举 a 的全部 2^n 个子序列，逐个检查它是否是 b 的子序列，记录最长者，最坏 O(2^n×m)。关键观察是：设 dp[i][j] 为 a 前 i 个字符与 b 前 j 个字符的 LCS 长度，它只依赖 dp[i-1][j-1]、dp[i-1][j]、dp[i][j-1] 三个更小的子问题——尾字符相等就在左上角基础上加一，否则丢掉 a 或 b 的尾字符取较优。",
   "bruteCode": "def brute(a, b):\n    n = len(a)\n    best = 0\n    for mask in range(1 << n):\n        sub = [a[i] for i in range(n) if mask >> i & 1]\n        it = iter(b)\n        if all(ch in it for ch in sub):\n            best = max(best, len(sub))\n    return best",
   "walkthrough": {
    "input": "a=\"ACE\"，b=\"ABCDE\"",
    "steps": [
     "滚动行 row 只保存 b 这一维，初始全 0，逐字符处理 a。",
     "处理 'A'：在 j=1（b[0]='A'）命中，row[1]=上对角+1=0+1=1，不匹配的位置向右传播，本行结束 row=[0,1,1,1,1,1]。",
     "处理 'C'：在 j=3（b[2]='C'）命中，row[3]=diagonal+1=1+1=2，行末 row=[0,1,1,2,2,2]，即 LCS(\"AC\",\"ABCDE\")=2。",
     "处理 'E'：在 j=5（b[4]='E'）命中，row[5]=diagonal+1=2+1=3，返回答案 3，对应公共子序列 A、C、E。",
     "不匹配时 row[j]=max(row[j],row[j-1])（跳过 a 或 b 的尾字符取较优），变量 diagonal 在更新前暂存旧 row[j]，正是左上角 dp[i-1][j-1]。"
    ]
   }
  },
  "kadane": {
   "brute": "先想暴力解：枚举所有 O(n^2) 个子数组并逐个求和取最大，n 大时代价平方级增长。关键观察是：以 i 结尾的最大子数组和只依赖以 i-1 结尾的最大子数组和——前面累积为负时就该果断丢弃、从当前元素重新开始；于是只维护「以当前位置结尾的最大和」与「全局最大和」两个变量，一趟扫描 O(n) 完成。",
   "bruteCode": "def brute(nums):\n    best = nums[0] if nums else 0\n    n = len(nums)\n    for i in range(n):\n        total = 0\n        for j in range(i, n):\n            total += nums[j]\n            best = max(best, total)\n    return best",
   "walkthrough": {
    "input": "nums=[-2,1,-3,4,-1,2,1,-5,4]",
    "steps": [
     "初始 ending=best=-2，即以首元素结尾的最大和。",
     "value=1：ending=max(1,-2+1)=1，重新开始更好，best=1；value=-3：ending=max(-3,1-3)=-2，best 仍是 1。",
     "value=4：ending=max(4,-2+4)=4，旧前缀 -2 已无价值，best=4；value=-1：ending=max(-1,4-1)=3，best 不变。",
     "value=2、1 依次延续：ending=3+2=5、5+1=6，best 更新为 6。",
     "value=-5、4：ending=max(-5,6-5)=1、max(4,1+4)=5，都不超过 6。最终答案 6，对应子数组 [4,-1,2,1]。"
    ]
   }
  },
  "fractional-knapsack": {
   "brute": "先想暴力解：按 0/1 背包的思路枚举每件物品「整件装或不装」的子集，容量内取价值最大者，O(2^n)。但分数背包允许切开物品——容量 50、物品 (10,60)、(20,100)、(30,120) 时 0/1 最优是 250，而把 (30,120) 切下 5 重量还能多赚 20。关键观察是：单位重量价值高的物品应优先装满，最优解形如「按密度排序依次整装、最后一件取分数」，排序后一趟扫描即可。",
   "bruteCode": "def brute(items, capacity):\n    n = len(items)\n    best = 0.0\n    for mask in range(1 << n):\n        weight = sum(items[i][0] for i in range(n) if mask >> i & 1)\n        if weight > capacity:\n            continue\n        value = sum(items[i][1] for i in range(n) if mask >> i & 1)\n        best = max(best, float(value))\n    return best",
   "walkthrough": {
    "input": "capacity=50，items=[(10,60),(20,100),(30,120),(15,90),(25,75)]（重量,价值）",
    "steps": [
     "单位重量价值依次为 6、5、4、6、3，按密度降序（同密度保持原序）排序：(10,60) → (15,90) → (20,100) → (30,120) → (25,75)。",
     "装 (10,60)：整件占 10 容量得 60，剩 40；装 (15,90)：占 15 得 90，剩 25。",
     "装 (20,100)：占 20 得 100，剩 5；轮到 (30,120) 时容量只剩 5，按密度装入 5/30 份，得 5×4=20。",
     "容量用尽，(25,75) 被跳过。总价值 60+90+100+20=270，即 solve() 的返回值。",
     "0/1 枚举只能得到 250，多出的 20 正是「允许拆分」带来的收益；排序 O(n log n) 后一趟扫描完成。"
    ]
   }
  },
  "activity-selection": {
   "brute": "先想暴力解：枚举全部 2^n 个活动子集，逐个检查子集内活动两两不重叠（按起点排序后前一个的结束不晚于后一个的开始），取最大子集，时间 O(2^n×n)。关键观察是：把活动按结束时间排序后，最早结束的活动一定出现在某个最优解里——选它给剩余活动留出的时间最多（交换论证），因此每次贪心选兼容且结束最早者即可。",
   "bruteCode": "def brute(activities):\n    n = len(activities)\n    best = 0\n    for mask in range(1 << n):\n        chosen = sorted(activities[i] for i in range(n) if mask >> i & 1)\n        ok = all(chosen[i][1] <= chosen[i + 1][0]\n                 for i in range(len(chosen) - 1))\n        if ok:\n            best = max(best, len(chosen))\n    return best",
   "walkthrough": {
    "input": "activities=[(1,4),(3,5),(0,6),(5,7),(3,9),(5,9),(6,10),(8,11),(8,12),(2,14),(12,16)]",
    "steps": [
     "按结束时间排序后依次为 (1,4),(3,5),(0,6),(5,7),(3,9),(5,9),(6,10),(8,11),(8,12),(2,14),(12,16)，last_end 初始为空。",
     "(1,4) 入选，last_end=4；(3,5) 起点 3<4 冲突跳过，(0,6) 同样跳过。",
     "(5,7) 起点 5≥4 兼容入选，last_end=7；其后 (3,9)、(5,9)、(6,10) 起点都小于 7，全部跳过。",
     "(8,11) 起点 8≥7 入选，last_end=11；(8,12)、(2,14) 起点不足 11 被跳过。",
     "(12,16) 起点 12≥11 入选。共选 4 个：(1,4)、(5,7)、(8,11)、(12,16)。"
    ]
   }
  },
  "interval-covering": {
   "brute": "先想暴力解：枚举区间集合的全部 2^n 个子集，检查每个子集的并集是否盖住目标 [L,R]，取最小个数，时间 O(2^n×n)。关键观察是：若某方案当前覆盖到边界 covered，而最后一段的右端点不是所有可衔接区间中最远的，把它换成更远的那段不会变差——所以每轮只需在起点 ≤ covered 的区间里挑右端点最远者。",
   "bruteCode": "def brute(intervals, target):\n    n = len(intervals)\n    best = None\n    for mask in range(1 << n):\n        chosen = [intervals[i] for i in range(n) if mask >> i & 1]\n        point = target[0]\n        ok = True\n        for s, e in sorted(chosen):\n            if s > point:\n                ok = False\n                break\n            point = max(point, e)\n            if point >= target[1]:\n                break\n        if ok and point >= target[1]:\n            best = len(chosen) if best is None else min(best, len(chosen))\n    return -1 if best is None else best",
   "walkthrough": {
    "input": "intervals=[(0,3),(1,5),(3,7),(4,9),(6,10),(8,12)]，target=[0,12]",
    "steps": [
     "区间按起点排序：(0,3),(1,5),(3,7),(4,9),(6,10),(8,12)，covered 从目标左端 0 出发。",
     "起点 ≤0 的只有 (0,3)，右端点最远 3，covered=3，计数 1。",
     "起点 ≤3 的有 (1,5)、(3,7)，选右端点最远的 (3,7)，covered=7，计数 2。",
     "起点 ≤7 的有 (4,9)、(6,10)，选 (6,10)，covered=10，计数 3。",
     "起点 ≤10 的有 (8,12)，covered 推进到 12，达到目标右端，共 4 个区间；若某轮没有可衔接的区间则返回 -1。"
    ]
   }
  },
  "job-sequencing": {
   "brute": "先想暴力解：枚举任务的所有子集，把子集按截止期限升序逐个安排，若第 k 个任务的期限不小于 k 则该子集可行，取收益和最大者，时间 O(2^n×n log n)。关键观察是：把任务按收益降序考虑、每个任务塞进截止期限前最晚的空闲时隙，先给高收益任务占位不会损失后续选择——被挤掉的总是收益更低的任务。",
   "bruteCode": "def brute(jobs):\n    n = len(jobs)\n    best = 0\n    for mask in range(1 << n):\n        chosen = sorted((jobs[i] for i in range(n) if mask >> i & 1),\n                        key=lambda job: job[1])\n        total = 0\n        ok = True\n        for k, (profit, deadline) in enumerate(chosen, 1):\n            if k > deadline:\n                ok = False\n                break\n            total += profit\n        if ok:\n            best = max(best, total)\n    return best",
   "walkthrough": {
    "input": "jobs=[(100,2),(19,1),(27,2),(25,1),(15,3),(40,3)]（收益,截止），单位时隙 1~3",
    "steps": [
     "slot_limit=min(6,最大截止 3)=3，按收益降序排列：(100,2) → (40,3) → (27,2) → (25,1) → (19,1) → (15,3)。",
     "(100,2) 放入时隙 2；(40,3) 放入时隙 3；(27,2) 的时隙 2 已占，退到时隙 1，累计收益 100+40+27=167。",
     "(25,1) 从时隙 1 一路退到 0，舍弃；(19,1) 同样无处安放。",
     "(15,3) 的时隙 3、2、1 全被占用，退到 0 舍弃。最终收益 167，返回 {profit:167, chosen:[0,2,5]}。",
     "三个时隙分别排 (27,2)、(100,2)、(40,3)——每个任务尽量占最晚的空时隙，把更早的时隙留给截止更紧的任务。"
    ]
   }
  },
  "stable-marriage": {
   "brute": "先想暴力解：枚举 n! 个完美匹配，对每个匹配检查是否存在「阻塞对」——某男和某女互相都比自己的现任更偏好，无阻塞对才算稳定，时间 O(n!×n^2)，n=6 就是 720 种。关键观察是：一次「提议被拒或被替换」恰好消除一个不稳定因素，让单身者按自己的偏好顺序反复提议、接收者只保留更偏好者，O(n^2) 次提议内必收敛到稳定匹配。",
   "bruteCode": "from itertools import permutations\n\ndef brute(men, women):\n    n = len(men)\n    rank = [{m: pos for pos, m in enumerate(women[w])} for w in range(n)]\n    for perm in permutations(range(n)):\n        wife = list(perm)\n        husband = [0] * n\n        for m, w in enumerate(wife):\n            husband[w] = m\n        stable = True\n        for m in range(n):\n            for w in range(n):\n                if w != wife[m] and men[m].index(w) < men[m].index(wife[m]) \\\n                        and rank[w][m] < rank[w][husband[w]]:\n                    stable = False\n                    break\n            if not stable:\n                break\n        if stable:\n            return wife\n    return None",
   "walkthrough": {
    "input": "men=[[0,1,2],[1,0,2],[1,2,0]]，women=[[1,2,0],[0,2,1],[0,1,2]]（数字为对方编号）",
    "steps": [
     "三个男士依次提议：m0 向 w0、m1 向 w1，两位女士空闲均接受；轮到 m2 时它的首选也是 w1。",
     "w1 比较现任 m1 与 m2：w1 的偏好序 [m0,m2,m1] 中 m2 排第 1、m1 排第 2，接受 m2，m1 重新入队。",
     "m1 转向第二偏好 w0：w0 的偏好 [m1,m2,m0] 里 m1 排第 0、现任 m0 排第 2，接受 m1，m0 入队。",
     "m0 转向第二偏好 w1：w1 的偏好里 m0 排第 0、现任 m2 排第 1，接受 m0，m2 入队。",
     "m2 转向第二偏好 w2，w2 空闲接受。最终匹配 m0-w1、m1-w0、m2-w2（matches=[1,0,2]），共 6 次提议、3 次替换。"
    ]
   }
  },
  "union-find": {
   "brute": "先想暴力解：边不断加入、随时查询两点是否连通，朴素做法是每次查询都现跑一遍 BFS 或 DFS，单次 O(V+E)，m 次查询承受不起。关键观察是：连通是一种「等价关系」，可以让同一连通块的节点共享一个代表元——查询只需比较双方的代表元，合并只需把一棵树挂到另一棵的根下。",
   "walkthrough": {
    "input": "依次加边 (1,2)、(3,4)、(2,3)，随后查询 1 和 4 是否连通",
    "steps": [
     "初始每个节点自成一个集合：parent[i]=i，根就是自己。",
     "加边 (1,2)：找到 1 的根 1、2 的根 2，把 2 挂到 1 下，parent[2]=1。",
     "加边 (3,4)：两根分别是 3 和 4，parent[4]=3。",
     "加边 (2,3)：2 的根是 1，3 的根是 3，合并 parent[3]=1。至此 {1,2,3,4} 变成一个集合。",
     "查询 1 和 4：1 的根是 1；4 沿 parent[4]=3、parent[3]=1 一路向上，根也是 1——连通。配合路径压缩与按秩合并，单次操作均摊近似 O(1)。"
    ]
   }
  },
  "monotonic-stack-queue": {
   "brute": "先想暴力解：对每个长度为 k 的滑动窗口，线性扫描窗口内 k 个元素求最大值，n 个窗口共 O(nk)。相邻窗口只差一进一出两个元素，却把重叠部分重复扫了一遍。关键观察是：比新元素小且更老的候选，在新元素离开前必先过期，永远不会成为答案；用双端队列只保留「值从队首到队尾递减」的下标，队首就是当前窗口最大值。",
   "bruteCode": "def brute(nums, k):\n    out = []\n    for i in range(len(nums) - k + 1):\n        out.append(max(nums[i:i + k]))\n    return out",
   "walkthrough": {
    "input": "nums=[2,1,5,3,4,7,2,6]，k=3",
    "steps": [
     "队列存下标并保持对应值从队首到队尾递减，队首下标对应的就是当前窗口最大值。",
     "i=0、1：2、1 依次入队（1 没能弹掉 2），队列值 [2,1]；i=2 的 5 把 2、1 全弹出，队列=[下标2]，输出窗口 [2,1,5] 的最大值 5。",
     "i=3 的 3 直接入队，i=4 的 4 弹出 3 后入队，队列值 [5,4]；窗口 [1,5,3]、[5,3,4] 的最大值都从队首读到 5。",
     "i=5 的 7 弹出 4、5，队列=[下标5]，输出 7；i=6 的 2 直接入队，队首下标 5 > 6-3=3 未滑出窗口，输出 7。",
     "i=7 的 6 弹出队尾 2，队列值 [7,6]；队首下标 5 > 7-3=4 仍有效，窗口 [7,2,6] 输出 7。最终结果 [5,5,5,7,7,7]。",
     "每个下标至多入队、出队各一次，总时间 O(n)，而暴力每个窗口要 O(k)。"
    ]
   }
  },
  "cartesian-tree": {
   "brute": "先想暴力解：按定义递归建树——每个区间先线性扫描找最小值作根，再对左右两段递归，单层 O(n)、整体退化为 O(n^2)。关键观察是：按数组顺序逐个插入新元素时，新元素只会落在树的右脊上——右脊中比它大的节点整体成为它的左子树；用单调栈维护右脊，每个节点至多进栈出栈一次，O(n) 建成。",
   "bruteCode": "def brute(nums):\n    n = len(nums)\n    parent = [-1] * n\n\n    def build(lo, hi, par):\n        if lo > hi:\n            return\n        root = min(range(lo, hi + 1), key=lambda i: nums[i])\n        parent[root] = par\n        build(lo, root - 1, root)\n        build(root + 1, hi, root)\n\n    build(0, n - 1, -1)\n    return parent",
   "walkthrough": {
    "input": "nums=[8,3,7,1,9,4,6,2,5]",
    "steps": [
     "栈存下标、栈内值从底到顶递减（即当前树的右脊）。i=0 压入 8；i=1 的 3 弹出 8，8 挂为 3 的左孩子，3 成为栈底。",
     "i=2 的 7 不弹任何节点直接压栈，parent[2]=1；i=3 的 1 连续弹出 7、3：下标 1 的节点 3 成为 1 的左孩子，1 成为新根。",
     "i=4 的 9 直接压栈；i=5 的 4 弹出 9，9 挂为 4 的左孩子，4 的父节点是下标 3；i=6 的 6 压栈。此时右脊（栈）值为 [1,4,6]。",
     "i=7 的 2 弹出 6、5：下标 5 的节点 4 成为 2 的左孩子（6 仍是它的右孩子），2 挂到根 1 的右侧；i=8 的 5 压栈。",
     "返回 parent=[1,3,1,-1,5,7,5,3,7]：根是全局最小值 1，中序遍历恰为原数组 [8,3,7,1,9,4,6,2,5]，且每个父节点都小于其孩子。"
    ]
   }
  },
  "heap-priority-queue": {
   "brute": "先想暴力解：反复「取出当前最小值」的场景（如合并 k 个有序链表），朴素做法是每轮线性扫描找最小，单次 O(n)，k 轮就是 O(nk)。关键观察是：用一棵父不大于子的完全二叉树维护这堆数，最小值恒在堆顶，插入与弹出只需沿树高上浮或下沉，O(log n)。",
   "walkthrough": {
    "input": "向小顶堆依次插入 5、2、8、1，然后连续执行弹出最小",
    "steps": [
     "插入 5：堆为 [5]。插入 2：放到末尾 [5,2]，2 比父节点 5 小，上浮交换，得 [2,5]。",
     "插入 8：放末尾 [2,5,8]，父节点 2 更小，不上浮。插入 1：放末尾 [2,5,8,1]，1 与父 5 交换得 [2,1,8,5]，再与 2 交换得 [1,2,8,5]。",
     "弹出最小：堆顶 1 离开，末尾的 5 补到顶 [5,2,8]，下沉时与较小的孩子 2 交换，得 [2,5,8]。",
     "继续弹出，依次得到 2、5、8，输出序列 1,2,5,8 恰是升序。",
     "每次插入或弹出最多交换树高次，即 O(log n)；自底向上建 n 个元素的堆可以做到 O(n)，比逐个插入的 O(n log n) 更省。"
    ]
   }
  },
  "queue": {
   "brute": "先想暴力解：用普通数组存队列，出队时删除首元素并把后面所有元素整体前移一位，单次出队 O(n)；数据一多，指针级的小操作被搬移淹没。关键观察是：队首和队尾各用一个下标，入队只动 tail、出队只动 head，配合循环数组复用空间，入队/出队/查看队首都能 O(1) 完成。",
   "bruteCode": "def brute(operations):\n    queue = []\n    output = []\n    for op in operations:\n        if op[0] == \"enqueue\":\n            queue.append(op[1])\n        elif op[0] == \"dequeue\":\n            output.append(queue[0])\n            queue = queue[1:]\n        else:\n            output.append(queue[0])\n    return output",
   "walkthrough": {
    "input": "依次执行 enqueue 3、enqueue 8、peek、dequeue、enqueue 1、dequeue、dequeue",
    "steps": [
     "enqueue 3、enqueue 8 后队列内容为 [3,8]，head 指向 3，tail 指向 8 之后的空位。",
     "peek 只读取队首返回 3，队列不变；dequeue 弹出 3，队列变为 [8]。",
     "enqueue 1 从队尾进入，队列 [8,1]；随后 dequeue 依次弹出 8、1，队列清空。",
     "输出依次为 [3,3,8,1]：peek 和第一次 dequeue 都返回队首 3，先入队的 3、8、1 严格按顺序离开——先进先出。",
     "循环数组里 head/tail 指针按容量取模移动、数据不搬移，入队、出队、查看队首都是 O(1)。"
    ]
   }
  },
  "binary-search-tree": {
   "brute": "先想暴力解：把键存进无序数组，插入直接追加 O(1)，但查找和删除要从头到尾线性比对，单次 O(n)。键一多，每次查询都退化成全表扫描。关键观察是：若维护「左子树 < 节点 < 右子树」的二叉结构，每次比较键就能排除一整侧子树，平均每次操作只走 O(log n) 层。",
   "bruteCode": "def brute(keys, target):\n    stored = []\n    for k in keys:\n        if k not in stored:\n            stored.append(k)\n    return target in stored",
   "walkthrough": {
    "input": "keys=[48,26,72,14,34,61,86,30,66]，查找 30",
    "steps": [
     "48 成为根；26<48 落到左孩子，72>48 落到右孩子。",
     "14 沿 48→26 成为 26 的左孩子；34 沿 48→26 成为 26 的右孩子；61 落到 72 的左孩子，86 落到 72 的右孩子。",
     "30 沿 48→26→34 一路「小于向左、大于向右」，成为 34 的左孩子；66 沿 48→72→61 成为 61 的右孩子。",
     "查找 30 走完全相同的路径 48→26→34→30，3 次比较命中——树高 3，比较次数不超过树高。",
     "层序输出 [48,26,72,14,34,61,86,30,66]。若键按递增顺序插入，树会退化成一条链，操作从 O(log n) 变 O(n)。"
    ]
   }
  },
  "hash-table": {
   "brute": "先想暴力解：两数之和就两层循环枚举所有配对，判断和是否等于 target，时间 O(n^2)。关键观察是：扫描到 x 时，要找的其实是「target - x 是否在前面出现过」。把「查找」交给哈希表，就把它从 O(n) 降到 O(1)，整体一次扫描 O(n)。",
   "bruteCode": "def brute(nums, target):\n    n = len(nums)\n    for i in range(n):\n        for j in range(i + 1, n):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []",
   "walkthrough": {
    "input": "nums = [2, 7, 11, 15]，target = 9",
    "steps": [
     "i=0，x=2：查 9-2=7 是否在已见表中，表为空，未命中。把 2 及其下标 0 存入。",
     "i=1，x=7：查 9-7=2，命中！表里记录的下标是 0，立即返回 [0, 1]。",
     "假设没命中继续走：i=2 时查 9-11=-2 不在表中，把 11 存入；i=3 时查 9-15=-6 不在，存入 15。",
     "每个元素只做一次查询和一次插入，均摊 O(1)，总 O(n)。核心思路：把「寻找未来的配对」变成「查询过去的记录」。"
    ]
   }
  },
  "red-black-tree": {
   "brute": "先想暴力解：用普通二叉搜索树顺序插入同样的键、完全不做平衡——遇到递增键序列就退化成一条长度为 n 的链，查找、插入都是 O(n)。关键观察是：红黑性质（无红红父子、根必黑、每条路径黑高一致）保证最长路径不超过最短路径的 2 倍，树高始终 O(log n)；插入后只需沿新节点到根的路径做变色与旋转做局部修复。",
   "bruteCode": "def brute(keys):\n    nodes = []\n    root = -1\n    for k in keys:\n        if root == -1:\n            nodes.append([k, -1, -1])\n            root = 0\n            continue\n        cur = root\n        while True:\n            if k == nodes[cur][0]:\n                break\n            side = 1 if k < nodes[cur][0] else 2\n            if nodes[cur][side] == -1:\n                nodes.append([k, -1, -1])\n                nodes[cur][side] = len(nodes) - 1\n                break\n            cur = nodes[cur][side]\n\n    def height(i):\n        if i == -1:\n            return 0\n        return 1 + max(height(nodes[i][1]), height(nodes[i][2]))\n\n    return height(root)",
   "walkthrough": {
    "input": "keys=[10,20,30,15]",
    "steps": [
     "插入 10：成为黑色根；插入 20：父节点 10 是黑色，直接作为红右孩子，无需修复。",
     "插入 30：落到 20 的红右孩子处，父红、叔（nil，黑）为直线形：先把 20 变黑、10 变红，再围绕 10 左旋，得到根 20B、左孩子 10R、右孩子 30R。",
     "插入 15：落到 10 的右孩子处，父 10 红、叔 30 也红——变色修复：10、30 转黑，祖父 20 转红，z 上移到 20；20 是根，循环结束再涂黑。",
     "最终前序遍历 [20B,10B,15R,30B]：每条根到叶路径都有 2 个黑节点（黑高一致），且没有红-红父子。",
     "每次修复只经过 O(log n) 层、至多 2 次旋转，树高被压在 2·log2(n+1) 以内。"
    ]
   }
  },
  "persistent-segment-tree": {
   "brute": "先想暴力解：每次单点更新后把整棵线段树（或整个数组）完整复制一份存为新版本，m 次更新要 O(mn) 的时间与空间，历史版本一多内存直接爆掉。关键观察是：单点更新只改变根到目标叶的一条路径，其余子树与旧版本完全相同——新版本只复制这条路径上的 O(log n) 个节点，未修改子树直接用指针共享。",
   "bruteCode": "def brute(nums, ops):\n    versions = [list(nums)]\n    out = []\n    for op in ops:\n        if op[0] == \"update\":\n            snap = list(versions[op[1]])\n            snap[op[2]] = op[3]\n            versions.append(snap)\n        else:\n            v, l, r = op[1], op[2], op[3]\n            out.append(sum(versions[v][l:r + 1]))\n    return out",
   "walkthrough": {
    "input": "nums=[1,2,3,4,5]；ops=[update(v0,2,10), query(v0,1,3), query(v1,1,3), query(v1,0,4)]",
    "steps": [
     "版本 0 的树根存区间 [0,4] 总和 15；左子树 [0,2]=6，右子树 [3,4]=9。",
     "update(v0,2,10)：从根下行到叶 2，沿途复制根、[0,2]、叶共 3 个节点，叶改为 10，生成新版本 v1，v0 原封不动。",
     "新路径上 [0,2] 和=1+2+10=13，根和=13+9=22；右子树 [3,4] 未被修改，由 v0 与 v1 共享同一批节点。",
     "query(v0,1,3)=2+3+4=9；query(v1,1,3)=2+10+4=16——同一区间在不同版本里答案不同，旧版本依然可查。",
     "query(v1,0,4)=22。每次更新只新增 O(log n) 个节点，m 次修改的空间是 O(n+m·log n)。"
    ]
   }
  },
  "lazy-segment-tree": {
   "brute": "先想暴力解：区间加法逐个元素 +v，区间求和逐个元素累加，单次操作 O(n)，m 次操作 O(mn)。关键观察是：区间和可以按子树合并——被更新区间完整覆盖的子树，只需在节点上记账（节点和 += v×区间长度）并把增量暂存进懒标记，等到真正需要下行时才 push_down 兑现给孩子。",
   "bruteCode": "def brute(nums, ops):\n    arr = list(nums)\n    out = []\n    for op in ops:\n        if op[0] == \"add\":\n            for i in range(op[1], op[2] + 1):\n                arr[i] += op[3]\n        else:\n            out.append(sum(arr[op[1]:op[2] + 1]))\n    return out",
   "walkthrough": {
    "input": "nums=[2,1,5,3,4,7,6,8]；ops=[add(2,6,+3), query(0,3), query(0,7)]",
    "steps": [
     "建树后根 [0,7] 和=36，左子 [0,3]=11、[0,1]=3、[2,3]=8，右子 [4,7]=25、[4,5]=11、[6,7]=14。",
     "add(2,6,3)：根未完全覆盖，下行；节点 [2,3] 完整落在区间内，seg=8+3×2=14 并记 lazy=3，不再下探。",
     "[4,5] 同样命中（seg 11→17，lazy=3）；[6,7] 只覆盖一半，继续下行到叶 [6,6]（6→9），再逐层上拉：[6,7]=17、[4,7]=34、根=51。",
     "此时 [2,3] 的两个孩子 [2,2]、[3,3] 仍是旧值 5、3——增量暂存在 lazy 里，需要下行时才 push_down。",
     "query(0,3) 在根处分流后直接命中 [0,3] 节点返回 17（手算 2+1+8+6=17）；query(0,7) 直接返回根的 51。",
     "区间更新与查询各走 O(log n) 个节点，懒标记保证完全覆盖的子树一次结清。"
    ]
   }
  },
  "linked-list": {
   "brute": "先想暴力解：反转链表就把所有节点值抄进数组，倒序重建成新链表，时间 O(n) 但要 O(n) 额外空间。关键观察是：反转只是改每个节点的 next 指向，用一个 prev 指针记录「已反转部分的头」，边遍历边原地改向即可，O(n) 时间、O(1) 空间。",
   "walkthrough": {
    "input": "链表 1 → 2 → 3，原地反转",
    "steps": [
     "初始 prev=None，cur 指向节点 1。",
     "处理 1：先用临时变量记住下一个节点 2；把 1.next 指向 prev（None）；然后 prev 移到 1，cur 移到 2。此时 1 是已反转部分的头，且与后面断开。",
     "处理 2：记住 3；2.next 指向 1；prev=2，cur=3。链表形状是 2 → 1，后面还挂着原来的 3。",
     "处理 3：无下一个节点；3.next 指向 2；prev=3，cur=None，循环结束。",
     "返回 prev，链表变为 3 → 2 → 1。全程只改了 3 个 next 指针，没有申请任何新节点。"
    ]
   }
  },
  "interval-tree": {
   "brute": "先想暴力解：每个查询点线性扫描全部 n 个区间，逐个判断 start≤x≤end，单点查询 O(n)、q 个点 O(qn)。关键观察是：按中位端点把区间分层——跨越中心的区间按起点、终点各排一份（某一边不满足即可停止扫描），完全在中心一侧的区间进入子树递归，查询时不可能相交的子树整棵剪掉，单点 O(log n+k)。",
   "bruteCode": "def brute(intervals, points):\n    out = []\n    for x in points:\n        hits = [i for i, (s, e) in enumerate(intervals) if s <= x <= e]\n        out.append(sorted(hits))\n    return out",
   "walkthrough": {
    "input": "intervals=[(0,4),(2,7),(5,9),(6,12),(8,11),(10,15),(13,17)]，查询点 5 和 8",
    "steps": [
     "全部端点排序为 [0,2,4,5,6,7,8,9,10,11,12,13,15,17]，取中位 9 作根的中心；跨越 9 的 (5,9)、(6,12)、(8,11) 存入根节点，(0,4)、(2,7) 进左子树，(10,15)、(13,17) 进右子树。",
     "左子树以中位 4 为中心，(0,4)、(2,7) 都跨越 4，按终点降序存放为 (2,7)、(0,4)。",
     "查询点 8：8<9，根节点按起点升序扫描，(5,9)、(6,12)、(8,11) 起点都 ≤8，全部命中。",
     "转入左子树：8≥4 走「终点 ≥ 查询点」分支，(2,7) 终点 7<8 立即停止——左子树无命中，9 右侧的子树也不可能包含 8。",
     "查询点 5：根命中 (5,9)；左子树 5≥4，(2,7) 终点 7≥5 命中、(0,4) 终点 4<5 停止。结果 5→[1,2]、8→[2,3,4]。",
     "每层只递归进入一侧子树并提前截断扫描，单点查询 O(log n + k)。"
    ]
   }
  },
  "splay-tree": {
   "brute": "先想暴力解：用普通二叉搜索树存键并按值访问，热门键每次访问都要从根走完整条路径，访问成本固定为它的深度，局部性无从利用。关键观察是：访问后把目标节点一路旋转到根——Zig 单旋、Zig-Zig 同侧双旋、Zig-Zag 异侧双旋，刚访问过的键常驻根附近，连续操作有摊还 O(log n) 界。",
   "bruteCode": "def brute(keys, target):\n    nodes = []\n    root = -1\n    for k in keys:\n        if root == -1:\n            nodes.append([k, -1, -1])\n            root = 0\n            continue\n        cur = root\n        while True:\n            if k == nodes[cur][0]:\n                break\n            side = 1 if k < nodes[cur][0] else 2\n            if nodes[cur][side] == -1:\n                nodes.append([k, -1, -1])\n                nodes[cur][side] = len(nodes) - 1\n                break\n            cur = nodes[cur][side]\n    depth = 0\n    cur = root\n    while cur != -1 and nodes[cur][0] != target:\n        cur = nodes[cur][1] if target < nodes[cur][0] else nodes[cur][2]\n        depth += 1\n    return depth",
   "walkthrough": {
    "input": "keys=[40,20,60,10,30,50,70,30]，最后一个 30 是对已有键的再次访问",
    "steps": [
     "插入 40、20、60、10 后树为 10(−,60(20(−,40),−))；插入 30 落在 40 的左孩子处，两轮 Zig-Zag 把它转到根：30(10(−,20),60(40,−))。",
     "插入 50：落在 60 左孩子 40 的右侧，一轮 Zig-Zag 加一次 Zig 后 50 成根，树为 50(30(10(−,20),40),60)。",
     "插入 70：落在 60 的右孩子，60、70 同为右孩子构成 Zig-Zig，把它提到根：70(60(50(30(10(−,20),40),−),−),−)。",
     "再次访问 30：沿 70→60→50→30 找到旧节点；30 与 50 同为左孩子构成 Zig-Zig，先旋 50 再旋 30，得 70(30(10(−,20),50(40,60)),−)。",
     "最后一层 Zig：30 越过 70 成根，树为 30(10(−,20),70(50(40,60),−))，前序输出 [30,10,20,70,50,40,60]。",
     "每次访问都把目标转到根：刚碰过的键下次 O(1) 命中，连续操作有摊还 O(log n) 保证。"
    ]
   }
  },
  "fenwick-tree": {
   "brute": "先想暴力解：区间和 + 单点修改，普通前缀和数组查询 O(1) 但改一个元素要把后面全部重建，O(n)。关键观察是：让每个下标 i 借助二进制最低位的 1（lowbit）负责一段前缀——求和沿 lowbit 递减跳、修改沿 lowbit 递增跳，都只需 O(log n) 步。",
   "walkthrough": {
    "input": "nums = [1, 3, 2, 4]，用树状数组 tree 维护",
    "steps": [
     "lowbit(1)=1、lowbit(2)=2、lowbit(3)=1、lowbit(4)=4。建树：tree[1]=1，tree[2]=1+3=4，tree[3]=2，tree[4]=1+3+2+4=10。",
     "查前缀和 S(3)（前 3 个元素）：从下标 3 出发，累加 tree[3]=2；3 的 lowbit 是 1，跳到 2，累加 tree[2]=4；跳到 0 结束。和 = 6，恰为 1+3+2。",
     "这次查询只跳了 2 步——3 的二进制是 11，只有两个 1，跳的次数等于二进制中 1 的个数。",
     "单点修改：把下标 2 的元素 3 加 5。从 i=2 出发：tree[2] 更新为 9；2 的 lowbit 是 2，跳到 4，tree[4] 更新为 15；跳到 8 越界结束。所有覆盖下标 2 的节点都已更新。",
     "每次操作 O(log n)。相比线段树，树状数组代码更短、常数更小，代价是只能维护可减信息（和、异或等），区间最值这类不可减信息要用线段树。"
    ]
   }
  },
  "deque": {
   "brute": "先想暴力解：用普通数组模拟双端队列，push_left 要把已有元素整体右移一格，pop_left 后再整体左移，队首操作都是 O(n)。关键观察是：把首尾两端都做成 O(1) 端点——循环数组或双向链表都能让 push/pop 只动指针或下标，四种操作全部常数时间。",
   "bruteCode": "def brute(operations):\n    values = []\n    output = []\n    for op in operations:\n        if op[0] == \"push_left\":\n            values.insert(0, op[1])\n        elif op[0] == \"push_right\":\n            values.append(op[1])\n        elif op[0] == \"pop_left\":\n            output.append(values[0])\n            values = values[1:]\n        else:\n            output.append(values[-1])\n            values = values[:-1]\n    return output",
   "walkthrough": {
    "input": "依次执行 push_right 4、push_left 2、push_right 7、pop_left、push_left 9、pop_right",
    "steps": [
     "push_right 4 后内容 [4]；push_left 2 后 [2,4]——2 插到队首；push_right 7 后 [2,4,7]。",
     "pop_left 弹出队首 2，剩 [4,7]；push_left 9 后 [9,4,7]。",
     "pop_right 弹出队尾 7，剩 [9,4]。两次 pop 的返回值依次为 2、7。",
     "两端插入删除都是 O(1)；同端反复 push/pop 就是栈，异端一进一出就是队列。"
    ]
   }
  },
  "skip-list": {
   "brute": "先想暴力解：把有序集合存成一条单链表，查找只能从头逐个后移，插入也要先线性扫到位置再接入，单次操作 O(n)，建完 n 个键要 O(n²)；换成有序数组省了指针，插入同样要整体后移。关键观察：底层保持完整有序不变，在它上面叠几层「跳着看」的稀疏索引——每个键掷随机骰子决定自己出现在哪几层，层越高越稀疏；查找时高层大步向右、够不着再逐层下降，期望路径长度 O(log n)。",
   "bruteCode": "def brute(keys):\n    sorted_keys = []\n    for k in keys:\n        if k in sorted_keys:\n            continue\n        i = 0\n        while i < len(sorted_keys) and sorted_keys[i] < k:\n            i += 1\n        sorted_keys.insert(i, k)\n    return sorted_keys",
   "walkthrough": {
    "input": "keys = [3, 7, 12, 19, 25, 31]，seed = 42，随机层号范围 1~4",
    "steps": [
     "层号由 LCG 伪随机数对 4 取模加 1 产生：3→2 层、7→1 层、12→4 层、19→3 层、25→2 层、31→1 层，高度落在 1~4 之间，键一旦定层就不再改变。",
     "第 4 层只收层号 ≥4 的键：只剩 [12]，是最稀疏的高速车道。",
     "第 3 层收 ≥3 的键得 [12, 19]；第 2 层收 ≥2 的键得 [3, 12, 19, 25]，越往下越密。",
     "第 1 层（底层）收全部 6 个键 [3, 7, 12, 19, 25, 31]，保持完整有序。",
     "查找 19：第 4 层站在 12 向右无路，降到第 3 层后 12 的下一个正是 19——底层的 3、7 被高层直接跳过；单链表查找必须逐个扫过它们，而插入新键时跳表也只沿查找路径局部接驳，期望 O(log n)。"
    ]
   }
  },
  "sparse-table": {
   "brute": "先想暴力解：每个查询把 [l, r] 整段扫一遍取最小值，单次最坏 O(n)，q 次查询就是 O(nq)，同样的区间反复问也要重扫。关键观察：区间最小值可合并——长度 2^k 的区间最小值等于左右两个长 2^(k-1) 子块取 min。于是预处理出所有 2 的幂次区间（O(n log n)），任意查询拆成两个长 2^⌊log2 len⌋ 的块各盖一半，min 是幂等运算，两块重叠也不影响答案，单次查询 O(1)。",
   "bruteCode": "def brute(nums, queries):\n    out = []\n    for l, r in queries:\n        best = nums[l]\n        for i in range(l + 1, r + 1):\n            if nums[i] < best:\n                best = nums[i]\n        out.append(best)\n    return out",
   "walkthrough": {
    "input": "nums = [4, 9, 2, 7, 5, 1, 8]，queries = [[1, 5], [0, 3]]",
    "steps": [
     "第 0 层就是原数组。第 1 层存所有长 2 的块 min：[4, 2, 2, 5, 1, 1]（如 min(9,2)=2、min(5,1)=1）。",
     "第 2 层存长 4 的块 min，由第 1 层相距 2 的两项取 min：[min(4,2), min(2,5), min(2,1), min(5,1)] = [2, 2, 1, 1]。",
     "查询 [1, 5]：长度 5，取 level = ⌊log2 5⌋ = 2，块长 2² = 4，两个块分别为 table[2][1] 与 table[2][5-4+1] = table[2][2]。",
     "min(table[2][1], table[2][2]) = min(2, 1) = 1，正是子数组 [9, 2, 7, 5, 1] 的最小值；两块分别盖住 [1,4] 与 [2,5]，中间重叠但 min 幂等，不影响结果。",
     "查询 [0, 3]：长度 4，level = 2，min(table[2][0], table[2][0]) = 2，与扫描 [4, 9, 2, 7] 一致。两次查询各只做 1 次 min，暴力分别要扫 5 和 4 个元素。"
    ]
   }
  },
  "segment-tree": {
   "brute": "先想暴力解：单点修改 + 区间求和，朴素做法是每次都线性扫那段区间，查询 O(n)、修改 O(1)；或改用前缀和让查询 O(1)、修改 O(n)，总有一头是 O(n)。关键观察是：把区间对半分建成一棵树，每个节点保存一段的聚合值，任何区间都能拆成 O(log n) 个节点，修改也只影响一条根到叶路径。",
   "walkthrough": {
    "input": "nums = [2, 4, 6, 8]，节点保存区间和",
    "steps": [
     "建树：根 [0,3] 存 20；左孩子 [0,1] 存 6，右孩子 [2,3] 存 14；叶子分别是 2、4、6、8。",
     "查询 [1,3]：区间恰好拆成叶 [1,1]（值 4）与节点 [2,3]（值 14），4+14=18，只碰了 3 个节点。",
     "单点修改：把 nums[1] 从 4 改为 10。沿根到叶路径更新：叶 [1,1]=10，[0,1]=12，根 [0,3]=24，其余节点不受影响。",
     "树高 log n，查询拆出 O(log n) 个节点、修改走一条路径，两者都是 O(log n)；空间取 4n 的数组即可存放。",
     "对比暴力：修改不频繁时前缀和更简单，但「修改 + 查询」都多时，线段树的 O(log n) 才是两者兼得。"
    ]
   }
  },
  "stack": {
   "brute": "先想暴力解：判断括号串是否有效，朴素做法是反复扫描，每找到一对相邻的「()」或「[]」就删掉，重复到删不动为止，最后检查是否删空，时间 O(n^2)。关键观察是：最近出现的未匹配左括号一定最先被闭合——后进先出，正是栈的行为。",
   "walkthrough": {
    "input": "s = \"(()[])\"，从左到右扫描",
    "steps": [
     "读入 (：入栈，栈为 (。再读入 (：入栈，栈为 ( (。",
     "读入 )：栈顶是 (，配对成功，弹出，栈剩 (。",
     "读入 [：入栈，栈为 ( [。读入 ]：栈顶是 [，配对成功，弹出，栈剩 (。",
     "读入 )：栈顶是 (，配对成功，弹出，栈空。",
     "串扫完且栈空，判定有效。若某步栈顶不匹配、或扫完栈里还有残留，就无效。每个字符最多进出栈各一次，O(n)。"
    ]
   }
  },
  "avl-tree": {
   "brute": "先想暴力解：用有序数组当集合，插入要先找到位置再整体后移一格，单次 O(n)；用普通 BST 则怕顺序输入——按 10、20、30… 依次插入会退化成一条链，查询也变 O(n)。关键观察：在 BST 上给每个节点记录高度，插入回溯时检查平衡因子（左高减右高），绝对值超过 1 就按 LL、RR、LR、RL 四种形态做一次或两次 O(1) 旋转，局部修复即可把树高压回 O(log n)。",
   "bruteCode": "def brute(keys):\n    values = []\n    for k in keys:\n        if k in values:\n            continue\n        i = 0\n        while i < len(values) and values[i] < k:\n            i += 1\n        values.insert(i, k)\n    return values",
   "walkthrough": {
    "input": "keys = [10, 20, 30, 40, 50, 25]，依次插入 AVL 树",
    "steps": [
     "插入 10、20 得到右斜链 10→20；插入 30 后根 10 的平衡因子为 0−2 = −2，属 RR 型，对 10 一次左旋，根变为 20（左 10、右 30），高度回到 2。",
     "插入 40、50：50 落为 30 的右子后，30 的平衡因子 0−2 = −2 再次 RR 失衡，对 30 左旋，树变为 20（10，40（30，50）），高度 3。",
     "插入 25：25>20 进右子、25<40 进左子、25<30 落为 30 的左子；回溯到根 20 时平衡因子 = 1−3 = −2，且 25 < 右子键 40，判定为 LR 型。",
     "LR 修复两步走：先对右子 40 右旋，把 30 提上来（30 带左子 25、右子 40（50））；再对 20 左旋，30 成为整棵树的新根。",
     "前序输出 [30, 20, 10, 25, 40, 50]，最终树为 30（20（10，25），40（空，50）），高度 3；全程 4 次旋转、每次 O(1)，而普通 BST 顺序插入会退化成高 5 的链。"
    ]
   }
  },
  "b-tree": {
   "brute": "先想暴力解：所有键放进一个有序数组，插入线性找位再整体后移 O(n)；数据放到磁盘上时，一次插入可能重写整段连续数据，代价不可接受。关键观察：把键按序分装进「最多 2t−1 个键」的多键节点，叶写满就地下分裂成两半、中间键提升给父节点，树高只在根分裂时加一；每次插入只触碰根到叶的一条路径，节点内二分加上树高 O(log n)，磁盘读写次数也随之对数化。",
   "bruteCode": "def brute(keys):\n    values = []\n    for k in keys:\n        if k in values:\n            continue\n        pos = 0\n        while pos < len(values) and values[pos] < k:\n            pos += 1\n        values.insert(pos, k)\n    return values",
   "walkthrough": {
    "input": "keys = [10, 20, 30, 40, 50]，t = 2（每节点最多 2t−1 = 3 个键）",
    "steps": [
     "10、20、30 依次进根，根成为装满的叶节点 [10, 20, 30]。",
     "插入 40 前发现根已满：先分裂——中间键 20 上提为新根，左右子为 [10] 和 [30]；40 与 20 比较后走右子，得 [30, 40]。",
     "插入 50：根只有 1 个键未满，节点内定位到右子 [30, 40]，直接插入得 [30, 40, 50]。",
     "层序输出 [[20], [10], [30, 40, 50]]：5 个键、树高 2。",
     "若再插入 60，右子 [30, 40, 50] 满会就地分裂、中间键 40 上提，根变 [20, 40]——树只在节点溢出时向上长高，插入全程只碰一条根到叶路径。"
    ]
   }
  },
  "b-plus-tree": {
   "brute": "先想暴力解：仍是有序数组或普通 B 树——数组插入要整体后移 O(n)；B 树的数据散布在所有节点，范围查询要在父子节点间来回跳。关键观察：让全部数据只住叶层，并把叶串成有序链，内部节点只存「路由键」负责导航；叶写满就分裂，右半的首键上提当路由。这样点查询走到底层，范围查询定位起点后沿叶链顺序扫，插入也只分裂溢出的那个叶。",
   "bruteCode": "def brute(keys):\n    values = []\n    for k in keys:\n        if k in values:\n            continue\n        i = 0\n        while i < len(values) and values[i] < k:\n            i += 1\n        values.insert(i, k)\n    return values",
   "walkthrough": {
    "input": "keys = [10, 20, 30, 40, 50, 60]，max_keys = 3",
    "steps": [
     "10、20、30 依次进叶根，得 [10, 20, 30]。",
     "插入 40 后叶变 [10, 20, 30, 40]，超过 max_keys = 3：从中点切成左叶 [10, 20]、右叶 [30, 40]，右叶首键 30 上提为路由键，根升级为内部节点 [30]。",
     "插入 50：50 > 30 走右子，得 [30, 40, 50]，恰好 3 个键未溢出。",
     "插入 60：叶 [30, 40, 50, 60] 溢出，切分后左叶 [30, 40]、右叶 [50, 60]，路由键 50 上提，根变 [30, 50]。",
     "层序输出 [[30, 50], [10, 20], [30, 40], [50, 60]]：真实数据全部在叶层，内部节点的 30、50 只是路标；范围查询 [40, 60] 定位到含 40 的叶后，沿叶链即可顺序读出 40、50、60。"
    ]
   }
  },
  "bloom-filter": {
   "brute": "先想暴力解：把插入过的词全存进列表，查询逐个比对，单次 O(n)，n 大时又慢又占内存。关键观察：许多场景只需要「一定不在」这个结论——准备 m 位的位数组，用 k 个哈希函数把每个词映射到 k 个位并置 1；查询时看这 k 个位，只要有一个是 0 就肯定没插入过，全为 1 才「可能存在」。空间 O(m)、查询 O(k)，代价是可能把没插入过的词误判为存在（假阳性），但绝不会漏报。",
   "bruteCode": "def brute(inserts, checks):\n    stored = list(inserts)\n    return [word in stored for word in checks]",
   "walkthrough": {
    "input": "bits = 16，inserts = [\"cat\", \"dog\"]，checks = [\"cat\", \"cow\", \"dog\"]",
    "steps": [
     "三个哈希值对 16 取模：cat 落到位 {13, 7, 10}，dog 落到 {15, 9, 6}；置 1 后位数组在 6、7、9、10、13、15 这 6 个位置为 1。",
     "查 cat：三个位 13、7、10 全是 1，判定可能存在（确实插入过），返回 True。",
     "查 cow：映射到 {14, 0, 14}，位 14 是 0，立刻判定一定不存在，返回 False——一次空位检查就完成了否证。",
     "查 dog：位 15、9、6 全 1，返回 True。输出 [True, False, True]。",
     "cow 被准确拒绝是因为它至少撞到一个空位；若某个没插入的词的三个位恰好都被 cat 和 dog 置过 1，就会被误判为存在——这就是假阳性，m 越大、k 取值越合适，概率越低。"
    ]
   }
  },
  "lru-cache": {
   "brute": "先想暴力解：实现「容量满了淘汰最久未用」的缓存，朴素做法给每个键记一个最近使用时间戳，容量满时全表扫描找最旧的那个淘汰，get 与 put 最坏都要 O(n)。关键观察是：双向链表能在 O(1) 内把任意节点摘下并挂到头部（最新端），哈希表能 O(1) 定位键——两者组合，get 与 put 都是 O(1)。",
   "walkthrough": {
    "input": "容量为 2 的 LRU 缓存，依次操作：put(1,1)、put(2,2)、get(1)、put(3,3)、get(2)",
    "steps": [
     "put(1,1)：链表（头部为最新）变为 1；put(2,2)：链表变为 2 → 1，哈希表含键 1、2。",
     "get(1)：哈希表命中，把节点 1 移到头部，链表变为 1 → 2——刚被访问的要变最新。",
     "put(3,3)：容量已满，淘汰链表尾部最久未用的键 2（同时从哈希表删除），3 插入头部，链表变为 3 → 1。",
     "get(2)：哈希表中已无键 2，返回 -1，确认淘汰生效。",
     "get(1)：命中并移到头部，链表变为 1 → 3。全程哈希定位加链表改指针，没有任何全表扫描，get/put 均 O(1)。"
    ]
   }
  },
  "treap": {
   "brute": "先想暴力解：有序数组插入要整体后移 O(n)；普通 BST 的形状全看输入顺序，遇到有序输入就退化成链。关键观察：给每个节点额外发一个随机优先级，键满足 BST 性质、优先级满足堆性质（父节点更大）。插入按 BST 落位后，若子节点优先级高于父节点，一次左旋或右旋把它转上去；随机优先级等价于按随机顺序建的 BST，期望树高 O(log n)，且不需要维护高度或平衡因子。",
   "bruteCode": "def brute(keys):\n    values = []\n    for k in keys:\n        if k not in values:\n            lo = 0\n            while lo < len(values) and values[lo] < k:\n                lo += 1\n            values.insert(lo, k)\n    return values",
   "walkthrough": {
    "input": "keys = [50, 30, 70, 20]，seed = 7（优先级由 LCG 伪随机数生成）",
    "steps": [
     "50 的优先级 1025555898 成为根；30 的优先级 3923423697 更大，落为 50 的左子后违反堆序，右旋一次，30 顶替 50 当根，50 挂到 30 的右子。",
     "70 的优先级 2630631676：按 BST 落为 50 的右子；它比 50 的 1025555898 大，左旋让 70 上提、50 变成它的左子；再与 30 的 3923423697 比较，2630631676 更小，停止，树为 30（右子 70（左子 50））。",
     "20 的优先级 3981355051 全场最大：按 BST 落到 30 的左子后右旋一次，20 成为新根，30 变成它的右子，BST 性质与堆序同时成立。",
     "前序输出 [[20, 3981355051], [30, 3923423697], [70, 2630631676], [50, 1025555898]]：每条根到叶路径上优先级严格递减（堆序），键值中序遍历有序。",
     "同样的键若按 20、30、50、70 升序插入普通 BST，会退化成高 4 的右链；随机优先级把形状洗成期望 O(log n)，与到达顺序无关。"
    ]
   }
  },
  "trie": {
   "brute": "先想暴力解：存一组单词并支持前缀查询，朴素做法是把单词放进列表，每次前缀查询都逐个扫描比对，m 个单词一次查询 O(总字符数)。关键观察是：多个单词常常共享前缀（cat、car 共享 ca），把公共前缀合并成共享的树路径，查询只需沿字符走 O(单词长度) 步，与词典大小无关。",
   "walkthrough": {
    "input": "依次插入 \"cat\"、\"car\"、\"dog\"，然后查询前缀 \"ca\"",
    "steps": [
     "插入 \"cat\"：从根沿 c→a→t 依次建边，并在节点 t 上打词尾标记。",
     "插入 \"car\"：c、a 两个节点已存在，直接复用，只新建 r 并打标记——公共前缀 \"ca\" 只存了一份。",
     "插入 \"dog\"：与前面无公共前缀，从根另建 d→o→g 一条独立路径。",
     "查前缀 \"ca\"：从根走 c→a，两步都在树中，前缀存在；走到哪一步断了，就说明前缀不存在。",
     "再查整词 \"ca\"：能走通，但终点 a 没有词尾标记，所以它不是完整单词。插入与查询都只与单词长度相关，O(L)。"
    ]
   }
  },
  "centroid-decomposition": {
   "brute": "先想暴力解：统计树上路径（如经过某点的路径信息）时，从每个点出发 DFS 全树要 O(n²)；若递归处理子树时还从原树根重算，长链会反复拖慢每一层。关键观察：每层挑一个「重心」——删掉它之后任何连通分支都不超过当前块一半的点——逐层规模至少减半，分治深度变成 O(log n)，每个点只属于 O(log n) 个分层块，跨重心的路径也只需在各层重心处合并统计。",
   "bruteCode": "def brute(n, edges):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    for c in range(n):\n        largest = 0\n        for s in adj[c]:\n            seen = {s}\n            stack = [s]\n            while stack:\n                x = stack.pop()\n                for y in adj[x]:\n                    if y != c and y not in seen:\n                        seen.add(y)\n                        stack.append(y)\n            largest = max(largest, len(seen))\n        if 2 * largest <= n:\n            return c\n    return -1",
   "walkthrough": {
    "input": "n = 5 的链，edges = [[0,1],[1,2],[2,3],[3,4]]",
    "steps": [
     "第一轮 BFS 收集整个连通块的 5 个点，并自底向上累加子树大小：sz = [5, 4, 3, 2, 1]。",
     "从 start=0 出发找重心：0 朝 1 那侧有 4 个点，4×2=8 > 5，走到 1；1 朝 2 那侧 3 个点，6 > 5，走到 2；2 两侧各 2 个点，4 ≤ 5，停——重心是 2。",
     "移除 2 并记 cparent[2] = -1，链被切成两段 [0, 1] 和 [3, 4]，各自递归。",
     "左段大小 2，1 的两侧各 1 个点平衡，重心取 1（cparent[1] = 2），余下孤点 0 最后处理（cparent[0] = 1）；右段同理重心 3（cparent[3] = 2），再收 4（cparent[4] = 3）。",
     "输出 order = [2, 1, 0, 3, 4]、parent = [1, 2, -1, 2, 3]：深度 4 的链被压成深度 2 的重心树，任何路径统计只需经过 O(log n) 层。"
    ]
   }
  },
  "rollback-union-find": {
   "brute": "先想暴力解：每次 checkpoint 复制整个父指针数组存快照，回滚时整份换回；合并则把小集合里所有元素的标签逐个改成大集合的标签——单次合并与回滚都是 O(n)。关键观察：按大小合并时一次 union 只改两处（被并根的 parent 和 size），把旧值压入历史栈，回滚就是按相反顺序弹栈恢复；为了保证能精确撤销，find 不能用路径压缩，单次合并 O(log n)、单步回滚 O(1)。",
   "bruteCode": "def brute(n, ops):\n    label = list(range(n))\n    snapshots = []\n    out = []\n    for op in ops:\n        kind = op[0]\n        if kind == \"union\":\n            ra, rb = label[op[1]], label[op[2]]\n            if ra != rb:\n                for i in range(n):\n                    if label[i] == rb:\n                        label[i] = ra\n        elif kind == \"connected\":\n            out.append(label[op[1]] == label[op[2]])\n        elif kind == \"checkpoint\":\n            snapshots.append(list(label))\n        else:\n            if snapshots:\n                label = snapshots.pop()\n            else:\n                label = list(range(n))\n    return out",
   "walkthrough": {
    "input": "n = 4，依次执行 union(0,1)、union(2,3)、checkpoint、union(1,2)、connected(0,3)、rollback、connected(0,3)",
    "steps": [
     "union(0,1)：两根大小相等，parent[1]=0、size[0]=2，历史栈压入被并的根 1；union(2,3) 同理 parent[3]=2、size[2]=2，栈变为 [1, 3]。",
     "checkpoint 记下当前栈长度 2；union(1,2)：find(1)=0、find(2)=2，parent[2]=0、size[0]=4，栈变为 [1, 3, 2]。",
     "connected(0,3)：find(3)=2→0，find(0)=0，同根，输出 True。",
     "rollback：目标长度 2，弹出栈顶 2——size[0] 减 2 回到 2，parent[2] 复位为 2，恰好逆序撤销了 union(1,2) 的两处修改。",
     "再查 connected(0,3)：find(3)=2、find(0)=0，不同根，输出 False。全程无路径压缩，每个根只被直接覆盖过一次，撤销才能精确还原。"
    ]
   }
  },
  "mo-algorithm": {
   "brute": "先想暴力解：每个查询 [l, r] 独立扫一遍，用频次表统计不同值个数，单次 O(r-l+1)，q 次最坏 O(nq)。关键观察：查询是离线的，可以重排处理顺序——把左端点按块长 ⌊√n⌋ 分桶，同块内按右端点排序（奇偶块方向交替），相邻查询的窗口大量重叠；左右指针移动时用 O(1) 增删维护频次：某值频次 0→1 时 distinct 加一、1→0 时减一。指针总移动量 O((n+q)√n)。",
   "bruteCode": "def brute(nums, queries):\n    out = []\n    for l, r in queries:\n        seen = set()\n        for i in range(l, r + 1):\n            seen.add(nums[i])\n        out.append(len(seen))\n    return out",
   "walkthrough": {
    "input": "nums = [1, 2, 1, 3, 2, 1, 4]，queries = [[5, 6], [3, 5], [0, 3]]，块长 ⌊√7⌋ = 2",
    "steps": [
     "按（左端点所在块, 右端点）排序，处理顺序变为 [0,3]、[3,5]、[5,6]，而不是输入顺序 [5,6]、[3,5]、[0,3]。",
     "窗口从空扩到 [0,3]：右指针依次加入 1、2、1、3——1 第二次出现只是频次变 2，distinct 停在 3，回答 queries[2]。",
     "滑到 [3,5]：右端加入 2、1，都是老面孔，distinct 仍为 3；左端移出 nums[0..2] 的 1、2、1，1 的频次 3→2→1 始终非零，distinct 保持 3，回答 queries[1]。",
     "滑到 [5,6]：右端加入 4，distinct 升到 4；左端移出 3 和 2，两者频次归零各减一，distinct = 2，回答 queries[0]。",
     "输出 [2, 3, 3]：窗口一路顺滑衔接，右指针只在块内来回、左指针跨块时最多移动 O(√n)；暴力则每个区间各自重扫一遍。"
    ]
   }
  },
  "sqrt-decomposition": {
   "brute": "先想暴力解：区间加 v 就逐点加，区间求和就逐点累加，单次操作最坏 O(n)，操作一多就是 O(nq)。关键观察：把数组切成约 √n 长的块，每块维护块内元素总和；区间加时中间的完整块只记整块懒标记、不动元素，左右零头才逐点修改并同步修正块和；查询时整块直接取块和，零头逐点累加并补上懒标记。每次操作只处理两端 O(√n) 个零头元素和 O(√n) 个整块。",
   "bruteCode": "def brute(nums, ops):\n    values = list(nums)\n    out = []\n    for op in ops:\n        if op[0] == \"add\":\n            for i in range(op[1], op[2] + 1):\n                values[i] += op[3]\n        else:\n            out.append(sum(values[op[1]:op[2] + 1]))\n    return out",
   "walkthrough": {
    "input": "nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]，块长 3，ops = [sum(0,8), add(0,4,+2), sum(0,8), sum(2,6)]",
    "steps": [
     "建块：block_sum = [1+2+3, 4+5+6, 7+8+9] = [6, 15, 24]。sum(0,8) 三块直接相加得 45。",
     "add(0,4,+2) 跨块 0 和 1：块 0 被完整覆盖，nums[0..2] 逐点加 2 变 [3,4,5]，block_sum[0] += 2×3 变 12；块 1 只有下标 3、4 两个零头，逐点加 2 变 6、7，block_sum[1] += 2×2 变 19。",
     "sum(0,8)：12 + 19 + 24 = 55，与逐点算 45 + 2×5 一致。",
     "sum(2,6)：左侧零头只取 nums[2]=5，中间整块直接取 block_sum[1]=19，右侧零头取 nums[6]=7，合计 5+19+7 = 31。",
     "输出 [45, 55, 31]：整块聚合加边缘扫描，每次操作只碰 O(√n) 个元素；暴力的 add 和 sum 都要扫 O(n)。"
    ]
   }
  },
  "heavy-light-decomposition": {
   "brute": "先想暴力解：路径求和就沿父指针把较深的一端一步步往上爬，每跨一条边累加一次，单次 O(路径边数)，链状树上可达 O(n)。关键观察：每个节点只把「子树最大的儿子」定为重儿子，重边连成重链并占用连续的序列位置；任意路径每跨一条轻边，另一侧子树大小至少减半，所以路径至多拆成 O(log n) 段连续区间，每段交给线段树等结构 O(log n) 完成。",
   "bruteCode": "def brute(n, edges, root, u, v):\n    adj = [[] for _ in range(n)]\n    for a, b in edges:\n        adj[a].append(b)\n        adj[b].append(a)\n    parent = [-1] * n\n    depth = [0] * n\n    visited = {root}\n    stack = [root]\n    while stack:\n        x = stack.pop()\n        for y in adj[x]:\n            if y not in visited:\n                visited.add(y)\n                parent[y] = x\n                depth[y] = depth[x] + 1\n                stack.append(y)\n    steps = 0\n    while u != v:\n        if depth[u] < depth[v]:\n            u, v = v, u\n        u = parent[u]\n        steps += 1\n    return steps",
   "walkthrough": {
    "input": "n = 7，root = 0，edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]",
    "steps": [
     "DFS 统计子树大小：子树 1 和子树 2 各 3 个点，size = [7, 3, 3, 1, 1, 1, 1]；0 的重儿子取先遍历到的 1，1 的重儿子取 3，2 的重儿子取 5，heavy = [1, 3, 5, -1, -1, -1, -1]。",
     "非重儿子开启新链并沿重边下延：0 开链 0→1→3，占 pos 0、1、2；2 开链 2→5，占 pos 3、4。",
     "6 和 4 都是轻儿子，各自单独成链，分别占 pos 5 和 pos 6；得到 head = [0, 0, 2, 0, 4, 2, 6]、pos = [0, 1, 3, 2, 6, 4, 5]。",
     "同一条重链上的节点位置连续：0、1、3 占 0..2，2、5 占 3..4——这正是链段能整段交给线段树的原因。",
     "查询路径 3 到 6：3 跳到链头 0（区间 [0, 2] 的一段），6 自成链头（单点 [5, 5]），路径拆成 2 段区间；暴力沿父指针要爬 4 条边，重链保证跨轻边次数至多 O(log n)。"
    ]
   }
  },
  "euler-tour-tree": {
   "brute": "先想暴力解：子树求和或子树计数，每次都从目标节点出发把它的子树重新 DFS 一遍，单次 O(子树大小)，反复查询就反复扫。关键观察：一次 DFS 记下每个点的进入时间 tin，结合子树大小可得 tout = tin + size − 1——以 u 为根的整棵子树恰好对应序列的连续区间 [tin[u], tout[u]]，预处理 O(n) 后子树查询变成一次区间读取；把这段欧拉序放进可切分合并的平衡树，改树时整段子树随之搬移。",
   "bruteCode": "def brute(n, values, edges, u):\n    adj = [[] for _ in range(n)]\n    for a, b in edges:\n        adj[a].append(b)\n        adj[b].append(a)\n    parent = [-1] * n\n    seen = {0}\n    stack = [0]\n    while stack:\n        x = stack.pop()\n        for y in adj[x]:\n            if y not in seen:\n                seen.add(y)\n                parent[y] = x\n                stack.append(y)\n    visited = {u}\n    stack = [u]\n    total = 0\n    while stack:\n        x = stack.pop()\n        total += values[x]\n        for y in adj[x]:\n            if y not in visited and y != parent[x]:\n                visited.add(y)\n                stack.append(y)\n    return total",
   "walkthrough": {
    "input": "n = 5，values = [3, 1, 4, 1, 5]，root = 0，edges = [[0,1],[0,2],[1,3],[1,4]]",
    "steps": [
     "DFS 访问顺序 order = [0, 2, 1, 4, 3]，得到进入时间 tin = [0, 2, 1, 4, 3]。",
     "自底向上累计：子树大小 size = [5, 3, 1, 1, 1]，子树和 subtree_sum = [14, 7, 4, 1, 5]（如节点 1 的子树和 1+1+5 = 7）。",
     "由 tout = tin + size − 1 算出 tout = [4, 4, 1, 4, 3]：节点 1 的子树占据区间 [2, 4]。",
     "验证：区间 [2, 4] 内 tin 为 2、4、3 的点正是 1、3、4，权和 1+1+5 = 7，与 subtree_sum[1] 一致。",
     "输出 tin、tout、subtree_sum 三张表后，任何子树查询都是 O(1) 的区间定位；把这段欧拉序存进可切分合并的隐式 Treap，剪接子树就变成序列切分合并。"
    ]
   }
  },
  "link-cut-tree": {
   "brute": "先想暴力解：森林用邻接表存，每次 link 前先 DFS 判断两端是否已连通（防止成环），每次 connected 也要从一点扫遍整个连通块，单次 O(n)。关键观察：把树按「首选路径」剖成若干条链，每条链用一个 Splay 维护；access(x) 反复把 x 到根的路径设为首选并暴露成一个 Splay，makeroot 借翻转标记换根，link、cut、连通查询都只需拼接或摘除 O(log n) 条链，摊还 O(log n)。",
   "bruteCode": "def brute(n, ops):\n    adj = [set() for _ in range(n)]\n\n    def connected(u, v):\n        seen = {u}\n        stack = [u]\n        while stack:\n            x = stack.pop()\n            for y in adj[x]:\n                if y not in seen:\n                    seen.add(y)\n                    stack.append(y)\n        return v in seen\n\n    out = []\n    for op in ops:\n        u, v = op[1], op[2]\n        if op[0] == \"link\":\n            if not connected(u, v):\n                adj[u].add(v)\n                adj[v].add(u)\n        elif op[0] == \"cut\":\n            adj[u].discard(v)\n            adj[v].discard(u)\n        else:\n            out.append(connected(u, v))\n    return out",
   "walkthrough": {
    "input": "n = 5，依次执行 link(0,1)、link(1,2)、connected(0,2)、cut(1,2)、connected(0,2)、connected(1,2)",
    "steps": [
     "link(0,1)：makeroot(0) 后 find_root(1) ≠ 0，两端不连通，直接 fa[0]=1 接上；link(1,2) 同理，森林连成链 0-1-2。",
     "connected(0,2)：两次 find_root 同根，输出 True——此时 0-1-2 的路径已被 access 暴露成一条首选路径。",
     "cut(1,2)：makeroot(1) 后 access(2) 把边 1-2 暴露成首选边，splay 后确认 2 是 1 的右孩子且无左子树，摘除：2 的父指针清零，链断成 0-1 与孤点 2。",
     "connected(0,2)：find_root(0) ≠ find_root(2)，输出 False；connected(1,2) 同样 False。输出 [True, False, False]。",
     "暴力每次 link/connected 都要全块 DFS，O(n) 一次；LCT 把连通性判断压缩成两次 find_root，摊还 O(log n)，边增删频繁时差距更明显。"
    ]
   }
  },
  "wavelet-matrix": {
   "brute": "先想暴力解：每个查询 (l, r, k) 把区间切片复制、排序再取第 k−1 个，单次 O(n log n)，多查询也省不掉反复排序。关键观察：把值域按二进制位从高到低分层，每层做一次稳定划分——0 位元素按原顺序进前半、1 位元素进后半，并保存 0 位前缀计数；查询时数出当前区间的 0 位个数 zeros_in，与 k−1 比较即知第 k 小落在哪一半，同时用前缀计数把端点映射到下一层，逐层下降共 O(log σ)。",
   "bruteCode": "def brute(nums, queries):\n    out = []\n    for l, r, k in queries:\n        window = sorted(nums[l:r + 1])\n        out.append(window[k - 1])\n    return out",
   "walkthrough": {
    "input": "nums = [5, 2, 7, 1, 6]，queries = [[1, 3, 2], [0, 4, 4]]（值域 5 种取值，3 个二进制位）",
    "steps": [
     "离散化排名：5→2、2→1、7→4、1→0、6→3。第 0 层按最高位（值 ≥4）稳定划分：0 位组 [2, 1, 0]、1 位组 [4, 3]，得到序列 [2, 1, 0, 3, 4]。",
     "第 1、2 层对低位继续稳定划分，最终序列 [0, 4, 2, 1, 3]；每层都存下 0 位前缀计数 zeros。",
     "查 (1, 3, 2)：区间 [1, 4) 即值 {2, 7, 1}，k−1 = 1。第 0 层区间内 0 位有 2 个，1 < 2，走 0 位组，区间映射为 [1, 3)。",
     "第 1 层区间内 0 位仍 2 个，1 < 2，再走 0 位组，映射为 [0, 2)；第 2 层（最低位）区间内 0 位只有 1 个，1 ≥ 1，改走 1 位组，k−1 减为 0，映射为 [3, 4)。",
     "取 values[cur[3]] = values[1] = 2，即 [2, 7, 1] 的第 2 小；第二个查询 (0, 4, 4) 同法得 6。输出 [2, 6]，每层只做两次前缀计数，共 O(log σ)。"
    ]
   }
  },
  "octree": {
   "brute": "先想暴力解：三维范围或邻近查询把全部点扫一遍逐个判断，单次 O(n)，百万级点云上完全不可行。关键观察：把点装进一个外接立方体，容量超限就沿 x、y、z 三轴同时二分成八个体素（象限编号 0~7），每个点按坐标与中心比较落进唯一子体素；查询先判体素外接框与查询范围是否相交，一次就能排除整片空间，点分布均匀时平均只需深入 O(log n) 层。",
   "bruteCode": "def brute(points, center, half):\n    cx, cy, cz = center\n    hits = []\n    for x, y, z in points:\n        if (abs(x - cx) <= half and abs(y - cy) <= half\n                and abs(z - cz) <= half):\n            hits.append((x, y, z))\n    return hits",
   "walkthrough": {
    "input": "bounds = [0,0,0, 8,8,8]，capacity = 2，points = [[1,1,1],[2,2,2],[3,3,3],[4,4,4],[5,5,5],[6,6,6],[7,7,7]]",
    "steps": [
     "根节点 7 个点超过容量 2，以中心 (4,4,4) 三轴二分成 8 个体素；按 (x≥4, y≥4, z≥4) 编号，[1,1,1]、[2,2,2]、[3,3,3] 落 0 号，[4,4,4] 至 [7,7,7] 落 7 号，其余 6 个体素为空不建节点。",
     "0 号体素（范围 [0,4)³）有 3 个点仍超容量，以 (2,2,2) 再分：[1,1,1] 落 0 号成叶（1 点），[2,2,2]、[3,3,3] 落 7 号成叶（2 点）。",
     "7 号体素（范围 [4,8)³）有 4 个点超容量，以 (6,6,6) 再分：[4,4,4]、[5,5,5] 落 0 号成叶，[6,6,6]、[7,7,7] 落 7 号成叶。",
     "统计输出 leaf_count = 4，total_nodes = 7，max_depth = 2。",
     "范围查询若只与根的 0 号象限相交，另 7/8 的空间连同其中的点被一次剪掉；逐点扫描则 7 个点一个都躲不掉，n 越大剪枝收益越大。"
    ]
   }
  },
  "quadtree": {
   "brute": "先想暴力解：矩形范围查询把每个点与矩形边界逐个比对，单次 O(n)；点集再大也只能线性扫。关键观察：把点装进外接矩形，容量超限就沿 x、y 两轴同时二分成四个象限，每个点按坐标与中心比较落进唯一象限；查询矩形若与某象限的外接框不相交，这块区域的所有点被一次排除，点分布均匀时只需深入 O(log n) 层、对 O(k) 个命中点精确比对。",
   "bruteCode": "def brute(points, rect):\n    x0, y0, x1, y1 = rect\n    hits = []\n    for x, y in points:\n        if x0 <= x <= x1 and y0 <= y <= y1:\n            hits.append((x, y))\n    return hits",
   "walkthrough": {
    "input": "bounds = [0,0,10,10]，capacity = 2，points = [[1,1],[2,9],[8,8],[9,2],[3,5],[7,5],[4,4],[6,6]]",
    "steps": [
     "根节点 8 个点超过容量 2，以中心 (5,5) 四分：象限按 (x≥5, y≥5) 编号——[1,1]、[4,4] 落 0 号，[2,9]、[3,5] 落 1 号，[9,2] 落 2 号，[8,8]、[7,5]、[6,6] 落 3 号。",
     "0、1、2 号象限各不超过 2 个点，直接成叶；3 号有 3 个点超容量，继续分裂。",
     "3 号象限的外接框是 [5,5,10,10]，以中心 (7.5, 7.5) 再四分：[7,5]、[6,6] 落 0 号成叶，[8,8] 落 3 号成叶。",
     "统计输出 leaf_count = 5，total_nodes = 7，max_depth = 2。",
     "查询矩形若只覆盖左下象限（含 [1,1]、[4,4] 两点），其余三个象限共 6 个点被一次剪掉；逐点扫描则 8 个点仍要全部比对，点数上万时差距悬殊。"
    ]
   }
  },
  "bounding-volume-hierarchy": {
   "brute": "先想暴力解：碰撞检测或光线求交把查询框与全部 n 个对象逐个测试，单次 O(n)。关键观察：给每组对象算一个最小包围盒（AABB），父节点的 AABB 必然包住全部子对象——查询框连父 AABB 都不相交时，整棵子树的对象可以一次跳过。构建时每次选包围盒最长的轴、按对象中心的中位数对半分，O(n log n) 建出二叉层次结构，查询只走相交的分支。",
   "bruteCode": "def brute(boxes, rect):\n    qx0, qy0, qx1, qy1 = rect\n    hits = []\n    for b in boxes:\n        if b[0] <= qx1 and qx0 <= b[2] and b[1] <= qy1 and qy0 <= b[3]:\n            hits.append(list(b))\n    return hits",
   "walkthrough": {
    "input": "boxes = [[0,0,2,2],[8,8,10,10],[1,1,3,3],[9,0,10,2],[4,4,6,6]]，格式 [x0, y0, x1, y1]",
    "steps": [
     "根的 AABB 是 (0,0,10,10)，dx = dy = 10，取 x 轴；按中心 x（1、2、5、9、9.5）排序对半分：左组 {box0, box2}，右组 {box4, box1, box3}。",
     "左组 AABB (0,0,3,3) 再按 x 轴中分，直接得到两片叶 [0,0,2,2] 与 [1,1,3,3]。",
     "右组 AABB (4,0,10,10)：dy = 10 > dx = 6，改按 y 轴、按中心 y（1、5、9）排序，中分出叶 [9,0,10,2]（box3）与子组 {box4, box1}。",
     "子组 AABB (4,4,10,10) 再按 x 中分，得到叶 [4,4,6,6] 与 [8,8,10,10]。",
     "输出 leaf_boxes = [[0,0,2,2],[1,1,3,3],[9,0,10,2],[4,4,6,6],[8,8,10,10]]、internal_nodes = 4、root_bounds = [0,0,10,10]；查询竖条 [0,0,2,9] 时与右组 AABB (4,0,10,10) 不相交，box3、box4、box1 一次排除，只剩左组两叶精确测试。"
    ]
   }
  },
  "kd-tree": {
   "brute": "先想暴力解：最近邻查询算出查询点到全部 n 个点的距离再取最小，单次 O(n)。关键观察：按坐标轴轮流取中位点建树（深度偶数层按 x、奇数层按 y），每个节点相当于一条分割线把空间对半切；搜索先走进查询点所在的一侧，回溯时用「查询点到分割线的距离是否超过当前最优距离」决定是否进入另一侧——多数子树一次比较就被整枝剪掉，平均 O(log n)。",
   "bruteCode": "def brute(points, qx, qy):\n    best_index, best_d2 = -1, None\n    for i, (x, y) in enumerate(points):\n        d2 = (x - qx) ** 2 + (y - qy) ** 2\n        if best_d2 is None or d2 < best_d2:\n            best_index, best_d2 = i, d2\n    return [best_index, best_d2]",
   "walkthrough": {
    "input": "points = [[2,3],[5,4],[9,6],[4,7],[8,1],[7,2]]，query = (9, 2)",
    "steps": [
     "建树：根层按 x 取中位数得 (7,2)（按 x 排序后的第 4 个点），左子树按 y 取中位得 (5,4)（叶 (2,3)、(4,7)），右子树按 y 得 (9,6)（叶 (8,1)）。",
     "查询 (9,2) 先到根 (7,2)：距离² = (9−7)² + 0 = 4，记为当前最优。",
     "x 差 9−7 = 2 ≥ 0，先走右子：到 (9,6) 距离² = 16 不更优；其左子 (8,1) 距离² = 1+1 = 2，刷新最优为（下标 4，距离² 2）。",
     "回看根的左子树：分割线 x=7 到查询点的距离² = 4 > 2，(5,4) 整棵子树被剪掉，一次比较省掉 3 个点的距离计算。",
     "输出 [4, 2]：下标 4 的点 (8,1) 是最近邻；暴力要算全部 6 个点的距离，kd 树只访问 3 个节点。"
    ]
   }
  },
  "r-tree": {
   "brute": "先想暴力解：范围查询把查询矩形与全部对象逐个判交，单次 O(n)，对象越多访问次数线性膨胀。关键观察：把空间上邻近的对象分成小组，每组存一个最小包围矩形（MBR），查询与 MBR 不相交就整组跳过；本实现按类 STR 方式批量装载——先按 x 排序切成容量大小的竖条，条内再按 y 排序切块，每块生成一个 MBR 叶，组间重叠小，上层对 MBR 再建多叉树即可平衡。",
   "bruteCode": "def brute(points, rect):\n    x0, y0, x1, y1 = rect\n    hits = []\n    for x, y in points:\n        if x0 <= x <= x1 and y0 <= y <= y1:\n            hits.append((x, y))\n    return hits",
   "walkthrough": {
    "input": "points = [[9,1],[2,8],[4,3],[1,5],[7,7]]，capacity = 2",
    "steps": [
     "按 x 排序得 [1,5]、[2,8]、[4,3]、[7,7]、[9,1]；切成容量 2 的竖条：{[1,5],[2,8]}、{[4,3],[7,7]}、{[9,1]}。",
     "每条内部按 y 排序并按容量切块：三条各含不超过 2 个点，各成一叶。",
     "逐块取 min/max 生成叶 MBR：[[1,5,2,8], [4,3,7,7], [9,1,9,1]]，leaf_count = 3。",
     "查询矩形 [0,4,3,6]（x∈[0,3]，y∈[4,6]）与 MBR [1,5,2,8] 相交，需进组精确比对；与 [4,3,7,7]、[9,1,9,1] 都不相交，两组整组跳过。",
     "逐点扫描要查 5 个点，MBR 分组后只碰 1 组 2 个点；真实 R 树再把这些叶 MBR 向上聚组建多层多叉树，查询代价从 O(n) 降到与树高和候选数相关。"
    ]
   }
  },
  "half-plane-intersection": {
   "brute": "先想暴力解：把 h 条半平面两两配对求直线交点，得到 O(h²) 个候选点，每个候选再代入全部 h 条不等式检验，全部满足的点才可能是可行区域的顶点，最后还要对幸存点做凸包才能算面积，总代价 O(h³)；全平行、只有单条约束这类退化还得单独处理。关键观察：可行区域本身是凸多边形，从代表整个平面的大正方形出发，用每条直线像裁剪多边形那样逐条切一遍（保留内侧顶点、在边跨越处插入交点），就能增量维护公共区域，顺手用鞋带公式得到面积。",
   "bruteCode": "def brute(halfplanes):\n    m = len(halfplanes)\n    verts = []\n    for i in range(m):\n        a1, b1, c1 = halfplanes[i]\n        for j in range(i + 1, m):\n            a2, b2, c2 = halfplanes[j]\n            den = a1 * b2 - a2 * b1\n            if den == 0:\n                continue\n            x = (c1 * b2 - c2 * b1) / den\n            y = (a1 * c2 - a2 * c1) / den\n            if all(a * x + b * y <= c + 1e-9 for a, b, c in halfplanes):\n                verts.append((round(x, 3), round(y, 3)))\n    return verts",
   "walkthrough": {
    "input": "halfplanes = [[1,0,2],[0,1,1],[-1,0,1],[0,-1,0.5]]，即 x≤2、y≤1、x≥-1、y≥-0.5，求公共区域面积",
    "steps": [
     "暴力先两两求交：6 对直线中 2 对平行（x≤2 与 x≥-1、y≤1 与 y≥-0.5）跳过，其余 4 个交点 (2,1)、(2,-0.5)、(-1,1)、(-1,-0.5) 全部满足 4 条约束，正是可行矩形的顶点，共 O(h³) 次检验。",
     "solution.py 换增量思路：从四角 (±10^6,±10^6) 的大正方形出发代表整个平面，逐条半平面裁剪当前凸多边形。",
     "裁剪 x≤2：遍历 4 个顶点，保留 a·x+b·y-c≤0 的点；右边界 x=10^6 的两个顶点越界被删，两条水平边跨越直线处按 t=fp/(fp-fq) 插入交点 (2,-10^6) 与 (2,10^6)，多边形收缩为左半带。",
     "再依次裁剪 y≤1、x≥-1、y≥-0.5，多边形先后变为 y≤1 的横带、x∈[-1,2] 的竖带，最终四顶点 (-1,-0.5)、(2,-0.5)、(2,1)、(-1,1)；某轮裁剪后顶点数少于 3 就说明可行域为空。",
     "鞋带公式求面积：宽 2-(-1)=3、高 1-(-0.5)=1.5，面积=3×1.5=4.5，返回 nonempty=true、area=4.5；h 次裁剪每次只花 O(当前顶点数)。"
    ]
   }
  },
  "point-in-polygon": {
   "brute": "先想暴力解：用绕数法判定——对每条边计算查询点看到的有向角度并累加，绕数非零即内部；或者对每条边做完整的点-线段关系分情况讨论。绕数要算反三角函数、浮点误差难控，分情况讨论则要处理点恰在边上、射线穿过顶点等一堆退化情形，漏一类就错。关键观察：只需一条水平射线——边跨越射线所在水平线（(ay>y)≠(by>y)）且交点在查询点右侧时，奇偶计数翻转一次即可；边界情形先用「叉积为零+包围盒」单独判成 boundary。",
   "bruteCode": "def brute(poly, qx, qy):\n    total = 0.0\n    n = len(poly)\n    for k in range(n):\n        ax, ay = poly[k]\n        bx, by = poly[(k + 1) % n]\n        if ay <= qy:\n            if by > qy and (bx - ax) * (qy - ay) - (by - ay) * (qx - ax) > 0:\n                total += 1\n        else:\n            if by <= qy and (bx - ax) * (qy - ay) - (by - ay) * (qx - ax) < 0:\n                total -= 1\n    return \"inside\" if abs(total) > 1e-9 else \"outside\"",
   "walkthrough": {
    "input": "polygon = [[0,0],[4,0],[4,4],[0,4]]，queries = [[2,2],[4,2],[5,2]]",
    "steps": [
     "查 (2,2)：先做边界检查，四条边代入叉积 (bx-ax)(py-ay)-(by-ay)(px-ax) 分别得 8、8、8、8，都不为零，不在边界上，进入射线判定。",
     "从 (2,2) 向右发水平射线：边 (4,0)→(4,4) 满足 (0>2)≠(4>2)，交点 x=4+(2-0)·0/4=4 在右侧，计数翻成 1；边 (0,4)→(0,0) 也跨越，但交点 x=0 不在右侧不翻。计数为奇 → inside。",
     "查 (4,2)：边 (4,0)→(4,4) 的叉积 (0)(2)-(4)(0)=0 恰为零，且 4∈[4,4]、2∈[0,4] 都在包围盒内 → 命中边界，直接返回 boundary，跳过射线判定。",
     "查 (5,2)：无边界命中；唯一跨越的边 (4,0)→(4,4) 交点 x=4<5 不在右侧，计数 0 为偶 → outside。",
     "每个查询扫 n=4 条边、O(n) 完成；(ay>y)!=(by>y) 的半开写法保证顶点恰好压在射线上时只计一次，交点用精确分数计算不会误判。"
    ]
   }
  },
  "sweep-line-intersection": {
   "brute": "先想暴力解：对每一对线段做完整分情况判定——四次叉积判「互相跨越」，共线时再分重叠、端点接触、不相连等子情况，十几类退化分支每一类都要写对，漏一类就出 bug；复杂度本身是对每对 O(1)、共 O(n²)，风险全集中在分类讨论上。关键观察：把「两线段是否相交」统一换成「两直线交点在哪」——行列式交点公式一步给出精确坐标，再用包围盒检查交点同时落在两条线段上，所有相交情形（含端点相交、共线重叠）一并覆盖。",
   "bruteCode": "def brute(segs):\n    def cross(o, a, b):\n        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])\n    def on_seg(p, a, b):\n        return (min(a[0], b[0]) <= p[0] <= max(a[0], b[0])\n                and min(a[1], b[1]) <= p[1] <= max(a[1], b[1])\n                and cross(a, b, p) == 0)\n    cnt = 0\n    n = len(segs)\n    for i in range(n):\n        a = (segs[i][0], segs[i][1])\n        b = (segs[i][2], segs[i][3])\n        for j in range(i + 1, n):\n            c = (segs[j][0], segs[j][1])\n            d = (segs[j][2], segs[j][3])\n            d1 = cross(c, d, a)\n            d2 = cross(c, d, b)\n            d3 = cross(a, b, c)\n            d4 = cross(a, b, d)\n            if ((d1 > 0) != (d2 > 0)) and ((d3 > 0) != (d4 > 0)):\n                cnt += 1\n            elif d1 == 0 and on_seg(a, c, d):\n                cnt += 1\n            elif d2 == 0 and on_seg(b, c, d):\n                cnt += 1\n            elif d3 == 0 and on_seg(c, a, b):\n                cnt += 1\n            elif d4 == 0 and on_seg(d, a, b):\n                cnt += 1\n    return cnt",
   "walkthrough": {
    "input": "segments = [[0,0,4,4],[0,4,4,0],[0,3,6,3]]，即 A(0,0)-(4,4)、B(0,4)-(4,0)、C(0,3)-(6,3)",
    "steps": [
     "n=3 共 3 对线段组合。A×B：den=(0-4)(4-0)-(0-4)(0-4)=-32；px 与 py 的分子都是 0-64=-64，交点 px=-64/-32=2、py=-64/-32=2，得 (2,2)。",
     "(2,2) 同时落在 A 的包围盒 [0,4]×[0,4] 与 B 的 [0,4]×[0,4] 内，收进结果集合。",
     "A×C：den=(0-4)(3-3)-(0-4)(0-6)=-24，交点 (3,3)；B×C：den=(0-4)(3-3)-(4-0)(0-6)=24，交点 (1,3)；两个点都在各自线段的坐标范围内，收录。",
     "若两线段平行则 den=0 直接跳过；端点相交、共线重叠等退化情况统一由「交点在两条线段包围盒内」判定，不需要分类特判。",
     "集合去重后是 {(2,2),(3,3),(1,3)} 共 3 个不同交点，返回 3；全程用 Fraction 精确计算，坐标无浮点误差。"
    ]
   }
  },
  "convex-hull": {
   "brute": "先想暴力解：一个点是凸包顶点当且仅当它不在其余点构成的任何三角形内部——枚举所有三角形是 O(n⁴)；换成 gift wrapping 每轮选最外层点，最坏也要 O(n²)。关键观察：把点按 (x,y) 排序后，凸包的下链和上链各自满足「相邻三点叉积同号」的单调性——从左往右扫，新点一旦让栈顶两点转向内侧（叉积≤0）就弹栈，恢复左转再入栈；正反各扫一轮，拼接并去掉重复端点即得完整凸包，复杂度由排序主导为 O(n log n)。",
   "bruteCode": "def brute(pts):\n    n = len(pts)\n    def sign(o, a, b):\n        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])\n    hull = []\n    for i in range(n):\n        keep = True\n        for a in range(n):\n            for b in range(a + 1, n):\n                for c in range(b + 1, n):\n                    if i in (a, b, c):\n                        continue\n                    d1 = sign(pts[i], pts[a], pts[b])\n                    d2 = sign(pts[i], pts[b], pts[c])\n                    d3 = sign(pts[i], pts[c], pts[a])\n                    if (d1 > 0 and d2 > 0 and d3 > 0) or (d1 < 0 and d2 < 0 and d3 < 0):\n                        keep = False\n        if keep:\n            hull.append(i)\n    return sorted(hull)",
   "walkthrough": {
    "input": "points = [[0,0],[2,1],[4,0],[2,3],[2,2]]，返回凸包顶点下标序列",
    "steps": [
     "5 个点按 (x,y) 排序得 0(0,0)→1(2,1)→4(2,2)→3(2,3)→2(4,0)，先从左往右构造下链。",
     "依次入栈 0、1；加入 4(2,2) 时 cross(0,1,4)=2·2-1·2=2>0 是左转，保留；加入 3(2,3) 时 cross(1,4,3)=0 共线也弹出 4，再验 cross(0,1,3)=6-2=4>0 停止，栈为 [0,1,3]。",
     "加入 2(4,0) 时连续右转：cross(1,3,2)=0·(-1)-2·2=-4 弹出 3，cross(0,1,2)=2·0-1·4=-4 弹出 1，栈剩 [0] 后入 2，下链=[0,2]。",
     "从右往左再扫一遍得上链 [2,3,0]：中途 cross(3,4,1)=0 弹出共线的 4、cross(3,1,0)=0·(-3)-(-2)·(-2)=-4 弹出 1；拼接 lower[:-1]+upper[:-1]=[0]+[2,3]=[0,2,3]。",
     "点 1(2,1)、4(2,2) 因在凸包内部被排除；最后旋转到 y 最小（并列取 x 最小）的 (0,0) 开头，返回 [0,2,3]，即三角形 (0,0)→(4,0)→(2,3)。每个点至多进栈出栈各一次，排序 O(n log n) 主导。"
    ]
   }
  },
  "rotating-calipers": {
   "brute": "先想暴力解：凸包求出后枚举全部 m(m-1)/2 个点对算距离平方取最大，O(m²)——凸包点数接近 n 时跟枚举全部点对没区别。关键观察：最远点对必然是凸包上的「对踵点对」：对每条有向边，离它最远的顶点随边沿凸包逆时针推进时只会单调前进、绝不回退。于是用两根指针：外层枚举边 i，内层只要下一个顶点 j+1 到该边的叉积绝对值更大就让 j 前进，然后拿边两端点与 j 配对更新答案，总判断次数 O(m)。",
   "bruteCode": "def brute(pts, hull):\n    best = 0\n    m = len(hull)\n    for a in range(m):\n        for b in range(a + 1, m):\n            dx = pts[hull[a]][0] - pts[hull[b]][0]\n            dy = pts[hull[a]][1] - pts[hull[b]][1]\n            best = max(best, dx * dx + dy * dy)\n    return best",
   "walkthrough": {
    "input": "points = [[0,0],[6,0],[6,2],[0,2],[3,1]]，其中 (3,1) 在矩形内部，返回最远点对距离平方",
    "steps": [
     "先按 x、y 排序并用单调链求出凸包 (0,0)→(6,0)→(6,2)→(0,2)，hull=[0,1,2,3]、m=4；暴力要比较 C(4,2)=6 个点对。",
     "卡壳只维护「边 i + 对踵点 j」，j 只前进不回退。初始 i=0、j=1，当前边是 (0,0)→(6,0)。",
     "j=1 到边的叉积绝对值 |6·0-0·6|=0，j=2 为 |6·2-0·6|=12 更大 → j 前进到 2；j=2 与 j=3 的值 12 与 12 相等不再前进。边两端点与 j=2 配对：(0,0)-(6,2) 距离平方 36+4=40，(6,0)-(6,2) 为 4，best=40。",
     "i=1 边 (6,0)→(6,2)：j=2、j=3 的值为 0、12 → j 前进到 3，(6,0)-(0,2) 距离平方 40；i=2、i=3 时 j 继续绕圈前进到 0、1，各配对的距离平方都不超过 40。",
     "返回 diameter²=40，最远点对 (0,0)-(6,2)，距离 √40=2√10≈6.32；凸包已知后只做 O(m) 次叉积比较，暴力是 O(m²)。"
    ]
   }
  },
  "closest-pair": {
   "brute": "先想暴力解：n 个点两两枚举算距离平方取最小，O(n²)，n=10^5 时约 5×10^9 对，无法接受。关键观察：按 x 排序后对半分治，最近点对要么同在左半、要么同在右半、要么跨越中线；前两种递归求解得到当前最优 d，第三种只需检查 |x-中线|<√d 的条带——条带内按 y 排序后，同侧任意两点间距已 ≥d，每个点最多再与后面常数个点比较即可，合并代价 O(n)，总复杂度 T(n)=2T(n/2)+O(n)=O(n log n)。",
   "bruteCode": "def brute(pts):\n    best = None\n    n = len(pts)\n    for i in range(n):\n        for j in range(i + 1, n):\n            dx = pts[i][0] - pts[j][0]\n            dy = pts[i][1] - pts[j][1]\n            d = dx * dx + dy * dy\n            if best is None or d < best:\n                best = d\n    return best",
   "walkthrough": {
    "input": "points = [[0,0],[3,4],[1,1],[5,1],[2,2]]，返回最近距离平方与点对下标",
    "steps": [
     "5 个点按 x 排序为 0(0,0)、2(1,1)、4(2,2)、1(3,4)、3(5,1)，从中点 x=2 分成左右两半递归。",
     "左半 {(0,0),(1,1)} 两两枚举得 d²=(1-0)²+(1-0)²=2；右半 {(2,2),(3,4),(5,1)} 两两枚举最小是 (2,2)-(3,4) 的 1+4=5。全局 best=2。",
     "合并阶段只查 |x-2|<√2 的条带：入选 2(1,1)、4(2,2)、1(3,4)，按 y 排序后逐对试：(1,1)-(2,2) 的 d²=2 不更小；(1,1)-(3,4) 因 Δy²=9≥best 直接剪枝。条带内没有更近的点对，best 仍为 2。",
     "最后按 x 序扫描还原点对：第一个距离平方恰为 2 的是下标对 (0,2)，字典序最小，返回 distance²=2、pair=[0,2]，最近距离 √2≈1.41。",
     "暴力要比 C(5,2)=10 对，分治只算了左半 1 对、右半 3 对加条带 3 对检查；T(n)=2T(n/2)+O(n) 给出 O(n log n)。"
    ]
   }
  },
  "delaunay-triangulation": {
   "brute": "先想暴力解：枚举所有三点组合，检验其外接圆是否为空、边是否被其他点遮挡，从零拼出一张合法三角剖分，组合数 O(n³) 起步且退化情况繁多。关键观察：Delaunay 剖分可以增量构造——先造一个足够大的超级三角形罩住全部点，逐个插入新点：找出外接圆包含新点的「坏三角形」，删掉后形成一个空腔，把空腔边界的每条边与新点相连；每步只动局部，期望 O(n log n)，最后丢弃含超级顶点的三角形。",
   "bruteCode": "def brute(pts):\n    n = len(pts)\n    tris = []\n    for a in range(n):\n        for b in range(a + 1, n):\n            for c in range(b + 1, n):\n                ax, ay = pts[a]\n                bx, by = pts[b]\n                cx, cy = pts[c]\n                d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))\n                if abs(d) < 1e-12:\n                    continue\n                ux = ((ax*ax + ay*ay) * (by - cy) + (bx*bx + by*by) * (cy - ay) + (cx*cx + cy*cy) * (ay - by)) / d\n                uy = ((ax*ax + ay*ay) * (cx - bx) + (bx*bx + by*by) * (ax - cx) + (cx*cx + cy*cy) * (bx - ax)) / d\n                r2 = (ax - ux) ** 2 + (ay - uy) ** 2\n                empty = all((pts[k][0] - ux) ** 2 + (pts[k][1] - uy) ** 2 > r2 + 1e-12\n                            for k in range(n) if k not in (a, b, c))\n                if empty:\n                    tris.append([a, b, c])\n    return sorted(tris)",
   "walkthrough": {
    "input": "points = [[0,0],[5,1],[1,4]]，返回剖分中各三角形的顶点下标列表",
    "steps": [
     "3 个点 (0,0)、(5,1)、(1,4)：坐标范围宽 5、高 4，dmax=50，先建超级三角形 (-47.5,-48)、(52.5,-48)、(2.5,52)（编号 3、4、5），初始三角表只有它。",
     "插入 (0,0)：超级三角形外接圆圆心 (2.5,-10.5)、R²=3906.25，该点到圆心距离平方仅 6.25+110.25=116.5，远在圆内 → 唯一三角形判坏，删掉后 3 条边界边各连出新三角形 (3,4,0)、(4,5,0)、(5,3,0)。",
     "插入 (5,1)：逐个检验外接圆，只有 (4,5,0) 坏（点到其圆心距离平方约 4567 < R²≈5277），空腔边界边 (4,5)、(5,0)、(0,4) 各与新点相连成 3 个新三角形。",
     "插入 (1,4)：坏三角形是 (5,3,0) 与 (5,0,1)（点距圆心平方约 6931<6996、505<693），二者共享的内部边 (0,5) 被删，4 条空腔边界边各连出新三角形。",
     "最后丢弃所有含超级顶点 3/4/5 的三角形，剩下 (0,1,2)，按字典序返回 [[0,1,2]]；每步只重算局部空腔，这是期望 O(n log n) 的来源。"
    ]
   }
  },
  "voronoi-relaxation": {
   "brute": "先想暴力解：把边界矩形切成细网格，每个网格点找最近站点，用格子数近似每个站点的 Voronoi 单元再估质心——要精度就得加密网格，成本随精度平方级上涨，边界仍是锯齿。关键观察：站点 i 的单元恰是一组半平面的交——它与每个其他站点 j 的中垂线把平面分成两半，从边界矩形出发逐条裁剪即得精确单元，再用鞋带公式算质心、把站点挪到质心，迭代即 Lloyd 松弛。",
   "bruteCode": "def brute(points, bounds, res=64):\n    xmin, ymin, xmax, ymax = bounds\n    sx = (xmax - xmin) / res\n    sy = (ymax - ymin) / res\n    mass = [0.0] * len(points)\n    cx = [0.0] * len(points)\n    cy = [0.0] * len(points)\n    for i in range(res):\n        for j in range(res):\n            x = xmin + (i + 0.5) * sx\n            y = ymin + (j + 0.5) * sy\n            best, bi = None, 0\n            for k, (px, py) in enumerate(points):\n                d = (x - px) ** 2 + (y - py) ** 2\n                if best is None or d < best:\n                    best, bi = d, k\n            mass[bi] += 1.0\n            cx[bi] += x\n            cy[bi] += y\n    return [(cx[k] / mass[k], cy[k] / mass[k]) if mass[k] else points[k]\n            for k in range(len(points))]",
   "walkthrough": {
    "input": "points = [[0,0],[4,0]]，bounds = [0,0,4,4]，iterations = 2",
    "steps": [
     "两个站点 (0,0)、(4,0)，边界矩形 [0,4]×[0,4]。每轮对每个站点用「它与所有其他站点连线的中垂线」逐条裁剪矩形，得到该站点的 Voronoi 单元。",
     "站点 (0,0) 对 (4,0)：中垂线系数 a=2(4-0)=8、b=0、c=4²+0²-0-0=16，半平面 8x≤16 即 x≤2，裁剪得左半矩形，顶点 (0,0)、(2,0)、(2,4)、(0,4)。",
     "鞋带质心公式算出该单元质心 (1,2)；站点 (4,0) 对称地得到右半单元，质心 (3,2)。第 1 轮后站点移到 (1,2)、(3,2)。",
     "第 2 轮：两点仍关于 x=2 对称，中垂线还是 x=2，单元与质心都不再变化——(1,2)、(3,2) 是不动点，返回 [[1.0,2.0],[3.0,2.0]]。",
     "每轮 n 个站点各做 n-1 次裁剪再加质心计算；Lloyd 迭代让站点趋向单元质心，整体分布越来越均匀。"
    ]
   }
  },
  "sieve-of-eratosthenes": {
   "brute": "先想暴力解：对 2..n 每个数用试除判质（除到 √k），单个数 O(√k)，总计 O(n√n)，n=10^7 时约 3×10^10 次取模，太慢。关键观察：合数一定是某个更小质数的倍数——让质数「主动标记」倍数：遇到未标记的 p 就收入质数表，并从 p² 起把倍数全部标掉，扫完未标记者即质数；从 p² 起标记是因为更小的倍数已被更小的质数处理过，总标记量只有约 n·log log n。",
   "bruteCode": "def brute(n):\n    primes = []\n    for k in range(2, n + 1):\n        is_prime = True\n        d = 2\n        while d * d <= k:\n            if k % d == 0:\n                is_prime = False\n                break\n            d += 1\n        if is_prime:\n            primes.append(k)\n    return primes",
   "walkthrough": {
    "input": "n = 30，返回质数个数与最后 10 个质数",
    "steps": [
     "建 is_composite[0..30] 全 False。p=2 未被标记 → 收入质数表，并从 p²=4 起把 4,6,8,…,30 共 14 个偶数标记为合数。",
     "p=3 未标记 → 收入；从 9 起标 9,12,15,…,30，其中 12、18、24、30 已被 2 标过，实际新增 9、15、21、27 这 4 个。",
     "p=4 已标记跳过；p=5 → 收入，从 25 起标，30 已标过、只新增 25；p=6、8 等都是合数；p=7 → 收入，但 p²=49>30，内层循环一次都不跑。",
     "8 之后剩下的 11、13、17、19、23、29 没被任何质数标记 → 依次收入质数表。",
     "质数表共 10 个：2,3,5,7,11,13,17,19,23,29，count=10，primes_last10 即整表；「从 p² 起标」避免重复劳动，总标记量约 n·log log n。"
    ]
   }
  },
  "segmented-sieve": {
   "brute": "先想暴力解：对 [L,R] 内每个数单独试除判质，O((R-L+1)·√R)；或者用普通埃筛从 2 一路筛到 R，但标记数组要开 O(R) 大——R=10^12 时内存直接爆掉。关键观察：区间内任何合数必有不超过 √R 的质因子——先用普通筛把 [2,√R] 的基础质数求出（数组只要 O(√R)），再用每个基础质数 p 从 max(p², ⌈L/p⌉·p) 开始只标记区间内的倍数，标记数组只需区间长度那么大。",
   "bruteCode": "def brute(lo, hi):\n    count = 0\n    for k in range(lo, hi + 1):\n        if k < 2:\n            continue\n        is_prime = True\n        d = 2\n        while d * d <= k:\n            if k % d == 0:\n                is_prime = False\n                break\n            d += 1\n        if is_prime:\n            count += 1\n    return count",
   "walkthrough": {
    "input": "lo = 20，hi = 40，返回区间内质数个数",
    "steps": [
     "先只对 2..int(√40)+1=7 跑普通筛，得基础质数 2、3、5、7——区间内任何合数必有不超过 √40 的质因子。",
     "开长度 21 的标记数组对应 20..40。p=2 从 max(4, ⌈20/2⌉·2)=20 起标记 20,22,…,40 共 11 个偶数。",
     "p=3 从 max(9,21)=21 起标 21,24,27,30,33,36,39；p=5 从 max(25,20)=25 起标 25,30,35,40（30 已标）；p=7 的起点 max(49,21)=49 超出 40，一个都不标。",
     "扫描区间：未标记且 ≥2 的只有 23、29、31、37，返回 4。",
     "对比：普通筛要开 O(40) 的全量数组，这里只开 √40≈6 的基础表加区间长 21 的标记表；当 lo、hi 达 10^12 而区间不长时，这个内存差距是决定性的。"
    ]
   }
  },
  "fourier-epicycles": {
   "brute": "先想暴力解：想画出 n 级旋轮叠加的轮廓，最直接的办法是逐帧模拟——把时间切成大量小步，每帧把每个旋转向量按各自频率旋转后首尾相接，记录笔尖轨迹；帧数要足够多才平滑，成本 O(帧数×n)，而且只能得到一堆曲线点，回答不了「每个频率的半径和初相是多少」。关键观察：把轮廓等间隔采样成 n 个点，它就是一个周期信号，离散傅里叶变换直接给出各旋轮系数 c_k=Σ_t v_t·e^(-2πikt/n)，一次 O(n²) 求和代替逐帧拟合。",
   "bruteCode": "import math\n\ndef brute(points, frames=64):\n    n = len(points)\n    pen = []\n    for f in range(frames):\n        t = f * n / frames\n        x = 0.0\n        y = 0.0\n        for k in range(n):\n            ang = 2.0 * math.pi * k * t / n\n            x += math.cos(ang)\n            y += math.sin(ang)\n        pen.append((round(x, 2), round(y, 2)))\n    return pen",
   "walkthrough": {
    "input": "points = [0, 1, 0, 0]，4 个等间隔采样值",
    "steps": [
     "把 4 个采样看成周期信号，对每个频率 k 计算 c_k=Σ_t v_t·e^(-2πikt/n)，n=4。",
     "k=0：各角度全为 0，只有 t=1 处 v=1 有贡献，系数 (1,0)——信号的直流分量，对应最大那级旋轮。",
     "k=1：t=1 的角度 -2π·1·1/4=-π/2，贡献 (cos(-π/2), sin(-π/2))·1=(0,-1)，其余样本为 0，系数 [0,-1]。",
     "k=2、k=3 的角度分别是 -π、-3π/2，系数 [-1,0]、[0,1]；四级旋轮半径都是 1、初相依次相差 90°。",
     "叠加这四个旋轮可精确重建只在 t=1 处为 1 的脉冲轮廓，返回 [[1,0],[0,-1],[-1,0],[0,1]]；直接 DFT 每个 k 都扫全部 n 个样本，O(n²)，采样多时改用 FFT 降到 O(n log n)。"
    ]
   }
  },
  "gaussian-elimination": {
   "brute": "先想暴力解：用克莱姆法则——n 元方程组要算 n+1 个 n 阶行列式，按定义展开每个是 O(n!)，二元还行，四元 4!=24 还能忍，n=10 就完全不可行；手工代入消元可行但难以系统化、也不给秩的信息。关键观察：三类行变换（交换两行、非零倍乘一行、一行倍数加到另一行）都不改变解集——逐列选绝对值最大的主元（数值最稳），归一化后把主元列上下全部消成 0，矩阵变成行最简形，解直接可读，O(n³)。",
   "bruteCode": "def brute(matrix):\n    n = len(matrix)\n    if n == 1:\n        a, b = matrix[0][0], matrix[0][1]\n        return [b / a] if a != 0 else None\n    det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]\n    if det == 0:\n        return None\n    b1, b2 = matrix[0][2], matrix[1][2]\n    x = (b1 * matrix[1][1] - matrix[0][1] * b2) / det\n    y = (matrix[0][0] * b2 - b1 * matrix[1][0]) / det\n    return [x, y]",
   "walkthrough": {
    "input": "matrix = [[2,1,5],[1,3,10]]，即方程组 2x+y=5、x+3y=10",
    "steps": [
     "第 1 列选主元：|2|>|1|，第 0 行作主元行（无需交换），行归一化得 [1, 0.5, 2.5]。",
     "用主元行消其他行的第 1 列：第 1 行减去 1 倍主元行 → [0, 2.5, 7.5]；主元列上方也清零，这是高斯-若尔当做法。",
     "第 2 列在剩余行中选主元 |2.5|，归一化得 [0, 1, 3]；回头把第 0 行的 0.5 消掉：[1, 0.5, 2.5]-0.5·[0,1,3]=[1, 0, 1]。",
     "系数部分已成单位矩阵，没有「0=非零」的矛盾行、主元列数 2 等于未知数个数 → 判定唯一解。",
     "直接读出 x=1、y=3，代回验证 2·1+3=5、1+9=10 都成立；每列选主元、归一化、消元各 O(n²)，总 O(n³)。"
    ]
   }
  },
  "matrix-exponentiation": {
   "brute": "先想暴力解：从单位矩阵出发把 base 连乘 n 次得到 M^n，k 阶方阵一次乘法 O(k³)，总 O(n·k³)；用它求斐波那契第 n 项，n=10^6 已经很慢，n=10^18 完全无望。关键观察：指数可以按二进制分解——M^(2t)=(M^t)²，于是「乘 n 次」变成「每个二进制位平方一次、该位为 1 再乘进结果」，代价 O(k³ log n)，10^18 量级的指数也只要约 120 次矩阵乘法。",
   "bruteCode": "def brute(matrix, n, mod):\n    k = len(matrix)\n    result = [[1 % mod if i == j else 0 for j in range(k)] for i in range(k)]\n\n    def mul(a, b):\n        return [[sum(a[r][t] * b[t][c] for t in range(k)) % mod\n                 for c in range(k)] for r in range(k)]\n\n    for _ in range(n):\n        result = mul(result, matrix)\n    return result",
   "walkthrough": {
    "input": "matrix = [[1,1],[1,0]]（斐波那契递推矩阵），exponent = 5，modulus = 1000",
    "steps": [
     "指数 5 的二进制是 101。result 初始化为单位矩阵、base=原矩阵，从低位到高位逐位处理。",
     "第 1 位是 1：result=I·M=M；base 平方得 M²=[[2,1],[1,1]]，指数右移为 10。",
     "第 2 位是 0：result 不动；base 再平方得 M⁴=[[5,3],[3,2]]，指数右移为 1。",
     "第 3 位是 1：result=result·base=M·M⁴=[[8,5],[5,3]]，指数变 0 结束。结果 [0][1]=5=F(5)、[0][0]=8=F(6)，验证无误。",
     "n=5 时连乘与快速幂都要 4 次 k³ 矩阵乘，看不出差距；n=10^18 时连乘要 10^18 次，快速幂只需约 2×60 次，复杂度 O(k³ log n)。"
    ]
   }
  },
  "fft": {
   "brute": "先想暴力解：卷积按定义算 c[k]=Σ_i a[i]·b[k-i]，双重循环 O(n²)，多项式乘法同理；n=10^5 时约 10^10 次乘加，撑不住。关键观察：卷积定理——两个序列的卷积对应其傅里叶变换的逐点乘法。FFT 利用旋转因子的对称性把变换降到 O(n log n)：先按位逆序重排，再按长度 2、4、…分层做蝶形合并；正向变换、逐点相乘、逆向变换，总共 3 次 O(n log n) 变换完成卷积。",
   "bruteCode": "def brute(a, b):\n    out = [0] * (len(a) + len(b) - 1)\n    for i, x in enumerate(a):\n        for j, y in enumerate(b):\n            out[i + j] += x * y\n    return out",
   "walkthrough": {
    "input": "a = [1,2,3,4]，b = [5,6]，求线性卷积",
    "steps": [
     "结果长度 4+2-1=5，补零到 size=8（2 的幂）；fa、fb 各做一次正向 FFT。",
     "变换内部先按位逆序重排（size=8 时下标 1↔4、3↔6），再按长度 2、4、8 分层做蝶形，每层 4 个蝶形、共 log₂8=3 层。",
     "频域逐点相乘 fc[i]=fa[i]·fb[i]：时域卷积对应频域乘法，这是 FFT 加速卷积的核心恒等式。",
     "对 fc 做逆向 FFT（旋转因子取共轭方向、最后除以 8），取前 5 项四舍五入得 [5,16,27,38,24]。",
     "手算核对：c[0]=1·5=5，c[1]=1·6+2·5=16，c[2]=2·6+3·5=27，c[3]=3·6+4·5=38，c[4]=4·6=24。本例 n 小、FFT 常数反而更大；n 到 10^5 量级时 3 次 O(n log n) 变换远胜 O(n²) 的定义式卷积。"
    ]
   }
  },
  "modular-exponentiation": {
   "brute": "先想暴力解：把底数自乘 exponent 次、每次取模，O(exponent) 次乘法；指数是 10^18 级别时就算每秒十亿次乘法也要几十年，中途忘取模的话大数还会溢出。关键观察：a^(2t)=(a^t)²、a^(2t+1)=a·(a^t)²——按指数的二进制位从低位往高位走：每轮把底数平方一次，当前位是 1 就把底数乘进结果，每步都取模，O(log exponent) 次乘法完成。",
   "bruteCode": "def brute(base, exponent, modulus):\n    result = 1 % modulus\n    for _ in range(exponent):\n        result = result * base % modulus\n    return result",
   "walkthrough": {
    "input": "base = 3，exponent = 13，modulus = 7",
    "steps": [
     "求 3^13 mod 7：13 的二进制是 1101。result 从 1 出发、base 从 3 出发，每轮读指数最低位。",
     "第 1 位 1：result=1·3 mod 7=3；base 自乘 9 mod 7=2，指数右移为 110。",
     "第 2 位 0：result 不动；base 2²=4，指数右移为 11。",
     "第 3 位 1：result=3·4 mod 7=12 mod 7=5；base 4²=16 mod 7=2，指数右移为 1。",
     "第 4 位 1：result=5·2 mod 7=3，指数归 0，返回 3。核对：3^6=729≡1 (mod 7)，故 3^13=3^12·3≡3；全程每步取模、数值不超过 7²，共 4 轮，O(log exponent)。"
    ]
   }
  },
  "extended-euclidean": {
   "brute": "先想暴力解：先用辗转相除求出 g，再从 0 到 b-1 枚举 x，逐个检验 (g-a·x) 是否被 b 整除，首个成功者给出 y=(g-a·x)/b——枚举 O(b)，b 上万就慢，还要单独处理 b=0 与负数。关键观察：辗转相除的每步余数都是 a、b 的整系数线性组合，把余数递推同步作用在系数 s 上，循环结束时 old_s 自动就是 a 的 Bézout 系数，全程 O(log min(a,b))。",
   "bruteCode": "def brute(a, b):\n    g, r = a, b\n    while r:\n        g, r = r, g % r\n    if b == 0:\n        return g, 1, 0\n    for x in range(b):\n        if (g - a * x) % b == 0:\n            return g, x, (g - a * x) // b\n    return g, 0, 0",
   "walkthrough": {
    "input": "a = 35，b = 15，求 gcd 以及 35x+15y=gcd 的整数系数",
    "steps": [
     "维护余数对 (old_r,r)=(35,15) 与系数对 (old_s,s)=(1,0)，不变量：a·old_s+b·t=old_r（t 是 b 的系数，无需记录）。初始 35·1+15·0=35 成立。",
     "第 1 步 q=35//15=2：余数 5，两组状态同步右移 → (old_r,r)=(15,5)、(old_s,s)=(0, 1-2·0=1)。核对 35·0+15·1=15=old_r。",
     "第 2 步 q=15//5=3：余数 0 → (old_r,r)=(5,0)、(old_s,s)=(1, 0-3·1=-3)，此时 35·1+15·(-2)=5=old_r。",
     "r=0 循环结束：g=5、x=old_s=1；把 x 规范到 [0, b/g) 内：x=1 mod 3=1，y=(5-35·1)//15=-2。",
     "验证 35·1+15·(-2)=5 ✓。比普通欧几里得多维护一列同步更新的系数，仍 O(log min(a,b))；通解为 x+k·(b/g)、y-k·(a/g)。"
    ]
   }
  },
  "euclidean-algorithm": {
   "brute": "先想暴力解：从 min(a,b) 向下逐个枚举 d，第一个同时整除 a 和 b 的就是 gcd，最坏 O(min(a,b)) 次取模，两数几十万就要扫几十万次。关键观察：gcd(a,b)=gcd(b, a mod b)——a 与 b 的公因数集合和 b 与余数的完全一致；余数每轮至少折半，O(log min(a,b)) 步收敛，途中记录的商序列还顺手给出连分数展开。",
   "bruteCode": "def brute(a, b):\n    for d in range(min(a, b), 0, -1):\n        if a % d == 0 and b % d == 0:\n            return d\n    return 1",
   "walkthrough": {
    "input": "a = 48，b = 18，返回 gcd、商序列与步数",
    "steps": [
     "big=48、small=18。第 1 步：q=48//18=2，余 12 → (big,small)=(18,12)。",
     "第 2 步：q=18//12=1，余 6 → (big,small)=(12,6)。",
     "第 3 步：q=12//6=2，余 0 → (big,small)=(6,0)，small=0 循环结束。",
     "返回 gcd=6、商序列 [2,1,2]、steps=3；商序列正是 48/18 的连分数展开 [2;1,2]。",
     "正确性靠 gcd(a,b)=gcd(b,a mod b)：48、18 的公因数与 18、12 的完全一致；余数每轮至少折半，最坏情形是相邻斐波那契数（如 gcd(34,21) 要 7 步），仍只有 O(log min(a,b))。"
    ]
   }
  },
  "euler-totient": {
   "brute": "先想暴力解：对每个 k∈[1,m] 用辗转相除判 gcd(k,m)=1 并计数，求单个 φ 要 O(m log m)；或先试除分解出 m 的全部质因子、再按公式 m·∏(1-1/p) 计算，公式里的分数要小心通分。关键观察：φ(m)=m·∏(1-1/p) 可以整数化——对每个新质因子 p 执行 result -= result//p（先把 n 里的 p 除尽再更新），试除只到 √n，单点 O(√m)。",
   "bruteCode": "def brute(m):\n    from math import gcd\n    return sum(1 for k in range(1, m + 1) if gcd(k, m) == 1)",
   "walkthrough": {
    "input": "queries = [12, 30]",
    "steps": [
     "φ(m)=m·∏(1-1/p)：对每个不同质因子 p 用整数递推 result -= result//p 累积，试除只到 √n。",
     "m=12：p=2 整除，先把 n 中的 2 除尽（12→3），result=12-12//2=6；p=3 时 p²=9>3 跳出循环，n=3>1 → result=6-6//3=4。φ(12)=4，即 1、5、7、11。",
     "m=30：p=2 → n=15、result=30-15=15；p=3 → n=5、result=15-5=10；p=5 时 p²=25>5 跳出，n=5>1 → result=10-10//5=8。φ(30)=8。",
     "p 从 2 之后按 2 步进跳过偶数；「先除尽再更新」保证每个质因子只贡献一次 (1-1/p)。",
     "单点试除 O(√m)；要批量求 1..n 的全部 φ 值时改用线性筛，在筛质数的同时递推，总 O(n)。"
    ]
   }
  },
  "linear-sieve": {
   "brute": "先想暴力解：对每个 m 从 2 试除到 √m 找最小质因子，单个 O(√m)，批量 1..n 总计 O(n√n)；普通埃筛虽快些，但像 30 这样的合数会被 2、3、5 各标记一次，而且它不直接给出最小质因子。关键观察：合数 i·p 的最小质因子是 min(spf[i], p)——外层枚举 i、内层只乘不超过 spf[i] 的质数并立即 break，每个合数恰被标记一次，总操作严格 O(n)。",
   "bruteCode": "def brute(n):\n    spf = [0] * (n + 1)\n    primes = []\n    for m in range(2, n + 1):\n        if spf[m]:\n            continue\n        spf[m] = m\n        primes.append(m)\n        for k in range(m, n + 1, m):\n            if spf[k] == 0:\n                spf[k] = m\n    return primes, spf",
   "walkthrough": {
    "input": "n = 30，queries = [30, 21, 25, 1]，返回质数个数与各查询的最小质因子",
    "steps": [
     "spf 数组记录每个数的最小质因子。i 从 2 到 30：spf[i]=0 说明 i 是质数，记 spf[i]=i 并收入质数表。",
     "对每个 i 用已得的质数表筛 i·p：条件是 p≤spf[i] 且 i·p≤30，随后立即 break。i=2 筛掉 4；i=3 筛掉 6、9；i=4（spf=2）只筛 8，p=3>2 就跳出。",
     "每个合数被「最小质因子所在的 i」标一次：12 由 i=6、p=2；15 由 i=5、p=3；21 由 i=7、p=3；25 由 i=5、p=5；27 由 i=9、p=3；30 由 i=15、p=2。",
     "质数表 [2,3,5,7,11,13,17,19,23,29] 共 10 个；查询返回 spf：30→2、21→3、25→5、1→None（1 没有质因子）。",
     "普通埃筛里 30 会被 2、3、5 各标一次；线性筛靠 p≤spf[i] 即断保证每合数恰标一次，总操作 O(n)，且 spf 数组可直接用于质因数分解。"
    ]
   }
  },
  "ntt": {
   "brute": "先想暴力解：卷积按定义双重循环 O(n²)，结果精确但慢；用 FFT 虽是 O(n log n)，可它算的是浮点复数，系数要四舍五入，卷积值很大或 n 很大时误差可能把整数结果带偏。关键观察：把复数单位根换成模 p 原根——998244353=119·2²³+1 这类「NTT 友好素数」的原根 g 能生成模意义下的 n 次单位根 pow(g,(p-1)/n,p)，蝶形结构照搬 FFT，全程整数运算、结果模 p 精确。",
   "bruteCode": "MOD = 998244353\n\ndef brute(a, b):\n    out = [0] * (len(a) + len(b) - 1)\n    for i, x in enumerate(a):\n        for j, y in enumerate(b):\n            out[i + j] = (out[i + j] + x * y) % MOD\n    return out",
   "walkthrough": {
    "input": "a = [1,2,3,4]，b = [5,6]，模 998244353 求卷积",
    "steps": [
     "结果长度 4+2-1=5，补零到 size=8。998244353=119·2²³+1，原根 3 保证各长度单位根存在：w_len=pow(3,(mod-1)/length,mod)。",
     "对 fa、fb 各做一次正向 NTT：位逆序重排（size=8 时 1↔4、3↔6）后按长度 2、4、8 分层蝶形，每层 4 个蝶形、共 3 层，旋转因子用模幂精确生成。",
     "频域逐点相乘 fc[i]=fa[i]·fb[i] mod p，全程整数运算，没有任何浮点舍入。",
     "逆向变换把 w_len 换成其逆元 pow(w_len, mod-2, mod)，最后乘 n 的逆元 pow(8, mod-2, mod) 归一，取前 5 项得 [5,16,27,38,24]。",
     "与 FFT 相比：FFT 的复数根要四舍五入，值大或 n 大时可能失真；NTT 在模意义下精确，代价是模数必须形如 k·2^m+1。3 次 O(n log n) 变换完成卷积。"
    ]
   }
  },
  "prime-factorization": {
   "brute": "先想暴力解：从 2 到 n 把每个整数都拿来试除，能除尽就记下该因子的指数再继续除，扫完即得标准分解。它正确，但最坏要做约 n 次除法，O(n) 在 n 很大时不可接受。关键观察是：因子总是成对出现，若 d 是 n 的因子，n/d 也是，所以试到 √n 就够了；而且把所有小于 √n 的因子除尽后，剩下的数若大于 1 必然是质因子，无需再验证。solution.py 据此只试除到 √n，并在 2 之后每次步进 2，跳过所有偶数候选。",
   "bruteCode": "def brute(n):\n    factors = []\n    for d in range(2, n + 1):\n        e = 0\n        while n % d == 0:\n            n //= d\n            e += 1\n        if e:\n            factors.append([d, e])\n    return factors",
   "walkthrough": {
    "input": "n = 60",
    "steps": [
     "初始 n=60，试除从 d=2 开始：60÷2=30，30÷2=15，15 不再被 2 整除，记下 [2,2]，n 缩小为 15。",
     "d 递增到 3（2 之后每次 +2，跳过偶数）：15÷3=5，记下 [3,1]，n=5。",
     "d=5 时 5×5=25 > 5，主循环结束；剩余 n=5 大于 1，说明它自身是质因子，追加 [5,1]。",
     "得到 60 = 2² × 3 × 5。不变量：每次试除只删去已确认的质因子，已记因子之积与剩余 n 的乘积恒等于 60。",
     "暴力逐个试到 n 最多要约 59 次除法；这里 d 只走到 5——若剩余 n 还有不大于 √n 的因子早被除掉了，大于 √n 的剩余部分必是质数。"
    ]
   }
  },
  "chinese-remainder-theorem": {
   "brute": "先想暴力解：从 0 开始逐个枚举整数，检查是否满足所有同余条件，命中即返回。答案以 M（各模数之积）为周期，最坏要枚举 M 次，M 随条件个数相乘式膨胀，模数稍大即不可行。关键观察是：解可以逐条合并——已有 x 满足前 k 条（模 M），新解必形如 x+kM，代入新条件得 kM ≡ r−x (mod m)，用扩展欧几里得求出 M 在模 m 下的逆元即可解出 k，一次合并即得。solution.py 正是逐条合并并累积 modulus。",
   "bruteCode": "def brute(equations):\n    x = 0\n    while True:\n        if all(x % m == r % m for r, m in equations):\n            return x\n        x += 1",
   "walkthrough": {
    "input": "equations = [[2, 3], [3, 5]]，即 x≡2 (mod 3) 且 x≡3 (mod 5)",
    "steps": [
     "初始状态 x=0、modulus=1（空约束的平凡解）。合并第一条 x≡2 (mod 3)：diff=(2−0)%3=2，modulus=1 的逆元是 1，k=2×1%3=2，得 x=0+2×1=2，modulus 扩为 3。",
     "此时解集是 x≡2 (mod 3)，即 x=2+3k。合并第二条 x≡3 (mod 5)：diff=(3−2)%5=1。",
     "用扩展欧几里得求 3 在模 5 下的逆元：3×2=6≡1 (mod 5)，故 inv=2，k=1×2%5=2。",
     "x=2+2×3=8，modulus=3×5=15。验证：8%3=2、8%5=3，两条都满足，答案为 x≡8 (mod 15)。",
     "暴力从 0 枚举要到第 9 个数才命中 8；模数一大到 10⁹ 量级枚举彻底失效，逐条合并只需 k 次扩展欧几里得，代价 O(k log M)。"
    ]
   }
  },
  "baby-step-giant-step": {
   "brute": "先想暴力解：令 x=0,1,2,… 逐个算 a^x mod m 与 b 比，最多试 m−1 次，O(m) 随模数爆炸。关键观察是：把指数拆成 x=i·s−j（s≈√m），a^x=b 等价于 a^{i·s}=b·a^j。先用 s 次乘法把所有 b·a^j 存入哈希表（婴儿步），再用 s 次乘法枚举 a^{i·s} 查表（巨人步），相遇即解出 x，时空降到 O(√m)。solution.py 的 table 与 giant 循环正是这两步。",
   "bruteCode": "def brute(modulus, base, target):\n    value = 1 % modulus\n    for x in range(modulus):\n        if value == target:\n            return x\n        value = value * base % modulus\n    return -1",
   "walkthrough": {
    "input": "modulus = 7，base = 3，target = 4，即求 3^x ≡ 4 (mod 7)",
    "steps": [
     "step=⌊√7⌋+1=3，把目标改写为找 i·step−j 使得 3^{i·step} = 4·3^j (mod 7)。",
     "婴儿步建表：j=0 存 4·3⁰=4，j=1 存 4·3=12≡5，j=2 存 4·9=36≡1；循环结束时 baby=3³=27≡6 (mod 7)，作为巨人步因子。",
     "巨人步查表：i=1 时 giant=1×6=6，不在表中；i=2 时 giant=6×6=36≡1 (mod 7)，1 在表中对应 j=2。",
     "返回 x=i·step−j=2×3−2=4。验证：3⁴=81=11×7+4，确实模 7 余 4。",
     "暴力要逐个试 x=0,1,2,3,4 共 5 次模乘才命中；小模数下两者次数相当，但模数到 10¹² 时 O(m) 与 O(√m) 相差百万倍——哈希表把「枚举指数」变成「查找相遇」。"
    ]
   }
  },
  "miller-rabin": {
   "brute": "先想暴力解：试除——把 2,3,…,√n 逐个拿来除 n，除尽即合数。它可靠，但 O(√n) 对大数是天文数字次除法。关键观察是：素数满足费马小定理 a^(n−1)≡1 (mod n)；再把 n−1 写成 2^r·d，检查平方链「到达 1 之前必须先经过 n−1」，就能识破卡迈克尔数这类费马伪素数。用十余个固定底数测试即可确定性判断 64 位整数，单底数只要 O(log n) 次模乘。solution.py 的平方链循环正是这一强化。",
   "bruteCode": "def brute(n):\n    if n < 2:\n        return False\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            return False\n        d += 1\n    return True",
   "walkthrough": {
    "input": "queries = [561, 97]",
    "steps": [
     "查询 561：先用 12 个小质数底试除，561%3=0，立即判为合数——它是能骗过费马小定理的卡迈克尔数，在这里被小因子捷径先截住。",
     "查询 97：不被任何底数整除，把 n−1=96 分解为 2⁵×3，得 d=3、r=5。",
     "底数 a=2：先算 2³=8 (mod 97)，既不是 1 也不是 96；连续平方得 64 → 4096 mod 97=22 → 22² mod 97=96=n−1，链上出现 −1，本底数通过。",
     "其余底数 3,5,…,37 逐一测试都无法证明 97 是合数，返回 True；查询 561 则返回 False。",
     "若 n 是素数，平方链必然在变成 1 之前先经过 n−1；合数至少会被一个底数拆穿。每个底数只需 O(log n) 次模乘，比试除到 √n 快了指数级。"
    ]
   }
  },
  "pollard-rho": {
   "brute": "先想暴力解：试除找最小因子——从 2 起逐个测 d·d≤n 的 d。64 位合数的最小因子可达 10⁹，O(√n) 跑不完。关键观察是：在模 n 迭代伪随机序列 f(x)=x²+c，生日悖论保证序列模真因子 p 远早于模 n 进入循环；用 Floyd 快慢指针让 x、y 异速前进，一旦 gcd(|x−y|, n) 落在 1 与 n 之间即撞出非平凡因子，期望 O(n^(1/4))。solution.py 先小因子试除，再转入 ρ 游走。",
   "bruteCode": "def brute(n):\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            return d\n        d += 1\n    return n",
   "walkthrough": {
    "input": "n = 10403，seed = 1",
    "steps": [
     "n=10403 是奇数，先走小因子快速通道：d=3,5,7,…,99 逐个奇数试除都除不尽。",
     "d=101 时 101²=10201 ≤ 10403 且 10403÷101 恰好整除，返回因子 101——即 10403=101×103。",
     "若最小因子超过 1000（比如两个四位数素数之积），试除到 d<1000 一无所获，就转入 ρ 游走：用种子 LCG 随机选常数 c，从 x=y=2 开始迭代 f(x)=x²+c (mod n)。",
     "游走中 x 每步走 1 次 f、y 走 2 次（Floyd 判圈），每步算 gcd(|x−y|, n)：一旦差值在模某个真因子 p 下相遇而模 n 未相遇，gcd 就是非平凡因子；若 g=n 则换一个 c 重来。",
     "生日悖论保证碰撞期望约 O(√p) ≤ O(n^(1/4)) 步——10403 这样的小数试除更快，但 n 达到 10¹² 量级时 ρ 游走才是现实的选择。"
    ]
   }
  },
  "arithmetic-coding": {
   "brute": "先想暴力解：定长编码——k 个符号每人分 ⌈log₂k⌉ 位，消息有 L 个符号就写 L 段定长码。实现简单、解码无歧义，但完全无视频率：出现 90% 的符号与 1% 的符号占一样多比特。关键观察是：把整条消息映射成 [0,1) 内的一个子区间，概率大的符号区间宽、最终区间不容易变窄，用更少的二进制位就能表示；解码时反复判断值落在哪个符号的子区间，再缩放还原。solution.py 用分数精确维护 low/high 的逐符号收缩。",
   "bruteCode": "def brute(message):\n    table = {\"a\": \"00\", \"b\": \"01\", \"c\": \"10\"}\n    return \"\".join(table[ch] for ch in message)",
   "walkthrough": {
    "input": "freqs = {a:1, b:1, c:2}（总频次 4），message = \"abc\"",
    "steps": [
     "字母表排序 a,b,c，划分子区间：a→[0,1/4)、b→[1/4,1/2)、c→[1/2,1)——c 频率高，占一半宽度。",
     "读入 a：整段 [0,1) 按比例缩进 a 的子区间，得 [0,1/4)。",
     "读入 b：把 [0,1/4) 映射到其中 b 占的相对段 [1/4,1/2)：low=0+¼×¼=1/16，high=0+¼×½=1/8，区间宽从 1/4 缩到 1/16。",
     "读入 c：把 [1/16,1/8) 映射到 c 的相对段 [1/2,1)：low=1/16+1/16×1/2=3/32，high=1/16+1/16×1=1/8。",
     "输出区间 [3/32, 1/8)；解码时取区间内任一数（如 1/10=0.1），反复判断落在哪个符号区间、减下界再除以宽度，即可依次还原 a、b、c——解码端使用同一份频次表。"
    ]
   }
  },
  "run-length-encoding": {
   "brute": "先想暴力解：把文本原样存储或逐字符复制一份，n 个字符就占 n 个位置，重复出现的内容一点也没省。它不会出错，但对充满连续重复的数据（如 AAAAAA）纯属浪费。关键观察是：连续相同的字符段只需记住「字符 + 重复次数」两个信息即可无损还原，游程越长节省越多。solution.py 扫描一遍，每段输出当前字符和游程长度；解码端读一个字母再读其后数字，重放对应次数即可。",
   "bruteCode": "def brute(text):\n    return text",
   "walkthrough": {
    "input": "text = \"AAABBC\"，mode = encode",
    "steps": [
     "i=0：字符 A 从位置 0 连续到 j=3，游程长度 3−0=3，输出 A3，i 跳到 3。",
     "i=3：B 连续 2 个，输出 B2，i 跳到 5。",
     "i=5：单字符 C 游程为 1，本实现照样输出 C1，不省略 1。",
     "得到 A3B2C1——本例压缩后长度与原串相同，RLE 只在长游程时才划算：AAAAAAB 编码为 A6B1，7 个字符缩成 4 个。",
     "解码 A3B2C1：读字母再读其后数字，重放 3 个 A、2 个 B、1 个 C，精确还原 AAABBC，全程无损。"
    ]
   }
  },
  "burrows-wheeler-transform": {
   "brute": "先想暴力解：想让相同字符聚集，最直接的想法是枚举所有排列，给每个排列按「相邻相同字符对数」打分挑最高者——n! 种排列既跑不动，又完全丢失位置信息，无法从结果还原原文，可逆性根本不成立。关键观察是：把原串的所有循环旋转做字典序排序后取最后一列，这个确定性变换会让相同字符自然聚集，且每个字符在原文中的后继恰好按序排在相邻行，借助 LF 映射可以完全逆变换。solution.py 正是「生成旋转 → 排序 → 取末列」。",
   "bruteCode": "def brute(text):\n    from itertools import permutations\n    best = None\n    for perm in set(permutations(text)):\n        s = \"\".join(perm)\n        score = sum(1 for i in range(len(s) - 1) if s[i] == s[i + 1])\n        if best is None or score > best[0]:\n            best = (score, s)\n    return best[1]",
   "walkthrough": {
    "input": "text = \"banana\"",
    "steps": [
     "先补哨兵 $（字典序最小）得 banana$，共 7 个字符，生成全部 7 个循环旋转，如 i=1 得 anana$b、i=6 得 $banana。",
     "按字典序排序：$banana < a$banan < ana$ban < anana$b < banana$ < na$bana < nana$ba。",
     "取每行最后一个字符拼接：a、n、n、b、$、a、a，得到 annb$aa。",
     "观察聚集性：原串里分散的 3 个 a 在输出中两两相邻（第 1、6、7 位），两个 n 也成对出现——旋转排序把「相同后继上下文」的行排到了一起。",
     "可逆性：排序后每行的首字符是上一行末字符在原文中的后继，借助 $ 所在行的主索引可逐位还原原文——这正是 bzip2 在 BWT 之后接 MTF 和 RLE 的原因。"
    ]
   }
  },
  "huffman-coding": {
   "brute": "先想暴力解：定长编码——k 个符号每人 ⌈log₂k⌉ 位，码长与频率无关，四个符号就要每人 2 位。它简单且可唯一解码，但频率偏斜时大量比特浪费在高频符号上。关键观察是：总位数 = Σ频率×码长，给高频符号短码、低频符号长码才省；用小顶堆反复合并频率最小的两个节点，频率低的自然沉到树底拿长码，得到的正是最优前缀树，且任何码字都不是其他码字的前缀。solution.py 的堆合并与栈分配码字正是这一构造。",
   "bruteCode": "import math\n\ndef brute(freqs):\n    width = max(1, math.ceil(math.log2(len(freqs))))\n    return {s: format(i, \"0{}b\".format(width)) for i, s in enumerate(sorted(freqs))}",
   "walkthrough": {
    "input": "freqs = {a:5, b:2, c:1, d:1}",
    "steps": [
     "四个符号按频率装进小顶堆：a=5、b=2、c=1、d=1；规则是每次弹出两个最小者合并成一个新节点。",
     "第一轮弹出 c=1 与 d=1，合并成频次 2 的内部节点；堆里剩 a=5、b=2、节点2。",
     "第二轮弹出 b=2 与节点2（频次相同按入堆序，b 在前），合并成频次 4 的节点；最后一轮 a=5 与它合并成根，最大码长 3。",
     "从根出发左枝记 0、右枝记 1：a 单挂在根的右枝得 1，b 得 00，c、d 得 010、011——频率最高的 a 码最短。",
     "总位数 = 5×1+2×2+1×3+1×3 = 15；定长 2 位编码要 9×2=18 位。前缀性质保证解码无歧义：读到 1 就是 a，读到 00 就是 b。"
    ]
   }
  },
  "lz77": {
   "brute": "先想暴力解：不做任何匹配，每个字符都输出一个字面量令牌 [0,0,字符]，n 个字符产出 n 个令牌，压缩率为零但至少无损。关键观察是：刚出现过的片段往往马上重现，在前方 window 大小的滑动窗口里搜索与当前位置开始的最长匹配，就能用（偏移, 长度, 下一字面量）三个数代替整段拷贝；解码端按令牌「向回复制」即可还原。solution.py 用朴素双指针找最长匹配，最坏 O(nW)，工程实现靠索引加速。",
   "bruteCode": "def brute(text):\n    return [[0, 0, ch] for ch in text]",
   "walkthrough": {
    "input": "text = \"ABCABCABC\"，window = 6，lookahead = 4",
    "steps": [
     "pos=0..2 时窗口内没有任何历史，逐个输出字面量 [0,0,A]、[0,0,B]、[0,0,C]。",
     "pos=3：在窗口里找到最长匹配——偏移 3 处的 ABCA 与接下来 4 个字符逐位相同（受 lookahead=4 限制），输出 [3,4,B]，pos 直接跳过 4+1 个字符到 8。",
     "pos=8 只剩最后的 C：向前偏移 3 处的 text[5]=C 匹配长度 1，输出 [3,1,\"\"]（已到末尾，无后续字面量）。",
     "解码验证：ABC ＋ 从 3 步前复制 4 个得到 ABCA ＋ B ＋ 从 3 步前复制 1 个 C ＝ ABCABCABC，与原文一致——5 个令牌代替 9 个字符。",
     "代价：朴素匹配每个位置最多试 window 个偏移，最坏 O(nW)；工程实现用哈希表索引片段，把「找最长匹配」加速到近线性。"
    ]
   }
  },
  "lzw": {
   "brute": "先想暴力解：只预置单字符词典，把每个字符单独映射成编号输出，n 个字符就输出 n 个码——重复短语完全没被利用；若想传输自定义词典，码流反而膨胀。关键观察是：词典可以边编码边生长——current 不断吞入下一个字符，直到 current+新字符 不在词典中，此时输出 current 的编号，并把这个新短语登记进词典；解码端按同样规则同步重建词典，根本不用传输。solution.py 的 candidate 查询正是这个贪心延长。",
   "bruteCode": "def brute(text):\n    dictionary = {chr(i): i for i in range(256)}\n    return [dictionary[ch] for ch in text]",
   "walkthrough": {
    "input": "text = \"ABABABAB\"",
    "steps": [
     "词典预置 256 个单字符：A=65、B=66；current 从空串开始逐字符吞入。",
     "读到第 2 个字符 B：候选 AB 不在词典，输出 current「A」的码 65，把 AB 登记为 256，current 重置为 B。",
     "第 3 个字符 A 同理：输出 66、登记 BA=257；第 4 个字符 B 时候选 AB 已在词典，current 延长为 AB。",
     "第 5 个字符 A：候选 ABA 不在词典，输出 current「AB」的码 256，登记 ABA=258；之后 current 再次吞到 ABA 时直接命中词典。",
     "末尾剩 B 输出 66，码流 [65,66,256,258,66] 共 5 个码，比逐字符的 8 个码更省；解码端按同规则重建词典，无需传输。"
    ]
   }
  },
  "wave-function-collapse": {
   "brute": "先想暴力解：对每个格子从全部瓦片里随机选一个，全部选完后再检查邻接约束是否满足，不满足就整盘重掷——成功概率随格子数指数衰减，几乎不可能撞对。关键观察是：约束可以即时传播——每确定一格，右侧格子的左边缘、下方格子的上边缘就被限定，未坍缩格子的候选集随之收缩；每格只在当前可行候选里随机坍缩，冲突被提前排除。solution.py 每步先按已坍缩邻居过滤候选，再从剩余候选中抽取。",
   "bruteCode": "def brute(tiles, rows, cols, randint):\n    while True:\n        grid = [[tiles[randint(len(tiles))] for _ in range(cols)] for _ in range(rows)]\n        ok = True\n        for r in range(rows):\n            for c in range(cols):\n                if r + 1 < rows and (grid[r][c] >> 2 & 1) != (grid[r + 1][c] & 1):\n                    ok = False\n                if c + 1 < cols and (grid[r][c] >> 1 & 1) != (grid[r][c + 1] >> 3 & 1):\n                    ok = False\n        if ok:\n            return grid",
   "walkthrough": {
    "input": "rows = 2，cols = 2，seed = 1（瓦片 0–3，4 个二进制位表示上/右/下/左边缘连接口）",
    "steps": [
     "瓦片含义：0=无口、1=上口、2=右口、3=上+右口。(0,0) 无任何约束，4 个候选随机坍缩为 0。",
     "(0,1) 只受左邻约束：左块 0 的右口=0，要求本块左口=0，四个瓦片都满足，随机坍缩为 3（上+右口）。",
     "(1,0) 受上邻约束：上块 0 的下口=0，要求本块上口=0，候选从 {0,1,2,3} 收缩为 {0,2}，坍缩为 0。",
     "(1,1) 同时吃两条约束：上邻 3 的下口=0、左邻 0 的右口=0，候选仍为 {0,2}，坍缩为 2；终盘 [[0,3],[0,2]]，所有相邻边缘吻合。",
     "若某格候选被清空（如左邻右口=1 时没有带左口的瓦片），整盘返回 −1 宣告失败；完整 WFC 会优先坍缩候选最少（熵最低）的格子并支持回溯重掷。"
    ]
   }
  },
  "reaction-diffusion": {
   "brute": "先想暴力解：对每个格点把整张网格都扫一遍去找它的邻居、计算拉普拉斯，一代的成本从 O(格数) 抬到 O(格数²)；或者把时间步取得极小、步数翻倍再翻倍去「试凑」精度——前者重复计算成灾，后者交互延迟爆炸。关键观察是：反应扩散方程的扩散项只需十字 4 邻居的五点拉普拉斯（上+下+左+右−4×自身），反应项逐点相乘即可；用双缓冲每步线性扫一遍。solution.py 的 lap_u/lap_v 与 new_u/new_v 正是这一结构。",
   "bruteCode": "def brute(U, V, F, k, Du, Dv, dt):\n    rows, cols = len(U), len(U[0])\n    new_u = [row[:] for row in U]\n    new_v = [row[:] for row in V]\n    for r in range(1, rows - 1):\n        for c in range(1, cols - 1):\n            lap_u = 0.0\n            lap_v = 0.0\n            for rr in range(rows):\n                for cc in range(cols):\n                    if abs(rr - r) + abs(cc - c) == 1:\n                        lap_u += U[rr][cc]\n                        lap_v += V[rr][cc]\n            lap_u -= 4.0 * U[r][c]\n            lap_v -= 4.0 * V[r][c]\n            uvv = U[r][c] * V[r][c] * V[r][c]\n            new_u[r][c] = U[r][c] + dt * (Du * lap_u - uvv + F * (1.0 - U[r][c]))\n            new_v[r][c] = V[r][c] + dt * (Dv * lap_v + uvv - (F + k) * V[r][c])\n    return new_u, new_v",
   "walkthrough": {
    "input": "rows = 6，cols = 6，steps = 1（F=0.055，k=0.062，Du=0.16，Dv=0.08）",
    "steps": [
     "初始化：U 全 0、V 全 0.25，只在中心 2×2（第 2–3 行、第 2–3 列）注入 U=0.5 作扰动。",
     "每个时间步先复制双缓冲，再对内部格点算五点拉普拉斯：lap = 上+下+左+右 − 4×自身。",
     "注入块角点 (2,2)：U=0.5、V=0.25，右邻与下邻同在块内（U 各 0.5），另两邻 U=0，故 lap_u=0+0.5+0+0.5−4×0.5=−1，lap_v=0。",
     "反应项 uvv=0.5×0.25²=0.03125；代入得 new_u=0.5+(0.16×(−1)−0.03125+0.055×0.5)=0.336，new_v=0.25+(0.08×0+0.03125−0.117×0.25)=0.252——U 被反应消耗、V 微增。",
     "块上方格 (1,2) 原本 U=0：从下方 0.5 的格点获得扩散流，new_u=0.16×0.5+0.055=0.135，扰动开始向外生长。",
     "边界格（如第 0 行）永不更新、保持初值；多步迭代后 U 的消耗与 V 的扩散把初始方块拉成斑点或条纹——Gray-Scott 模型的经典纹理。"
    ]
   }
  },
  "game-of-life": {
   "brute": "先想暴力解：对每个格子把整张棋盘重扫一遍去数它的 8 个邻居（或更糟，枚举全部 2^(R×C) 个后继盘面逐一验规则）——前者把一代成本抬到 O((R×C)²)，后者直接不可行。关键观察是：规则是局部的，每个细胞的下一状态只由周围 8 格的活细胞数决定，逐格统计 8 邻居、用双缓冲保存下一代即可，一代 O(R×C)。solution.py 的 count 循环与 nxt 数组正是这一实现，任何时刻读的都是同一份旧盘面。",
   "bruteCode": "def brute(grid):\n    rows, cols = len(grid), len(grid[0])\n    nxt = [[0] * cols for _ in range(rows)]\n    for r in range(rows):\n        for c in range(cols):\n            count = 0\n            for rr in range(rows):\n                for cc in range(cols):\n                    if (rr, cc) != (r, c) and abs(rr - r) <= 1 and abs(cc - c) <= 1:\n                        count += grid[rr][cc]\n            nxt[r][c] = count == 3 or (grid[r][c] == 1 and count == 2)\n    return nxt",
   "walkthrough": {
    "input": "5×5 网格 grid = [[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]]（竖直闪烁器），generations = 1",
    "steps": [
     "初始盘面：竖直三连活细胞 (2,2)、(3,2)、(4,2)，其余全空。逐格统计 8 邻居中的活细胞数。",
     "端点 (2,2) 与 (4,2) 各只有 1 个活邻居，少于 2 判死亡；中心 (3,2) 有 2 个，存活。",
     "出生规则：空格 (3,1) 的邻居恰是 (2,2)、(3,2)、(4,2) 三个活细胞——等于 3，复活；(3,3) 同理复活。",
     "其余空格邻居数都不是 3（如 (2,1) 只有 2 个），保持死亡。新一代活细胞为 (3,1)、(3,2)、(3,3)——竖排变横排。",
     "再迭代一代又变回竖排，周期为 2（闪烁器振荡子）；双缓冲 nxt 保证所有格子基于同一份旧状态同步更新，不会出现串代污染。"
    ]
   }
  },
  "particle-swarm": {
   "brute": "先想暴力解：在 [−10,10] 上撒均匀网格逐点计算 (x−3)²，网格越密越准但成本线性膨胀，维度一高更是指数爆炸。关键观察是：让一群粒子各自记住走过的最优点（个体记忆 pbest），并共享群体发现的最优点（社会信息 gbest），每轮按「惯性 + 记忆项 + 社会项」更新速度，群体就会整体朝最优区域汇聚。solution.py 的速度公式 0.7v+1.5r₁(pbest−x)+1.5r₂(gbest−x) 正是这三项的加权和。",
   "bruteCode": "def brute(lo, hi, steps, f):\n    best_x = None\n    best_v = None\n    for i in range(steps + 1):\n        x = lo + (hi - lo) * i / steps\n        v = f(x)\n        if best_v is None or v < best_v:\n            best_v = v\n            best_x = x\n    return best_x, best_v",
   "walkthrough": {
    "input": "particles = 3，iterations = 2，seed = 1（目标 x=3，目标函数 (x−3)²）",
    "steps": [
     "3 个粒子初始化在 x=−5.27、−2.61、0.08，初速全 0；个体最优等于各自起点，全局最优 gbest=0.08（离 3 最近）。",
     "第 1 轮粒子 1：速度 v=0.7×0+1.5r₁(pbest−x)+1.5r₂(gbest−x)=3.14——pbest 等于当前位置、记忆项为 0，全靠社会项拉动，位置从 −2.61 跳到 0.52。",
     "0.52 比 pbest=−2.61 和 gbest=0.08 都更接近 3，粒子 1 的 pbest 与全局 gbest 同时更新为 0.52。",
     "第 2 轮三个粒子都被 gbest 与各自 pbest 拉向 3，gbest 推进到 2.719；终值 best_x=2.7185、best_value=0.0792。",
     "暴力撒网格要把 [−10,10] 切成极细格点逐个评估；PSO 用 3 粒子×2 轮共 6 次评估就逼近到 0.0792——记忆项保持续航，社会项共享发现。"
    ]
   }
  },
  "maze-generation": {
   "brute": "先想暴力解：对每个格间单元的四面墙独立随机决定去留，然后检查整个迷宫是否连通、是否无环——绝大多数随机方案既不连通又带环，只能整盘重掷，成功率随规模趋于零。关键观察是：完美迷宫恰是一棵生成树，用深度优先回溯逐格雕刻——每次从未访问邻居中随机选一格、打通中间墙并入栈，死路就回退——天然保证连通且无环。solution.py 的 stack 与 visited 维护的正是这棵正在生长的树。",
   "bruteCode": "def brute(rows, cols, randint):\n    while True:\n        grid = [[1] * (2 * cols + 1) for _ in range(2 * rows + 1)]\n        for r in range(rows):\n            for c in range(cols):\n                grid[2 * r + 1][2 * c + 1] = 0\n                if c + 1 < cols and randint(2):\n                    grid[2 * r + 1][2 * c + 2] = 0\n                if r + 1 < rows and randint(2):\n                    grid[2 * r + 2][2 * c + 1] = 0\n        seen = {(1, 1)}\n        stack = [(1, 1)]\n        while stack:\n            r, c = stack.pop()\n            for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < 2 * rows + 1 and 0 <= nc < 2 * cols + 1 and grid[nr][nc] == 0 and (nr, nc) not in seen:\n                    seen.add((nr, nc))\n                    stack.append((nr, nc))\n        if len(seen) == 2 * rows * cols - 1:\n            return grid",
   "walkthrough": {
    "input": "rows = 3，cols = 3，seed = 1（逻辑网格 3×3，显示网格 7×7）",
    "steps": [
     "显示网格 7×7 全部初始化为墙 1：奇数行列是房间、偶数行列是墙；起点房间 (0,0) 打开并压栈。",
     "栈顶 (0,0) 的未访问邻居是 (1,0) 和 (0,1)：随机选中下方 (1,0)，把两房间的墙 grid[2][1] 与新房间 grid[3][1] 都刻成 0，栈变为 2 层。",
     "(1,0) 的候选是 (2,0)、(1,1)，选中 (1,1)；(1,1) 有 3 个候选，选中 (1,2)；(1,2) 选中 (2,2)——栈一路加深，雕刻出一条走廊。",
     "走到死路（栈顶没有任何未访问邻居）就 pop 回退，回到还有候选的格子继续随机开凿；深度优先保证每个房间不重不漏。",
     "结束时 9 个房间与 8 面隔墙共 17 格被打通，恰好构成一棵生成树——连通且无环，这就是「完美迷宫」。"
    ]
   }
  },
  "genetic-rockets": {
   "brute": "先想暴力解：在 [−10,10] 的连续区间里均匀撒点逐个评估 |x−target|，点距决定精度，要覆盖整个区间成本无限增长，高维问题更是彻底不可行。关键观察是：把候选解当作「个体」，每代按适应度排序留下前一半，两两交叉取均值生成子代，再以小概率加随机扰动（变异），进化几代后种群就会聚集到目标附近。solution.py 的排序截半、均值交叉与 0.3 概率变异正是这一循环。",
   "bruteCode": "def brute(lo, hi, step, target):\n    best = None\n    n = int((hi - lo) / step)\n    for i in range(n + 1):\n        x = lo + i * step\n        d = abs(x - target)\n        if best is None or d < best:\n            best = d\n    return best",
   "walkthrough": {
    "input": "population = 6，generations = 2，seed = 1，target = 5",
    "steps": [
     "6 个个体初始化在 x=−5.27、−2.61、0.08、4.10、−8.99、−2.61（目标 x=5），适应度取 |x−5|。",
     "第 1 代按距离排序，留下前一半精英 [4.10, 0.08, −2.61]；配对 (4.10, 0.08) 交叉出均值 2.09，本次变异判定未命中 0.3 的概率。",
     "子代数量不足时复制最优个体补齐，新种群为 [4.10, 0.08, −2.61, 2.09, 4.10, 4.10]。",
     "第 2 代排序后前三名全是 4.10，交叉均值仍是 4.10，种群迅速收敛；最终 best=4.0977，距目标还差 0.90。",
     "收敛快但基因池单一——变异未触发时全体克隆最优者，容易停在局部位置；0.3 的变异率在更长进化中负责注入新基因、逃离局部最优。"
    ]
   }
  },
  "ant-colony": {
   "brute": "先想暴力解：枚举全部 (n−1)! 条回路取最短——5 城要 24 条、10 城要 36 万条，n 稍大就爆炸；最近邻贪心又容易锁死在局部最优。关键观察是：让多只蚂蚁按「信息素浓度×距离启发」的概率轮盘独立构造回路，走完后全体路径信息素挥发、每只蚂蚁按 1/长度在走过的边上沉积——短路径被反复强化、长路径逐渐荒废，最短回路从群体统计中涌现。solution.py 的权重 pheromone×(1/d)³ 与 ×0.5 挥发正是这两步。",
   "bruteCode": "def brute(dist):\n    from itertools import permutations\n    n = len(dist)\n    best = None\n    for perm in permutations(range(1, n)):\n        tour = (0,) + perm + (0,)\n        length = sum(dist[tour[i]][tour[i + 1]] for i in range(n))\n        if best is None or length < best[0]:\n            best = (length, tour)\n    return best",
   "walkthrough": {
    "input": "dist = [[0,1,2,1],[1,0,1,2],[2,1,0,1],[1,2,1,0]]（对称），ants = 2，iterations = 1，seed = 1",
    "steps": [
     "信息素矩阵初始化全 1；蚂蚁从城 0 出发，转移到候选 j 的权重 = 信息素×(1/距离)³，距离越近权重越大。",
     "蚂蚁 0 在城 0 的三候选权重为 [1, 0.125, 1]（到城 2 距离 2，权重 (1/2)³=0.125），轮盘赌选中城 1；随后 1→2→3，回路 [0,1,2,3,0] 总长 1+1+1+1=4。",
     "蚂蚁 1 轮盘抽中另一头：先去城 3，再 3→1→2，回路 [0,3,1,2,0] 总长 1+2+1+2=6。",
     "一轮结束先全面挥发：每条边信息素 ×0.5；再按 1/长度沉积——蚂蚁 0 在走过的 4 条边各 +0.25，蚂蚁 1 各 +1/6≈0.167，短路径边净增更多。",
     "本轮最优即 [0,1,2,3,0]、长度 4（恰为全局最优）；多轮迭代后短边信息素雪球式累积，蚁群逐渐收敛到同一条最短回路。"
    ]
   }
  },
  "boids": {
   "brute": "先想暴力解：为整群鸟手工设计编队模板或预设轨迹，再逐帧播放——鸟一多、障碍一变就得全部重写，而且完全不像真实的群体行为。关键观察是：复杂的群集只需每只鸟遵守三条局部规则——对齐（朝邻居平均速度靠拢）、内聚（朝邻居质心靠近）、分离（离太近的被推开），再加最大速度限制；每帧每鸟只需检查半径内的邻居。solution.py 的三段加权和与 max_speed 截断正是这三条规则的直接实现。",
   "bruteCode": "import math\n\ndef brute(positions, velocities, radius):\n    n = len(positions)\n    neighbors = []\n    for i in range(n):\n        ranked = sorted(\n            (j for j in range(n) if j != i),\n            key=lambda j: math.dist(positions[i], positions[j]),\n        )\n        neighbors.append([j for j in ranked if math.dist(positions[i], positions[j]) <= radius])\n    return neighbors",
   "walkthrough": {
    "input": "positions = [[0,0],[1,0]]，velocities = [[1,0],[0,1]]，radius = 2，max_speed = 2",
    "steps": [
     "两鸟距离 1 ≤ radius=2，互为邻居。对齐项：鸟 0 朝邻居平均速度 (0,1) 靠拢，v=(1,0)+0.05×((0,1)−(1,0))=(0.95,0.05)。",
     "内聚项：朝邻居质心 (1,0) 微调，v += 0.005×((1,0)−(0,0))，鸟 0 速度变为 (0.955,0.05)。",
     "分离项：距离 1 在 (0,2) 内，推开量 push=(2−1)/2=0.5，乘系数 1.5 得 0.75，鸟 0 被沿 −x 方向推，速度变为 (0.205,0.05)。",
     "鸟 1 对称地得 (0.795,0.95)。两者速度模长约 0.21 与 1.24，都低于 max_speed=2，无需截断。",
     "位置更新：鸟 0 到 (0.205,0.05)，鸟 1 到 (1.795,0.95)——对齐与内聚拉近方向，分离拉开距离，群体在三股力的平衡中保持队形。"
    ]
   }
  },
  "n-body": {
   "brute": "先想暴力解：对每颗星体把 n×n 个有序对的引力都算一遍，i→j 与 j→i 重复计算两次，一代 O(n²)；星数上千时每帧百万次开方，实时模拟卡死。关键观察是：引力互为反作用力，按无序对 (i<j) 成对计算可立即减半；算完加速度后用半隐式欧拉（先更新速度、再用新速度更新位置）积分，比显式欧拉稳定。solution.py 的 i<j 双循环与先 v 后 p 的更新正是如此，Barnes-Hut 四叉树还能降到 O(n log n)。",
   "bruteCode": "import math\n\ndef brute(positions, velocities, masses, dt, G):\n    n = len(positions)\n    for i in range(n):\n        for j in range(n):\n            if i == j:\n                continue\n            dx = positions[j][0] - positions[i][0]\n            dy = positions[j][1] - positions[i][1]\n            r = math.sqrt(dx * dx + dy * dy)\n            if r == 0:\n                continue\n            f = G * masses[i] * masses[j] / (r * r * r)\n            velocities[i][0] += f * dx / masses[i] * dt\n            velocities[i][1] += f * dy / masses[i] * dt\n    for i in range(n):\n        positions[i][0] += velocities[i][0] * dt\n        positions[i][1] += velocities[i][1] * dt\n    return positions",
   "walkthrough": {
    "input": "positions = [[0,0],[2,0]]，velocities = [[0,0.5],[0,-0.5]]，masses = [1,1]，dt = 0.5，G = 1",
    "steps": [
     "两星等质量 1、相距 r=2：万有引力 F=G·m₁m₂/r²=1/4；代码先算 f=G·m₁m₂/(r²·r)=0.125，再乘方向向量 (2,0) 得加速度 ±0.25。",
     "牛顿第三定律：星 1 被拉向星 2（a=+0.25），星 2 反向（a=−0.25）；按 i<j 成对计算，一次配对同时更新两星，n 颗星只需 n(n−1)/2 次配对。",
     "半隐式欧拉（dt=0.5）先更新速度：v₀=(0+0.25×0.5, 0.5)=(0.125,0.5)，v₁=(−0.125,−0.5)。",
     "再用新速度更新位置：p₀=(0.0625,0.25)，p₁=(1.9375,−0.25)——两星被拉近的同时因横向初速错开，持续推演会形成绕转轨道。",
     "两两直接求和是一代 O(n²)；Barnes-Hut 用四叉树把远处星团聚合成质心近似，可降到 O(n log n)。"
    ]
   }
  },
  "flow-field": {
   "brute": "先想暴力解：让每个格子各自找方向——对每个空格单独做一次 BFS 求它到目标的最短路，再沿最短路径看第一步指向哪个邻居。单格 BFS 要扫过 O(RC) 个格子，R×C 个格子各来一遍就是 O((RC)²)，大量探索彼此重复。关键观察是：所有格子求的都是「到同一个目标」的距离，反过来从目标出发做一次 BFS，波纹扫到某格时的层数就是它的距离，整张距离场一次即可建成，之后每格只需挑一个距离更小的邻居作为场向量。",
   "bruteCode": "from collections import deque\n\n\ndef brute(grid, tr, tc):\n    rows, cols = len(grid), len(grid[0])\n    field = [[None] * cols for _ in range(rows)]\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 1:\n                continue\n            prev = {(r, c): None}\n            q = deque([(r, c)])\n            while q and (tr, tc) not in prev:\n                cr, cc = q.popleft()\n                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                    nr, nc = cr + dr, cc + dc\n                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and (nr, nc) not in prev:\n                        prev[(nr, nc)] = (cr, cc)\n                        q.append((nr, nc))\n            if (tr, tc) not in prev:\n                continue\n            if (r, c) == (tr, tc):\n                field[r][c] = [0, 0]\n                continue\n            step = (tr, tc)\n            while prev[step] != (r, c):\n                step = prev[step]\n            field[r][c] = [step[0] - r, step[1] - c]\n    return field",
   "walkthrough": {
    "input": "grid = [[0,0,0],[0,1,0],[0,0,0]]（中心 (1,1) 为障碍），target = [2,2]",
    "steps": [
     "solution.py 从目标出发反向一次 BFS：dist[2][2]=0，先扩展出 (1,2) 和 (2,1) 距离 1，再扩散出 (0,2)、(2,0) 距离 2，(0,1)、(1,0) 距离 3，最后 (0,0) 距离 4；障碍格 (1,1) 不入队。",
     "逐格定方向，按「下、上、右、左」取第一个距离更小的邻居：(0,2) 距离 2，下方 (1,2) 距离 1 更小，场向量记 [1,0]；(2,0) 距离 2，下方出界、上方 (1,0) 距离 3 不更小，右侧 (2,1) 距离 1，记 [0,1]。",
     "(0,1) 距离 3：下方是障碍、上方出界，右侧 (0,2) 距离 2 更小，记 [0,1]；(2,1) 距离 1，右侧目标 (2,2) 距离 0，记 [0,1]。",
     "目标格 (2,2) 记 [0,0] 表示已到达；障碍 (1,1) 保持 None。所有箭头都指向距离减 1 的邻居，沿场走每步都严格接近目标。",
     "场构建 O(RC) 一次完成，之后每个粒子 O(1) 查表流动；暴力为每格重复 BFS 是 O((RC)²)，网格越大差距越明显。"
    ]
   }
  },
  "dynamic-array": {
   "brute": "先想暴力解：底层用固定长度的数组，空间不够就新建一个「容量加一」的数组，把旧元素全部复制过去再追加。每次扩容复制 O(n)，n 次追加最坏 O(n²)，大部分时间花在一遍遍搬移老元素上。关键观察是：增长趋势可以预判，扩容时不加一而是翻倍——复制总代价 1+2+4+… 不超过 2n，把偶发的大代价摊到每次追加上，摊还 O(1)，同时保留 O(1) 随机访问。",
   "bruteCode": "def brute(values_in):\n    values = []\n    for value in values_in:\n        new_values = [0] * (len(values) + 1)\n        for i, v in enumerate(values):\n            new_values[i] = v\n        new_values[len(values)] = value\n        values = new_values\n    return values",
   "walkthrough": {
    "input": "initial_capacity = 2，依次追加 values = [1, 2, 3, 4, 5]",
    "steps": [
     "前两个元素 1、2 直接写入槽位 0、1，此时长度 2 == 容量 2，还没有触发扩容，搬移计数 moves=0。",
     "追加 3 时长度 2 == 容量 2，扩容：把已有 2 个元素搬到新数组（moves=2），容量翻倍到 4，再写入 3。",
     "追加 4 时空位充足（长度 3 < 4）直接写。追加 5 时长度 4 == 容量 4 再次扩容：搬 4 个元素（moves=2+4=6），容量翻倍到 8。",
     "结束：values=[1,2,3,4,5]，capacity=8，总搬移 moves=6。",
     "若每次只扩 1 个槽，5 次追加要搬 0+1+2+3+4=10 次；翻倍策略总搬移不超过 2n，摊还到每次追加是 O(1)，而随机访问仍是 O(1)。"
    ]
   }
  },
  "circular-buffer": {
   "brute": "先想暴力解：用普通数组存队列，入队直接 append；出队删掉第一个元素后，把后面所有元素整体前移一格，单次出队 O(n)，频繁出入队时反复搬移。另一个极端是从不删除，让已出队元素占着空间、数组无限变长。关键观察是：容量固定时，队头队尾只是两个在数组里「循环前进」的下标——写入位置 (head+size) mod capacity，出队后 head 加一取模，读写都不搬移元素，O(1) 完成，空间始终 O(capacity)。",
   "bruteCode": "def brute(operations, capacity):\n    values = []\n    popped = []\n    for op in operations:\n        if op[0] == \"push\":\n            values.append(op[1])\n            if len(values) > capacity:\n                values.pop(0)\n        else:\n            if values:\n                popped.append(values.pop(0))\n    return popped, values",
   "walkthrough": {
    "input": "capacity = 3，操作：push 1、push 2、push 3、push 4、pop、push 5",
    "steps": [
     "head=0、size=0。push 1 写入下标 (0+0)%3=0；push 2 写下标 1；push 3 写下标 2，size=3 满。",
     "push 4：目标下标 (0+3)%3=0，正好绕回队头覆盖最老的 1；因已满，head 前移到 1、size 保持 3。逻辑内容从 [1,2,3] 变为 [2,3,4]，没有任何搬移。",
     "pop：读 buffer[head]=buffer[1]=2，head 前移到 2，size=2，popped=[2]。内容剩 [3,4]。",
     "push 5：写入 (2+2)%3=1，复用刚出队的槽位，size 回到 3。底层数组是 [4,5,3]，head=2。",
     "从 head 起绕圈读出 values=[3,4,5]。入队/出队都只动一个下标 O(1)；普通数组出队要把后面元素整体前移 O(n)。"
    ]
   }
  },
  "bitset-bitmap": {
   "brute": "先想暴力解：把收集到的数放进列表，每来一个元素先线性查重、再插入到有序位置，单元素 O(n)，整体 O(n²)；即便换成排序也要 O(n log n)，且成员测试仍要二分。关键观察是：值域是有界的非负整数，可以让每个可能取值对应一个二进制位——第 x 位为 1 当且仅当 x 出现过。置位、查位都是 O(1) 的位运算，重复值天然被去重，顺序扫一遍位图就得到升序结果，批量交并差还能按机器字并行。",
   "bruteCode": "def brute(nums):\n    result = []\n    for value in nums:\n        if value not in result:\n            inserted = False\n            for i in range(len(result)):\n                if result[i] > value:\n                    result.insert(i, value)\n                    inserted = True\n                    break\n            if not inserted:\n                result.append(value)\n    return result",
   "walkthrough": {
    "input": "bits = 16，nums = [13, 2, 7, 2, 13]",
    "steps": [
     "建 16 个标志位（下标 0..15）的位图，全部为 0。",
     "依次置位：13→位 13 置 1，2→位 2 置 1，7→位 7 置 1；再遇到重复的 2 和 13，对应位已是 1，置位幂等，重复元素自动去重。",
     "位图状态：只有第 2、7、13 位为 1，其余 13 位为 0。",
     "从 0 到 15 顺序扫描，遇到 1 输出下标，得 sorted_unique=[2,7,13]，bits_used=3。",
     "排序与去重没做任何比较，全靠位图按下标天然有序、置位幂等；机器字实现中值 130 落在第 130/64=2 个字、字内偏移 130 mod 64=2 位。"
    ]
   }
  },
  "order-statistic-tree": {
   "brute": "先想暴力解：把集合放进数组，每次查「第 k 小」就重新排序取第 k−1 位，查「键 x 的排名」就排序后线性定位，单次 O(n log n)，插入还要搬移数组。关键观察是：二叉搜索树本身按序组织键，只需给每个节点多存一个「子树规模 size」：查第 k 小时比较 k 与左子树大小，决定往左走、停在当前节点还是往右走；查排名时沿下降路径把跨过的左子树与节点累加。一条根到叶路径 O(log n) 即可解决。",
   "bruteCode": "def brute(keys, queries):\n    out = []\n    for q in queries:\n        s = sorted(keys)\n        if q[0] == \"kth\":\n            out.append(s[q[1] - 1])\n        else:\n            out.append(s.index(q[1]) + 1 if q[1] in keys else -1)\n    return out",
   "walkthrough": {
    "input": "keys = [5, 2, 8, 1, 7]，queries：kth(3)、kth(1)、rank(7)",
    "steps": [
     "依次插入 5、2、8、1、7 得搜索树：根 5，左子 2（其左子 1），右子 8（其左子 7）。回溯时重算子树规模：叶子 1 和 7 size=1，节点 2 和 8 size=2，根 5 size=1+2+2=5。",
     "kth(3)：在根看左子树 size=2，说明左边只有 2 个更小的元素，k=3 恰好等于 left_size+1=3，当前节点 5 就是第 3 小，直接返回。",
     "kth(1)：k=1 ≤ 左 size=2 进入节点 2；节点 2 左 size=1，k=1 ≤ 1 再进节点 1；节点 1 无左孩子，k==left_size+1=1，返回 1。",
     "rank(7)：累计 total=1；在 5 处 7>5，整棵左子树被跨过，total=1+2+1=4，向右到 8；在 8 处 7<8 向左；在 7 处键相等，返回 total+左 size=4+0=4，即 7 是第 4 小。",
     "输出 [5, 1, 4]。每步只沿一条根到叶路径走、路径长即树高；size 把「数出前面有多少个」从 O(n) 降到 O(log n)。"
    ]
   }
  },
  "pairing-heap": {
   "brute": "先想暴力解：用有序数组当优先队列，每次 push 后整体排序保证最小值在头部，插入 O(n log n)；或用二叉堆，可合并两个堆时要把一方元素逐个取出再插入，代价 O(n)。关键观察是：堆只需保证父键不大于孩子键，合并两堆时比较两个根、把较大根挂到较小根的孩子链上即可，一次指针操作 O(1)；代价被推迟到删除最小值——摘下根后对孩子链先两两配对、再从右向左合并，把变长的链重新压扁，摊还 O(log n)。",
   "bruteCode": "def brute(ops):\n    values = []\n    out = []\n    for op in ops:\n        if op[0] == \"push\":\n            values.append(op[1])\n            values.sort()\n        elif op[0] == \"top\":\n            out.append(values[0] if values else None)\n        else:\n            out.append(values.pop(0) if values else None)\n    return out",
   "walkthrough": {
    "input": "ops：push 3、push 1、push 4、push 2、pop、pop、top",
    "steps": [
     "依次 push 3、1、4、2：每次 meld 只比一次根，3 挂到 1 下，4、2 先后接到 1 的孩子链最前面，根始终是 1，孩子链从左到右为 2、4、3。",
     "第一次 pop：返回根 1；摘下孩子链 2→4→3 成为三个独立子树，从左到右两两配对：meld(2,4) 得「2 带孩子 4」；剩奇数个，3 自成一组。",
     "从右向左汇总：先并入单独的 3，再 meld(2 的子堆, 3)：2<3，3 挂到 2 下、4 成为 3 的兄弟，新根 2，孩子链 3、4。",
     "第二次 pop：返回根 2；孩子 3、4 配对 meld(3,4)：3<4，4 挂到 3 下；从右向左只剩这一对，新根 3。",
     "top 读根得 3，全程输出 [1, 2, 3]。meld 恒为 O(1)；delete-min 的两遍配对避免孩子链越积越偏斜，摊还 O(log n)。"
    ]
   }
  },
  "radix-tree": {
   "brute": "先想暴力解：用普通 Trie 存键，每个字符分配一个节点。像 rom、roman、romeo 这种共享长前缀的键，r-o-m 一路都是单孩子链，节点数和指针数随总字符数线性膨胀，内存与缓存都不友好。关键观察是：不发生分叉的连续路径可以压缩成一条带字符串标签的边——整段标签一次比较即可匹配，节点数降到与键数同阶；插入时用最长公共前缀定位，必要时在分叉点把旧边拆成两段，操作仍是 O(键长)。",
   "bruteCode": "def brute(words):\n    root = {\"children\": {}}\n    for word in words:\n        cur = root\n        for ch in word:\n            cur = cur[\"children\"].setdefault(ch, {\"children\": {}})\n    count = 0\n    stack = [root]\n    while stack:\n        node = stack.pop()\n        count += 1\n        stack.extend(node[\"children\"].values())\n    return count",
   "walkthrough": {
    "input": "words = [\"rom\", \"roman\", \"romeo\"]",
    "steps": [
     "插入 rom：根没有首字符 r 的边，直接建一条标签为 rom 的终点边——普通 Trie 这里要新建 r、o、m 三个节点，压缩后只用 1 个。",
     "插入 roman：剩余键 roman 与边标签 rom 的最长公共前缀 k=3 恰好是整条标签，沿边下降，剩余后缀 an 在下层没有首字符 a 的边，新建终点边 an；rom 节点保留 end 标记，因为 rom 本身也是完整词。",
     "插入 romeo：同样走完 rom，剩余 eo 与兄弟边 an 首字符不同、无需拆边，直接新建终点边 eo。",
     "最终树共 4 个节点（含根）：根 →rom→ 分叉节点 →an、→eo；对应的普通 Trie 需要 8 个节点（根加 r、o、m、a、n、e、o），压缩省掉一半。",
     "遍历输出 [[\"\",False],[\"rom\",True],[\"an\",True],[\"eo\",True]]：根到节点的边标签拼接即完整键，end 标记区分 rom 这样的完整词与纯分叉点。"
    ]
   }
  },
  "rope": {
   "brute": "先想暴力解：直接用一个字符串变量存全文，中间插入写成 s[:pos] + new + s[pos:]，删除写成 s[:l] + s[r:]——每次操作都复制整个字符串 O(n)，对长文本反复编辑代价不可接受。关键观察是：把文本切成小块挂到一棵按「子树字符数」导航的平衡树上，插入、删除、取区间都只需按位置 split 出两三段再 merge 回去，只重连 O(log n) 个节点并重算路径上的 size，任何一步都不复制全文。",
   "bruteCode": "def brute(ops):\n    s = \"\"\n    out = []\n    for op in ops:\n        if op[0] == \"insert\":\n            pos, text = op[1], op[2]\n            s = s[:pos] + text + s[pos:]\n        elif op[0] == \"delete\":\n            s = s[:op[1]] + s[op[2]:]\n        else:\n            out.append(s[op[1]:op[2]])\n    return out",
   "walkthrough": {
    "input": "ops：insert(0, \"hello\")、insert(5, \" world\")、report(0,5)、delete(5,11)",
    "steps": [
     "insert(0, \"hello\")：对空树按位置 0 split 得两个空段，新块 hello（长度 5）自成根，节点维护子树字符数 size=5。",
     "insert(5, \" world\")：按位置 5 split，把当前 5 个字符切成前段 hello 和空后段，新块 \" world\"（长度 6，含前导空格）插在中间再合并，总长 11，文本为 hello world。",
     "report(0,5)：先 split(·,0) 再 split(·,5)，中段覆盖位置 0 到 5 的块，中序拼接得 hello，随后三段原样合并还原，文本不变。",
     "delete(5,11)：两次 split 把位置 5 到 11 的 \" world\"（6 个字符）孤立为中段，直接丢弃，合并首尾得 hello，长度回到 5。",
     "split/merge 只沿一条根到叶路径重连节点并重算 size，O(log n)；朴素字符串每次操作要整体复制 O(n) 个字符，长文本反复编辑差距悬殊。"
    ]
   }
  },
  "disjoint-sparse-table": {
   "brute": "先想暴力解：每次查询把区间 [l,r] 的元素从左到右逐个做 combine，单次 O(r−l)，长区间或多次查询吃不消。普通稀疏表把区间拆成两段可重叠的预计算拼接，前提是 combine 幂等（如 min）；对矩阵乘这类不可重复的运算，重叠段被算两遍，结果出错。关键观察是：按 l⊕r 的最高有效位选层，总能找到一层其标准块中点严格分居 l 与 r 之间——左右两段预计算恰好无缝、不相交地覆盖 [l,r]，拼接即答案，查询 O(1)。",
   "bruteCode": "def brute(words, queries):\n    out = []\n    for l, r in queries:\n        acc = words[l]\n        for i in range(l + 1, r + 1):\n            acc = acc + words[i]\n        out.append(acc)\n    return out",
   "walkthrough": {
    "input": "words = [\"a\", \"b\", \"c\", \"d\"]，运算为字符串拼接，queries：[2,3]、[1,2]、[0,3]",
    "steps": [
     "第 0 层按长度 2 的块预计算：块 [a,b] 中 suf[0]=a、pre[1]=b；块 [c,d] 中 suf[2]=c、pre[3]=d。",
     "第 1 层按长度 4 的块预计算：mid=2 把数组分成左右两半，左半从 mid−1 向左累加得 suf[1]=b、suf[0]=ab，右半向右累加得 pre[2]=c、pre[3]=cd。",
     "查询 [2,3]：l⊕r=1 的最高位是第 0 位，取第 0 层——l 与 r 分属块中点两侧，直接拼 suf[2]+pre[3]=c+d=cd，纯 O(1)。",
     "查询 [1,2]：l⊕r=3 的最高位是第 1 位，取第 1 层：suf[1]=b 覆盖 [1,2)、pre[2]=c 覆盖 [2,3]，拼得 bc；查询 [0,3] 同层拼 suf[0]+pre[3]=ab+cd=abcd。",
     "输出 [cd, bc, abcd]。任意 l≠r 的区间总能找到唯一一层使中点分居两侧，两段预计算正好拼满区间且互不重叠——这就是「不相交」的含义，也是它支持不可重复结合运算的原因。"
    ]
   }
  },
  "merge-sort-tree": {
   "brute": "先想暴力解：每次查询直接扫区间 [l,r]，逐个比较数出不超过 x 的元素个数，单次 O(n)；区间一长、查询一多就吃不消。关键观察是：把线段树每个节点的「区间摘要」从和换成该区间元素的有序数组——建树时按归并排序自底向上合并，时间空间都是 O(n log n)；查询时区间被拆成 O(log n) 个完全覆盖的节点，每个节点在有序数组上二分计数，单次查询 O(log² n)。",
   "bruteCode": "def brute(nums, queries):\n    return [sum(1 for v in nums[l:r + 1] if v <= x) for l, r, x in queries]",
   "walkthrough": {
    "input": "nums = [5, 2, 7, 1]，queries：[0,3,4]、[1,2,6]",
    "steps": [
     "建树：叶子从左到右是 [5]、[2]、[7]、[1]；节点 [0,1] 归并得 [2,5]，节点 [2,3] 归并得 [1,7]，根 [0,3] 归并得 [1,2,5,7]——每个节点的有序数组正是它覆盖区间的元素升序排列。",
     "查询 [0,3,4]：区间完全覆盖根节点，直接在根的有序数组 [1,2,5,7] 里二分，bisect_right(·,4)=2，即 1 和 2 不超过 4，计数 2，一次二分完成。",
     "查询 [1,2,6]：根不被完全覆盖，向下分解。叶子 [1,1]（值 2）完全覆盖，bisect_right([2],6)=1；叶子 [2,2]（值 7）完全覆盖，bisect_right([7],6)=0。",
     "无交的子树（如叶子 [0,0]）被区间判断剪枝；合计 1+0=1，即位置 1、2 上的 2 和 7 中只有 2 ≤ 6。输出 [2, 1]。",
     "每次查询拆出 O(log n) 个完全覆盖节点、每个节点二分 O(log n)，单次 O(log² n)；暴力逐元素扫描单次 O(n)。"
    ]
   }
  },
  "li-chao-tree": {
   "brute": "先想暴力解：把已插入的直线全部存起来，每次查询 x 就把每条线的 a·x+b 都算一遍取最小，单次 O(直线数)，插入频繁时不可接受；斜率优化的凸壳技巧又要求斜率或查询顺序单调，这里都不满足。关键观察是：两条直线至多一个交点，让线段树每个节点保存「在本区间中点处最优」的那条线；中点落败的线只可能在某一侧子区间翻身，沿那一侧下放即可，插入与查询都只走 O(log 值域) 条路径。",
   "bruteCode": "def brute(lines, xs):\n    return [min(a * x + b for a, b in lines) for x in xs]",
   "walkthrough": {
    "input": "lines = [[1,0], [-1,20], [0,5]]（即 y=x、y=20−x、y=5），queries x = 0、10、5，定义域 [-100,100]",
    "steps": [
     "插入 y=x：区间 [-100,100] 的中点 0 处还没有别的线，y=x 直接占据根节点。",
     "插入 y=20−x：在根的中点 0 处值为 20，输给 y=x 的 0；但它在右端 x=100 处是 −80，优于 y=x 的 −100，于是下放到右子区间 [1,100]，在该节点的中点 50 处（−30 优于 50）占据。",
     "插入 y=5：中点 0 处 5>0 落败下放右半；在 [1,100] 的中点 50 处 5>−30 仍落败；但它比 y=20−x 在左端 x=1 处更优（5<19），下放到左子区间 [1,50]，占据其中点 25。",
     "查询 x=0：路径上只有根的 y=x，值 0——恰是三条线在 0 处的最小值 min(0,20,5)。",
     "查询 x=10：路径依次经过 y=x（10）、y=20−x（10）、y=5（5），取最小 5，与真实最小值 min(10,10,5) 一致；查询 x=5 同理得 5（min(5,15,5)）。输出 [0, 5, 5]。",
     "依据是两直线至多一个交点：中点落败的线只可能在一侧子区间翻身，所以插入和查询都只走 O(log 200) 条路径。"
    ]
   }
  },
  "segment-tree-beats": {
   "brute": "先想暴力解：区间 chmin（每个元素取 min）没有加法那样的结合结构，普通懒标记直接失效，只能逐元素下探修改，单次 O(n)，与区间最大值查询混用整体退化。关键观察是：chmin(x) 只会改写「大于 x 的值」，而区间内大于 x 的值全部等于当前最大值 mx——节点再维护严格次大值 second 和最大值个数 cnt，当 second < x < mx 时整层一次改完并打标记，否则才递归下钻，摊还 O(log² n)。",
   "bruteCode": "def brute(nums, ops):\n    nums = list(nums)\n    out = []\n    for op in ops:\n        if op[0] == \"chmin\":\n            l, r, x = op[1], op[2], op[3]\n            for i in range(l, r + 1):\n                if nums[i] > x:\n                    nums[i] = x\n        else:\n            out.append(max(nums[op[1]:op[2] + 1]))\n    return out",
   "walkthrough": {
    "input": "nums = [5, 3, 8, 8, 1]，ops：chmin(0,4,6)、query(0,4)、chmin(1,3,4)、query(1,3)、query(0,4)",
    "steps": [
     "建树后根节点聚合为（最大值 mx=8、最大值个数 cnt=2、严格次大值 second=5）。chmin(0,4,6) 完全覆盖根：6 落在 second=5 与 mx=8 之间，说明区间内大于 6 的值恰好全是 8，直接把根 mx 改成 6 并打懒标记，不深入子树。",
     "此刻数组逻辑值为 [5,3,6,6,1]。query(0,4) 完全覆盖根，直接读 mx=6。",
     "chmin(1,3,4) 只覆盖 [1,3]：先下推根上未下传的 6 标记（两个 8 正式变 6，值 5、1 不受影响），再递归——叶子 [2,2] 的 6 与 [3,3] 的 6 被 4 击穿（次大值 −∞ < 4）改成 4 并打标记；叶子 [1,1] 的 3 因 4 ≥ 3 原样保留。",
     "数组变为 [5,3,4,4,1]，回溯重算聚合，根为（mx=5, cnt=1, second=4）。query(1,3) 沿路径合并各节点读数得 4。",
     "query(0,4) 得 5，输出 [6, 4, 5]。核心是 chmin 只改写「最大值层」：x 夹在 mx 与 second 之间时 O(1) 打标记完成，否则才下钻，摊还 O(log² n)。"
    ]
   }
  },
  "persistent-trie": {
   "brute": "先想暴力解：要保留历史版本，就在每次插入后把整棵 Trie 深拷贝一份存下来——单次插入 O(全部节点)，版本一多内存爆炸；反过来原地修改又会污染旧版本，历史查询全错。关键观察是：一次插入只改动从根出发的一条键路径（O(键长) 个节点），只需复制这条路径上的节点并接上新叶子，其余子树原样共享，让新版本根指针指向新根即可，单次更新 O(键长)，查询也从指定版本的根开始下降。",
   "bruteCode": "def brute(ops):\n    def deep_copy(node):\n        return {\"children\": {c: deep_copy(ch) for c, ch in node[\"children\"].items()},\n                \"count\": node[\"count\"]}\n    versions = [{\"children\": {}, \"count\": 0}]\n    out = []\n    for op in ops:\n        if op[0] == \"insert\":\n            root = deep_copy(versions[op[1]])\n            root[\"count\"] += 1\n            cur = root\n            for ch in op[2]:\n                child = cur[\"children\"].setdefault(ch, {\"children\": {}, \"count\": 0})\n                child[\"count\"] += 1\n                cur = child\n            versions.append(root)\n        else:\n            cur = versions[op[1]]\n            for ch in op[2]:\n                cur = cur[\"children\"].get(ch)\n                if cur is None:\n                    break\n            out.append(cur[\"count\"] if cur else 0)\n    return out",
   "walkthrough": {
    "input": "ops：insert(v0, \"cat\")、insert(v1, \"car\")、query(v2, \"ca\")、query(v1, \"ca\")、query(v2, \"dog\")",
    "steps": [
     "初始只有版本 0 的空根（节点 0，计数 0）。insert(v0, cat)：复制根并沿 c→a→t 逐层新建 4 个节点（含新根），每个新节点计数 = 旧对应节点计数 + 1，路径终点计数 1，成为版本 1。",
     "insert(v1, car)：从版本 1 的根复制，走 c、a 时复制对应节点（计数从 1 涨到 2），到 r 时新建叶子；未经过的分支原样引用版本 1 的旧节点，两个版本共享子树。",
     "query(v2, ca)：从版本 2 的根沿 c→a 走到 ca 节点，读计数 2——cat 和 car 都经过该前缀。",
     "query(v1, ca)：从版本 1 的根走到旧 ca 节点，计数 1——历史版本里只有 cat；query(v2, dog) 的 d 不存在，落入空哨兵节点，计数 0。",
     "输出 [2, 1, 0]。每次插入只复制 O(键长) 个节点，其余子树与历史版本共享——这正是路径复制持久化；整树深拷贝会让每个版本付出全部节点的代价。"
    ]
   }
  },
  "coordinate-compression": {
   "brute": "先想暴力解：值域跨度大而实际用到的值很少时，直接按原始值开数组，空间浪费严重；要给每个元素定序号，就对每个元素现数一遍「比它小的不同值个数」，单元素 O(n)，整体 O(n²)。关键观察是：排序去重一次，序列里第 i 个值就该拿编号 i——编号大小与原值大小完全同序，之后每个值查一次哈希表（或二分）即可映射为 0..m−1 的紧凑下标，预处理 O(n log n)。",
   "bruteCode": "def brute(values):\n    unique = list(set(values))\n    out = []\n    for v in values:\n        rank = 0\n        for other in unique:\n            if other < v:\n                rank += 1\n        out.append(rank)\n    return out",
   "walkthrough": {
    "input": "values = [40, 10, 80, 10, 55]",
    "steps": [
     "原始值跨度 10 到 80，直接按值开数组要 81 个槽位，实际只出现 4 个不同值。",
     "排序去重得 [10, 40, 55, 80]，依次编号 0、1、2、3，编号大小与原值大小完全同序。",
     "建映射 {10:0, 40:1, 55:2, 80:3}，按原顺序查表输出 [1, 0, 3, 0, 2]。",
     "重复的 10 都映射到 0；40 的编号 1 恰好等于「比它小的不同值个数」，相对次序信息一点不丢。",
     "后续树状数组、线段树只需开 4 个位置而不是 81 个。预处理排序 O(n log n)，之后每次映射查表 O(1)；暴力对每个元素现数一遍是 O(n²)。"
    ]
   }
  },
  "inversion-count": {
   "brute": "先想暴力解：双重循环枚举所有数对 (i,j)，i<j 且 a[i]>a[j] 就计数，O(n²)；n 到十万级就跑不动。关键观察是：归并排序合并时左右两半各自有序——当右半元素被取出时，它比左半所有剩余元素都小，逆序对（左剩余每个元素, 右当前元素）可以用 middle−i 一次性计入，不必逐对比较；分治让总代价降到 O(n log n)，额外空间 O(n)。",
   "bruteCode": "def brute(nums):\n    count = 0\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] > nums[j]:\n                count += 1\n    return count",
   "walkthrough": {
    "input": "nums = [3, 1, 2]",
    "steps": [
     "递归切分：[3,1,2] 分成左 [3] 和右 [1,2]；[1,2] 再切成 [1] 和 [2]。单元素区间逆序对为 0。",
     "合并 [1] 与 [2]：1 ≤ 2 取左，无逆序对，得 [1,2]，本层计数 0。",
     "合并 [3] 与 [1,2]（middle=1）：3 > 1，取右边的 1，左半剩余元素个数 middle−i = 1−0 = 1，一次性计入逆序对 (3,1)，计数 +1；接着 3 > 2，同样计数 +1。",
     "左半耗尽后把 3 拷到末尾，得 [1,2,3]。两层合并累计 0+2 = 2，即逆序对 (3,1) 与 (3,2)。",
     "关键在合并时左右两半已各自有序：右半每取出一个元素，它贡献的逆序对数就是 middle−i，一次加出来，不必逐对比较；总复杂度 O(n log n)，暴力双循环 O(n²)。"
    ]
   }
  },
  "median-of-medians": {
   "brute": "先想暴力解：先完全排序再取第 k−1 位，O(n log n)，可选择问题本不需要全序；普通快速选择平均 O(n)，但枢轴选得差时每轮只排除一两个元素，退化到 O(n²)，随机枢轴也只是期望保证，最坏无界。关键观察是：把数组按 5 个一组取中位数，再递归求这些中位数的中位数作枢轴——它能保证每轮至少把约 30% 的元素排除在外，递归规模按几何级数收缩，最坏仍 O(n)。",
   "bruteCode": "def brute(nums, k):\n    return sorted(nums)[k - 1]",
   "walkthrough": {
    "input": "nums = [7, 1, 9, 3, 5, 6, 8, 2, 10, 4, 11]，k = 6（找第 6 小）",
    "steps": [
     "11 > 5，按 5 个一组排序取中位数：[7,1,9,3,5] 排序后取下标 2 得 5，[6,8,2,10,4] 得 6，剩下 [11] 得 11，中位数集合为 [5, 6, 11]。",
     "递归求中位数集合的中位数：select([5,6,11], 3//2=1)，长度 ≤5 直接排序取下标 1，得枢轴 6。",
     "三路分区：小于 6 的 [1,3,5,2,4] 共 5 个，等于 6 的 1 个，大于 6 的 [7,9,8,10,11] 共 5 个。",
     "目标下标 k−1=5：5 不小于 len(smaller)=5，但 5 < 5+1=6，落在「等于枢轴」一段，直接返回 6，无需再递归——正是排序后的第 6 个元素。",
     "若目标落在 small 或 large，只递归那一侧并按已排除数量折减 k。中位数枢轴保证每轮至少排除约 30% 候选、递归几何收缩，最坏 O(n)；坏枢轴的快选会退化到 O(n²)。"
    ]
   }
  },
  "meet-in-the-middle": {
   "brute": "先想暴力解：枚举全部 2ⁿ 个子集逐个验证和是否等于 target，n=40 时约 10¹² 个子集，完全不可行；改用 DP 又受限于和的值域大小。关键观察是：目标若能拆成「左半选择 + 右半选择」的组合，就先枚举左半 2^(n/2) 个子集和并排序，再枚举右半每个子集和 s，用二分在左表中统计等于 target−s 的个数——左右两侧的笛卡尔积与全部完整方案一一对应，复杂度从 O(2ⁿ) 降到约 O(2^(n/2)·n)。",
   "bruteCode": "def brute(nums, target):\n    n = len(nums)\n    count = 0\n    for mask in range(1 << n):\n        total = 0\n        for i in range(n):\n            if mask >> i & 1:\n                total += nums[i]\n        if total == target:\n            count += 1\n    return count",
   "walkthrough": {
    "input": "nums = [1, 2, 2, 3]，target = 5",
    "steps": [
     "拆成左右两半：左 [1,2]、右 [2,3]。左半子集和枚举得 [0, 1, 2, 3]（空集、{1}、{2}、{1,2}）；右半子集和为 [0, 2, 3, 5]，排序备用。",
     "对每个左和 s 在右表二分统计等于 target−s 的个数：s=0 找 5，命中 1 个；s=1 找 4，命中 0 个。",
     "s=2 找 3，命中 1 个；s=3 找 2，命中 1 个。合计 1+0+1+1 = 3。",
     "3 个完整方案：右 2+右 3、左 2+右 3、左 1+左 2+右 2，与暴力枚举全部 2⁴=16 个子集逐一验证的结果一致。",
     "两侧各只枚举 2²=4 个子集和、配对用排序加二分；n=40 时暴力 2⁴⁰≈10¹²，折半后约 2×2²⁰≈2×10⁶，指数问题降到平方根量级。"
    ]
   }
  },
  "introsort": {
   "brute": "先想暴力解：纯快速排序平均 O(n log n)，但固定取首元素做枢轴时，遇到逆序或已有序输入每轮分区几乎不缩小区间，退化到 O(n²)，递归深度也随之爆炸。关键观察是：给递归深度设上限（约 2·log₂n），深度耗尽说明分区持续病态，此时对整个剩余区间切换堆排序——最坏 O(n log n) 有保证；长度 ≤16 的小区间改用插入排序，常数小、没有递归开销。",
   "bruteCode": "def brute(nums):\n    if len(nums) <= 1:\n        return list(nums)\n    pivot = nums[0]\n    smaller = [v for v in nums[1:] if v < pivot]\n    larger = [v for v in nums[1:] if v >= pivot]\n    return brute(smaller) + [pivot] + brute(larger)",
   "walkthrough": {
    "input": "nums = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]（17 个逆序元素）",
    "steps": [
     "n=17 > 16 走快排路径，递归深度上限 2×bit_length(17)=2×5=10。第一次分区三数取中：nums[0]=16、nums[8]=8、nums[16]=0，中位数 8 作枢轴。",
     "分区把小于 8 的 8 个元素换到前缀：数组变为 [7,6,5,4,3,2,1,0 | 8,16,15,14,13,12,11,10,9]，分界 split=8。",
     "递归左半 [0,7]：长度 8 ≤ 16，切换插入排序，就地排成 [0,1,2,3,4,5,6,7]。",
     "右半 [8,16] 长度 9 ≤ 16，同样插入排序成 [9,10,…,16]。最终输出 [0,1,…,16]。",
     "若分区持续病态把深度耗尽（depth=0），该区间整体切换堆排序兜底，保证最坏 O(n log n)；三种策略各司其职——快排平均快、插入排序小块常数低、堆排序最坏有界。"
    ]
   }
  },
  "timsort": {
   "brute": "先想暴力解：对整个数组做一次通用排序（如堆排序或纯插入排序），完全无视数据里现成的有序片段——随机数据怎么排，近乎有序的数据也怎么排，无法利用局部性。关键观察是：真实数据常含自然升/降序段——把数组切分成自然 run（降序原地反转），不足最小长度的用插入排序补长，再按栈规则把 run 稳定归并；最好情形 O(n)，最坏 O(n log n)，且相等元素保持原有次序（稳定）。",
   "bruteCode": "def brute(nums):\n    nums = list(nums)\n    for i in range(1, len(nums)):\n        value = nums[i]\n        j = i - 1\n        while j >= 0 and nums[j] > value:\n            nums[j + 1] = nums[j]\n            j -= 1\n        nums[j + 1] = value\n    return nums",
   "walkthrough": {
    "input": "nums = [9,8,7,6,5,4,3,2,1,0, 19,18,17,16,15,14,13,12,11,10, 29,28,27,26,25,24,23,22,21,20, 39,38,37,36,35,34,33,32,31,30]（40 个数，四段降序块）",
    "steps": [
     "第一段 [9..0] 检测为降序 run，原地反转成 [0,1,…,9]；随后的自然升序延伸把 19 也并入（19 ≥ 9），run 长度 11。",
     "不足 32 的 run 用插入排序补长：依次吸收 18,17,…,10（各自插到队尾附近）、29,28,…,20、38,39，直到长度达到 32 为止，run 1 覆盖 [0..29] ∪ {38,39}，已有序。",
     "剩余 8 个元素 [37,36,…,30] 检测为降序 run，反转成 [30,31,…,37]；数组耗尽保持长度 8。运行栈为 [(0,32), (32,40)]。",
     "归并阶段把栈顶两个 run 反复合并：左 run [0..29,38,39] 与右 run [30..37] 归并（相等时先取左侧，保证稳定），得 [0,1,…,39]。",
     "全程只做一次反转、若干局部插入和一次归并，充分利用现成有序段——最好情形 O(n)；真实 Timsort 还用 run 长度不变量控制合并时机，防止退化。"
    ]
   }
  },
  "external-merge-sort": {
   "brute": "先想暴力解：数据放不进内存，若排序过程反复随机访问外存（为每个元素来回跳转读写），随机 I/O 会让速度慢到不可用。关键观察是：外存高效的模式是「顺序大批量读写」——先按内存容量分块，每块读入后排好序写回成初始 run；再用小顶堆做 k 路归并，每趟把 run 数除以扇入 k，反复直到只剩一个 run，总 I/O 为 O((N/B)·log_{M/B}(N/B)) 次块读写。",
   "bruteCode": "def brute(runs):\n    runs = [list(r) for r in runs]\n    while len(runs) > 1:\n        a, b = runs[0], runs[1]\n        merged = []\n        i = j = 0\n        while i < len(a) and j < len(b):\n            if a[i] <= b[j]:\n                merged.append(a[i])\n                i += 1\n            else:\n                merged.append(b[j])\n                j += 1\n        merged.extend(a[i:])\n        merged.extend(b[j:])\n        runs = [merged] + runs[2:]\n    return runs[0] if runs else []",
   "walkthrough": {
    "input": "runs = [[1,5], [2,4], [3,8], [6,7]]（各自已在内存排好序），memory = 2（一次只能归并 2 路）",
    "steps": [
     "第 1 趟把 4 个 run 按 memory=2 分组：[1,5]+[2,4] 一组，[3,8]+[6,7] 一组。",
     "组内用小顶堆归并：堆里放各路队头 (1,2)，弹出 1 后补入该路下一个 5，再弹 2 补 4，输出 [1,2,4,5]；另一组同理得 [3,6,7,8]。趟数计 1。",
     "第 2 趟只剩 2 个 run，再归并一次：队头 (1,3)，弹 1 补 2、弹 2 补 4……逐个输出 [1,2,3,4,5,6,7,8]。趟数计 2，结束。",
     "归并只顺序读各 run、顺序写结果，正是外存友好的访问模式；堆维护 memory 路队头，每输出一个元素 O(log memory)。",
     "run 数每趟除以扇入：4 → 2 → 1，共 ⌈log₂4⌉=2 趟；若像朴素做法每次只两两归并，本例要 3 趟。一般 N/B 个初始 run、内存容纳 M/B 路，总 I/O 为 O((N/B)·log_{M/B}(N/B)) 次块读写。"
    ]
   }
  },
  "branch-and-bound": {
   "brute": "先想暴力解：枚举每件物品放或不放的全部 2^n 种组合，逐个检查重量是否超出容量，在合法组合里记录最大价值。n 件物品就要走满 2^n 条分支，而且大量前缀明明已经注定不可能更优，仍会被扩展到底，浪费严重。关键观察是：按价值密度从高到低考虑物品后，可以用「分数背包」算出当前前缀的乐观上界——剩余容量先装整件、装不下的按比例折算；一旦「当前价值 + 上界」都追不上已有的最优值，这棵子树整个剪掉即可，这正是分支限界的剪枝依据。",
   "bruteCode": "def brute(items, capacity):\n    n = len(items)\n    best = 0\n    for mask in range(1 << n):\n        w = v = 0\n        for i in range(n):\n            if mask >> i & 1:\n                w += items[i][0]\n                v += items[i][1]\n        if w <= capacity:\n            best = max(best, v)\n    return best",
   "walkthrough": {
    "input": "items = [[5,10],[4,8],[3,5]]（[重量, 价值]），capacity = 8",
    "steps": [
     "输入 3 件物品（重量, 价值）：(5,10)、(4,8)、(3,5)，容量 8。按价值密度从高到低排序后依次考虑，搜索从 (idx=0, 已用重量 0, 价值 0) 出发，best = 0。",
     "根节点先试「装第 1 件 (5,10)」：剩余容量 3，乐观上界用分数背包估为 8×3/4 = 6，0 + 10 + 6 = 16 > 0，值得深入；进入后 best 更新为 10。",
     "第 2 件 (4,8) 装不下（5+4=9 > 8）；跳过它、试第 3 件 (3,5)：10 + 5 = 15 > 10，装入后重量 5+3=8 恰好压线，best = 15。",
     "回到根节点试「不装第 1 件」的分支：剩余物品 (4,8)、(3,5) 的松弛上界 = 8+5 = 13 ≤ best 15，整棵子树直接剪掉，不再搜索。",
     "返回 15。暴力要枚举 2³ = 8 种组合；分支限界靠乐观界只完整走了一条路径，容量越紧、上界越准，剪掉的分支越多。"
    ]
   }
  },
  "kosaraju-scc": {
   "brute": "先想暴力解：对每对顶点 (u, v) 各做一次可达性搜索，u 能到 v 且 v 也能到 u 才归入同一强连通分量；n 个顶点要发起 O(n) 次搜索，总代价 O(V·(V+E))，图稍大就撑不住。关键观察是：把每个强连通分量缩成一个点后一定得到 DAG，而缩点图的「源」分量可以靠第一遍 DFS 的完成时间找出来——最晚完成的未分配分量必是源；把所有边反向后，从源出发的搜索恰好走不出本分量，于是两遍 DFS 就能把分量一个个完整剥离。",
   "bruteCode": "def brute(n, edges):\n    adj = [[] for _ in range(n)]\n    radj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        radj[v].append(u)\n    def reach(adj, s):\n        seen = [False] * n\n        seen[s] = True\n        stack = [s]\n        while stack:\n            u = stack.pop()\n            for v in adj[u]:\n                if not seen[v]:\n                    seen[v] = True\n                    stack.append(v)\n        return seen\n    comp = [-1] * n\n    for s in range(n):\n        if comp[s] != -1:\n            continue\n        fwd = reach(adj, s)\n        bwd = reach(radj, s)\n        for v in range(n):\n            if fwd[v] and bwd[v]:\n                comp[v] = s\n    sizes = {}\n    for c in comp:\n        sizes[c] = sizes.get(c, 0) + 1\n    return sorted(sizes.values(), reverse=True)",
   "walkthrough": {
    "input": "n = 5，edges = [[1,0],[0,2],[2,1],[0,3],[3,4]]（有向边 u→v）",
    "steps": [
     "第一遍在原图 DFS 并记录完成序：从 0 深入，0→2→1 一路走到底，1、2 先后完成入序；回溯后 0→3→4，4、3、0 完成，order = [1,2,4,3,0]。",
     "完成时间最晚的 0 所在分量是缩点 DAG 的源。0、1、2 因 0→2→1→0 构成环互相可达；3、4 之间只有单向链路。",
     "第二遍在转置图上从 0 出发：转置边 0→1、1→2 可达，恰好收集 {0,1,2}；原图的 0→3 反向后是 3→0，从 0 出发越不过去，分量完整不掺假。",
     "按完成序逆序继续：下一个未分配的是 3，转置图里它只能走到已分配的 0，于是 3 单独成块；同理 4 单独成块。",
     "返回 count=3、sizes=[3,1,1]。暴力对每对顶点做双向可达检查要 O(V·(V+E))；Kosaraju 两遍 DFS 各 O(V+E)，合计线性。"
    ]
   }
  },
  "biconnected-components": {
   "brute": "先想暴力解：对每条边做「删掉它再查两端是否连通」的测试，不通则是桥；割点也要对每个点做同样的删除测试。每测一次就要一整遍 O(V+E) 搜索，总共 O(E·(V+E))，而且只回答「哪条边、哪个点危险」，给不出块结构的完整划分。关键观察是：DFS 树上的回边必不是桥，Tarjan 的 low 值恰好刻画「子树能否绕过当前边回到更上方」；当 low[v] ≥ dfn[u] 时，边栈里攒下的边恰好构成一个点双分量，一遍 DFS 全部弹出。",
   "bruteCode": "def brute(n, edges):\n    def connected_without(eid):\n        adj = [[] for _ in range(n)]\n        for i, (u, v) in enumerate(edges):\n            if i == eid:\n                continue\n            adj[u].append(v)\n            adj[v].append(u)\n        seen = [False] * n\n        stack = [0]\n        seen[0] = True\n        while stack:\n            u = stack.pop()\n            for v in adj[u]:\n                if not seen[v]:\n                    seen[v] = True\n                    stack.append(v)\n        return all(seen)\n    return [i for i in range(len(edges)) if not connected_without(i)]",
   "walkthrough": {
    "input": "n = 5，edges = [[0,1],[1,2],[2,3],[3,0],[0,4]]（无向边）",
    "steps": [
     "输入中 0-1、1-2、2-3、3-0 围成四边形，0 上另挂叶子 4。DFS 从 0 进入，dfn[0..3] = 0,1,2,3，树边 (0,1)、(1,2)、(2,3) 依次压入边栈。",
     "在节点 3 遇到回边 3-0：dfn[0]=0 比 low[3] 小，low[3] 更新为 0，回边 (3,0) 也压栈——环在此封口。",
     "递归回到 0 后检查 low[1]=0 ≥ dfn[0]=0 成立，把边栈一路弹到 (0,1)：共弹出 4 条边，恰好是整个四边形，输出一个含 4 条边的点双分量。",
     "继续访问叶子 4：树边 (0,4) 入栈，low[4]=4 ≥ dfn[0]=0 成立，弹出 (0,4) 单独成块，大小 1。",
     "返回 count=2、sizes=[4,1]：割点 0 同时属于两个分量。逐边删除测试要 O(E·(V+E))；边栈配 dfn/low 一遍 DFS 就是 O(V+E)。"
    ]
   }
  },
  "dag-shortest-path": {
   "brute": "先想暴力解：枚举从源点出发的所有路径——每个分叉都复制出一条新路径，最坏是指数条——逐条累加边权取最小值。DAG 虽然没有环，路径条数仍可能随边数指数增长，而且大量子路径被反复拼接、重复计算。关键观察是：DAG 的节点可以排成拓扑序，任何边都从排位靠前的节点指向靠后的节点；按这个顺序处理，轮到某个节点时它的最短距离已经定型，出边各做一次松弛即可，每条边只被用一次，O(V+E) 完成，还天然允许负权边。",
   "bruteCode": "def brute(n, edges, source):\n    adj = [[] for _ in range(n)]\n    for u, v, w in edges:\n        adj[u].append((v, w))\n    best = [None] * n\n    def dfs(u, d):\n        if best[u] is None or d < best[u]:\n            best[u] = d\n        else:\n            return\n        for v, w in adj[u]:\n            dfs(v, d + w)\n    dfs(source, 0)\n    return best",
   "walkthrough": {
    "input": "n = 5，source = 0，edges = [[0,1,2],[0,2,5],[1,2,-3],[1,3,4],[2,3,1],[2,4,3]]（[u,v,w]）",
    "steps": [
     "先做拓扑排序（入度清零即入队），得到顺序 [0,1,2,4,3]：每条边都从排位靠前的节点指向靠后的节点，dist[0]=0，其余为 ∞。",
     "处理 0：松弛 0→1 得 dist[1]=2；松弛 0→2 得 dist[2]=5。",
     "处理 1：边 1→2 的权 −3 把 dist[2] 从 5 压到 2−3 = −1；边 1→3 给出 dist[3] = 2+4 = 6。",
     "处理 2：边 2→3 把 dist[3] 从 6 降到 −1+1 = 0；边 2→4 给出 dist[4] = −1+3 = 2。节点 4、3 无出边，扫描结束。",
     "返回 dist = [0, 2, −1, 0, 2]：负权边被正确吸收。Dijkstra 不允许负权，逐轮松弛的 Bellman-Ford 是 O(V·E)；按拓扑序每条边只松弛一次，O(V+E)。"
    ]
   }
  },
  "tree-diameter": {
   "brute": "先想暴力解：对每对节点 (u, v) 各做一次 BFS/DFS 求树上唯一路径的长度，取最大值，n 个节点要 O(n²) 次搜索；更朴素的是把所有点对间的路径逐条累加，同样是平方级起步。关键观察是：树中两点路径唯一，而「从任意节点出发搜到的最远点」必然是某条直径的端点——否则把真正的直径拿来比较会推出矛盾。于是先从任意点找最远点 a，再从 a 找最远点 b，a 到 b 的距离就是直径，两次线性搜索即可。",
   "bruteCode": "def brute(n, edges):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    def dist_all(s):\n        dist = [-1] * n\n        dist[s] = 0\n        q = [s]\n        for u in q:\n            for v in adj[u]:\n                if dist[v] == -1:\n                    dist[v] = dist[u] + 1\n                    q.append(v)\n        return dist\n    best = 0\n    for s in range(n):\n        d = dist_all(s)\n        for t in range(s + 1, n):\n            best = max(best, d[t])\n    return best",
   "walkthrough": {
    "input": "n = 6，edges = [[0,1],[1,2],[2,3],[3,4],[0,5]]",
    "steps": [
     "输入是一条链 0-1-2-3-4，再在 0 上挂叶子 5。第一次 BFS 从 0 出发：dist = [0,1,2,3,4,1]，最远点是 4，距离 4。",
     "树的性质保证：从任意点出发的最远点必是某条直径的端点，因此 4 一定是直径的一端，不用再枚举其他候选。",
     "第二次 BFS 从 4 出发：dist[3]=1、dist[2]=2、dist[1]=3、dist[0]=4、dist[5]=5，最远点是 5，距离 5。",
     "返回 length=5、ends=[4,5]，直径路径为 5-0-1-2-3-4。对每对节点各搜一次是 O(n²)；两次 BFS 只有 O(n)。"
    ]
   }
  },
  "rerooting-dp": {
   "brute": "先想暴力解：对每个候选根各做一次全树 BFS 累加距离和，n 个节点共 O(n²)，树结构信息在 n 次搜索间毫无复用。关键观察是：相邻两个根的答案只差一条边——根从 u 挪到孩子 v 时，v 子树里的 sz[v] 个节点每人近 1 步，其余 n−sz[v] 个节点每人远 1 步，即 ans[v] = ans[u] + (n−sz[v]) − sz[v]。先自底向上算出以 0 为根的答案当种子，再沿树一遍换根，O(n) 得到全部答案。",
   "bruteCode": "def brute(n, edges):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    ans = []\n    for s in range(n):\n        dist = [-1] * n\n        dist[s] = 0\n        q = [s]\n        for u in q:\n            for v in adj[u]:\n                if dist[v] == -1:\n                    dist[v] = dist[u] + 1\n                    q.append(v)\n        ans.append(sum(dist))\n    return ans",
   "walkthrough": {
    "input": "n = 4，edges = [[0,1],[1,2],[1,3]]，求每个节点为根时到其余节点的距离和",
    "steps": [
     "输入是一棵以 1 为中心的树。自底向上第一遍：sz[1]=3、sz[0]=4；down[0] = down[1] + sz[1] = 2+3 = 5，正是以 0 为根时到 1、2、3 的距离和 1+2+2 = 5。",
     "令 ans[0] = 5 作为种子。",
     "换根到 1：原根一侧只剩节点 0，每人远 1 步（+1）；1 的子树里的 3 个节点每人近 1 步（−3），ans[1] = 5 + 1 − 3 = 3。",
     "继续换根：ans[2] = 3 + (4−1) − 1 = 5；ans[3] 与 2 对称，同样是 5。",
     "返回 [5,3,5,5]。对每个根各做一次全树搜索是 O(n²)；一次下行一次上行共 O(n)。"
    ]
   }
  },
  "dsu-on-tree": {
   "brute": "先想暴力解：对每个节点单独扫一遍它的整棵子树，现场用集合统计颜色，取出不同颜色数作为答案。链状树最坏每个节点都要扫 O(n) 个后代，总代价 O(n²)，父子子树之间大量重叠的统计被扔掉重来。关键观察是：答案可以按子树逐个产生，孩子处理完的统计容器可以继承——每次保留最大（重）孩子的容器，把其余小容器并进去；每次并入都让元素所属集合大小至少翻倍，每个节点至多移动 O(log n) 次，总复杂度 O(n log n)。",
   "bruteCode": "def brute(n, colors, edges, root):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    parent = [-1] * n\n    order = [root]\n    for u in order:\n        for v in adj[u]:\n            if v != parent[u]:\n                parent[v] = u\n                order.append(v)\n    in_sub = [False] * n\n    ans = [0] * n\n    for idx in range(n - 1, -1, -1):\n        u = order[idx]\n        for v in range(n):\n            in_sub[v] = False\n        stack = [u]\n        in_sub[u] = True\n        while stack:\n            x = stack.pop()\n            for v in adj[x]:\n                if not in_sub[v] and v != parent[x]:\n                    in_sub[v] = True\n                    stack.append(v)\n        ans[u] = len({colors[v] for v in range(n) if in_sub[v]})\n    return ans",
   "walkthrough": {
    "input": "n = 5，root = 0，colors = [1,2,2,3,2]，edges = [[0,1],[0,2],[1,3],[1,4]]",
    "steps": [
     "树结构：0 的孩子是 1、2，1 的孩子是 3、4。后序遍历得到 2,4,3,1,0，保证处理 u 时它的所有孩子都已算完。",
     "三个叶子 2、3、4 各自建单元素集合：ans[2]=ans[3]=ans[4]=1。",
     "处理 1：两个孩子 3、4 的集合等大（各 1 个元素），沿用 3 的 {3} 作底，加入自己的颜色 2，再并入 4 的 {2}，得到 {2,3}，ans[1] = 2。",
     "处理根 0：重孩子取集合更大的 1（2 个元素 > 2 的 1 个元素），直接继承 {2,3}，加入 colors[0]=1，再并入 2 的 {2}，得 {1,2,3}，ans[0] = 3。",
     "返回 [3,2,1,1,1]。每个节点重扫整棵子树在链上要 O(n²)；小集合并入大集合让每个元素至多搬家 O(log n) 次，总 O(n log n)。"
    ]
   }
  },
  "offline-dynamic-connectivity": {
   "brute": "先想暴力解：对每个询问时刻 t，把当时仍然存活的边全部取出，现场建图并搜索一次判断 u、v 是否连通。Q 个询问、K 条边时最坏 O(Q·(V+E))；「下一时刻只删了一条边」这样的微小变化也要整图重来，毫无复用。关键观察是：操作离线全知，每条边只活在一个时间区间 [l,r] 上——把区间挂到时间线段树上，DFS 整棵树时用「只合并不拆分」的可回滚并查集：进入节点合并挂上的边，离开时按记录逆序撤销，同一时刻的询问在叶子上就地回答。",
   "bruteCode": "def brute(n, edges, queries):\n    out = []\n    for t, u, v in queries:\n        adj = [[] for _ in range(n)]\n        for a, b, l, r in edges:\n            if l <= t <= r:\n                adj[a].append(b)\n                adj[b].append(a)\n        seen = [False] * n\n        seen[u] = True\n        stack = [u]\n        while stack:\n            x = stack.pop()\n            for y in adj[x]:\n                if not seen[y]:\n                    seen[y] = True\n                    stack.append(y)\n        out.append(seen[v])\n    return out",
   "walkthrough": {
    "input": "n = 3，edges = [[0,1,0,2],[1,2,1,3]]（[u,v,l,r]），queries = [[0,0,1],[1,0,2],[3,0,2]]（[t,u,v]）",
    "steps": [
     "3 个点：边 0-1 存活于时间 [0,2]，边 1-2 存活于 [1,3]；询问 t=0 时 0 与 1、t=1 时 0 与 2、t=3 时 0 与 2 是否连通。",
     "把每条边按存活区间挂到时间线段树 [0,3] 上：0-1 覆盖 [0,2]，拆到节点 [0,1] 与叶子 [2,2]；1-2 覆盖 [1,3]，拆到叶子 [1,1] 与节点 [2,3]。",
     "DFS 进入节点 [0,1] 时在可回滚并查集里合并 0-1：叶子 [0,0] 回答 t=0（0 与 1 连通，True）；叶子 [1,1] 再合并挂在这里的 1-2，0-1-2 全连通 → t=1 询问 0 与 2 得 True。",
     "回溯出 [0,1] 时撤销 0-1；进入节点 [2,3] 合并 1-2，叶子 [2,2] 再合并 0-1（t=2 无询问）；叶子 [3,3] 只有 1-2 存活，0 是孤点 → t=3 得 False。",
     "返回 [True, True, False]。普通并查集无法删边；按秩合并加操作栈回滚让每次撤销只花 O(log V)，配合时间线段树约 O((Q+K)·log Q·log V)。"
    ]
   }
  },
  "lower-bound-flow": {
   "brute": "先想暴力解：把每条边的流量在下界与上界之间逐个枚举，再检查每个中间节点流入等于流出——流量组合是指数级，连「是否存在一组合法数值」都难以直接判定，更别说复用 Dinic 这类现成模板。关键观察是：把流量 f 拆成「保底的下界 lo」加「自由变化的 hi−lo」；下界部分用超级源汇强制入账——每条边给超级源→v、u→超级汇各补一条容量 lo 的边，再连一条汇→源的无穷边闭合环流。超级源的最大流能送满全部下界需求，原网络就存在可行流。",
   "bruteCode": "def brute(n, edges, source, sink):\n    from itertools import product\n    for flows in product(*[range(lo, hi + 1) for _, _, lo, hi in edges]):\n        balance = [0] * n\n        for (u, v, _, _), f in zip(edges, flows):\n            balance[u] -= f\n            balance[v] += f\n        if all(balance[x] == 0 for x in range(n) if x not in (source, sink)):\n            return True\n    return False",
   "walkthrough": {
    "input": "n = 2，source = 0，sink = 1，edges = [[0,1,2,5]]（[u,v,lo,hi]）",
    "steps": [
     "唯一一条边 0→1 要求流量落在 [2,5]。按下界消去改图：自由容量 = hi−lo = 3；新建超级源 2、超级汇 3，补边 2→1 容量 2、0→3 容量 2，再加汇→源的无穷回流边 1→0；需求量 required = 2。",
     "这样改的目的是把「每条边至少流 lo」翻译成普通最大流的语言：超级源的出边若无法全部饱和，说明某些下界无处安放，原网络必不可行。",
     "在改造图上 BFS 找增广路：2→1→0→3，瓶颈 = min(2, ∞, 2) = 2，一次推满 2 个单位，最大流 = 2。",
     "最大流 2 ≥ required 2，返回 True：原边 0→1 的实际流量 = 下界 2 + 自由部分 0 = 2，恰好在 [2,5] 内。",
     "对照不可行情形：若图中只有一条边 1→2 要求流量 ≥3，而节点 1 没有任何入边，超级源的需求一个都送不出去，最大流 0 < 3，返回 False。暴力枚举流量组合是指数级；本方法只需一次最大流。"
    ]
   }
  },
  "tree-isomorphism-ahu": {
   "brute": "先想暴力解：两棵树同构意味着存在保持邻接关系的双射——直接在 n! 种对应关系里找不现实，退一步也要对每一种「A 的根 × B 的根」组合递归比对子树，O(n²) 个根组合乘上比对成本，依然昂贵且容易漏判。关键观察是：无根树没有固定根，比编码前必须先消除「选根任意性」；树的重心至多两个，从重心出发的编码就是规范形式——每个子树递归写成括号串并排序后，两棵树同构当且仅当从各自重心出发的编码完全相同。",
   "bruteCode": "def brute(n, edges_a, edges_b):\n    def forms(n, edges):\n        adj = [[] for _ in range(n)]\n        for u, v in edges:\n            adj[u].append(v)\n            adj[v].append(u)\n        out = []\n        for root in range(n):\n            parent = {root: -1}\n            order = [root]\n            for u in order:\n                for v in adj[u]:\n                    if v not in parent:\n                        parent[v] = u\n                        order.append(v)\n            label = [None] * n\n            for u in reversed(order):\n                kids = sorted(label[v] for v in adj[u] if v != parent[u])\n                label[u] = \"(\" + \"\".join(kids) + \")\"\n            out.append(label[root])\n        return out\n    return bool(set(forms(n, edges_a)) & set(forms(n, edges_b)))",
   "walkthrough": {
    "input": "treeA：n = 4，edges = [[0,1],[1,2],[1,3]]；treeB：n = 4，edges = [[0,1],[0,2],[0,3]]",
    "steps": [
     "两棵都是三星形，只是中心编号不同。先各找重心：A 中拔掉节点 1 后剩下的最大块只有 1 个点，拔掉其他任何点都剩 3 个点，故重心是 1；B 的重心是 0。",
     "从重心向下递归编码：每个叶子写成 ()。",
     "A 以 1 为根：三个邻居 0、2、3 都是叶子，节点 1 的编码 = ( + ()()() + )，即 \"(()()())\"。",
     "B 以 0 为根：同样得到 \"(()()())\"，两串完全相等 → 同构，返回 True。",
     "若不从重心出发，同一棵树换根会得到不同编码造成误判；暴力要枚举 O(n²) 种根配对，重心编码只需 O(n log n)（瓶颈在子树编码排序）。"
    ]
   }
  },
  "profile-dp": {
   "brute": "先想暴力解：用递归从左上角第一个空格开始铺，每次尝试竖放或横放一块多米诺，铺满整格才算一种方案——不加记忆化就是指数级分支，同一个局部格局会被反复重铺。关键观察是：逐格扫描时，未来的放法只取决于「从当前格向前看 m 格的占用轮廓」，与更早的列无关；把这个轮廓压成一个 m 位掩码作为状态，每格在 2^m 个状态上做有限转移，复杂度从指数级降到 O(rows × cols × 2^cols)。",
   "bruteCode": "def brute(n, m):\n    def dfs(pos, mask):\n        if pos == n * m:\n            return 1 if mask == 0 else 0\n        row, col = divmod(pos, m)\n        if mask & 1:\n            return dfs(pos + 1, mask >> 1)\n        ways = dfs(pos + 1, (mask >> 1) | (1 << (m - 1)))\n        if col < m - 1 and not (mask & 2):\n            ways += dfs(pos + 2, mask >> 2)\n        return ways\n    return dfs(0, 0) if (n * m) % 2 == 0 else 0",
   "walkthrough": {
    "input": "n = 2 行、m = 3 列的网格，用 1×2 多米诺铺满",
    "steps": [
     "逐格扫描，用一个 3 位掩码当轮廓线：轮到某格时 bit0 表示「该格已被上一行的竖牌占住」，其余位记录同行右侧格子的占用情况。",
     "第 0 行第 0 列空闲，两种放法各 1 种：竖放会留下指向下一行的接头位（状态变 4 = 100），横放则把右邻格标记为占用（状态变 1 = 001）。",
     "第 0 行扫完得到三个状态各 1 种：7（三列全竖放，第 1 行三格全被接头占住）、1（col0 竖放 + 横牌盖 (0,1)-(0,2)）、4（横牌盖 (0,0)-(0,1) + col2 竖放）。",
     "第 1 行扫描时，接头位为 1 的格子直接视为已填并移出掩码；空闲格横放（状态 7→0、1→0、4→0 各 1 种）或竖放（留下悬空接头，终态非 0 被淘汰）。扫完全部 6 格，只有状态 0 有效，共 3 条路径。",
     "返回 3，对应「全竖」「竖+横横」「横横+竖」三种铺法。朴素回溯是指数分支；轮廓线 DP 每格只在 2³ = 8 个状态上转移，O(rows × cols × 2^cols)。"
    ]
   }
  },
  "sos-dp": {
   "brute": "先想暴力解：对每个掩码枚举全部子集（sub = (sub−1) & mask），把对应值累加。k 位时状态 2^k 个、每个枚举 2^k 个子集，共 4^k 次，k = 20 时就是千亿级。关键观察是：子集和可以逐位分阶段累积——第 i 轮只处理含第 i 位的掩码，把不含该位的搭档 f[mask ^ 2^i] 并进来；i 走完后每个 f[mask] 恰好累计了全部子集的贡献，这就是 SOS / 子集 Zeta 变换，O(k·2^k)。",
   "bruteCode": "def brute(f):\n    size = len(f)\n    g = []\n    for mask in range(size):\n        total = 0\n        sub = mask\n        while True:\n            total += f[sub]\n            if sub == 0:\n                break\n            sub = (sub - 1) & mask\n        g.append(total)\n    return g",
   "walkthrough": {
    "input": "array = [1,2,3,4]，下标 0..3 即掩码 00、01、10、11",
    "steps": [
     "目标：把每个 f[mask] 变成其所有子集取值之和。朴素做法每个掩码枚举全部子集共 4^k 次；SOS 改为逐位两轮扫描。",
     "第 1 轮处理最低位（bit 0）：f[01] += f[00] → 2+1 = 3；f[11] += f[10] → 4+3 = 7，数组变 [1,3,3,7]。",
     "第 2 轮处理次低位（bit 1）：f[10] += f[00] → 3+1 = 4；f[11] += f[01] → 7+3 = 10，数组变 [1,3,4,10]。",
     "校验 f[11] = 10 = 1+2+3+4，恰好是掩码 11 的全部四个子集（00、01、10、11）之和；f[10] = 4 = f[00]+f[10] = 1+3 也正确。",
     "两轮各扫 2^k 个状态，总 O(k·2^k)；k = 20 时约 2000 万次，远小于暴力的 4^20。"
    ]
   }
  },
  "probability-dp": {
   "brute": "先想暴力解：枚举 m 步每一步「顺时针 / 逆时针」的选择，共 2^m 条随机路径，逐条模拟终点并按 1/2^m 统计落回起点的比例。m 稍大就是天文数字，而绝大多数路径中途就共享同一段位置序列，分开追踪纯属浪费。关键观察是：同一时刻处于同一节点的路径，后续演化完全相同——把状态定义为「时刻 t 位于节点 j 的概率」，每步让 prob[j] 以一半流向 (j+1) mod n、一半流向 (j−1) mod n，O(m·n) 完成。",
   "bruteCode": "def brute(n, m):\n    from itertools import product\n    hit = 0\n    for steps in product((1, -1), repeat=m):\n        pos = 0\n        for d in steps:\n            pos = (pos + d) % n\n        if pos == 0:\n            hit += 1\n    return hit / 2 ** m",
   "walkthrough": {
    "input": "n = 4 的环，从 0 出发随机走 m = 2 步，每步 ±1 等概率",
    "steps": [
     "状态 prob[j] = 当前时刻位于节点 j 的概率，初始 [1,0,0,0]。",
     "第 1 步：节点 0 的一半概率去 1、一半去 3，分布变为 [0, 0.5, 0, 0.5]。",
     "第 2 步：节点 1 各以 0.25 去 2 和 0，节点 3 各以 0.25 去 0 和 2，汇成 [0.5, 0, 0.5, 0]。",
     "返回 prob[0] = 0.5：两条路线 0→1→0 与 0→3→0 各贡献 1/4，合计 1/2。",
     "暴力枚举 2^m 条路径是指数级；DP 把同一位置的路径概率合并，复杂度 O(m·n)。"
    ]
   }
  },
  "divide-conquer-dp-optimization": {
   "brute": "先想暴力解：把数组切成 k 段、最小化各段和的平方和，分层 DP 是 dp[s][j] = min over i of dp[s−1][i] + cost(i, j)。每层每个终点 j 都要枚举分割点 i，一层 O(n²)，k 层共 O(k·n²)。关键观察是：平方和代价满足四边形不等式，最优分割点 opt[s][j] 随 j 单调不减——固定层用分治：先算中点的最优决策，再把决策范围一分为二传给两侧，每层降到 O(n log n)。",
   "bruteCode": "def brute(array, k):\n    n = len(array)\n    prefix = [0]\n    for v in array:\n        prefix.append(prefix[-1] + v)\n    def cost(i, j):\n        return (prefix[j] - prefix[i]) ** 2\n    INF = float(\"inf\")\n    dp = [0] + [cost(0, j) for j in range(1, n + 1)]\n    for seg in range(2, k + 1):\n        ndp = [INF] * (n + 1)\n        for j in range(1, n + 1):\n            for i in range(j):\n                if dp[i] < INF:\n                    ndp[j] = min(ndp[j], dp[i] + cost(i, j))\n        dp = ndp\n    return dp[n]",
   "walkthrough": {
    "input": "array = [1,2,3]，k = 2，代价为每段区间和的平方",
    "steps": [
     "1 段的 dp 直接由前缀和算出：dp[1] = 1² = 1、dp[2] = 3² = 9、dp[3] = 6² = 36。",
     "加第 2 段时若每个终点都从 0 枚举分割点是 O(n²)；分治利用「终点变大时最优分割点不减」来互相夹逼。求 new_dp[2]（中点 mid=2）：分割点 0/1/2 的候选分别为 0+9=9、1+4=5、9+0=9，最优 5，最优分割点 opt=1。",
     "分治把决策范围一分为二：左半 [1,1] 的分割点 ≤ 1，右半 [3,3] 的分割点 ≥ 1。",
     "左半 new_dp[1] = 1（分割 0，候选 1 与 1+0=1 打平取 0）；右半 new_dp[3] = min(1+25, 9+9) = 18（分割 2）。",
     "返回 18，对应切法 [1,2 | 3]：9+9=18，优于 [1 | 2,3] 的 26。每层分治总枚举 O(n log n)，k 层共 O(k·n·log n)。"
    ]
   }
  },
  "knuth-optimization": {
   "brute": "先想暴力解：石子合并的区间 DP 为 dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + sum(i..j)，每个区间枚举 O(n) 个分割点，共 O(n³)。关键观察是：区间和代价满足四边形不等式，最优分割点满足 opt[i][j−1] ≤ opt[i][j] ≤ opt[i+1][j]；每个区间只需在左右邻居最优分割点之间试刀，均摊每层对角线 O(n) 次尝试，总体降到 O(n²)。",
   "bruteCode": "def brute(stones):\n    n = len(stones)\n    prefix = [0]\n    for v in stones:\n        prefix.append(prefix[-1] + v)\n    def cost(i, j):\n        return prefix[j + 1] - prefix[i]\n    dp = [[0] * n for _ in range(n)]\n    for length in range(2, n + 1):\n        for i in range(n - length + 1):\n            j = i + length - 1\n            dp[i][j] = min(dp[i][k] + dp[k + 1][j] + cost(i, j) for k in range(i, j))\n    return dp[0][n - 1]",
   "walkthrough": {
    "input": "stones = [1,3,5]，合并两堆代价为两堆总和",
    "steps": [
     "长度 2 的区间：dp[0][1] = 1+3 = 4（最优分割点 opt=0），dp[1][2] = 3+5 = 8（opt=1）。",
     "长度 3 的区间 [0,2]：Knuth 夹逼保证最优分割点落在 opt[0][1]=0 与 opt[1][2]=1 之间，只需试 0 和 1 两个点，而不是 0、1、2 三个。",
     "试分割 0：dp[0][0] + dp[1][2] + 总和 9 = 0+8+9 = 17；试分割 1：dp[0][1] + dp[2][2] + 9 = 4+0+9 = 13，更优 → dp[0][2] = 13，opt[0][2] = 1。",
     "返回 13，对应先并 1+3=4（花费 4），再并 4+5=9（花费 9）；另一顺序 3+5=8 先并要花 17。",
     "朴素区间 DP 是 O(n³)；夹逼后每条对角线的分割点枚举总量均摊 O(n)，总 O(n²)。"
    ]
   }
  },
  "convex-hull-trick": {
   "brute": "先想暴力解：DP 转移形如 dp[i] = min over j of a_j·x_i + b_j 时，每个转移点都要把所有候选直线代入取最小，n 个点乘 m 条线是 O(n·m)，查询一多浪费明显。关键观察是：把每条候选线看成平面直线，「取 min」得到一条下凸折线——斜率不同的线在凸壳上各负责一段 x 区间，任何 x 下都不可能最小的线可直接淘汰；把凸壳按斜率排好，查询点二分（查询单调时还能双指针 O(1)）即可命中所在段。",
   "bruteCode": "def brute(lines, queries):\n    out = []\n    for x in queries:\n        out.append(min(a * x + b for a, b in lines))\n    return out",
   "walkthrough": {
    "input": "lines = [[2,0],[1,0],[0,1]]（y = a·x + b），queries = [3,-2,0]",
    "steps": [
     "三条线 y=2x、y=x、y=1 斜率互不相同，按斜率从大到小排序后 [2x, x, 1] 本身就构成下凸壳：相邻交点横坐标 0 和 1 递增，没有线需要淘汰。",
     "各自的最小值分工：x < 0 段 2x 最小（x=−2 时 −4 < −2 < 1），0 ≤ x ≤ 1 段 x 最小（x=0.5 时 0.5 < 1），x > 1 段 y=1 最小（x=3 时 1 < 3 < 6）。",
     "查询 x=3：二分比较 hull[1]（y=x）与 hull[2]（y=1），y=x 已不占优 → lo 移到 2，命中 y=1，返回 1。",
     "查询 x=−2：两次比较都显示左邻线仍占优，lo 收敛到 0，命中 y=2x，返回 −4；查询 x=0 恰在交点上，返回 0。",
     "三次查询各 O(log m)；暴力每次要代入全部 3 条线。若查询 x 还单调递增，双指针可做到均摊 O(1)。"
    ]
   }
  },
  "rolling-hash": {
   "brute": "先想暴力解：每来一个查询 (i, j) 就把两个词逐字符比较，遇到不同立即返回 False；词长 L 时单次查询 O(L)，同一对词被反复查询就反复扫描。关键观察是：把字符串看成 base 进制的大数并取模，就能压缩成一个定长指纹——两个串相等则指纹必相等；预计算每个词的双哈希（不同 base、不同模数）之后，查询先比指纹，指纹不同直接判 False，只有指纹相同才做一次全等复核兜底，把哈希碰撞的风险压到可忽略。",
   "bruteCode": "def brute(words, queries):\n    out = []\n    for i, j in queries:\n        out.append(words[i] == words[j])\n    return out",
   "walkthrough": {
    "input": "words = [\"ab\",\"aa\",\"ab\"]，queries = [[0,2],[0,1]]",
    "steps": [
     "预处理把每个词编码成两个多项式哈希：h1 用 base 131、模 10^9+7；h2 用 base 137、模 998244353。一次扫描全部算完，查询只查表。",
     "\"ab\"：h1 = 97×131 + 98 = 12805，h2 = 97×137 + 98 = 13387（'a'=97，'b'=98）；\"aa\"：h1 = 97×131+97 = 12804，h2 = 97×137+97 = 13386。于是三个词的指纹是 (12805,13387)、(12804,13386)、(12805,13387)。",
     "查询 (0,2)：指纹 (12805,13387) 完全一致，再做一次逐字符全等复核 a == b 为真 → True。",
     "查询 (0,1)：12805 ≠ 12804，指纹不同直接判 False，一个字符都不用比。",
     "逐字符比较每次 O(L)；预计算后查询 O(1)。双哈希加真值复核让碰撞与误判概率都可忽略。"
    ]
   }
  },
  "duval-lyndon-factorization": {
   "brute": "先想暴力解：要得到 Lyndon 分解，可以从每个位置出发、从长到短找「严格小于自身所有非平凡旋转」的最长前缀作为下一个因子，重复直到扫完；验证一个候选串就要 O(长度²) 次字符比较，整体远超线性且充满重复比较。关键观察是：扫描时维护三个指针 i、j、k，用 s[k] 与 s[j] 的一次比较就能在线维护周期结构——字符相等则周期延伸，出现更小字符则推倒重来；内层一结束，长度 j−k 的因子连同重复次数一次性输出，整体 O(n)。",
   "bruteCode": "def brute(s):\n    n = len(s)\n    def is_lyndon(w):\n        return all(w < w[i:] + w[:i] for i in range(1, len(w)))\n    out = []\n    i = 0\n    while i < n:\n        best_len = 1\n        for end in range(n, i, -1):\n            if is_lyndon(s[i:end]):\n                best_len = end - i\n                break\n        out.append(best_len)\n        i += best_len\n    return out",
   "walkthrough": {
    "input": "s = \"abab\"",
    "steps": [
     "Lyndon 词是严格小于自身所有非平凡旋转的单词；分解要求切出的因子字典序非增。指针从 i=0、j=1、k=0 起步。",
     "比较 s[k] 与 s[j]：'a' < 'b'，说明当前候选撑不成更长周期，令 k = i = 0 重置，j 前进到 2。",
     "接着 s[0]='a' 与 s[2]='a' 相等 → k 前进到 1；s[1]='b' 与 s[3]='b' 相等 → k 前进到 2，j 到达末尾 4——表明 s[0:2] = \"ab\" 以周期 2 重复。",
     "内层结束后输出因子：i 从 0 走到 k=2，每次前进步长 j−k = 2，输出两个长度为 2 的因子，得到 [2, 2]，即 \"ab\" + \"ab\"。",
     "\"ab\" 确实是 Lyndon 词（小于旋转 \"ba\"），且序列非增。每个字符进出指针各常数次，总时间 O(n)。"
    ]
   }
  },
  "fm-index": {
   "brute": "先想暴力解：每来一个模式串，就在文本的每个对齐位置逐字符比对，单次查询 O(n·m)；要支持重复检测还得另存后缀数组等 O(n log n) 空间的结构，文本一大内存和时间都吃不消。关键观察是：把文本所有循环旋转排序后取末列得到 BWT，相同字符会聚簇；配合「严格小于某字符的行数」C 表与逐行累计的 Occ 表，模式串可以倒着逐字符把候选后缀区间夹逼出来——区间宽度就是出现次数，查询只需 |pattern| 次查表，空间接近压缩文本。",
   "bruteCode": "def brute(text, pattern):\n    n = len(text)\n    m = len(pattern)\n    return sum(1 for i in range(n - m + 1) if text[i:i + m] == pattern)",
   "walkthrough": {
    "input": "text = \"abab\"，pattern = \"ab\"",
    "steps": [
     "补上哨兵 $ 得 \"abab$\"，5 个循环旋转排序后为 [$abab, ab$ab, abab$, b$aba, bab$a]，取各行末字符得 BWT = \"bb$aa\"。",
     "首列 F 就是 BWT 排序结果 $aabb。C 表记录严格小于各字符的行数：$→0、a→1、b→3；Occ 表逐行累计 L 列中各字符的出现次数。",
     "反向匹配从模式末尾开始，先查 'b'：区间变为 [C[b]+Occ[0][b], C[b]+Occ[5][b]−1] = [3+0, 3+2−1] = [3, 4]——所有以 b 结尾的后缀行。",
     "再向前查 'a'：区间收缩为 [C[a]+Occ[3][a], C[a]+Occ[5][a]−1] = [1+0, 1+2−1] = [1, 2]，非空。",
     "出现次数 = 2−1+1 = 2：\"ab\" 在位置 0 和 2 各出现一次，返回 bwt=\"bb$aa\"、occurrences=2。朴素匹配每次 O(n·m)，FM-index 反向搜索只需 O(|pattern|) 次查表。"
    ]
   }
  },
  "dpll-sat": {
   "brute": "先想暴力解：给 n 个布尔变量枚举全部 2^n 组真值赋值，逐组代入所有子句检查是否全部满足；每多一个变量代价就翻倍，而且完全没利用子句里的局部信息。关键观察是：约束可以提前传播——只剩一个未满足文字的单位子句直接强制该文字取真；某变量在剩余子句中只以同一极性出现时，让它取该极性必然无害。这两步都能删子句、缩变量，删不动了才对一个变量做真假分支并回溯，这就是 DPLL 的传播 + 分支骨架。",
   "bruteCode": "def brute(num_vars, clauses):\n    from itertools import product\n    for values in product([False, True], repeat=num_vars):\n        ok = True\n        for clause in clauses:\n            sat = False\n            for lit in clause:\n                v = values[abs(lit) - 1]\n                if (lit > 0) == v:\n                    sat = True\n                    break\n            if not sat:\n                ok = False\n                break\n        if ok:\n            return list(values)\n    return None",
   "walkthrough": {
    "input": "num_vars = 3，clauses = [[1,2],[-1,2],[-2,3]]",
    "steps": [
     "三个子句 [x1∨x2]、[¬x1∨x2]、[¬x2∨x3]。暴力要枚举 2³ = 8 组赋值；DPLL 先传播后分支。",
     "纯文字消除：x3 在剩余子句中只以正形式出现，直接令 x3 = True，子句 [¬x2∨x3] 被满足删除，剩 [[1,2],[-1,2]]。",
     "无单位子句也无纯文字，进入分支：按序取 x1，先试 False。含 ¬x1 的子句被整体删除，含 x1 的子句 [x1∨x2] 删掉文字 x1 后缩成单位子句 [x2]。",
     "单位传播：x2 = True，删除 [x2] 后子句集为空 → 全部满足，得到赋值 x1=False、x2=True、x3=True。",
     "验证：[F∨T]=T、[T∨T]=T、[F∨T]=T，返回 satisfiable=True、assignment=[False, True, True]。8 组暴力枚举被压缩成一次纯文字消除加一次分支。"
    ]
   }
  },
  "ac3-constraint-propagation": {
   "brute": "先想暴力解：给每个变量枚举全部取值组合，逐一检查是否满足所有约束，找到一个就输出解。m 个变量、每域 d 个取值时组合多达 d 的 m 次方，指数增长，而且无解时也要扫完全部组合才能下结论。关键观察是：约束是局部的二元关系，不必等完整赋值——对弧 (x,y)，若 x 的候选值 a 在 y 的当前域里找不到任何兼容值，a 就可被立即删掉。AC-3 把所有弧放进队列反复做这种修订，直到没有值可删；某域被删空则直接宣告无解。",
   "bruteCode": "from itertools import product\n\n\ndef brute(data):\n    domains = [list(d) for d in data[\"domains\"]]\n    cons = [(int(x), int(y), {(int(a), int(b)) for a, b in pairs})\n            for x, y, pairs in data[\"constraints\"]]\n    for combo in product(*domains):\n        ok = True\n        for x, y, pairs in cons:\n            if (combo[x], combo[y]) not in pairs and (combo[y], combo[x]) not in pairs:\n                ok = False\n                break\n        if ok:\n            return True\n    return False",
   "walkthrough": {
    "input": "3 个变量 0、1、2 两两相邻，约束都是「取值不同」；初始域 D0={1}（已固定），D1={1,2}，D2={1,2}",
    "steps": [
     "先初始化队列：3 条约束各放入正反两个方向，共 6 条弧 (0,1),(1,0),(0,2),(2,0),(1,2),(2,1)。三个域共 1+2+2=5 个候选值。",
     "处理弧 (0,1)：D0 中的 1 在 D1 里有兼容值 2，不删；处理弧 (1,0)：D1 的 1 在 D0={1} 里找不到能与之不同的值，删掉 1，D1 变成 {2}。域发生变化，把弧 (2,1) 重新入队。",
     "处理弧 (0,2)：1 与 D2 里的 2 兼容，不删；处理弧 (2,0)：D2 的 1 在 D0={1} 里同样无兼容值，删掉，D2 变成 {2}，重新入队 (1,2)。",
     "处理弧 (1,2)：D1 的 2 需要在 D2={2} 中找一个与它不同的值，不存在，删除后 D1 变成空域。",
     "空域即无解，AC-3 立即返回 consistent=False，搜索还没开始矛盾就已暴露。全程只做了 3 次修订；暴力枚举 1×2×2=4 种组合也能得出同样结论，但规模一大指数组合就会爆炸。"
    ]
   }
  },
  "static-array": {
   "brute": "先想暴力解：把数据散乱存放，要找某个值或读某个位置时，只能从头逐格扫描比对，n 个元素最坏要比 n 次，时间 O(n)。关键观察是：静态数组把元素放进一段连续内存，元素地址 = 首地址 + 下标 × 元素字长，这个映射让按下标读写一步直达、O(1) 完成；更新也只是原地覆盖一个格子，不搬动其他元素。代价是长度固定、不能追加，而且按值查找仍需线性扫描。",
   "bruteCode": "def brute(values, target):\n    for i, x in enumerate(values):\n        if x == target:\n            return i\n    return -1",
   "walkthrough": {
    "input": "values = [10, 20, 30, 40]，依次执行：读下标 1，写下标 2 为 99，再读下标 2",
    "steps": [
     "数组占 4 个连续格子，下标 0..3。读下标 1：地址 = 首地址 + 1 × 元素字长，一步直达取出 20，全程没有比较和扫描。",
     "写下标 2 为 99：同样的常数寻址，把 30 原地覆盖成 99，其余 3 个格子不动，长度仍为 4。",
     "再读下标 2：直接读到新值 99。若改为按值找 40，就得从下标 0 一路比对到下标 3，4 次比较，O(n)。",
     "终态 values=[10, 20, 99, 40]，两次读和一次写各 O(1)。定长的代价也在这里：容量固定，不能追加第 5 个元素。"
    ]
   }
  },
  "matrix-2d-array": {
   "brute": "先想暴力解：把二维表格摊平成一维列表，靠人肉记住第 r 行第 c 列对应摊平后的哪个位置，访问一次要数一遍格子，既慢又容易错位。关键观察是：行主序存储下存在固定映射——线性地址 = r × 列数 + c，任何 (r,c) 都能一步换算成内存位置，读写都是 O(1)。二维数组由此把表格、图像和网格数据组织成可常数寻址的规则结构；要访问全部格子则需完整遍历，代价 O(rows × cols)。",
   "bruteCode": "def brute(matrix, target):\n    for r in range(len(matrix)):\n        for c in range(len(matrix[0])):\n            if matrix[r][c] == target:\n                return [r, c]\n    return None",
   "walkthrough": {
    "input": "matrix = [[1, 2, 3], [4, 5, 6]]（2 行 3 列），依次执行：读 (1,2)，写 (0,1) 为 9，再读 (0,1)",
    "steps": [
     "读 (1,2)：第 2 行第 3 列。行主序下线性地址 = r × 列数 + c = 1×3+2 = 5，即摊平后的第 6 个元素，取值 6，一步命中。",
     "写 (0,1) 为 9：换算地址 0×3+1 = 1，把 2 覆盖成 9，只动这一个单元格，其余 5 格不变。",
     "再读 (0,1)：直接读到新值 9。两次读、一次写都是 O(1)，靠的就是 r×cols+c 这个固定映射。",
     "终态 matrix=[[1, 9, 3], [4, 5, 6]]；要访问全部 2×3=6 个单元格则需 O(rows×cols) 的完整遍历。"
    ]
   }
  },
  "doubly-linked-list": {
   "brute": "先想暴力解：用数组存这串数据，中间插入或删除时，被操作位置之后的所有元素都要整体搬移一格，单次编辑 O(n)。关键观察是：编辑其实只发生在相邻节点之间——给每个节点同时挂上 prev 和 next 两个指针，插入或删除时只需重连前驱、新节点、后继这一小段引用，已知位置时 O(1) 完成，还能从尾往头反向遍历。代价是每个节点多存一个指针，且无法按下标直达访问。",
   "bruteCode": "def brute(ops):\n    values, outputs = [], []\n    for op in ops:\n        kind = op[0]\n        if kind == \"pushFront\":\n            values.insert(0, op[1])\n        elif kind == \"pushBack\":\n            values.append(op[1])\n        elif kind == \"popFront\":\n            outputs.append(values.pop(0) if values else None)\n        elif kind == \"popBack\":\n            outputs.append(values.pop() if values else None)\n        else:\n            outputs.append(op[1] in values)\n            if op[1] in values:\n                values.remove(op[1])\n    return outputs, values, values[::-1]",
   "walkthrough": {
    "input": "ops = [pushFront 2, pushBack 4, pushFront 1, popBack, remove 2]，初始只有头哨兵 H 和尾哨兵 T",
    "steps": [
     "pushFront 2：新节点的 prev 指 H、next 指原首节点（尾哨兵 T），再让 T.prev 和 H.next 回指它，链变成 H⇄2⇄T；头插只重连 4 处引用，不搬动任何已有元素。",
     "pushBack 4：接到尾部，变成 H⇄2⇄4⇄T；pushFront 1：接到头部，变成 H⇄1⇄2⇄4⇄T。两个方向的插入都是 O(1)。",
     "popBack：T.prev 是 4，把 4 的前驱 2 与尾哨兵直接互连后返回 4，链变成 H⇄1⇄2⇄T——尾删同样只动局部引用。",
     "remove 2：从 H 沿 next 扫描，在第 2 个有效节点命中 2，让前驱 1 与后继 T 直接互连，删除成功返回 True。",
     "终态 forward=[1]、backward=[1]：双向链表沿 prev 从尾往头也能走通；全程 outputs=[4, True]。"
    ]
   }
  },
  "circular-linked-list": {
   "brute": "先想暴力解：约瑟夫问题直接用数组模拟逐个报数——每报一个数就走一格并数一个存活者，数到第 k 个就删除它，再让后面元素整体前移补位。每轮报数 O(k)、删除挪动 O(n)，共 n-1 轮，总代价 O(n(n+k))。关键观察是：环形结构里「向前数 k 个人」可以直接用取模算出目标下标 pos=(pos+k-1) mod len，不必一格一格数；配合尾节点回头指向头的环形遍历，每轮只做一次定位加一次弹出。",
   "bruteCode": "def brute(n, k):\n    people = list(range(1, n + 1))\n    alive = [True] * n\n    order = []\n    i, remaining = 0, n\n    while remaining > 1:\n        count = 0\n        while True:\n            if alive[i]:\n                count += 1\n                if count == k:\n                    break\n            i = (i + 1) % n\n        order.append(people[i])\n        alive[i] = False\n        remaining -= 1\n        i = (i + 1) % n\n    survivor = next(people[j] for j in range(n) if alive[j])\n    return order, survivor",
   "walkthrough": {
    "input": "n = 5，k = 3：5 人围成环 [1, 2, 3, 4, 5]，从 1 开始报数，每数到第 3 个出列",
    "steps": [
     "起点 pos=0（元素 1）。第一轮定位 pos=(0+3-1) mod 5=2，出列 3，环剩 [1,2,4,5]，下一轮从被删位置继续（现在的下标 2，元素 4）。",
     "第二轮：pos=(2+2) mod 4=0，出列 1，环剩 [2,4,5]——元素 4 的下标从 2 绕回到 0，正是环形回绕。",
     "第三轮：pos=(0+2) mod 3=2，出列 5，环剩 [2,4]。",
     "第四轮：pos=(2+2) mod 2=0，出列 2，只剩 4。",
     "幸存者 survivor=4，出列顺序 order=[3,1,5,2]。每轮只做一次取模定位加一次弹出，而逐个报数每轮要走 k 步。"
    ]
   }
  },
  "binary-tree-basics": {
   "brute": "先想暴力解：想统计节点数、叶子数和高度，就把层序数组先翻译成一棵真正的节点对象树——为每个非空元素建节点、按规则连左右指针，建好后再做递归统计，建树本身要花 O(n) 时间和额外的指针空间。关键观察是：层序数组本身就是树的完整地址表——下标 i 的左孩子在 2i+1、右孩子在 2i+2，空位用 null 占位；用一个栈直接在数组上下走这组下标公式，不建树也能一遍完成全部统计。",
   "bruteCode": "def build(data, i=0):\n    if i >= len(data) or data[i] is None:\n        return None\n    return [data[i], build(data, 2 * i + 1), build(data, 2 * i + 2)]\n\n\ndef brute(data):\n    def count(node):\n        if node is None:\n            return 0, 0, 0\n        ln, ll, lh = count(node[1])\n        rn, rl, rh = count(node[2])\n        is_leaf = 1 if ln + rl == 0 else 0\n        return ln + rn + 1, ll + rl + is_leaf, max(lh, rh) + 1\n    nodes, leaves, height = count(build(data, 0))\n    return {\"nodes\": nodes, \"leaves\": leaves, \"height\": height}",
   "walkthrough": {
    "input": "层序数组 [\"A\", \"B\", \"C\", \"D\", \"E\", null, \"F\"]，下标 0..6",
    "steps": [
     "栈先压入根 (下标 0, 深度 1)。弹出后处理 A：非空，节点数=1，高度=1；左孩子下标 1、右孩子下标 2 都存在，把 (1,2) 和 (2,2) 压栈。",
     "弹出 (2,2) 处理 C：节点数=2，高度=2。C 的左孩子下标 5 是 null，右孩子下标 6 是 F，只有右孩子入栈 (6,3)。",
     "弹出 (6,3) 处理 F：深度 3，高度更新为 3；孩子下标 13、14 超出数组长度 7，F 是叶子，叶子数=1。",
     "弹出 (1,2) 处理 B：两个孩子 (3,3)、(4,3) 入栈；随后弹出 (4,3) 得 E、(3,3) 得 D，两者孩子下标都越界，叶子数累计到 3。",
     "终态 nodes=6（A,B,C,D,E,F）、leaves=3（D,E,F）、height=3。层序数组中下标 i 的孩子就是 2i+1 和 2i+2，null 占位直接跳过。"
    ]
   }
  },
  "n-ary-tree": {
   "brute": "先想暴力解：要回答「以 u 为根的子树有多少节点」，每次都从 u 出发把整棵子树遍历一遍计数，m 次查询最坏 O(n·m)；求某个节点的深度同样要反复从根往下追。关键观察是：这些量可以一次算完全树——先从根做一遍 BFS 得到层级顺序和每个节点的深度，再按「孩子先于父亲」的逆序把每个节点的子树规模累加到父亲身上，一遍 O(n) 同时得到所有节点的 depth 和 subtree_size。",
   "bruteCode": "def brute(parent, u):\n    children = {}\n    for i, p in enumerate(parent):\n        if p != -1:\n            children.setdefault(p, []).append(i)\n    stack, total = [u], 0\n    while stack:\n        node = stack.pop()\n        total += 1\n        stack.extend(children.get(node, []))\n    return total",
   "walkthrough": {
    "input": "parent = [-1, 0, 0, 1, 1, 2]：节点 0 的孩子是 1 和 2，1 的孩子是 3 和 4，2 的孩子是 5",
    "steps": [
     "parent[i]=-1 的节点 0 是根。由 parent 数组建孩子表：children[0]=[1,2]，children[1]=[3,4]，children[2]=[5]。",
     "从根做 BFS：依次出队 0、1、2、3、4、5，访问顺序 order=[0,1,2,3,4,5]；深度 depth[0]=0，depth[1]=depth[2]=1，depth[3]=depth[4]=depth[5]=2。",
     "子树规模按逆序 [5,4,3,2,1,0] 累加，保证先算完孩子再算父亲：3 个叶子 size[3]=size[4]=size[5]=1。",
     "处理 5：size[2] 加 1 变成 2；处理 4：size[1] 变成 2；处理 3：size[1] 变成 3。",
     "处理 2：size[0] 加 2 变成 3；处理 1：size[0] 加 3 变成 6。终态 subtree_size=[6,3,2,1,1,1]——整棵树 6 个节点，节点 1 的子树有 3 个节点，节点 2 的子树有 2 个节点。"
    ]
   }
  },
  "set-map-adt": {
   "brute": "先想暴力解：用无序列表维护元素——add 前先从头扫一遍查重，remove 先找到再删除补位，contains 线性扫描，每次操作 O(n)，m 次操作累计 O(n·m)。关键观察是：成员判断只需要「在/不在」的答案，不需要保持顺序——用哈希表实现集合，插入、删除、查询平均都只要 O(1)，重复插入也会被唯一性语义自动挡住，这正是去重、计数和索引类问题的基础设施。",
   "bruteCode": "def brute(ops):\n    values, queries = [], []\n    for kind, x in ops:\n        if kind == \"add\":\n            if x not in values:\n                values.append(x)\n        elif kind == \"remove\":\n            if x in values:\n                values.remove(x)\n        else:\n            queries.append(x in values)\n    return queries, sorted(values)",
   "walkthrough": {
    "input": "ops = [add 1, add 2, add 2, contains 2, remove 1, contains 1]，从空集合开始",
    "steps": [
     "add 1：集合变 {1}；add 2：集合变 {1,2}。",
     "再次 add 2：集合语义保证元素唯一，{1,2} 原样不动——重复插入是无操作，大小仍为 2。",
     "contains 2：哈希定位一步命中，返回 True；同样的查询在无序列表上要从头逐个比对。",
     "remove 1：删除后集合变 {2}；即使删除不存在的键（discard 语义）也不报错。",
     "contains 1：返回 False。终态 values=[2]、queries=[True, False]，每个操作只付一次哈希查找的代价。"
    ]
   }
  },
  "open-addressing-hash-table": {
   "brute": "先想暴力解：把所有键塞进一个无序列表，插入直接追加，查询从头逐个比对，n 个键每次查询 O(n)。关键观察是：若能由键直接「算出」它的存储位置，就不必逐个比对——开放寻址用 key mod 容量算出首选槽位，冲突时在同一个数组里向后逐格线性探测找空位；查询沿完全相同的探测序列走，中途遇到空槽即可断定键不存在，整个过程不需要任何链式节点。",
   "bruteCode": "def brute(ops):\n    keys, outputs = [], []\n    for kind, key in ops:\n        if kind == \"insert\":\n            if key not in keys:\n                keys.append(key)\n        else:\n            outputs.append(key in keys)\n    return outputs, keys",
   "walkthrough": {
    "input": "size = 7，ops = [insert 10, insert 17, insert 24, query 24, query 3]，散列函数 key mod 7",
    "steps": [
     "插入 10：10 mod 7=3，槽位 3 为空，直接放入，table[3]=10。",
     "插入 17：17 mod 7=3，槽位 3 已被 10 占用，线性探测下一格；槽位 4 为空，放入 table[4]=17。",
     "插入 24：24 mod 7=3，沿 3→4→5 探测，前两格都被占用，槽位 5 为空放入。此时表为 [·,·,·,10,17,24,·]，负载因子 3/7≈0.43。",
     "查询 24：从槽位 3 出发走与插入相同的探测序列 3→4→5，第三步命中，返回 True。",
     "查询 3：3 mod 7=3，探测槽位 3、4、5 都不是 3，走到槽位 6 遇到 None——探测链断开，说明 3 从未插入，返回 False。"
    ]
   }
  },
  "graph-representations": {
   "brute": "先想暴力解：想知道 u 和 v 是否相邻，就拿着这对顶点把整张边列表从头扫一遍，无向图每条边还要正反两个方向都试一遍，单次判断 O(E)。关键观察是：按节点把边分组存成邻接表，判断相邻只需查看 u 的邻居集合；若换成 V×V 的邻接矩阵，matrix[u][v] 一步命中，但空间从 O(V+E) 涨到 O(V²)——稀疏图选邻接表，稠密图或需要 O(1) 查边时才值得用矩阵。",
   "bruteCode": "def brute(edges, u, v):\n    for a, b in edges:\n        if (a, b) == (u, v) or (b, a) == (u, v):\n            return True\n    return False",
   "walkthrough": {
    "input": "无向图 edges = [[A,B], [B,C], [C,D]]，4 个节点 A、B、C、D，3 条边",
    "steps": [
     "边列表只存 3 条边，空间 O(V+E)=O(4+3)。开始逐条转换：读入边 (A,B)，无向图双向登记——A 的邻居集合加入 B，B 的集合加入 A。",
     "读入边 (B,C)：B 的邻居集合变 {A,C}，C 的集合变 {B}。",
     "读入边 (C,D)：C 的集合变 {B,D}，D 的集合变 {C}。",
     "最终邻接表：A→[B]，B→[A,C]，C→[B,D]，D→[C]，每个节点按字母序输出邻居。",
     "此时判断 (A,D) 是否相邻只需看 A 的邻居表（空手而回即否），边列表则要正反扫 3 条边；若改用 4×4 邻接矩阵，16 格里只有 6 格非空（3 条边各占两格），稀疏时空间浪费明显。"
    ]
   }
  },
  "string-builder": {
   "brute": "先想暴力解：用不可变字符串做连续编辑——每次追加都新建一个完整字符串：先复制旧串全部 n 个字符，再接上新片段。连续追加、插入、删除 m 次，每次复制量正比当前长度，总代价 O(n²)，明明只改了一小段却要整串搬家。关键观察是：编辑过程的中间结果没人关心，应该用可变缓冲区攒着——容量不够时才一次性扩容搬家，尾部追加摊还 O(1)，只有中间插删需要移动部分字符。",
   "bruteCode": "def brute(ops):\n    result = \"\"\n    for op in ops:\n        kind = op[0]\n        if kind == \"append\":\n            result = result + op[1]\n        elif kind == \"insert\":\n            pos = int(op[1])\n            result = result[:pos] + op[2] + result[pos:]\n        elif kind == \"delete\":\n            pos, length = int(op[1]), int(op[2])\n            result = result[:pos] + result[pos + length:]\n    return result",
   "walkthrough": {
    "input": "ops = [append \"ab\", append \"cd\", insert(1, \"X\"), delete(2, 2), charAt(1)]，缓冲区从空开始",
    "steps": [
     "append \"ab\"：缓冲区变 \"ab\"；append \"cd\"：写到尾部变 \"abcd\"。追加只碰尾部，容量不够才扩容搬家，摊还 O(1)。",
     "insert(1, \"X\")：位置 1 之后的 \"bcd\"（3 个字符）整体后移一格腾出空位，写入 X，缓冲区变 \"aXbcd\"——中间插入要搬 n-pos 个字符，O(n)。",
     "delete(2, 2)：把下标 2、3 的字符 \"bc\" 覆盖掉，其后的 \"d\" 前移，缓冲区变 \"aXd\"，同样是 O(n)。",
     "charAt(1)：按下标直接读出 \"X\"，O(1)。终态 final=\"aXd\"、outputs=[\"X\"]。",
     "同样的 4 次编辑若用不可变字符串，每次都要分配并复制完整新串；缓冲区只在扩容时整体搬一次家。"
    ]
   }
  },
  "array-operations": {
   "brute": "先想暴力解：把数组当成不可变值来用，每次插入、删除都新建一个完整数组、把全部元素逐个复制到新数组里再返回副本。n 个元素每次操作复制 O(n) 格，m 次操作累计 O(n·m)，即使只有末尾变化也要全量复制。关键观察是：连续内存支持原地更新——插入只需把受影响的后缀整体右移一格，删除只需左移补位，读写下标永远 O(1)；移动量取决于操作位置，只有中间插删才需要 O(n)。",
   "bruteCode": "def brute(values, operations):\n    current = list(values)\n    for op in operations:\n        if op[0] == \"append\":\n            current = current + [op[1]]\n        elif op[0] == \"insert\":\n            i = op[1]\n            current = current[:i] + [op[2]] + current[i:]\n        elif op[0] == \"set\":\n            current = list(current)\n            current[op[1]] = op[2]\n        else:\n            i = op[1]\n            current = current[:i] + current[i + 1:]\n    return current",
   "walkthrough": {
    "input": "values = [1, 2, 3, 4, 5]，依次执行 insert(1, 9)、set(3, 7)、delete(0)、append(6)",
    "steps": [
     "insert(1, 9)：下标 1..4 的 4 个元素（2,3,4,5）整体右移一格腾位，写入 9，得 [1,9,2,3,4,5]——中间插入 O(n)。",
     "set(3, 7)：下标直接寻址，把该位置的 3 覆盖成 7，得 [1,9,2,7,4,5]，其余元素不动，O(1)。",
     "delete(0)：删除首元素 1，其后 4 个元素（9,2,7,4,5）整体左移补位，得 [9,2,7,4,5]——头部删除同样 O(n)。",
     "append(6)：写到尾部得 [9,2,7,4,5,6]，容量足够时不搬任何元素，摊还 O(1)。",
     "整轮共搬动 4+4=8 个元素位置，而两次寻址读写 0 次搬动——连续存储换来 O(1) 随机访问，代价是中间插删必须移动后缀。"
    ]
   }
  },
  "binary-search-boundaries": {
   "brute": "先想暴力解：从左到右扫一遍记下第一个等于 target 的下标，继续扫到最后一个再记下；重复数据多或目标不存在时最坏要扫满 O(n) 个元素。关键观察是：数组非递减，「第一个 ≥ target 的位置」具有单调性——mid 处小于 target 则答案必在右侧，否则在含 mid 的左侧，可二分求出 lower bound；右边界不必另写一套判断，它等于 lower(target+1)-1，复用同一个函数即可。",
   "bruteCode": "def brute(nums, target):\n    first = last = -1\n    for i, x in enumerate(nums):\n        if x == target:\n            if first == -1:\n                first = i\n            last = i\n    return [first, last]",
   "walkthrough": {
    "input": "nums = [1, 2, 2, 2, 4, 5, 5, 8]，target = 2",
    "steps": [
     "先求 lower bound（第一个 ≥ 2 的位置），半开区间 [0,8)：mid=4，nums[4]=4 ≥ 2 → right=4；mid=2，nums[2]=2 ≥ 2 → right=2；mid=1，nums[1]=2 ≥ 2 → right=1；mid=0，nums[0]=1 < 2 → left=1。区间闭合，返回下标 1。",
     "nums[1]=2 确认目标存在。再求第一个 ≥ 3 的位置：mid=4，nums[4]=4 ≥ 3 → right=4；mid=2，nums[2]=2 < 3 → left=3；mid=3，nums[3]=2 < 3 → left=4，返回 4。",
     "右边界 = 4-1 = 3，答案 [1, 3]，区间长 3-1+1=3，正好对应 3 个重复的 2。",
     "两次二分共比较 4+3=7 次，而线性查找最坏要扫全部 8 个元素；n 越大差距越大，且找右边界复用了同一个 lower 函数，不用为右边界单独写判断。"
    ]
   }
  },
  "merge-intervals": {
   "brute": "先想暴力解：不排序，任取两条区间检查是否重叠（含端点相邻），重叠就合并成一条并重复整个过程，直到再也合不动为止；每轮合并都要两两比较，最坏 O(n²) 甚至更高。关键观察是：按左端点排序后，能与当前段合并的区间必然紧随其后出现——一次线性扫描，每步只和最后一个已合并段的右端比较：左端不大于右端+1 就扩展右端，否则新开一段，总复杂度由排序主导，O(n log n)。",
   "bruteCode": "def brute(intervals):\n    boxes = [list(iv) for iv in intervals]\n    changed = True\n    while changed:\n        changed = False\n        for i in range(len(boxes)):\n            for j in range(i + 1, len(boxes)):\n                a, b = boxes[i], boxes[j]\n                if a[0] <= b[1] + 1 and b[0] <= a[1] + 1:\n                    boxes[i] = [min(a[0], b[0]), max(a[1], b[1])]\n                    boxes.pop(j)\n                    changed = True\n                    break\n            if changed:\n                break\n    return sorted(boxes)",
   "walkthrough": {
    "input": "intervals = [[1,3], [2,6], [7,7], [8,10], [15,18]]",
    "steps": [
     "先按左端点排序（本例已有序）。扫描开始：merged=[[1,3]]。",
     "[2,6]：左端 2 不大于末段右端 3+1=4，重叠相接，右端扩为 max(3,6)=6，merged=[[1,6]]，没有新开段。",
     "[7,7]：左端 7 不大于 6+1=7，与当前段紧邻，右端扩为 max(6,7)=7，merged=[[1,7]]——此实现把端点相差 1 的相邻区间也合并。",
     "[8,10]：左端 8 不大于 7+1=8，继续并入，merged=[[1,10]]；[15,18]：左端 15 > 10+1=11，与当前段断开，新开一段。",
     "终态 [[1,10], [15,18]]：排序 O(n log n) 主导，扫描阶段每条区间只和最后一个已合并段比较一次，线性完成。"
    ]
   }
  },
  "frequency-counting": {
   "brute": "先想暴力解：对每个不同的值都从头扫一遍数组、数它出现的次数，k 个不同值就要扫 k 遍，O(n·k)，同样的元素被一遍遍重复比较。关键观察是：一遍扫描就足够——用哈希计数表把「值 → 次数」记下来，每个元素只做一次哈希查找加一次自增，O(1) 更新；首次出现的值顺带记进顺序表，就能按出现顺序输出计数结果，总体 O(n)。",
   "bruteCode": "def brute(data):\n    distinct = []\n    for x in data:\n        if x not in distinct:\n            distinct.append(x)\n    return [[x, data.count(x)] for x in distinct]",
   "walkthrough": {
    "input": "data = [3, 1, 3, 2, 3, 1]",
    "steps": [
     "读入 3：首次出现，counts={3:1}，同时记入首次出现顺序表。",
     "读入 1：新元素，counts={3:1, 1:1}；再读入 3：老元素，counts[3] 自增为 2，顺序表不动。",
     "读入 2：counts={3:2, 1:1, 2:1}；再读入 3：counts[3]=3。",
     "读入末尾的 1：counts[1]=2。每个元素只做一次哈希查找加一次自增，O(1)。",
     "按首次出现顺序输出 [[3,3], [1,2], [2,1]]，众数是出现 3 次的 3；若先排序再分组统计，要多付 O(n log n)。"
    ]
   }
  },
  "matrix-traversal": {
   "brute": "先想暴力解：螺旋序最直接的写法是维护方向序列（右、下、左、上循环）逐格走，每走一步都查「下一格是否越界或已访问过」，还要配一张 visited 标记表——每个格子多一次查询，多一份 O(rows×cols) 的标记空间。关键观察是：螺旋每走一圈恰好消耗掉矩阵的一条外边——用 top/bottom/left/right 四个边界收缩，走完一条边就收一条，天然不越界、不重复，根本不需要 visited 表。",
   "bruteCode": "def brute(matrix):\n    if not matrix:\n        return []\n    rows, cols = len(matrix), len(matrix[0])\n    visited = set()\n    dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]\n    result = []\n    r = c = d = 0\n    for _ in range(rows * cols):\n        result.append(matrix[r][c])\n        visited.add((r, c))\n        nr, nc = r + dirs[d][0], c + dirs[d][1]\n        if not (0 <= nr < rows and 0 <= nc < cols) or (nr, nc) in visited:\n            d = (d + 1) % 4\n            nr, nc = r + dirs[d][0], c + dirs[d][1]\n        r, c = nr, nc\n    return result",
   "walkthrough": {
    "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]，order = spiral；边界初始 top=0, bottom=2, left=0, right=2",
    "steps": [
     "第一圈顶行：matrix[0][0..2] 取 1,2,3，top 收缩为 1；右列：行 1..2 的 matrix[·][2] 取 6,9，right 收缩为 1。",
     "底行（右→左）：右边界已收到 1，取 matrix[2][0..1] 逆序即 8,7，bottom 收缩为 1；左列（下→上）：只剩行 1 的 matrix[1][0]=4，left 收缩为 1。",
     "第二圈：top=bottom=1、left=right=1，顶行只取 matrix[1][1]=5，top 变 2；随后右列区间为空，且 top<=bottom、left<=right 已不成立，循环结束。",
     "螺旋序 [1,2,3,6,9,8,7,4,5]；同一矩阵按行序是 [1,2,3,4,5,6,7,8,9]，按列序是 [1,4,7,2,5,8,3,6,9]。",
     "三种顺序都恰好访问每格一次，O(rows×cols)，额外空间 O(1)——边界收缩方案不需要 visited 标记表。"
    ]
   }
  },
  "preorder-traversal": {
   "brute": "先想暴力解：先把层序数组翻译成节点对象——为每个非空元素建节点、按 2i+1 和 2i+2 连上左右指针，建树要花 O(n) 时间和额外指针空间，然后才能在对象上做根-左-右递归。关键观察是：层序数组本身就是树的地址表，下标 i 的孩子在 2i+1、2i+2——直接对下标递归即可：先记录当前节点，再递归左子树、右子树，树根本不必建出来。",
   "bruteCode": "def build(data, i=0):\n    if i >= len(data) or data[i] is None:\n        return None\n    return [data[i], build(data, 2 * i + 1), build(data, 2 * i + 2)]\n\n\ndef brute(data):\n    result = []\n\n    def visit(node):\n        if node is None:\n            return\n        result.append(node[0])\n        visit(node[1])\n        visit(node[2])\n\n    visit(build(data, 0))\n    return result",
   "walkthrough": {
    "input": "层序数组 [1, 2, 3, null, 4]：根 1，左孩子 2，右孩子 3；2 的左孩子是空（下标 3），右孩子是 4",
    "steps": [
     "visit(0)：先访问根，输出 1，随即递归左子树 visit(1)——前序次序是根、左、右。",
     "visit(1)：输出 2，递归左孩子 visit(3)：下标 3 是 null 占位，直接返回；再递归右孩子 visit(4)。",
     "visit(4)：输出 4；它的孩子下标 9、10 超出数组长度 5，两个递归都返回，节点 2 的子树处理完毕。",
     "回到根，递归右子树 visit(2)：输出 3；孩子下标 5、6 越界，返回。",
     "终态 [1, 2, 4, 3]：根最先输出，然后整个左子树（2 及其后代），最后右子树——复制树、序列化都用这个顺序。"
    ]
   }
  },
  "inorder-traversal": {
   "brute": "先想暴力解：想拿到二叉搜索树里的有序序列，可以把所有节点的值收集起来再排序，O(n log n)。关键观察是：BST 满足「左子树 < 根 < 右子树」，而中序遍历的访问顺序恰好是左、根、右——所以中序遍历天然输出升序序列，只需 O(n)。",
   "bruteCode": "def brute(root):\n    vals = []\n    def collect(node):\n        if node:\n            vals.append(node.val)\n            collect(node.left)\n            collect(node.right)\n    collect(root)\n    return sorted(vals)",
   "walkthrough": {
    "input": "BST：根为 2，左孩子 1，右孩子 3",
    "steps": [
     "从根 2 开始：中序规则是「先整棵左子树，再自己，再整棵右子树」，于是先递归进入左孩子 1。",
     "节点 1 没有左子树，输出 1；1 也没有右子树，这个子树处理完，回到 2。",
     "轮到根自己，输出 2；随后递归进入右孩子 3。",
     "节点 3 无左子树，输出 3；无右子树，遍历结束。",
     "得到序列 [1, 2, 3]，恰好升序。这不是巧合：BST 的「左 < 根 < 右」与中序的访问顺序一一对应，所以中序 = 有序。"
    ]
   }
  },
  "postorder-traversal": {
   "brute": "先想暴力解：不用递归、用显式栈模拟——每个节点带着「孩子是否已处理」的标记进栈，栈顶未处理就把自己打上标记重新压回，再压右孩子、左孩子；弹到带标记的节点才真正输出。每个节点进出栈各两次，标记管理繁琐易错。关键观察是：递归调用栈天然就是这个标记栈——函数的返回点恰好等价于打标记，直接对下标递归（左、右、根）即可，代码量减半。",
   "bruteCode": "def brute(data):\n    result = []\n    stack = [(0, False)]\n    while stack:\n        index, done = stack.pop()\n        if index >= len(data) or data[index] is None:\n            continue\n        if done:\n            result.append(data[index])\n        else:\n            stack.append((index, True))\n            if 2 * index + 2 < len(data) and data[2 * index + 2] is not None:\n                stack.append((2 * index + 2, False))\n            if 2 * index + 1 < len(data) and data[2 * index + 1] is not None:\n                stack.append((2 * index + 1, False))\n    return result",
   "walkthrough": {
    "input": "层序数组 [1, 2, 3, 4, 5]：完全二叉树，根 1，孩子 2、3，2 的孩子 4、5",
    "steps": [
     "visit(0) 一路向左：先递归 visit(1)，再递归 visit(3)——节点 4 的孩子下标 7、8 越界，它是叶子。",
     "叶子 4 没有孩子可等，最先写入结果 [4]。回到节点 2，递归右孩子 visit(4) 写入 5；左右都完成，节点 2 才写入，得 [4, 5, 2]。",
     "回到根，递归右子树 visit(2)：节点 3 的孩子下标 5、6 越界，直接写入 3，得 [4, 5, 2, 3]。",
     "根 1 的左右子树全部处理完，最后写入 1，终态 [4, 5, 2, 3, 1]。",
     "后序保证父节点永远排在其孩子之后——释放树、按子树自底向上汇总统计值用的正是这个顺序。"
    ]
   }
  },
  "level-order-traversal": {
   "brute": "先想暴力解：想按层输出就一层一层来——先求出树高 h，然后对每一层做一次完整 DFS，只收集深度恰好等于该层的节点，h 层就要重复遍历 h 遍，O(n·h)。关键观察是：先进先出的队列天然按层产出节点——出队一个就把它的孩子入队，队列里始终只堆着相邻一两层的下标，一次遍历 O(n) 完成，队列峰值宽度即树的最大宽度 O(w)。",
   "bruteCode": "def brute(data):\n    result = []\n\n    def collect(index, depth, wanted):\n        if index >= len(data) or data[index] is None:\n            return\n        if depth == wanted:\n            result.append(data[index])\n        collect(2 * index + 1, depth + 1, wanted)\n        collect(2 * index + 2, depth + 1, wanted)\n\n    level = 0\n    while True:\n        before = len(result)\n        collect(0, 0, level)\n        if len(result) == before:\n            break\n        level += 1\n    return result",
   "walkthrough": {
    "input": "层序数组 [1, 2, 3, null, 4, null, 5]：根 1，孩子 2、3；2 的左孩子空、右孩子 4；3 的左孩子空、右孩子 5",
    "steps": [
     "队列初始只有根下标 [0]。弹出 0：输出 1，把两个孩子下标 1、2 入队，队列 [1, 2]。",
     "弹出 1：输出 2，孩子下标 3、4 原样入队（空占位也入队，出队时再判）；弹出 2：输出 3，入队 5、6。此时队列 [3, 4, 5, 6]，第 1 层完成。",
     "弹出 3：null，跳过；弹出 4：输出 4，入队下标 9、10；弹出 5：null 跳过；弹出 6：输出 5。此时输出 [1, 2, 3, 4, 5]，第 2 层完成。",
     "队列剩余 9、10、13、14 全部越界，弹出时逐个跳过，队列为空，结束。",
     "终态 [1, 2, 3, 4, 5]：先入先出让第 0 层全部出队后第 1 层才开始，同层节点保持从左到右的顺序；队列峰值长度 4，对应最宽层的宽度。"
    ]
   }
  },
  "tree-properties": {
   "brute": "先想暴力解：判断平衡时对每个节点单独调用一次 height()——递归数它整棵子树的高度，再检查左右高度差是否 ≤ 1。每个节点求高度都要重走整棵子树，链状树退化时总代价 O(n²)。关键观察是：求高度的后序遍历本来就访问过每个节点——把平衡检查合并进同一次递归的返回值，让 (高度, 是否平衡) 一起向上传递，一遍 O(n) 就能同时得到两个量。",
   "bruteCode": "def height(data, i):\n    if i >= len(data) or data[i] is None:\n        return 0\n    return max(height(data, 2 * i + 1), height(data, 2 * i + 2)) + 1\n\n\ndef brute(data):\n    balanced = True\n    for i, value in enumerate(data):\n        if value is not None and abs(height(data, 2 * i + 1) - height(data, 2 * i + 2)) > 1:\n            balanced = False\n    return {\"height\": height(data, 0), \"balanced\": balanced}",
   "walkthrough": {
    "input": "层序数组 [1, 2, null, 3]：根 1，左孩子 2，右孩子为空；2 的左孩子是 3（下标 3）——一棵向左偏斜的树",
    "steps": [
     "后序先算最深处：inspect(3) 是叶子节点 3，两个孩子下标 7、8 越界，返回 (高度 1, 平衡)。",
     "inspect(1) 处理节点 2：左子树返回 (1, True)，右子树下标 4 越界返回 (0, True)；节点 2 高度 = max(1,0)+1 = 2，左右高度差 1 ≤ 1，平衡。",
     "inspect(2) 对应根的右孩子：下标 2 是 null 占位，直接返回 (0, True)。",
     "inspect(0) 处理根 1：左子树高度 2，右子树高度 0；根高度 = max(2,0)+1 = 3。",
     "平衡检查：|2 - 0| = 2 > 1，条件不成立，balanced=False。终态 {height: 3, balanced: False}——一次后序遍历同时送回两个量，无需对每个节点重复求高度。"
    ]
   }
  },
  "connected-components": {
   "brute": "先想暴力解：对每个顶点各做一次全图遍历，记录从它出发可达的顶点集合，再把可达集合相同的顶点归并成一组。n 个顶点要跑 n 次遍历，时间 O(V·(V+E))，同一个连通块被反复扫描。关键观察：无向图的可达关系是等价关系，一次遍历就能染完整个连通块，因此外层只需在遇到未访问顶点时再启动一次 DFS，每个顶点和每条边都只处理一次。",
   "bruteCode": "def brute(nodes, edges):\n    graph = {u: [] for u in nodes}\n    for a, b in edges:\n        graph[a].append(b)\n        graph[b].append(a)\n    reach = {}\n    for u in nodes:\n        seen, stack = {u}, [u]\n        while stack:\n            x = stack.pop()\n            for v in graph[x]:\n                if v not in seen:\n                    seen.add(v)\n                    stack.append(v)\n        reach[u] = seen\n    components, assigned = [], set()\n    for u in nodes:\n        if u in assigned:\n            continue\n        comp = sorted(reach[u])\n        components.append(comp)\n        assigned.update(comp)\n    return components",
   "walkthrough": {
    "input": "6 个节点 0–5，边 (0,1)、(1,2)、(3,4)，节点 5 无任何边",
    "steps": [
     "初始 seen 为空。按升序从节点 0 启动：seen={0}，栈 [0]。",
     "弹出 0 加入分量，邻居 1 未访问，seen={0,1}、栈 [1]；弹出 1，邻居 2 未访问，seen={0,1,2}、栈 [2]。",
     "弹出 2，其唯一邻居 1 已访问，栈空，得到第一个分量 [0,1,2]。",
     "继续扫描到节点 3，仍未访问，启动第二次搜索，沿边 (3,4) 得到分量 [3,4]。",
     "节点 5 没有任何边，单独构成第三个分量 [5]。启动搜索的次数 3 就是连通分量数；每个顶点、每条边只入栈和检查一次，时间 O(V+E)。"
    ]
   }
  },
  "undirected-cycle-detection": {
   "brute": "先想暴力解：逐条边做实验——暂时删掉这条边，用 DFS 检查它的两个端点是否仍然连通；仍连通说明它躺在某个环上。每条边一次遍历，总时间 O(E·(V+E))。关键观察：不断加边的森林最多 n-1 条边，一旦某条边的两端在加入前就已同属一个集合，这条边必然闭合一个环——用并查集维护集合，逐边查根、合并即可，这正是 solution.py 的做法。",
   "bruteCode": "def brute(n, edges):\n    def connected(u, v, skip):\n        adj = [[] for _ in range(n)]\n        for i, (a, b) in enumerate(edges):\n            if i == skip:\n                continue\n            adj[a].append(b)\n            adj[b].append(a)\n        seen, stack = {u}, [u]\n        while stack:\n            x = stack.pop()\n            if x == v:\n                return True\n            for y in adj[x]:\n                if y not in seen:\n                    seen.add(y)\n                    stack.append(y)\n        return False\n    for i in range(len(edges)):\n        if connected(edges[i][0], edges[i][1], i):\n            return True\n    return False",
   "walkthrough": {
    "input": "n = 4，边按顺序 (0,1)、(1,2)、(2,0)、(2,3)",
    "steps": [
     "初始 parent=[0,1,2,3]，每个节点自成一个集合。",
     "边 (0,1)：两端根分别为 0 和 1，不在同一集合，合并，parent[0]=1。",
     "边 (1,2)：根分别为 1 和 2，合并，parent[1]=2。此时 0、1、2 已同属根为 2 的集合。",
     "边 (2,0)：find(2)=2；find(0) 沿 parent[0]=1、parent[1]=2 追到根 2。两端根相同——0 和 2 早已连通，这条边把已有路径闭合成环，返回 True，剩下的边 (2,3) 无需再查。",
     "3 个节点连成一棵树只需 2 次成功合并，第 3 条边一出现即触发判环：n 个节点的无环图最多 n-1 条边，因此逐边查根合并能在近似 O(E) 的时间内完成判定。"
    ]
   }
  },
  "directed-cycle-detection": {
   "brute": "先想暴力解：枚举每个起点 s，从 s 出发做 DFS，看能否沿有向边绕回 s；能绕回就存在环。每个起点一次遍历，O(V·(V+E))，同一子图被重复扫了 V 遍。关键观察：环上的顶点在一次 DFS 中恰好还留在当前递归路径上，因此只需区分「当前路径上的灰色点」和「已完成的黑色点」——遇到指向灰色点的边即为返祖边，一次遍历就能判环。",
   "bruteCode": "def brute(n, edges):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n    for s in range(n):\n        seen, stack = {s}, [s]\n        while stack:\n            x = stack.pop()\n            for y in adj[x]:\n                if y == s:\n                    return True\n                if y not in seen:\n                    seen.add(y)\n                    stack.append(y)\n    return False",
   "walkthrough": {
    "input": "n = 4，边按顺序 (0,1)、(1,2)、(2,3)、(3,1)",
    "steps": [
     "初始 color=[0,0,0,0] 全白。从节点 0 启动 dfs(0)，0 染灰；出边 0→1 指向白色节点，递归 dfs(1)。",
     "1、2、3 相继染灰，灰色顶点恰好构成当前递归路径 0→1→2→3。",
     "检查 3 的出边 3→1：1 是灰色，说明它还在递归栈中，1 沿树边能走回 3，这条返祖边闭合有向环 1→2→3→1，立即返回 True。",
     "若这条边指向的是黑色顶点（全部后继已检查完），则不能作为环证据——只有灰色目标才算返祖边。",
     "全部顶点染黑且从未遇到灰色目标时才返回 False；每个顶点、每条边只处理一次，时间 O(V+E)。"
    ]
   }
  },
  "bipartite-check": {
   "brute": "先想暴力解：枚举每个顶点划入 A 组还是 B 组的全部 2^n 种分法，逐一验证每条边是否恰好跨组，存在合法分法才是二分图，指数级组合爆炸。关键观察：一个顶点的颜色一旦确定，它所有邻居的颜色就被迫相反，颜色沿边传播是被唯一决定的——从任一顶点出发 BFS 交替染色即可，遇到同色相邻边就是冲突，完全无需枚举分组。",
   "bruteCode": "from itertools import product\n\ndef brute(n, edges):\n    for bits in product((0, 1), repeat=n):\n        if all(bits[u] != bits[v] for u, v in edges):\n            return True\n    return False",
   "walkthrough": {
    "input": "n = 3，边 (0,1)、(1,2)、(2,0)，构成三角形",
    "steps": [
     "初始 color=[-1,-1,-1]。从节点 0 启动 BFS，color[0]=0，队列 [0]。",
     "弹出 0：邻居 1、2 均未染色，染成相反颜色 color[1]=1、color[2]=1，队列 [1,2]。",
     "弹出 1：邻居 0 的颜色 0 与当前色 1 不同，无冲突；但邻居 2 的颜色是 1，与当前节点 1 同色。",
     "边 (1,2) 两端同为颜色 1，无法分成两组且每条边跨组——三角形是奇环，返回 False。",
     "若图中只有偶环，交替染色总能顺利完成；算法还会对每个未染色的连通块重新启动 BFS，保证不漏任何孤立部分。"
    ]
   }
  },
  "flood-fill": {
   "brute": "先想暴力解：对每个与起点同色的格子单独做一次 DFS，判断它是否与起点连通，连通才改色。网格共 R×C 格，最坏每格一次遍历，O((R×C)²)，大量格子被重复访问。关键观察：与起点连通是一个整体性质，从起点出发一次扩散就能覆盖整个同色连通块，每个格子入队一次即可，BFS 逐层染色一遍完成。",
   "bruteCode": "def brute(image, sr, sc, new):\n    rows, cols = len(image), len(image[0])\n    old = image[sr][sc]\n    result = [row[:] for row in image]\n\n    def connected(r, c):\n        stack, seen = [(r, c)], {(r, c)}\n        while stack:\n            x, y = stack.pop()\n            if (x, y) == (sr, sc):\n                return True\n            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                nx, ny = x + dx, y + dy\n                if 0 <= nx < rows and 0 <= ny < cols and (nx, ny) not in seen and image[nx][ny] == old:\n                    seen.add((nx, ny))\n                    stack.append((nx, ny))\n        return False\n\n    for r in range(rows):\n        for c in range(cols):\n            if image[r][c] == old and connected(r, c):\n                result[r][c] = new\n    return result",
   "walkthrough": {
    "input": "3×3 图像 [[2,2,3],[2,2,3],[3,3,3]]，起点 (0,0)，新颜色 5",
    "steps": [
     "起点 (0,0) 的旧色为 2，先改成 5 并入队；若新旧颜色相同则直接原样返回，避免死循环。队列 [(0,0)]。",
     "弹出 (0,0)：下邻 (1,0)、右邻 (0,1) 都是旧色 2，改成 5 入队；上、左越界。队列 [(1,0),(0,1)]。",
     "弹出 (1,0)：下邻 (2,0) 改 5 入队，右邻 (1,1) 改 5 入队。队列 [(0,1),(2,0),(1,1)]。",
     "弹出 (0,1)：下邻 (1,1) 已是 5，不再是旧色 2，跳过——入队时立即改色保证每格至多入队一次。",
     "弹出 (2,0)、(1,1)：邻格要么已是 5、要么是颜色 3，无新格。最终 [[5,5,3],[5,5,3],[3,3,3]]，颜色 3 的区域不受影响；每格至多进出队列一次，O(rows×cols)。"
    ]
   }
  },
  "grid-search": {
   "brute": "先想暴力解：用 DFS 枚举从起点到终点的所有不重复路径，记录最短的一条；网格一大路径数就指数增长，大量绕路被白算。关键观察：每步代价相同且为 1，BFS 按距离分层扩展——队列中第 k 层的格子到起点的步数恰为 k，所以第一次碰到终点的路径一定最短，根本不需要比较任何候选路径。",
   "bruteCode": "def brute(grid, start, target):\n    rows, cols = len(grid), len(grid[0])\n    best = [None]\n\n    def dfs(r, c, steps, visited):\n        if (r, c) == (target[0], target[1]):\n            if best[0] is None or steps < best[0]:\n                best[0] = steps\n            return\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and (nr, nc) not in visited:\n                visited.add((nr, nc))\n                dfs(nr, nc, steps + 1, visited)\n                visited.remove((nr, nc))\n\n    dfs(start[0], start[1], 0, {(start[0], start[1])})\n    return -1 if best[0] is None else best[0]",
   "walkthrough": {
    "input": "3×3 网格 [[0,0,0],[1,1,0],[0,0,0]]，1 为障碍，起点 (0,0)，终点 (2,2)",
    "steps": [
     "起点入队为 (0,0) 步数 0 并标记已访问，队列 [(0,0,0)]。",
     "弹出 (0,0,0)：下邻 (1,0) 是障碍 1，跳过；右邻 (0,1) 可通行且未访问，入队 (0,1,1)。",
     "弹出 (0,1,1)：下邻 (1,1) 是障碍；右邻 (0,2) 入队，步数 2。",
     "弹出 (0,2,2)：下邻 (1,2) 入队，步数 3。",
     "弹出 (1,2,3)：下邻 (2,2) 正是终点，返回 3+1=4。BFS 逐层扩展，第一次碰到终点的步数就是最少步数；若队列耗尽仍未碰到终点则返回 -1。"
    ]
   }
  },
  "naive-string-search": {
   "brute": "先想暴力解：枚举文本的所有子串（O(n²) 个）逐一与模式串比较，绝大多数长度都对不上却仍被构造和检查，最坏 O(n²·m)。关键观察：模式长度固定为 m，候选对齐位置只有 n-m+1 个，逐个窗口比较即可；本实现就是这种朴素滑动窗口，最坏每窗比满 m 个字符，KMP 则进一步利用已比较过的信息避免窗口回退。",
   "bruteCode": "def brute(text, pattern):\n    n, m = len(text), len(pattern)\n    for i in range(n):\n        for j in range(i + 1, n + 1):\n            if text[i:j] == pattern:\n                return i\n    return -1",
   "walkthrough": {
    "input": "text = ababcabc（长 8），pattern = abc（长 3）",
    "steps": [
     "start=0：截取 text[0:3]=aba 与 abc 逐位比较：a=a、b=b，第三位 a≠c，失配。",
     "start=1：窗口 bab，第一位 b≠a，立即失配。",
     "start=2：窗口 text[2:5]=abc，三位全部相等，命中，返回起点 2。",
     "共检查 3 个窗口、比较 7 个字符（3+1+3）。",
     "最坏情况如 text=aaaa、pattern=aaab：每个窗口都要比满 m 个字符才知道失配，总代价 O((n-m+1)·m)；扫描完没有命中则返回 -1。"
    ]
   }
  },
  "palindrome-check": {
   "brute": "先想暴力解：先把字符串规范化——过滤掉非字母数字并统一小写，构造一个新串，再反转一份逐位比较（或直接判断 s == s[::-1]）。时间 O(n) 但额外空间 O(n)。关键观察：反转串的第 i 位就是原串第 n-1-i 位，比较 rev[i] 与 s[i] 等价于比较 s[i] 与 s[n-1-i]，用双指针原地向中间收缩即可，整个清洗副本都可以省掉。",
   "bruteCode": "def brute(s):\n    cleaned = [c.lower() for c in s if c.isalnum()]\n    return cleaned == cleaned[::-1]",
   "walkthrough": {
    "input": "s = No 'x' in Nixon（长度 15，含空格与引号）",
    "steps": [
     "left=0 的 N 对 right=14 的 n：都是字母，忽略大小写后 n=n，相等，两指针各进一格。",
     "left=1 的 o 对 right=13 的 o，相等；接着 left=2、3 是空格和引号，被内层循环跳过，left 停在 4 的 x。",
     "right=12 也是 x，比较通过。left 再跳过引号和空格走到 7 的 i，与 right=11 的 i 相等。",
     "left=8 的 n 对 right=10 的 N，忽略大小写相等。随后 left=9、right=9 相遇，循环结束，返回 True。",
     "全程只扫一遍字符串 O(n)，跳过非字母数字的动作发生在指针移动中，不需要构造清洗后的副本，额外空间 O(1)。"
    ]
   }
  },
  "anagram-check": {
   "brute": "先想暴力解：把两个字符串分别排序后逐位比较，「listen」与「silent」都变成「eilnst」，相同即为变位词。排序代价 O(n log n + m log m)，而字符的顺序信息在这里其实是多余的。关键观察：变位词只要求每个字符的出现次数完全一致，用计数表（哈希）分别统计两边频率再逐项比较即可，时间降为 O(n+m)。",
   "bruteCode": "def brute(a, b):\n    return sorted(a) == sorted(b)",
   "walkthrough": {
    "input": "a = listen，b = silent（各 6 个字母）",
    "steps": [
     "统计 a=listen：l、i、s、t、e、n 各出现 1 次，得到计数表 {l:1, i:1, s:1, t:1, e:1, n:1}。",
     "统计 b=silent：同样是这 6 个字母各 1 次，两张计数表的键与值完全一致。",
     "逐项比较：6 个键相同、每个键的出现次数相同，判定为变位词，返回 True。",
     "若把 b 换成 silents，则 b 的计数表中 s 出现 2 次，与 a 的 s:1 不符，返回 False；两串长度不同时计数表必然不等，无需单独判断。",
     "建表与比较共 O(n+m)，哈希表空间 O(k)，k 为不同字符数；暴力排序比较则是 O(n log n + m log m)。"
    ]
   }
  },
  "longest-common-prefix": {
   "brute": "先想暴力解：先求最短串长 m，再从最长的候选开始，对每个长度 L 截取第一个串的前 L 个字符，逐一检查其余串是否都以它开头，全部通过才返回。不同 L 的检查互不复用，最坏 O(n·m²)。关键观察：公共前缀不会超过任意一个串，可以拿第一个串当候选前缀逐个串校验，失配就砍掉末字符收缩，总比较字符数为 O(S)。",
   "bruteCode": "def brute(strs):\n    if not strs:\n        return ''\n    m = min(len(s) for s in strs)\n    for length in range(m, 0, -1):\n        candidate = strs[0][:length]\n        if all(s.startswith(candidate) for s in strs):\n            return candidate\n    return ''",
   "walkthrough": {
    "input": "三个单词 flower、flow、flight，长度分别为 6、4、6",
    "steps": [
     "取第一个单词 flower 作为初始前缀 prefix。",
     "与 flow 比较：flow 不以 flower 开头，砍掉末字符成 flowe，仍不匹配；再砍成 flow，此时 flow 以 flow 开头，前缀暂定为 flow。",
     "与 flight 比较：flight 不以 flow 开头（第 3 个字符 o≠i），砍成 flo 仍不匹配，再砍成 fl，flight 以 fl 开头，匹配。",
     "所有单词处理完，返回公共前缀 fl。",
     "每次失配砍一个字符，最多砍最短串长那么多次；若中途砍成空串，说明没有公共前缀，立即返回空串。"
    ]
   }
  },
  "recursion-call-stack": {
   "brute": "先想暴力解：用循环从 1 乘到 n 累乘出 n!，O(n) 时间 O(1) 空间，答案正确但完全看不出「问题如何分解」。关键观察：n! = n × (n-1)!，把 (n-1)! 交给同一个函数自己处理，未完成的乘法挂在调用栈上，基例 rec(0)=1 终止下探后逐层回乘——递归的入栈与出栈自动完成了表达式的展开和结果的合并。",
   "bruteCode": "def brute(n):\n    result = 1\n    for k in range(2, n + 1):\n        result *= k\n    return result",
   "walkthrough": {
    "input": "n = 4，mode = factorial，计算 4!",
    "steps": [
     "调用 rec(4)：4≠0，先记下「4 × rec(3) 的结果」再挂起，转入 rec(3)。调用数 1，栈深 1。",
     "rec(3)、rec(2)、rec(1)、rec(0) 依次入栈，每层都在等下一层的结果，栈深一路涨到 5。",
     "rec(0) 命中基例 k==0，直接返回 1，不再产生新调用——这是唯一无需继续展开的情况。",
     "返回阶段反向合并：rec(1)=1×1=1，rec(2)=2×1=2，rec(3)=3×2=6，rec(4)=4×6=24，每层算完立即出栈。",
     "最终 value=24，总调用 5 次（n+1 次），最大栈深 5（同样是 n+1）：未完成状态全部保存在栈帧里，递归过深就会栈溢出。"
    ]
   }
  },
  "fibonacci-memoization": {
   "brute": "先想暴力解：直接按定义写朴素递归 fib(n)=fib(n-1)+fib(n-2)，基例 fib(0)=0、fib(1)=1。同一子问题被指数次重复求解，仅算 fib(6) 就要 25 次调用，时间 O(φⁿ)。关键观察：本质上不同的子问题只有 n+1 个，把每个首次算出的 fib(k) 存进缓存，再次遇到直接返回，重复计算被彻底消除，时间降到 O(n)。",
   "bruteCode": "def brute(n):\n    if n <= 1:\n        return n\n    return brute(n - 1) + brute(n - 2)",
   "walkthrough": {
    "input": "n = 6，缓存初始为 {0:0, 1:1}",
    "steps": [
     "调用 fib(6)：缓存中没有，需要 fib(5)+fib(4)，先递归 fib(5)，链条继续下探。",
     "下探到 fib(2)：向缓存查 fib(1)=1 和 fib(0)=0，命中后得 fib(2)=1+0=1 并写入缓存。",
     "回升时全部命中缓存：fib(3)=1+1=2，fib(4)=2+1=3，fib(5)=3+2=5，每个值首次算出即入缓存。",
     "fib(6)=fib(5)+fib(4)=5+3=8，返回 8。整个过程只有 7 次函数调用，每个 fib(k) 恰好真正计算一次。",
     "朴素递归算 fib(6) 需要 25 次调用（c(n)=c(n-1)+c(n-2)+1，c(6)=25），重复子问题指数增长；缓存把 O(2ⁿ) 压到 O(n)，代价是 O(n) 缓存空间。"
    ]
   }
  },
  "climbing-stairs": {
   "brute": "先想暴力解：递归枚举每一步「跨 1 阶还是跨 2 阶」的所有走法，ways(n)=ways(n-1)+ways(n-2)，重叠子问题被指数级重复计算。关键观察：到达第 n 阶的最后一步要么从第 n-1 阶跨 1 步、要么从第 n-2 阶跨 2 步，方案数就是这两个子问题之和，只需按阶递推、滚动保留最近两个值即可，无需任何递归。",
   "bruteCode": "def brute(n):\n    if n <= 1:\n        return 1\n    return brute(n - 1) + brute(n - 2)",
   "walkthrough": {
    "input": "n = 5",
    "steps": [
     "状态是滚动对 (previous, current)，初始 (1, 1)：到达第 0 阶和第 1 阶各有 1 种走法。",
     "迭代 1 次得 (1, 2)：到第 2 阶 = 从第 1 阶跨 1 步 + 从第 0 阶跨 2 步 = 1+1=2 种。",
     "继续滚动：(2, 3)、(3, 5)、(5, 8)，每个新值都是前两个之和，f(3)=2+1=3、f(4)=3+2=5、f(5)=5+3=8。",
     "循环 5 轮后返回 previous=8，即到第 5 阶共 8 种走法。",
     "相比朴素递归把重叠子问题算指数遍，这里每个 f(k) 只算一次，且只保留最近两个值，时间 O(n)、空间可优化到 O(1)。"
    ]
   }
  },
  "grid-path-dp": {
   "brute": "先想暴力解：从起点 DFS 枚举所有「右或下」的路径，遇障碍回溯，走到终点才把计数加一。路径数是组合数量级，无障碍时也有 C(rows+cols-2, rows-1) 条，网格一大就指数爆炸。关键观察：到某格的路径数 = 到上格的路径数 + 到左格的路径数，子问题高度重叠，按行递推填表，每个格子只需计算一次。",
   "bruteCode": "def brute(grid):\n    rows, cols = len(grid), len(grid[0])\n    count = [0]\n\n    def dfs(r, c):\n        if grid[r][c] == 1:\n            return\n        if (r, c) == (rows - 1, cols - 1):\n            count[0] += 1\n            return\n        if r + 1 < rows:\n            dfs(r + 1, c)\n        if c + 1 < cols:\n            dfs(r, c + 1)\n\n    dfs(0, 0)\n    return count[0]",
   "walkthrough": {
    "input": "3×3 网格 [[0,0,0],[0,1,0],[0,0,0]]，1 为障碍，从 (0,0) 走到 (2,2)",
    "steps": [
     "一维 dp 按行滚动，dp[c] 表示走到当前行第 c 列的路径数。初始 dp=[1,0,0]，起点本身有 1 种到达方式；若起点是障碍直接返回 0。",
     "第 0 行无障碍：col1 加上左侧 dp[0] 得 1，col2 加上左侧得 1，dp=[1,1,1]——顶行只能一路向右。",
     "第 1 行：(1,0) 保持 1；(1,1) 是障碍，dp[1] 清零；(1,2)=上方 1+左侧 0=1，dp=[1,0,1]。",
     "第 2 行：(2,0) 保持 1；(2,1)=0+1=1；(2,2)=上方 1+左侧 1=2，dp=[1,1,2]。",
     "返回 dp[-1]=2：绕开中心障碍只有「先右后下」和「先下后右」两条路。dp[c] 更新前的值是上一行同列（上方），更新后是本行左侧（左方），滚动数组把空间压到 O(cols)。"
    ]
   }
  },
  "permutation-generation": {
   "brute": "先想暴力解：枚举全部 n^n 个长为 n 的序列，过滤出不含重复元素的，最后还要去重——n=3 时要检查 27 个序列才留下 6 个排列，O(n^n) 做了大量无用功。关键观察：某个位置一旦用过某元素就不该再选它，用 used 数组在「选择前」剪枝，搜索树从 n^n 个分支直接缩到 n! 个，配合「递归后撤销」恢复现场。",
   "bruteCode": "from itertools import product\n\ndef brute(nums):\n    n = len(nums)\n    found = set()\n    for seq in product(nums, repeat=n):\n        if len(set(seq)) == n:\n            found.add(seq)\n    return [list(s) for s in sorted(found)]",
   "walkthrough": {
    "input": "nums = [1, 2, 3]",
    "steps": [
     "先把 nums 排序为 [1,2,3]，used 全为 False，路径 current=[]，从 backtrack 顶层开始。",
     "选 1（used=[True,False,False]）→ 选 2 → 选 3：current=[1,2,3] 达到长度 3，记录第一个排列 [1,2,3]。",
     "回溯撤销 3、再撤销 2，回到只剩 [1] 的层，改选 3：current=[1,3]，再补 2 得 [1,3,2]。",
     "回溯到顶层改选 2、3，同理得到 [2,1,3]、[2,3,1]、[3,1,2]、[3,2,1]，共 3!=6 个排列，按字典序输出。",
     "「选择→递归→撤销」保证 used 与 current 在分支之间互不污染；元素有重复时，排序加跳过规则可避免重复排列。每个排列花 O(n) 复制输出，总时间 O(n·n!)，递归深度 n。"
    ]
   }
  },
  "combination-generation": {
   "brute": "先想暴力解：生成全部 n! 个排列，对每个排列取前 k 个元素、排序后去重收集——n=4、k=2 时先生成 24 个排列，最终只留下 6 个组合，O(n!·k) 做了大量重复功。关键观察：组合无序，只要规定「从小到大选」，每次递归从上一次选中值加 1 开始，顺序重复的组合从一开始就不会被生成。",
   "bruteCode": "from itertools import permutations\n\ndef brute(n, k):\n    seen = set()\n    for p in permutations(range(1, n + 1), k):\n        seen.add(tuple(sorted(p)))\n    return [list(c) for c in sorted(seen)]",
   "walkthrough": {
    "input": "n = 4，k = 2，从 1..4 中选 2 个数",
    "steps": [
     "backtrack(1)：current=[]，候选从 1 开始。选 1 得 current=[1]，递归 backtrack(2)。",
     "在 [1] 这层依次选 2、3、4：得到 [1,2]、[1,3]、[1,4]，每个长度达到 k=2 就记录并撤销。",
     "回到顶层改选 2：递归从 3 开始，得 [2,3]、[2,4]；再改选 3：得 [3,4]。",
     "选 4 时递归 backtrack(5) 已无候选，且剪枝条件 n-start+1=0 < k-len(current)=2 直接返回。",
     "起始下标只增不减，组合内部天然升序，[2,1] 这类顺序重复根本不会生成；共 C(4,2)=6 个组合，每个花 O(k) 复制输出，递归深度 O(k)。"
    ]
   }
  },
  "subset-enumeration": {
   "brute": "先想暴力解：对每个元素做「选或不选」的二叉决策递归，2^n 个叶子各对应一个子集，这本身就是 O(n·2ⁿ) 的输出下界。关键观察：幂集恰好是所有大小为 0..n 的组合之并，按大小 k 分层、用「起始下标递增」的组合模板逐层枚举，天然无重复，输出按大小分组且组内有序。",
   "bruteCode": "def brute(n):\n    results = []\n\n    def dfs(value, chosen):\n        if value > n:\n            results.append(chosen[:])\n            return\n        dfs(value + 1, chosen)\n        chosen.append(value)\n        dfs(value + 1, chosen)\n        chosen.pop()\n\n    dfs(1, [])\n    return results",
   "walkthrough": {
    "input": "n = 3，集合 {1, 2, 3}",
    "steps": [
     "外层让 k 从 0 到 3 逐个生成大小为 k 的子集：k=0 直接记录空集 []。",
     "k=1：backtrack(1) 从 1 到 3 各选一个，得 [1]、[2]、[3]。",
     "k=2：选 1 后从 2 起配对，得 [1,2]、[1,3]；选 2 后从 3 起，得 [2,3]。",
     "k=3：1、2、3 依次必选，得 [1,2,3]。合计 1+3+3+1=8=2³ 个子集，各大小数量恰为杨辉三角的一行。",
     "起始下标递增天然排除乱序重复，因此不需要 used 数组；输出按大小分组、组内字典序，总时间 O(n·2ⁿ)，递归深度 O(n)。"
    ]
   }
  },
  "parentheses-generation": {
   "brute": "先想暴力解：枚举全部 2^(2n) 个由左右括号组成的序列（n=3 时 64 个），逐个校验「任意前缀中右括号不多于左括号，且总数相等」，通过才收集，O(2^(2n)·n)。关键观察：合法序列的每个前缀都满足约束，与其生成后再校验，不如把约束当作生成时的剪枝——左括号没用完才能放 (，右括号数少于左括号才能放 )，非法前缀根本不会被构造。",
   "bruteCode": "from itertools import product\n\ndef brute(n):\n    def valid(seq):\n        balance = 0\n        for ch in seq:\n            balance += 1 if ch == '(' else -1\n            if balance < 0:\n                return False\n        return balance == 0\n\n    return [''.join(seq) for seq in product('()', repeat=2 * n) if valid(seq)]",
   "walkthrough": {
    "input": "n = 3，生成 3 对括号的全部合法序列",
    "steps": [
     "从 backtrack(0,0) 出发，规则是 open<3 可放 (、close<open 才可放 )。先一路放左括号到「(((」，状态 (3,0)。",
     "此后只能放 )：依次得「((()」、「((())」、「((()))」，长度达 6，记录第一个合法序列 ((()))。",
     "回溯到只剩「((」的层改放 ) 得「(()」，状态 (2,1)：先放 ( 走到「(()(」(3,1)，再连放两个 ) 得「(()())」；这一层改放 ) 则得「(())」(2,2)，再补 () 得「(())()」。",
     "回溯到「(」层改放 ) 得「()」(1,1)：补 (( 再收尾得「()(())」；或先放 ) 得「()()」，再补 () 得「()()()」。",
     "两条规则本身就是剪枝：非法前缀如「())」不会被构造出来，无需生成后再校验。共 5 个序列，恰为第 3 个 Catalan 数 C₃=5，递归深度 O(n)。"
    ]
   }
  },
  "parentheses-matching": {
   "brute": "先想暴力解：反复扫描字符串，每轮把相邻的成对括号「()」「[]」「{}」删掉，直到某一轮删不动为止，最后看是否删空。每轮 O(n)、最多 O(n) 轮，总 O(n²)。关键观察：最先能确定配对的一定是「最近一个尚未匹配的开括号」，这正是栈的后进先出——开括号压栈，闭括号弹栈比对，一遍扫描即可完成。",
   "bruteCode": "def brute(s):\n    prev = None\n    while prev != s:\n        prev = s\n        for pair in ('()', '[]', '{}'):\n            s = s.replace(pair, '')\n    return s == ''",
   "walkthrough": {
    "input": "s = {[()]}（长度 6）",
    "steps": [
     "逐字符扫描：{、[、( 都是开括号，依次压栈，栈从底到顶为 { [ (。",
     "遇到 )：弹出栈顶 (，与 pairs[)] 要求的 ( 相同，配对成功，栈剩 { [。",
     "] 弹出 [ 配对成功，} 弹出 { 配对成功，栈被清空。",
     "扫描结束且栈为空，返回 True——两个条件缺一不可：中途配错立即 False，扫完栈里还剩开括号（如输入 (( ）也是 False。",
     "若输入是 ([)]：遇到 ) 时栈顶是 [，弹出后与 ( 不符，立即返回 False。栈的后进先出恰好对应「最近的未匹配开括号最先闭合」。"
    ]
   }
  },
  "activation-functions": {
   "brute": "先想暴力解：把激活计算当成逐个手算——对每个输入 x 分别独立调用公式求 ReLU、Leaky ReLU、Sigmoid、Tanh 各一份结果。关键观察：激活是逐元素运算，元素之间无耦合，一次线性扫描 O(n) 就能全部算完；真正决定网络表达能力的是各函数的非线性形状与导数行为（饱和区梯度趋零），这也是 ReLU 常被选作默认激活的原因。",
   "bruteCode": "import math\n\ndef brute(values):\n    output = []\n    for x in values:\n        relu = max(0.0, x)\n        leaky = x if x > 0 else 0.1 * x\n        sigmoid = 1.0 / (1.0 + math.exp(-x))\n        tanh = math.tanh(x)\n        output.append([relu, leaky, sigmoid, tanh])\n    return output",
   "walkthrough": {
    "input": "values = [-1, 0, 2]",
    "steps": [
     "对每个 x 依次计算三个激活值，按行输出 [ReLU, Sigmoid, Tanh]。",
     "x=-1：ReLU=max(0,-1)=0；Sigmoid=1/(1+e)≈0.268941；Tanh≈-0.761594，两者已偏离中心、梯度开始衰减（Sigmoid 导数约 0.20，Tanh 约 0.42）。",
     "x=0：ReLU=0；Sigmoid=1/(1+1)=0.5，Tanh=0，都在中心点；此处 Sigmoid 导数最大为 0.25，Tanh 导数最大为 1。",
     "x=2：ReLU 原样输出 2，正区间不压缩；Sigmoid=1/(1+e⁻²)≈0.880797，Tanh≈0.964028，都趋近上界 1、进入饱和区。",
     "三个函数对同一输入一次线性扫描即可全部算完 O(n)；ReLU 无饱和且计算最省，Sigmoid/Tanh 有界但两端梯度趋零——这正是深层网络常选 ReLU 的原因。"
    ]
   }
  },
  "perceptron-classifier": {
   "brute": "学习一条分类直线，最直接的暴力是网格搜索：把 w₁、w₂、b 各取一串候选值，三重循环穷举所有组合，每组参数都在全部样本上数分对的个数，留下最好的那组。三维网格各取一百个值就有上百万组组合，再乘上样本数 n，维度一升就指数爆炸，精度还被网格步长卡死。关键观察是：根本不用搜——每个误分类样本自己指出改进方向，err = 标签 - 预测，权重与偏置沿 err×样本坐标挪一小步，这正是感知机更新规则。",
   "bruteCode": "def brute(points):\n    best = None\n    for w1 in [x / 10 for x in range(-50, 51)]:\n        for w2 in [x / 10 for x in range(-50, 51)]:\n            for b in [x / 10 for x in range(-50, 51)]:\n                correct = sum(1 for px, py, lb in points\n                              if (1 if w1 * px + w2 * py + b > 0 else 0) == lb)\n                if best is None or correct > best[0]:\n                    best = (correct, w1, w2, b)\n    return best",
   "walkthrough": {
    "input": "二维样本 (2, 0) 标签 1、(-2, 0) 标签 0，学习率 0.1，权重初始 w=(0, 0)、b=1",
    "steps": [
     "初始 w₁=0、w₂=0、b=1，对任何输入都有 z=1>0，一律预测 1。第一个样本 (2, 0)：z=0×2+0×0+1=1，pred=1 与标签一致，err=0，权重不动。",
     "第二个样本 (-2, 0)：z=1>0，pred=1 但标签是 0，err=-1。更新：w₁=0+0.1×(-1)×(-2)=0.2，b=1-0.1=0.9，决策边界 x=-b/w₁=-4.5 开始向负样本方向移动。",
     "第二轮：样本 (2, 0) 的 z=0.2×2+0.9=1.3，预测正确；(-2, 0) 的 z=0.2×(-2)+0.9=0.5>0 仍误判，再次更新 w₁=0.4、b=0.8。",
     "第三轮：(2, 0) 的 z=0.4×2+0.8=1.6 正确；(-2, 0) 的 z=0.4×(-2)+0.8=0，不满足 z>0，pred=0 与标签一致。本轮零更新，训练提前停止，最终 w=(0.4, 0)、b=0.8，边界恰在 x=-2，两个样本全部分对。",
     "学习只用了 3 轮 2 次更新，每轮成本 O(nd)；网格搜索要在三维参数空间评估上百万组组合。误分类样本本身就是最好的老师，这正是监督学习更新规则的最小体现。"
    ]
   }
  },
  "neural-network-forward-pass": {
   "brute": "不设隐藏层的暴力方案是直接学一个线性映射 y = Wx + b，一步从输入跳到输出。它参数最少、算得最快，但无论怎么调权重，输出都只能是输入的线性函数，连异或这种最简单的非线性问题都分不对。关键观察是：把多个线性变换叠起来、层与层之间夹一个非线性激活，前一层输出作为后一层输入逐层前传，网络就能组合出弯曲的决策面，这正是前向传播要做的事。",
   "bruteCode": "def brute(x, w, b):\n    return [sum(wi * xi for wi, xi in zip(row, x)) + bi for row, bi in zip(w, b)]",
   "walkthrough": {
    "input": "x=(1, 2)，隐藏层 2 个 ReLU 神经元（W₁=[[1,-1],[0.5,1]]，b₁=(0,-0.5)），输出层 1 个 sigmoid 神经元（W₂=[[1,0.5]]，b₂=(-1)）",
    "steps": [
     "隐藏神经元 1 先算加权和：z=1×1+(-1)×2+0=-1；经 ReLU 后负值被截断，a₁=0，这个神经元熄灭。",
     "隐藏神经元 2：z=0.5×1+1×2+(-0.5)=2，ReLU(2)=2。隐藏层激活为 (0, 2)，此刻才轮到输出层计算——后一层只能读前一层已确定的输出。",
     "输出神经元把隐藏激活加权求和：z=1×0+0.5×2+(-1)=0。",
     "sigmoid(0)=0.5，网络输出概率 0.5。对比一下：若没有 ReLU 截断、a₁ 保留 -1，输出将是 sigmoid(1×(-1)+0.5×2-1)=sigmoid(-1)≈0.269——非线性激活正是多层网络表达力的来源。",
     "整个前向传播就是两次矩阵-向量乘加，约 2×2+2×1=6 次乘法，复杂度 O(Σ nₗ₋₁nₗ)；输入维度上千时，这个数字就是百万级乘加，GPU 并行的对象正是它。"
    ]
   }
  },
  "backpropagation": {
   "brute": "要梯度，最直接的暴力是有限差分：把每个参数扰动 ±ε 各跑一次前向传播，用 (L(w+ε)-L(w-ε))/(2ε) 近似导数。p 个参数每轮就要 2p 次前向，百万参数的网络等于每步多做百万次前向，代价无法承受，ε 的取值还会引入数值误差。关键观察是：损失本身是一张计算图，梯度可以沿图反向、用链式法则逐层复用中间结果——一次反向传播就拿到全部参数的梯度，成本与一次前向同阶。",
   "bruteCode": "def brute(loss, params, eps=1e-4):\n    grads = []\n    for i in range(len(params)):\n        hi = params[:i] + [params[i] + eps] + params[i + 1:]\n        lo = params[:i] + [params[i] - eps] + params[i + 1:]\n        grads.append((loss(hi) - loss(lo)) / (2 * eps))\n    return grads",
   "walkthrough": {
    "input": "单神经元链 x=1，隐藏层 w₁=2、b₁=0（ReLU），输出层 w₂=1、b₂=-2（sigmoid），标签 y=1，学习率 1",
    "steps": [
     "前向：h=ReLU(2×1+0)=2；输出 z=1×2+(-2)=0，sigmoid(0)=0.5。预测 0.5 离标签 1 还差一半，损失 MSE=(0.5-1)²/2=0.125。",
     "输出层梯度：d=(o-y)·o·(1-o)=(0.5-1)×0.5×0.5=-0.125——预测误差乘上 sigmoid 的局部导数，链式法则把它合成一个数。",
     "先用 d 更新输出层：w₂=1-1×(-0.125)×2=1.25，b₂=-2-(-0.125)=-1.875。",
     "再回传隐藏层：责任=d×w₂=-0.125×1=-0.125，ReLU 门控 h=2>0 让它原样通过；更新 w₁=2-1×(-0.125)×1=2.125，b₁=0-(-0.125)=0.125。",
     "用新参数再前向：h=2.125×1+0.125=2.25，z=1.25×2.25-1.875=0.9375，预测升到 sigmoid(0.9375)≈0.719，更接近标签 1。一次反传拿到全部 4 个参数的梯度，成本与一次前向同阶；有限差分则要为每个参数多做两次前向。"
    ]
   }
  },
  "optimizer-comparison": {
   "brute": "找损失最小点的暴力做法是网格搜索：把每个参数的取值区间切成密网格，逐点算损失、取最小者。一维取一千个点还行，p 维就是一千的 p 次方次评估，指数爆炸；精度也永远卡在网格步长上，谷底落在两格之间就错过。关键观察是：可导损失的梯度 g 指出局部最陡上坡方向，沿 -g 迈一小步就在下坡；再把历史更新方向累积成动量，就能在狭长峡谷里走得更快更稳。",
   "bruteCode": "def brute(f, lo, hi, n=10000):\n    best_x, best_f = None, None\n    for i in range(n + 1):\n        x = lo + (hi - lo) * i / n\n        fx = f(x)\n        if best_f is None or fx < best_f:\n            best_x, best_f = x, fx\n    return best_x, best_f",
   "walkthrough": {
    "input": "一维损失面 f(x)=(x-3)²，起点 x=0，SGD 学习率 0.1，Momentum 系数 0.9，各走 3 步，最优点在 x=3",
    "steps": [
     "SGD 第一步：g=2×(0-3)=-6，x=0-0.1×(-6)=0.6。",
     "SGD 后两步：g(0.6)=2×(0.6-3)=-4.8，x=0.6+0.48=1.08；g(1.08)=-3.84，x=1.08+0.384=1.464。每一步只看当前梯度，节奏均匀。",
     "Momentum 第一步：v=0.9×0+0.1×(-6)=-0.6，x=0-(-0.6)=0.6，与 SGD 相同。",
     "Momentum 后两步：g=-4.8，v=0.9×(-0.6)+0.1×(-4.8)=-1.02，x=0.6+1.02=1.62——连续同向梯度把速度越推越大；g(1.62)=-2.76，v=0.9×(-1.02)+0.1×(-2.76)=-1.194，x=1.62+1.194=2.814。",
     "3 步后 SGD 停在 1.464，损失 (1.464-3)²≈2.36；Momentum 停在 2.814，损失 (2.814-3)²≈0.03。动量把同向梯度累积成惯性，收敛快得多；两种优化器每步都是 O(p)，Momentum 额外存一份速度，空间 O(p)。"
    ]
   }
  },
  "convolutional-neural-network": {
   "brute": "想识别图像里的局部图案，暴力做法是全连接：把 3×3 图像展平成 9 维，每个输出独立连接全部输入，9 个输出就是 81 个互不相干的权重；图案平移几个像素就得重学一遍，图像再大一点输入维度直接变，参数量跟着爆炸。关键观察是：局部图案在哪里出现都长一样——让同一组小卷积核滑过所有位置、逐窗口做乘加，权重共享、天然抗平移，这就是卷积。",
   "bruteCode": "def brute(inp, w, b):\n    flat = [v for row in inp for v in row]\n    return [sum(wi * xi for wi, xi in zip(row, flat)) + bi for row, bi in zip(w, b)]",
   "walkthrough": {
    "input": "3×3 输入 [[1,1,0],[1,1,0],[1,1,0]]（左两列亮、右列暗），2×2 卷积核 [[1,-1],[1,-1]]，无填充",
    "steps": [
     "valid 卷积输出 (3-2+1)×(3-2+1)=2×2，共 4 个窗口位置，每个窗口做 2×2=4 次乘加。",
     "左上窗口取输入的 [[1,1],[1,1]]：s=1×1+1×(-1)+1×1+1×(-1)=0——窗口内左右两列同亮，没有边缘。",
     "右上窗口取 [[1,0],[1,0]]：s=1×1+0×(-1)+1×1+0×(-1)=2——左亮右暗，垂直边缘被点亮。",
     "下排两个窗口与上排完全相同，输出特征图 [[0,2],[0,2]]：亮区内部响应 0，亮暗交界的垂直边缘响应最大。",
     "同一个核扫遍全部 (H-K+1)² 个位置（权重共享），时间 O(HWKCᵢCₒ)；换成全连接要 9×4=36 个独立权重，且图案挪个位置就得重学。卷积用少量共享参数换来了空间泛化。"
    ]
   }
  },
  "recurrent-neural-network": {
   "brute": "处理变长序列的暴力做法是把整条序列拼成一个长向量，喂给输入维度等于序列长度的全连接层。参数量被最大长度绑死，短序列要补零凑长；换个长度就得换一套参数，同一个词出现在第 3 步还是第 7 步，对网络来说是两个毫无关系的输入位。关键观察是：时间步之间的规律是同一套——用同一个单元滚动，每步把上一步的隐藏状态 hₜ₋₁ 与新输入 xₜ 一起映射成 hₜ，序列长度就不再受限。",
   "bruteCode": "def brute(seq, w, b):\n    x = list(seq) + [0.0] * (len(w) - len(seq))\n    return sum(wi * xi for wi, xi in zip(w, x)) + b",
   "walkthrough": {
    "input": "单维隐藏状态，输入权重 wx=1、循环权重 wh=0.5、偏置 b=0，h₀=0，输入序列 (1, 0, 2)，激活 tanh",
    "steps": [
     "t=1 输入 x=1：s=1×1+0.5×0+0=1，h₁=tanh(1)≈0.7616——新输入直接写入记忆。",
     "t=2 输入 x=0：没有新输入，只剩历史：s=1×0+0.5×0.7616=0.3808，h₂=tanh(0.3808)≈0.3634——wh=0.5 每步把旧记忆衰减一半左右。",
     "t=3 输入 x=2：新输入与旧记忆相加：s=1×2+0.5×0.3634=2.1817，h₃=tanh(2.1817)≈0.9749——新输入占主导，历史只作小幅修正。",
     "同一组 (wx, wh, b) 在每个时间步重复使用，h 像传送带把历史一路带到最后；tanh 把状态压在 (-1, 1) 内，序列再长状态也不会爆炸。",
     "T 个时间步、每步 O(h²+dh) 次乘加；无论序列多长，状态始终只占 O(h)——RNN 用一份固定大小的记忆处理任意长度的序列。"
    ]
   }
  },
  "transformer-self-attention": {
   "brute": "让序列中两个位置互动，暴力做法是给每对位置连一条独立加权的边：T 个词元就是 T×T 个可学习的关系参数，还与绝对位置绑定，没见过的位置组合毫无办法。只看固定相邻窗口的滑窗平均更省，但远距离信息要叠很多层才能传过去。关键观察是：相关性不用学——两个位置的内容向量做点积就能即时衡量匹配程度，softmax 归一成权重后对全部位置的值向量加权求和。",
   "bruteCode": "def brute(v, radius=1):\n    n = len(v)\n    out = []\n    for i in range(n):\n        lo = max(0, i - radius)\n        hi = min(n, i + radius + 1)\n        out.append(sum(v[j] for j in range(lo, hi)) / (hi - lo))\n    return out",
   "walkthrough": {
    "input": "2 个词元、维度 d=1（缩放因子 √1=1）：q=(0, 2)，k=(1, 0)，v=(10, 30)",
    "steps": [
     "查询 q₀=0 与两个键做点积：得分 0×1=0、0×0=0——q₀ 与所有键正交，没有任何偏好。",
     "softmax 在同一行内竞争：e⁰ 与 e⁰ 相等，权重 (0.5, 0.5)。输出 o₀=0.5×10+0.5×30=20，恰是全部值向量的平均。",
     "查询 q₁=2：得分 2×1=2、2×0=0。softmax：e²≈7.389 对 e⁰=1，权重 (7.389/8.389, 1/8.389)≈(0.881, 0.119)。",
     "输出 o₁=0.881×10+0.119×30≈12.38——注意力集中到第一个词元，结果大幅偏向 v₀=10。",
     "分数相等时 softmax 自动退化为均匀权重，无需任何特判；除以 √d 是防止 d 大时点积方差过大、softmax 饱和。每个查询直接看全部 T 个位置，注意力矩阵时间与空间都是 O(T²)，Q/K/V 投影另需 O(Td²)。"
    ]
   }
  },
  "autoencoder": {
   "brute": "没有标签时学表示，暴力做法是直接记忆：把每张训练图原样存进字典，要重建时找最相近的一条照抄返回；讲究一点用 PCA 做线性降维再升回去。字典法存储随样本数线性膨胀，对没见过的图完全失灵；PCA 只有线性变换，抓不住数据流形的弯曲结构。关键观察是：在网络中间压出一个低维瓶颈，用重建输入自身当免费的监督信号，编码器与解码器就能端到端学出非线性的紧凑表示。",
   "bruteCode": "def brute(store, x):\n    best, best_d = None, None\n    for y in store:\n        d = sum((a - b) ** 2 for a, b in zip(x, y))\n        if best_d is None or d < best_d:\n            best, best_d = y, d\n    return best",
   "walkthrough": {
    "input": "输入像素 x=(1, 0)，编码器 w=(1, 1)、b=-1 压到 1 维瓶颈，解码器先取 w=(2, 2)、b=(-1, -1)，激活 sigmoid",
    "steps": [
     "编码：z=1×1+1×0-1=0，code=sigmoid(0)=0.5——两个不同的像素值被压进 1 维瓶颈里的同一个数。",
     "解码：两个输出神经元都算 2×0.5-1=0，recon=(0.5, 0.5)。",
     "重建误差 MSE=((0.5-1)²+(0.5-0)²)/2=(0.25+0.25)/2=0.25——瓶颈装不下「1 与 0 有别」的信息，重建只能各取 0.5 折中。",
     "只改解码器为 w=(4, -4)、b=(-1, 1)：recon₁=sigmoid(4×0.5-1)=sigmoid(1)≈0.731，recon₂=sigmoid(-4×0.5+1)=sigmoid(-1)≈0.269——同一个 code=0.5 被映回「偏 1」和「偏 0」两种不同值。",
     "误差降到 ((1-0.731)²+0.269²)/2≈0.072；训练就是沿梯度自动找这样的权重，瓶颈维度则决定压缩率与重建质量的上限。全程无需人工标签，误差直接来自输入与重建的逐像素比较。"
    ]
   }
  },
  "generative-adversarial-network": {
   "brute": "想造出像真数据的样本，暴力做法是把训练数据做成直方图存起来，采样时从计数最高的几格里抽——本质是复述见过的值。一维勉强可行，高维图像的格子数指数爆炸，而且永远生成不出训练集之外的新组合。关键观察是：直接规定真实分布很难，但判断「像不像」容易——让判别器学真/假二分类，它给出的误差信号可微，生成器就能沿着这条信号把噪声一步步推向真实分布。",
   "bruteCode": "def brute(reals, bins=10):\n    lo, hi = min(reals), max(reals)\n    width = (hi - lo) / bins or 1.0\n    counts = [0] * bins\n    for r in reals:\n        counts[min(int((r - lo) / width), bins - 1)] += 1\n    peak = counts.index(max(counts))\n    return lo + (peak + 0.5) * width",
   "walkthrough": {
    "input": "一维样本：真实值 real=2，噪声 noise=2；生成器 (w_g, b_g)=(0, 0)，判别器 (w_d, b_d)=(1, 0)，学习率 0.2",
    "steps": [
     "生成器前向：fake=0×2+0=0。判别器打分：p_real=sigmoid(1×2+0)≈0.881（基本认出真样本），p_fake=sigmoid(1×0+0)=0.5（假样本五五开）。",
     "判别器梯度（真假各一条取平均）：d_w=((p_real-1)×real+p_fake×fake)/2=((0.881-1)×2+0.5×0)/2≈-0.119，d_b=((0.881-1)+0.5)/2≈0.190。",
     "判别器更新：w_d=1-0.2×(-0.119)≈1.024，b_d=0-0.2×0.190≈-0.038。重新打分：p_real=sigmoid(1.024×2-0.038)≈0.882、p_fake=sigmoid(1.024×0-0.038)≈0.490——真样本更确信，假样本被压低。",
     "生成器借判别器的新参数回传梯度：d_w=(p_fake-1)×w_d×noise=(0.490-1)×1.024×2≈-1.043，d_b=(0.490-1)×1.024≈-0.522；更新 w_g=0-0.2×(-1.043)≈0.209，b_g=0-0.2×(-0.522)≈0.104。",
     "新的生成样本 fake=0.209×2+0.104≈0.522——从 0 向真实区 2 迈出第一步；交替训练下生成分布逐步逼近真实分布。",
     "一轮训练 = 判别器前后向 + 生成器前后向，成本正比于两个网络的参数量与批量大小；两者必须交替更新，任何一方过强都会让另一方的梯度趋于消失。"
    ]
   }
  }
 },
 "categoryFallback": {
  "查找、排序与算法技巧": "先想暴力解：逐个元素枚举或两两比较，把所有候选检查一遍，通常 O(n) 到 O(n^2)。优化的关键是在输入里找到可利用的结构——有序性、单调性、可分解性——让每一步都能排除掉一大批候选。",
  "图算法、网络流与回溯": "先想暴力解：枚举所有路径、配对或扩展方案并逐一验证约束，往往是指数级或 O(V·(V+E))。图类算法的通用思路是只为每个节点维护「目前已知的最优状态」，并按能保证正确性的顺序处理节点与边。",
  "回溯、博弈与约束求解": "先想暴力解：把所有可能的选择序列枚举到底——全排列、全部棋局——数量通常是指数级。回溯框架的价值在于「走不通就提前折返」：每做一个选择先检查约束，不合法的分支整棵剪掉，不再展开。",
  "字符串算法": "先想暴力解：文本的每个起点都与模式串对齐逐字符比较，失配就回退重来，最坏 O(nm)。字符串算法的通用突破口是复用已经比较过的信息——前缀与后缀关系、哈希指纹或自动机状态。",
  "动态规划与序列": "先想暴力解：枚举所有子序列、划分或决策序列，指数级；即使写成递归，同一个子问题也会被反复重算。动态规划把「到第 i 个元素为止」这类状态存进表里，每个状态只算一次，由更小的状态推出。",
  "贪心、调度与编码": "先想暴力解：枚举所有任务顺序、区间组合或分配方案找全局最优，通常是阶乘或指数级。贪心的思路是每步只取当前最优，难点不在写而在证——要能说明局部最优不会破坏全局最优，常用排序加交换论证。",
  "数据结构": "先想暴力解：把数据放进普通数组，查询要线性扫描，修改还可能牵连一大片，单次操作 O(n)。专用数据结构的通用思路是：多花一点空间维护索引、层级或链接等中间信息，把单次操作降到 O(log n) 甚至 O(1)。",
  "高级查询与树分解": "先想暴力解：每次询问都对原始数据整体扫描或从头重算，O(n) 起步。这类高级结构的共同思路是把数据组织成树形分层或多级块结构，让「定位 + 合并答案」只需经过 O(log n) 层。",
  "空间数据结构": "先想暴力解：最近邻、范围、相交这类空间查询，对全部对象逐一计算距离或判定，单次 O(n)。空间划分结构把平面或空间递归分块，查询时只访问与查询区域相交的少数块，其余整块剪掉。",
  "计算几何": "先想暴力解：对每对或每个三元组对象做几何判定，O(n^2) 甚至 O(n^3)。计算几何的加速通常依赖一个前置排序：按坐标排好后，利用单调性或扫描线，只需处理相邻的少数候选。",
  "数论、变换与线性代数": "先想暴力解：按定义直接计算——试除判素、模拟乘法、逐项求和，常在 O(n) 到 O(n^2)。加速来自数学性质：把大问题折半（快速幂）、把卷积搬到频域（FFT）或用消元逐个消去变量。",
  "压缩算法": "先想暴力解：原样存储或逐字符等长编码，完全不利用数据中的重复模式。压缩的通用观察是：重复与统计规律可以用更短的表示替代——重复片段用引用回指，高频符号用更短编码。",
  "生成、优化与模拟": "先想暴力解：完整模拟每个个体或每一步演化，或穷举全部参数组合找最优。这类方法的重点往往不是全局最优，而是在可接受时间内，用启发式规则或可控的随机性探索出足够好的解。",
  "机器学习与神经网络": "先想暴力解：直接手写规则或穷举参数取值，规则爆炸且难以泛化。学习类方法的思路是定义一个可微的损失函数，用梯度迭代调整参数，让模型从数据中自动拟合规律。"
 }
};
