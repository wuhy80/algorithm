def solve(data):
    n = int(data["n"])
    k = int(data["k"])
    if n == 1:
        return {"order": [], "survivor": 1}
    ring = list(range(1, n + 1))
    pos = 0
    order = []
    while len(ring) > 1:
        pos = (pos + k - 1) % len(ring)
        order.append(ring.pop(pos))
    return {"order": order, "survivor": ring[0]}
