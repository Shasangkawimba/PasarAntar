import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_postjokiordersorderstatusupdatesorderstate():
    session = requests.Session()

    # Step 1: Register a new buyer user
    register_payload = {
        "name": "Test Buyer",
        "email": "test_buyer_status_update@example.com",
        "password": "TestPass123!",
        "password_confirmation": "TestPass123!"
    }
    try:
        r = session.post(f"{BASE_URL}/register", json=register_payload, timeout=TIMEOUT)
        assert r.status_code in (200, 201), f"Registration failed: {r.status_code} {r.text}"

        # Step 2: Login as buyer
        login_payload = {
            "email": register_payload["email"],
            "password": register_payload["password"]
        }
        r = session.post(f"{BASE_URL}/login", json=login_payload, timeout=TIMEOUT)
        assert r.status_code == 200, f"Buyer login failed: {r.status_code} {r.text}"

        # Step 3: Create a new buyer order
        order_payload = {
            "items": [
                {"product_id": 1, "quantity": 1}
            ],
            "delivery_address": "123 Test Street",
            "notes": "Please handle with care"
        }
        r = session.post(f"{BASE_URL}/buyer/orders", json=order_payload, timeout=TIMEOUT)
        assert r.status_code == 201, f"Order creation failed: {r.status_code} {r.text}"
        order_data = r.json()
        order_id = order_data.get("id")
        assert order_id is not None, "Created order ID missing"

    except Exception as e:
        session.close()
        raise e

    try:
        # Step 4: Register a new joki user
        register_joki_payload = {
            "name": "Test Joki",
            "email": "test_joki_status_update@example.com",
            "password": "TestPass123!",
            "password_confirmation": "TestPass123!"
        }
        r = requests.post(f"{BASE_URL}/register", json=register_joki_payload, timeout=TIMEOUT)
        assert r.status_code in (200, 201), f"Joki registration failed: {r.status_code} {r.text}"

        # Step 5: Login as joki
        r = requests.post(f"{BASE_URL}/login", json={
            "email": register_joki_payload["email"],
            "password": register_joki_payload["password"]
        }, timeout=TIMEOUT)
        assert r.status_code == 200, f"Joki login failed: {r.status_code} {r.text}"
        joki_session = requests.Session()
        joki_session.cookies.update(r.cookies)

        # Step 6: Joki accept the order
        r = joki_session.post(f"{BASE_URL}/joki/orders/{order_id}/accept", timeout=TIMEOUT)
        assert r.status_code == 200, f"Joki accept order failed: {r.status_code} {r.text}"

        # Step 7: Update order status to DELIVERING
        status_payload = {"status": "DELIVERING"}
        r = joki_session.post(f"{BASE_URL}/joki/orders/{order_id}/status", json=status_payload, timeout=TIMEOUT)
        assert r.status_code == 200, f"Updating status to DELIVERING failed: {r.status_code} {r.text}"
        resp_json = r.json()
        assert resp_json.get("status") == "DELIVERING", "Order status not updated to DELIVERING"

        # Step 8: Update order status to COMPLETED
        status_payload = {"status": "COMPLETED"}
        r = joki_session.post(f"{BASE_URL}/joki/orders/{order_id}/status", json=status_payload, timeout=TIMEOUT)
        assert r.status_code == 200, f"Updating status to COMPLETED failed: {r.status_code} {r.text}"
        resp_json = r.json()
        assert resp_json.get("status") == "COMPLETED", "Order status not updated to COMPLETED"

    finally:
        # Cleanup: Delete order by buyer (assuming a DELETE endpoint exists)
        # If no delete API exists, this part would be skipped or adjusted.
        # First logout from joki and buyer sessions
        try:
            joki_session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        except:
            pass
        try:
            session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        except:
            pass

        # If there is a delete order endpoint for cleanup (not specified, so skip)

        joki_session.close()
        session.close()

test_postjokiordersorderstatusupdatesorderstate()