from collections import deque


def solve(data):
    patterns = list(data["patterns"])
    text = data["text"]
    children = [{}]
    fail = [0]
    node_patterns = [[]]
    for idx, pat in enumerate(patterns):
        cur = 0
        for ch in pat:
            nxt = children[cur].get(ch)
            if nxt is None:
                children.append({})
                fail.append(0)
                node_patterns.append([])
                nxt = len(children) - 1
                children[cur][ch] = nxt
            cur = nxt
        node_patterns[cur].append(idx)
    queue = deque()
    for nxt in children[0].values():
        queue.append(nxt)
    while queue:
        u = queue.popleft()
        merged = list(node_patterns[u])
        f = fail[u]
        while f:
            merged.extend(node_patterns[f])
            f = fail[f]
        node_patterns[u] = merged
        for ch, v in children[u].items():
            f = fail[u]
            while f and ch not in children[f]:
                f = fail[f]
            fail[v] = children[f].get(ch, 0)
            if fail[v] == v:
                fail[v] = 0
            queue.append(v)
    counts = [0] * len(patterns)
    cur = 0
    for ch in text:
        while cur and ch not in children[cur]:
            cur = fail[cur]
        cur = children[cur].get(ch, 0)
        for idx in node_patterns[cur]:
            counts[idx] += 1
    return counts
