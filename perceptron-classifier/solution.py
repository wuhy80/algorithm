def solve(data):
    points = data["points"]
    epochs = int(data["epochs"])
    lr = 0.1
    w1, w2, b = 0.0, 0.0, 1.0
    for _ in range(epochs):
        updated = False
        for px, py, label in points:
            pred = 1 if w1 * px + w2 * py + b > 0 else 0
            err = label - pred
            if err != 0:
                w1 += lr * err * px
                w2 += lr * err * py
                b += lr * err
                updated = True
        if not updated:
            break
    correct = 0
    for px, py, label in points:
        pred = 1 if w1 * px + w2 * py + b > 0 else 0
        if pred == label:
            correct += 1
    return {
        "weights": [round(w1, 6), round(w2, 6), round(b, 6)],
        "accuracy": round(correct / len(points), 6),
    }
