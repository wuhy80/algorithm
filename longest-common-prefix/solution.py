def solve(data):
    if not data:
        return ""
    prefix = data[0]
    for text in data[1:]:
        while not text.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix
