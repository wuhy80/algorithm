def solve(data):
    values = list(data["values"])
    for operation in data["operations"]:
        name = operation[0]
        if name == "append": values.append(operation[1])
        elif name == "insert": values.insert(operation[1], operation[2])
        elif name == "set": values[operation[1]] = operation[2]
        elif name == "delete": values.pop(operation[1])
    return values
