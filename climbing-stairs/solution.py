def solve(data):
    previous, current = 1, 1
    for _ in range(data):
        previous, current = current, previous + current
    return previous
