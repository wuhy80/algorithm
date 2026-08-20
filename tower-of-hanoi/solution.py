def solve(data):
    moves = []

    def move(count, source, auxiliary, target):
        if count == 0:
            return
        move(count - 1, source, target, auxiliary)
        moves.append([source, target])
        move(count - 1, auxiliary, source, target)

    move(int(data), "A", "B", "C")
    return moves
