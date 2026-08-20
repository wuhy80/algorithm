def solve(data):
    values = list(data)
    if len(values) < 2:
        return values
    low, high = min(values), max(values)
    bucket_count = max(1, int(len(values) ** 0.5))
    width = (high - low) / bucket_count if high != low else 1.0
    buckets = [[] for _ in range(bucket_count)]
    for value in values:
        index = min(bucket_count - 1, int((value - low) / width)) if high != low else 0
        buckets[index].append(value)
    result = []
    for bucket in buckets:
        for value in bucket:
            cursor = len(result)
            result.append(value)
            while cursor > 0 and result[cursor - 1] > value:
                result[cursor] = result[cursor - 1]
                cursor -= 1
            result[cursor] = value
    return result
