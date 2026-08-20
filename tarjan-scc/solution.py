def solve(data):
    n = data["n"]
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        graph[left].append(right)
    dfn = [-1] * n; low = [0] * n; stack = []; on_stack = [False] * n
    timer = 0; components = []
    def visit(node):
        nonlocal timer
        dfn[node] = low[node] = timer; timer += 1
        stack.append(node); on_stack[node] = True
        for neighbor in graph[node]:
            if dfn[neighbor] == -1:
                visit(neighbor); low[node] = min(low[node], low[neighbor])
            elif on_stack[neighbor]:
                low[node] = min(low[node], dfn[neighbor])
        if low[node] == dfn[node]:
            component = []
            while True:
                current = stack.pop(); on_stack[current] = False; component.append(current)
                if current == node:
                    break
            components.append(sorted(component))
    for node in range(n):
        if dfn[node] == -1:
            visit(node)
    return sorted(components)
