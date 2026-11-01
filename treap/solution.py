def solve(data):
    keys = list(data["keys"])
    state = int(data["seed"]) & 0xffffffff
    nodes = []

    def insert(i, key, pri):
        if i == -1:
            nodes.append([key, pri, -1, -1])
            return len(nodes) - 1
        node = nodes[i]
        if key < node[0]:
            node[2] = insert(node[2], key, pri)
            if nodes[node[2]][1] > node[1]:
                left = node[2]
                node[2] = nodes[left][3]
                nodes[left][3] = i
                return left
        elif key > node[0]:
            node[3] = insert(node[3], key, pri)
            if nodes[node[3]][1] > node[1]:
                right = node[3]
                node[3] = nodes[right][2]
                nodes[right][2] = i
                return right
        return i

    root = -1
    for k in keys:
        if any(existing[0] == k for existing in nodes):
            continue
        state = (state * 1664525 + 1013904223) & 0xffffffff
        root = insert(root, k, state)
    order = []
    stack = [root] if root != -1 else []
    while stack:
        i = stack.pop()
        order.append([nodes[i][0], nodes[i][1]])
        if nodes[i][3] != -1:
            stack.append(nodes[i][3])
        if nodes[i][2] != -1:
            stack.append(nodes[i][2])
    return order
