def solve(data):
    cost = data
    n = len(cost)
    if n == 0:
        return 0
    u = [0] * (n + 1)
    v = [0] * (n + 1)
    match = [0] * (n + 1)
    for row in range(1, n + 1):
        match[0] = row
        column = 0
        minimum = [10**18] * (n + 1)
        used = [False] * (n + 1)
        way = [0] * (n + 1)
        while True:
            used[column] = True
            current_row = match[column]
            delta, next_column = 10**18, 0
            for candidate in range(1, n + 1):
                if used[candidate]:
                    continue
                reduced = cost[current_row - 1][candidate - 1] - u[current_row] - v[candidate]
                if reduced < minimum[candidate]:
                    minimum[candidate] = reduced; way[candidate] = column
                if minimum[candidate] < delta:
                    delta, next_column = minimum[candidate], candidate
            for candidate in range(n + 1):
                if used[candidate]:
                    u[match[candidate]] += delta
                    v[candidate] -= delta
                else:
                    minimum[candidate] -= delta
            column = next_column
            if match[column] == 0:
                break
        while True:
            previous = way[column]
            match[column] = match[previous]
            column = previous
            if column == 0:
                break
    assignment = [0] * n
    for column in range(1, n + 1):
        assignment[match[column] - 1] = column - 1
    return sum(cost[row][assignment[row]] for row in range(n))
