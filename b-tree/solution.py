import bisect


def solve(data):
    t = 2
    root = {"keys": [], "children": []}

    def split_child(parent, i):
        child = parent["children"][i]
        mid_key = child["keys"][t - 1]
        right = {"keys": child["keys"][t:], "children": child["children"][t:]}
        child["keys"] = child["keys"][:t - 1]
        if child["children"]:
            child["children"] = child["children"][:t]
        parent["keys"].insert(i, mid_key)
        parent["children"].insert(i + 1, right)

    def insert_nonfull(node, key):
        pos = bisect.bisect_left(node["keys"], key)
        if pos < len(node["keys"]) and node["keys"][pos] == key:
            return
        if not node["children"]:
            node["keys"].insert(pos, key)
            return
        if len(node["children"][pos]["keys"]) == 2 * t - 1:
            split_child(node, pos)
            if key == node["keys"][pos]:
                return
            if key > node["keys"][pos]:
                pos += 1
        insert_nonfull(node["children"][pos], key)

    def insert(key):
        if len(root["keys"]) == 2 * t - 1:
            new_root = {"keys": [], "children": [root]}
            split_child(new_root, 0)
            nonlocal_root[0] = new_root
        insert_nonfull(nonlocal_root[0], key)

    nonlocal_root = [root]
    for k in data["keys"]:
        insert(k)
    if not nonlocal_root[0]["keys"]:
        return []
    out = []
    queue = [nonlocal_root[0]]
    while queue:
        nxt = []
        for nd in queue:
            out.append(list(nd["keys"]))
            nxt.extend(nd["children"])
        queue = nxt
    return out
