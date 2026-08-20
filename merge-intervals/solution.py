def solve(data):
    intervals = sorted((left, right) for left, right in data)
    merged = []
    for left, right in intervals:
        if not merged or left > merged[-1][1] + 1:
            merged.append([left, right])
        else:
            merged[-1][1] = max(merged[-1][1], right)
    return merged
