# Product Requirements Document

## User Roles

### Buyer

Hak akses:

* Registrasi
* Login
* Membuat pesanan
* Melihat status pesanan
* Melihat bukti belanja

### Joki

Hak akses:

* Login
* Mengambil pesanan
* Memperbarui status
* Mengunggah nota
* Menginput harga aktual

### Admin

Hak akses:

* Mengelola pengguna
* Mengelola pasar
* Monitoring pesanan
* Monitoring joki

---

## Order Flow

### 1. Create Order

Buyer memilih:

* Pasar
* Daftar barang
* Catatan

Status:

WAITING_FOR_JOKI

---

### 2. Joki Assignment

Joki mengambil pesanan.

Status:

ASSIGNED

---

### 3. Shopping

Joki mulai berbelanja.

Status:

SHOPPING

---

### 4. Upload Receipt

Joki mengunggah nota.

Sistem menghitung:

actual_amount

---

### 5. Settlement

Jika:

deposit > actual

maka:

refund_amount

Jika:

deposit < actual

maka:

additional_payment

---

### 6. Delivery

Status:

DELIVERING

---

### 7. Completed

Status:

COMPLETED

---

## Aggregation Rules

Sistem dapat mengelompokkan maksimal 5 pesanan pada pasar yang sama.

Hasil agregasi menghasilkan satu Master Checklist.

Master Checklist digunakan oleh Joki saat berbelanja.

Agregasi dijalankan melalui background job.

---

## Realtime Events

* Order Assigned
* Shopping Started
* Receipt Uploaded
* Delivering
* Completed
