from playwright.sync_api import sync_playwright
import os

output_dir = os.path.dirname(os.path.abspath(__file__))

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    )
    page = browser.new_page(viewport={"width": 1200, "height": 900})

    page.goto('http://localhost:8080/print-friendly.html')
    page.wait_for_load_state('networkidle')

    # Should default to naruto theme
    page.wait_for_timeout(1000)

    # Click the first example button
    page.click('.examples button:first-child')
    page.wait_for_timeout(8000)

    # Screenshot the sheet
    sheet = page.locator('#sheet')
    sheet.screenshot(path=os.path.join(output_dir, 'screenshot_naruto.png'))
    print("Naruto theme screenshot saved")

    browser.close()
