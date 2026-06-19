# Pasar Antar - Project Overview

## Vision

Pasar Antar adalah platform titip belanja pasar tradisional yang menghubungkan pembeli dengan Joki Pasar lokal.

Tujuan utama aplikasi adalah membantu pengguna membeli kebutuhan pasar tanpa harus datang langsung ke pasar tradisional pada pagi hari.

## Problem Statement

Banyak masyarakat memiliki keterbatasan waktu untuk berbelanja ke pasar tradisional.

Di sisi lain, terdapat individu yang rutin pergi ke pasar dan dapat membantu membelikan kebutuhan pengguna.

Pasar Antar menjembatani kedua pihak melalui sistem pemesanan, pengelolaan pesanan, dan pelacakan status belanja.

## Target Users

### Buyer

Pengguna yang ingin membeli kebutuhan pasar.

### Joki

Mitra yang melakukan pembelian barang di pasar dan mengantarkannya ke pembeli.

### Admin

Pengelola sistem.

## Core Features

1. Buyer membuat pesanan.
2. Joki mengambil pesanan.
3. Joki melakukan belanja.
4. Joki mengunggah bukti belanja.
5. Sistem menghitung total belanja.
6. Sistem menghitung refund atau kurang bayar.
7. Joki mengantarkan pesanan.
8. Pesanan selesai.

## Non Goals

Fitur berikut tidak termasuk dalam versi awal:

* Double Entry Accounting
* Multi Wallet System
* Marketplace Multi Vendor
* AI Recommendation
* Dynamic Pricing
* PostGIS
* Microservices

## Technology Stack

Backend:

* Laravel 13

Frontend:

* React
* Inertia.js

Database:

* PostgreSQL

Queue:

* Redis

Realtime:

* Laravel Reverb

Deployment:

* Docker

## Success Criteria

* Buyer dapat membuat pesanan.
* Joki dapat mengambil pesanan.
* Status pesanan dapat diperbarui secara realtime.
* Sistem dapat menghitung refund dan kurang bayar.
* Sistem dapat melakukan agregasi checklist pesanan berdasarkan pasar.
