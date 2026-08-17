def solve(data):
    matrix = [row[:] for row in data["matrix"]]
    reads = []
    for operation in data["operations"]:
        if operation[0] == "read": reads.append(matrix[operation[1]][operation[2]])
        else: matrix[operation[1]][operation[2]] = operation[3]
    return {"reads": reads, "matrix": matrix}
