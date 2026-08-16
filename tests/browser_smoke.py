import functools
import http.server
import json
import threading
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
NEW_SLUGS = {
    "activity-selection", "fractional-knapsack", "job-sequencing", "interval-covering",
    "zero-one-bfs", "bidirectional-bfs", "two-sat", "boruvka-mst",
    "stoer-wagner-min-cut", "blossom-matching", "heavy-light-decomposition",
    "centroid-decomposition", "mo-algorithm", "sqrt-decomposition",
    "rollback-union-find", "wavelet-matrix", "suffix-automaton", "palindromic-tree",
    "burrows-wheeler-transform", "extended-euclidean", "matrix-exponentiation",
    "segmented-sieve", "ntt", "gaussian-elimination",
}
EXPECTED_RESULTS = {
    "activity-selection": "4",
    "fractional-knapsack": "270.0",
    "job-sequencing": "167",
    "interval-covering": "4",
    "zero-one-bfs": "0",
    "bidirectional-bfs": "F",
    "two-sat": "可满足",
    "boruvka-mst": "15",
    "stoer-wagner-min-cut": "7",
    "blossom-matching": "3",
    "heavy-light-decomposition": "27",
    "centroid-decomposition": "完成",
    "mo-algorithm": "4",
    "sqrt-decomposition": "50",
    "rollback-union-find": "3",
    "wavelet-matrix": "5",
    "suffix-automaton": "13",
    "palindromic-tree": "7",
    "burrows-wheeler-transform": "4",
    "extended-euclidean": "-9, 47",
    "matrix-exponentiation": "322",
    "segmented-sieve": "16",
    "ntt": "7",
    "gaussian-elimination": "3",
}


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, _format, *_args):
        pass


class BrowserSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        handler = functools.partial(QuietHandler, directory=ROOT)
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_port}"
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()

    def open_page(self, path, viewport):
        page = self.browser.new_page(viewport=viewport, device_scale_factor=1)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.goto(f"{self.base_url}/{path}", wait_until="load")
        page.wait_for_timeout(80)
        return page, errors

    def layout_metrics(self, page):
        return page.evaluate(
            """() => {
                const root = document.documentElement;
                const width = root.clientWidth;
                const clipped = [...document.querySelectorAll('button, a')].filter((element) => {
                    const rect = element.getBoundingClientRect();
                    if (!rect.width || !rect.height) return false;
                    return rect.left < -1 || rect.right > width + 1 || element.scrollWidth > element.clientWidth + 2;
                }).map((element) => element.textContent.trim()).slice(0, 8);
                return {
                    overflow: Math.max(root.scrollWidth, document.body.scrollWidth) - width,
                    clipped,
                };
            }"""
        )

    def test_homepage_catalog_links_filters_and_layout(self):
        expected_advanced = sum(entry["difficulty"] == "高级" for entry in CATALOG)
        for viewport in ({"width": 1280, "height": 800}, {"width": 390, "height": 844}):
            with self.subTest(viewport=viewport):
                page, errors = self.open_page("", viewport)
                self.assertEqual(141, page.locator(".algorithm-row").count())
                self.assertEqual("141", page.locator("#total-count").inner_text())
                self.assertEqual("12", page.locator("#category-count").inner_text())
                metrics = self.layout_metrics(page)
                self.assertLessEqual(metrics["overflow"], 1, metrics)
                self.assertFalse(metrics["clipped"], metrics)
                canvas_colors = page.evaluate(
                    """() => {
                        const canvas = document.querySelector('#atlas-canvas');
                        const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
                        const colors = new Set();
                        for (let i = 0; i < data.length && colors.size < 20; i += 64) colors.add(`${data[i]},${data[i+1]},${data[i+2]},${data[i+3]}`);
                        return colors.size;
                    }"""
                )
                self.assertGreaterEqual(canvas_colors, 5)
                page.locator("#search").fill("boruvka")
                self.assertEqual(1, page.locator(".algorithm-row").count())
                page.locator("#search").fill("")
                page.locator('[data-difficulty="高级"]').click()
                self.assertEqual(expected_advanced, page.locator(".algorithm-row").count())
                self.assertFalse(errors, errors)
                page.close()

    def test_all_demo_pages_load(self):
        context = self.browser.new_context(viewport={"width": 1280, "height": 800})
        failures = []
        for entry in CATALOG:
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error, output=errors: output.append(str(error)))
            page.on("console", lambda message, output=errors: output.append(message.text) if message.type == "error" else None)
            try:
                page.goto(f"{self.base_url}/{entry['slug']}/", wait_until="load")
                page.wait_for_timeout(30)
                self.assertTrue(page.title())
                canvas = page.locator("canvas").first
                self.assertGreater(canvas.bounding_box()["width"], 100)
                self.assertGreater(canvas.bounding_box()["height"], 100)
                self.assertFalse(errors, errors)
            except Exception as error:
                failures.append(f"{entry['slug']}: {error}")
            finally:
                page.close()
        context.close()
        self.assertFalse(failures, "\n".join(failures))

    def test_new_demos_reach_terminal_state_on_desktop_and_fit_mobile(self):
        for slug in sorted(NEW_SLUGS):
            with self.subTest(slug=slug, viewport="desktop"):
                page, errors = self.open_page(f"{slug}/", {"width": 1280, "height": 800})
                self.assertFalse(page.locator("#error").inner_text().strip())
                steps = 0
                while page.locator("#play").inner_text().strip() != "重播" and steps < 1600:
                    page.locator("#step").click()
                    steps += 1
                self.assertLess(steps, 1600, page.locator("#status").inner_text())
                self.assertGreater(steps, 0)
                self.assertEqual(EXPECTED_RESULTS[slug], page.locator("#metric-3").inner_text().strip())
                self.assertFalse(errors, errors)
                page.close()
            with self.subTest(slug=slug, viewport="mobile"):
                page, errors = self.open_page(f"{slug}/", {"width": 390, "height": 844})
                metrics = self.layout_metrics(page)
                self.assertLessEqual(metrics["overflow"], 1, metrics)
                self.assertFalse(metrics["clipped"], metrics)
                self.assertFalse(errors, errors)
                page.close()


if __name__ == "__main__":
    unittest.main()
