import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:8000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Masuk' (Login) button in the site header to open the login page.
        # Masuk link
        elem = page.get_by_role('link', name='Masuk', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'Alamat Email' field with buyer@example.com, fill the 'Kata Sandi' field with password, then click the 'Masuk Aplikasi' button to sign in.
        # nama@email.com email field
        elem = page.locator('[id="email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("buyer@example.com")
        
        # -> Fill the 'Alamat Email' field with buyer@example.com, fill the 'Kata Sandi' field with password, then click the 'Masuk Aplikasi' button to sign in.
        # •••••••• password field
        elem = page.locator('[id="password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("password")
        
        # -> Fill the 'Alamat Email' field with buyer@example.com, fill the 'Kata Sandi' field with password, then click the 'Masuk Aplikasi' button to sign in.
        # Masuk Aplikasi button
        elem = page.get_by_role('button', name='Masuk Aplikasi', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Pilih & Mulai Belanja' (Choose & Start Shopping) button for the 'Pasar Gede' market to open its shopping / order creation page.
        # shopping_basket Pilih & Mulai Belanja link
        elem = page.get_by_text('Pasar Gede', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='shopping_basket Pilih & Mulai Belanja', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the first item's name ('Nama barang') with 'Bawang Merah', fill its notes with 'yang segar', increase its quantity to 2, click 'Tambah Barang Belanjaan' to add a second item row, and set the estimated amount to 150000.
        # Nama barang (cth: Bawang Merah, Ayam Fillet) text field
        elem = page.get_by_placeholder('Nama barang (cth: Bawang Merah, Ayam Fillet)', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Bawang Merah")
        
        # -> Fill the first item's name ('Nama barang') with 'Bawang Merah', fill its notes with 'yang segar', increase its quantity to 2, click 'Tambah Barang Belanjaan' to add a second item row, and set the estimated amount to 150000.
        # Catatan opsional (cth: yang segar, ukuran besar) text field
        elem = page.get_by_placeholder('Catatan opsional (cth: yang segar, ukuran besar)', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("yang segar")
        
        # -> Fill the first item's name ('Nama barang') with 'Bawang Merah', fill its notes with 'yang segar', increase its quantity to 2, click 'Tambah Barang Belanjaan' to add a second item row, and set the estimated amount to 150000.
        # add button
        elem = page.get_by_role('button', name='add', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the first item's name ('Nama barang') with 'Bawang Merah', fill its notes with 'yang segar', increase its quantity to 2, click 'Tambah Barang Belanjaan' to add a second item row, and set the estimated amount to 150000.
        # add_circle Tambah Barang Belanjaan button
        elem = page.get_by_role('button', name='add_circle Tambah Barang Belanjaan', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the first item's name ('Nama barang') with 'Bawang Merah', fill its notes with 'yang segar', increase its quantity to 2, click 'Tambah Barang Belanjaan' to add a second item row, and set the estimated amount to 150000.
        # 150000 number field
        elem = page.locator('[id="estimated_amount"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("150000")
        
        # -> Fill the second item's fields (name, notes, quantity) and then click the 'Konfirmasi Pesanan' button to submit the order.
        # Nama barang (cth: Bawang Merah, Ayam Fillet) text field
        elem = page.locator('xpath=/html/body/div/div/main/div/form/div/div/section[2]/div[2]/div[2]/div/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Bawang Putih")
        
        # -> Fill the second item's fields (name, notes, quantity) and then click the 'Konfirmasi Pesanan' button to submit the order.
        # Catatan opsional (cth: yang segar, ukuran besar) text field
        elem = page.locator('xpath=/html/body/div/div/main/div/form/div/div/section[2]/div[2]/div[2]/div/input[2]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("yang putih")
        
        # -> Fill the second item's fields (name, notes, quantity) and then click the 'Konfirmasi Pesanan' button to submit the order.
        # text field
        elem = page.locator('xpath=/html/body/div/div/main/div/form/div/div/section[2]/div[2]/div[2]/div[2]/div/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("3")
        
        # -> Fill the second item's fields (name, notes, quantity) and then click the 'Konfirmasi Pesanan' button to submit the order.
        # Konfirmasi Pesanan button
        elem = page.get_by_role('button', name='Konfirmasi Pesanan', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the created order detail page by clicking the order card labeled 'PA-20260621-QWLQF2' in the 'Pesanan Saya' list to verify the order details are displayed.
        # receipt_long PA-20260621-QWLQF2 Pasar Gede... link
        elem = page.locator('xpath=/html/body/div/div/main/div/div[3]/div[2]/div/a')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the created order detail page is displayed
        await page.locator("xpath=/html/body/div/div/main/div/div[1]/div[1]/div[1]/a").nth(0).scroll_into_view_if_needed()
        # Assert: The order detail page shows a back link to the orders list.
        await expect(page.locator("xpath=/html/body/div/div/main/div/div[1]/div[1]/div[1]/a").nth(0)).to_be_visible(timeout=15000), "The order detail page shows a back link to the orders list."
        await page.locator("xpath=/html/body/div/div/main/div/div[2]/div[1]/section[2]/div/div[2]/div[2]").nth(0).scroll_into_view_if_needed()
        # Assert: The order detail page shows the second item's quantity badge (3x).
        await expect(page.locator("xpath=/html/body/div/div/main/div/div[2]/div[1]/section[2]/div/div[2]/div[2]").nth(0)).to_be_visible(timeout=15000), "The order detail page shows the second item's quantity badge (3x)."
        
        # --> Verify the new order is shown as created
        # Assert: The URL contains /orders/2, confirming the order detail page is open.
        await expect(page).to_have_url(re.compile("/orders/2"), timeout=15000), "The URL contains /orders/2, confirming the order detail page is open."
        # Assert: The back link 'Kembali ke Daftar Pesanan' is visible, indicating the order detail view is shown.
        await expect(page.locator("xpath=/html/body/div/div/main/div/div[1]/div[1]/div[1]/a").nth(0)).to_contain_text("Kembali ke Daftar Pesanan", timeout=15000), "The back link 'Kembali ke Daftar Pesanan' is visible, indicating the order detail view is shown."
        # Assert: The first item shows quantity '2', confirming the added item appears in the order.
        await expect(page.locator("xpath=/html/body/div/div/main/div/div[2]/div[1]/section[2]/div/div[1]/div[2]").nth(0)).to_contain_text("2", timeout=15000), "The first item shows quantity '2', confirming the added item appears in the order."
        # Assert: The second item shows quantity '3', confirming the added item appears in the order.
        await expect(page.locator("xpath=/html/body/div/div/main/div/div[2]/div[1]/section[2]/div/div[2]/div[2]").nth(0)).to_contain_text("3", timeout=15000), "The second item shows quantity '3', confirming the added item appears in the order."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    