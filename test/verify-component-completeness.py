import argparse
import json
import os
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
BASE_URL = os.environ.get('HF_BASE_URL', 'http://127.0.0.1:4173')


def expected_count() -> int:
    parser = argparse.ArgumentParser(description='验证组件目录中剩余占位预览数量')
    parser.add_argument('--expected', type=int, default=int(os.environ.get('HF_EXPECTED_PLACEHOLDERS', '0')))
    return parser.parse_args().expected


def main() -> int:
    expected = expected_count()
    result = {'status': 'failed', 'placeholderComponents': []}
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            try:
                page = browser.new_page(viewport={'width': 1440, 'height': 900})
                page.set_default_timeout(5_000)
                page.goto(f'{BASE_URL}/components/button', wait_until='networkidle', timeout=15_000)
                page.add_style_tag(content='*,*::before,*::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}')
                slugs = [item['id'] for item in page.request.get(f'{BASE_URL}/catalog.json').json()]
                assert len(slugs) >= 154 and len(set(slugs)) == len(slugs)
                for slug in slugs:
                    page.goto(f'{BASE_URL}/components/{slug}', wait_until='networkidle')
                    page.locator('.ws-doc-header h1').wait_for(state='visible')
                    if page.locator('.docs-catalog-preview').count():
                        result['placeholderComponents'].append(slug)
            finally:
                browser.close()
        result['componentCount'] = len(slugs)
        result['placeholderCount'] = len(result['placeholderComponents'])
        result['expectedPlaceholderCount'] = expected
        result['status'] = 'ok' if result['placeholderCount'] == expected else 'failed'
    except Exception as error:
        result.update(errorType=type(error).__name__, message=str(error))
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result['status'] == 'ok' else 1


if __name__ == '__main__':
    raise SystemExit(main())
