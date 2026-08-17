def solve(data):
    if not data:
        return []
    low, high = min(data), max(data)
    counts = [0] * (high - low + 1)
    for value in data:
        counts[value - low] += 1
    result = []
    for offset, count in enumerate(counts):
        result.extend([offset + low] * count)
    return result
