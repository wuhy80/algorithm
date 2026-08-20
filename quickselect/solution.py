def solve(data):
    values = list(data["nums"])
    k = data["k"]
    left, right = 0, len(values) - 1
    while left <= right:
        pivot = values[right]
        store = left
        for index in range(left, right):
            if values[index] <= pivot:
                values[store], values[index] = values[index], values[store]
                store += 1
        values[store], values[right] = values[right], values[store]
        if store == k:
            return values[store]
        if store < k:
            left = store + 1
        else:
            right = store - 1
    raise ValueError("k out of range")
