def solve(data):
    text = data["text"]
    if data["mode"] == "encode":
        out = []
        i = 0
        n = len(text)
        while i < n:
            j = i
            while j < n and text[j] == text[i]:
                j += 1
            out.append(text[i] + str(j - i))
            i = j
        return "".join(out)
    out = []
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        j = i + 1
        while j < n and text[j].isdigit():
            j += 1
        out.append(ch * int(text[i + 1:j]))
        i = j
    return "".join(out)
