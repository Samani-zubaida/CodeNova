import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173/oop?concept=inheritance...');
  await page.goto('http://localhost:5173/oop?concept=inheritance', { waitUntil: 'networkidle2' });

  // 1. Ensure Light Mode first
  const lightBtn = await page.waitForSelector('button[title="Light mode"]');
  if (lightBtn) await lightBtn.click();
  await new Promise(r => setTimeout(r, 600));

  // Capture Light Mode: Phase 1 (Grandparent Origin)
  const step1Btn = await page.waitForSelector('button::-p-text(1. Grandparent)');
  if (step1Btn) await step1Btn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshots/inherit_light_phase1.png' });
  console.log('Captured screenshots/inherit_light_phase1.png');

  // Capture Light Mode: Phase 2 (Inheriting to Parent with color-blending particle)
  const step2Btn = await page.waitForSelector('button::-p-text(2. Inherit to Parent)');
  if (step2Btn) await step2Btn.click();
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/inherit_light_phase2.png' });
  console.log('Captured screenshots/inherit_light_phase2.png');

  // Capture Light Mode: Phase 4 (Hierarchy Completed)
  const step4Btn = await page.waitForSelector('button::-p-text(4. Complete)');
  if (step4Btn) await step4Btn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshots/inherit_light_phase4_completed.png' });
  console.log('Captured screenshots/inherit_light_phase4_completed.png');

  // 2. Switch Dynamically to Dark Mode (No page reload!)
  const darkBtn = await page.waitForSelector('button[title="Dark mode"]');
  if (darkBtn) await darkBtn.click();
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'screenshots/inherit_dark_phase4_completed.png' });
  console.log('Captured screenshots/inherit_dark_phase4_completed.png');

  // Capture Dark Mode: Phase 2 (Inheriting to Parent in Dark Mode)
  if (step2Btn) await step2Btn.click();
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/inherit_dark_phase2.png' });
  console.log('Captured screenshots/inherit_dark_phase2.png');

  // 3. Mobile Viewport (375x667)
  await page.setViewport({ width: 375, height: 667 });
  if (step4Btn) await step4Btn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshots/inherit_mobile_completed.png' });
  console.log('Captured screenshots/inherit_mobile_completed.png');

  await browser.close();
  console.log('All inheritance verification captures finished successfully!');
})();
