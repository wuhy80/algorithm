MODULUS = 998244353
GENERATOR = 3


def solve(data):
    a = [int(v) % MODULUS for v in data["a"]]
    b = [int(v) % MODULUS for v in data["b"]]
    if not a or not b:
        return []
    result_len = len(a) + len(b) - 1
    size = 1
    while size < result_len:
        size <<= 1
    fa = a + [0] * (size - len(a))
    fb = b + [0] * (size - len(b))

    def ntt(arr, invert):
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
            w_len = pow(GENERATOR, (MODULUS - 1) // length, MODULUS)
            if invert:
                w_len = pow(w_len, MODULUS - 2, MODULUS)
            half = length >> 1
            for start in range(0, n, length):
                w = 1
                for offset in range(half):
                    u = arr[start + offset]
                    v = arr[start + offset + half] * w % MODULUS
                    arr[start + offset] = (u + v) % MODULUS
                    arr[start + offset + half] = (u - v) % MODULUS
                    w = w * w_len % MODULUS
            length <<= 1
        if invert:
            inv_n = pow(n, MODULUS - 2, MODULUS)
            for i in range(n):
                arr[i] = arr[i] * inv_n % MODULUS

    ntt(fa, False)
    ntt(fb, False)
    fc = [fa[i] * fb[i] % MODULUS for i in range(size)]
    ntt(fc, True)
    return fc[:result_len]
