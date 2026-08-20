def solve(data):
    graph = [[] for _ in range(data["left"])]
    for left, right in data["edges"]:
        graph[left].append(right)
    matched = [-1] * data["right"]

    def augment(left, visited):
        for right in graph[left]:
            if visited[right]:
                continue
            visited[right] = True
            if matched[right] == -1 or augment(matched[right], visited):
                matched[right] = left
                return True
        return False

    return sum(augment(left, [False] * data["right"]) for left in range(data["left"]))
