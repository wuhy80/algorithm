def solve(data):
    s = data["s"]
    max_len = [0]
    link = [-1]
    trans = [{}]
    last = 0
    for ch in s:
        cur = len(max_len)
        max_len.append(max_len[last] + 1)
        link.append(-1)
        trans.append({})
        p = last
        while p != -1 and ch not in trans[p]:
            trans[p][ch] = cur
            p = link[p]
        if p == -1:
            link[cur] = 0
        else:
            q = trans[p][ch]
            if max_len[p] + 1 == max_len[q]:
                link[cur] = q
            else:
                clone = len(max_len)
                max_len.append(max_len[p] + 1)
                link.append(link[q])
                trans.append(dict(trans[q]))
                while p != -1 and trans[p].get(ch) == q:
                    trans[p][ch] = clone
                    p = link[p]
                link[q] = clone
                link[cur] = clone
        last = cur
    total = 0
    for v in range(1, len(max_len)):
        total += max_len[v] - max_len[link[v]]
    return total
