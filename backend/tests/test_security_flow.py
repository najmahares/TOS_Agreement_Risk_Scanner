def test_logout_revokes_access_token(client):
    payload = {
        "email": "logout@example.com",
        "password": "StrongPassword123!",
    }
    register = client.post(
        "/api/v1/auth/register",
        json=payload,
    )
    assert register.status_code == 201

    login = client.post(
        "/api/v1/auth/login",
        json=payload,
    )
    assert login.status_code == 200

    token = login.json()["access_token"]
    headers = {
        "Authorization": f"Bearer {token}",
    }

    before_logout = client.get(
        "/api/v1/auth/me",
        headers=headers,
    )
    assert before_logout.status_code == 200

    logout = client.post(
        "/api/v1/auth/logout",
        headers=headers,
    )
    assert logout.status_code == 204

    after_logout = client.get(
        "/api/v1/auth/me",
        headers=headers,
    )
    assert after_logout.status_code == 401


def test_user_cannot_access_another_users_scan(client):
    user_a = {
        "email": "security-a@example.com",
        "password": "StrongPassword123!",
    }
    user_b = {
        "email": "security-b@example.com",
        "password": "StrongPassword123!",
    }

    register_a = client.post(
        "/api/v1/auth/register",
        json=user_a,
    )
    register_b = client.post(
        "/api/v1/auth/register",
        json=user_b,
    )
    assert register_a.status_code == 201
    assert register_b.status_code == 201

    login_a = client.post(
        "/api/v1/auth/login",
        json=user_a,
    )
    login_b = client.post(
        "/api/v1/auth/login",
        json=user_b,
    )

    token_a = login_a.json()["access_token"]
    token_b = login_b.json()["access_token"]

    scan = client.post(
        "/api/v1/scans",
        headers={
            "Authorization": f"Bearer {token_a}",
        },
        json={
            "title": "Private Agreement",
            "text": "We may suspend your account at any time.",
        },
    )
    assert scan.status_code == 201

    scan_id = scan.json()["scan_id"]

    get_other_scan = client.get(
        f"/api/v1/scans/{scan_id}",
        headers={
            "Authorization": f"Bearer {token_b}",
        },
    )
    assert get_other_scan.status_code == 404

    delete_other_scan = client.delete(
        f"/api/v1/scans/{scan_id}",
        headers={
            "Authorization": f"Bearer {token_b}",
        },
    )
    assert delete_other_scan.status_code == 404


def test_scan_requires_authentication(client):
    response = client.post(
        "/api/v1/scans",
        json={
            "title": "Unauthenticated",
            "text": "You agree to these terms.",
        },
    )
    assert response.status_code == 401

def test_scan_input_limit(authenticated_client):
    response = authenticated_client.post(
        "/api/v1/scans",
        json={
            "title": "Large Agreement",
            "text": "a" * 500001,
        },
    )

    assert response.status_code == 422
