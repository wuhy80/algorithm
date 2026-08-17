def solve(data):
    capacity = data["capacity"]
    buffer = [None] * capacity
    head = size = 0
    popped = []
    for operation in data["operations"]:
        if operation[0] == "push":
            index = (head + size) % capacity
            buffer[index] = operation[1]
            if size == capacity: head = (head + 1) % capacity
            else: size += 1
        elif size:
            popped.append(buffer[head]); head = (head + 1) % capacity; size -= 1
    values = [buffer[(head + i) % capacity] for i in range(size)]
    return {"popped": popped, "values": values}
