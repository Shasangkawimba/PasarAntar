import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_post_joki_orders_order_actual_amount_records_final_spend():
    session = requests.Session()
    try:
        # Register and login Joki user to get authenticated session
        register_payload = {
            "name": "Test Joki User",
            "email": "testjoki_actualamount@example.com",
            "password": "SecurePass123!",
            "password_confirmation": "SecurePass123!"
        }
        resp = session.post(f"{BASE_URL}/register", json=register_payload, timeout=TIMEOUT)
        assert resp.status_code in (200, 201), f"Failed to register: {resp.text}"

        login_payload = {
            "email": register_payload["email"],
            "password": register_payload["password"]
        }
        resp = session.post(f"{BASE_URL}/login", json=login_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Failed to login: {resp.text}"

        # Create a buyer user and order to be assigned and used for actual amount input
        buyer_session = requests.Session()
        buyer_register_payload = {
            "name": "Test Buyer User",
            "email": "testbuyer_actualamount@example.com",
            "password": "SecurePass123!",
            "password_confirmation": "SecurePass123!"
        }
        resp = buyer_session.post(f"{BASE_URL}/register", json=buyer_register_payload, timeout=TIMEOUT)
        assert resp.status_code in (200, 201), f"Buyer registration failed: {resp.text}"

        buyer_login_payload = {
            "email": buyer_register_payload["email"],
            "password": buyer_register_payload["password"]
        }
        resp = buyer_session.post(f"{BASE_URL}/login", json=buyer_login_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Buyer login failed: {resp.text}"

        # Create buyer order
        order_payload = {
            "items": [
                {"product_id": 1, "quantity": 2},
                {"product_id": 2, "quantity": 3}
            ],
            "delivery_address": "Jl. Contoh No.123",
            "notes": "Please be careful with perishables"
        }
        resp = buyer_session.post(f"{BASE_URL}/buyer/orders", json=order_payload, timeout=TIMEOUT)
        assert resp.status_code == 201, f"Order creation failed: {resp.text}"
        order_data = resp.json()
        order_id = order_data.get("id")
        assert order_id is not None, "Order id missing in creation response"

        # Joki gets available orders
        resp = session.get(f"{BASE_URL}/joki/orders/available", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Failed to get available joki orders: {resp.text}"
        available_orders = resp.json()
        # Check if our order is in available orders, else fail the test
        orders_ids = [order.get("id") for order in available_orders if order.get("id") is not None]
        assert order_id in orders_ids, "Created order not listed in available joki orders"

        # Joki accepts the order
        resp = session.post(f"{BASE_URL}/joki/orders/{order_id}/accept", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Failed to accept order: {resp.text}"

        # Now post actual amount
        actual_amount_payload = {
            "actual_amount": 150000  # assuming currency in local unit, example amount
        }
        resp = session.post(f"{BASE_URL}/joki/orders/{order_id}/actual-amount", json=actual_amount_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Posting actual amount failed: {resp.text}"
        result = resp.json()

        # Validate returned settlement calculation structure has keys for refund or pay additional
        assert ("refund_amount" in result or "additional_payment_amount" in result), \
            f"Settlement calculation keys missing: {result}"
        # Validate values are numbers and >= 0
        if "refund_amount" in result:
            assert isinstance(result["refund_amount"], (int, float)) and result["refund_amount"] >= 0, \
                f"Invalid refund_amount value: {result.get('refund_amount')}"
        if "additional_payment_amount" in result:
            assert isinstance(result["additional_payment_amount"], (int, float)) and result["additional_payment_amount"] >= 0, \
                f"Invalid additional_payment_amount value: {result.get('additional_payment_amount')}"

    finally:
        # Cleanup: attempt to delete order and logout both users
        # Assuming there are endpoints to delete orders and logout; if not available, ignore errors silently
        try:
            session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        except Exception:
            pass
        try:
            buyer_session.post(f"{BASE_URL}/logout", timeout=TIMEOUT)
        except Exception:
            pass

test_post_joki_orders_order_actual_amount_records_final_spend()