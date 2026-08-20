import importlib.util
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "industrial-ai" / "water-treatment-dosing" / "solution.py"
SPEC = importlib.util.spec_from_file_location("water_treatment_dosing", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)
predict_dose = MODULE.predict_dose


class WaterTreatmentDosingTests(unittest.TestCase):
    def test_dose_increases_with_raw_turbidity(self):
        low = predict_dose(10, 1800, 7.2, 15, 1.0)
        high = predict_dose(100, 1800, 7.2, 15, 1.0)
        self.assertGreater(high.dose_mg_l, low.dose_mg_l)

    def test_flow_changes_total_consumption_not_concentration(self):
        low_flow = predict_dose(35, 1000, 7.2, 14, 1.0)
        high_flow = predict_dose(35, 2000, 7.2, 14, 1.0)
        self.assertEqual(low_flow.dose_mg_l, high_flow.dose_mg_l)
        self.assertAlmostEqual(
            high_flow.chemical_kg_hour,
            low_flow.chemical_kg_hour * 2,
        )

    def test_cold_water_requires_more_coagulant(self):
        cold = predict_dose(35, 1800, 7.2, 4, 1.0)
        warm = predict_dose(35, 1800, 7.2, 20, 1.0)
        self.assertGreater(cold.dose_mg_l, warm.dose_mg_l)
        self.assertLess(cold.confidence, warm.confidence)

    def test_invalid_process_values_are_rejected(self):
        with self.assertRaises(ValueError):
            predict_dose(0, 1800, 7.2, 14, 1.0)
        with self.assertRaises(ValueError):
            predict_dose(35, 0, 7.2, 14, 1.0)


if __name__ == "__main__":
    unittest.main()
