import math

def solve(data):
    result = []
    for x in data["values"]:
        relu = x if x > 0 else 0.0
        sigmoid = 1.0 / (1.0 + math.exp(-x))
        tanh = math.tanh(x)
        result.append([round(float(relu), 6), round(sigmoid, 6), round(tanh, 6)])
    return result
