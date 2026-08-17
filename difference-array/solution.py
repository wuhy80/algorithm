def solve(data):
    n = data["length"]
    diff = [0] * (n + 1)
    for left, right, delta in data["updates"]:
        diff[left] += delta
        if right + 1 < n:
            diff[right + 1] -= delta
    result, current = [], 0
    for index in range(n):
        current += diff[index]
        result.append(current)
    return result
