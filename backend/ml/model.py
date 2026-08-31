from pathlib import Path
import sys

import joblib

from backend.ml.preprocessing import preprocess_text



BASE_DIR = Path(__file__).resolve().parents[1]

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
