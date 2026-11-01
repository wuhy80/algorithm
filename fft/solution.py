import math


def solve(data):
    a = list(data["a"])
    b = list(data["b"])
    if not a or not b:
        return []
    result_len = len(a) + len(b) - 1
    size = 1
    while size < result_len:
        size <<= 1
    fa = [complex(float(v), 0.0) for v in a] + [complex(0.0, 0.0)] * (size - len(a))
    fb = [complex(float(v), 0.0) for v in b] + [complex(0.0, 0.0)] * (size - len(b))

    def transform(arr, invert):
        n = len(arr)
        j = 0
        for i in range(1, n):
            bit = n >> 1
            while j & bit:
                j ^= bit
                bit >>= 1
            j |= bit
            if i < j:
                arr[i], arr[j] = arr[j], arr[i]
        length = 2
        while length <= n:
            ang = 2.0 * math.pi / length * (-1.0 if invert else 1.0)
            w_len = complex(math.cos(ang), math.sin(ang))
            half = length >> 1
            for start in range(0, n, length):
                w = complex(1.0, 0.0)
                for offset in range(half):
                    u = arr[start + offset]
                    v = arr[start + offset + half] * w
                    arr[start + offset] = u + v
                    arr[start + offset + half] = u - v
                    w *= w_len
            length <<= 1
        if invert:
            for i in range(n):
                arr[i] /= n

    transform(fa, False)
    transform(fb, False)
    fc = [fa[i] * fb[i] for i in range(size)]
    transform(fc, True)
    return [int(round(fc[i].real)) for i in range(result_len)]
