def solve(data):
    leaves = list(data["leaves"])
    counter = [0]

    def search(node, depth, alpha, beta, maximizing):
        if depth == 0:
            counter[0] += 1
            return leaves[node]
        if maximizing:
            best = None
            for i in range(2):
                child = node * 2 + i
                value = search(child, depth - 1, alpha, beta, False)
                if best is None or value > best:
                    best = value
                if best > alpha:
                    alpha = best
                if beta <= alpha:
                    break
            return best
        best = None
        for i in range(2):
            child = node * 2 + i
            value = search(child, depth - 1, alpha, beta, True)
            if best is None or value < best:
                best = value
            if best < beta:
                beta = best
            if beta <= alpha:
                break
        return best

    depth = 0
    size = len(leaves)
    while (1 << depth) < size:
        depth += 1
    value = search(0, depth, float("-inf"), float("inf"), True)
    return {"value": value, "evaluated": counter[0]}
