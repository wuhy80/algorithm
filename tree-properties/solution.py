def solve(data):
    def inspect(index):
        if index >= len(data) or data[index] is None:
            return 0, True
        left_height, left_ok = inspect(index * 2 + 1)
        right_height, right_ok = inspect(index * 2 + 2)
        current = max(left_height, right_height) + 1
        return current, left_ok and right_ok and abs(left_height - right_height) <= 1
    height, balanced = inspect(0)
    return {"height": height, "balanced": balanced}
