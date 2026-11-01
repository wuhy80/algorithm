def solve(data):
    root = {"prefix": "", "end": False, "children": {}}

    def insert(word):
        if not word:
            root["end"] = True
            return
        cur = root
        rest = word
        while True:
            edge = cur["children"].get(rest[0])
            if edge is None:
                cur["children"][rest[0]] = {"prefix": rest, "end": True, "children": {}}
                return
            label = edge["prefix"]
            k = 0
            while k < len(label) and k < len(rest) and label[k] == rest[k]:
                k += 1
            if k == len(label):
                rest = rest[k:]
                if not rest:
                    edge["end"] = True
                    return
                cur = edge
                continue
            middle = {"prefix": label[:k], "end": False, "children": {label[k]: edge}}
            edge["prefix"] = label[k:]
            cur["children"][rest[0]] = middle
            if k == len(rest):
                middle["end"] = True
            else:
                middle["children"][rest[k]] = {"prefix": rest[k:], "end": True, "children": {}}
            return

    for w in data["words"]:
        insert(w)
    out = []
    stack = [root]
    while stack:
        node = stack.pop()
        out.append([node["prefix"], node["end"]])
        for key in sorted(node["children"], reverse=True):
            stack.append(node["children"][key])
    return out
