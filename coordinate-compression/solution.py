def solve(data):
    ranks = {value: index for index, value in enumerate(sorted(set(data)))}
    return [ranks[value] for value in data]
