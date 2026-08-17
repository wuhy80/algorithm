class Node:
    def __init__(self, value, next_node=None):
        self.value, self.next = value, next_node

def solve(data):
    dummy = Node(None)
    tail = dummy
    for value in data["values"]:
        tail.next = Node(value); tail = tail.next
    for operation in data["operations"]:
        name, value = operation
        if name == "prepend": dummy.next = Node(value, dummy.next)
        elif name == "append":
            cursor = dummy
            while cursor.next: cursor = cursor.next
            cursor.next = Node(value)
        else:
            cursor = dummy
            while cursor.next and cursor.next.value != value: cursor = cursor.next
            if cursor.next: cursor.next = cursor.next.next
    result, cursor = [], dummy.next
    while cursor: result.append(cursor.value); cursor = cursor.next
    return result
