def solve(data):
    nodes = []

    def height(i):
        return nodes[i][3] if i != -1 else 0

    def update(i):
        nodes[i][3] = 1 + max(height(nodes[i][1]), height(nodes[i][2]))

    def rotate_right(i):
        l = nodes[i][1]
        nodes[i][1] = nodes[l][2]
        nodes[l][2] = i
        update(i)
        update(l)
        return l

    def rotate_left(i):
        r = nodes[i][2]
        nodes[i][2] = nodes[r][1]
        nodes[r][1] = i
        update(i)
        update(r)
        return r

    def insert(i, key):
        if i == -1:
            nodes.append([key, -1, -1, 1])
            return len(nodes) - 1
        if key < nodes[i][0]:
            nodes[i][1] = insert(nodes[i][1], key)
        elif key > nodes[i][0]:
            nodes[i][2] = insert(nodes[i][2], key)
        else:
            return i
        update(i)
        balance = height(nodes[i][1]) - height(nodes[i][2])
        if balance > 1:
            if key < nodes[nodes[i][1]][0]:
                return rotate_right(i)
            nodes[i][1] = rotate_left(nodes[i][1])
            return rotate_right(i)
        if balance < -1:
            if key > nodes[nodes[i][2]][0]:
                return rotate_left(i)
            nodes[i][2] = rotate_right(nodes[i][2])
            return rotate_left(i)
        return i

    root = -1
    for k in data["keys"]:
        root = insert(root, k)
    order = []
    stack = [root] if root != -1 else []
    while stack:
        i = stack.pop()
        order.append(nodes[i][0])
        if nodes[i][2] != -1:
            stack.append(nodes[i][2])
        if nodes[i][1] != -1:
            stack.append(nodes[i][1])
    return order
