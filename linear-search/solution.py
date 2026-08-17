def solve(data):
    for index, value in enumerate(data["nums"]):
        if value == data["target"]:
            return index
    return -1
