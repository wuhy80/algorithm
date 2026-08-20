def solve(data):
    links, start = data["next"], data["start"]
    slow = fast = start
    while fast != -1 and links[fast] != -1:
        slow = links[slow]
        fast = links[links[fast]]
        if slow == fast:
            cursor = start
            while cursor != slow:
                cursor = links[cursor]
                slow = links[slow]
            return cursor
    return -1
