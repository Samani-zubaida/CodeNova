/**
 * Code Nova Authentication & Session Integration Test Suite
 * Tests cases 1-4, 7, 11, 13, 14 directly against backend APIs:
 *  1. Register a brand-new email and create one account.
 *  2. Try registering the same email again and confirm rejection with no duplicate identity.
 *  3. Log in using the original email and password.
 *  4. Try an incorrect password and confirm login fails safely with generic error.
 *  7. Verify user retains streaks, progress, and badges across sessions.
 *  11. Attempt direct unauthenticated requests to protected backend APIs (401).
 *  13. Confirm one user's identity cannot access/modify another user's data (403 IDOR).
 *  14. Verify invalid and expired sessions are handled correctly.
 */

const BASE_URL = 'http://localhost:5000';

async function safeFetch(url, options = {}, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if ((err.code === 'ECONNRESET' || err.message?.includes('fetch failed')) && i < retries - 1) {
        await new Promise(r => setTimeout(r, 800));
        continue;
      }
      throw err;
    }
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 CODE NOVA COMPLETE AUTHENTICATION INTEGRATION SUITE');
  console.log('====================================================\n');

  const timestamp = Date.now();
  const testEmail = `student_${timestamp}@example.com`;
  const testPassword = 'Password123!';
  const testUsername = `student_${timestamp.toString().slice(-6)}`;

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

  // ── TEST 1: Register brand-new email ──
  console.log('[STEP 1] Registering a brand-new account (student@example.com)...');
  const regRes = await safeFetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: testUsername,
      email: testEmail,
      password: testPassword
    })
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, `Account created with status 201 (got ${regRes.status})`);
  assert(regData.success === true, 'Response contains success: true');
  assert(Boolean(regData.token), 'JWT token returned upon registration');
  assert(regData.user.email === testEmail.toLowerCase(), 'User email normalized and preserved');
  const originalUserId = regData.user.id;

  // ── TEST 2: Register the same email again ──
  console.log('\n[STEP 2] Attempting to register the same email again...');
  const dupRes = await safeFetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `other_${timestamp}`,
      email: testEmail.toUpperCase(), // Test case-insensitive normalization
      password: 'differentPassword456'
    })
  });
  const dupData = await dupRes.json();
  assert(dupRes.status === 400, `Duplicate registration rejected with status 400 (got ${dupRes.status})`);
  assert(
    dupData.message === 'An account with this email already exists. Please log in instead.',
    `Returned clear duplicate message: "${dupData.message}"`
  );

  // Brief pause for stability
  await new Promise(r => setTimeout(r, 600));

  // ── TEST 3: Log in using original email & password ──
  console.log('\n[STEP 3] Logging in with the created account credentials...');
  const loginRes = await safeFetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200, `Login successful with status 200 (got ${loginRes.status})`);
  assert(Boolean(loginData.token), 'Valid JWT token issued on login');
  assert(loginData.user.id === originalUserId, `Same persistent user ID preserved (${loginData.user.id})`);
  const authToken = loginData.token;

  // ── TEST 4: Try incorrect password ──
  console.log('\n[STEP 4] Attempting login with incorrect password...');
  const wrongPwRes = await safeFetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'wrongPassword123'
    })
  });
  const wrongPwData = await wrongPwRes.json();
  assert(wrongPwRes.status === 401, `Incorrect password rejected with status 401 (got ${wrongPwRes.status})`);
  assert(
    wrongPwData.message === 'Invalid email or password.',
    `Generic safe message returned without leaking password correctness: "${wrongPwData.message}"`
  );

  // Also test non-existent email
  const fakeEmailRes = await safeFetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nonexistent_account_xyz@example.com',
      password: 'anyPassword123'
    })
  });
  const fakeEmailData = await fakeEmailRes.json();
  assert(fakeEmailRes.status === 401, 'Nonexistent email returns 401');
  assert(
    fakeEmailData.message === 'Invalid email or password.',
    'Nonexistent email returns same generic message (prevents enumeration)'
  );

  // ── TEST 7: Preserve streaks, progress, and user records across sessions ──
  console.log('\n[STEP 7] Verifying user streaks & progress retention...');
  // Update progress
  const progRes = await safeFetch(`${BASE_URL}/api/progress/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ score: 75, town2Unlocked: true })
  });
  const progData = await progRes.json();
  assert(progRes.status === 200, 'Progress updated successfully');
  assert(progData.totalScore >= 75, `Progress score recorded: ${progData.totalScore}`);

  // Query progress back
  const getProgRes = await safeFetch(`${BASE_URL}/api/progress`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const getProgData = await getProgRes.json();
  assert(getProgData.totalScore === progData.totalScore, 'Progress restored accurately via token session');
  assert(getProgData.town2Unlocked === true, 'Town 2 unlocked status preserved');

  // Query user profile via /me
  const meRes = await safeFetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const meData = await meRes.json();
  assert(meRes.status === 200, 'GET /api/auth/me returned 200');
  assert(meData.email === testEmail.toLowerCase(), 'Profile matched authenticated user');
  assert(meData.currentStreak >= 1, `Streak recorded and preserved: ${meData.currentStreak}`);

  // ── TEST 11: Attempt direct unauthenticated requests to protected APIs ──
  console.log('\n[STEP 11] Verifying direct unauthenticated requests return 401...');
  const protectedEndpoints = [
    { method: 'POST', url: '/api/sandbox/execute', body: { code: '1+1', language: 'javascript' } },
    { method: 'POST', url: '/api/sandbox/visualize', body: { code: 'let x = 1;', language: 'javascript' } },
    { method: 'POST', url: '/api/ai/hint', body: { problem: 'two sum' } },
    { method: 'GET', url: '/api/progress' },
    { method: 'POST', url: '/api/progress/update', body: { score: 10 } },
    { method: 'GET', url: '/api/levels/ds/1' },
    { method: 'POST', url: '/api/competitions/create', body: { title: 'Comp' } },
    { method: 'POST', url: '/api/users/record-activity', body: { username: testUsername } },
    { method: 'POST', url: '/api/users/award-badge', body: { username: testUsername, badgeId: 'b1', badgeName: 'B1' } },
    { method: 'GET', url: '/api/auth/me' },
    { method: 'POST', url: '/api/auth/logout' }
  ];

  for (const ep of protectedEndpoints) {
    const res = await safeFetch(`${BASE_URL}${ep.url}`, {
      method: ep.method,
      headers: { 'Content-Type': 'application/json' },
      body: ep.body ? JSON.stringify(ep.body) : undefined
    });
    assert(res.status === 401, `Unauthenticated ${ep.method} ${ep.url} returned 401`);
  }

  // ── TEST 13: IDOR protection (cannot access/modify another user's data) ──
  console.log('\n[STEP 13] Verifying IDOR spoofing prevention (403 Forbidden)...');
  const spoofActivityRes = await safeFetch(`${BASE_URL}/api/users/record-activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ username: 'DemoExplorer' }) // Spoof another user
  });
  assert(spoofActivityRes.status === 403, `Spoofed activity record rejected with 403 Forbidden (got ${spoofActivityRes.status})`);

  const spoofBadgeRes = await safeFetch(`${BASE_URL}/api/users/award-badge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ username: 'DemoExplorer', badgeId: 'hacked_badge', badgeName: 'Hacked' })
  });
  assert(spoofBadgeRes.status === 403, `Spoofed badge award rejected with 403 Forbidden (got ${spoofBadgeRes.status})`);

  // ── TEST 14: Invalid and expired session handling ──
  console.log('\n[STEP 14] Verifying invalid, forged, and revoked session handling...');
  const forgedRes = await safeFetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.forged.signature' }
  });
  assert(forgedRes.status === 401, 'Forged JWT rejected with status 401');

  // Test Logout revocation
  const logoutRes = await safeFetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  });
  assert(logoutRes.status === 200, 'POST /api/auth/logout succeeded with 200');

  // Verify revoked token cannot access protected endpoint
  const postLogoutRes = await safeFetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  assert(postLogoutRes.status === 401, 'Revoked token immediately blocked on /me with status 401');

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passed}/${total} BACKEND AUTHENTICATION CHECKS PASSED!`);
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
