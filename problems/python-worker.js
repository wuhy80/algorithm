let pyodide = null;

async function initialize() {
  try {
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
    pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
    postMessage({ type: 'ready' });
  } catch (error) {
    postMessage({ type: 'init-error', error: String(error) });
  }
}

self.onmessage = async (event) => {
  if (!pyodide || event.data.type !== 'run') return;
  const { id, code, tests } = event.data;
  try {
    pyodide.globals.set('__user_code', code);
    pyodide.globals.set('__tests_json', JSON.stringify(tests));
    const raw = await pyodide.runPythonAsync(`
import contextlib
import io
import json
import time
import traceback

namespace = {}
class LimitedWriter(io.StringIO):
    def write(self, value):
        value = str(value)
        combined = (self.getvalue() + value)[-4000:]
        self.seek(0)
        self.truncate(0)
        super().write(combined)
        return len(value)

stdout = LimitedWriter()
started = time.perf_counter()
results = []
try:
    with contextlib.redirect_stdout(stdout):
        exec(__user_code, namespace)
    solve = namespace.get("solve")
    if not callable(solve):
        raise TypeError("必须定义可调用的 solve(data) 函数")
    for index, case in enumerate(json.loads(__tests_json)):
        try:
            with contextlib.redirect_stdout(stdout):
                actual = solve(case["input"])
            passed = actual == case["output"]
            results.append({
                "index": index,
                "passed": passed,
                "actual": actual,
                "expected": case["output"],
                "error": None,
            })
        except Exception:
            results.append({
                "index": index,
                "passed": False,
                "actual": None,
                "expected": case["output"],
                "error": traceback.format_exc(limit=4),
            })
except Exception:
    results = [{
        "index": -1,
        "passed": False,
        "actual": None,
        "expected": None,
        "error": traceback.format_exc(limit=6),
    }]

json.dumps({
    "results": results,
    "stdout": stdout.getvalue(),
    "duration": (time.perf_counter() - started) * 1000,
}, ensure_ascii=False, default=str)
`);
    postMessage({ type: 'result', id, payload: JSON.parse(raw) });
  } catch (error) {
    postMessage({ type: 'result', id, payload: { results: [{ index: -1, passed: false, error: String(error) }], stdout: '', duration: 0 } });
  } finally {
    pyodide.globals.delete('__user_code');
    pyodide.globals.delete('__tests_json');
  }
};

initialize();
