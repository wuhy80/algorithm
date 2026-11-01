const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchEStrings = {
  'z-algorithm': {
    statement: '对给定字符串计算 Z 函数：z[i] 表示后缀 s[i:] 与整串 s 的最长公共前缀长度，z[0] = n。要求使用 Z 算法（维护 [left, right] 匹配区间），整体 O(n)。',
    input: 'data 为 {"s": 字符串}，只含小写字母。',
    output: '返回长度 n 的 z 数组；空串返回空数组。',
    constraints: ['0 <= n <= 10^5'],
    examples: [
      example({ s: "aabxaab" }, [7, 1, 0, 0, 3, 1, 0], 'z[4]=3：后缀 aab 与整串前缀 aab 匹配'),
    ],
    tests: [
      example({ s: "" }, []),
      example({ s: "aaaa" }, [4, 3, 2, 1]),
      example({ s: "abacaba" }, [7, 0, 1, 0, 3, 0, 1]),
      example({ s: "b" }, [1]),
    ],
    insights: ['核心不变量：[left, right) 是当前已知的、从最靠右的匹配位置延伸出的匹配段；z[i] 先从 z[i-left] 继承段内信息，再只对段外部分做扩展比较。', '每个字符最多被扩展比较一次（right 只增不减），这把总复杂度压到线性。'],
    pitfalls: ['继承时要取 min(right - i, z[i - left])，直接照抄会越出已验证的区间。', 'z[0] 是长度 n 而不是 0，空串要单独返回空数组。'],
    solution: `def solve(data):
    s = data["s"]
    n = len(s)
    if n == 0:
        return []
    z = [0] * n
    z[0] = n
    left = right = 0
    for i in range(1, n):
        if i < right:
            z[i] = min(right - i, z[i - left])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > right:
            left = i
            right = i + z[i]
    return z
`,
  },

  manacher: {
    statement: '对给定字符串求以每个位置为中心的最长回文半径。实现采用统一奇偶的变换法：在字符间及两端插入分隔符 #，得到长度 2n+1 的变换串，对变换串每个位置求回文半径数组 p（p[i] 也恰好等于该中心在原串中的回文长度）。要求使用 Manacher 算法的镜像继承，整体 O(n)。',
    input: 'data 为 {"s": 字符串}，只含小写字母。',
    output: '返回变换串上的半径数组（长度 2n+1，与变换串位置一一对应）；空串返回 [0]。',
    constraints: ['0 <= n <= 10^5'],
    examples: [
      example({ s: "aba" }, [0, 1, 0, 3, 0, 1, 0], '中心 3 的半径 3 对应原串回文 aba'),
    ],
    tests: [
      example({ s: "" }, [0]),
      example({ s: "aaaa" }, [0, 1, 2, 3, 4, 3, 2, 1, 0]),
      example({ s: "abba" }, [0, 1, 0, 1, 4, 1, 0, 1, 0]),
      example({ s: "abc" }, [0, 1, 0, 1, 0, 1, 0]),
    ],
    insights: ['插入分隔符把奇偶长度统一成「半径 = 原串回文长度」，镜像继承让已知回文段内部的中心直接抄对称答案，再向右扩展。', 'right 指针单调不回退，与 Z 算法同构——两者都是「区间继承 + 均摊扩展」的线性骨架。'],
    pitfalls: ['镜像半径要与到右边界的距离取 min，超出部分必须重新扩展验证。', '空串返回 [0]（只有分隔符自己），不是空数组。'],
    solution: `def solve(data):
    s = data["s"]
    if not s:
        return [0]
    t = "#" + "#".join(s) + "#"
    n = len(t)
    p = [0] * n
    center = right = 0
    for i in range(n):
        if i < right:
            p[i] = min(right - i, p[2 * center - i])
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        if i + p[i] > right:
            center = i
            right = i + p[i]
    return p
`,
  },

  'rabin-karp': {
    statement: '用滚动哈希在文本中查找模式串的所有出现位置：哈希取固定基数 131、模 1000000007；哈希相等时必须逐字符校验以防碰撞，输出所有匹配起点下标（升序）。',
    input: 'data 为 {"text": 字符串, "pattern": 字符串}，只含小写字母。',
    output: '返回升序的起始下标数组；模式为空或长于文本返回空数组。',
    constraints: ['1 <= len(text) <= 10^5', '1 <= len(pattern) <= 10^4'],
    examples: [
      example({ text: "aabaabaab", pattern: "aab" }, [0, 3, 6]),
    ],
    tests: [
      example({ text: "aaaa", pattern: "aa" }, [0, 1, 2]),
      example({ text: "abcdef", pattern: "ax" }, []),
      example({ text: "abc", pattern: "abcdef" }, []),
      example({ text: "mississippi", pattern: "issi" }, [1, 4]),
    ],
    insights: ['滚动哈希把「逐窗口比较」变成「滑动更新一个数」：去掉窗口首字符贡献（乘基数的最高次幂）、加上新字符，均摊 O(1)。', '哈希只是初筛：碰撞虽以模数概率极低，但逐字符确认让结果绝对正确。'],
    pitfalls: ['减去窗口首字符贡献后可能出现负数，Python 的 % 自然处理，但换成 C 系语言要手动补模。', '模式为空或长于文本要提前返回空数组，避免窗口循环越界。'],
    solution: `def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    n, m = len(text), len(pattern)
    if m == 0 or m > n:
        return []
    base = 131
    modulus = 1000000007
    pattern_hash = 0
    for ch in pattern:
        pattern_hash = (pattern_hash * base + ord(ch)) % modulus
    top_power = pow(base, m - 1, modulus)
    window_hash = 0
    for ch in text[:m]:
        window_hash = (window_hash * base + ord(ch)) % modulus
    out = []
    for start in range(n - m + 1):
        if window_hash == pattern_hash and text[start:start + m] == pattern:
            out.append(start)
        if start + m < n:
            window_hash = ((window_hash - ord(text[start]) * top_power) * base + ord(text[start + m])) % modulus
    return out
`,
  },

  'aho-corasick': {
    statement: '用 Aho–Corasick 自动机统计每个模式串在文本中的出现次数：构建 goto 树、按 BFS 建 fail 指针、沿 fail 链合并输出表；扫描文本时沿转移走，命中节点把其输出表中的模式计数加一。每个模式长度至少为 1。',
    input: 'data 为 {"patterns": [字符串, ...], "text": 字符串}，均为小写字母。',
    output: '按输入顺序返回每个模式的出现次数数组（重叠出现都计入）。',
    constraints: ['1 <= patterns.length <= 100', '1 <= 单个模式长度 <= 50', '1 <= len(text) <= 10^5'],
    examples: [
      example({ patterns: ["he", "she", "his", "hers"], text: "ushers" }, [1, 1, 0, 1], 'ushers 同时结束 she 与 hers'),
    ],
    tests: [
      example({ patterns: ["a", "aa"], text: "aaa" }, [3, 2]),
      example({ patterns: ["abc"], text: "ab" }, [0]),
      example({ patterns: ["ab", "ba"], text: "abab" }, [2, 1]),
      example({ patterns: ["xyz", "abc"], text: "abcxyzabc" }, [1, 2]),
    ],
    insights: ['fail 指针指向「当前匹配串的最长真后缀仍是某模式前缀」的节点——失配时不需要回头重扫文本，一条 fail 链跳转即可。', '把 fail 链的输出表在 BFS 时向下合并，扫描时每个命中节点一次就能上报全部后缀模式，均摊 O(文本长 + 命中数)。'],
    pitfalls: ['根节点的直接子节点 fail 必须指回根，构建 BFS 时要单独处理，否则会指向自己造成死循环。', '模式之间互为后缀（a 与 aa）时，短模式的计数依赖输出表合并，漏合并会少计。'],
    solution: `from collections import deque


def solve(data):
    patterns = list(data["patterns"])
    text = data["text"]
    children = [{}]
    fail = [0]
    node_patterns = [[]]
    for idx, pat in enumerate(patterns):
        cur = 0
        for ch in pat:
            nxt = children[cur].get(ch)
            if nxt is None:
                children.append({})
                fail.append(0)
                node_patterns.append([])
                nxt = len(children) - 1
                children[cur][ch] = nxt
            cur = nxt
        node_patterns[cur].append(idx)
    queue = deque()
    for nxt in children[0].values():
        queue.append(nxt)
    while queue:
        u = queue.popleft()
        merged = list(node_patterns[u])
        f = fail[u]
        while f:
            merged.extend(node_patterns[f])
            f = fail[f]
        node_patterns[u] = merged
        for ch, v in children[u].items():
            f = fail[u]
            while f and ch not in children[f]:
                f = fail[f]
            fail[v] = children[f].get(ch, 0)
            if fail[v] == v:
                fail[v] = 0
            queue.append(v)
    counts = [0] * len(patterns)
    cur = 0
    for ch in text:
        while cur and ch not in children[cur]:
            cur = fail[cur]
        cur = children[cur].get(ch, 0)
        for idx in node_patterns[cur]:
            counts[idx] += 1
    return counts
`,
  },

  'suffix-array-lcp': {
    statement: '对给定字符串构建后缀数组与 LCP 数组：后缀数组用倍增法（按 (rank[i], rank[i+k]) 双关键字排序），LCP 用 Kasai 算法按后缀在原串中的顺序线性求出。输出 sa 与 lcp，其中 lcp[r] 表示 sa[r-1] 与 sa[r] 对应后缀的最长公共前缀长度，lcp[0] = 0。',
    input: 'data 为 {"s": 字符串}，只含小写字母。',
    output: '返回 {"sa": 后缀数组, "lcp": LCP 数组}；空串返回 {"sa": [], "lcp": []}。',
    constraints: ['0 <= n <= 2000'],
    examples: [
      example({ s: "banana" }, { sa: [5, 3, 1, 0, 4, 2], lcp: [0, 1, 3, 0, 0, 2] }),
    ],
    tests: [
      example({ s: "" }, { sa: [], lcp: [] }),
      example({ s: "a" }, { sa: [0], lcp: [0] }),
      example({ s: "aaaa" }, { sa: [3, 2, 1, 0], lcp: [0, 1, 2, 3] }),
      example({ s: "abab" }, { sa: [2, 0, 3, 1], lcp: [0, 2, 0, 1] }),
    ],
    insights: ['倍增的排序键是「长度 k 的排名 + 长度 2k 的后半排名」——每一轮只合并已知信息，log 轮后排名即最终后缀名次。', 'Kasai 算法按原串顺序（而非后缀序）处理，利用 h 最多减一的性质把总比较压到 O(n)：后缀 i 与它前一名后缀去掉首字符后的 LCP 至少是前一步的 h-1。'],
    pitfalls: ['倍增排序时越界后缀的第二关键字要用 -1（最小），不能用 0。', 'Kasai 必须按 sa 的逆映射（原串下标顺序）遍历，按 sa 顺序会破坏 h 的继承。'],
    solution: `def solve(data):
    s = data["s"]
    n = len(s)
    if n == 0:
        return {"sa": [], "lcp": []}
    rank = [ord(c) for c in s]
    sa = list(range(n))
    k = 1
    while True:
        def key(i):
            return (rank[i], rank[i + k] if i + k < n else -1)
        sa.sort(key=key)
        new_rank = [0] * n
        for idx in range(1, n):
            new_rank[sa[idx]] = new_rank[sa[idx - 1]] + (1 if key(sa[idx]) != key(sa[idx - 1]) else 0)
        rank = new_rank
        if rank[sa[-1]] == n - 1:
            break
        k <<= 1
    pos_in_sa = [0] * n
    for r, suffix in enumerate(sa):
        pos_in_sa[suffix] = r
    lcp = [0] * n
    h = 0
    for i in range(n):
        if pos_in_sa[i] > 0:
            j = sa[pos_in_sa[i] - 1]
            while i + h < n and j + h < n and s[i + h] == s[j + h]:
                h += 1
            lcp[pos_in_sa[i]] = h
            if h:
                h -= 1
        else:
            h = 0
    return {"sa": sa, "lcp": lcp}
`,
  },

  'suffix-automaton': {
    statement: '对给定字符串构建后缀自动机（SAM）：每插入一个字符，沿父节点后缀链接补转移，必要时克隆节点保持「每个状态代表一组 endpos 等价的后缀」。返回该串不同非空子串的个数，即所有状态（除初始态）的 len(v) - len(link(v)) 之和。',
    input: 'data 为 {"s": 字符串}，只含小写字母。',
    output: '返回不同非空子串个数（整数）；空串返回 0。',
    constraints: ['0 <= n <= 2000'],
    examples: [
      example({ s: "ab" }, 3, 'a、b、ab'),
    ],
    tests: [
      example({ s: "" }, 0),
      example({ s: "aa" }, 2),
      example({ s: "banana" }, 15),
      example({ s: "abcdabcd" }, 26),
    ],
    insights: ['SAM 的每个状态代表一组 endpos 完全相同的子串，其数量是 len(v) - len(link(v))——求和恰好不重不漏地覆盖所有不同子串。', '克隆操作维持「子串集合划分」的不变量：转移分裂时旧状态的后缀链接重新挂到克隆态上，长度区间才会无缝衔接。'],
    pitfalls: ['克隆必须复制原状态的完整转移表和后缀链接，漏复制会让后续插入挂错转移。', '统计时初始状态（len=0）不计入，空串返回 0。'],
    solution: `def solve(data):
    s = data["s"]
    max_len = [0]
    link = [-1]
    trans = [{}]
    last = 0
    for ch in s:
        cur = len(max_len)
        max_len.append(max_len[last] + 1)
        link.append(-1)
        trans.append({})
        p = last
        while p != -1 and ch not in trans[p]:
            trans[p][ch] = cur
            p = link[p]
        if p == -1:
            link[cur] = 0
        else:
            q = trans[p][ch]
            if max_len[p] + 1 == max_len[q]:
                link[cur] = q
            else:
                clone = len(max_len)
                max_len.append(max_len[p] + 1)
                link.append(link[q])
                trans.append(dict(trans[q]))
                while p != -1 and trans[p].get(ch) == q:
                    trans[p][ch] = clone
                    p = link[p]
                link[q] = clone
                link[cur] = clone
        last = cur
    total = 0
    for v in range(1, len(max_len)):
        total += max_len[v] - max_len[link[v]]
    return total
`,
  },

  'suffix-tree': {
    statement: '对给定字符串（末尾补哨兵 $）构建压缩后缀树：逐个插入每个后缀，沿已有边匹配最长公共前缀，必要时在边中间分裂出内部节点。返回统计信息：leaves（叶子数）、edges（边数）、distinct（不同非空子串个数，等于所有边标签长度之和减去哨兵后缀数 n）。',
    input: 'data 为 {"s": 字符串}，只含小写字母。',
    output: '返回 {"leaves": 叶子数, "edges": 边数, "distinct": 不同非空子串数}。',
    constraints: ['1 <= n <= 300'],
    examples: [
      example({ s: "ab" }, { leaves: 3, edges: 3, distinct: 3 }, '树有三条边 ab$、b$、$，叶子即后缀数'),
    ],
    tests: [
      example({ s: "aa" }, { leaves: 3, edges: 4, distinct: 2 }),
      example({ s: "banana" }, { leaves: 7, edges: 10, distinct: 15 }),
      example({ s: "a" }, { leaves: 2, edges: 2, distinct: 1 }),
    ],
    insights: ['压缩后缀树的每条边代表一段不可再分的标签；插入新后缀时沿边逐字符匹配，失配点把边一分为二并挂上新叶——这是理解 Ukkonen 增量维护的起点。', '不同子串数等于所有边标签长度之和减去 n：树中每个「节点位置」唯一对应一个子串，其中 n 个位置以哨兵结尾需扣除。'],
    pitfalls: ['分裂边时原标签的剩余部分要挂到分裂节点下，方向接反会让子树丢失。', '哨兵 $ 必须参与构建，否则共享前缀的后缀会在叶子层合并，计数错误。'],
    solution: `def solve(data):
    s = data["s"] + "$"
    n = len(s)
    children = [{}]
    for i in range(n):
        cur = 0
        j = i
        while j < n:
            ch = s[j]
            if ch not in children[cur]:
                children.append({})
                children[cur][ch] = (j, n, len(children) - 1)
                j = n
                continue
            start, end, nxt = children[cur][ch]
            k = 0
            while k < end - start and j + k < n and s[start + k] == s[j + k]:
                k += 1
            if k == end - start:
                cur = nxt
                j += k
                continue
            split_node = len(children)
            children.append({})
            children[cur][ch] = (start, start + k, split_node)
            children.append({})
            children[split_node][s[start + k]] = (start + k, end, nxt)
            children.append({})
            children[split_node][s[j + k]] = (j + k, n, len(children) - 1)
            j = n
    edges = 0
    leaves = 0
    total_len = 0
    stack = [0]
    while stack:
        u = stack.pop()
        for start, end, v in children[u].values():
            edges += 1
            total_len += end - start
            if not children[v]:
                leaves += 1
            stack.append(v)
    return {"leaves": leaves, "edges": edges, "distinct": total_len - n}
`,
  },

  'palindromic-tree': {
    statement: '用回文树（Eertree）统计字符串的回文子串：树含长度 -1 与长度 0 两个根，每插入一个字符先沿 fail 链找到可作为回文后缀的节点，若新回文则建节点并求其后缀链接。返回 {"distinct": 不同回文子串个数, "total": 回文子串出现总次数（按出现位置计）}，出现次数由 fail 树自底向上累加得到。',
    input: 'data 为 {"s": 字符串}，只含小写字母。',
    output: '返回 {"distinct": 整数, "total": 整数}；空串两个计数均为 0。',
    constraints: ['0 <= n <= 10^5'],
    examples: [
      example({ s: "abba" }, { distinct: 4, total: 6 }, 'a、b、bb、abba；a 出现 2 次、b 2 次、bb 与 abba 各 1 次'),
    ],
    tests: [
      example({ s: "" }, { distinct: 0, total: 0 }),
      example({ s: "aaa" }, { distinct: 3, total: 6 }),
      example({ s: "ab" }, { distinct: 2, total: 2 }),
      example({ s: "abacaba" }, { distinct: 7, total: 12 }),
    ],
    insights: ['回文树的每条 fail 链是「回文后缀的递减序列」：新字符的最长回文后缀由某个已有回文左右各加一字符得到，找不到就落在两个根上。', '出现总次数沿 fail 树自底向上累加——子节点每出现一次，其所有 fail 祖先代表的回文也各出现一次。'],
    pitfalls: ['扩展时必须检查下标 i - len - 1 不越界，长度 -1 的奇根保证单字符回文总能落地。', '新节点的 fail 在长度为 1 时指向空串根，用 get 取不到时也要落回该根而不是 0。'],
    solution: `def solve(data):
    s = data["s"]
    length = [-1, 0]
    link = [0, 0]
    next_nodes = [{}, {}]
    cnt = [0, 0]
    last = 1
    for i, ch in enumerate(s):
        cur = last
        while True:
            l = length[cur]
            if i - l - 1 >= 0 and s[i - l - 1] == ch:
                break
            cur = link[cur]
        if ch in next_nodes[cur]:
            last = next_nodes[cur][ch]
            cnt[last] += 1
            continue
        now = len(length)
        length.append(length[cur] + 2)
        link.append(-1)
        next_nodes.append({})
        cnt.append(1)
        next_nodes[cur][ch] = now
        if length[now] == 1:
            link[now] = 1
        else:
            tmp = link[cur]
            while True:
                l = length[tmp]
                if i - l - 1 >= 0 and s[i - l - 1] == ch:
                    break
                tmp = link[tmp]
            link[now] = next_nodes[tmp].get(ch, 1)
        last = now
    for v in range(len(length) - 1, 1, -1):
        cnt[link[v]] += cnt[v]
    return {"distinct": len(length) - 2, "total": sum(cnt[2:])}
`,
  },

  'regex-matching': {
    statement: '实现支持 . 与 * 的正则整串匹配（LeetCode 10 语义）：. 匹配任意单个字符；* 表示其前一个元素出现 0 次或任意多次。用自底向上动态规划判定 pattern 是否匹配整个 text，不得使用语言自带的正则库。',
    input: 'data 为 {"pattern": 字符串, "text": 字符串}，pattern 只含小写字母、. 与 *（* 前必有可重复元素），text 只含小写字母。',
    output: '返回布尔值。',
    constraints: ['0 <= len(text) <= 10^3', '1 <= len(pattern) <= 10^3'],
    examples: [
      example({ pattern: "a*", text: "aaa" }, true, 'a* 匹配三个 a'),
    ],
    tests: [
      example({ pattern: "ab", text: "aa" }, false),
      example({ pattern: ".*", text: "ab" }, true),
      example({ pattern: "a*", text: "" }, true),
      example({ pattern: "a", text: "" }, false),
      example({ pattern: "c*a*b", text: "aab" }, true),
      example({ pattern: "mis*is*p*.", text: "mississippi" }, false),
    ],
    insights: ['dp[i][j] 表示 text 前 i 个字符与 pattern 前 j 个字符是否匹配：普通字符看 dp[i-1][j-1]，x* 是「空掉它」或「消耗一个字符继续停留在 x*」的或运算。', '* 的自转移 dp[i-1][j] → dp[i][j] 把「重复任意次」表达为同一格内的重复消费，这正是回溯法会指数爆炸的地方。'],
    pitfalls: ['* 取 0 次时引用 dp[i][j-2]，j-2 越界的列必须当作 False 处理而不是回绕到行尾。', '空串也要能匹配 a*、.* 这类「可空」模式。'],
    solution: `def solve(data):
    pattern = data["pattern"]
    text = data["text"]
    n, m = len(text), len(pattern)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for j in range(2, m + 1):
        if pattern[j - 1] == "*":
            dp[0][j] = dp[0][j - 2]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            pc = pattern[j - 1]
            if pc == "*":
                if j >= 2 and dp[i][j - 2]:
                    dp[i][j] = True
                elif j >= 2 and (pattern[j - 2] == "." or pattern[j - 2] == text[i - 1]) and dp[i - 1][j]:
                    dp[i][j] = True
            elif pc == "." or pc == text[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[n][m]
`,
  },

  'booth-minimum-rotation': {
    statement: '求字符串最小表示（Booth 问题）的起始下标：在 s + s 上做双指针淘汰赛——两个候选起点 i、j 从同一偏移 k 开始逐字符比较，字符较大的一方连同它压住的整段前缀被淘汰（指针跳到失败位置之后，且不得越过对方），相等则共同推进 k。返回使旋转串字典序最小的起始下标（多个相等时取最小的）。',
    input: 'data 为 {"s": 字符串}，只含小写字母。',
    output: '返回起始下标（整数）。',
    constraints: ['1 <= n <= 10^5'],
    examples: [
      example({ s: "banana" }, 5, 'abanan 是所有旋转中最小的'),
    ],
    tests: [
      example({ s: "aaa" }, 0),
      example({ s: "ba" }, 1),
      example({ s: "cbacbacba" }, 2),
      example({ s: "z" }, 0),
    ],
    insights: ['淘汰的依据是局部信息推全局结论：候选 i 在偏移 k 处落败时，[i, i+k] 之间任何一个起点作为旋转都劣于 j 侧对应起点，因此可以整段跳过——均摊 O(n)。', '这与 Booth 失败函数法殊途同归：都是利用「已比较过的前缀信息」避免重复比较，双指针版本更易写对。'],
    pitfalls: ['落败一方的新起点至少要跳到对方之后（i <= j 时取 j+1），否则两个候选会互相纠缠死循环。', '字符相等只能推进 k，绝不能提前分出胜负；周期串（如 aaa）的最小下标是 0。'],
    solution: `def solve(data):
    s = data["s"]
    n = len(s)
    if n <= 1:
        return 0
    doubled = s + s
    i, j, k = 0, 1, 0
    while i < n and j < n and k < n:
        a = doubled[i + k]
        b = doubled[j + k]
        if a == b:
            k += 1
        elif a > b:
            i = i + k + 1
            if i <= j:
                i = j + 1
            k = 0
        else:
            j = j + k + 1
            if j <= i:
                j = i + 1
            k = 0
    return min(i, j)
`,
  },

  'boyer-moore': {
    statement: '用 Boyer–Moore 坏字符启发式在文本中查找模式串首次出现位置。规则：预处理 badchar[c] = 字符 c 在模式中最后一次出现的下标（未出现为 -1）；每次对齐从模式末位向左逐字符比较并计数（每次字符比较计 1，失配即停）；失配在模式位置 j 时右移 max(1, j - badchar[text 对齐位置 j 处的字符])。返回 {"index": 首次匹配下标或 -1, "comparisons": 总比较次数}。',
    input: 'data 为 {"text": 字符串, "pattern": 字符串}，只含小写字母。',
    output: '返回 {"index": 整数, "comparisons": 整数}。',
    constraints: ['1 <= len(pattern) <= len(text) <= 10^5'],
    examples: [
      example({ text: "ababcabc", pattern: "abc" }, { index: 2, comparisons: 4 }, '第一次对齐比较 1 次即失配，第二次对齐连续 3 次命中'),
    ],
    tests: [
      example({ text: "abab", pattern: "aaa" }, { index: -1, comparisons: 2 }),
      example({ text: "hello", pattern: "hello" }, { index: 0, comparisons: 5 }),
      example({ text: "abc", pattern: "d" }, { index: -1, comparisons: 3 }),
      example({ text: "aabaabaab", pattern: "aaba" }, { index: 0, comparisons: 4 }),
    ],
    insights: ['坏字符启发式的跳跃量来自「让文本中失配的字符对齐到模式中它最后出现的位置」——文本信息反过来指导模式怎么滑。', '从右向左比较让长跳跃更容易触发：末位就失配时一次能跳过整段文本。'],
    pitfalls: ['右移量至少为 1，坏字符在模式中位于失配点右侧时负偏移不能倒退。', '比较计数包含匹配成功路径上的每一次字符比较，不只是失配。'],
    solution: `def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    n, m = len(text), len(pattern)
    bad = {}
    for idx, ch in enumerate(pattern):
        bad[ch] = idx
    comparisons = 0
    i = 0
    while i + m <= n:
        j = m - 1
        while j >= 0:
            comparisons += 1
            if text[i + j] != pattern[j]:
                break
            j -= 1
        if j < 0:
            return {"index": i, "comparisons": comparisons}
        shift = j - bad.get(text[i + j], -1)
        i += max(1, shift)
    return {"index": -1, "comparisons": comparisons}
`,
  },

  'rolling-hash': {
    statement: '对一组单词做双哈希（基数 131/137，模 1000000007/998244353），然后对每个查询 [i, j] 判断 words[i] 与 words[j] 是否相等：哈希相等时再逐字符确认，输出布尔值数组。',
    input: 'data 为 {"words": [字符串, ...], "queries": [[i, j], ...]}，只含小写字母，下标从 0 开始。',
    output: '按查询顺序返回布尔数组。',
    constraints: ['1 <= words.length <= 10^3', '单个单词长度 1..50', '1 <= queries.length <= 10^4'],
    examples: [
      example({ words: ["abc", "abc", "abd"], queries: [[0, 1], [0, 2], [1, 2]] }, [true, false, false]),
    ],
    tests: [
      example({ words: ["a"], queries: [[0, 0]] }, [true]),
      example({ words: ["hash", "hash", "hashh"], queries: [[0, 1], [1, 2], [2, 0]] }, [true, false, false]),
      example({ words: ["x", "y"], queries: [[0, 1], [1, 0]] }, [false, false]),
    ],
    insights: ['双哈希把碰撞概率压到可忽略，但本题要的是绝对正确——哈希命中后逐字符确认，把概率算法变成确定算法。', '预计算每个单词的哈希后，比较退化为两个整数比较 + 一次确认，批量查询的均摊成本极低。'],
    pitfalls: ['哈希不同则必不相等（模数下无假阴性），但哈希相同必须逐字符确认，只比哈希会漏掉碰撞。'],
    solution: `def solve(data):
    words = data["words"]
    queries = data["queries"]
    pairs = []
    for word in words:
        h1 = 0
        h2 = 0
        for ch in word:
            h1 = (h1 * 131 + ord(ch)) % 1000000007
            h2 = (h2 * 137 + ord(ch)) % 998244353
        pairs.append((h1, h2))
    out = []
    for i, j in queries:
        a, b = words[i], words[j]
        if pairs[i] == pairs[j] and a == b:
            out.append(True)
        else:
            out.append(False)
    return out
`,
  },

  'duval-lyndon-factorization': {
    statement: '用 Duval 算法把字符串分解为 Lyndon 因子（字典序严格大于其所有非平凡真后缀的串），返回按顺序的各因子长度数组。算法在双指针 j（前瞻）与 k（基准内指针）之间比较字符，整体 O(n)。',
    input: 'data 为 {"s": 字符串}，只含小写字母。',
    output: '返回因子长度数组（和恰为 n）；空串返回空数组。',
    constraints: ['0 <= n <= 10^5'],
    examples: [
      example({ s: "banana" }, [1, 2, 2, 1], 'b | an | an | a'),
    ],
    tests: [
      example({ s: "" }, []),
      example({ s: "aaaa" }, [1, 1, 1, 1]),
      example({ s: "abcabc" }, [3, 3]),
      example({ s: "ababa" }, [2, 2, 1]),
    ],
    insights: ['Lyndon 串是「比自己所有真后缀都大」的词——它是最小循环移位对应的单一周期块，Duval 用三指针在一次线性扫描里完成切分。', '因子序列唯一且按字典序不增，这也是把无限词分解成 Lyndon 词的基础（Chen–Fox–Lyndon 定理）。'],
    pitfalls: ['s[k] == s[j] 时基准指针前进而失配时重置回段首，两个分支写反会让因子长度错乱。', '内层循环结束后要按 (j - k) 为周期切分当前段，切到 i 越过 k 为止。'],
    solution: `def solve(data):
    s = data["s"]
    n = len(s)
    out = []
    i = 0
    while i < n:
        j = i + 1
        k = i
        while j < n and s[k] <= s[j]:
            if s[k] == s[j]:
                k += 1
            else:
                k = i
            j += 1
        while i <= k:
            out.append(j - k)
            i += j - k
    return out
`,
  },

  'fm-index': {
    statement: '对给定文本（末尾补哨兵 $）构建 FM-index：BWT 取自排序旋转的末列；第一列 F 为 BWT 排序结果，C[c] 为严格小于 c 的字符总数，occ 表记录 BWT 每个前缀中各字符出现次数。用 backward search 从模式末位向前收缩区间 [top, bottom]，返回 {"bwt": BWT 串, "occurrences": 模式出现次数（重叠计入）}。',
    input: 'data 为 {"text": 字符串, "pattern": 字符串}，只含小写字母，pattern 长度至少为 1。',
    output: '返回 {"bwt": 字符串, "occurrences": 整数}。',
    constraints: ['1 <= len(text) <= 2000', '1 <= len(pattern) <= len(text)'],
    examples: [
      example({ text: "banana", pattern: "ana" }, { bwt: "annb$aa", occurrences: 2 }),
    ],
    tests: [
      example({ text: "banana", pattern: "nan" }, { bwt: "annb$aa", occurrences: 1 }),
      example({ text: "banana", pattern: "abc" }, { bwt: "annb$aa", occurrences: 0 }),
      example({ text: "ab", pattern: "b" }, { bwt: "b$a", occurrences: 1 }),
      example({ text: "mississippi", pattern: "issi" }, { bwt: "ipssm$pissii", occurrences: 2 }),
    ],
    insights: ['backward search 的不变量：处理完模式后缀 p[k:] 后，区间 [top, bottom] 恰好是「以 p[k:] 结尾的旋转」在 F 列中的连续段——区间宽度就是出现次数。', 'C 数组给出每种字符在 F 列的起始行，occ 表给出 BWT 列的前缀计数，两者把「字符 c 的区间」O(1) 映射回 F 列，无需存储整棵后缀树。'],
    pitfalls: ['occ 取值要区分 top 与 bottom+1 两个前缀端点，差一就会把合法区间算空。', '模式中出现了文本没有的字符要直接返回 0，不能查 C 表。'],
    solution: `def solve(data):
    text = data["text"] + "$"
    n = len(text)
    rotations = sorted(text[i:] + text[:i] for i in range(n))
    bwt = "".join(rot[-1] for rot in rotations)
    alphabet = sorted(set(text))
    first = sorted(bwt)
    count_less = {}
    for c in alphabet:
        count_less[c] = sum(1 for ch in first if ch < c)
    occ = [{c: 0 for c in alphabet}]
    for ch in bwt:
        row = dict(occ[-1])
        row[ch] += 1
        occ.append(row)
    pattern = data["pattern"]
    top, bottom = 0, n - 1
    for ch in reversed(pattern):
        if ch not in count_less:
            return {"bwt": bwt, "occurrences": 0}
        top = count_less[ch] + occ[top][ch]
        bottom = count_less[ch] + occ[bottom + 1][ch] - 1
        if top > bottom:
            return {"bwt": bwt, "occurrences": 0}
    return {"bwt": bwt, "occurrences": bottom - top + 1}
`,
  },
};

