def solve(data):
    intervals = data["intervals"]
    items = [(s, e, i) for i, (s, e) in enumerate(intervals)]

    def build(nodes):
        if not nodes:
            return None
        endpoints = sorted(v for s, e, _ in nodes for v in (s, e))
        center = endpoints[len(endpoints) // 2]
        left = [it for it in nodes if it[1] < center]
        right = [it for it in nodes if it[0] > center]
        here = [it for it in nodes if it[0] <= center <= it[1]]
        return {
            "center": center,
            "by_start": sorted(here, key=lambda it: (it[0], it[2])),
            "by_end": sorted(here, key=lambda it: (-it[1], it[2])),
            "left": build(left),
            "right": build(right),
        }

    root = build(items)

    def query(node, x, acc):
        if node is None:
            return
        if x < node["center"]:
            for s, e, i in node["by_start"]:
                if s <= x:
                    acc.append(i)
                else:
                    break
            query(node["left"], x, acc)
        else:
            for s, e, i in node["by_end"]:
                if e >= x:
                    acc.append(i)
                else:
                    break
            query(node["right"], x, acc)

    out = []
    for x in data["points"]:
        acc = []
        query(root, x, acc)
        out.append(sorted(acc))
    return out
