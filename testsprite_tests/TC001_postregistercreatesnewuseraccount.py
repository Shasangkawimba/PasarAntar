import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_post_register_creates_new_user_account():
    url = f"{BASE_URL}/register"
    headers = {
        "Content-Type": "application/json"
    }
    # Example valid user data for registration
    payload = {
        "name": "Test User TC001",
        "email": "testuser_tc001@example.com",
        "password": "StrongPassword123!",
        "password_confirmation": "StrongPassword123!"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to /register failed with exception: {e}"

    assert response.status_code in (200, 201), f"Expected status 200 or 201, got {response.status_code}"

    if response.content and response.content.strip():
        try:
            json_resp = response.json()
        except Exception:
            assert False, "Response with content is not JSON"

        # Check for at least one expected key if JSON is present
        assert any(key in json_resp for key in ("id", "user", "message")), "Response JSON does not contain expected user confirmation data"


test_post_register_creates_new_user_account()
