const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchENumbers = {
  'euclidean-algorithm': {
    statement: '用辗转相除法求两整数的最大公约数：反复用大数除以小数、以余数替换，直到余数为 0。返回 {"gcd": 最大公约数, "quotients": 依次产生的商序列, "steps": 执行的除法次数}。',
    input: 'data 为 {"a": 非负整数, "b": 非负整数}。',
    output: '返回 {"gcd": 整数, "quotients": 整数数组, "steps": 整数}。任一方为 0 时 gcd 为另一方、商序列为空、步数为 0；两方同时为 0 时 gcd 为 0。约定每轮用较大者除以较小者。',
    constraints: ['0 <= a, b <= 10^9'],
    examples: [
      example({ a: 48, b: 18 }, { gcd: 6, quotients: [2, 1, 2], steps: 3 }, '48÷18=2…12，18÷12=1…6，12÷6=2…0'),
    ],
    tests: [
      example({ a: 0, b: 7 }, { gcd: 7, quotients: [], steps: 0 }),
      example({ a: 7, b: 0 }, { gcd: 7, quotients: [], steps: 0 }),
      example({ a: 1, b: 1 }, { gcd: 1, quotients: [1], steps: 1 }),
      example({ a: 100, b: 75 }, { gcd: 25, quotients: [1, 3], steps: 2 }),
      example({ a: 13, b: 17 }, { gcd: 1, quotients: [1, 3, 4], steps: 3 }),
    ],
    insights: ['gcd(a, b) = gcd(b, a mod b) 是整个算法的不变量：余数不会破坏公约数集合，直到余数为 0 时除数就是答案。', '商序列完整记录了除法链，扩展欧几里得正是倒着用它回代出贝祖系数。'],
    pitfalls: ['每轮必须用较大者除以较小者，首轮 a < b 时商序列与直接按参数顺序算不同。', '0 与 0 的 gcd 约定为 0，且不执行任何除法。'],
    solution: `def solve(data):
    a = int(data["a"])
    b = int(data["b"])
    if a == 0 or b == 0:
        return {"gcd": a + b, "quotients": [], "steps": 0}
    quotients = []
    big, small = max(a, b), min(a, b)
    steps = 0
    while small:
        quotients.append(big // small)
        big, small = small, big % small
        steps += 1
    return {"gcd": big, "quotients": quotients, "steps": steps}
`,
  },

  'extended-euclidean': {
    statement: '用扩展欧几里得算法求 gcd(a, b) 与贝祖系数：返回 {"g": gcd, "x": 整数, "y": 整数}，满足 a·x + b·y = g。约定把 x 归一化到 [0, b/g)（g > 0 且 b > 0 时），对应 y = (g - a·x) / b。',
    input: 'data 为 {"a": 整数, "b": 非负整数}。',
    output: '返回 {"g": 整数, "x": 整数, "y": 整数}。',
    constraints: ['-10^9 <= a <= 10^9', '0 <= b <= 10^9', 'a 与 b 不同时为 0'],
    examples: [
      example({ a: 30, b: 20 }, { g: 10, x: 1, y: -1 }, '30·1 + 20·(-1) = 10'),
    ],
    tests: [
      example({ a: 4, b: 6 }, { g: 2, x: 2, y: -1 }),
      example({ a: 7, b: 0 }, { g: 7, x: 1, y: 0 }),
      example({ a: 0, b: 5 }, { g: 5, x: 0, y: 1 }),
      example({ a: -6, b: 9 }, { g: 3, x: 1, y: 1 }),
    ],
    insights: ['回代是扩展欧几里得的灵魂：gcd(x, y) 的系数倒着代入上一层，每层只需一次加减即可修正系数。', '贝祖系数不唯一——差一个 (b/g, -a/g) 的整数倍仍是解，归一化约定让输出唯一可判。'],
    pitfalls: ['a 为负数时先按 |a| 求解再翻号，翻号后 x 的归一化区间要跟着 g 变。', 'b = 0 时 y 必须为 0，a 的符号决定 x 的符号。'],
    solution: `def solve(data):
    a = int(data["a"])
    b = int(data["b"])
    original = a
    sign = 1
    if a < 0:
        sign = -1
        a = -a
    old_r, r = a, b
    old_s, s = 1, 0
    while r:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
    g = old_r
    x = old_s * sign
    if b == 0:
        return {"g": g, "x": sign, "y": 0}
    x %= b // g
    y = (g - original * x) // b
    return {"g": g, "x": x, "y": y}
`,
  },

  'modular-exponentiation': {
    statement: '实现快速幂（平方-乘法）：计算 base^exponent mod modulus，要求自写循环按指数二进制位从低位到高位平方累乘，不得使用语言内置的三参数 pow。',
    input: 'data 为 {"base": 整数, "exponent": 非负整数, "modulus": 正整数}。',
    output: '返回一个整数；exponent 为 0 时返回 1 % modulus。',
    constraints: ['-10^9 <= base <= 10^9', '0 <= exponent <= 10^18', '1 <= modulus <= 10^9'],
    examples: [
      example({ base: 2, exponent: 10, modulus: 1000 }, 24, '1024 mod 1000'),
    ],
    tests: [
      example({ base: 5, exponent: 0, modulus: 7 }, 1),
      example({ base: 5, exponent: 0, modulus: 1 }, 0),
      example({ base: -2, exponent: 3, modulus: 100 }, 92),
      example({ base: 3, exponent: 1000000000000, modulus: 998244353 }, 347277952),
    ],
    insights: ['指数的二进制分解是快速幂的全部秘密：b^e = Π b^(2^i)，每步平方把指数翻倍，循环次数即指数的位数。', '负底数先按模运算归约成非负数再参与乘法，结果自然正确。'],
    pitfalls: ['modulus 为 1 时任何数模 1 都是 0，指数 0 的分支要写 1 % modulus。', '底数为负时 Python 的 % 返回非负余数，直接乘即可，不要先 abs 再补号。'],
    solution: `def solve(data):
    base = int(data["base"]) % int(data["modulus"])
    exponent = int(data["exponent"])
    modulus = int(data["modulus"])
    result = 1 % modulus
    while exponent:
        if exponent & 1:
            result = result * base % modulus
        base = base * base % modulus
        exponent >>= 1
    return result
`,
  },

  'prime-factorization': {
    statement: '对正整数 n 做质因数分解：用试除法从 2 一直除到 sqrt(n)，返回 [[质因子, 指数], ...] 按质因子升序；n = 1 返回空数组。',
    input: 'data 为 {"n": 正整数}。',
    output: '返回二维数组，每项 [p, e]，p 升序。',
    constraints: ['1 <= n <= 10^12'],
    examples: [
      example({ n: 360 }, [[2, 3], [3, 2], [5, 1]]),
    ],
    tests: [
      example({ n: 1 }, []),
      example({ n: 2 }, [[2, 1]]),
      example({ n: 97 }, [[97, 1]]),
      example({ n: 1024 }, [[2, 10]]),
      example({ n: 999999999989 }, [[999999999989, 1]]),
    ],
    insights: ['试除的正确性来自「除尽小因子后余下的大数不再含小因子」——因此除到 sqrt(n) 仍未除尽时，剩余部分本身必是质数。', '指数统计用「边除边计」而不是先收集再分组，天然按质因子升序输出。'],
    pitfalls: ['循环上界要随除法动态收缩（除尽后 sqrt 变小），静态 sqrt(n) 会漏掉大质因子。', '最后剩余的大于 1 的数要作为 [余数, 1] 追加。'],
    solution: `def solve(data):
    n = int(data["n"])
    factors = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            e = 0
            while n % d == 0:
                n //= d
                e += 1
            factors.append([d, e])
        d += 1 if d == 2 else 2
    if n > 1:
        factors.append([n, 1])
    return factors
`,
  },

  'sieve-of-eratosthenes': {
    statement: '用埃拉托斯特尼筛法统计不超过 n 的素数：从 2 开始把每个素数的倍数（从其平方起）逐一标记，返回 {"count": 素数个数, "primes_last10": 最大的不超过 10 个素数（升序）}。',
    input: 'data 为 {"n": 非负整数}。',
    output: '返回 {"count": 整数, "primes_last10": 整数数组}；n < 2 时两者为 0 与空数组。',
    constraints: ['0 <= n <= 10^6'],
    examples: [
      example({ n: 20 }, { count: 8, primes_last10: [2, 3, 5, 7, 11, 13, 17, 19] }),
    ],
    tests: [
      example({ n: 0 }, { count: 0, primes_last10: [] }),
      example({ n: 1 }, { count: 0, primes_last10: [] }),
      example({ n: 2 }, { count: 1, primes_last10: [2] }),
      example({ n: 100 }, { count: 25, primes_last10: [53, 59, 61, 67, 71, 73, 79, 83, 89, 97] }),
    ],
    insights: ['「从 p² 开始标记」的依据：更小的合数倍已经被更小的素数标记过；筛到 sqrt(n) 即可覆盖全部合数。', 'bool 数组 + 切片式标记让内层循环跑在 C 速度，是 Python 里筛法的标准写法。'],
    pitfalls: ['2 是唯一的偶素数，标记偶数倍时可跳步优化但统计不能漏掉 2。', 'n < 2 时直接返回空结果，不要进入筛循环。'],
    solution: `def solve(data):
    n = int(data["n"])
    if n < 2:
        return {"count": 0, "primes_last10": []}
    is_composite = [False] * (n + 1)
    primes = []
    for p in range(2, n + 1):
        if not is_composite[p]:
            primes.append(p)
            for multiple in range(p * p, n + 1, p):
                is_composite[multiple] = True
    return {"count": len(primes), "primes_last10": primes[-10:]}
`,
  },

  'linear-sieve': {
    statement: '用线性筛（欧拉筛）求不超过 n 的全部素数与最小素因子：每个合数只被其最小素因子筛掉一次（枚举 i 从 2 到 n，用已有素数 p 标记 i·p，p 整除 i 时立刻断开）。返回 {"count": 素数个数, "spf": 每个查询值 m 的最小素因子（m < 2 时为 null）}。',
    input: 'data 为 {"n": 非负整数, "queries": [m, ...]}。',
    output: '返回 {"count": 整数, "spf": 数组（与 queries 等长，元素为整数或 null）}。',
    constraints: ['0 <= n <= 10^6', '1 <= queries.length <= 10^3', '1 <= m <= n'],
    examples: [
      example({ n: 20, queries: [12, 17, 1] }, { count: 8, spf: [2, 17, null] }),
    ],
    tests: [
      example({ n: 10, queries: [4, 9, 7] }, { count: 4, spf: [2, 3, 7] }),
      example({ n: 2, queries: [2] }, { count: 1, spf: [2] }),
      example({ n: 30, queries: [30, 29, 25] }, { count: 10, spf: [2, 29, 5] }),
    ],
    insights: ['线性性来自「每个合数只被 (最小素因子, 其余部分) 这一对唯一筛掉」：p 整除 i 时立即断开，保证后续素数不再重复标记同一合数。', 'spf 数组在标记时顺手写入，查询只是读表——预处理一次、回答任意次。'],
    pitfalls: ['断开条件是 i % p == 0 且在标记完 i·p 之后立即 break，先断后标会漏筛。', 'm < 2 没有素因子，输出 null 而不是 1 或 0。'],
    solution: `def solve(data):
    n = int(data["n"])
    spf = [0] * (n + 1)
    primes = []
    for i in range(2, n + 1):
        if spf[i] == 0:
            spf[i] = i
            primes.append(i)
        for p in primes:
            if p > spf[i] or i * p > n:
                break
            spf[i * p] = p
    out = []
    for m in data["queries"]:
        out.append(spf[int(m)] if int(m) >= 2 else None)
    return {"count": len(primes), "spf": out}
`,
  },

  'segmented-sieve': {
    statement: '统计区间 [lo, hi] 内的素数个数（区间可达 10^10，先用普通筛求出 sqrt(hi) 以内的素数，再用它们分段标记 [lo, hi] 内的合数）。',
    input: 'data 为 {"lo": 正整数, "hi": 正整数}，1 <= lo <= hi <= 10^10。',
    output: '返回区间内素数个数（整数）。',
    constraints: ['1 <= lo <= hi <= 10^10', 'hi - lo <= 10^6'],
    examples: [
      example({ lo: 10, hi: 30 }, 6, '11、13、17、19、23、29'),
    ],
    tests: [
      example({ lo: 1, hi: 10 }, 4),
      example({ lo: 999999999989, hi: 1000000000000 }, 1),
      example({ lo: 24, hi: 28 }, 0),
      example({ lo: 2, hi: 2 }, 1),
    ],
    insights: ['分段筛的核心观察：任何 ≤ hi 的合数必有 ≤ sqrt(hi) 的素因子，所以只需小素数表就能标记任意长度的远端区间。', '标记时从 max(p², 向上取整的 lo/p·p) 开始、步长 p 跳跃，区间内不相干的数完全不碰。'],
    pitfalls: ['起点必须是 p² 与 lo 的首个倍数中较大者，从 lo 开始标会把素数 p 自己误标。', 'lo = 1 时 1 不是素数，要单独排除。'],
    solution: `def solve(data):
    lo = int(data["lo"])
    hi = int(data["hi"])
    limit = int(hi ** 0.5) + 1
    base_is_composite = [False] * (limit + 1)
    base_primes = []
    for p in range(2, limit + 1):
        if not base_is_composite[p]:
            base_primes.append(p)
            for multiple in range(p * p, limit + 1, p):
                base_is_composite[multiple] = True
    size = hi - lo + 1
    marked = [False] * size
    for p in base_primes:
        start = max(p * p, ((lo + p - 1) // p) * p)
        for multiple in range(start, hi + 1, p):
            marked[multiple - lo] = True
    count = 0
    for offset in range(size):
        value = lo + offset
        if value >= 2 and not marked[offset]:
            count += 1
    return count
`,
  },

  'euler-totient': {
    statement: '计算欧拉函数 φ(m)（1 到 m 中与 m 互质的正整数个数）：对每个查询值做质因数分解并套用 φ(m) = m · Π(1 - 1/p)，返回整数数组。',
    input: 'data 为 {"queries": [m, ...]}。',
    output: '按查询顺序返回 φ(m) 数组。',
    constraints: ['1 <= queries.length <= 10^3', '1 <= m <= 10^9'],
    examples: [
      example({ queries: [12, 1, 97] }, [4, 1, 96], 'φ(12) = 12·(1/2)·(2/3) = 4'),
    ],
    tests: [
      example({ queries: [2, 6, 9] }, [1, 2, 6]),
      example({ queries: [1000000007] }, [1000000006]),
      example({ queries: [8, 36] }, [4, 12]),
    ],
    insights: ['φ 的积性公式把大数分解成素数幂的独立贡献：对每个不同素因子 p 乘一次 (p-1)/p 即可，无需枚举 1..m。', '分解时先除尽 2 再只试奇数，10^9 规模下 sqrt 级试除足够快。'],
    pitfalls: ['公式要用整数运算 m = m // p * (p - 1) 逐步收缩，先存原值最后乘会引入浮点误差。', 'φ(1) = 1，不要返回 0。'],
    solution: `def solve(data):
    out = []
    for q in data["queries"]:
        m = int(q)
        result = m
        n = m
        p = 2
        while p * p <= n:
            if n % p == 0:
                while n % p == 0:
                    n //= p
                result -= result // p
            p += 1 if p == 2 else 2
        if n > 1:
            result -= result // n
        out.append(result)
    return out
`,
  },

  'chinese-remainder-theorem': {
    statement: '求解同余方程组 x ≡ r_i (mod m_i)（模数两两互质）：用扩展欧几里得逐方程合并——把当前解 x = x0 + k·M 代入下一方程解出 k，返回最小非负解与模数之积 M。',
    input: 'data 为 {"equations": [[r, m], ...]}，m 两两互质且 ≥ 1。',
    output: '返回 {"x": 最小非负解, "modulus": 所有模数之积}。',
    constraints: ['1 <= equations.length <= 10', '1 <= m <= 10^9', '保证模数两两互质'],
    examples: [
      example({ equations: [[2, 3], [3, 5]] }, { x: 8, modulus: 15 }, 'x=8：8 mod 3 = 2，8 mod 5 = 3'),
    ],
    tests: [
      example({ equations: [[1, 2], [2, 3]] }, { x: 5, modulus: 6 }),
      example({ equations: [[0, 7]] }, { x: 0, modulus: 7 }),
      example({ equations: [[2, 3], [3, 4], [1, 5]] }, { x: 11, modulus: 60 }),
    ],
    insights: ['合并两个方程的本质是解 r1 + k·M1 ≡ r2 (mod M2)：k ≡ (r2 - r1)·M1⁻¹ (mod M2)，逆元由扩展欧几里得给出。', '解在 mod M1·M2 意义下唯一——这正是 CRT 定理的内容，合并顺序不影响最终解。'],
    pitfalls: ['合并前把上一轮解规约到 [0, M) 内，否则乘积膨胀后容易溢出语义（Python 不溢出但最小非负约定会破）。', 'r 先对 m 取模再合并，负余数会算出负解。'],
    solution: `def solve(data):
    x = 0
    modulus = 1
    for r, m in data["equations"]:
        r = int(r) % int(m)
        # x + k*modulus ≡ r (mod m)
        diff = (r - x) % m
        # 求 k ≡ diff * modulus^{-1} (mod m)
        inv = 1
        a, b = modulus % m, m
        old_s, s = 1, 0
        old_r2, r2 = a, b
        while r2:
            q = old_r2 // r2
            old_r2, r2 = r2, old_r2 - q * r2
            old_s, s = s, old_s - q * s
        inv = old_s % m
        k = diff * inv % m
        x = x + k * modulus
        modulus *= m
    return {"x": x % modulus, "modulus": modulus}
`,
  },

  'baby-step-giant-step': {
    statement: '用大步小步算法（BSGS）求离散对数：给定素数模数 m 与底数 base，求最小非负 x 使 base^x ≡ target (mod m)；不存在返回 -1。实现：把 target 与 base^(小步) 的像存入字典，大步枚举。',
    input: 'data 为 {"base": 整数, "target": 整数, "modulus": 素数}。',
    output: '返回最小非负 x（整数）或 -1。',
    constraints: ['2 <= modulus < 2^31 且为素数', '0 <= base, target < modulus', 'sqrt(modulus) 规模的字典可接受'],
    examples: [
      example({ base: 3, target: 13, modulus: 17 }, 4, '3^4 = 81 ≡ 13 (mod 17)'),
    ],
    tests: [
      example({ base: 2, target: 1, modulus: 7 }, 0),
      example({ base: 5, target: 3, modulus: 7 }, 5),
      example({ base: 2, target: 8, modulus: 13 }, 3),
      example({ base: 7, target: 7, modulus: 41 }, 1),
    ],
    insights: ['x = i·t - j 的拆分让两边各存 t 个元素即可覆盖 t² 个取值——这是 Meet-in-the-middle 思想在群上的直接应用。', '小步表存 target·base^j（而不是 base^j），大步查 base^(i·t)；同值后写入的 j 覆盖先写入的，首个大步命中即为最小非负解。'],
    pitfalls: ['target = 1 时答案是 0，要在建表前单独返回。', '大步 candidate 是 base 的正 i·t 次幂，与小步表相消后恰好得到 x = i·t - j，两边的 t 必须一致。'],
    solution: `def solve(data):
    modulus = int(data["modulus"])
    base = int(data["base"]) % modulus
    target = int(data["target"]) % modulus
    if target == 1 % modulus:
        return 0
    if base == 0:
        return 1 if target == 0 else -1
    step = int(modulus ** 0.5) + 1
    table = {}
    baby = 1
    for j in range(step):
        table[target * baby % modulus] = j
        baby = baby * base % modulus
    giant = 1
    for i in range(1, step + 1):
        giant = giant * baby % modulus
        if giant in table:
            return i * step - table[giant]
    return -1
`,
  },

  'miller-rabin': {
    statement: '用确定性 Miller–Rabin 素性测试判断整数是否为素数：对 n-1 分解出 2^r·d，依次用固定底数集 [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37] 做 witness 检验（x^d ≡ ±1 或某次平方后出现 -1 则通过），该底数集在 n < 3.3×10^14 范围内无判错。返回每个查询值的布尔结果。',
    input: 'data 为 {"queries": [n, ...]}，n ≤ 3.3×10^14。',
    output: '按查询顺序返回布尔数组。',
    constraints: ['1 <= queries.length <= 10^3', '1 <= n <= 3.3×10^14'],
    examples: [
      example({ queries: [97, 91] }, [true, false]),
    ],
    tests: [
      example({ queries: [1, 2, 4] }, [false, true, false]),
      example({ queries: [561, 7919] }, [false, true], '561 是卡迈克尔数，费马测试会被骗，Miller–Rabin 不会'),
      example({ queries: [998244353, 3000000021] }, [true, false]),
      example({ queries: [2147483647, 6442450941] }, [true, false], '2147483647 = 2^31 - 1 是梅森素数'),
    ],
    insights: ['费马测试的弱点是卡迈克尔数，Miller–Rabin 追加了「平方根链」检查：若存在 x 使 x² ≡ 1 (mod n) 而 x ≠ ±1，n 必为合数。', '固定底数集让随机化算法变成确定算法——底数集是精心验证过的，覆盖范围内无误报。'],
    pitfalls: ['先小素数试除能快速排除偶数与明显合数，也避免 witness 循环处理 n=p 的边界。', '平方后出现 n-1 要 break 继续下一个底数，全程未出现 -1 才判合数。'],
    solution: `def solve(data):
    witnesses = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)

    def is_prime(n):
        if n < 2:
            return False
        for p in witnesses:
            if n % p == 0:
                return n == p
        d = n - 1
        r = 0
        while d % 2 == 0:
            d //= 2
            r += 1
        for a in witnesses:
            x = pow(a, d, n)
            if x == 1 or x == n - 1:
                continue
            for _ in range(r - 1):
                x = x * x % n
                if x == n - 1:
                    break
            else:
                return False
        return True

    return [is_prime(int(q)) for q in data["queries"]]
`,
  },

  'pollard-rho': {
    statement: '用 Pollard Rho 算法求合数的非平凡因子：先用试除剥掉 1000 以内的小因子，再用 Floyd 判圈 x = x² + c（c 由种子驱动 32 位 LCG：state = (state × 1664525 + 1013904223) mod 2^32，每轮 c = state % 191 + 1，gcd 碰撞到 n 时换 c 重来），返回任意一个非平凡因子（由种子与算法完全确定）。',
    input: 'data 为 {"n": 合数, "seed": 非负整数}。',
    output: '返回 n 的一个非平凡因子（整数）。',
    constraints: ['4 <= n <= 10^12', 'n 保证为合数', '0 <= seed < 2^32'],
    examples: [
      example({ n: 91, seed: 1 }, 7),
    ],
    tests: [
      example({ n: 10403, seed: 3 }, 101),
      example({ n: 1022117, seed: 7 }, 1009),
      example({ n: 1000036000099, seed: 99 }, 1000033),
      example({ n: 49, seed: 0 }, 7),
    ],
    insights: ['Rho 的加速来自生日悖论：随机序列 x, x²+c, … 上找 gcd(|x-y|, n)，期望 O(n^(1/4)) 次就撞进因子——比试除快指数级。', 'Floyd 兔龟双指针把「检测循环」与「求 gcd」合并，空间常数级。'],
    pitfalls: ['gcd 结果等于 n 本身说明这一轮 c 失败，必须换 c 重来而不是返回。', '偶数与 1000 以内的小因子先试除，既提速也保证小合数的答案稳定。'],
    solution: `from math import gcd


def solve(data):
    n = int(data["n"])
    state = int(data["seed"]) & 0xffffffff
    if n % 2 == 0:
        return 2
    d = 3
    while d * d <= n and d < 1000:
        if n % d == 0:
            return d
        d += 2
    if n % d == 0 and d * d <= n:
        return d
    while True:
        state = (state * 1664525 + 1013904223) & 0xffffffff
        c = state % 191 + 1
        x = 2
        y = 2
        g = 1
        while g == 1:
            x = (x * x + c) % n
            y = (y * y + c) % n
            y = (y * y + c) % n
            g = gcd(abs(x - y), n)
        if g != n:
            return g
`,
  },

  'gaussian-elimination': {
    statement: '用高斯消元（部分主元选取）求解线性方程组：增广矩阵的最后一列是右端项。逐列选取绝对值最大的主元并归一化，消去其余行。返回 {"status": "unique" | "infinite" | "none", "solution": 唯一解时各未知数的值（round 到 6 位小数），否则为空数组}。',
    input: 'data 为 {"matrix": n 行 (n+1) 列的增广矩阵（整数或小数）}，n ≥ 1。',
    output: '返回 {"status": 字符串, "solution": 数组}。',
    constraints: ['1 <= n <= 20', '|元素| <= 100', 'tests 不包含接近奇异的病态矩阵'],
    examples: [
      example({ matrix: [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]] }, { status: "unique", solution: [2.0, 3.0, -1.0] }, '经典三元方程组'),
    ],
    tests: [
      example({ matrix: [[1, 0, 5], [0, 1, 7]] }, { status: "unique", solution: [5.0, 7.0] }),
      example({ matrix: [[1, 1, 2], [2, 2, 4]] }, { status: "infinite", solution: [] }),
      example({ matrix: [[1, 1, 2], [1, 1, 3]] }, { status: "none", solution: [] }),
      example({ matrix: [[0, 2, 6], [3, 0, 9]] }, { status: "unique", solution: [3.0, 3.0] }),
    ],
    insights: ['部分主元（选当前列绝对值最大的行）既避免除以接近零的数，也让浮点误差可控——这是数值稳定性的最低保障。', '秩的判据决定解的结构：秩 = 未知数个数为唯一解，增广秩更大为无解，否则无穷多解。'],
    pitfalls: ['判断「零」必须用容差而不是 == 0，浮点消元后主元位置常有 1e-16 级残渣。', '归一化主元行要在消元之前做，否则回代时解会差一个系数。'],
    solution: `def solve(data):
    matrix = [[float(v) for v in row] for row in data["matrix"]]
    n = len(matrix)
    cols = len(matrix[0]) - 1
    row_used = 0
    pivot_cols = []
    for col in range(cols):
        pivot = None
        best = 1e-9
        for r in range(row_used, n):
            if abs(matrix[r][col]) > best:
                best = abs(matrix[r][col])
                pivot = r
        if pivot is None:
            continue
        matrix[row_used], matrix[pivot] = matrix[pivot], matrix[row_used]
        pv = matrix[row_used][col]
        for c in range(col, cols + 1):
            matrix[row_used][c] /= pv
        for r in range(n):
            if r != row_used and abs(matrix[r][col]) > 1e-9:
                factor = matrix[r][col]
                for c in range(col, cols + 1):
                    matrix[r][c] -= factor * matrix[row_used][c]
        pivot_cols.append(col)
        row_used += 1
    for r in range(row_used, n):
        if all(abs(matrix[r][c]) <= 1e-9 for c in range(cols)) and abs(matrix[r][cols]) > 1e-9:
            return {"status": "none", "solution": []}
    if len(pivot_cols) < cols:
        return {"status": "infinite", "solution": []}
    solution = [0.0] * cols
    for idx, col in enumerate(pivot_cols):
        solution[col] = round(matrix[idx][cols], 6)
    return {"status": "unique", "solution": solution}
`,
  },

  'matrix-exponentiation': {
    statement: '用矩阵快速幂计算 M^e mod m：指数按二进制位平方累乘，矩阵乘法用三重循环并逐元素取模。返回结果矩阵（二维数组）。',
    input: 'data 为 {"matrix": k×k 整数方阵, "exponent": 非负整数, "modulus": 正整数}，k ≤ 8。',
    output: '返回 k×k 二维数组；exponent 为 0 时返回单位矩阵（modulus = 1 时全 0）。',
    constraints: ['1 <= k <= 8', '0 <= exponent <= 10^18', '1 <= modulus <= 10^9'],
    examples: [
      example({ matrix: [[1, 1], [1, 0]], exponent: 10, modulus: 1000000000 }, [[89, 55], [55, 34]], '斐波那契的矩阵形式'),
    ],
    tests: [
      example({ matrix: [[1, 1], [1, 0]], exponent: 0, modulus: 1000 }, [[1, 0], [0, 1]]),
      example({ matrix: [[1, 1], [1, 0]], exponent: 100, modulus: 1000000007 }, [[782204094, 687995182], [687995182, 94208912]]),
      example({ matrix: [[2]], exponent: 5, modulus: 100 }, [[32]]),
      example({ matrix: [[3, 0], [0, 5]], exponent: 4, modulus: 1 }, [[0, 0], [0, 0]]),
    ],
    insights: ['矩阵快速幂与标量快速幂完全同构：把「乘法」换成矩阵乘，单位元换成单位矩阵；结合律是全部正确性的来源。', '斐波那契、图路径计数等线性递推都能表达成矩阵幂，k 次方转移 O(k³ log e) 完成。'],
    pitfalls: ['单位矩阵在 modulus = 1 时也要取模变成全 0。', '矩阵乘的三重循环里先乘后模，避免大整数堆积（Python 不溢出但会变慢）。'],
    solution: `def solve(data):
    modulus = int(data["modulus"])
    k = len(data["matrix"])
    base = [[v % modulus for v in row] for row in data["matrix"]]
    exponent = int(data["exponent"])
    result = [[1 % modulus if i == j else 0 for j in range(k)] for i in range(k)]

    def multiply(a, b):
        out = [[0] * k for _ in range(k)]
        for r in range(k):
            for c in range(k):
                total = 0
                for t in range(k):
                    total += a[r][t] * b[t][c]
                out[r][c] = total % modulus
        return out

    while exponent:
        if exponent & 1:
            result = multiply(result, base)
        base = multiply(base, base)
        exponent >>= 1
    return result
`,
  },

  fft: {
    statement: '用迭代版快速傅里叶变换（FFT，蝶形优化 + 位反转置换）计算两个整数数组的线性卷积，浮点结果四舍五入为整数输出。保证卷积结果的绝对值 < 1e12，double 精度误差可忽略。',
    input: 'data 为 {"a": 整数数组, "b": 整数数组}。',
    output: '返回卷积结果整数数组（长度 len(a) + len(b) - 1）；任一为空返回空数组。',
    constraints: ['1 <= len(a), len(b) <= 4096', '|元素| <= 1000'],
    examples: [
      example({ a: [1, 2, 3], b: [4, 5] }, [4, 13, 22, 15]),
    ],
    tests: [
      example({ a: [1, 1, 1], b: [1, 1] }, [1, 2, 2, 1]),
      example({ a: [5], b: [7] }, [35]),
      example({ a: [-1, 2], b: [3, -4] }, [-3, 10, -8]),
      example({ a: [1000, -1000, 1000], b: [1000, 1000] }, [1000000, 0, 0, 1000000]),
    ],
    insights: ['FFT 把卷积变成逐点乘：两个多项式在 2^k 个单位根处求值、相乘、再插值回来，O(n log n) 对 O(n²)。', '蝶形图自底向上合并——位反转置换把递归结构拍平成循环，同长度块内的旋转因子按角度二分递推。'],
    pitfalls: ['点值长度必须补到 2 的幂，且不小于卷积结果长度，否则循环卷积会缠绕。', '逆变换最后要除以长度 n，漏除结果会整体放大。'],
    solution: `import math


def solve(data):
    a = list(data["a"])
    b = list(data["b"])
    if not a or not b:
        return []
    result_len = len(a) + len(b) - 1
    size = 1
    while size < result_len:
        size <<= 1
    fa = [complex(float(v), 0.0) for v in a] + [complex(0.0, 0.0)] * (size - len(a))
    fb = [complex(float(v), 0.0) for v in b] + [complex(0.0, 0.0)] * (size - len(b))

    def transform(arr, invert):
        n = len(arr)
        j = 0
        for i in range(1, n):
            bit = n >> 1
            while j & bit:
                j ^= bit
                bit >>= 1
            j |= bit
            if i < j:
                arr[i], arr[j] = arr[j], arr[i]
        length = 2
        while length <= n:
            ang = 2.0 * math.pi / length * (-1.0 if invert else 1.0)
            w_len = complex(math.cos(ang), math.sin(ang))
            half = length >> 1
            for start in range(0, n, length):
                w = complex(1.0, 0.0)
                for offset in range(half):
                    u = arr[start + offset]
                    v = arr[start + offset + half] * w
                    arr[start + offset] = u + v
                    arr[start + offset + half] = u - v
                    w *= w_len
            length <<= 1
        if invert:
            for i in range(n):
                arr[i] /= n

    transform(fa, False)
    transform(fb, False)
    fc = [fa[i] * fb[i] for i in range(size)]
    transform(fc, True)
    return [int(round(fc[i].real)) for i in range(result_len)]
`,
  },

  ntt: {
    statement: '用数论变换（NTT）计算两个整数数组在模 998244353 下的卷积：以原根 3 构造单位根，蝶形结构与 FFT 相同但全程整数运算、无精度问题。返回卷积结果模 998244353 的整数数组。',
    input: 'data 为 {"a": 整数数组, "b": 整数数组}，元素非负。',
    output: '返回卷积模 998244353 的数组（长度 len(a) + len(b) - 1）；任一为空返回空数组。',
    constraints: ['1 <= len(a), len(b) <= 4096', '0 <= 元素 < 998244353'],
    examples: [
      example({ a: [1, 2, 3], b: [4, 5] }, [4, 13, 22, 15]),
    ],
    tests: [
      example({ a: [1000000000], b: [1000000000] }, [716070898], '10^18 mod 998244353'),
      example({ a: [1, 1, 1], b: [1, 1, 1] }, [1, 2, 3, 2, 1]),
      example({ a: [0, 998244352], b: [998244352, 0] }, [0, 1, 0], '998244352 ≡ -1，(-1)·(-1) = 1'),
      example({ a: [2, 0, 0, 5], b: [3] }, [6, 0, 0, 15]),
    ],
    insights: ['998244353 = 119·2^23 + 1，原根 3 的阶恰为 2^23——模数里的大 2 幂使任意 2 的幂长度变换都有可用的单位根。', 'NTT 与 FFT 的骨架逐行相同，差异只在「单位根来自整数幂」：乘法精确、逆元由费马小定理给出。'],
    pitfalls: ['逆变换的 n 的逆元与旋转元的逆都要用模逆元，不能用除法。', '结果长度不足 2 的幂时用 0 补齐，输出时再截断到真实卷积长度。'],
    solution: `MODULUS = 998244353
GENERATOR = 3


def solve(data):
    a = [int(v) % MODULUS for v in data["a"]]
    b = [int(v) % MODULUS for v in data["b"]]
    if not a or not b:
        return []
    result_len = len(a) + len(b) - 1
    size = 1
    while size < result_len:
        size <<= 1
    fa = a + [0] * (size - len(a))
    fb = b + [0] * (size - len(b))

    def ntt(arr, invert):
        n = len(arr)
        j = 0
        for i in range(1, n):
            bit = n >> 1
            while j & bit:
                j ^= bit
                bit >>= 1
            j |= bit
            if i < j:
                arr[i], arr[j] = arr[j], arr[i]
        length = 2
        while length <= n:
            w_len = pow(GENERATOR, (MODULUS - 1) // length, MODULUS)
            if invert:
                w_len = pow(w_len, MODULUS - 2, MODULUS)
            half = length >> 1
            for start in range(0, n, length):
                w = 1
                for offset in range(half):
                    u = arr[start + offset]
                    v = arr[start + offset + half] * w % MODULUS
                    arr[start + offset] = (u + v) % MODULUS
                    arr[start + offset + half] = (u - v) % MODULUS
                    w = w * w_len % MODULUS
            length <<= 1
        if invert:
            inv_n = pow(n, MODULUS - 2, MODULUS)
            for i in range(n):
                arr[i] = arr[i] * inv_n % MODULUS

    ntt(fa, False)
    ntt(fb, False)
    fc = [fa[i] * fb[i] % MODULUS for i in range(size)]
    ntt(fc, True)
    return fc[:result_len]
`,
  },

  'fourier-epicycles': {
    statement: '对给定的 y 值序列计算离散傅里叶变换（DFT）：X[k] = Σ_t y[t]·e^(-2πi·k·t/n)，对每个频率 k（0..n-1）返回 [round(实部), round(虚部)]。n ≤ 64，直接用 O(n²) 双重循环实现 DFT（本题刻意不要求 FFT）。',
    input: 'data 为 {"points": 整数数组}。',
    output: '返回 [[re, im], ...] 按 k 升序，元素为四舍五入后的整数；空输入返回空数组。',
    constraints: ['0 <= n <= 64', '|y[t]| <= 1000'],
    examples: [
      example({ points: [1, 2, 3, 4] }, [[10, 0], [-2, 2], [-2, 0], [-2, -2]]),
    ],
    tests: [
      example({ points: [] }, []),
      example({ points: [5] }, [[5, 0]]),
      example({ points: [1, 0, 0, 0] }, [[1, 0], [1, 0], [1, 0], [1, 0]]),
      example({ points: [0, 1, 0, 0] }, [[1, 0], [0, -1], [-1, 0], [0, 1]]),
    ],
    insights: ['DFT 的每个频率把序列投影到一个旋转的复指数上：常值序列只有 k=0 有能量，单点脉冲的能量均匀铺满所有频率——两个极端恰好互为对偶。', '可视化里的「傅里叶级数圆环」就是这些复数系数：第 k 个圆的半径是 |X[k]|/n，初相是 arg X[k]。'],
    pitfalls: ['指数符号约定取负（e^{-iθ}），虚部符号与教材相反时输出会镜像。', 'round 返回整数，但累加必须用浮点，最后一步才取整。'],
    solution: `import math


def solve(data):
    points = [float(v) for v in data["points"]]
    n = len(points)
    out = []
    for k in range(n):
        re = 0.0
        im = 0.0
        for t, v in enumerate(points):
            ang = -2.0 * math.pi * k * t / n
            re += v * math.cos(ang)
            im += v * math.sin(ang)
        out.append([round(re), round(im)])
    return out
`,
  },
};

