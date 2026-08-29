from pathlib import Path
import sys

import joblib

from app.ml.preprocessing import preprocess_text


# Project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Original model trained and validated in the notebook
MODEL_PATH = (
    BASE_DIR
    / "notebooks"
    / "models"
    / "agreement_risk_scanner_original.joblib"
)

LABEL_MAPPING = {
    0: "FAIR",
    1: "REMOVE_CONTENT",
    2: "UNBALANCED_DELEGATION",
    3: "TERMINATE_CONTRACT",
    4: "OTHER",
}


# The notebook serialized preprocess_text as __main__.preprocess_text.
# Make the application version available during deserialization.
sys.modules["__main__"].preprocess_text = preprocess_text


print(f"Loading ML model from: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

print(f"ML model loaded: {type(model).__name__}")


def predict_clause(text: str) -> dict:
    """
    Predict the contractual risk category for one clause.
    """

    prediction = model.predict([text])[0]

    return {
        "label": int(prediction),
        "risk_category": LABEL_MAPPING[int(prediction)],
    }
