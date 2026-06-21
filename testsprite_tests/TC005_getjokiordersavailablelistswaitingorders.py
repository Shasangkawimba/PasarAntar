import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_get_joki_orders_available_lists_waiting_orders():
    session = requests.Session()
    try:
        # Authenticate as joki user (assume existing credentials for test)
        login_payload = {
            "email": "joki_user@example.com",
            "password": "joki_password"
        }
        login_resp = session.post(f"{BASE_URL}/login", json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"

        # Request available orders for joki
        resp = session.get(f"{BASE_URL}/joki/orders/available", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Failed to get available orders: {resp.text}"
        orders = resp.json()
        assert isinstance(orders, list), f"Orders response is not a list: {orders}"

        # Verify all orders in response have status WAITING_FOR_JOKI
        for order in orders:
            assert "status" in order, f"Order missing status field: {order}"
            assert order["status"] == "WAITING_FOR_JOKI", f"Order status is not WAITING_FOR_JOKI: {order}"

    finally:
        # Logout
        logout_resp = session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        # Logout might fail if session expired, so no assertion here

test_get_joki_orders_available_lists_waiting_orders()
