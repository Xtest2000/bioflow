import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:3000/tools/1/submit?version=V10.0.0.0', { waitUntil: 'networkidle', timeout: 10000 });

// 截图
await page.screenshot({ path: '/tmp/page_screenshot.png', fullPage: true });

// 获取页面标题和主要内容
const title = await page.title();
const bodyText = await page.locator('body').textContent();

console.log('=== 页面标题 ===');
console.log(title);
console.log('\n=== 页面主要内容 ===');
console.log(bodyText?.substring(0, 2000));
console.log('\n=== 截图已保存至：/tmp/page_screenshot.png ===');

await browser.close();
