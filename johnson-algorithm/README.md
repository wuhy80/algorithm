# Johnson 全源最短路

Johnson 算法先用 Bellman-Ford 计算势能，把含负边但无负环的图重标为非负权，再从每个节点运行 Dijkstra。稀疏图复杂度约 O(VE+V² log V)。

演示显示势能松弛、重标边权和逐源最短距离结果。
