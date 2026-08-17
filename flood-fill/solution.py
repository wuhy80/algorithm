from collections import deque

def solve(data):
    image = [row[:] for row in data["image"]]
    r0, c0, new = data["row"], data["col"], data["color"]
    old = image[r0][c0]
    if old == new: return image
    queue = deque([(r0, c0)]); image[r0][c0] = new
    while queue:
        row, col = queue.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = row + dr, col + dc
            if 0 <= nr < len(image) and 0 <= nc < len(image[0]) and image[nr][nc] == old:
                image[nr][nc] = new; queue.append((nr, nc))
    return image
