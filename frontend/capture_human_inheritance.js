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

  // 1. Initial State (Parent, Student, Employee with 2.5D Characters)
  const step1Btn = await page.waitForSelector('button::-p-text(1. Superclass)');
  if (step1Btn) await step1Btn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'human_inherit_step1_tree.png' });
  console.log('Captured human_inherit_step1_tree.png');

  // 2. Trait Delivery (Streaming name, age, eat, sleep)
  const step2Btn = await page.waitForSelector('button::-p-text(2. Trait Delivery)');
  if (step2Btn) await step2Btn.click();
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'human_inherit_step2_delivery.png' });
  console.log('Captured human_inherit_step2_delivery.png');

  // 3. Completed State with [ INHERITED ] and [ OWN ] Badges
  const step4Btn = await page.waitForSelector('button::-p-text(4. Complete)');
  if (step4Btn) await step4Btn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'human_inherit_step4_completed.png' });
  console.log('Captured human_inherit_step4_completed.png');

  // 4. Hover State: Hovering Parent Class Card
  const parentCard = await page.waitForSelector('h3::-p-text(class Person)');
  if (parentCard) {
    await parentCard.hover();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'human_inherit_hover_parent.png' });
    console.log('Captured human_inherit_hover_parent.png');
  }

  // 5. Code Modal: Click "Compare All Classes"
  const compareCodeBtn = await page.waitForSelector('button::-p-text(Compare All Classes)');
  if (compareCodeBtn) {
    await compareCodeBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'human_inherit_code_modal.png' });
    console.log('Captured human_inherit_code_modal.png');

    // Close Code Modal
    const closeBtn = await page.waitForSelector('div.fixed button svg');
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // 6. Mobile Responsiveness (375x667)
  await page.setViewport({ width: 375, height: 667 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'human_inherit_mobile.png' });
  console.log('Captured human_inherit_mobile.png');

  await browser.close();
  console.log('All human inheritance captures completed successfully!');
})();
