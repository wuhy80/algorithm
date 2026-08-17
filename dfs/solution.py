def solve(data):
    graph = {}
    for a, b in data["edges"]:
        graph.setdefault(a, []).append(b); graph.setdefault(b, []).append(a)
    seen, order = set(), []
    def visit(node):
        seen.add(node); order.append(node)
        for neighbor in sorted(graph.get(node, [])):
            if neighbor not in seen: visit(neighbor)
    visit(data["start"])
    return order
