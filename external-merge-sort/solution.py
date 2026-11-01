import heapq


def solve(data):
    runs = [list(run) for run in data["runs"]]
    memory = int(data["memory"])
    passes = 0
    while len(runs) > 1:
        next_runs = []
        for start in range(0, len(runs), memory):
            merged = []
            heap = []
            for run_idx, run in enumerate(runs[start:start + memory]):
                if run:
                    heap.append((run[0], run_idx, 0))
            heapq.heapify(heap)
            while heap:
                value, run_idx, pos = heapq.heappop(heap)
                merged.append(value)
                if pos + 1 < len(runs[start + run_idx]):
                    nxt = runs[start + run_idx][pos + 1]
                    heapq.heappush(heap, (nxt, run_idx, pos + 1))
            next_runs.append(merged)
        runs = next_runs
        passes += 1
    return {"sorted": runs[0] if runs else [], "passes": passes}
