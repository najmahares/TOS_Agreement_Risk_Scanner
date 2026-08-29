def create_scan(client, title="Test Agreement"):
    response = client.post(
        "/api/v1/scans",
        json={
            "title": title,
            "text": (
                "We may suspend your account at any time. "
                "You agree to our terms."
            ),
        },
    )

    assert response.status_code == 201

    return response.json()


def test_create_scan_requires_authentication(client):
    response = client.post(
        "/api/v1/scans",
        json={
            "title": "Unauthorized",
            "text": "You agree to our terms.",
        },
    )

    assert response.status_code == 401


def test_authenticated_user_can_create_scan(authenticated_client):
    scan = create_scan(authenticated_client)

    assert scan["title"] == "Test Agreement"
    assert scan["status"] == "completed"
    assert scan["stats"]["total_clauses"] == 2
    assert scan["stats"]["flagged_count"] == 1
    assert len(scan["findings"]) == 2


def test_user_can_list_own_scans(authenticated_client):
    create_scan(authenticated_client)

    response = authenticated_client.get("/api/v1/scans")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] >= 1
    assert len(data["items"]) >= 1


def test_user_can_get_own_scan(authenticated_client):
    scan = create_scan(authenticated_client)

    response = authenticated_client.get(
        f"/api/v1/scans/{scan['scan_id']}"
    )

    assert response.status_code == 200
    assert response.json()["scan_id"] == scan["scan_id"]


def test_user_can_delete_own_scan(authenticated_client):
    scan = create_scan(authenticated_client)

    response = authenticated_client.delete(
        f"/api/v1/scans/{scan['scan_id']}"
    )

    assert response.status_code == 204

    response = authenticated_client.get(
        f"/api/v1/scans/{scan['scan_id']}"
    )

    assert response.status_code == 404


def test_users_cannot_access_each_others_scans(client):
    user_a = {
        "email": "usera@example.com",
        "password": "StrongPassword123!",
    }

    user_b = {
        "email": "userb@example.com",
        "password": "StrongPassword123!",
    }

    client.post(
        "/api/v1/auth/register",
        json=user_a,
    )

    client.post(
        "/api/v1/auth/register",
        json=user_b,
    )

    login_a = client.post(
        "/api/v1/auth/login",
        json=user_a,
    )

    token_a = login_a.json()["access_token"]

    client.headers.update({
        "Authorization": f"Bearer {token_a}"
    })

    scan_a = create_scan(client, "User A Agreement")

    login_b = client.post(
        "/api/v1/auth/login",
        json=user_b,
    )

    token_b = login_b.json()["access_token"]

    client.headers.update({
        "Authorization": f"Bearer {token_b}"
    })

    scan_b = create_scan(client, "User B Agreement")

    response = client.get(
        f"/api/v1/scans/{scan_a['scan_id']}"
    )

    assert response.status_code == 404

    response = client.delete(
        f"/api/v1/scans/{scan_a['scan_id']}"
    )

    assert response.status_code == 404

    response = client.get(
        f"/api/v1/scans/{scan_b['scan_id']}"
    )

    assert response.status_code == 200

    client.headers.update({
        "Authorization": f"Bearer {token_a}"
    })

    response = client.get(
        f"/api/v1/scans/{scan_b['scan_id']}"
    )

    assert response.status_code == 404

    response = client.delete(
        f"/api/v1/scans/{scan_b['scan_id']}"
    )

    assert response.status_code == 404

    response = client.get(
        f"/api/v1/scans/{scan_a['scan_id']}"
    )

    assert response.status_code == 200
