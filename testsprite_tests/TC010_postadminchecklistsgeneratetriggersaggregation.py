import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_post_admin_checklists_generate_triggers_aggregation():
    session = requests.Session()

    # Admin credentials for authentication - adjust as needed
    admin_login_payload = {
        "email": "admin@example.com",
        "password": "AdminPass123!"
    }

    try:
        # Login as admin to obtain authenticated session
        login_response = session.post(
            f"{BASE_URL}/login",
            json=admin_login_payload,
            timeout=TIMEOUT
        )
        assert login_response.status_code == 200, f"Login failed with status {login_response.status_code}"
        
        # Trigger master checklist aggregation
        generate_response = session.post(
            f"{BASE_URL}/admin/checklists/generate",
            timeout=TIMEOUT
        )
        assert generate_response.status_code == 200, f"Aggregation trigger failed with status {generate_response.status_code}"

    finally:
        # Logout admin session
        logout_response = session.post(
            f"{BASE_URL}/logout",
            timeout=TIMEOUT
        )
        # Logout might fail if session expired, so no assert here.

test_post_admin_checklists_generate_triggers_aggregation()