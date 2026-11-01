def solve(data):
    nodes = []
    root = -1

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
        left_size = nodes[nodes[i][1]][3] if nodes[i][1] != -1 else 0
        right_size = nodes[nodes[i][2]][3] if nodes[i][2] != -1 else 0
        nodes[i][3] = 1 + left_size + right_size
        return i

    def kth(i, k):
        while True:
            left = nodes[i][1]
            left_size = nodes[left][3] if left != -1 else 0
            if k <= left_size:
                i = left
            elif k == left_size + 1:
                return nodes[i][0]
            else:
                k -= left_size + 1
                i = nodes[i][2]

    def rank_of(x):
        total = 1
        cur = root
        while cur != -1:
            left = nodes[cur][1]
            left_size = nodes[left][3] if left != -1 else 0
            if x == nodes[cur][0]:
                return total + left_size
            if x < nodes[cur][0]:
                cur = left
            else:
                total += left_size + 1
                cur = nodes[cur][2]
        return -1

    for key in data["keys"]:
        root = insert(root, key)
    out = []
    for query in data["queries"]:
        if query[0] == "kth":
            out.append(kth(root, query[1]))
        else:
            out.append(rank_of(query[1]))
    return out
