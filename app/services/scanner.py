from app.ml.model import predict_clause
from app.services.clause_extractor import extract_clauses


def determine_priority(category: str) -> str | None:
   

    if category == "FAIR":
        return None

    if category == "TERMINATE_CONTRACT":
        return "HIGH"

    if category == "REMOVE_CONTENT":
        return "MEDIUM"

    if category == "UNBALANCED_DELEGATION":
        return "MEDIUM"

    if category == "OTHER":
        return "MEDIUM"

    return "MEDIUM"


def get_flag_reason(category: str) -> str | None:
    """
    Human-readable explanation for the UI.
    """

    reasons = {
        "TERMINATE_CONTRACT": (
            "The clause gives a party authority to suspend, "
            "restrict, modify, or terminate access or the agreement."
        ),
        "REMOVE_CONTENT": (
            "The clause permits content removal based on "
            "broad or subjective criteria."
        ),
        "UNBALANCED_DELEGATION": (
            "The clause may create an uneven allocation "
            "of contractual control."
        ),
        "OTHER": (
            "The clause contains a contractual pattern "
            "that may deserve additional review."
        ),
    }

    return reasons.get(category)


def analyze_agreement(text: str) -> dict:
    """
    Extract clauses and classify each clause using
    the trained ML pipeline.
    """

    clauses = extract_clauses(text)

    findings = []

    for index, clause in enumerate(clauses, start=1):
        prediction = predict_clause(clause)

        category = prediction["risk_category"]

        priority = determine_priority(category)

        is_flagged = category != "FAIR"

        findings.append(
            {
                "clause_number": index,
                "text": clause,
                "category": category,
                "priority": priority,
                "is_flagged": is_flagged,
                "reason": get_flag_reason(category),
            }
        )

    total_clauses = len(findings)

    flagged = [
        finding
        for finding in findings
        if finding["is_flagged"]
    ]

    high = [
        finding
        for finding in flagged
        if finding["priority"] == "HIGH"
    ]

    medium = [
        finding
        for finding in flagged
        if finding["priority"] == "MEDIUM"
    ]

    flagged_count = len(flagged)

    flagged_percentage = (
        (flagged_count / total_clauses) * 100
        if total_clauses
        else 0
    )

    return {
        "total_clauses": total_clauses,
        "flagged_count": flagged_count,
        "flagged_percentage": round(flagged_percentage, 2),
        "high_priority": len(high),
        "medium_priority": len(medium),
        "findings": findings,
    }