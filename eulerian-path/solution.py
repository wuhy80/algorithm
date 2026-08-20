def solve(data):
    n, edges = data["n"], data["edges"]
    out_degree = [0] * n
    in_degree = [0] * n
    graph = [[] for _ in range(n)]
    for left, right in edges:
        graph[left].append(right)
        out_degree[left] += 1; in_degree[right] += 1
    starts = [node for node in range(n) if out_degree[node] == in_degree[node] + 1]
    ends = [node for node in range(n) if in_degree[node] == out_degree[node] + 1]
    if starts and (len(starts) != 1 or len(ends) != 1):
        return []
    if not starts and any(in_degree[node] != out_degree[node] for node in range(n)):
        return []
    if starts:
        start = starts[0]
    else:
        start = next((node for node in range(n) if out_degree[node]), 0)
    for adjacency in graph:
        adjacency.sort(reverse=True)
    stack, path = [start], []
    while stack:
        node = stack[-1]
        if graph[node]:
            stack.append(graph[node].pop())
        else:
            path.append(stack.pop())
    path.reverse()
    return path if len(path) == len(edges) + 1 else []
