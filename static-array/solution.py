def solve(data):
    values, reads = list(data["values"]), []
    for operation in data["operations"]:
        if operation[0] == "read": reads.append(values[operation[1]])
        else: values[operation[1]] = operation[2]
    return {"reads": reads, "values": values}
