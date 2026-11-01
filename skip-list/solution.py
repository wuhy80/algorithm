def solve(data):
    keys = list(data["keys"])
    state = int(data["seed"]) & 0xffffffff
    level_of = {}
    for k in keys:
        if k in level_of:
            continue
        state = (state * 1664525 + 1013904223) & 0xffffffff
        level_of[k] = state % 4 + 1
    out = []
    for level in range(4, 0, -1):
        out.append(sorted(k for k, lv in level_of.items() if lv >= level))
    return out
