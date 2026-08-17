def solve(data):
    prefix = [0]
    for value in data["nums"]:
        prefix.append(prefix[-1] + value)
    return [prefix[right + 1] - prefix[left] for left, right in data["queries"]]
