def solve(data):
    num_vars = int(data["num_vars"])

    def dpll(clauses, assignment):
        clauses = [list(c) for c in clauses]
        changed = True
        while changed:
            changed = False
            units = [c[0] for c in clauses if len(c) == 1]
            for unit in units:
                new_clauses = []
                for c in clauses:
                    if unit in c:
                        continue
                    if -unit in c:
                        c = [lit for lit in c if lit != -unit]
                        if not c:
                            return None
                    new_clauses.append(c)
                clauses = new_clauses
                assignment = dict(assignment)
                assignment[abs(unit)] = unit > 0
                changed = True
            if not clauses:
                return assignment
            counts = {}
            for c in clauses:
                for lit in c:
                    counts.setdefault(abs(lit), set()).add(lit > 0)
            for var, polarities in counts.items():
                if len(polarities) == 1:
                    value = next(iter(polarities))
                    new_clauses = []
                    for c in clauses:
                        if (var if value else -var) in c:
                            continue
                        if (var if not value else -var) in c:
                            c = [lit for lit in c if lit != (-var if value else var)]
                            if not c:
                                return None
                        new_clauses.append(c)
                    clauses = new_clauses
                    assignment = dict(assignment)
                    assignment[var] = value
                    changed = True
                    break
        var = None
        for candidate in range(1, num_vars + 1):
            if candidate not in assignment:
                var = candidate
                break
        if var is None:
            return assignment
        for value in (False, True):
            new_clauses = [c for c in clauses if (var if value else -var) not in c]
            stripped = []
            conflict = False
            for c in new_clauses:
                c = [lit for lit in c if lit != (-var if value else var)]
                if not c:
                    conflict = True
                    break
                stripped.append(c)
            if conflict:
                continue
            result = dpll(stripped, {**assignment, var: value})
            if result is not None:
                return result
        return None

    result = dpll([list(c) for c in data["clauses"]], {})
    if result is None:
        return {"satisfiable": False, "assignment": None}
    assignment = [bool(result.get(v, False)) for v in range(1, num_vars + 1)]
    return {"satisfiable": True, "assignment": assignment}
