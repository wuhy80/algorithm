"""维护决策的透明基线。

输入成本单位为万元，返回三种动作的期望成本和成本最低的推荐动作。
演示中的固定系数应在真实产线中用历史工单和安全约束校准。
"""

PLANNED_DOWNTIME_RATIO = 0.25
DERATING_IMPACT_RATIO = 0.45


def solve(data):
    """比较立即维护、继续运行、降载运行的期望成本。

    ``failure_probability`` 为 [0, 1]；其余输入应为非负成本（万元）。
    """
    probability = float(data.get("failure_probability", 0.0))
    downtime_loss = float(data.get("downtime_loss", 0.0))
    repair_cost = float(data.get("repair_cost", 0.0))
    emergency_penalty = float(data.get("emergency_penalty", 0.0))
    derating_cost = float(data.get("derating_cost", 0.0))
    if not 0 <= probability <= 1:
        raise ValueError("failure_probability 必须在 0 到 1 之间")
    if min(downtime_loss, repair_cost, emergency_penalty, derating_cost) < 0:
        raise ValueError("成本不能为负数")

    incident_cost = downtime_loss + emergency_penalty
    costs = {
        "immediate": repair_cost + PLANNED_DOWNTIME_RATIO * downtime_loss,
        "continue": probability * incident_cost,
        "derated": derating_cost + DERATING_IMPACT_RATIO * probability * incident_cost,
    }
    recommendation = min(costs, key=costs.get)
    return {
        "costs": {name: round(value, 4) for name, value in costs.items()},
        "recommendation": recommendation,
        "incident_cost": round(incident_cost, 4),
    }


if __name__ == "__main__":
    example = solve({
        "failure_probability": 0.22,
        "downtime_loss": 80,
        "repair_cost": 32,
        "emergency_penalty": 40,
        "derating_cost": 18,
    })
    print(example)
