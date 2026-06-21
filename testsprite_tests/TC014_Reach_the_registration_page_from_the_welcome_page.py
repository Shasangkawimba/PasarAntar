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
        
        # -> Wait for the landing page to finish loading; if no content appears, navigate to the 'Registration' page (direct URL /register) to verify the registration form is displayed.
        await page.goto("http://localhost:8000/register")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # --> Assertions to verify final state
        
        # --> Verify the registration page is displayed
        # Assert: The registration submit button 'Daftar Akun Baru' is visible.
        await expect(page.locator("xpath=/html/body/div/div/div/div[2]/form/div[2]/button").nth(0)).to_have_text("Daftar Akun Baru", timeout=15000), "The registration submit button 'Daftar Akun Baru' is visible."
        # Assert: The role select contains the option 'Pembeli (Buyer)', confirming the registration form.
        await expect(page.locator("xpath=/html/body/div/div/div/div[2]/form/div[1]/div[3]/select").nth(0)).to_contain_text("Pembeli (Buyer)", timeout=15000), "The role select contains the option 'Pembeli (Buyer)', confirming the registration form."
        # Assert: The 'Masuk Aplikasi' link is present on the registration page.
        await expect(page.locator("xpath=/html/body/div/div/div/div[2]/form/div[2]/div/a").nth(0)).to_have_text("Masuk Aplikasi", timeout=15000), "The 'Masuk Aplikasi' link is present on the registration page."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    