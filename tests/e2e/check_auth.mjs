import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console error:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('❌ Page error:', err.message);
  });
  
  console.log('🔍 开始登录诊断...\n');
  
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  
  // 填写并登录
  await page.fill('input[placeholder*="用户名"]', 'admin');
  await page.fill('input[type="password"]', '123456');
  await page.click('button:has-text("登 录")');
  
  // 等待并收集错误
  await page.waitForTimeout(5000);
  
  // 检查是否有成功消息
  const successMsg = await page.locator('.el-message--success').count();
  console.log('✅ 成功消息数量:', successMsg);
  
  // 检查是否有错误消息
  const errorMsg = await page.locator('.el-message--error').count();
  console.log('❌ 错误消息数量:', errorMsg);
  
  const currentUrl = page.url();
  console.log('📍 当前 URL:', currentUrl);
  
  await browser.close();
})();
