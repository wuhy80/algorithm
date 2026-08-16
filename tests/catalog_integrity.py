import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = ("index.html", "styles.css", "app.js", "README.md")
DIFFICULTIES = {"基础", "进阶", "高级"}
LEARNING_GUIDE_HEADINGS = (
    "## 先抓住一句话",
    "## 为什么需要它",
    "## 心智模型",
    "## 核心不变量",
    "## 算法步骤",
    "## 框架伪代码",
    "## 跟着演示手算",
    "## 复杂度怎么分析",
    "## 常见错误",
    "## 什么时候使用",
    "## 与其他算法的联系",
    "## 自测问题",
)


class CatalogIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
        cls.by_slug = {entry["slug"]: entry for entry in cls.catalog}

    def test_catalog_is_complete_and_unique(self):
        self.assertEqual(244, len(self.catalog))
        self.assertEqual(len(self.catalog), len(self.by_slug))
        self.assertEqual(len(self.catalog), len({entry["source"] for entry in self.catalog}))
        self.assertEqual(len(self.catalog), len({entry["demo"] for entry in self.catalog}))

    def test_every_entry_has_required_metadata_and_files(self):
        for entry in self.catalog:
            with self.subTest(slug=entry["slug"]):
                self.assertTrue(entry["name"])
                self.assertTrue(entry["summary"])
                self.assertTrue(entry["problem"])
                self.assertTrue(entry["complexity"])
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

    def test_every_readme_is_a_detailed_learning_guide(self):
        for entry in self.catalog:
            with self.subTest(slug=entry["slug"]):
                readme = (ROOT / entry["slug"] / "README.md").read_text(
                    encoding="utf-8"
                )
                self.assertGreaterEqual(len(readme), 2400)
                self.assertIn(f"# {entry['name']}", readme)
                self.assertIn(entry["summary"], readme)
                self.assertIn(entry["complexity"], readme)
                for heading in LEARNING_GUIDE_HEADINGS:
                    self.assertIn(heading, readme)

    def test_prerequisites_resolve_in_stage_order_without_cycles(self):
        for entry in self.catalog:
            with self.subTest(slug=entry["slug"]):
                self.assertNotIn(entry["slug"], entry["prerequisites"])
                self.assertEqual(len(entry["prerequisites"]), len(set(entry["prerequisites"])))
                for prerequisite in entry["prerequisites"]:
                    self.assertIn(prerequisite, self.by_slug)
                    self.assertLessEqual(
                        self.by_slug[prerequisite]["stage"], entry["stage"]
                    )

        state = {}

        def visit(slug):
            self.assertNotEqual(1, state.get(slug), f"prerequisite cycle at {slug}")
            if state.get(slug) == 2:
                return
            state[slug] = 1
            for prerequisite in self.by_slug[slug]["prerequisites"]:
                visit(prerequisite)
            state[slug] = 2

        for slug in self.by_slug:
            visit(slug)

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
