const puppeteer = require('d:/yusra/programming/Major_Projects/Algoverse/frontend/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('[Puppeteer] Launching headless browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    const page = await browser.newPage();
    
    // Set viewport for clean rendering
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

    const htmlPath = path.resolve(__dirname, 'doc.html');
    console.log('[Puppeteer] Loading HTML file: ' + htmlPath);
    
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
      waitUntil: ['load', 'domcontentloaded'],
      timeout: 30000
    });

    // Give mermaid a brief moment to render diagrams if loaded
    try {
      await page.waitForFunction(() => {
        return typeof window.mermaid !== 'undefined';
      }, { timeout: 3000 });
      console.log('[Puppeteer] Mermaid initialized, waiting for rendering...');
      await new Promise(r => setTimeout(r, 2500));
    } catch (e) {
      console.log('[Puppeteer] Proceeding without mermaid wait:', e.message);
    }

    const pdfPath = path.resolve(__dirname, '..', 'Algoverse_Documentation.pdf');
    console.log('[Puppeteer] Printing PDF to: ' + pdfPath);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #94a3b8; width: 100%; text-align: right; padding-right: 40px; padding-top: 10px;">
          Algoverse (Code Nova) — Architecture & Technical Manual
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #94a3b8; width: 100%; text-align: center; padding-bottom: 10px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '16mm',
        right: '16mm'
      }
    });

    console.log('[Puppeteer] Successfully generated Algoverse_Documentation.pdf!');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('[Puppeteer Error]:', err);
    process.exit(1);
  }
})();
