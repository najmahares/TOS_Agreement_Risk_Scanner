# Agreement Risk Scanner

An AI-powered suite for detecting and explaining potentially risky contractual clauses.

This repository is a monorepo containing both the Machine Learning backend and the React frontend.

## Repository Structure

```text
agreement-risk-scanner/
├── backend/                 # Python FastAPI + ML Backend
│   ├── app/                 # FastAPI routes, models, schemas, services
│   ├── ml/                  # Machine Learning models and preprocessing
│   └── requirements.txt
├── frontend/                # Next.js React Frontend
│   ├── src/                 # App Router, Components, Context
│   └── package.json
└── README.md
```

## Tech Stack

| Layer      | Technology                                         |
| :--------- | :------------------------------------------------- |
| Frontend   | Next.js 13+ (App Router), JavaScript, CSS          |
| Backend    | Python, FastAPI, SQLAlchemy, PostgreSQL            |
| ML         | scikit-learn, Joblib, Custom text preprocessing    |
| Security   | JWT, Argon2 password hashing, Token revocation     |

## Getting Started

### Backend (Python API)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv env
   source env/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

5. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```
   *(Note: Make sure `backend/` is the root directory when running locally)*

### Frontend (React Application)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend (Render)
1. Connect your repository to a new Web Service on Render.
2. **Root Directory:** `.` (The root)
3. **Build Command:** `pip install -r backend/requirements.txt`
4. **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. Import your repository into a new Vercel project.
2. **Root Directory:** `frontend`
3. **Environment Variable:** `NEXT_PUBLIC_API_URL` (Set to your production Render URL)
