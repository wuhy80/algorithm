const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchEGeometry = {
  'convex-hull': {
    statement: '对给定的互不相同整数点集求凸包：返回凸包顶点在输入中的下标，按逆时针（CCW）顺序排列，起点为 (y, x) 最小的顶点；边上的共线点不属于凸包。',
    input: 'data 为 {"points": [[x, y], ...]}，点互不相同。',
    output: '返回下标数组；单点返回 [0]，两点按 (x, y) 从小到大返回两个下标。',
    constraints: ['1 <= n <= 10^4', '-10^6 <= x, y <= 10^6'],
    examples: [
      example({ points: [[0, 0], [4, 0], [2, 2], [4, 4], [0, 4]] }, [0, 1, 3, 4], '内部点 (2,2) 不在凸包上'),
    ],
    tests: [
      example({ points: [[0, 0], [1, 0], [1, 1], [0, 1]] }, [0, 1, 2, 3]),
      example({ points: [[0, 0], [1, 1], [2, 2], [3, 3]] }, [0, 3]),
      example({ points: [[5, 5]] }, [0]),
      example({ points: [[0, 0], [1, 0]] }, [0, 1]),
    ],
    insights: ['Andrew 单调链按 x 排序后各扫一遍：下链在非左转时弹栈、上链反向再扫一遍，拼接即得完整凸包，整型叉积保证精确。', '「共线不算顶点」通过弹栈条件取等号实现；起点旋转到 (y, x) 最小点让输出唯一。'],
    pitfalls: ['弹栈条件用 < 0 会把共线点保留在凸包上，必须用 <= 0。', '排序必须带输入下标打破并列，否则同 x 点的顺序不唯一。'],
    solution: `def solve(data):
    pts = data["points"]
    n = len(pts)
    order = sorted(range(n), key=lambda i: (pts[i][0], pts[i][1], i))
    if n <= 2:
        return order

    def cross(o, a, b):
        return (pts[a][0] - pts[o][0]) * (pts[b][1] - pts[o][1]) - (pts[a][1] - pts[o][1]) * (pts[b][0] - pts[o][0])

    lower = []
    for i in order:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], i) <= 0:
            lower.pop()
        lower.append(i)
    upper = []
    for i in reversed(order):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], i) <= 0:
            upper.pop()
        upper.append(i)
    hull = lower[:-1] + upper[:-1]
    start = min(range(len(hull)), key=lambda k: (pts[hull[k]][1], pts[hull[k]][0], hull[k]))
    return hull[start:] + hull[:start]
`,
  },

  'closest-pair': {
    statement: '求平面点集中距离最近的一对点：先用分治法（按 x 排序、递归两半、中间条带内按 y 检查相邻候选）求出最小距离的平方，再在「横向距离不超过该值」的扫掠中找出所有达到最小值的点对，返回字典序最小 (i, j)（i < j）的一对。',
    input: 'data 为 {"points": [[x, y], ...]}，点互不相同，坐标为整数。',
    output: '返回 {"distance2": 最小欧氏距离的平方, "pair": [i, j]}；点数不足 2 返回 {"distance2": null, "pair": []}。',
    constraints: ['2 <= n <= 5000', '-10^6 <= x, y <= 10^6', 'tests 中达到最小距离的点对数较少'],
    examples: [
      example({ points: [[0, 0], [3, 4], [1, 1]] }, { distance2: 2, pair: [0, 2] }),
    ],
    tests: [
      example({ points: [[0, 0], [1, 0], [5, 5], [6, 5]] }, { distance2: 1, pair: [0, 1] }, '两对点同为距离 1，取下标字典序小的'),
      example({ points: [[0, 0]] }, { distance2: null, pair: [] }),
      example({ points: [[-2, -2], [2, 2], [0, 0], [1, 1]] }, { distance2: 2, pair: [1, 3] }),
    ],
    insights: ['分治的正确性来自「跨中线的最近点对只可能落在宽度 2d 的条带内，且条带内按 y 排序后每个点只需检查 y 差小于 d 的后续点」。', '先分治求距离、再定向扫掠收集并列解，把「求值」与「定序」解耦，两步都保持 O(n log n) 级别。'],
    pitfalls: ['条带内的比较若不按 y 排序会退化成平方级，距离平方比较可以全程避开开方。', '输出必须用原始输入下标，分治排序后要先记住映射关系。'],
    solution: `def solve(data):
    pts = data["points"]
    n = len(pts)
    if n < 2:
        return {"distance2": None, "pair": []}
    order = sorted(range(n), key=lambda i: (pts[i][0], pts[i][1], i))

    def dist2(i, j):
        dx = pts[i][0] - pts[j][0]
        dy = pts[i][1] - pts[j][1]
        return dx * dx + dy * dy

    best = None

    def rec(lo, hi):
        nonlocal best
        if hi - lo <= 3:
            for a in range(lo, hi):
                for b in range(a + 1, hi):
                    d = dist2(order[a], order[b])
                    if best is None or d < best:
                        best = d
            return
        mid = (lo + hi) // 2
        rec(lo, mid)
        rec(mid, hi)
        midx = pts[order[mid]][0]
        strip = [order[k] for k in range(lo, hi) if (pts[order[k]][0] - midx) ** 2 < best]
        strip.sort(key=lambda i: (pts[i][1], pts[i][0], i))
        for a in range(len(strip)):
            for b in range(a + 1, len(strip)):
                if (pts[strip[b]][1] - pts[strip[a]][1]) ** 2 >= best:
                    break
                d = dist2(strip[a], strip[b])
                if d < best:
                    best = d

    rec(0, n)
    pair = None
    xs = order
    for a in range(n):
        i = xs[a]
        for b in range(a + 1, n):
            j = xs[b]
            dx = pts[j][0] - pts[i][0]
            if dx * dx > best:
                break
            if dist2(i, j) == best:
                cand = (i, j) if i < j else (j, i)
                if pair is None or cand < pair:
                    pair = cand
    return {"distance2": best, "pair": [pair[0], pair[1]]}
`,
  },

  'point-in-polygon': {
    statement: '判断查询点与简单多边形的关系：点在任一条边上返回 "boundary"；否则用射线法（水平向右射线，统计穿越边数）判断返回 "inside" 或 "outside"。交点坐标用精确分数比较，避免浮点误差。',
    input: 'data 为 {"polygon": [[x, y], ...], "queries": [[x, y], ...]}，多边形顶点按顺序给出（可 CW 或 CCW），坐标为整数。',
    output: '按查询顺序返回 "inside" / "outside" / "boundary" 数组。',
    constraints: ['3 <= n <= 10^3', '1 <= queries.length <= 10^3', '-10^6 <= 坐标 <= 10^6', '多边形边不自交'],
    examples: [
      example({ polygon: [[0, 0], [2, 0], [2, 2], [0, 2]], queries: [[1, 1], [2, 1], [3, 1]] }, ["inside", "boundary", "outside"]),
    ],
    tests: [
      example({ polygon: [[0, 0], [4, 0], [2, 4]], queries: [[2, 3], [0, 0], [-1, 1]] }, ["inside", "boundary", "outside"]),
      example({ polygon: [[0, 0], [2, 0], [2, 2], [0, 2]], queries: [[0, 0], [1, 2]] }, ["boundary", "boundary"]),
      example({ polygon: [[0, 0], [4, 2], [2, 4], [1, 1]], queries: [[1, 2], [3, 2]] }, ["outside", "inside"]),
    ],
    insights: ['射线法的关键不变量：每穿过一条边，内外状态翻转一次；端点重复计数用「一个端点严格在射线上方、另一个不严格在上方」的配对约定规避。', '「在边上」单独判定（共线 + 在包围盒内），优先于射线判断，浮点交点用分数精确表示。'],
    pitfalls: ['穿越判定写成 ay >= qy 会让恰好经过顶点的射线重复计数，必须一侧严格一侧不严格。', '共线检查与范围检查缺一不可，只看叉积为零会把延长线上的点误判为边界。'],
    solution: `from fractions import Fraction


def solve(data):
    poly = data["polygon"]
    n = len(poly)

    def on_segment(px, py, ax, ay, bx, by):
        if (bx - ax) * (py - ay) - (by - ay) * (px - ax) != 0:
            return False
        return min(ax, bx) <= px <= max(ax, bx) and min(ay, by) <= py <= max(ay, by)

    out = []
    for qx, qy in data["queries"]:
        boundary = False
        for k in range(n):
            ax, ay = poly[k]
            bx, by = poly[(k + 1) % n]
            if on_segment(qx, qy, ax, ay, bx, by):
                boundary = True
                break
        if boundary:
            out.append("boundary")
            continue
        inside = False
        for k in range(n):
            ax, ay = poly[k]
            bx, by = poly[(k + 1) % n]
            if (ay > qy) != (by > qy):
                x_int = Fraction(ax) + Fraction(qy - ay) * (bx - ax) / (by - ay)
                if x_int > qx:
                    inside = not inside
        out.append("inside" if inside else "outside")
    return out
`,
  },

  'sweep-line-intersection': {
    statement: '统计平面上 n 条线段产生的不同交点个数：对每对线段做精确求交（分母为零的平行线无交点；共线情形本题保证不出现），交点坐标用分数精确表示并去重后计数。',
    input: 'data 为 {"segments": [[x1, y1, x2, y2], ...]}，坐标为整数，任意两条线段不共线。',
    output: '返回不同交点的个数；共享端点也算一个交点。',
    constraints: ['1 <= n <= 100', '-100 <= 坐标 <= 100'],
    examples: [
      example({ segments: [[0, 0, 4, 4], [0, 4, 4, 0]] }, 1, '两条对角线交于 (2, 2)'),
    ],
    tests: [
      example({ segments: [[0, 0, 2, 0], [2, 0, 2, 2]] }, 1),
      example({ segments: [[0, 0, 4, 0], [0, 1, 4, 1]] }, 0),
      example({ segments: [[0, 0, 4, 4], [0, 4, 4, 0], [0, 2, 4, 2]] }, 1),
      example({ segments: [[0, 0, 1, 1]] }, 0),
    ],
    insights: ['线段求交拆成两步：先看所在直线是否相交（叉积作分母），再把交点限制回两条线段的包围盒内；端点相切与内部相交由此统一处理。', '「去重计数」要求精确坐标——整数端点的交点是有理数，用分数做键才不会把 (2, 2) 与 (2.0000001, 2) 混淆。'],
    pitfalls: ['平行且不共线的分母为零，必须先判后除。', '三条线共点时两两求交得到三个相同点，去重后才等于题意。'],
    solution: `from fractions import Fraction


def solve(data):
    segs = data["segments"]
    points = set()
    n = len(segs)
    for i in range(n):
        x1, y1, x2, y2 = segs[i]
        for j in range(i + 1, n):
            x3, y3, x4, y4 = segs[j]
            den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
            if den == 0:
                continue
            px = Fraction((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4), den)
            py = Fraction((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4), den)

            def on(xa, ya, xb, yb):
                return min(xa, xb) <= px <= max(xa, xb) and min(ya, yb) <= py <= max(ya, yb)

            if on(x1, y1, x2, y2) and on(x3, y3, x4, y4):
                points.add((px, py))
    return len(points)
`,
  },

  'rotating-calipers': {
    statement: '求平面点集的直径（最远点对距离）：先用单调链求凸包（共线点剔除），再用旋转卡壳在凸包顶点上扫出最大点距，返回距离的平方。实现枚举每条边并把对踵点推进到叉积开始减小的位置为止。',
    input: 'data 为 {"points": [[x, y], ...]}，点互不相同，坐标为整数。',
    output: '返回 {"diameter2": 最大点距的平方}；单点返回 0。',
    constraints: ['1 <= n <= 10^4', '-10^6 <= x, y <= 10^6'],
    examples: [
      example({ points: [[0, 0], [1, 0], [1, 1], [0, 1]] }, { diameter2: 2 }, '单位正方形的对角线平方为 2'),
    ],
    tests: [
      example({ points: [[0, 0], [3, 4]] }, { diameter2: 25 }),
      example({ points: [[7, 7]] }, { diameter2: 0 }),
      example({ points: [[0, 0], [2, 0], [1, 3], [0, 1], [2, 1]] }, { diameter2: 10 }),
      example({ points: [[0, 0], [1, 1], [2, 2]] }, { diameter2: 8 }),
    ],
    insights: ['直径两端点必是凸包的对踵点对：固定一条边时，与边距离最大的顶点随边单调前进——双指针各自只走一圈，总体 O(n)。', '距离平方全程整数运算，不需要开方；卡壳的正确性依赖凸包顶点剔除共线点后的严格凸性。'],
    pitfalls: ['推进对踵点要用叉积（面积）比较而不是斜率，斜率在竖直边处无定义。', '忘记同时检查 (i, j) 与 (i+1, j) 两对会让答案停在次优点上。'],
    solution: `def solve(data):
    pts = data["points"]
    n = len(pts)
    if n == 1:
        return {"diameter2": 0}
    order = sorted(range(n), key=lambda i: (pts[i][0], pts[i][1], i))

    def cross(o, a, b):
        return (pts[a][0] - pts[o][0]) * (pts[b][1] - pts[o][1]) - (pts[a][1] - pts[o][1]) * (pts[b][0] - pts[o][0])

    lower = []
    for i in order:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], i) <= 0:
            lower.pop()
        lower.append(i)
    upper = []
    for i in reversed(order):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], i) <= 0:
            upper.pop()
        upper.append(i)
    hull = lower[:-1] + upper[:-1]
    m = len(hull)
    if m == 1:
        return {"diameter2": 0}
    if m == 2:
        a, b = hull
        return {"diameter2": (pts[a][0] - pts[b][0]) ** 2 + (pts[a][1] - pts[b][1]) ** 2}
    best = 0
    j = 1
    for i in range(m):
        ni = (i + 1) % m
        ex = pts[ni][0] - pts[i][0]
        ey = pts[ni][1] - pts[i][1]
        while True:
            nj = (j + 1) % m
            cj = abs(ex * (pts[hull[j]][1] - pts[i][1]) - ey * (pts[hull[j]][0] - pts[i][0]))
            cnj = abs(ex * (pts[hull[nj]][1] - pts[i][1]) - ey * (pts[hull[nj]][0] - pts[i][0]))
            if cnj > cj:
                j = nj
            else:
                break
        for a in (hull[i], hull[ni]):
            b = hull[j]
            d = (pts[a][0] - pts[b][0]) ** 2 + (pts[a][1] - pts[b][1]) ** 2
            if d > best:
                best = d
    return {"diameter2": best}
`,
  },

  'half-plane-intersection': {
    statement: '求若干半平面 ax + by <= c 的公共交集：从一个足够大的矩形出发，按输入顺序用每个半平面做多边形裁剪（Sutherland–Hodgman 式逐边裁剪），最后返回交集是否非空及其面积（保留 3 位小数）。',
    input: 'data 为 {"halfplanes": [[a, b, c], ...]}，系数为整数，表示 ax + by <= c。',
    output: '返回 {"nonempty": 布尔, "area": 面积（3 位小数）}；交集为空时面积为 0.0。裁剪矩形为 [-10^6, 10^6]²，测试不涉及边界相切的特殊退化。',
    constraints: ['1 <= halfplanes.length <= 50', '-100 <= a, b, c <= 100 且 a, b 不同时为 0'],
    examples: [
      example({ halfplanes: [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1]] }, { nonempty: true, area: 4.0 }, '四个半平面围出 [-1,1]² 正方形'),
    ],
    tests: [
      example({ halfplanes: [[1, 0, -1], [-1, 0, -1]] }, { nonempty: false, area: 0.0 }),
      example({ halfplanes: [[1, 0, 2]] }, { nonempty: true, area: 2000004000000.0 }),
      example({ halfplanes: [[1, 1, 2], [-1, 1, 2], [0, -1, 0]] }, { nonempty: true, area: 4.0 }),
    ],
    insights: ['增量裁剪的不变量：处理完前 k 个半平面后，当前多边形恰好是它们的公共交集（与初始矩形的交）；每条新半平面只可能切掉一段连续顶点链。', '交点用参数 t = fp / (fp - fq) 线性插值，一进一出两条边各产生一个新顶点，顶点顺序保持不变。'],
    pitfalls: ['判断「保留」时用带容差的不等式，把恰好落在边界上的顶点也算作保留，否则零面积缝隙会误判为空。', '初始矩形必须足够大且覆盖所有半平面的可能交域，矩形顶点序要与裁剪方向一致。'],
    solution: `def solve(data):
    EPS = 1e-9
    BIG = 1e6
    poly = [[-BIG, -BIG], [BIG, -BIG], [BIG, BIG], [-BIG, BIG]]

    def clip(poly, a, b, c):
        if not poly:
            return []
        res = []
        m = len(poly)
        for k in range(m):
            px, py = poly[k]
            qx, qy = poly[(k + 1) % m]
            fp = a * px + b * py - c
            fq = a * qx + b * qy - c
            if fp <= EPS:
                res.append([px, py])
            if (fp < -EPS and fq > EPS) or (fp > EPS and fq < -EPS):
                t = fp / (fp - fq)
                res.append([px + (qx - px) * t, py + (qy - py) * t])
        return res

    for a, b, c in data["halfplanes"]:
        poly = clip(poly, a, b, c)
        if not poly:
            break
    area = 0.0
    m = len(poly)
    for k in range(m):
        x1, y1 = poly[k]
        x2, y2 = poly[(k + 1) % m]
        area += x1 * y2 - x2 * y1
    area = abs(area) / 2.0
    return {"nonempty": m >= 3 and area > EPS, "area": round(area, 3)}
`,
  },

  'delaunay-triangulation': {
    statement: '对给定的整数点集构建 Delaunay 三角剖分：使用 Bowyer–Watson 增量算法，从覆盖全部点的超级三角形开始，逐点插入、删除外接圆包含该点的退化三角形、用空腔边界与新点重新连三角形，最后剔除与超级三角形顶点相关的三角形。保证任意四点不共圆。',
    input: 'data 为 {"points": [[x, y], ...]}，点互不相同，坐标为整数。',
    output: '返回三角形数组，每个三角形为 [i, j, k]（下标升序），整个数组按字典序排序；点数不足 3 返回空数组。',
    constraints: ['3 <= n <= 40', '-100 <= x, y <= 100', '任意四点不共圆'],
    examples: [
      example({ points: [[0, 0], [4, 0], [0, 4]] }, [[0, 1, 2]]),
    ],
    tests: [
      example({ points: [[0, 0], [2, 0], [0, 2], [3, 3]] }, [[0, 1, 2], [1, 2, 3]]),
      example({ points: [[0, 0], [4, 0], [2, 2], [4, 4], [0, 4]] }, [[0, 1, 2], [0, 2, 4], [1, 2, 3], [2, 3, 4]]),
      example({ points: [[5, 5]] }, []),
    ],
    insights: ['空腔（cavity）的正确刻画：被删除三角形的边按无向边计数，恰好出现一次的即空腔边界；重建时沿用该边在原三角形中的方向与新点相连，保证新三角形仍为 CCW。', '外接圆判定用行列式（点相对三角形外心的幂），顶点按 CCW 排列时「在圆内」对应行列式为正。'],
    pitfalls: ['共享边在两个三角形中方向相反，若按有向边计数，内部边会被误判为边界，剖分会重叠或漏三角形。', '超级三角形要足够大，否则其外接圆可能罩不住应删除的三角形。'],
    solution: `def solve(data):
    pts = data["points"]
    n = len(pts)
    if n < 3:
        return []
    minx = min(p[0] for p in pts)
    maxx = max(p[0] for p in pts)
    miny = min(p[1] for p in pts)
    maxy = max(p[1] for p in pts)
    dmax = max(maxx - minx, maxy - miny, 1) * 10
    midx = (minx + maxx) / 2
    midy = (miny + maxy) / 2
    all_pts = [(float(p[0]), float(p[1])) for p in pts]
    all_pts.append((midx - dmax, midy - dmax))
    all_pts.append((midx + dmax, midy - dmax))
    all_pts.append((midx, midy + dmax))
    triangles = [(n, n + 1, n + 2)]

    def in_circle(tri, px, py):
        ax, ay = all_pts[tri[0]]
        bx, by = all_pts[tri[1]]
        cx, cy = all_pts[tri[2]]
        adx, ady = ax - px, ay - py
        bdx, bdy = bx - px, by - py
        cdx, cdy = cx - px, cy - py
        adet = adx * adx + ady * ady
        bdet = bdx * bdx + bdy * bdy
        cdet = cdx * cdx + cdy * cdy
        det = adx * (bdy * cdet - bdet * cdy) - ady * (bdx * cdet - bdet * cdx) + adet * (bdx * cdy - bdy * cdx)
        return det > 1e-12

    for i in range(n):
        px, py = all_pts[i]
        bad = [t for t in triangles if in_circle(t, px, py)]
        bad_set = set(bad)
        edge_count = {}
        edge_direction = {}
        for t in bad:
            for a, b in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
                key = (a, b) if a < b else (b, a)
                edge_count[key] = edge_count.get(key, 0) + 1
                edge_direction[key] = (a, b)
        triangles = [t for t in triangles if t not in bad_set]
        for key, cnt in edge_count.items():
            if cnt == 1:
                a, b = edge_direction[key]
                triangles.append((a, b, i))
    result = sorted(sorted(t) for t in triangles if all(v < n for v in t))
    return result
`,
  },

  'voronoi-relaxation': {
    statement: '实现 Voronoi 图的一轮 Lloyd 松弛：在给定矩形边界内，每个站点的 cell 定义为「到该站点的距离不超过到任何其他站点距离」的区域（等价于用所有站点对的垂直平分线裁剪矩形），cell 的质心即站点的新位置。返回所有新位置的坐标（保留 3 位小数）。',
    input: 'data 为 {"points": [[x, y], ...], "bounds": [xmin, ymin, xmax, ymax], "iterations": 正整数}，点互不相同且都在 bounds 内。',
    output: '按输入顺序返回新站点坐标数组，每个为 [round(x, 3), round(y, 3)]。',
    constraints: ['1 <= n <= 30', '1 <= iterations <= 3', '-100 <= 坐标 <= 100', 'bounds 覆盖所有点且面积 > 0'],
    examples: [
      example({ points: [[0, 0], [2, 0]], bounds: [-2, -1, 4, 1], iterations: 1 }, [[-0.5, 0.0], [2.5, 0.0]]),
    ],
    tests: [
      example({ points: [[1, 1]], bounds: [0, 0, 2, 2], iterations: 1 }, [[1.0, 1.0]]),
      example({ points: [[0, 0], [2, 0]], bounds: [-2, -1, 4, 1], iterations: 2 }, [[-0.5, 0.0], [2.5, 0.0]]),
      example({ points: [[0, 0], [4, 0], [2, 4]], bounds: [-2, -2, 6, 6], iterations: 1 }, [[-0.148, 0.287], [4.148, 0.287], [2.0, 4.202]]),
    ],
    insights: ['cell 的等价刻画是关键：与其先算 Voronoi 图再取 cell，不如直接用「对每个其他站点的垂直平分线做半平面裁剪」，n-1 次裁剪就得到精确 cell。', 'Lloyd 松弛让站点分布均匀化：每次迭代后所有 cell 的质心都移向 cell 的「重心」，面积大的 cell 的站点会被拉进去。'],
    pitfalls: ['质心公式是 Σ(x1+x2)·叉积 / (6·面积)，漏掉 6 倍因子或忘记判零面积会得到错值。', 'cell 必须与给定矩形再求交，否则无界区域会让质心跑到无穷远。'],
    solution: `def solve(data):
    points = [(float(p[0]), float(p[1])) for p in data["points"]]
    xmin, ymin, xmax, ymax = data["bounds"]
    iterations = int(data["iterations"])
    BIG = 1e6
    poly = [
        [max(xmin, -BIG), max(ymin, -BIG)],
        [min(xmax, BIG), max(ymin, -BIG)],
        [min(xmax, BIG), min(ymax, BIG)],
        [max(xmin, -BIG), min(ymax, BIG)],
    ]

    def clip(poly, a, b, c):
        if not poly:
            return []
        res = []
        m = len(poly)
        for k in range(m):
            px, py = poly[k]
            qx, qy = poly[(k + 1) % m]
            fp = a * px + b * py - c
            fq = a * qx + b * qy - c
            if fp <= 1e-9:
                res.append([px, py])
            if (fp < -1e-9 and fq > 1e-9) or (fp > 1e-9 and fq < -1e-9):
                t = fp / (fp - fq)
                res.append([px + (qx - px) * t, py + (qy - py) * t])
        return res

    def centroid(poly, fallback):
        area = 0.0
        cx = 0.0
        cy = 0.0
        m = len(poly)
        for k in range(m):
            x1, y1 = poly[k]
            x2, y2 = poly[(k + 1) % m]
            cr = x1 * y2 - x2 * y1
            area += cr
            cx += (x1 + x2) * cr
            cy += (y1 + y2) * cr
        if abs(area) < 1e-9:
            return fallback
        return (cx / (3.0 * area), cy / (3.0 * area))

    sites = list(points)
    for _ in range(iterations):
        moved = []
        for i, (xi, yi) in enumerate(sites):
            cell = [list(v) for v in poly]
            for j, (xj, yj) in enumerate(sites):
                if j == i:
                    continue
                a = 2 * (xj - xi)
                b = 2 * (yj - yi)
                c = xj * xj + yj * yj - xi * xi - yi * yi
                cell = clip(cell, a, b, c)
            gx, gy = centroid(cell, (xi, yi))
            moved.append((round(gx, 3), round(gy, 3)))
        sites = moved
    return [[x, y] for x, y in sites]
`,
  },
};
