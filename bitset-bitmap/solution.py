def solve(data):
    bits = int(data["bits"])
    bitmap = bytearray(bits)
    for value in data["nums"]:
        bitmap[int(value)] = 1
    unique_sorted = [i for i in range(bits) if bitmap[i]]
    return {"sorted_unique": unique_sorted, "bits_used": len(unique_sorted)}
