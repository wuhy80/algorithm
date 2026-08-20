def solve(data):
    if not data:
        return 0
    ending = best = data[0]
    for value in data[1:]:
        ending = max(value, ending + value)
        best = max(best, ending)
    return best
