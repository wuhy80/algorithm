def solve(data):
    s = data["s"] + "$"
    n = len(s)
    children = [{}]
    for i in range(n):
        cur = 0
        j = i
        while j < n:
            ch = s[j]
            if ch not in children[cur]:
                children.append({})
                children[cur][ch] = (j, n, len(children) - 1)
                j = n
                continue
            start, end, nxt = children[cur][ch]
            k = 0
            while k < end - start and j + k < n and s[start + k] == s[j + k]:
                k += 1
            if k == end - start:
                cur = nxt
                j += k
                continue
            split_node = len(children)
            children.append({})
            children[cur][ch] = (start, start + k, split_node)
            children.append({})
            children[split_node][s[start + k]] = (start + k, end, nxt)
            children.append({})
            children[split_node][s[j + k]] = (j + k, n, len(children) - 1)
            j = n
    edges = 0
    leaves = 0
    total_len = 0
    stack = [0]
    while stack:
        u = stack.pop()
        for start, end, v in children[u].values():
            edges += 1
            total_len += end - start
            if not children[v]:
                leaves += 1
            stack.append(v)
    return {"leaves": leaves, "edges": edges, "distinct": total_len - n}
