def solve(data):
    m = int(data["bits"])
    bits = [0] * m

    def positions(word):
        djb2 = 5381
        fnv = 2166136261
        for ch in word:
            code = ord(ch)
            djb2 = (djb2 * 33 + code) & 0xffffffff
            fnv = ((fnv ^ code) * 16777619) & 0xffffffff
        mixed = djb2 ^ fnv
        return [djb2 % m, fnv % m, mixed % m]

    for word in data["inserts"]:
        for pos in positions(word):
            bits[pos] = 1
    return [all(bits[pos] for pos in positions(word)) for word in data["checks"]]
