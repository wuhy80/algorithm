def solve(data):
    capacity = int(data["capacity"])
    nodes = [[0, 0, 0, 0], [0, 0, 0, 1]]  # [key, value, prev, next]; 0/1 为哨兵
    head, tail = 0, 1
    nodes[0][3] = 1
    nodes[1][2] = 0
    key_node = {}

    def detach(i):
        p, n = nodes[i][2], nodes[i][3]
        nodes[p][3] = n
        nodes[n][2] = p

    def push_front(i):
        first = nodes[head][3]
        nodes[i][2] = head
        nodes[i][3] = first
        nodes[head][3] = i
        nodes[first][2] = i

    size = 0
    out = []
    for op in data["ops"]:
        if op[0] == "get":
            k = op[1]
            if k in key_node:
                i = key_node[k]
                detach(i)
                push_front(i)
                out.append(nodes[i][1])
            else:
                out.append(None)
        else:
            k, v = op[1], op[2]
            if k in key_node:
                i = key_node[k]
                nodes[i][1] = v
                detach(i)
                push_front(i)
            else:
                if size >= capacity:
                    last = nodes[tail][2]
                    detach(last)
                    del key_node[nodes[last][0]]
                    size -= 1
                nodes.append([k, v, -1, -1])
                key_node[k] = len(nodes) - 1
                push_front(len(nodes) - 1)
                size += 1
    return out
