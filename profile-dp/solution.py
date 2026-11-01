def solve(data):
    n = int(data["n"])
    m = int(data["m"])
    if (n * m) % 2 == 1:
        return 0
    current = {0: 1}
    for row in range(n):
        for col in range(m):
            nxt = {}
            for state, ways in current.items():
                if state & 1:
                    new_state = state >> 1
                    nxt[new_state] = nxt.get(new_state, 0) + ways
                    continue
                base = state >> 1
                vertical = base | (1 << (m - 1))
                nxt[vertical] = nxt.get(vertical, 0) + ways
                if col < m - 1 and (state & 2) == 0:
                    horizontal = (state | 2) >> 1
                    nxt[horizontal] = nxt.get(horizontal, 0) + ways
            current = nxt
    return current.get(0, 0)
