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
        
        # -> Open the application's login page by navigating to the '/login' URL and load the login form so the Joki can sign in.
        await page.goto("http://localhost:8000/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Enter joki@example.com into the email field, enter 'password' into the password field, then click the 'Masuk Aplikasi' button to sign in.
        # nama@email.com email field
        elem = page.locator('[id="email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("joki@example.com")
        
        # -> Enter joki@example.com into the email field, enter 'password' into the password field, then click the 'Masuk Aplikasi' button to sign in.
        # •••••••• password field
        elem = page.locator('[id="password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("password")
        
        # -> Enter joki@example.com into the email field, enter 'password' into the password field, then click the 'Masuk Aplikasi' button to sign in.
        # Masuk Aplikasi button
        elem = page.get_by_role('button', name='Masuk Aplikasi', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Tugas Saya' (My Tasks) tab to view orders assigned to this Joki.
        # local_shipping Tugas Saya link
        elem = page.locator('xpath=/html/body/div/div/header/div/nav/a[2]')
        await elem.click(timeout=10000)
        
        # -> Open the order details by clicking the 'Detail' button for the order labeled 'PA-20260620-3XLBFQ' to view settlement and refund information.
        # Detail link
        elem = page.get_by_role('link', name='Detail', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify a refund amount is shown
        # Assert: A refund amount (Rp 10.005) is shown on the order details page.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/div/div[2]/div[2]/section/div[3]/div/div").nth(0)).to_contain_text("Rp 10.005", timeout=15000), "A refund amount (Rp 10.005) is shown on the order details page."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    