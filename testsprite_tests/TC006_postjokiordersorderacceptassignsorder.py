import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_post_joki_orders_order_accept_assigns_order():
    session = requests.Session()
    try:
        # Step 1: Register joki user
        register_payload = {
            "name": "Test Joki",
            "email": "testjoki_accept@example.com",
            "password": "Password123!",
            "password_confirmation": "Password123!",
            "role": "joki"
        }
        register_resp = session.post(f"{BASE_URL}/register", json=register_payload, timeout=TIMEOUT)
        assert register_resp.status_code in (200, 201), f"Register failed: {register_resp.text}"

        # Step 2: Login joki user
        login_payload = {
            "email": "testjoki_accept@example.com",
            "password": "Password123!"
        }
        login_resp = session.post(f"{BASE_URL}/login", json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"

        # Step 3: Register buyer user to create an order
        buyer_register_payload = {
            "name": "Test Buyer",
            "email": "testbuyer_accept@example.com",
            "password": "Password123!",
            "password_confirmation": "Password123!",
            "role": "buyer"
        }
        buyer_session = requests.Session()
        buyer_register_resp = buyer_session.post(f"{BASE_URL}/register", json=buyer_register_payload, timeout=TIMEOUT)
        assert buyer_register_resp.status_code in (200, 201), f"Buyer register failed: {buyer_register_resp.text}"

        buyer_login_payload = {
            "email": "testbuyer_accept@example.com",
            "password": "Password123!"
        }
        buyer_login_resp = buyer_session.post(f"{BASE_URL}/login", json=buyer_login_payload, timeout=TIMEOUT)
        assert buyer_login_resp.status_code == 200, f"Buyer login failed: {buyer_login_resp.text}"

        # Step 4: Create a new order as buyer with mandatory fields (assuming minimal order schema)
        order_payload = {
            "items": [
                {
                    "name": "Mango",
                    "quantity": 2,
                    "notes": "Ripe ones"
                }
            ],
            "delivery_address": "Jl. Merdeka No.10, Jakarta",
            "requested_time": "2026-06-22T10:00:00Z"
        }
        create_order_resp = buyer_session.post(f"{BASE_URL}/buyer/orders", json=order_payload, timeout=TIMEOUT)
        assert create_order_resp.status_code == 201, f"Create order failed: {create_order_resp.text}"
        order_data = create_order_resp.json()
        order_id = order_data.get("id")
        assert order_id is not None, "Created order ID not found"
        assert order_data.get("status") == "WAITING_FOR_JOKI", "Initial order status is not WAITING_FOR_JOKI"

        # Step 5: As joki, get available orders to confirm the order is listed
        available_orders_resp = session.get(f"{BASE_URL}/joki/orders/available", timeout=TIMEOUT)
        assert available_orders_resp.status_code == 200, f"Get available orders failed: {available_orders_resp.text}"
        available_orders = available_orders_resp.json()
        assert any(order.get("id") == order_id for order in available_orders), "Order not listed in available orders"

        # Step 6: Joki accepts the order
        accept_resp = session.post(f"{BASE_URL}/joki/orders/{order_id}/accept", timeout=TIMEOUT)
        assert accept_resp.status_code == 200, f"Accept order failed: {accept_resp.text}"
        accepted_order = accept_resp.json()
        assert accepted_order.get("id") == order_id, "Accepted order ID mismatch"
        assert accepted_order.get("status") == "ASSIGNED", "Order status not updated to ASSIGNED"

        # Step 7: Confirm the order is in assigned list for joki
        assigned_orders_resp = session.get(f"{BASE_URL}/joki/orders/assigned", timeout=TIMEOUT)
        assert assigned_orders_resp.status_code == 200, f"Get assigned orders failed: {assigned_orders_resp.text}"
        assigned_orders = assigned_orders_resp.json()
        assert any(order.get("id") == order_id for order in assigned_orders), "Order not listed in assigned orders"

    finally:
        # Cleanup: delete created order and users if API supports deletion or logout
        # Since deletion endpoint is not provided, attempt to logout
        try:
            session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        except:
            pass
        try:
            buyer_session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        except:
            pass

test_post_joki_orders_order_accept_assigns_order()