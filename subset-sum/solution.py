def solve(data):
    reachable = {0}
    for value in data["nums"]:
        reachable |= {current + value for current in reachable}
        if data["target"] in reachable:
            return True
    return data["target"] in reachable
