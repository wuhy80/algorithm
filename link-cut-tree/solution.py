def solve(data):
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
