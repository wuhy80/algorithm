def solve(data):
    matrix = [[float(v) for v in row] for row in data["matrix"]]
    n = len(matrix)
    cols = len(matrix[0]) - 1
    row_used = 0
    pivot_cols = []
    for col in range(cols):
        pivot = None
        best = 1e-9
        for r in range(row_used, n):
            if abs(matrix[r][col]) > best:
                best = abs(matrix[r][col])
                pivot = r
        if pivot is None:
            continue
        matrix[row_used], matrix[pivot] = matrix[pivot], matrix[row_used]
        pv = matrix[row_used][col]
        for c in range(col, cols + 1):
            matrix[row_used][c] /= pv
        for r in range(n):
            if r != row_used and abs(matrix[r][col]) > 1e-9:
                factor = matrix[r][col]
                for c in range(col, cols + 1):
                    matrix[r][c] -= factor * matrix[row_used][c]
        pivot_cols.append(col)
        row_used += 1
    for r in range(row_used, n):
        if all(abs(matrix[r][c]) <= 1e-9 for c in range(cols)) and abs(matrix[r][cols]) > 1e-9:
            return {"status": "none", "solution": []}
    if len(pivot_cols) < cols:
        return {"status": "infinite", "solution": []}
    solution = [0.0] * cols
    for idx, col in enumerate(pivot_cols):
        solution[col] = round(matrix[idx][cols], 6)
    return {"status": "unique", "solution": solution}
