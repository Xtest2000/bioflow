import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('📋 测试页面：/tools/1/submit?version=V10.0.0.0');
  
  // 访问提交页面（需要登录，会被重定向到登录页）
  await page.goto('http://localhost:3000/tools/1/submit?version=V10.0.0.0', { 
    waitUntil: 'networkidle', 
    timeout: 15000 
  });
  
  // 截图
  await page.screenshot({ path: '/tmp/submit-page.png', fullPage: true });
  
  // 获取当前 URL（可能被重定向）
  const currentUrl = page.url();
  console.log('✅ 当前 URL:', currentUrl);
  
  // 获取页面标题
  const title = await page.title();
  console.log('✅ 页面标题:', title);
  
  // 检查是否有登录表单（说明被重定向了）
  const hasLoginForm = await page.locator('input[placeholder*="用户名"]').count() > 0;
  console.log('✅ 显示登录页（需要认证）:', hasLoginForm);
  
  await browser.close();
  console.log('✅ 截图已保存：/tmp/submit-page.png');
})();
