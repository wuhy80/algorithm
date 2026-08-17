def solve(data):
    parent = list(range(data["n"]))
    size = [1] * data["n"]
    def find(node):
        while node != parent[node]:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node
    output = []
    for name, a, b in data["operations"]:
        ra, rb = find(a), find(b)
        if name == "connected": output.append(ra == rb)
        elif ra != rb:
            if size[ra] < size[rb]: ra, rb = rb, ra
            parent[rb] = ra; size[ra] += size[rb]
    return output
