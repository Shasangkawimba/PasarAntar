import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_post_buyer_orders_creates_new_order():
    session = requests.Session()
    try:
        # Step 1: Register a new buyer user
        register_payload = {
            "name": "Test Buyer",
            "email": "buyer_test@example.com",
            "password": "SecurePass123!",
            "password_confirmation": "SecurePass123!"
        }
        register_resp = session.post(f"{BASE_URL}/register", json=register_payload, timeout=TIMEOUT)
        assert register_resp.status_code in (200, 201), f"Unexpected register status: {register_resp.status_code}"

        # Step 2: Login with the new buyer credentials to authenticate session
        login_payload = {
            "email": register_payload["email"],
            "password": register_payload["password"]
        }
        login_resp = session.post(f"{BASE_URL}/login", json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"

        # Step 3: Create a new buyer order
        order_payload = {
            "delivery_address": "Jl. Contoh No.123, Jakarta",
            "items": [
                {"product_id": 1, "quantity": 2},
                {"product_id": 5, "quantity": 1}
            ],
            "notes": "Please prioritize fresh vegetables."
        }
        order_resp = session.post(f"{BASE_URL}/buyer/orders", json=order_payload, timeout=TIMEOUT)
        assert order_resp.status_code == 201, f"Order creation failed with status {order_resp.status_code}"

        order_data = order_resp.json()
        assert "status" in order_data, "Order response missing status field"
        assert order_data["status"] == "WAITING_FOR_JOKI", f"Unexpected order status: {order_data['status']}"

    finally:
        # Logout the buyer session
        session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)


test_post_buyer_orders_creates_new_order()
