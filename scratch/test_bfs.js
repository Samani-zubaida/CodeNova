const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    console.log('Navigating to BFS...');
    await page.goto('http://localhost:5173/visualizer/graph/bfs', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));

    // Find PLAY button
    const buttons = await page.$$('button');
    let played = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('PLAY')) {
        await btn.click();
        console.log('Clicked PLAY button');
        played = true;
        break;
      }
    }

    if (played) {
      // Let animation run for ~4.5 seconds so nodes enter the queue and visited array updates
      await new Promise(r => setTimeout(r, 4500));
      // Click pause
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('PAUSE') || text.includes('PLAY')) {
          await btn.click();
          console.log('Paused playback');
          break;
        }
      }
    }

    await page.screenshot({ path: 'graph_bfs_running.png' });
    console.log('Saved graph_bfs_running.png');

    // Also test DFS to see the Stack beaker!
    console.log('Navigating to DFS...');
    await page.goto('http://localhost:5173/visualizer/graph/dfs', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));

    const dfsButtons = await page.$$('button');
    for (const btn of dfsButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('PLAY')) {
        await btn.click();
        console.log('Clicked DFS PLAY button');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: 'graph_dfs_running.png' });
    console.log('Saved graph_dfs_running.png');

  } catch(e) {
    console.error('Error:', e);
  } finally {
    await browser.close();
  }
})();
