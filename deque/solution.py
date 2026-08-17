from collections import deque

def solve(data):
    values, output = deque(), []
    for operation in data:
        name = operation[0]
        if name == "push_left": values.appendleft(operation[1])
        elif name == "push_right": values.append(operation[1])
        elif name == "pop_left": output.append(values.popleft())
        else: output.append(values.pop())
    return output
