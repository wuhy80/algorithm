def solve(data):
    capacity = float(data["capacity"])
    total = 0.0
    for weight, value in sorted(data["items"], key=lambda item: item[1] / item[0], reverse=True):
        if capacity <= 0:
            break
        amount = min(float(weight), capacity)
        total += amount * value / weight
        capacity -= amount
    return total
