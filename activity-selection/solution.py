def solve(data):
    count, last_end = 0, None
    for start, end in sorted(data, key=lambda item: item[1]):
        if last_end is None or start >= last_end:
            count += 1
            last_end = end
    return count
