import heapq

def solve(data):
    heap, output = [], []
    for operation in data:
        if operation[0] == "push": heapq.heappush(heap, operation[1])
        elif operation[0] == "pop": output.append(heapq.heappop(heap))
        else: output.append(heap[0])
    return output
