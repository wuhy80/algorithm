def solve(data):
    s = data["s"]
    length = [-1, 0]
    link = [0, 0]
    next_nodes = [{}, {}]
    cnt = [0, 0]
    last = 1
    for i, ch in enumerate(s):
        cur = last
        while True:
            l = length[cur]
            if i - l - 1 >= 0 and s[i - l - 1] == ch:
                break
            cur = link[cur]
        if ch in next_nodes[cur]:
            last = next_nodes[cur][ch]
            cnt[last] += 1
            continue
        now = len(length)
        length.append(length[cur] + 2)
        link.append(-1)
        next_nodes.append({})
        cnt.append(1)
        next_nodes[cur][ch] = now
        if length[now] == 1:
            link[now] = 1
        else:
            tmp = link[cur]
            while True:
                l = length[tmp]
                if i - l - 1 >= 0 and s[i - l - 1] == ch:
                    break
                tmp = link[tmp]
            link[now] = next_nodes[tmp].get(ch, 1)
        last = now
    for v in range(len(length) - 1, 1, -1):
        cnt[link[v]] += cnt[v]
    return {"distinct": len(length) - 2, "total": sum(cnt[2:])}
