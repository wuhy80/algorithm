from fractions import Fraction


def solve(data):
    poly = data["polygon"]
    n = len(poly)

    def on_segment(px, py, ax, ay, bx, by):
        if (bx - ax) * (py - ay) - (by - ay) * (px - ax) != 0:
            return False
        return min(ax, bx) <= px <= max(ax, bx) and min(ay, by) <= py <= max(ay, by)

    out = []
    for qx, qy in data["queries"]:
        boundary = False
        for k in range(n):
            ax, ay = poly[k]
            bx, by = poly[(k + 1) % n]
            if on_segment(qx, qy, ax, ay, bx, by):
                boundary = True
                break
        if boundary:
            out.append("boundary")
            continue
        inside = False
        for k in range(n):
            ax, ay = poly[k]
            bx, by = poly[(k + 1) % n]
            if (ay > qy) != (by > qy):
                x_int = Fraction(ax) + Fraction(qy - ay) * (bx - ax) / (by - ay)
                if x_int > qx:
                    inside = not inside
        out.append("inside" if inside else "outside")
    return out
