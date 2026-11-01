def solve(data):
    END = "$"
    root = {}
    for word in data["words"]:
        cur = root
        cur["#"] = cur.get("#", 0) + 1
        for ch in word:
            cur = cur.setdefault(ch, {})
            cur["#"] = cur.get("#", 0) + 1
        cur[END] = cur.get(END, 0) + 1
    out = []
    for kind, arg in data["queries"]:
        cur = root
        ok = True
        for ch in arg:
            if ch in cur:
                cur = cur[ch]
            else:
                ok = False
                break
        if not ok:
            out.append(0)
            continue
        if kind == "count_word":
            out.append(cur.get(END, 0))
        else:
            out.append(cur.get("#", 0))
    return out
