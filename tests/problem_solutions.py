import json
import runpy
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROBLEMS = json.loads((ROOT / "problems" / "problem-data.json").read_text(encoding="utf-8"))


class ProblemSolutionTests(unittest.TestCase):
    def test_all_catalog_entries_exist_in_problem_bank(self):
        catalog = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
        self.assertEqual(len(catalog), len(PROBLEMS))
        self.assertEqual({entry["slug"] for entry in catalog}, {entry["slug"] for entry in PROBLEMS})

    def test_problem_ids_and_metadata_are_complete(self):
        self.assertEqual(len(PROBLEMS), len({entry["id"] for entry in PROBLEMS}))
        for problem in PROBLEMS:
            with self.subTest(slug=problem["slug"]):
                self.assertTrue(problem["statement"])
                self.assertTrue(problem["explanation"]["mental"])
                self.assertTrue(problem["explanation"]["invariant"])
                self.assertTrue(problem["complexity"])

    def test_every_ready_reference_solution_passes_all_cases(self):
        ready = [problem for problem in PROBLEMS if problem["judgeReady"]]
        self.assertGreaterEqual(len(ready), 50)
        for problem in ready:
            with self.subTest(slug=problem["slug"]):
                solution_path = ROOT / problem["slug"] / "solution.py"
                self.assertTrue(solution_path.is_file())
                source = solution_path.read_text(encoding="utf-8")
                self.assertNotIn("NotImplementedError", source)
                self.assertNotIn("TODO", source)
                solve = runpy.run_path(str(solution_path))["solve"]
                for case in problem["tests"]:
                    self.assertEqual(case["output"], solve(case["input"]))

    def test_generated_problem_data_is_current(self):
        import subprocess

        result = subprocess.run(
            ["node", "scripts/generate-problems.mjs", "--check"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(0, result.returncode, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
