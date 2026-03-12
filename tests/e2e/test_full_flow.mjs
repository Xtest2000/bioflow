import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🚀 开始完整流程测试...\n');
  
  // 1. 访问登录页
  console.log('1️⃣ 访问登录页...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  console.log('   ✅ 已到达登录页');
  
  // 2. 填写登录表单
  console.log('2️⃣ 填写用户名...');
  await page.fill('input[placeholder*="用户名"]', 'admin');
  
  console.log('3️⃣ 填写密码...');
  await page.fill('input[type="password"]', '123456');
  
  // 3. 点击登录按钮
  console.log('4️⃣ 点击登录按钮...');
  await page.click('button[type="submit"]');
  
  // 等待导航
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  console.log('   ✅ 登录成功，已跳转到 Dashboard');
  
  // 4. 截图 Dashboard
  await page.screenshot({ path: '/tmp/dashboard.png', fullPage: true });
  console.log('   ✅ Dashboard 截图已保存');
  
  // 5. 访问工具提交页面
  console.log('5️⃣ 访问工具提交页面...');
  await page.goto('http://localhost:3000/tools/1/submit?version=V10.0.0.0', { waitUntil: 'networkidle' });
  
  // 6. 检查页面元素
  const url = page.url();
  console.log('   ✅ 当前 URL:', url);
  
  const h1 = await page.locator('h1').textContent();
  console.log('   ✅ 页面标题:', h1);
  
  // 检查是否有任务名称输入框
  const hasTaskName = await page.locator('input[placeholder*="任务名称"]').count() > 0;
  console.log('   ✅ 有任务名称输入框:', hasTaskName);
  
  // 检查是否有提交按钮
  const hasSubmitButton = await page.locator('button:has-text("批量提交")').count() > 0;
  console.log('   ✅ 有批量提交按钮:', hasSubmitButton);
  
  // 7. 截图提交页面
  await page.screenshot({ path: '/tmp/submit-page-logged-in.png', fullPage: true });
  console.log('   ✅ 提交页面截图已保存');
  
  console.log('\n🎉 完整流程测试完成！\n');
  console.log('📸 截图文件:');
  console.log('   - /tmp/dashboard.png');
  console.log('   - /tmp/submit-page-logged-in.png');
  
  await browser.close();
})();
