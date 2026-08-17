from collections import Counter

def solve(data):
    return Counter(data["a"]) == Counter(data["b"])
