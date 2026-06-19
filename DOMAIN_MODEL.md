# Domain Model

## User

Representasi seluruh pengguna sistem.

Role:

* buyer
* joki
* admin

---

## Market

Representasi pasar tradisional.

Attributes:

* name
* address
* active_status

---

## Order

Pesanan buyer.

Attributes:

* buyer_id
* market_id
* assigned_joki_id
* order_number
* status
* estimated_amount
* actual_amount
* refund_amount
* additional_payment

---

## Order Item

Item yang dipesan.

Attributes:

* order_id
* product_name
* quantity
* notes

---

## Master Checklist

Checklist hasil agregasi beberapa order.

Attributes:

* market_id
* assigned_joki_id
* status

---

## Master Checklist Item

Daftar item hasil agregasi.

Attributes:

* checklist_id
* item_name
* total_quantity

---

## Receipt

Bukti belanja.

Attributes:

* order_id
* image_url
* uploaded_at

---

## Activity Log

Audit trail sederhana.

Attributes:

* user_id
* action
* metadata
