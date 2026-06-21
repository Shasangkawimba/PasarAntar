import requests
import io

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_post_joki_orders_order_receipt_uploads_receipt():
    session = requests.Session()

    # Step 1: Register and login to get authenticated session (as joki)
    register_payload = {
        "name": "Test Joki User",
        "email": "testjokiuser_tc007@example.com",
        "password": "Password123!",
        "password_confirmation": "Password123!"
    }
    # Register user
    r = session.post(f"{BASE_URL}/register", json=register_payload, timeout=TIMEOUT)
    assert r.status_code in (200, 201), f"Registration failed: {r.status_code} - {r.text}"

    login_payload = {
        "email": register_payload["email"],
        "password": register_payload["password"]
    }
    r = session.post(f"{BASE_URL}/login", json=login_payload, timeout=TIMEOUT)
    assert r.status_code == 200, f"Login failed: {r.status_code} - {r.text}"

    try:
        # Step 2: Create a buyer order (simulate as buyer by logging in as buyer)
        # For this test, create another session for buyer to create order
        buyer_session = requests.Session()
        buyer_register_payload = {
            "name": "Test Buyer User",
            "email": "testbuyeruser_tc007@example.com",
            "password": "Password123!",
            "password_confirmation": "Password123!"
        }
        r = buyer_session.post(f"{BASE_URL}/register", json=buyer_register_payload, timeout=TIMEOUT)
        assert r.status_code in (200, 201), f"Buyer registration failed: {r.status_code} - {r.text}"
        buyer_login_payload = {
            "email": buyer_register_payload["email"],
            "password": buyer_register_payload["password"]
        }
        r = buyer_session.post(f"{BASE_URL}/login", json=buyer_login_payload, timeout=TIMEOUT)
        assert r.status_code == 200, f"Buyer login failed: {r.status_code} - {r.text}"

        order_payload = {
            "items": [
                {"name": "Apples", "quantity": 5, "price": 10000},
                {"name": "Bananas", "quantity": 3, "price": 5000}
            ],
            "delivery_address": "Jl. Merdeka 123, Jakarta",
            "notes": "Please select fresh fruit"
        }
        r = buyer_session.post(f"{BASE_URL}/buyer/orders", json=order_payload, timeout=TIMEOUT)
        assert r.status_code == 201, f"Order creation failed: {r.status_code} - {r.text}"
        order_data = r.json()
        order_id = order_data.get("id")
        assert order_id is not None, "Order ID not found in create order response"

        # Step 3: Joki fetches available orders
        r = session.get(f"{BASE_URL}/joki/orders/available", timeout=TIMEOUT)
        assert r.status_code == 200, f"Fetching available orders failed: {r.status_code} - {r.text}"
        available_orders = r.json()
        # Confirm our order is available
        order_ids = [o.get("id") for o in available_orders]
        assert order_id in order_ids, "Created order not in available orders list"

        # Step 4: Joki accepts the order
        r = session.post(f"{BASE_URL}/joki/orders/{order_id}/accept", timeout=TIMEOUT)
        assert r.status_code == 200, f"Order accept failed: {r.status_code} - {r.text}"

        # Step 5: Upload receipt image for the assigned order
        # The API expects an image file upload
        # Prepare a dummy image file in memory
        receipt_content = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00"
        receipt_file = io.BytesIO(receipt_content)
        receipt_file.name = "receipt.png"
        files = {"receipt": ("receipt.png", receipt_file, "image/png")}
        r = session.post(f"{BASE_URL}/joki/orders/{order_id}/receipt", files=files, timeout=TIMEOUT)
        assert r.status_code == 200, f"Receipt upload failed: {r.status_code} - {r.text}"
        resp_json = r.json()
        # Assuming the response confirms successful upload with a message or status field
        assert ("success" in resp_json.get("message", "").lower()) or (resp_json.get("status") == "success"), "Receipt upload confirmation missing or invalid"

    finally:
        # Cleanup: Attempt to delete created order and users if such API exists
        # Since no delete endpoints provided, attempt to logout sessions
        session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        buyer_session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)

test_post_joki_orders_order_receipt_uploads_receipt()