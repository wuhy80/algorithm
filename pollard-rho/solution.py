from math import gcd


def solve(data):
    n = int(data["n"])
    state = int(data["seed"]) & 0xffffffff
    if n % 2 == 0:
        return 2
    d = 3
    while d * d <= n and d < 1000:
        if n % d == 0:
            return d
        d += 2
    if n % d == 0 and d * d <= n:
        return d
    while True:
        state = (state * 1664525 + 1013904223) & 0xffffffff
        c = state % 191 + 1
        x = 2
        y = 2
        g = 1
        while g == 1:
            x = (x * x + c) % n
            y = (y * y + c) % n
            y = (y * y + c) % n
            g = gcd(abs(x - y), n)
        if g != n:
            return g
