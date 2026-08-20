def solve(data):
    n = data["n"]
    graph = [[] for _ in range(n)]
    for edge_id, (left, right) in enumerate(data["edges"]):
        graph[left].append((right, edge_id)); graph[right].append((left, edge_id))
    order = [-1] * n
    low = [0] * n
    articulation = set()
    bridges = []
    timer = 0

    def visit(node, parent_edge):
        nonlocal timer
        order[node] = low[node] = timer; timer += 1
        children = 0
        for neighbor, edge_id in graph[node]:
            if edge_id == parent_edge:
                continue
            if order[neighbor] == -1:
                children += 1
                visit(neighbor, edge_id)
                low[node] = min(low[node], low[neighbor])
                if parent_edge != -1 and low[neighbor] >= order[node]:
                    articulation.add(node)
                if low[neighbor] > order[node]:
                    bridges.append(sorted([node, neighbor]))
            else:
                low[node] = min(low[node], order[neighbor])
        if parent_edge == -1 and children > 1:
            articulation.add(node)

    for node in range(n):
        if order[node] == -1:
            visit(node, -1)
    return {"bridges": sorted(bridges), "articulation": sorted(articulation)}
