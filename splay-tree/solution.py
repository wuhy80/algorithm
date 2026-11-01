def solve(data):
    keys = list(data["keys"])
    nodes = []
    root_holder = [-1]

    def rotate_up(c):
        p = nodes[c][3]
        if nodes[p][1] == c:
            nodes[p][1] = nodes[c][2]
            if nodes[c][2] != -1:
                nodes[nodes[c][2]][3] = p
            nodes[c][2] = p
        else:
            nodes[p][2] = nodes[c][1]
            if nodes[c][1] != -1:
                nodes[nodes[c][1]][3] = p
            nodes[c][1] = p
        nodes[c][3] = nodes[p][3]
        nodes[p][3] = c
        if nodes[c][3] != -1:
            if nodes[nodes[c][3]][1] == p:
                nodes[nodes[c][3]][1] = c
            else:
                nodes[nodes[c][3]][2] = c

    def splay(c):
        while nodes[c][3] != -1:
            p = nodes[c][3]
            g = nodes[p][3]
            if g == -1:
                rotate_up(c)
            elif (nodes[g][1] == p) == (nodes[p][1] == c):
                rotate_up(p)
                rotate_up(c)
            else:
                rotate_up(c)
                rotate_up(c)
        root_holder[0] = c

    for key in keys:
        root = root_holder[0]
        if root == -1:
            nodes.append([key, -1, -1, -1])
            root_holder[0] = 0
            continue
        cur = root
        while True:
            if key == nodes[cur][0]:
                splay(cur)
                break
            side = 1 if key < nodes[cur][0] else 2
            if nodes[cur][side] == -1:
                nodes.append([key, -1, -1, cur])
                nodes[cur][side] = len(nodes) - 1
                splay(len(nodes) - 1)
                break
            cur = nodes[cur][side]
    order = []
    stack = [root_holder[0]] if root_holder[0] != -1 else []
    while stack:
        i = stack.pop()
        order.append(nodes[i][0])
        if nodes[i][2] != -1:
            stack.append(nodes[i][2])
        if nodes[i][1] != -1:
            stack.append(nodes[i][1])
    return order
