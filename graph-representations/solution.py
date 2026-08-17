def solve(data):
    graph = {}
    for start, end in data["edges"]:
        graph.setdefault(start, set()).add(end)
        graph.setdefault(end, set())
        if not data["directed"]: graph[end].add(start)
    return {node: sorted(graph[node]) for node in sorted(graph)}
