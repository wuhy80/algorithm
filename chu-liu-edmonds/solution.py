def solve(data):
    n0 = int(data["n"])
    root0 = int(data["root"])
    edges0 = [(int(u), int(v), int(w), None) for u, v, w in data["edges"]]

    def solve_rec(count, edges, root, super_id, next_id):
        pred = {}
        for u, v, w, deeper in edges:
            if u == v or v == root:
                continue
            if v not in pred or w < pred[v][1]:
                pred[v] = (u, w, deeper)
        if len(pred) < count - 1:
            return None
        color = {}
        cycle = None
        for start in list(pred.keys()):
            if color.get(start):
                continue
            path = []
            u = start
            while u in pred and not color.get(u):
                color[u] = True
                path.append(u)
                u = pred[u][0]
            if u in pred and color.get(u) and u in path:
                cycle = path[path.index(u):]
                break
        if cycle is None:
            return [(u, v, w, deeper) for v, (u, w, deeper) in pred.items()]
        merged_id = next_id
        cycle_set = set(cycle)
        cost_in = {v: pred[v][1] for v in cycle}
        new_edges = []
        for u, v, w, deeper in edges:
            if u == v:
                continue
            in_u = u in cycle_set
            in_v = v in cycle_set
            if in_u and in_v:
                continue
            if in_v:
                new_edges.append((u, merged_id, w - cost_in[v], (u, v, w, deeper)))
            elif in_u:
                new_edges.append((merged_id, v, w, deeper))
            else:
                new_edges.append((u, v, w, deeper))
        sub = solve_rec(count - len(cycle) + 1, new_edges, root, merged_id, next_id + 1)
        if sub is None:
            return None
        enter = None
        for e in sub:
            if e[1] == merged_id:
                enter = e
                break
        before = enter[3]
        v_star = before[1]
        chosen = [e for e in sub if e[1] != merged_id]
        chosen.append(before)
        for v in cycle:
            if v != v_star:
                u, w, deeper = pred[v]
                chosen.append((u, v, w, deeper))
        return chosen

    result = solve_rec(n0, edges0, root0, None, n0)
    if result is None:
        return None
    return sum(e[2] for e in result)
