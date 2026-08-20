def solve(data):
    a, b = data["a"], data["b"]
    row = [0] * (len(b) + 1)
    for left_char in a:
        diagonal = 0
        for j, right_char in enumerate(b, 1):
            above = row[j]
            if left_char == right_char:
                row[j] = diagonal + 1
            else:
                row[j] = max(row[j], row[j - 1])
            diagonal = above
    return row[-1]
