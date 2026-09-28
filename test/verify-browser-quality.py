import json
import os
import sys
from pathlib import Path
from playwright.sync_api import Page, sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

BASE_URL = os.environ.get('HF_BASE_URL', 'http://127.0.0.1:4173')
STATIC_ROUTES = ['/', '/products', '/templates/dashboard', '/templates/onboarding', '/templates/insights']


def assert_accessible_basics(page: Page, route: str) -> None:
    issues = page.evaluate(r"""() => {
      const visible = (element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
      const text = (element) => (element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent || '').trim();
      const issues = [];
      if (document.documentElement.lang !== 'zh-CN') issues.push('html lang 不是 zh-CN');
      document.querySelectorAll('button, a[href]').forEach((element) => {
        if (visible(element) && !text(element) && !element.getAttribute('aria-labelledby')) {
          const identity = element.id ? `#${element.id}` : element.className ? `.${String(element.className).trim().replace(/\s+/g, '.')}` : '';
          issues.push(`${element.tagName}${identity} 缺少可访问名称`);
        }
      });
      document.querySelectorAll('input, select, textarea').forEach((element) => {
        if (element.getAttribute('aria-hidden') === 'true') return;
        const id = element.id;
        const labelled = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.closest('label') || (id && document.querySelector(`label[for="${CSS.escape(id)}"]`));
        if (visible(element) && !labelled) issues.push(`${element.tagName} 缺少标签`);
      });
      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
      if (duplicates.length) issues.push(`重复 id: ${duplicates.join(',')}`);
      return issues;
    }""")
    if issues:
        raise AssertionError(f'{route} 基础无障碍检查失败：{"；".join(issues)}')


def open_route(page: Page, route: str, errors: list[str]) -> None:
    previous_error_count = len(errors)
    response = page.goto(f'{BASE_URL}{route}', wait_until='networkidle')
    if response is None or response.status != 200:
        raise AssertionError(f'{route} HTTP 状态异常：{response.status if response else "无响应"}')
    page.locator('#root').wait_for(state='visible')
    if not page.locator('#root').inner_text().strip():
        raise AssertionError(f'{route} 根节点没有渲染内容')
    assert_accessible_basics(page, route)
    if len(errors) > previous_error_count:
        raise AssertionError(f'{route} 浏览器错误：{errors[previous_error_count:]}')


def verify_interactions(page: Page) -> list[str]:
    checks = []
    page.goto(f'{BASE_URL}/components/input', wait_until='networkidle')
    field = page.get_by_label('工作区名称').first
    field.fill('质量基线工作区')
    assert field.input_value() == '质量基线工作区'
    assert page.get_by_label('项目地址').first.get_attribute('aria-invalid') == 'true'
    assert page.get_by_label('不可用').first.is_disabled()
    checks.append('Input 输入、错误与禁用状态')

    page.goto(f'{BASE_URL}/components/switch', wait_until='networkidle')
    switch = page.get_by_role('switch', name='自动保存更改').first
    before = switch.is_checked()
    switch.press('Space')
    assert switch.is_checked() is not before
    assert page.get_by_role('switch', name='由组织策略管理').first.is_disabled()
    checks.append('Switch 键盘切换与禁用状态')

    page.goto(f'{BASE_URL}/components/tabs', wait_until='networkidle')
    page.get_by_role('tab', name='动态 3').click()
    page.get_by_text('最近有 3 条动态', exact=True).wait_for(state='visible')
    checks.append('Tabs 内容切换')

    page.goto(f'{BASE_URL}/components/modal', wait_until='networkidle')
    trigger = page.get_by_role('button', name='打开对话框').first
    trigger.click()
    page.get_by_role('dialog', name='发布更改').wait_for(state='visible')
    page.keyboard.press('Escape')
    page.get_by_role('dialog', name='发布更改').wait_for(state='hidden')
    assert trigger.evaluate('(element) => element === document.activeElement')
    checks.append('Modal Escape 与焦点恢复')

    page.goto(f'{BASE_URL}/components/dropdown', wait_until='networkidle')
    page.get_by_role('button', name='更多操作⌄').click()
    page.get_by_role('menuitem', name='复制链接 复制当前项目地址').wait_for(state='visible')
    page.keyboard.press('Escape')
    page.get_by_role('menuitem', name='复制链接 复制当前项目地址').wait_for(state='hidden')
    checks.append('Dropdown 打开与关闭')
    return checks


def main() -> int:
    report_path = Path(__file__).parent / 'tmp' / 'quality-baseline-report.json'
    report_path.parent.mkdir(parents=True, exist_ok=True)
    errors: list[str] = []
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            try:
                page = browser.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
                page.set_default_timeout(10_000)
                page.set_default_navigation_timeout(15_000)
                page.on('console', lambda message: errors.append(f'{page.url}:console:{message.type}:{message.text}') if message.type == 'error' else None)
                page.on('pageerror', lambda error: errors.append(f'{page.url}:pageerror:{error}'))
                open_route(page, '/components/button', errors)
                component_slugs = [item['id'] for item in page.request.get(f'{BASE_URL}/catalog.json').json()]
                assert len(component_slugs) >= 154 and len(set(component_slugs)) == len(component_slugs)
                routes = [*STATIC_ROUTES, *[f'/components/{slug}' for slug in component_slugs]]
                for route in routes:
                    open_route(page, route, errors)
                checks = verify_interactions(page)
                if errors:
                    raise AssertionError(f'浏览器运行错误：{errors}')
            finally:
                browser.close()
        result = {'status': 'ok', 'routes': len(routes), 'components': len(component_slugs), 'interactions': checks, 'browserErrors': errors}
        report_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except Exception as error:
        result = {'status': 'failed', 'errorType': type(error).__name__, 'message': str(error), 'browserErrors': errors}
        report_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(result, ensure_ascii=False, indent=2), file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
