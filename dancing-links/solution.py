def solve(data):
    matrix = [list(row) for row in data["matrix"]]
    rows = len(matrix)
    cols = len(matrix[0]) if rows else 0
    active_rows = set(range(rows))
    active_cols = set(range(cols))
    chosen = []

    def cover(row_selected):
        removed = []
        active_rows.remove(row_selected)
        chosen.append(row_selected)
        covered_cols = [c for c in range(cols) if matrix[row_selected][c]]
        for c in covered_cols:
            active_cols.discard(c)
            for r in list(active_rows):
                if matrix[r][c]:
                    active_rows.remove(r)
                    removed.append(r)
        return removed

    def uncover(removed, row_selected):
        chosen.pop()
        active_rows.add(row_selected)
        covered_cols = [c for c in range(cols) if matrix[row_selected][c]]
        for c in covered_cols:
            active_cols.add(c)
        for r in removed:
            active_rows.add(r)

    def search():
        if not active_cols:
            return sorted(chosen)
        target = min(active_cols, key=lambda c: (sum(1 for r in active_rows if matrix[r][c]), c))
        candidates = [r for r in sorted(active_rows) if matrix[r][target]]
        if not candidates:
            return None
        for r in candidates:
            removed = cover(r)
            result = search()
            if result is not None:
                return result
            uncover(removed, r)
        return None

    return search()
