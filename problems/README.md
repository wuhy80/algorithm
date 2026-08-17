# 在线题库

本目录承载算法可视化图谱的在线做题功能。本站训练题由根目录 `catalog.json` 和各算法目录的 `solution.py` 统一生成；LeetCode 索引只保存公开元数据并链接原站。

## 数据约定

每道题使用统一入口：

```python
def solve(data):
    """接收 JSON 可序列化输入，返回 JSON 可序列化结果。"""
```

题目记录至少包含：

- `id`：稳定整数编号
- `slug`：题目的唯一标识；核心题与算法目录一致，训练变体带 `--state`、`--edge` 或 `--applied` 后缀
- `baseSlug`：对应的算法目录标识
- `variant` / `variantLabel`：训练类型及其显示名称
- `statement`：问题定义与输入输出约定
- `examples`：公开样例
- `tests`：浏览器判题用例
- `insight`：核心状态、不变量与推导
- `starterCode`：编辑器初始模板
- `solutionPath`：对应算法目录中的 Python 参考实现

生成与校验脚本会保证题库、目录、演示和参考解法保持一致。

## 当前进度

- 254 个主题各生成 4 类原创训练题，共 1016 道，可按分类、难度、阶段和训练类型筛选。
- 批次 A 的 50 个算法目录已经提供独立 `solution.py`、公开样例和隐藏测试，对应 200 道可在浏览器中运行与提交的训练题。
- 其余 816 道题已建立稳定题号和讲解骨架，按根目录 `PROBLEM_TODO.md` 的 B-F 批次继续补全，界面会明确显示“讲解已收录”。
- LeetCode 题源提供 4029 条公开元数据索引，按 100 道分页；题面、样例和解答仍在 LeetCode 原站查看。

## 本地校验

```bash
node scripts/generate-problems.mjs --check
node scripts/sync-leetcode-index.mjs --check
python tests/problem_solutions.py
python tests/browser_smoke.py BrowserSmokeTests.test_problem_bank_filters_deep_links_and_layout
python tests/browser_smoke.py BrowserSmokeTests.test_problem_bank_runs_python_in_worker
```
