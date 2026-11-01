def solve(data):
    buf = ""
    outputs = []
    for op in data["ops"]:
        kind = op[0]
        if kind == "append":
            buf += op[1]
        elif kind == "insert":
            pos = int(op[1])
            buf = buf[:pos] + op[2] + buf[pos:]
        elif kind == "delete":
            pos, length = int(op[1]), int(op[2])
            buf = buf[:pos] + buf[pos + length:]
        else:
            pos = int(op[1])
            outputs.append(buf[pos] if 0 <= pos < len(buf) else None)
    return {"outputs": outputs, "final": buf}
