import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_post_logout_terminates_user_session():
    session = requests.Session()
    try:
        # Step 1: Register a new user
        register_payload = {
            "name": "Test User",
            "email": "testuser_tc003@example.com",
            "password": "StrongPass!23",
            "password_confirmation": "StrongPass!23"
        }
        r = session.post(f"{BASE_URL}/register", json=register_payload, timeout=TIMEOUT)
        assert r.status_code in [200, 201], f"Register failed: {r.status_code}, {r.text}"

        # Step 2: Login with the new user credentials
        login_payload = {
            "email": register_payload["email"],
            "password": register_payload["password"]
        }
        r = session.post(f"{BASE_URL}/login", json=login_payload, timeout=TIMEOUT)
        assert r.status_code == 200, f"Login failed: {r.status_code}, {r.text}"

        # Step 3: POST /logout with active session
        r = session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        assert r.status_code == 200, f"Logout failed: {r.status_code}, {r.text}"

        # Step 4: Attempt to access a protected endpoint GET /buyer/orders
        r = session.get(f"{BASE_URL}/buyer/orders", timeout=TIMEOUT)
        assert r.status_code == 401, f"Expected 401 after logout, got {r.status_code}, {r.text}"

    finally:
        # Cleanup: try logging in again to delete user if API had delete user endpoint (not available)
        # Since no user deletion endpoint is specified, no resource cleanup possible.
        session.close()

test_post_logout_terminates_user_session()