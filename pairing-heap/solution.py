def solve(data):
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
