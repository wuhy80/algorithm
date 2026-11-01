def solve(data):
    items = [(int(w), int(v)) for w, v in data["items"]]
    capacity = int(data["capacity"])
    order = sorted(range(len(items)), key=lambda i: -(items[i][1] / items[i][0]))
    best = [0]

    def bound(idx, weight_left):
        total = 0
        for i in order[idx:]:
            w, v = items[i]
            if w <= weight_left:
                weight_left -= w
                total += v
            else:
                total += v * weight_left / w
                break
        return total

    def search(idx, weight_used, value):
        if value > best[0]:
            best[0] = value
        if idx == len(items):
            return
        w, v = items[order[idx]]
        if weight_used + w <= capacity and value + v + bound(idx + 1, capacity - weight_used - w) > best[0]:
            search(idx + 1, weight_used + w, value + v)
        if value + bound(idx + 1, capacity - weight_used) > best[0]:
            search(idx + 1, weight_used, value)

    search(0, 0, 0)
    return best[0]
