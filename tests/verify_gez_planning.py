import argparse
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:3000/')
parser.add_argument('--browser', default='chromium', choices=['chromium', 'webkit'])
parser.add_argument('--screenshots', type=Path)
args = parser.parse_args()

with sync_playwright() as p:
    browser = getattr(p, args.browser).launch(headless=True)
    for width, height in [(320, 700), (390, 844), (1366, 900)]:
        context = browser.new_context(viewport={'width': width, 'height': height}, has_touch=width < 600)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(args.url, wait_until='networkidle')
        expect(page.locator('.gez-hero-paw')).to_have_count(5)
        expect(page.get_by_role('button', name='Pause motion')).to_be_visible()
        page.get_by_role('button', name='Pause motion').click()
        assert page.locator('.gez-hero-paw').first.evaluate('(e) => getComputedStyle(e).animationPlayState') == 'paused'
        assert page.locator('.gez-live-ping').evaluate('(e) => getComputedStyle(e).animationPlayState') == 'paused'
        if width >= 600:
            page.locator('.gez-hero-stage').hover()
        assert page.locator('.gez-hero-model').evaluate('(e) => getComputedStyle(e).transform') == 'none'
        page.get_by_role('button', name='Resume motion').click()
        if args.screenshots:
            args.screenshots.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(args.screenshots / f'hero-{width}.png'))
        page.emulate_media(reduced_motion='reduce')
        assert page.locator('.gez-hero-paw').first.evaluate('(e) => getComputedStyle(e).animationName') == 'none'
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')

        page.locator('#top').get_by_role('button', name='Find a walker', exact=True).click()
        page.get_by_role('button', name='Continue with Apple').click()
        page.get_by_label('Name', exact=True).fill('Luna')
        page.get_by_role('button', name='Save Milo', exact=True).click()
        page.get_by_role('button', name='Walk', exact=True).first.click()
        expect(page.get_by_role('heading', name='When does Luna need a walk?')).to_be_visible()
        page.locator('[aria-label="Compare Murad R."]').click(force=True)
        expect(page.get_by_role('dialog')).to_have_count(0)
        page.locator('[aria-label="Compare Elvin S."]').click(force=True)
        expect(page.locator('[aria-label="Compare Nigar M."]')).to_be_disabled()
        page.get_by_role('button', name='Compare walkers', exact=True).click()
        compare = page.get_by_role('dialog')
        expect(compare.get_by_role('heading', name='Murad R.')).to_be_visible()
        expect(compare.get_by_role('heading', name='Elvin S.')).to_be_visible()
        assert compare.evaluate('(e) => e.scrollWidth <= e.clientWidth + 1')
        if args.screenshots:
            page.screenshot(path=str(args.screenshots / f'comparison-{width}.png'))
        page.get_by_role('button', name='Close comparison').click()
        page.get_by_role('button', name='60', exact=True).click()
        page.get_by_label('Time').fill('19:15')
        page.get_by_role('button', name='Compare walkers', exact=True).click()
        expect(page.get_by_role('dialog').get_by_text('17 AZN', exact=True)).to_be_visible()
        page.get_by_role('button', name='View Murad R.', exact=True).click()
        expect(page.get_by_role('dialog')).to_have_count(1)
        page.get_by_role('button', name='Choose this walker').click()
        expect(page.get_by_role('dialog').get_by_text('Luna', exact=True)).to_be_visible()
        expect(page.get_by_placeholder('Pickup instructions')).to_have_value('Call from the courtyard; I will bring Luna down.')
        page.keyboard.press('Escape')
        expect(page.get_by_role('heading', name='Walk summary')).to_have_count(0)
        page.get_by_role('button', name='Choose this walker').click()
        page.get_by_role('button', name='Request walk', exact=True).click()
        expect(page.get_by_role('heading', name='Murad has received your request.')).to_be_visible()
        page.get_by_role('button', name='Simulate next update').click()
        page.get_by_role('button', name='Ready at the door').click()
        page.get_by_text('Leash or harness ready', exact=True).click()
        page.get_by_role('button', name='Simulate next update').click()
        expect(page.get_by_role('checkbox', name='Leash or harness ready')).to_have_attribute('aria-checked', 'true')
        page.get_by_role('button', name='Simulate next update').click()
        expect(page.get_by_role('heading', name='Luna is out walking.')).to_be_visible()
        expect(page.locator('.gez-live-map').get_by_text('Murad R.', exact=True)).to_be_visible()
        expect(page.get_by_role('button', name='Message Murad')).to_be_visible()
        expect(page.get_by_text('19:16', exact=True)).to_be_visible()
        for _ in range(3):
            page.get_by_role('button', name='Next route update').click()
        page.get_by_role('button', name='Finish walk').click()
        expect(page.get_by_role('heading', name='Luna had a good one.')).to_be_visible()
        expect(page.locator('.gez-live-map').get_by_text('LIVE', exact=False)).to_have_count(0)
        page.get_by_role('button', name='Back').click()
        history_row = page.get_by_role('button').filter(has_text='Today · Murad R.').first
        expect(history_row).to_be_visible()
        history_row.click()
        expect(page.get_by_role('heading', name='Luna had a good one.')).to_be_visible()
        expect(page.locator('.gez-live-map').get_by_text('Murad R.', exact=True)).to_be_visible()
        page.get_by_role('button', name='Rate 5 stars').click()
        page.get_by_role('button', name='Book Murad again').click()
        expect(page.get_by_role('dialog').get_by_text('Murad R.', exact=True)).to_be_visible()
        page.get_by_role('button', name='Request walk', exact=True).click()
        page.get_by_role('button', name='Simulate next update').click()
        page.get_by_role('button', name='Ready at the door').click()
        expect(page.get_by_role('checkbox', name='Leash or harness ready')).to_have_attribute('aria-checked', 'false')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        assert not errors, errors
        context.close()
        print(f'PASS {args.browser}: motion, comparison, booked identity, checklist and rebook ({width}px)', flush=True)
    browser.close()
