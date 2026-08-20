def solve(data):
    parent = list(range(data["n"]))
    size = [1] * data["n"]

    def find(node):
        while parent[node] != node:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node

    total = used = 0
    for left, right, weight in sorted(data["edges"], key=lambda edge: edge[2]):
        root_left, root_right = find(left), find(right)
        if root_left == root_right:
            continue
        if size[root_left] < size[root_right]:
            root_left, root_right = root_right, root_left
        parent[root_right] = root_left
        size[root_left] += size[root_right]
        total += weight
        used += 1
    return total if used == data["n"] - 1 else -1
