def preprocess_text(text):
    """
    Normalize contractual text using the exact preprocessing
    used during model training.
    """
    replacements = {
        "-lrb-": "(",
        "-rrb-": ")",
        "-lsb-": "[",
        "-rsb-": "]",
    }

    text = text.lower()

    for old, new in replacements.items():
        text = text.replace(old, new)

    return " ".join(text.split())
