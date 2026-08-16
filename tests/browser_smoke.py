import functools
import http.server
import json
import threading
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
CORE_EXPECTED_RESULTS = {
    "dynamic-array": "8",
    "circular-buffer": "4",
    "bitset-bitmap": "6",
    "order-statistic-tree": "40",
    "pairing-heap": "3",
    "radix-tree": "4",
    "rope": "15",
    "disjoint-sparse-table": "27",
    "merge-sort-tree": "3",
    "li-chao-tree": "6",
    "segment-tree-beats": "27",
    "persistent-trie": "2",
    "coordinate-compression": "5",
    "inversion-count": "5",
    "median-of-medians": "7",
    "meet-in-the-middle": "可达",
    "introsort": "9",
    "timsort": "9",
    "external-merge-sort": "19",
    "branch-and-bound": "40",
    "kosaraju-scc": "3",
    "biconnected-components": "3",
    "dag-shortest-path": "5",
    "tree-diameter": "5",
    "rerooting-dp": "A",
    "dsu-on-tree": "3",
    "offline-dynamic-connectivity": "2",
    "lower-bound-flow": "可行",
    "tree-isomorphism-ahu": "同构",
    "profile-dp": "11",
    "sos-dp": "36",
    "probability-dp": "37.5%",
    "divide-conquer-dp-optimization": "117",
    "knuth-optimization": "28",
    "convex-hull-trick": "49",
    "rolling-hash": "2",
    "duval-lyndon-factorization": "4",
    "fm-index": "2",
    "dpll-sat": "可满足",
    "ac3-constraint-propagation": "8",
}
FOUNDATION_EXPECTED_RESULTS = {
    "static-array": "13",
    "matrix-2d-array": "81",
    "doubly-linked-list": "3",
    "circular-linked-list": "3",
    "binary-tree-basics": "2",
    "n-ary-tree": "1",
    "set-map-adt": "1",
    "open-addressing-hash-table": "6",
    "graph-representations": "2",
    "string-builder": "15",
    "array-operations": "6",
    "binary-search-boundaries": "3",
    "merge-intervals": "3",
    "frequency-counting": "3",
    "matrix-traversal": "9",
    "preorder-traversal": "8,4,2,6,12,10,14",
    "inorder-traversal": "2,4,6,8,10,12,14",
    "postorder-traversal": "2,6,4,10,14,12,8",
    "level-order-traversal": "8,4,12,2,6,10,14",
    "tree-properties": "4",
    "connected-components": "3",
    "undirected-cycle-detection": "有环",
    "directed-cycle-detection": "有环",
    "bipartite-check": "是",
    "flood-fill": "6",
    "grid-search": "6",
    "naive-string-search": "2",
    "palindrome-check": "是",
    "anagram-check": "是",
    "longest-common-prefix": "fl",
    "recursion-call-stack": "120",
    "fibonacci-memoization": "55",
    "climbing-stairs": "34",
    "grid-path-dp": "7",
    "permutation-generation": "6",
    "combination-generation": "10",
    "subset-enumeration": "16",
    "parentheses-generation": "5",
    "parentheses-matching": "合法",
}
NEW_SLUGS = {
    "activity-selection", "fractional-knapsack", "job-sequencing", "interval-covering",
    "zero-one-bfs", "bidirectional-bfs", "two-sat", "boruvka-mst",
    "stoer-wagner-min-cut", "blossom-matching", "heavy-light-decomposition",
    "centroid-decomposition", "mo-algorithm", "sqrt-decomposition",
    "rollback-union-find", "wavelet-matrix", "suffix-automaton", "palindromic-tree",
    "burrows-wheeler-transform", "extended-euclidean", "matrix-exponentiation",
    "segmented-sieve", "ntt", "gaussian-elimination",
    "prefix-sum", "difference-array", "floyd-cycle-detection",
    "fisher-yates-shuffle", "reservoir-sampling", "stable-marriage",
    "minimax-alpha-beta", "run-length-encoding", "prime-factorization",
    "linear-sieve", "cartesian-tree", "interval-tree", "push-relabel",
    "chu-liu-edmonds", "gomory-hu-tree", "link-cut-tree", "euler-tour-tree",
    "suffix-tree", "booth-minimum-rotation", "pollard-rho",
    "baby-step-giant-step", "half-plane-intersection", "octree",
    "bounding-volume-hierarchy",
}
NEW_SLUGS.update(CORE_EXPECTED_RESULTS)
NEW_SLUGS.update(FOUNDATION_EXPECTED_RESULTS)
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
    "prefix-sum": "39",
    "difference-array": "2",
    "floyd-cycle-detection": "1",
    "fisher-yates-shuffle": "10",
    "reservoir-sampling": "4",
    "stable-marriage": "4",
    "minimax-alpha-beta": "5",
    "run-length-encoding": "16",
    "prime-factorization": "1",
    "linear-sieve": "57",
    "cartesian-tree": "1",
    "interval-tree": "2",
    "push-relabel": "23",
    "chu-liu-edmonds": "11",
    "gomory-hu-tree": "5",
    "link-cut-tree": "22",
    "euler-tour-tree": "21",
    "suffix-tree": "11",
    "booth-minimum-rotation": "2",
    "pollard-rho": "83 × 97",
    "baby-step-giant-step": "6",
    "half-plane-intersection": "67.5",
    "octree": "1",
    "bounding-volume-hierarchy": "4",
}
EXPECTED_RESULTS.update(CORE_EXPECTED_RESULTS)
EXPECTED_RESULTS.update(FOUNDATION_EXPECTED_RESULTS)
NEURAL_SLUGS = {
    "activation-functions",
    "perceptron-classifier",
    "neural-network-forward-pass",
    "backpropagation",
    "optimizer-comparison",
    "convolutional-neural-network",
    "recurrent-neural-network",
    "transformer-self-attention",
    "autoencoder",
    "generative-adversarial-network",
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
                self.assertEqual(len(CATALOG), page.locator(".algorithm-row").count())
                self.assertEqual(str(len(CATALOG)), page.locator("#total-count").inner_text())
                self.assertEqual(str(len({entry["category"] for entry in CATALOG})), page.locator("#category-count").inner_text())
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

    def test_octree_webgl_scene_is_drawn_on_desktop_and_mobile(self):
        for viewport in ({"width": 1280, "height": 800}, {"width": 390, "height": 844}):
            with self.subTest(viewport=viewport):
                page, errors = self.open_page("octree/", viewport)
                for _ in range(12):
                    page.locator("#step").click()
                page.wait_for_timeout(80)
                metrics = page.evaluate(
                    """() => {
                        const canvas = document.querySelector('canvas');
                        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
                        const pixels = new Uint8Array(canvas.width * canvas.height * 4);
                        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                        const colors = new Set();
                        let bright = 0;
                        for (let i = 0; i < pixels.length; i += 400) {
                            colors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]},${pixels[i+3]}`);
                            if (pixels[i] + pixels[i+1] + pixels[i+2] > 130) bright++;
                        }
                        return { webgl: !!gl, colors: colors.size, bright };
                    }"""
                )
                self.assertTrue(metrics["webgl"], metrics)
                self.assertGreaterEqual(metrics["colors"], 4, metrics)
                self.assertGreater(metrics["bright"], 20, metrics)
                self.assertFalse(errors, errors)
                page.close()

    def test_neural_network_demos_are_interactive_and_fit_both_viewports(self):
        for slug in sorted(NEURAL_SLUGS):
            for viewport in ({"width": 1280, "height": 800}, {"width": 390, "height": 844}):
                with self.subTest(slug=slug, viewport=viewport["width"]):
                    page, errors = self.open_page(f"{slug}/", viewport)
                    self.assertEqual(slug, page.locator("body").get_attribute("data-demo"))
                    self.assertFalse(page.locator("#error").inner_text().strip())
                    before = page.locator(".stats").inner_text()
                    page.locator("#step").click()
                    page.locator("#step").click()
                    self.assertNotEqual(before, page.locator(".stats").inner_text())
                    metrics = self.layout_metrics(page)
                    self.assertLessEqual(metrics["overflow"], 1, metrics)
                    self.assertFalse(metrics["clipped"], metrics)
                    colors = page.evaluate(
                        """() => {
                            const canvas = document.querySelector('canvas');
                            const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
                            const values = new Set();
                            for (let i = 0; i < data.length && values.size < 20; i += 128) {
                                values.add(`${data[i]},${data[i+1]},${data[i+2]},${data[i+3]}`);
                            }
                            return values.size;
                        }"""
                    )
                    self.assertGreaterEqual(colors, 4)
                    self.assertFalse(errors, errors)
                    page.close()

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
