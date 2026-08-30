import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.core.database import Base, get_db
from backend.main import app

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

engine = create_engine(
    "sqlite:///./test.db",
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def user_data():
    return {
        "email": "testuser@example.com",
        "password": "StrongPassword123!",
    }


@pytest.fixture
def authenticated_client(client, user_data):
    register = client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert register.status_code == 201

    login = client.post(
        "/api/v1/auth/login",
        json=user_data,
    )

    assert login.status_code == 200

    token = login.json()["access_token"]

    client.headers.update({
        "Authorization": f"Bearer {token}"
    })

    return client
