import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = ("index.html", "styles.css", "app.js", "README.md")
DIFFICULTIES = {"基础", "进阶", "高级"}


class CatalogIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
        cls.by_slug = {entry["slug"]: entry for entry in cls.catalog}

    def test_catalog_is_complete_and_unique(self):
        self.assertEqual(141, len(self.catalog))
        self.assertEqual(len(self.catalog), len(self.by_slug))
        self.assertEqual(len(self.catalog), len({entry["source"] for entry in self.catalog}))
        self.assertEqual(len(self.catalog), len({entry["demo"] for entry in self.catalog}))

    def test_every_entry_has_required_metadata_and_files(self):
        for entry in self.catalog:
            with self.subTest(slug=entry["slug"]):
                self.assertTrue(entry["name"])
                self.assertTrue(entry["summary"])
                self.assertTrue(entry["category"])
                self.assertIn(entry["difficulty"], DIFFICULTIES)
                self.assertIn(entry["stage"], range(1, 5))
                self.assertIsInstance(entry["tags"], list)
                self.assertEqual(
                    f"https://github.com/wuhy80/algorithm/tree/main/{entry['slug']}/",
                    entry["source"],
                )
                self.assertEqual(
                    f"https://wuhy80.github.io/algorithm/{entry['slug']}/",
                    entry["demo"],
                )
                for filename in REQUIRED_FILES:
                    self.assertTrue((ROOT / entry["slug"] / filename).is_file(), filename)

    def test_prerequisites_resolve_without_cycles_to_self(self):
        for entry in self.catalog:
            with self.subTest(slug=entry["slug"]):
                self.assertNotIn(entry["slug"], entry["prerequisites"])
                self.assertEqual(len(entry["prerequisites"]), len(set(entry["prerequisites"])))
                for prerequisite in entry["prerequisites"]:
                    self.assertIn(prerequisite, self.by_slug)

    def test_catalog_matches_algorithm_directories(self):
        directories = {
            child.name
            for child in ROOT.iterdir()
            if child.is_dir() and (child / "index.html").is_file()
        }
        self.assertEqual(set(self.by_slug), directories)

    def test_generated_docs_are_current(self):
        result = subprocess.run(
            ["node", "scripts/generate-readme.mjs", "--check"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(0, result.returncode, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
