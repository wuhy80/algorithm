# 在线题库

本目录承载算法可视化图谱的在线做题功能。题目数据由根目录 `catalog.json` 和各算法目录的 `solution.py` 统一生成。

## 数据约定

每道题使用统一入口：

```python
def solve(data):
    """接收 JSON 可序列化输入，返回 JSON 可序列化结果。"""
```

题目记录至少包含：

- `id`：稳定整数编号
- `slug`：与算法目录一致的唯一标识
- `statement`：问题定义与输入输出约定
- `examples`：公开样例
- `tests`：浏览器判题用例
- `insight`：核心状态、不变量与推导
- `starterCode`：编辑器初始模板
- `solutionPath`：对应算法目录中的 Python 参考实现

生成与校验脚本会保证题库、目录、演示和参考解法保持一致。

## 当前进度

- 全部 254 个主题已经进入题库，可搜索、筛选并打开动画和源码。
- 批次 A 的 50 道题已经提供独立 `solution.py`、公开样例和隐藏测试，可以在浏览器中运行与提交。
- 其余题目已建立稳定题号和讲解骨架，按根目录 `PROBLEM_TODO.md` 的 B-F 批次继续补全，界面会明确显示“讲解已收录”。

## 本地校验

```bash
node scripts/generate-problems.mjs --check
python tests/problem_solutions.py
python tests/browser_smoke.py BrowserSmokeTests.test_problem_bank_filters_deep_links_and_layout
python tests/browser_smoke.py BrowserSmokeTests.test_problem_bank_runs_python_in_worker
```
