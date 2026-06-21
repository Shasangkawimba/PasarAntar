import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_post_login_authenticates_user_with_valid_credentials():
    session = requests.Session()
    login_url = f"{BASE_URL}/login"
    # Use a known valid user email and password for login
    payload = {
        "email": "testuser@example.com",
        "password": "password123"
    }
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try:
        response = session.post(login_url, json=payload, headers=headers, timeout=TIMEOUT)
        # Assert status code is 200
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        # Validate that some session cookie is set (not necessarily named 'laravel_session')
        cookies = session.cookies.get_dict()
        assert len(cookies) > 0, "No cookies found in response; session may not be established"
        # Only attempt JSON parse if response says application/json
        content_type = response.headers.get('Content-Type', '')
        if 'application/json' in content_type:
            json_resp = response.json()
            assert isinstance(json_resp, dict), "Response JSON is not a dictionary"
            assert len(json_resp) > 0, "Response JSON is empty"
    except requests.RequestException as e:
        assert False, f"RequestException occurred: {e}"


test_post_login_authenticates_user_with_valid_credentials()