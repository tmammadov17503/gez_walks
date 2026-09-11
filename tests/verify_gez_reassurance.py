import argparse
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:3000/')
parser.add_argument('--screenshots', type=Path)
args = parser.parse_args()

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for width, height in [(320, 700), (390, 844), (1366, 900)]:
        context = browser.new_context(viewport={'width': width, 'height': height})
        page = context.new_page()
        page.goto(args.url, wait_until='networkidle')

        journey = page.get_by_role('region', name='The walk from your side')
        expect(journey).to_be_visible()
        before = journey.get_by_role('button', name='Before')
        during = journey.get_by_role('button', name='During')
        after = journey.get_by_role('button', name='After')
        expect(before).to_have_attribute('aria-pressed', 'true')
        expect(journey.get_by_text('You know who has the leash.', exact=True)).to_be_visible()

        during.click()
        expect(during).to_have_attribute('aria-pressed', 'true')
        expect(journey.get_by_text('You can see Milo is okay.', exact=True)).to_be_visible()
        expect(journey.get_by_text('Water break', exact=True)).to_be_visible()

        after.click()
        expect(after).to_have_attribute('aria-pressed', 'true')
        expect(journey.get_by_text('You know exactly how it went.', exact=True)).to_be_visible()
        expect(journey.get_by_text('42 min', exact=True)).to_be_visible()
        if args.screenshots:
            args.screenshots.mkdir(parents=True, exist_ok=True)
            page.wait_for_timeout(650)
            journey.screenshot(path=str(args.screenshots / f'reassurance-after-{width}.png'))
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        context.close()
        print(f'PASS reassurance journey ({width}px)', flush=True)
    browser.close()
