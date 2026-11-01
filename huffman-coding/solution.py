import heapq


def solve(data):
    freqs = data["freqs"]
    symbols = sorted(freqs)
    heap = []
    counter = 0
    for sym in symbols:
        heap.append((freqs[sym], counter, ("leaf", sym)))
        counter += 1
    heapq.heapify(heap)
    if len(heap) == 1:
        return {"codes": {symbols[0]: "0"}, "total_bits": freqs[symbols[0]]}
    while len(heap) > 1:
        f1, s1, t1 = heapq.heappop(heap)
        f2, s2, t2 = heapq.heappop(heap)
        heapq.heappush(heap, (f1 + f2, counter, ("node", t1, t2)))
        counter += 1
    root = heap[0][2]
    codes = {}
    stack = [(root, "")]
    while stack:
        tree, prefix = stack.pop()
        if tree[0] == "leaf":
            codes[tree[1]] = prefix
        else:
            stack.append((tree[2], prefix + "1"))
            stack.append((tree[1], prefix + "0"))
    total = sum(freqs[s] * len(codes[s]) for s in symbols)
    return {"codes": {s: codes[s] for s in symbols}, "total_bits": total}
