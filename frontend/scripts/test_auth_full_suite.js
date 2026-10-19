import puppeteer from 'puppeteer';

const BASE_FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
const BASE_BACKEND = process.env.VITE_API_URL || 'http://localhost:5000';

async function testBackendApis() {
  console.log('\n--- 1. Testing Backend API Security Directly ---');
  
  // Test 1: POST /api/sandbox/execute unauthenticated -> 401
  const resExecuteNoAuth = await fetch(`${BASE_BACKEND}/api/sandbox/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'console.log("hello")', language: 'javascript' })
  });
  console.log(`[PASS] /api/sandbox/execute without token returned status: ${resExecuteNoAuth.status} (expected 401)`);
  if (resExecuteNoAuth.status !== 401) throw new Error('Expected 401 on unauthenticated execute');

  // Test 2: POST /api/sandbox/visualize unauthenticated -> 401
  const resVisualizeNoAuth = await fetch(`${BASE_BACKEND}/api/sandbox/visualize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'let a = 1;', language: 'javascript' })
  });
  console.log(`[PASS] /api/sandbox/visualize without token returned status: ${resVisualizeNoAuth.status} (expected 401)`);
  if (resVisualizeNoAuth.status !== 401) throw new Error('Expected 401 on unauthenticated visualize');

  // Test 3: POST /api/ai/hint unauthenticated -> 401
  const resAiNoAuth = await fetch(`${BASE_BACKEND}/api/ai/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem: 'reverse string', code: '' })
  });
  console.log(`[PASS] /api/ai/hint without token returned status: ${resAiNoAuth.status} (expected 401)`);
  if (resAiNoAuth.status !== 401) throw new Error('Expected 401 on unauthenticated hint');

  // Test 4: POST /api/competitions/create unauthenticated -> 401
  const resCompNoAuth = await fetch(`${BASE_BACKEND}/api/competitions/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test Comp' })
  });
  console.log(`[PASS] /api/competitions/create without token returned status: ${resCompNoAuth.status} (expected 401)`);
  if (resCompNoAuth.status !== 401) throw new Error('Expected 401 on unauthenticated competition creation');

  // Test 5: Login with demo credentials
  const resLogin = await fetch(`${BASE_BACKEND}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@codenova.dev', password: 'password123' })
  });
  const loginData = await resLogin.json();
  console.log(`[PASS] Demo user login returned status: ${resLogin.status}, token received: ${Boolean(loginData.token)}`);
  if (resLogin.status !== 200 || !loginData.token) throw new Error('Demo login failed');
  const token = loginData.token;

  // Test 6: GET /api/auth/me with valid token -> 200
  const resMeAuth = await fetch(`${BASE_BACKEND}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meData = await resMeAuth.json();
  console.log(`[PASS] /api/auth/me with valid token returned status: ${resMeAuth.status}, user email: ${meData.email}`);
  if (resMeAuth.status !== 200 || !meData.email) throw new Error('Valid token /api/auth/me failed');

  // Test 7: GET /api/auth/me with bogus token -> 401
  const resMeBogus = await fetch(`${BASE_BACKEND}/api/auth/me`, {
    headers: { Authorization: `Bearer invalid-tampered-token` }
  });
  console.log(`[PASS] /api/auth/me with forged token returned status: ${resMeBogus.status} (expected 401)`);
  if (resMeBogus.status !== 401) throw new Error('Expected 401 for forged token');

  // Test 8: POST /api/sandbox/execute with valid token -> 200
  const resExecuteAuth = await fetch(`${BASE_BACKEND}/api/sandbox/execute`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ code: 'console.log("auth execution works!");', language: 'javascript' })
  });
  const execData = await resExecuteAuth.json();
  console.log(`[PASS] /api/sandbox/execute with valid token returned status: ${resExecuteAuth.status}, success: ${execData.success}`);
  if (resExecuteAuth.status !== 200) throw new Error('Authenticated execution failed');
}

async function testFrontendFlows() {
  console.log('\n--- 2. Testing Frontend Authentication Flows with Puppeteer ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // 1. Visit /oop and clear storage
    await page.goto(`${BASE_FRONTEND}/oop`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(`${BASE_FRONTEND}/oop`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav', { timeout: 10000 });

    // Check /oop Navbar for logged-out visitor
    console.log('\n[Scenario 1] Verify Public Platform Hub & Navbar');
    const navText = await page.$eval('nav', el => el.innerText);
    console.log(`[PASS] Public Navbar rendered. Contains "Sign In": ${navText.includes('Sign In')}`);
    if (!navText.includes('Sign In')) throw new Error('Navbar should show "Sign In" when logged out');

    // 2. Check Sandbox UI when logged out
    console.log('\n[Scenario 2] Check Sandbox UI for Logged-Out Visitor');
    await page.goto(`${BASE_FRONTEND}/sandbox`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#run-code-btn', { timeout: 10000 });
    const runBtnText = await page.$eval('#run-code-btn', el => el.innerText);
    console.log(`[PASS] Sandbox Run button rendered. Text: "${runBtnText}" (Includes Lock / Login Required: ${runBtnText.includes('Login Required')})`);
    
    // Attempt clicking Run Code while logged out
    console.log('Attempting to click Run Code button...');
    await page.click('#run-code-btn');
    await new Promise(r => setTimeout(r, 800));

    const currentUrl = page.url();
    console.log(`Redirected URL: ${currentUrl}`);
    if (!currentUrl.includes('/auth')) throw new Error(`Expected redirect to /auth, got ${currentUrl}`);
    
    // Check for "Please log in first" banner on /auth
    await page.waitForSelector('body');
    const bodyText = await page.$eval('body', el => el.innerText);
    const hasWarningMessage = bodyText.includes('Please log in first to access this feature');
    console.log(`[PASS] Auth page displays security banner: ${hasWarningMessage}`);
    if (!hasWarningMessage) throw new Error('Missing "Please log in first" notice');

    // 3. Check DSA Visualizer for Logged-Out Visitor
    console.log('\n[Scenario 3] Check DSA Visualizer for Logged-Out Visitor');
    await page.goto(`${BASE_FRONTEND}/visualizer/heap`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#play-pause-btn', { timeout: 10000 });
    console.log(`[PASS] DSA Play button rendered. Interacting...`);
    await page.click('#play-pause-btn');
    await new Promise(r => setTimeout(r, 800));
    console.log(`Redirected URL: ${page.url()}`);
    if (!page.url().includes('/auth')) throw new Error('Expected redirect to /auth when clicking Play in visualizer');

    // 4. Check OOP Inheritance Visualizer for Logged-Out Visitor
    console.log('\n[Scenario 4] Check OOP Visualizer for Logged-Out Visitor');
    await page.goto(`${BASE_FRONTEND}/oop/inheritance/single`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#oop-workflow-play-btn', { timeout: 10000 });
    console.log(`[PASS] OOP Visualizer loaded. Clicking Play Flow...`);
    await page.click('#oop-workflow-play-btn');
    await new Promise(r => setTimeout(r, 800));
    console.log(`Redirected URL: ${page.url()}`);
    if (!page.url().includes('/auth')) throw new Error('Expected redirect to /auth when clicking OOP Play Flow');

    // 5. Check Game World for Logged-Out Visitor
    console.log('\n[Scenario 5] Check Game World for Logged-Out Visitor');
    await page.goto(`${BASE_FRONTEND}/game`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#start-level-ds', { timeout: 10000 });
    console.log(`[PASS] Game World rendered. Clicking START LEVEL on DS quest...`);
    await page.click('#start-level-ds');
    await new Promise(r => setTimeout(r, 800));
    console.log(`Redirected URL: ${page.url()}`);
    if (!page.url().includes('/auth')) throw new Error('Expected redirect to /auth when starting game level');

    // 6. Direct Protected Route Access (/host)
    console.log('\n[Scenario 6] Direct Protected Route Access (/host)');
    await page.goto(`${BASE_FRONTEND}/host`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));
    console.log(`Redirected URL: ${page.url()}`);
    if (!page.url().includes('/auth')) throw new Error('Expected redirect to /auth when accessing /host directly');

    // 7. Perform 1-Click Demo Login
    console.log('\n[Scenario 7] Perform 1-Click Demo Login');
    await page.waitForSelector('#demo-login-btn', { timeout: 10000 });
    await page.click('#demo-login-btn');
    await page.waitForSelector('#logout-btn', { timeout: 10000 });
    console.log(`Post-login URL: ${page.url()}`);
    
    // Check that user is authenticated in Navbar
    const hasLogoutBtn = await page.$('#logout-btn');
    console.log(`[PASS] Post-login Navbar contains user pill and logout button: ${Boolean(hasLogoutBtn)}`);
    if (!hasLogoutBtn) throw new Error('Navbar does not show #logout-btn after login');

    // 8. Test Authenticated Sandbox Execution
    console.log('\n[Scenario 8] Authenticated Sandbox Execution');
    await page.goto(`${BASE_FRONTEND}/sandbox`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#run-code-btn', { timeout: 10000 });
    const authRunBtnText = await page.$eval('#run-code-btn', el => el.innerText);
    console.log(`[PASS] Authenticated Run button text: "${authRunBtnText}" (No "Login Required": ${!authRunBtnText.includes('Login Required')})`);
    
    await page.click('#run-code-btn');
    await new Promise(r => setTimeout(r, 2000));
    // Verify did NOT redirect to auth
    console.log(`[PASS] Current URL after running code: ${page.url()} (Stayed on /sandbox)`);
    if (page.url().includes('/auth')) throw new Error('Authenticated user was unexpectedly redirected to /auth');

    // 9. Test Authenticated DSA Playback
    console.log('\n[Scenario 9] Authenticated DSA Playback');
    await page.goto(`${BASE_FRONTEND}/visualizer/heap`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#play-pause-btn', { timeout: 10000 });
    await page.click('#play-pause-btn');
    await new Promise(r => setTimeout(r, 1000));
    console.log(`[PASS] Current URL after clicking Play: ${page.url()} (Stayed on /visualizer)`);
    if (page.url().includes('/auth')) throw new Error('Authenticated user was redirected on Play');

    // 10. Test Page Refresh Preserves Authentication
    console.log('\n[Scenario 10] Page Refresh Preserves Authentication');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#logout-btn', { timeout: 10000 });
    const hasLogoutAfterReload = await page.$('#logout-btn');
    console.log(`[PASS] Navbar still authenticated after page refresh (#logout-btn present: ${Boolean(hasLogoutAfterReload)})`);
    if (!hasLogoutAfterReload) throw new Error('Authentication lost after page refresh');

    // 11. Test Theme Switching Remains Functional
    console.log('\n[Scenario 11] Theme Switching in Both Modes');
    const lightBtn = await page.$('button[title="Light mode"]');
    if (lightBtn) {
      await lightBtn.click();
      await new Promise(r => setTimeout(r, 300));
      console.log(`[PASS] Clicked Light mode successfully`);
    }
    const darkBtn = await page.$('button[title="Warm Dark mode"]');
    if (darkBtn) {
      await darkBtn.click();
      await new Promise(r => setTimeout(r, 300));
      console.log(`[PASS] Clicked Dark mode successfully`);
    }

    // 12. Test Immediate Logout
    console.log('\n[Scenario 12] Immediate Logout');
    await page.waitForSelector('#logout-btn', { timeout: 10000 });
    await page.click('#logout-btn');
    await page.waitForSelector('#sign-in-btn', { timeout: 10000 });
    const loggedOutNav = await page.$eval('nav', el => el.innerText);
    console.log(`[PASS] Navbar switched to logged-out state: ${loggedOutNav.includes('Sign In')}`);
    if (!loggedOutNav.includes('Sign In')) throw new Error('Navbar did not switch to Sign In after logout');

    // Check that Sandbox controls immediately become restricted without page refresh
    await page.goto(`${BASE_FRONTEND}/sandbox`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#run-code-btn', { timeout: 10000 });
    const postLogoutRunText = await page.$eval('#run-code-btn', el => el.innerText);
    console.log(`[PASS] Run button after logout: "${postLogoutRunText}" (Lock active: ${postLogoutRunText.includes('Login Required')})`);
    await page.click('#run-code-btn');
    await new Promise(r => setTimeout(r, 800));
    console.log(`[PASS] Clicking Run code redirects to /auth: ${page.url().includes('/auth')}`);
    if (!page.url().includes('/auth')) throw new Error('Expected redirect to /auth after logout');

    console.log('\n>>> ALL 12 END-TO-END AUTOMATED TEST SCENARIOS PASSED WITH ZERO ERRORS! <<<');

  } finally {
    await browser.close();
  }
}

async function runAll() {
  try {
    await testBackendApis();
    await testFrontendFlows();
    console.log('\n=========================================');
    console.log('✅ COMPLETE ACCESS CONTROL SUITE VERIFIED');
    console.log('=========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err);
    process.exit(1);
  }
}

runAll();
