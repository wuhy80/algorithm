def solve(data):
    children_list = [{}]
    pass_count = [0]
    versions = [0]
    out = []
    for op in data["ops"]:
        if op[0] == "insert":
            new_root = len(children_list)
            old_root = versions[op[1]]
            children_list.append(dict(children_list[old_root]))
            pass_count.append(pass_count[old_root] + 1)
            cur = new_root
            for ch in op[2]:
                old_child = children_list[cur].get(ch, 0)
                child_idx = len(children_list)
                children_list.append(dict(children_list[old_child]))
                pass_count.append(pass_count[old_child] + 1)
                children_list[cur][ch] = child_idx
                cur = child_idx
            versions.append(new_root)
        else:
            cur = versions[op[1]]
            for ch in op[2]:
                cur = children_list[cur].get(ch, 0)
                if cur == 0:
                    break
            out.append(pass_count[cur])
    return out
