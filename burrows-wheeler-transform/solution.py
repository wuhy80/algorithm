def solve(data):
    text = data["text"] + "$"
    n = len(text)
    rotations = sorted(text[i:] + text[:i] for i in range(n))
    return "".join(rot[-1] for rot in rotations)
