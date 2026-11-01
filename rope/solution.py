def solve(data):
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
