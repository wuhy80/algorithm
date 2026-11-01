def solve(data):
    pts = [(p[0], p[1]) for p in data["points"]]
    n = len(pts)
    nodes = []

    def build(indices, depth):
        if not indices:
            return -1
        axis = depth % 2
        ordered = sorted(indices, key=lambda i: (pts[i][axis], i))
        mid = len(ordered) // 2
        node_id = len(nodes)
        nodes.append({"point": ordered[mid], "left": -1, "right": -1, "axis": axis})
        left = build(ordered[:mid], depth + 1)
        right = build(ordered[mid + 1:], depth + 1)
        nodes[node_id]["left"] = left
        nodes[node_id]["right"] = right
        return node_id

    root = build(list(range(n)), 0)
    out = []
    for qx, qy in data["queries"]:
        qx, qy = qx, qy
        best = {"dist2": None, "index": None}

        def visit(node_id):
            if node_id == -1:
                return
            node = nodes[node_id]
            px, py = pts[node["point"]]
            d2 = (px - qx) ** 2 + (py - qy) ** 2
            if best["dist2"] is None or (d2, node["point"]) < (best["dist2"], best["index"]):
                best["dist2"] = d2
                best["index"] = node["point"]
            axis = node["axis"]
            diff = (qx - px) if axis == 0 else (qy - py)
            near, far = (node["left"], node["right"]) if diff < 0 else (node["right"], node["left"])
            visit(near)
            if best["dist2"] is None or diff * diff <= best["dist2"]:
                visit(far)

        visit(root)
        out.append([best["index"], best["dist2"]])
    return out
