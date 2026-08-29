def test_register(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["is_active"] is True


def test_duplicate_registration(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "StrongPassword123!",
    }

    first = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    second = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert first.status_code == 201
    assert second.status_code == 409


def test_weak_password(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "weak@example.com",
            "password": "short",
        },
    )

    assert response.status_code == 422


def test_login(client):
    payload = {
        "email": "login@example.com",
        "password": "StrongPassword123!",
    }

    register = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert register.status_code == 201

    response = client.post(
        "/api/v1/auth/login",
        json=payload,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["access_token"]
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 900
    assert data["user"]["email"] == payload["email"]


def test_wrong_password(client):
    payload = {
        "email": "wrongpassword@example.com",
        "password": "StrongPassword123!",
    }

    register = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert register.status_code == 201

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": payload["email"],
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401


def test_me_requires_authentication(client):
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 401


def test_me(authenticated_client, user_data):
    response = authenticated_client.get("/api/v1/auth/me")

    assert response.status_code == 200
    assert response.json()["email"] == user_data["email"]
