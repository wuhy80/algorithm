def solve(data):
    text, pattern = data["text"], data["pattern"]
    for start in range(len(text) - len(pattern) + 1):
        if text[start:start + len(pattern)] == pattern:
            return start
    return -1
