def solve(data):
    values, queries = set(), []
    for operation in data:
        if operation[0] == "add": values.add(operation[1])
        elif operation[0] == "remove": values.discard(operation[1])
        else: queries.append(operation[1] in values)
    return {"queries": queries, "values": sorted(values)}
