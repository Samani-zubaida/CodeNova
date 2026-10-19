import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  console.log('Navigating to http://localhost:5173/oop?concept=inheritance for mobile capture...');
  await page.goto('http://localhost:5173/oop?concept=inheritance', { waitUntil: 'networkidle2' });

  // 1. Light Mode Mobile
  const lightBtn = await page.waitForSelector('button[title="Light mode"]');
  if (lightBtn) await lightBtn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshots/inherit_mobile_light.png' });
  console.log('Captured screenshots/inherit_mobile_light.png');

  // 2. Dark Mode Mobile
  const darkBtn = await page.waitForSelector('button[title="Dark mode"]');
  if (darkBtn) await darkBtn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshots/inherit_mobile_dark.png' });
  console.log('Captured screenshots/inherit_mobile_dark.png');

  await browser.close();
  console.log('Mobile verification captures finished successfully!');
})();
