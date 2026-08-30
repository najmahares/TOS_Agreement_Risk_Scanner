import re


def extract_clauses(text: str) -> list[str]:
    text = text.strip()

    if not text:
        return []

    
    text = re.sub(r"\s+", " ", text)

    numbered = re.split(
        r"(?=\b(?:\d+(?:\.\d+)*|[A-Z]\.)\s+)",
        text,
    )

    clauses = [
        clause.strip()
        for clause in numbered
        if clause.strip()
    ]

  
    if len(clauses) <= 1:
        clauses = re.split(
            r"(?<=[.!?])\s+",
            text,
        )

    return [
        clause.strip()
        for clause in clauses
        if clause.strip()
    ]