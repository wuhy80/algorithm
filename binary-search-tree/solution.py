def solve(data):
    keys = list(data["keys"])
    nodes = []
    root = -1
    for k in keys:
        if root == -1:
            nodes.append([k, -1, -1])
            root = 0
            continue
        cur = root
        while True:
            if k == nodes[cur][0]:
                break
            side = 1 if k < nodes[cur][0] else 2
            if nodes[cur][side] == -1:
                nodes.append([k, -1, -1])
                nodes[cur][side] = len(nodes) - 1
                break
            cur = nodes[cur][side]
    order = []
    queue = [root] if root != -1 else []
    while queue:
        nxt = []
        for idx in queue:
            order.append(nodes[idx][0])
            if nodes[idx][1] != -1:
                nxt.append(nodes[idx][1])
            if nodes[idx][2] != -1:
                nxt.append(nodes[idx][2])
        queue = nxt
    return order
