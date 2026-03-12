import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // 访问你的应用
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  
  // 截图
  await page.screenshot({ path: '/tmp/app-screenshot.png', fullPage: true });
  
  // 获取页面标题
  const title = await page.title();
  console.log('✅ 页面标题:', title);
  
  // 获取页面内容
  const bodyText = await page.locator('body').textContent();
  console.log('✅ 页面内容摘要:', bodyText?.substring(0, 300));
  
  // 检查是否有登录表单
  const hasUsername = await page.locator('input[placeholder*="用户名"]').count() > 0;
  console.log('✅ 有用户名输入框:', hasUsername);
  
  await browser.close();
  console.log('✅ 截图已保存：/tmp/app-screenshot.png');
})();
