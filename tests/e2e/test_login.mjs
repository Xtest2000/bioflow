import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🚀 登录测试...\n');
  
  // 访问登录页
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  console.log('✅ 已到达登录页');
  
  // 填写表单
  await page.fill('input[placeholder*="用户名"]', 'admin');
  await page.fill('input[type="password"]', '123456');
  console.log('✅ 已填写用户名和密码');
  
  // 点击登录按钮（使用文本匹配）
  await page.click('button:has-text("登 录")');
  console.log('✅ 已点击登录按钮');
  
  // 等待跳转
  await page.waitForTimeout(3000);
  
  const url = page.url();
  console.log('✅ 当前 URL:', url);
  
  // 截图
  await page.screenshot({ path: '/tmp/after-login.png', fullPage: true });
  console.log('✅ 截图已保存：/tmp/after-login.png');
  
  await browser.close();
  console.log('\n🎉 完成！');
})();
