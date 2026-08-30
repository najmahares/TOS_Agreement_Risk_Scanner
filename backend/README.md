# Agreement Risk Scanner

An ML-powered API for detecting and explaining potentially risky contractual clauses.

The system takes contractual text, extracts individual clauses, classifies them using a trained machine-learning model, assigns risk priorities, and returns human-readable explanations for flagged clauses.

## Features

* User registration and authentication
* JWT-based access control
* Password hashing with Argon2
* Contract clause extraction
* ML-based clause risk classification
* Risk categories and priority levels
* Human-readable explanations for flagged clauses
* Scan history and pagination
* User-specific scan access
* Scan deletion
* Token revocation on logout
* Input validation and size limits
* PostgreSQL database support
* Automated API and security tests

## Risk Categories

The scanner classifies clauses into five categories:

| Category                | Meaning                                                         |
| ----------------------- | --------------------------------------------------------------- |
| `FAIR`                  | No significant risk pattern detected                            |
| `REMOVE_CONTENT`        | Broad or subjective content-removal authority                   |
| `UNBALANCED_DELEGATION` | Uneven allocation of contractual control                        |
| `TERMINATE_CONTRACT`    | Suspension, restriction, modification, or termination authority |
| `OTHER`                 | Other contractual patterns requiring review                     |

Flagged clauses are also assigned a priority level:

* **HIGH**
* **MEDIUM**

## Architecture

```text
Client
  │
  ▼
FastAPI
  │
  ├── Authentication
  │     ├── Registration
  │     ├── Login
  │     ├── JWT validation
  │     └── Token revocation
  │
  ├── Scan API
  │     ├── Clause extraction
  │     ├── ML classification
  │     ├── Risk prioritization
  │     └── Scan persistence
  │
  └── PostgreSQL
        ├── Users
        ├── Scans
        ├── Clauses
        └── Revoked tokens
```

## Tech Stack

**Backend**

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Pydantic

**Machine Learning**

* scikit-learn
* Joblib
* Custom text preprocessing
* Trained contractual-risk classification model

**Security**

* JWT
* Argon2 password hashing
* Token revocation
* User-level resource authorization

**Testing**

* pytest
* FastAPI TestClient

## API Endpoints

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

### Scans

```text
POST   /api/v1/scans
GET    /api/v1/scans
GET    /api/v1/scans/{scan_id}
DELETE /api/v1/scans/{scan_id}
```

### Health

```text
GET /health
```

## Example

A scan request:

```json
{
  "title": "Terms of Service",
  "text": "We may suspend your account at any time. You agree to our terms."
}
```

The API returns structured findings such as:

```json
{
  "category": "TERMINATE_CONTRACT",
  "priority": "HIGH",
  "is_flagged": true,
  "reason": "The clause gives a party authority to suspend, restrict, modify, or terminate access or the agreement."
}
```

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/agreement-risk-scanner.git
cd agreement-risk-scanner
```

### 2. Create a virtual environment

```bash
python3 -m venv env
source env/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy the example configuration:

```bash
cp .env.example .env
```

Set your PostgreSQL connection string and application secret.

### 5. Create the database tables

Use the project's database initialization/migration process.

### 6. Start the API

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

## Testing

Run the complete test suite:

```bash
pytest -v
```

The current test suite covers:

* Authentication
* Registration validation
* Duplicate accounts
* Login failures
* Protected endpoints
* Scan creation
* Scan history
* Scan retrieval
* Scan deletion
* User-to-user scan isolation
* Logout and token revocation
* Input-size validation

## Project Structure

```text
agreement-risk-scanner/
├── app/
│   ├── core/
│   ├── ml/
│   ├── models/
│   ├── repositories/
│   ├── routers/
│   ├── schemas/
│   └── services/
├── data/
├── notebooks/
│   └── models/
├── tests/
├── .env.example
├── .gitignore
└── requirements.txt
```

## Disclaimer

This project is intended for research, educational, and decision-support purposes. It does not provide legal advice and should not replace review by a qualified legal professional.

