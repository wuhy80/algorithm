import heapq

def solve(data):
    grid = data["grid"]
    rows, cols = len(grid), len(grid[0])
    start, target = tuple(data["start"]), tuple(data["target"])
    if grid[start[0]][start[1]] or grid[target[0]][target[1]]:
        return -1
    def heuristic(node):
        return abs(node[0] - target[0]) + abs(node[1] - target[1])
    best = {start: 0}
    heap = [(heuristic(start), 0, start)]
    while heap:
        _, cost, node = heapq.heappop(heap)
        if cost != best[node]:
            continue
        if node == target:
            return cost
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            neighbor = (node[0] + dr, node[1] + dc)
            if not (0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols):
                continue
            if grid[neighbor[0]][neighbor[1]]:
                continue
            candidate = cost + 1
            if candidate < best.get(neighbor, 10**9):
                best[neighbor] = candidate
                heapq.heappush(heap, (candidate + heuristic(neighbor), candidate, neighbor))
    return -1
