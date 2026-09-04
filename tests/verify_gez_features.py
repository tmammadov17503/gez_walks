import argparse
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://localhost:3000/')
parser.add_argument('--browser', default='chromium', choices=['chromium', 'webkit'])
parser.add_argument('--screenshots', type=Path)
args = parser.parse_args()

with sync_playwright() as p:
    browser = getattr(p, args.browser).launch(headless=True)
    for width, height in [(390, 844), (1366, 900)]:
        context = browser.new_context(viewport={'width': width, 'height': height}, has_touch=width < 600, reduced_motion='reduce')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(args.url, wait_until='networkidle')
        page.locator('#how').scroll_into_view_if_needed()
        expect(page.locator('#how img')).to_have_js_property('naturalWidth', 1254)
        assert page.locator('.gez-paw-sway').evaluate('(element) => getComputedStyle(element).animationName') == 'none'
        if args.screenshots:
            args.screenshots.mkdir(parents=True, exist_ok=True)
            page.locator('#how').screenshot(path=str(args.screenshots / f'care-{width}.png'))
            page.locator('#trust').screenshot(path=str(args.screenshots / f'trust-{width}.png'))
        page.evaluate('window.scrollTo(0, 0)')
        if width < 1024:
            page.get_by_role('button', name='Open menu').click()
            page.get_by_role('button', name='Find a walker', exact=True).first.click()
        else:
            page.locator('header').get_by_role('button', name='Find a walker', exact=True).click()
        page.get_by_role('button', name='Continue with Apple').click()
        page.get_by_role('button', name='Save Milo', exact=True).click()
        page.get_by_role('button', name='Walk', exact=True).first.click()

        # Saving a favorite must not accidentally open the card behind it.
        page.get_by_role('button', name='Save Nigar M.', exact=True).click(timeout=5000)
        expect(page.get_by_role('button', name='Remove Nigar M.', exact=True)).to_have_attribute('aria-pressed', 'true')
        expect(page.get_by_role('heading', name='Nigar M.', level=2)).to_have_count(0)
        page.get_by_role('button', name='Favorites only', exact=True).click()
        expect(page.locator('article')).to_have_count(1)
        page.locator('article').get_by_role('button', name='View profile', exact=True).click()
        page.get_by_role('button', name='Arrange a free meet & greet').click()
        expect(page.get_by_label('Preferred date')).to_be_visible()
        page.get_by_role('button', name='Save demo request').click()
        expect(page.get_by_text('Meet & greet requested · demo', exact=True)).to_be_visible()
        expect(page.get_by_text('Saved on this device only. No message has been sent and the walker has not confirmed.', exact=True)).to_be_visible()
        close_box = page.get_by_role('button', name='Close walker profile').bounding_box()
        assert close_box and 0 <= close_box['y'] <= height - 44, 'Profile close button scrolled out of reach'
        if args.screenshots:
            page.screenshot(path=str(args.screenshots / f'meet-{width}.png'))
        page.get_by_role('button', name='Close walker profile').click()
        page.get_by_role('button', name='Activity', exact=True).first.click()
        expect(page.get_by_role('region', name='Your meet & greets')).to_be_visible()
        page.reload(wait_until='networkidle')
        expect(page.get_by_role('region', name='Favorite walkers').get_by_text('Nigar M.', exact=True)).to_be_visible()
        page.get_by_role('button', name='Activity', exact=True).first.click()
        page.get_by_role('region', name='Your meet & greets').get_by_role('button', name='View profile').click()
        page.get_by_role('button', name='Change time', exact=True).click()
        page.get_by_label('Time · Baku').select_option('18:30')
        page.get_by_role('button', name='Save demo request').click()
        expect(page.get_by_text('18:30 · Bakı', exact=True).last).to_be_visible()
        page.get_by_role('button', name='Close walker profile').click()
        page.get_by_role('region', name='Your meet & greets').get_by_role('button', name='Cancel request').click()
        expect(page.get_by_role('region', name='Your meet & greets')).to_have_count(0)
        page.get_by_role('button', name='Walk', exact=True).first.click()
        page.get_by_role('button', name='Remove Nigar M.', exact=True).click()
        page.get_by_role('button', name='Favorites only', exact=True).click()
        expect(page.locator('article')).to_have_count(0)
        page.get_by_role('button', name='Favorites only', exact=True).click()

        # Saved shortcuts must honor a subsequently changed dog profile.
        for size in ('small', 'large'):
            page.get_by_role('button', name='Milo', exact=True).first.click()
            page.get_by_role('button', name='Edit profile', exact=True).click()
            page.get_by_role('button', name=size, exact=True).click()
            page.get_by_role('button', name='Save changes', exact=True).click()
            if size == 'small':
                page.get_by_role('button', name='Walk', exact=True).first.click()
                page.get_by_role('button', name='Save Leyla A.', exact=True).click()
        page.get_by_role('region', name='Favorite walkers').get_by_role('button').filter(has_text='Leyla A.').click()
        expect(page.get_by_role('button', name='Not a size match', exact=True)).to_be_disabled(timeout=5000)
        page.get_by_role('button', name='Close walker profile').click()
        page.get_by_role('button', name='Walk', exact=True).first.click()
        page.evaluate("""() => {
          const original = Storage.prototype.setItem;
          Storage.prototype.setItem = function(key, value) {
            if (key === 'gez-connections') throw new DOMException('Storage blocked', 'QuotaExceededError');
            return original.call(this, key, value);
          };
        }""")
        page.get_by_role('button', name='Save Nigar M.', exact=True).click()
        expect(page.get_by_text('Storage is unavailable. Your changes will last for this visit only.', exact=True)).to_be_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'New features overflow the viewport'
        for locale, arrange, submit, confirmation in [
            ('az', 'Pulsuz tanışlıq görüşü planla', 'Demo sorğunu saxla', 'Tanışlıq sorğusu · demo'),
            ('ru', 'Запланировать бесплатное знакомство', 'Сохранить демо-запрос', 'Запрос на знакомство · демо'),
        ]:
            # Restore a saved language preference before testing translated layouts.
            page.evaluate('(locale) => localStorage.setItem("gez-locale", locale)', locale)
            page.reload(wait_until='networkidle')
            page.locator('nav[aria-label="App navigation"]:visible').get_by_role('button').nth(1).click()
            page.locator('article').first.get_by_role('button').last.click()
            page.get_by_role('button', name=arrange, exact=True).click()
            assert page.get_by_role('dialog').evaluate('(element) => element.scrollWidth <= element.clientWidth + 1'), f'{locale} meeting form overflows'
            page.get_by_role('button', name=submit, exact=True).click()
            expect(page.get_by_text(confirmation, exact=True)).to_be_visible()
            assert page.get_by_role('dialog').evaluate('(element) => element.scrollWidth <= element.clientWidth + 1'), f'{locale} confirmation overflows'
            page.get_by_role('button', name='Close walker profile').click()
            # Keep each language scenario independent.
            page.evaluate('localStorage.removeItem("gez-connections")')
        assert not errors, errors
        print(f'PASS {args.browser}: visuals, favorites, meet request, reload, reschedule, cancel ({width}px)', flush=True)
        context.close()
    browser.close()
