from math import ceil


def solve(data):
    """用最近窗口的线性退化斜率估计穿越安全阈值的剩余步数。"""
    history = list(data["history"])
    threshold = float(data["threshold"])
    if not history:
        return {"rul": -1, "slope": 0.0, "risk": "unknown"}
    window = history[-min(16, len(history)):]
    if len(window) < 2:
        return {"rul": -1, "slope": 0.0, "risk": "unknown"}
    x_mean = (len(window) - 1) / 2
    y_mean = sum(window) / len(window)
    denominator = sum((index - x_mean) ** 2 for index in range(len(window)))
    slope = sum((index - x_mean) * (value - y_mean) for index, value in enumerate(window)) / denominator
    last = float(history[-1])
    rul = -1 if slope >= 0 else max(0, ceil((threshold - last) / slope))
    risk = "high" if 0 <= rul < 12 else "medium" if 0 <= rul < 24 else "low"
    return {"rul": rul, "slope": round(slope, 4), "risk": risk}
