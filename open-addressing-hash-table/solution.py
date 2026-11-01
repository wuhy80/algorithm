def solve(data):
    size = int(data["size"])
    table = [None] * size
    outputs = []

    def probe(key):
        return key % size

    for op in data["ops"]:
        kind, key = op[0], int(op[1])
        idx = probe(key)
        if kind == "insert":
            while table[idx] is not None:
                if table[idx] == key:
                    break
                idx = (idx + 1) % size
            if table[idx] is None:
                table[idx] = key
        else:
            found = False
            steps = 0
            while steps < size:
                if table[idx] is None:
                    break
                if table[idx] == key:
                    found = True
                    break
                idx = (idx + 1) % size
                steps += 1
            outputs.append(found)
    return {"outputs": outputs, "table": table}
