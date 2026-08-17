from collections import deque

def solve(data):
    graph = {}
    for a, b in data["edges"]:
        graph.setdefault(a, []).append(b); graph.setdefault(b, []).append(a)
    queue, seen, order = deque([data["start"]]), {data["start"]}, []
    while queue:
        node = queue.popleft(); order.append(node)
        for neighbor in sorted(graph.get(node, [])):
            if neighbor not in seen:
                seen.add(neighbor); queue.append(neighbor)
    return order
