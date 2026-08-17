def solve(data):
    left, right = 0, len(data) - 1
    while left < right:
        while left < right and not data[left].isalnum(): left += 1
        while left < right and not data[right].isalnum(): right -= 1
        if data[left].lower() != data[right].lower(): return False
        left += 1; right -= 1
    return True
