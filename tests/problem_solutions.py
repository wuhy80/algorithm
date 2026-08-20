import json
import runpy
import unittest
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
PROBLEMS = json.loads((ROOT / "problems" / "problem-data.json").read_text(encoding="utf-8"))
LEETCODE = json.loads((ROOT / "problems" / "leetcode-index.json").read_text(encoding="utf-8"))
EXPECTED_VARIANTS = {"core", "state", "edge", "applied"}


class ProblemSolutionTests(unittest.TestCase):
    def test_all_catalog_entries_exist_in_problem_bank(self):
        self.assertEqual(len(CATALOG) * len(EXPECTED_VARIANTS), len(PROBLEMS))
        self.assertGreaterEqual(len(PROBLEMS), 1000)
        self.assertEqual(
            {entry["slug"] for entry in CATALOG},
            {entry["slug"] for entry in PROBLEMS if entry["variant"] == "core"},
        )
        variants_per_topic = Counter(problem["baseSlug"] for problem in PROBLEMS)
        self.assertEqual({entry["slug"] for entry in CATALOG}, set(variants_per_topic))
        self.assertTrue(all(count == len(EXPECTED_VARIANTS) for count in variants_per_topic.values()))
        for base_slug in variants_per_topic:
            self.assertEqual(EXPECTED_VARIANTS, {problem["variant"] for problem in PROBLEMS if problem["baseSlug"] == base_slug})

    def test_problem_ids_and_metadata_are_complete(self):
        self.assertEqual(len(PROBLEMS), len({entry["id"] for entry in PROBLEMS}))
        self.assertEqual(set(range(1, len(PROBLEMS) + 1)), {entry["id"] for entry in PROBLEMS})
        for problem in PROBLEMS:
            with self.subTest(slug=problem["slug"]):
                self.assertIn(problem["variant"], EXPECTED_VARIANTS)
                self.assertTrue(problem["variantLabel"])
                self.assertTrue(problem["statement"])
                self.assertTrue(problem["explanation"]["mental"])
                self.assertTrue(problem["explanation"]["invariant"])
                self.assertTrue(problem["complexity"])
                self.assertEqual(f"../{problem['baseSlug']}/solution.py", problem["solutionPath"])

    def test_every_ready_reference_solution_passes_all_cases(self):
        ready = [problem for problem in PROBLEMS if problem["judgeReady"]]
        self.assertEqual(364, len(ready))
        self.assertEqual(91, len({problem["baseSlug"] for problem in ready}))
        solutions = {}
        for problem in ready:
            with self.subTest(slug=problem["slug"]):
                solution_path = ROOT / problem["baseSlug"] / "solution.py"
                self.assertTrue(solution_path.is_file())
                source = solution_path.read_text(encoding="utf-8")
                self.assertNotIn("NotImplementedError", source)
                self.assertNotIn("TODO", source)
                if problem["baseSlug"] not in solutions:
                    solutions[problem["baseSlug"]] = runpy.run_path(str(solution_path))["solve"]
                solve = solutions[problem["baseSlug"]]
                for case in problem["tests"]:
                    self.assertEqual(case["output"], solve(case["input"]))

    def test_leetcode_snapshot_is_metadata_only_and_complete(self):
        questions = LEETCODE["questions"]
        self.assertGreaterEqual(len(questions), 1000)
        self.assertEqual(LEETCODE["meta"]["indexedTotal"], len(questions))
        self.assertEqual(len(questions), len({question["slug"] for question in questions}))
        for question in questions:
            self.assertTrue(question["url"].startswith("https://leetcode.cn/problems/"))
            self.assertNotIn("statement", question)
            self.assertNotIn("solution", question)

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

        external_result = subprocess.run(
            ["node", "scripts/sync-leetcode-index.mjs", "--check"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(0, external_result.returncode, external_result.stdout + external_result.stderr)


if __name__ == "__main__":
    unittest.main()
