/**
 * Code Nova Platform Access & Dynamic Navbar E2E Suite
 * Tests cases 5, 6, 8, 9, 10, 12 using headless browser:
 *  Case 10: Unauthenticated access to /oop, /sandbox, /game blocked -> redirects to /auth with message.
 *  Case 9: Public homepage / renders, shows Login and Sign Up buttons in Navbar (no Logout).
 *  Case 5: Log in -> Navbar shows Logout button and user indicator instead of Login/Signup.
 *  Case 12: Logged-in user can freely access all protected routes (/oop, /sandbox, /game) without redirection.
 *  Case 6: Browser refresh restores authenticated session and preserves access.
 *  Case 8: Click Logout -> User returned to /, Navbar shows Login/Signup, protected routes blocked again.
 */

import puppeteer from 'puppeteer';

const FRONTEND_URL = 'http://localhost:5173';

async function runE2eSuite() {
  console.log('====================================================');
  console.log('🎭 RUNNING PLATFORM ACCESS & NAVBAR E2E VERIFICATION');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // Clear any existing localStorage
  await page.goto(FRONTEND_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });

  // ── TEST 9: Public homepage & Logged-out Navbar ──
  console.log('[STEP 9] Checking public homepage & logged-out navbar...');
  const currentUrl = page.url();
  assert(currentUrl === `${FRONTEND_URL}/` || currentUrl === `${FRONTEND_URL}`, 'Public homepage accessible at /');

  const navActions = await page.evaluate(() => {
    const signInBtn = document.querySelector('#sign-in-btn');
    const signUpBtn = document.querySelector('#sign-up-btn');
    const logoutBtn = document.querySelector('#logout-btn');
    return {
      hasSignIn: Boolean(signInBtn),
      signInText: signInBtn ? signInBtn.innerText.trim() : null,
      hasSignUp: Boolean(signUpBtn),
      signUpText: signUpBtn ? signUpBtn.innerText.trim() : null,
      hasLogout: Boolean(logoutBtn)
    };
  });

  assert(navActions.hasSignIn, `Navbar displays Log In button ("${navActions.signInText}")`);
  assert(navActions.hasSignUp, `Navbar displays Sign Up button ("${navActions.signUpText}")`);
  assert(!navActions.hasLogout, 'Navbar does NOT display Logout button when logged out');

  // ── TEST 10: Attempt to open protected routes while logged out ──
  console.log('\n[STEP 10] Attempting direct navigation to protected routes while logged out...');
  const protectedUrls = ['/oop', '/sandbox', '/game', '/visualizer/crypto', '/oop/inheritance/hierarchical'];

  for (const path of protectedUrls) {
    // Navigate away first to ensure URL changes
    await page.goto(`${FRONTEND_URL}/intro`, { waitUntil: 'domcontentloaded' });
    await page.goto(`${FRONTEND_URL}${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.bg-amber-500\\/15, .bg-amber-500\\/10, [class*="amber"]', { timeout: 8000 });
    const targetUrl = page.url();
    assert(targetUrl.includes('/auth'), `Direct visit to ${path} blocked and redirected to /auth (current: ${targetUrl})`);

    const bannerText = await page.evaluate(() => {
      const banner = document.querySelector('.bg-amber-500\\/15, .bg-amber-500\\/10, [class*="amber"]');
      return banner ? banner.innerText : null;
    });
    assert(
      bannerText && bannerText.includes('Please log in first to access this feature.'),
      `Amber notice displayed: "Please log in first to access this feature."`
    );
  }

  // ── TEST 5: Perform Login & Verify Navbar updates ──
  console.log('\n[STEP 5] Performing login and verifying dynamic navbar update...');
  await page.goto(`${FRONTEND_URL}/auth`, { waitUntil: 'domcontentloaded' });

  // Wait for and click #demo-login-btn
  await page.waitForSelector('#demo-login-btn', { timeout: 6000 });
  await page.click('#demo-login-btn');

  // Wait for redirect to leave /auth
  await page.waitForFunction(() => !window.location.pathname.startsWith('/auth'), { timeout: 8000 });
  await new Promise(r => setTimeout(r, 1000));

  const postLoginUrl = page.url();
  console.log(`  Post-login URL: ${postLoginUrl}`);

  // Navigate to Sandbox to verify navbar (since OOP concept pages are 100vh studios that intentionally hide top bar)
  await page.goto(`${FRONTEND_URL}/sandbox`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#logout-btn', { timeout: 8000 });

  const postLoginNav = await page.evaluate(() => {
    const logoutBtn = document.querySelector('#logout-btn');
    const signInBtn = document.querySelector('#sign-in-btn');
    const signUpBtn = document.querySelector('#sign-up-btn');
    const userPill = document.querySelector('nav .text-slate-200, nav .text-slate-800');
    return {
      hasLogout: Boolean(logoutBtn),
      hasSignIn: Boolean(signInBtn),
      hasSignUp: Boolean(signUpBtn),
      userName: userPill ? userPill.innerText.trim() : null
    };
  });

  assert(postLoginNav.hasLogout, 'Navbar now displays Logout button (#logout-btn)');
  assert(!postLoginNav.hasSignIn, 'Navbar no longer displays Log In button');
  assert(!postLoginNav.hasSignUp, 'Navbar no longer displays Sign Up button');
  assert(Boolean(postLoginNav.userName), `Navbar displays authenticated user profile indicator ("${postLoginNav.userName}")`);

  // ── TEST 12: Authenticated user can use all platform features ──
  console.log('\n[STEP 12] Verifying authenticated access to all platform features...');

  // 12a: OOP visualizer
  await page.goto(`${FRONTEND_URL}/oop/inheritance/hierarchical`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  assert(page.url().includes('/oop/inheritance/hierarchical'), 'Authenticated user opened /oop/inheritance/hierarchical without redirection');

  // 12b: Sandbox
  await page.goto(`${FRONTEND_URL}/sandbox`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#run-code-btn', { timeout: 8000 });
  assert(page.url().includes('/sandbox'), 'Authenticated user opened /sandbox without redirection');
  const runBtnText = await page.evaluate(() => {
    const btn = document.querySelector('#run-code-btn');
    return btn ? btn.innerText.trim() : null;
  });
  assert(runBtnText === 'Run Code', `Sandbox Run button in active state: "${runBtnText}" (No "Login Required")`);

  // 12c: Game World
  await page.goto(`${FRONTEND_URL}/game`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  assert(page.url().includes('/game'), 'Authenticated user opened /game without redirection');

  // 12d: Cryptography Studio
  await page.goto(`${FRONTEND_URL}/visualizer/crypto`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 8000 });
  assert(page.url().includes('/visualizer/crypto'), 'Authenticated user opened /visualizer/crypto without redirection to /oop');
  const cryptoHeader = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText : '';
  });
  assert(cryptoHeader.includes('Cryptography Studio'), `Cryptography Studio rendered properly: "${cryptoHeader}"`);

  // 12e: Individual algorithm direct route (/visualizer/aes)
  await page.goto(`${FRONTEND_URL}/visualizer/aes`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 8000 });
  assert(page.url().includes('/visualizer/aes'), 'Authenticated user opened /visualizer/aes directly');

  // ── TEST 6: Page refresh restores valid session ──
  console.log('\n[STEP 6] Testing browser reload session restoration...');
  // Reload while on /sandbox so navbar with logout button is visible
  await page.goto(`${FRONTEND_URL}/sandbox`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#logout-btn', { timeout: 8000 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#logout-btn', { timeout: 8000 });

  const refreshedNav = await page.evaluate(() => {
    const logoutBtn = document.querySelector('#logout-btn');
    return Boolean(logoutBtn);
  });
  assert(refreshedNav === true, 'Authenticated session restored on reload; Logout button remained visible');
  assert(page.url().includes('/sandbox'), 'User stayed on protected page after page reload');

  // ── TEST 8: Log out and confirm return to / ──
  console.log('\n[STEP 8] Clicking Logout and verifying return to /...');
  await page.waitForSelector('#logout-btn', { timeout: 6000 });
  await page.click('#logout-btn');

  await page.waitForFunction(
    () => window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/intro',
    { timeout: 8000 }
  );
  await page.waitForSelector('#sign-in-btn', { timeout: 8000 });
  const postLogoutUrl = page.url();
  assert(
    postLogoutUrl === `${FRONTEND_URL}/` || postLogoutUrl === `${FRONTEND_URL}` || postLogoutUrl.includes('/intro'),
    `Logout immediately returned user to public homepage / (current: ${postLogoutUrl})`
  );

  const finalNav = await page.evaluate(() => {
    const signInBtn = document.querySelector('#sign-in-btn');
    const signUpBtn = document.querySelector('#sign-up-btn');
    const logoutBtn = document.querySelector('#logout-btn');
    return {
      hasSignIn: Boolean(signInBtn),
      hasSignUp: Boolean(signUpBtn),
      hasLogout: Boolean(logoutBtn)
    };
  });

  assert(finalNav.hasSignIn, 'Log In action reappeared in Navbar');
  assert(finalNav.hasSignUp, 'Sign Up action reappeared in Navbar');
  assert(!finalNav.hasLogout, 'Logout action removed from Navbar');

  // Try opening protected route again
  await page.goto(`${FRONTEND_URL}/sandbox`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.location.pathname.startsWith('/auth'), { timeout: 6000 });
  assert(page.url().includes('/auth'), 'Protected route /sandbox immediately blocked post-logout');

  await browser.close();

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passed}/${total} PLATFORM ACCESS & NAVBAR CHECKS PASSED!`);
  console.log('====================================================\n');
}

runE2eSuite().catch(err => {
  console.error('\n❌ E2E SUITE FAILED:', err);
  process.exit(1);
});
