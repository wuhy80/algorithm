def solve(data):
    table, output = {}, []
    for operation in data:
        if operation[0] == "put": table[operation[1]] = operation[2]
        elif operation[0] == "remove": table.pop(operation[1], None)
        else: output.append(table.get(operation[1]))
    return output
