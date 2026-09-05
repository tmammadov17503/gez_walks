import argparse
from pathlib import Path

from playwright.sync_api import Page, sync_playwright


parser = argparse.ArgumentParser(description="Check GƏZ responsive user journeys.")
parser.add_argument("--url", default="http://localhost:3000")
parser.add_argument("--browser", choices=["chromium", "webkit", "firefox"], default="chromium")
parser.add_argument("--device", action="append")
parser.add_argument("--screenshots", type=Path)
args = parser.parse_args()


def capture(page: Page, label: str, full_page: bool = True):
    if args.screenshots:
        args.screenshots.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(args.screenshots / f"{label}.png"), full_page=full_page)


VIEWPORTS = [
    {"name": "small-phone", "width": 320, "height": 568, "touch": True},
    {"name": "modern-phone", "width": 390, "height": 844, "touch": True},
    {"name": "large-phone", "width": 430, "height": 932, "touch": True},
    {"name": "phone-landscape", "width": 844, "height": 390, "touch": True},
    {"name": "tablet-portrait", "width": 768, "height": 1024, "touch": True},
    {"name": "tablet-landscape", "width": 1024, "height": 768, "touch": True},
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "wide-desktop", "width": 1920, "height": 1080, "touch": False},
]


def assert_no_horizontal_overflow(page: Page, label: str):
    overflow = page.evaluate(
        "Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth"
    )
    assert overflow <= 1, f"{label} overflows horizontally by {overflow}px"
    clipped_text = page.locator("h1, h2, button, p").evaluate_all(
        """(elements) => elements.filter(element => {
          if (!element.getClientRects().length) return false;
          const range = document.createRange();
          range.selectNodeContents(element);
          return [...range.getClientRects()].some(rect => rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1));
        }).slice(0, 5).map(element => element.textContent.trim())"""
    )
    assert not clipped_text, f"{label} has text clipped at a screen edge: {clipped_text}"


def verify_mobile_languages(page: Page, label: str):
    page.get_by_role("button", name="Open menu").click()
    for language in ("az", "ru", "en"):
        page.get_by_role("button", name=language, exact=True).last.click()
        assert_no_horizontal_overflow(page, f"{label} {language} homepage")
    page.get_by_role("button", name="Close menu").click()


def verify_app_languages(page: Page, label: str):
    for language in ("az", "ru", "en"):
        page.locator("header").get_by_role("button", name=language, exact=True).click()
        assert_no_horizontal_overflow(page, f"{label} {language} app")


def assert_mobile_form_fonts(page: Page, label: str):
    too_small = page.locator("input, select, textarea").evaluate_all(
        """
        (controls) => controls
          .filter((control) => {
            const rect = control.getBoundingClientRect();
            const style = getComputedStyle(control);
            return rect.width > 1 && rect.height > 1 && style.visibility !== 'hidden';
          })
          .filter((control) => parseFloat(getComputedStyle(control).fontSize) < 16)
          .map((control) => ({
            tag: control.tagName,
            label: control.getAttribute('aria-label') || control.getAttribute('placeholder') || '',
            fontSize: getComputedStyle(control).fontSize,
          }))
        """
    )
    coarse_pointer = page.evaluate("matchMedia('(pointer: coarse)').matches")
    assert not too_small, f"{label} has form controls that can trigger mobile zoom: {too_small}; coarse={coarse_pointer}"


def assert_touch_targets(page: Page, selector: str, label: str):
    undersized = page.locator(selector).evaluate_all(
        """
        (controls) => controls
          .filter((control) => {
            const rect = control.getBoundingClientRect();
            const style = getComputedStyle(control);
            return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
          })
          .filter((control) => {
            const rect = control.getBoundingClientRect();
            return rect.width < 44 || rect.height < 44;
          })
          .map((control) => {
            const rect = control.getBoundingClientRect();
            return {
              label: control.getAttribute('aria-label') || control.textContent.trim(),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            };
          })
        """
    )
    assert not undersized, f"{label} has undersized touch targets: {undersized}"


def assert_booking_sheet_fits(page: Page, label: str):
    sheet = page.get_by_role("dialog", name="Walk summary")
    box = sheet.bounding_box()
    assert box, f"{label} booking sheet is not visible"
    viewport_height = page.evaluate("window.innerHeight")
    assert box["y"] >= -1, f"{label} booking sheet starts above the viewport"
    assert box["y"] + box["height"] <= viewport_height + 1, f"{label} booking sheet extends below the viewport"
    overflow_y = sheet.evaluate("(element) => getComputedStyle(element).overflowY")
    assert overflow_y in ("auto", "scroll"), f"{label} booking sheet cannot scroll internally"


def open_sign_in(page: Page, width: int):
    if width < 1024:
        page.get_by_role("button", name="Open menu").click()
        page.get_by_role("button", name="Find a walker", exact=True).first.click()
    else:
        page.locator("header").get_by_role("button", name="Find a walker", exact=True).click()
    page.get_by_role("button", name="Continue with Apple", exact=True).wait_for()


def open_dog_details(page: Page):
    page.get_by_role("button", name="Continue with Apple", exact=True).click()
    page.get_by_role("heading", name="Who are we walking?").wait_for()


def open_walk_tab(page: Page):
    page.get_by_role("button", name="Walk", exact=True).first.click()
    page.get_by_role("heading", name="When does Milo need a walk?").wait_for()


def verify_full_mobile_journey(page: Page, label: str):
    page.get_by_role("button", name="View profile", exact=True).first.click()
    page.get_by_role("heading", name="Nigar M.", level=2).wait_for()
    assert_no_horizontal_overflow(page, f"{label} walker profile")
    page.get_by_role("button", name="Choose this walker").click()
    page.get_by_role("heading", name="Walk summary").wait_for()
    assert_no_horizontal_overflow(page, f"{label} booking sheet")
    assert_booking_sheet_fits(page, label)
    assert_touch_targets(page, "dialog button", f"{label} booking sheet")
    capture(page, f"{label}-booking", full_page=False)
    page.get_by_role("button", name="Request walk").click()
    page.get_by_text("Nigar has received your request.").wait_for()
    assert_no_horizontal_overflow(page, f"{label} booking status")

    for _ in range(3):
        page.get_by_role("button", name="Simulate next update").click()
    page.get_by_role("heading", name="Milo is out walking.").wait_for()
    assert_no_horizontal_overflow(page, f"{label} live walk")
    capture(page, f"{label}-live")

    for _ in range(3):
        page.get_by_role("button", name="Next route update").click()
    page.get_by_role("button", name="Finish walk").click()
    page.get_by_role("heading", name="Milo had a good one.").wait_for()
    assert_no_horizontal_overflow(page, f"{label} walk report")
    assert_touch_targets(page, "button[aria-label^='Rate']", f"{label} rating")


def verify_viewport(browser, viewport):
    context = browser.new_context(
        viewport={"width": viewport["width"], "height": viewport["height"]},
        device_scale_factor=1,
        has_touch=viewport["touch"],
        is_mobile=viewport["touch"] and viewport["width"] < 600,
        reduced_motion="reduce",
    )
    page = context.new_page()
    page.goto(args.url, wait_until="networkidle")
    page.evaluate("localStorage.clear()")
    page.reload(wait_until="networkidle")

    label = viewport["name"]
    # Emulate device safe areas independently of the desktop host's zero insets.
    if label == "modern-phone":
        page.add_style_tag(content=":root { --gez-safe-top: 47px; --gez-safe-bottom: 34px; }")
    elif label == "phone-landscape":
        page.add_style_tag(content=":root { --gez-safe-left: 44px; --gez-safe-right: 44px; --gez-safe-bottom: 21px; }")
    page.get_by_role("heading", name="Good walks. Happy dogs.").wait_for()
    assert_no_horizontal_overflow(page, f"{label} homepage")
    capture(page, f"{label}-homepage")
    if viewport["width"] < 600:
        verify_mobile_languages(page, label)

    open_sign_in(page, viewport["width"])
    assert_no_horizontal_overflow(page, f"{label} sign in")
    if viewport["touch"]:
        assert_touch_targets(page, "main button", f"{label} sign in")

    page.get_by_role("button", name="Continue with phone", exact=True).click()
    assert_mobile_form_fonts(page, f"{label} phone sign in")
    if label == "small-phone":
        page.get_by_role("button", name="Send code", exact=True).click()
        code_input = page.get_by_label("One-time code")
        code_box = code_input.bounding_box()
        assert code_box and code_box["width"] >= 200 and code_box["height"] >= 44, "OTP has no usable touch-entry area"
        code_input.click(timeout=5000)
        assert code_input.evaluate("(element) => document.activeElement === element"), "OTP cannot receive touch focus"
        code_input.fill("1234")
        page.get_by_role("button", name="Verify & continue", exact=True).click()
        page.get_by_role("heading", name="Who are we walking?").wait_for()
    else:
        page.get_by_role("button", name="Back", exact=True).click()
        open_dog_details(page)
    assert_no_horizontal_overflow(page, f"{label} dog details")
    if viewport["touch"]:
        assert_mobile_form_fonts(page, f"{label} dog details")
    if label == "modern-phone":
        assert page.locator("main").evaluate("element => parseFloat(getComputedStyle(element).paddingTop)") >= 47, "Dog details overlap the display notch"
    capture(page, f"{label}-dog-details")
    page.get_by_role("button", name="Save Milo", exact=True).click()
    page.get_by_text("Milo is home and all good.").wait_for()
    assert_no_horizontal_overflow(page, f"{label} app home")
    if viewport["width"] >= 640:
        verify_app_languages(page, f"{label} home")

    if viewport["width"] < 1024:
        assert_touch_targets(page, "nav[aria-label='App navigation'] button", f"{label} bottom navigation")
        if label == "modern-phone":
            nav_box = page.get_by_role("navigation", name="App navigation").bounding_box()
            assert nav_box and nav_box["y"] + nav_box["height"] <= viewport["height"] - 34, "Bottom navigation overlaps the home indicator"

    open_walk_tab(page)
    assert_no_horizontal_overflow(page, f"{label} walker discovery")
    if viewport["width"] >= 640:
        verify_app_languages(page, f"{label} discovery")
    if viewport["touch"]:
        assert_mobile_form_fonts(page, f"{label} walker discovery")
    capture(page, f"{label}-discovery")

    if label in ("small-phone", "phone-landscape"):
        verify_full_mobile_journey(page, label)

    context.close()
    print(f"PASS {args.browser}: {label} ({viewport['width']}x{viewport['height']})", flush=True)


with sync_playwright() as playwright:
    browser = getattr(playwright, args.browser).launch(headless=True)
    for viewport in VIEWPORTS:
        if not args.device or viewport["name"] in args.device:
            verify_viewport(browser, viewport)
    browser.close()

print("GEZ responsive journey verified across phones, tablets, laptops, and wide screens")
