"""Transparent baseline for short-horizon industrial yield forecasting.

The browser demo uses the same idea: a recent-window trend plus a repeating
shift pattern, corrected by the fraction of available production hours.
This implementation is deliberately dependency-free so it can be adapted to
real historian data before replacing the baseline with a trained model.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import cos, pi, sin
from statistics import mean, pstdev
from typing import Sequence


@dataclass(frozen=True)
class YieldForecast:
    values: list[float]
    average: float
    gap_to_target: float
    confidence: float


def linear_slope(values: Sequence[float]) -> float:
    """Return the least-squares slope for an ordered sequence."""
    if len(values) < 2:
        return 0.0
    mean_x = (len(values) - 1) / 2
    mean_y = mean(values)
    denominator = sum((index - mean_x) ** 2 for index in range(len(values)))
    return sum((index - mean_x) * (value - mean_y) for index, value in enumerate(values)) / denominator


def forecast_yield(
    history: Sequence[float],
    planned_downtime_hours: float,
    target_per_shift: float,
    horizon: int,
    *,
    window: int = 18,
) -> YieldForecast:
    """Forecast future shifts and return a simple confidence estimate.

    ``planned_downtime_hours`` is allocated over ``horizon`` eight-hour
    shifts. The availability factor is an explicit exogenous correction;
    production systems should replace it with a feature learned from actual
    stoppage records.
    """
    if not history:
        raise ValueError("history must contain at least one observation")
    if horizon <= 0:
        raise ValueError("horizon must be positive")
    if planned_downtime_hours < 0:
        raise ValueError("planned_downtime_hours cannot be negative")
    values = list(history[-max(2, window):])
    slope = linear_slope(values)
    level = mean(values) + slope * len(values) / 2
    availability = max(0.0, 1.0 - planned_downtime_hours / (horizon * 8.0))
    start = len(history)
    predictions = []
    for step in range(horizon):
        seasonal = sin((start + step) * pi / 3) * 5.5 + cos((start + step) * pi / 6) * 2.1
        baseline = level + slope * (step + 1) + seasonal * 0.72
        predictions.append(max(0.0, baseline * availability))

    residuals = [value - (values[0] + slope * index) for index, value in enumerate(values)]
    residual_std = pstdev(residuals) if len(residuals) > 1 else 0.0
    confidence = max(58.0, min(97.0, 96.0 - residual_std * 3.0 - planned_downtime_hours * 0.35))
    average = mean(predictions)
    return YieldForecast(predictions, average, average - target_per_shift, confidence)


if __name__ == "__main__":
    sample = [86 + index * 0.18 + sin(index * pi / 3) * 5.5 for index in range(36)]
    result = forecast_yield(sample, planned_downtime_hours=6, target_per_shift=100, horizon=14)
    print({"forecast": [round(value, 1) for value in result.values], "average": round(result.average, 1), "gap": round(result.gap_to_target, 1), "confidence": round(result.confidence, 1)})
