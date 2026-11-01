def solve(data):
    jobs = [(int(p), int(d), i) for i, (p, d) in enumerate(data["jobs"])]
    order = sorted(jobs, key=lambda x: (-x[0], x[2]))
    slot_limit = min(len(jobs), max((d for _, d, _ in jobs), default=0))
    occupied = [False] * (slot_limit + 1)
    total = 0
    chosen = []
    for profit, deadline, idx in order:
        slot = min(deadline, slot_limit)
        while slot >= 1 and occupied[slot]:
            slot -= 1
        if slot >= 1:
            occupied[slot] = True
            total += profit
            chosen.append(idx)
    return {"profit": total, "chosen": sorted(chosen)}
