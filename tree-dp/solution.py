def solve(data):
    n = data["n"]
    if n == 0:
        return 0
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        graph[left].append(right); graph[right].append(left)
    visited = [False] * n
    def visit(node):
        visited[node] = True
        take = data["weights"][node]
        skip = 0
        for neighbor in graph[node]:
            if visited[neighbor]:
                continue
            child_take, child_skip = visit(neighbor)
            take += child_skip
            skip += max(child_take, child_skip)
        return take, skip
    answer = 0
    for node in range(n):
        if not visited[node]:
            take, skip = visit(node)
            answer += max(0, take, skip)
    return answer
