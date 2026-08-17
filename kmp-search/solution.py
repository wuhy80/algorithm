def solve(data):
    text, pattern = data["text"], data["pattern"]
    if not pattern:
        return 0
    prefix = [0] * len(pattern)
    j = 0
    for i in range(1, len(pattern)):
        while j and pattern[i] != pattern[j]: j = prefix[j - 1]
        if pattern[i] == pattern[j]: j += 1
        prefix[i] = j
    j = 0
    for i, char in enumerate(text):
        while j and char != pattern[j]: j = prefix[j - 1]
        if char == pattern[j]: j += 1
        if j == len(pattern): return i - j + 1
    return -1
