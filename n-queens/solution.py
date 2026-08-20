def solve(data):
    n = int(data)
    columns, diag1, diag2 = set(), set(), set()

    def search(row):
        if row == n:
            return 1
        total = 0
        for column in range(n):
            if column in columns or row - column in diag1 or row + column in diag2:
                continue
            columns.add(column); diag1.add(row - column); diag2.add(row + column)
            total += search(row + 1)
            columns.remove(column); diag1.remove(row - column); diag2.remove(row + column)
        return total

    return search(0)
