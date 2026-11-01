def solve(data):
    nil = 0
    nodes = [[0, 0, 0, 0, "B"]]
    root = 0

    def left_rotate(x):
        y = nodes[x][2]
        nodes[x][2] = nodes[y][1]
        if nodes[y][1] != nil:
            nodes[nodes[y][1]][3] = x
        nodes[y][3] = nodes[x][3]
        if nodes[x][3] == nil:
            nonlocal_root[0] = y
        elif nodes[nodes[x][3]][1] == x:
            nodes[nodes[x][3]][1] = y
        else:
            nodes[nodes[x][3]][2] = y
        nodes[y][1] = x
        nodes[x][3] = y

    def right_rotate(x):
        y = nodes[x][1]
        nodes[x][1] = nodes[y][2]
        if nodes[y][2] != nil:
            nodes[nodes[y][2]][3] = x
        nodes[y][3] = nodes[x][3]
        if nodes[x][3] == nil:
            nonlocal_root[0] = y
        elif nodes[nodes[x][3]][2] == x:
            nodes[nodes[x][3]][2] = y
        else:
            nodes[nodes[x][3]][1] = y
        nodes[y][2] = x
        nodes[x][3] = y

    def insert(key):
        y = nil
        x = nonlocal_root[0]
        while x != nil:
            y = x
            if key < nodes[x][0]:
                x = nodes[x][1]
            elif key > nodes[x][0]:
                x = nodes[x][2]
            else:
                return
        z = len(nodes)
        nodes.append([key, nil, nil, y, "R"])
        if y == nil:
            nonlocal_root[0] = z
        elif key < nodes[y][0]:
            nodes[y][1] = z
        else:
            nodes[y][2] = z
        while nodes[z][3] != nil and nodes[nodes[z][3]][4] == "R":
            p = nodes[z][3]
            g = nodes[p][3]
            if p == nodes[g][1]:
                uncle = nodes[g][2]
                if nodes[uncle][4] == "R":
                    nodes[p][4] = "B"
                    nodes[uncle][4] = "B"
                    nodes[g][4] = "R"
                    z = g
                else:
                    if z == nodes[p][2]:
                        z = p
                        left_rotate(z)
                        p = nodes[z][3]
                        g = nodes[p][3]
                    nodes[p][4] = "B"
                    nodes[g][4] = "R"
                    right_rotate(g)
            else:
                uncle = nodes[g][1]
                if nodes[uncle][4] == "R":
                    nodes[p][4] = "B"
                    nodes[uncle][4] = "B"
                    nodes[g][4] = "R"
                    z = g
                else:
                    if z == nodes[p][1]:
                        z = p
                        right_rotate(z)
                        p = nodes[z][3]
                        g = nodes[p][3]
                    nodes[p][4] = "B"
                    nodes[g][4] = "R"
                    left_rotate(g)
        nodes[nonlocal_root[0]][4] = "B"

    nonlocal_root = [0]
    for k in data["keys"]:
        insert(k)
    order = []
    stack = [nonlocal_root[0]] if nonlocal_root[0] != nil else []
    while stack:
        i = stack.pop()
        order.append([nodes[i][0], nodes[i][4]])
        if nodes[i][2] != nil:
            stack.append(nodes[i][2])
        if nodes[i][1] != nil:
            stack.append(nodes[i][1])
    return order
