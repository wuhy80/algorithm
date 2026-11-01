def solve(data):
    head = ["H", None, None]
    tail = ["T", head, None]
    head[2] = tail
    nodes = {}

    def push_front(value):
        node = [value, head, head[2]]
        head[2][1] = node
        head[2] = node

    def push_back(value):
        node = [value, tail[1], tail]
        tail[1][2] = node
        tail[1] = node

    def pop_front():
        first = head[2]
        if first is tail:
            return None
        first[1][2] = first[2]
        first[2][1] = first[1]
        return first[0]

    def pop_back():
        last = tail[1]
        if last is head:
            return None
        last[1][2] = last[2]
        last[2][1] = last[1]
        return last[0]

    def remove_value(value):
        node = head[2]
        while node is not tail:
            if node[0] == value:
                node[1][2] = node[2]
                node[2][1] = node[1]
                return True
            node = node[2]
        return False

    outputs = []
    for op in data["ops"]:
        kind = op[0]
        if kind == "pushFront":
            push_front(op[1])
        elif kind == "pushBack":
            push_back(op[1])
        elif kind == "popFront":
            outputs.append(pop_front())
        elif kind == "popBack":
            outputs.append(pop_back())
        else:
            outputs.append(remove_value(op[1]))
    forward = []
    node = head[2]
    while node is not tail:
        forward.append(node[0])
        node = node[2]
    backward = []
    node = tail[1]
    while node is not head:
        backward.append(node[0])
        node = node[1]
    return {"outputs": outputs, "forward": forward, "backward": backward}
