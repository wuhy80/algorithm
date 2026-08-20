def solve(data):
    a, b = data["a"], data["b"]
    previous = list(range(len(b) + 1))
    for i, left_char in enumerate(a, 1):
        current = [i]
        for j, right_char in enumerate(b, 1):
            if left_char == right_char:
                current.append(previous[j - 1])
            else:
                current.append(1 + min(previous[j], current[-1], previous[j - 1]))
        previous = current
    return previous[-1]
