def solve(data):
    lo = int(data["lo"])
    hi = int(data["hi"])

    def count_up_to(limit):
        if limit < 0:
            return 0
        digits = [int(ch) for ch in str(limit)]
        from functools import lru_cache

        @lru_cache(maxsize=None)
        def dfs(pos, prev, tight, started):
            if pos == len(digits):
                return 1
            upper = digits[pos] if tight else 9
            total = 0
            for d in range(upper + 1):
                next_tight = tight and d == upper
                if not started:
                    if d == 0:
                        total += dfs(pos + 1, -1, next_tight, False)
                    else:
                        total += dfs(pos + 1, d, next_tight, True)
                else:
                    if d == prev:
                        continue
                    total += dfs(pos + 1, d, next_tight, True)
            return total

        return dfs(0, -1, True, False)

    return count_up_to(hi) - count_up_to(lo - 1)
