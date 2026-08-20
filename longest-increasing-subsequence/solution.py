def solve(data):
    tails = []
    for value in data:
        left, right = 0, len(tails)
        while left < right:
            middle = (left + right) // 2
            if tails[middle] < value:
                left = middle + 1
            else:
                right = middle
        if left == len(tails):
            tails.append(value)
        else:
            tails[left] = value
    return len(tails)
