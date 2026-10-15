import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  console.log('Navigating to http://localhost:5173/oop/inheritance/hierarchical ...');
  await page.goto('http://localhost:5173/oop/inheritance/hierarchical', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Capture clean tree layout with refined cards
  const artifactDir = path.resolve('C:/Users/Zubaida Samani/.gemini/antigravity-ide/brain/2191acfe-73db-4750-9fdd-a48cc274a676');
  await page.screenshot({ path: path.join(artifactDir, 'refined_tree_no_overlap.png') });
  console.log('Saved refined_tree_no_overlap.png');

  // 2. Hover over Person card to verify clean highlight and NO overlapping popover
  const personCard = await page.$('#node-parent');
  if (personCard) {
    await personCard.hover();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'refined_hover_no_popup_overlap.png') });
    console.log('Saved refined_hover_no_popup_overlap.png');
  }

  // 3. Click the unified Inheritance dropdown button in the sub-navbar
  // Find the button with text 'Inheritance' inside the sub-navbar
  const buttons = await page.$$('header button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Inheritance')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(artifactDir, 'refined_unified_dropdown_button.png') });
      console.log('Saved refined_unified_dropdown_button.png');
      break;
    }
  }

  // 4. Click 'View Person.java' to inspect the updated proper Java code modal
  const codeButtons = await page.$$('button');
  for (const btn of codeButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('View Person.java')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(artifactDir, 'refined_java_code_modal.png') });
      console.log('Saved refined_java_code_modal.png');
      break;
    }
  }

  await browser.close();
  console.log('All verification captures completed!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
