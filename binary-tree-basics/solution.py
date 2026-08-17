def solve(data):
    if not data or data[0] is None:
        return {"nodes": 0, "leaves": 0, "height": 0}
    stack = [(0, 1)]
    nodes = leaves = height = 0
    while stack:
        index, depth = stack.pop()
        if index >= len(data) or data[index] is None:
            continue
        nodes += 1
        height = max(height, depth)
        left, right = index * 2 + 1, index * 2 + 2
        has_left = left < len(data) and data[left] is not None
        has_right = right < len(data) and data[right] is not None
        if not has_left and not has_right:
            leaves += 1
        if has_left: stack.append((left, depth + 1))
        if has_right: stack.append((right, depth + 1))
    return {"nodes": nodes, "leaves": leaves, "height": height}
