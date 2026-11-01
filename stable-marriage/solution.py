from collections import deque


def solve(data):
    men = [list(p) for p in data["men"]]
    women = [list(p) for p in data["women"]]
    n = len(men)
    rank = [{woman: pos for pos, woman in enumerate(women[w])} for w in range(n)]
    man_queue = deque(range(n))
    next_proposal = [0] * n
    current_partner = [-1] * n
    while man_queue:
        m = man_queue.popleft()
        while next_proposal[m] < n:
            w = men[m][next_proposal[m]]
            next_proposal[m] += 1
            if current_partner[w] == -1:
                current_partner[w] = m
                break
            rival = current_partner[w]
            if rank[w][m] < rank[w][rival]:
                current_partner[w] = m
                man_queue.append(rival)
                break
    matches = [0] * n
    for w, m in enumerate(current_partner):
        matches[m] = w
    return {"matches": matches}
