def solve(data):
    intervals = sorted((int(s), int(e)) for s, e in data["intervals"])
    target_l, target_r = int(data["target"][0]), int(data["target"][1])
    count = 0
    covered = target_l
    i = 0
    n = len(intervals)
    while covered < target_r:
        best_end = None
        while i < n and intervals[i][0] <= covered:
            if best_end is None or intervals[i][1] > best_end:
                best_end = intervals[i][1]
            i += 1
        if best_end is None or best_end <= covered:
            return -1
        covered = best_end
        count += 1
    return count
