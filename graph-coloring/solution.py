def solve(data):
    n, k = data["n"], data["k"]
    if n == 0:
        return True
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        if left == right:
            return False
        graph[left].append(right); graph[right].append(left)
    colors = [-1] * n
    order = sorted(range(n), key=lambda node: len(graph[node]), reverse=True)
    def search(position):
        if position == n:
            return True
        node = order[position]
        forbidden = {colors[neighbor] for neighbor in graph[node] if colors[neighbor] != -1}
        for color in range(k):
            if color in forbidden:
                continue
            colors[node] = color
            if search(position + 1):
                return True
        colors[node] = -1
        return False
    return search(0)
