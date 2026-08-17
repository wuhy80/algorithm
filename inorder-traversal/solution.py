def solve(data):
    result = []

    def visit(index):
        if index >= len(data) or data[index] is None:
            return
        visit(index * 2 + 1)
        result.append(data[index])
        visit(index * 2 + 2)

    visit(0)
    return result
