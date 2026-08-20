def solve(data):
    values = list(data)
    if not values:
        return []
    if any(value < 0 for value in values):
        raise ValueError('本题只接受非负整数')
    place = 1
    maximum = max(values)
    while maximum // place:
        buckets = [[] for _ in range(10)]
        for value in values:
            buckets[(value // place) % 10].append(value)
        values = [value for bucket in buckets for value in bucket]
        place *= 10
    return values
