import bisect


def solve(data):
    max_keys = 3
    root_holder = [{"leaf": True, "keys": [], "children": []}]

    def insert(node, key):
        pos = bisect.bisect_left(node["keys"], key)
        if node["leaf"]:
            if pos < len(node["keys"]) and node["keys"][pos] == key:
                return None
            node["keys"].insert(pos, key)
            if len(node["keys"]) <= max_keys:
                return None
            mid = (max_keys + 1) // 2
            right = {"leaf": True, "keys": node["keys"][mid:], "children": []}
            node["keys"] = node["keys"][:mid]
            return (right["keys"][0], right)
        split = insert(node["children"][pos], key)
        if split is None:
            return None
        router, rnode = split
        node["keys"].insert(pos, router)
        node["children"].insert(pos + 1, rnode)
        if len(node["keys"]) <= max_keys:
            return None
        mid = len(node["keys"]) // 2
        up = node["keys"][mid]
        right = {"leaf": False, "keys": node["keys"][mid + 1:], "children": node["children"][mid + 1:]}
        node["keys"] = node["keys"][:mid]
        node["children"] = node["children"][:mid + 1]
        return (up, right)

    for key in data["keys"]:
        split = insert(root_holder[0], key)
        if split is not None:
            router, rnode = split
            root_holder[0] = {"leaf": False, "keys": [router], "children": [root_holder[0], rnode]}
    if not root_holder[0]["keys"]:
        return []
    out = []
    queue = [root_holder[0]]
    while queue:
        nxt = []
        for nd in queue:
            out.append(list(nd["keys"]))
            nxt.extend(nd["children"])
        queue = nxt
    return out
