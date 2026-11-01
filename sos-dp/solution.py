def solve(data):
    f = [int(v) for v in data["array"]]
    size = len(f)
    k = size.bit_length() - 1
    if (1 << k) != size:
        raise ValueError("length must be a power of two")
    for i in range(k):
        for mask in range(size):
            if mask & (1 << i):
                f[mask] += f[mask ^ (1 << i)]
    return f
