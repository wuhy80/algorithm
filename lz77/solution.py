def solve(data):
    text = data["text"]
    window = int(data["window"])
    lookahead = int(data["lookahead"])
    n = len(text)
    out = []
    pos = 0
    while pos < n:
        best_len = 0
        best_off = 0
        start = max(0, pos - window)
        max_len = min(lookahead, n - pos)
        for off in range(1, pos - start + 1):
            length = 0
            while length < max_len and text[pos - off + length] == text[pos + length]:
                length += 1
            if length > best_len:
                best_len = length
                best_off = off
        if best_len == 0:
            out.append([0, 0, text[pos]])
            pos += 1
        else:
            literal = text[pos + best_len] if pos + best_len < n else ""
            out.append([best_off, best_len, literal])
            pos += best_len + 1
    return out
