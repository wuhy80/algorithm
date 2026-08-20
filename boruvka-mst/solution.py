def solve(data):
    n = data["n"]
    parent = list(range(n))
    size = [1] * n
    def find(node):
        while parent[node] != node:
            parent[node] = parent[parent[node]]; node = parent[node]
        return node
    total, components = 0, n
    while components > 1:
        cheapest = [None] * n
        for left, right, weight in data["edges"]:
            root_left, root_right = find(left), find(right)
            if root_left == root_right:
                continue
            if cheapest[root_left] is None or weight < cheapest[root_left][2]:
                cheapest[root_left] = (left, right, weight)
            if cheapest[root_right] is None or weight < cheapest[root_right][2]:
                cheapest[root_right] = (left, right, weight)
        merged = False
        for edge in cheapest:
            if edge is None:
                continue
            left, right, weight = edge
            root_left, root_right = find(left), find(right)
            if root_left == root_right:
                continue
            if size[root_left] < size[root_right]:
                root_left, root_right = root_right, root_left
            parent[root_right] = root_left; size[root_left] += size[root_right]
            total += weight; components -= 1; merged = True
        if not merged:
            return -1
    return total
