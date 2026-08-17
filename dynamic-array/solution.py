def solve(data):
    capacity, values, moves = data["initial_capacity"], [], 0
    for value in data["values"]:
        if len(values) == capacity:
            moves += len(values)
            capacity *= 2
        values.append(value)
    return {"values": values, "capacity": capacity, "moves": moves}
