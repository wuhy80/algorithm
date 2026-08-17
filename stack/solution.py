def solve(data):
    stack, output = [], []
    for operation in data:
        if operation[0] == "push": stack.append(operation[1])
        elif operation[0] == "pop": output.append(stack.pop())
        else: output.append(stack[-1])
    return output
