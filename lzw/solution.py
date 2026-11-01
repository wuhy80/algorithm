def solve(data):
    text = data["text"]
    dictionary = {chr(i): i for i in range(256)}
    next_code = 256
    out = []
    current = ""
    for ch in text:
        candidate = current + ch
        if candidate in dictionary:
            current = candidate
        else:
            out.append(dictionary[current])
            dictionary[candidate] = next_code
            next_code += 1
            current = ch
    if current:
        out.append(dictionary[current])
    return out
