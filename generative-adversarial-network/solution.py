import math

def sig(t):
    if t >= 0:
        return 1.0 / (1.0 + math.exp(-t))
    e = math.exp(t)
    return e / (1.0 + e)

def solve(data):
    w_g = float(data["w_g"])
    b_g = float(data["b_g"])
    w_d = float(data["w_d"])
    b_d = float(data["b_d"])
    real = float(data["real"])
    noise = float(data["noise"])
    lr = float(data["lr"])
    fake = w_g * noise + b_g
    p_real = sig(w_d * real + b_d)
    p_fake = sig(w_d * fake + b_d)
    dw_d = ((p_real - 1.0) * real + p_fake * fake) / 2.0
    db_d = ((p_real - 1.0) + p_fake) / 2.0
    w_d -= lr * dw_d
    b_d -= lr * db_d
    d_prob_real = sig(w_d * real + b_d)
    d_prob_fake = sig(w_d * fake + b_d)
    dw_g = (d_prob_fake - 1.0) * w_d * noise
    db_g = (d_prob_fake - 1.0) * w_d
    w_g -= lr * dw_g
    b_g -= lr * db_g
    fake_new = w_g * noise + b_g
    return {
        "d_prob_real": round(d_prob_real, 6),
        "d_prob_fake": round(d_prob_fake, 6),
        "fake_sample": round(fake_new, 6),
    }
