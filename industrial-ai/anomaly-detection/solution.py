"""滚动 z-score 多传感器异常检测的纯 Python 参考实现。"""

from math import sqrt


def _rolling_zscores(values, window):
    """返回每个采样点相对于最近窗口的绝对 z-score。"""
    scores = []
    for index, value in enumerate(values):
        sample = values[max(0, index - window + 1) : index + 1]
        mean = sum(sample) / len(sample)
        variance = sum((item - mean) ** 2 for item in sample) / len(sample)
        scores.append(abs(value - mean) / max(sqrt(variance), 1e-4))
    return scores


def solve(data):
    """检测振动与温度序列，返回分数、异常索引和当前状态。

    data: {"vibration": [...], "temperature": [...], "window": 14,
           "threshold": 2.4}
    两个传感器先各自标准化，再取同一时刻的较大 z-score，避免量纲影响。
    """
    vibration = [float(item) for item in data.get("vibration", [])]
    temperature = [float(item) for item in data.get("temperature", [])]
    size = max(2, int(data.get("window", 14)))
    threshold = float(data.get("threshold", 2.4))
    length = min(len(vibration), len(temperature))
    if not length:
        return {"scores": [], "anomalies": [], "current_score": 0.0, "status": "unknown"}
    vibration_scores = _rolling_zscores(vibration[:length], size)
    temperature_scores = _rolling_zscores(temperature[:length], size)
    scores = [max(left, right) for left, right in zip(vibration_scores, temperature_scores)]
    anomalies = [index for index, score in enumerate(scores) if index >= 2 and score >= threshold]
    current_score = scores[-1]
    status = "alert" if current_score >= threshold else "watch" if len(anomalies) > 5 else "normal"
    return {
        "scores": [round(score, 4) for score in scores],
        "anomalies": anomalies,
        "current_score": round(current_score, 4),
        "max_score": round(max(scores), 4),
        "status": status,
    }


if __name__ == "__main__":
    print(solve({"vibration": [1.0, 1.1, 1.2, 2.8], "temperature": [60, 60, 61, 65]}))
