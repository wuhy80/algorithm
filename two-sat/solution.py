def solve(data):
    variables = data["variables"]
    graph = [[] for _ in range(variables * 2)]
    def node(literal):
        variable = abs(literal) - 1
        return 2 * variable + (0 if literal > 0 else 1)
    for first, second in data["clauses"]:
        if first == 0 or second == 0:
            return False
        left, right = node(first), node(second)
        graph[left ^ 1].append(right); graph[right ^ 1].append(left)
    index = 0; stack = []; on_stack = [False] * len(graph)
    dfn = [-1] * len(graph); low = [0] * len(graph); component = [-1] * len(graph)
    def visit(current):
        nonlocal index
        dfn[current] = low[current] = index; index += 1
        stack.append(current); on_stack[current] = True
        for neighbor in graph[current]:
            if dfn[neighbor] == -1:
                visit(neighbor); low[current] = min(low[current], low[neighbor])
            elif on_stack[neighbor]:
                low[current] = min(low[current], dfn[neighbor])
        if low[current] == dfn[current]:
            while True:
                popped = stack.pop(); on_stack[popped] = False; component[popped] = current
                if popped == current:
                    break
    for current in range(len(graph)):
        if dfn[current] == -1:
            visit(current)
    return all(component[2 * variable] != component[2 * variable + 1] for variable in range(variables))
