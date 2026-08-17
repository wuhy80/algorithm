def solve(data):
    graph = {node: [] for node in data["nodes"]}
    for a, b in data["edges"]:
        graph[a].append(b); graph[b].append(a)
    seen, components = set(), []
    for start in sorted(data["nodes"]):
        if start in seen: continue
        stack, component = [start], []
        seen.add(start)
        while stack:
            node = stack.pop(); component.append(node)
            for neighbor in graph[node]:
                if neighbor not in seen: seen.add(neighbor); stack.append(neighbor)
        components.append(sorted(component))
    return components
