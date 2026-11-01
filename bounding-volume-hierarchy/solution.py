def solve(data):
    boxes = [tuple(b) for b in data["boxes"]]
    leaf_boxes = []
    internal = [0]

    def bounds_of(indices):
        xs0 = [boxes[i][0] for i in indices]
        ys0 = [boxes[i][1] for i in indices]
        xs1 = [boxes[i][2] for i in indices]
        ys1 = [boxes[i][3] for i in indices]
        return (min(xs0), min(ys0), max(xs1), max(ys1))

    def build(indices):
        if len(indices) == 1:
            leaf_boxes.append(list(boxes[indices[0]]))
            return
        internal[0] += 1
        bounds = bounds_of(indices)
        dx = bounds[2] - bounds[0]
        dy = bounds[3] - bounds[1]
        axis = 0 if dx >= dy else 1
        ordered = sorted(indices, key=lambda i: ((boxes[i][0] + boxes[i][2]) / 2 if axis == 0 else (boxes[i][1] + boxes[i][3]) / 2, i))
        mid = len(ordered) // 2
        build(ordered[:mid])
        build(ordered[mid:])

    build(list(range(len(boxes))))
    return {
        "leaf_boxes": leaf_boxes,
        "internal_nodes": internal[0],
        "root_bounds": list(bounds_of(list(range(len(boxes))))),
    }
