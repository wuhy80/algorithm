"""Interpretable baseline for drinking-water coagulant dose prediction.

The model is intended for learning and offline comparison. A real plant must
fit its coefficients from local jar tests and historian data, then keep safety
limits, interlocks, residual aluminium constraints, and operator approval in
the control loop.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import sqrt


@dataclass(frozen=True)
class DosingPrediction:
    dose_mg_l: float
    low_mg_l: float
    high_mg_l: float
    chemical_kg_hour: float
    confidence: float
    base_dose_mg_l: float
    ph_factor: float
    temperature_factor: float
    target_factor: float


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def predict_dose(
    raw_turbidity_ntu: float,
    plant_flow_m3_hour: float,
    water_ph: float,
    temperature_c: float,
    target_turbidity_ntu: float,
) -> DosingPrediction:
    """Predict a coagulant dose and uncertainty interval.

    The transparent baseline separates water-quality concentration (mg/L)
    from plant throughput. Flow affects total chemical consumption, but it
    does not change the concentration predicted for the same water quality.
    """
    if raw_turbidity_ntu <= 0:
        raise ValueError("raw_turbidity_ntu must be positive")
    if plant_flow_m3_hour <= 0:
        raise ValueError("plant_flow_m3_hour must be positive")
    if not 4.0 <= water_ph <= 10.0:
        raise ValueError("water_ph is outside the supported range [4, 10]")
    if not 0.0 <= temperature_c <= 40.0:
        raise ValueError("temperature_c is outside the supported range [0, 40]")
    if target_turbidity_ntu <= 0:
        raise ValueError("target_turbidity_ntu must be positive")

    base_dose = 5.5 + 2.25 * sqrt(raw_turbidity_ntu)
    ph_factor = 1.0 + min(0.28, abs(water_ph - 7.2) * 0.09)
    temperature_factor = (
        1.0
        + max(0.0, 15.0 - temperature_c) * 0.016
        - max(0.0, temperature_c - 24.0) * 0.004
    )
    target_factor = 1.0 + _clamp((1.0 - target_turbidity_ntu) * 0.13, -0.08, 0.12)
    dose = _clamp(base_dose * ph_factor * temperature_factor * target_factor, 3.0, 70.0)

    uncertainty = _clamp(
        0.08
        + abs(water_ph - 7.2) * 0.018
        + max(0.0, 8.0 - temperature_c) * 0.008
        + max(0.0, raw_turbidity_ntu - 120.0) * 0.0007,
        0.08,
        0.24,
    )
    confidence = _clamp(96.0 - uncertainty * 100.0, 62.0, 93.0)
    return DosingPrediction(
        dose_mg_l=dose,
        low_mg_l=dose * (1.0 - uncertainty),
        high_mg_l=dose * (1.0 + uncertainty),
        chemical_kg_hour=dose * plant_flow_m3_hour / 1000.0,
        confidence=confidence,
        base_dose_mg_l=base_dose,
        ph_factor=ph_factor,
        temperature_factor=temperature_factor,
        target_factor=target_factor,
    )


if __name__ == "__main__":
    prediction = predict_dose(35, 1800, 7.2, 14, 1.0)
    print(
        {
            "dose_mg_l": round(prediction.dose_mg_l, 2),
            "interval_mg_l": [round(prediction.low_mg_l, 2), round(prediction.high_mg_l, 2)],
            "chemical_kg_hour": round(prediction.chemical_kg_hour, 2),
            "confidence": round(prediction.confidence, 1),
        }
    )
