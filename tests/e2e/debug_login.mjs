import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  
  // 获取所有按钮文本
  const buttons = await page.locator('button').allTextContents();
  console.log('页面上的按钮:', buttons);
  
  // 获取登录按钮的 HTML
  const submitButton = await page.locator('button[type="submit"]').innerHTML();
  console.log('Submit 按钮 HTML:', submitButton.substring(0, 200));
  
  // 尝试找到登录按钮
  const loginButton = await page.locator('button:has-text("登 录"), button:has-text("登录"), .el-button--primary').first();
  const btnText = await loginButton.textContent();
  console.log('找到的登录按钮文本:', btnText);
  
  await browser.close();
})();
