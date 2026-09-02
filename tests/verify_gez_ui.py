from playwright.sync_api import sync_playwright


def verify_desktop(page):
    page.set_viewport_size({"width": 1440, "height": 1000})
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.evaluate("localStorage.clear()")
    page.reload(wait_until="networkidle")

    page.get_by_role("heading", name="Good walks. Happy dogs.").wait_for()
    page.locator("header").get_by_role("button", name="az", exact=True).click()
    page.get_by_role("heading", name="Yaxşı gəzinti. Xoşbəxt it.").wait_for()
    page.locator("header").get_by_role("button", name="en", exact=True).click()

    page.locator("header").get_by_role("button", name="Find a walker", exact=True).click()
    page.get_by_role("button", name="Continue with phone").click()
    page.get_by_role("button", name="Send code").click()
    page.get_by_label("One-time code").fill("1234", force=True)
    page.get_by_role("button", name="Verify & continue").click()
    page.get_by_role("heading", name="Who are we walking?").wait_for()
    page.get_by_role("button", name="Save Milo").click()

    page.get_by_role("button", name="Walk", exact=True).first.click()
    page.get_by_role("heading", name="When does Milo need a walk?").wait_for()
    page.locator("article").first.click()
    page.get_by_role("button", name="Choose this walker").click()
    page.get_by_role("button", name="Request walk").click()
    page.get_by_text("Nigar has received your request.").wait_for()

    for _ in range(3):
        page.get_by_role("button", name="Simulate next update").click()
    page.get_by_role("heading", name="Milo is out walking.").wait_for()

    for _ in range(3):
        page.get_by_role("button", name="Next route update").click()
    page.get_by_role("button", name="Finish walk").click()
    page.get_by_role("heading", name="Milo had a good one.").wait_for()
    page.get_by_role("button", name="Rate 5 stars").click()


def verify_mobile(browser):
    context = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    page = context.new_page()
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.get_by_role("heading", name="Good walks. Happy dogs.").wait_for()
    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    assert overflow <= 1, f"mobile layout overflows by {overflow}px"
    page.get_by_role("button", name="Open menu").click()
    page.get_by_role("button", name="Find a walker", exact=True).first.click()
    page.get_by_role("button", name="Continue with phone").wait_for()
    context.close()


def verify_webmcp(browser):
    context = browser.new_context()
    context.add_init_script("""
      window.__gezTools = {};
      Object.defineProperty(document, 'modelContext', {
        value: {
          registerTool(tool) { window.__gezTools[tool.name] = tool; }
        },
        configurable: true
      });
    """)
    page = context.new_page()
    page.goto("http://localhost:3000", wait_until="networkidle")
    tool = page.evaluate("() => ({ name: window.__gezTools.start_gez_walk_demo.name, schema: window.__gezTools.start_gez_walk_demo.inputSchema, readOnly: window.__gezTools.start_gez_walk_demo.annotations.readOnlyHint })")
    assert tool["name"] == "start_gez_walk_demo"
    assert tool["schema"]["properties"]["locale"]["enum"] == ["az", "en", "ru"]
    assert tool["readOnly"] is False
    invalid = page.evaluate("async () => { try { await window.__gezTools.start_gez_walk_demo.execute({ locale: 'tr' }); return false; } catch { return true; } }")
    assert invalid is True
    result = page.evaluate("async () => await window.__gezTools.start_gez_walk_demo.execute({ locale: 'az' })")
    assert result == {"view": "walk-booking-demo", "locale": "az"}
    page.get_by_role("button", name="Telefonla davam et").wait_for()
    context.close()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    desktop_page = browser.new_page()
    verify_desktop(desktop_page)
    verify_mobile(browser)
    verify_webmcp(browser)
    browser.close()

print("GEZ desktop journey and mobile layout verified")
