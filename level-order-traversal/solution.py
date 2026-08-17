from collections import deque

def solve(data):
    if not data or data[0] is None:
        return []
    result = []
    queue = deque([0])
    while queue:
        index = queue.popleft()
        if index >= len(data) or data[index] is None:
            continue
        result.append(data[index])
        queue.append(index * 2 + 1)
        queue.append(index * 2 + 2)
    return result
