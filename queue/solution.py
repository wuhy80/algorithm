from collections import deque

def solve(data):
    queue, output = deque(), []
    for operation in data:
        if operation[0] == "enqueue": queue.append(operation[1])
        elif operation[0] == "dequeue": output.append(queue.popleft())
        else: output.append(queue[0])
    return output
