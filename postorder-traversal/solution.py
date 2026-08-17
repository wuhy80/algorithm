def solve(data):
    result = []

    def visit(index):
        if index >= len(data) or data[index] is None:
            return
        visit(index * 2 + 1)
        visit(index * 2 + 2)
        result.append(data[index])

    visit(0)
    return result
