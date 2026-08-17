def solve(data):
    matrix, order = data["matrix"], data["order"]
    if not matrix:
        return []
    rows, cols = len(matrix), len(matrix[0])
    if order == "row":
        return [matrix[r][c] for r in range(rows) for c in range(cols)]
    if order == "column":
        return [matrix[r][c] for c in range(cols) for r in range(rows)]
    result = []
    top, bottom, left, right = 0, rows - 1, 0, cols - 1
    while top <= bottom and left <= right:
        result.extend(matrix[top][left:right + 1]); top += 1
        for row in range(top, bottom + 1): result.append(matrix[row][right])
        right -= 1
        if top <= bottom:
            result.extend(reversed(matrix[bottom][left:right + 1])); bottom -= 1
        if left <= right:
            for row in range(bottom, top - 1, -1): result.append(matrix[row][left])
            left += 1
    return result
