const jwt = require('jsonwebtoken');

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'algoverse_super_secret_jwt_key_2026';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  }
}

async function runSecurityAudit() {
  console.log('====================================================');
  console.log('🛡️  CODE NOVA FULL-STACK SECURITY & AUTH AUDIT SUITE');
  console.log('====================================================\n');

  // ────────────────────────────────────────────────────────────────
  // SECTION 1: Unauthenticated Requests to Protected Endpoints (401)
  // ────────────────────────────────────────────────────────────────
  console.log('[SECTION 1] Verifying Protected Endpoints Reject Unauthenticated Requests (401)...');

  const protectedEndpoints = [
    { method: 'POST', path: '/api/sandbox/execute', body: { code: 'console.log("x")', language: 'javascript' } },
    { method: 'POST', path: '/api/sandbox/visualize', body: { code: 'let a = 1;', language: 'javascript' } },
    { method: 'POST', path: '/api/ai/hint', body: { questionText: 'Reverse a tree' } },
    { method: 'GET',  path: '/api/levels/ds/1' },
    { method: 'POST', path: '/api/competitions/create', body: { title: 'Test Comp' } },
    { method: 'POST', path: '/api/competitions/660000000000000000000001/enroll', body: {} },
    { method: 'POST', path: '/api/competitions/660000000000000000000001/submit-score', body: { score: 100 } },
    { method: 'GET',  path: '/api/progress' },
    { method: 'POST', path: '/api/progress/update', body: { score: 10 } },
    { method: 'POST', path: '/api/users/record-activity', body: {} },
    { method: 'POST', path: '/api/users/award-badge', body: { badgeId: 'test', badgeName: 'Test' } },
    { method: 'POST', path: '/api/users/notify', body: { title: 'T', message: 'M' } },
    { method: 'GET',  path: '/api/auth/me' },
    { method: 'POST', path: '/api/auth/logout', body: {} }
  ];

  for (const ep of protectedEndpoints) {
    const res = await fetch(`${BASE_URL}${ep.path}`, {
      method: ep.method,
      headers: { 'Content-Type': 'application/json' },
      body: ep.body ? JSON.stringify(ep.body) : undefined
    });
    assert(res.status === 401, `${ep.method} ${ep.path} unauthenticated returned ${res.status} (expected 401)`);
  }

  // ────────────────────────────────────────────────────────────────
  // SECTION 2: Genuinely Public Endpoints Remain Accessible (200)
  // ────────────────────────────────────────────────────────────────
  console.log('\n[SECTION 2] Verifying Genuinely Public Endpoints Are Unrestricted...');

  const publicEndpoints = [
    { path: '/api/levels/meta/subjects', name: 'Subject Metadata' },
    { path: '/api/dashboard/leaderboard', name: 'Public Global Leaderboard' },
    { path: '/api/dashboard/competitions', name: 'Public Competitions Listing' },
    { path: '/', name: 'Health Check Root' }
  ];

  for (const ep of publicEndpoints) {
    const res = await fetch(`${BASE_URL}${ep.path}`);
    assert(res.status === 200, `Public endpoint GET ${ep.path} (${ep.name}) returned 200`);
  }

  // ────────────────────────────────────────────────────────────────
  // SECTION 3: Token Validation, Signature & Algorithm Confusion
  // ────────────────────────────────────────────────────────────────
  console.log('\n[SECTION 3] Verifying Token Forgery & Algorithm Security...');

  // 3.1 Tampered signature
  const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZvcmdlZCJ9.invalidsignature123';
  const resForged = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${forgedToken}` }
  });
  assert(resForged.status === 401, `Forged JWT signature rejected with status ${resForged.status}`);

  // 3.2 'none' algorithm bypass attempt
  const noneAlgToken = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpZCI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbiJ9.';
  const resNoneAlg = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${noneAlgToken}` }
  });
  assert(resNoneAlg.status === 401, `'none' algorithm attack rejected with status ${resNoneAlg.status}`);

  // 3.3 Expired token
  const expiredToken = jwt.sign({ id: 'expired_user', username: 'expired' }, JWT_SECRET, { expiresIn: '-10s' });
  const resExpired = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${expiredToken}` }
  });
  assert(resExpired.status === 401, `Expired JWT rejected with status ${resExpired.status}`);

  // ────────────────────────────────────────────────────────────────
  // SECTION 4: Legitimate Authentication & Authorized Execution
  // ────────────────────────────────────────────────────────────────
  console.log('\n[SECTION 4] Testing Legitimate Authentication & Feature Execution...');

  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@codenova.dev', password: 'password123' })
  });
  assert(loginRes.status === 200, `Demo login succeeded with status 200`);
  const loginData = await loginRes.json();
  const validToken = loginData.token;
  assert(Boolean(validToken), `Valid JWT token issued on login`);

  // Verify GET /me returns verified user profile
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${validToken}` }
  });
  assert(meRes.status === 200, `GET /api/auth/me with valid token returned 200`);
  const meData = await meRes.json();
  assert(meData.email === 'demo@codenova.dev', `User profile correctly matched authenticated identity`);

  // Verify authenticated code execution in Sandbox
  const execRes = await fetch(`${BASE_URL}/api/sandbox/execute`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ code: 'console.log("authorized execution confirmed!");', language: 'javascript' })
  });
  assert(execRes.status === 200, `POST /api/sandbox/execute with valid token returned 200`);

  // Verify authenticated code visualization / analysis
  const visRes = await fetch(`${BASE_URL}/api/sandbox/visualize`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ code: 'let x = 10;\nfor (let i = 0; i < x; i++) console.log(i);', language: 'javascript' })
  });
  assert(visRes.status === 200, `POST /api/sandbox/visualize with valid token returned 200`);
  const visData = await visRes.json();
  assert(Boolean(visData.analysis?.timeComplexity), `AI/static analysis breakdown returned`);

  // Verify authenticated quiz question retrieval
  const levelRes = await fetch(`${BASE_URL}/api/levels/ds/1`, {
    headers: { Authorization: `Bearer ${validToken}` }
  });
  assert(levelRes.status === 200, `GET /api/levels/ds/1 with valid token returned 200`);
  const levelQuestions = await levelRes.json();
  assert(Array.isArray(levelQuestions) && levelQuestions.length > 0, `Quiz level questions returned`);

  // Verify authenticated progress update
  const progRes = await fetch(`${BASE_URL}/api/progress/update`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ score: 25, town2Unlocked: true })
  });
  assert(progRes.status === 200, `POST /api/progress/update with valid token returned 200`);

  // ────────────────────────────────────────────────────────────────
  // SECTION 5: IDOR & Data Ownership Enforcement
  // ────────────────────────────────────────────────────────────────
  console.log('\n[SECTION 5] Testing IDOR & Ownership Enforcement...');

  // User 'demo' attempts to award a badge under another username ('admin_victim')
  const idorBadgeRes = await fetch(`${BASE_URL}/api/users/award-badge`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ username: 'admin_victim', badgeId: 'hacked_badge', badgeName: 'Hacked' })
  });
  assert(idorBadgeRes.status === 403, `IDOR badge award attempt on another user blocked with 403 Forbidden`);

  // User 'demo' attempts to log activity for another user
  const idorActivityRes = await fetch(`${BASE_URL}/api/users/record-activity`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ username: 'someone_else' })
  });
  assert(idorActivityRes.status === 403, `IDOR activity log attempt on another user blocked with 403 Forbidden`);

  // User 'demo' attempts to submit competition score as another user
  const idorScoreRes = await fetch(`${BASE_URL}/api/competitions/660000000000000000000001/submit-score`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ username: 'victim_user', score: 9999 })
  });
  // Should reject with 403 (or 404 if competition doesn't exist, but NOT allow spoofing username)
  assert(idorScoreRes.status === 403 || idorScoreRes.status === 404, `IDOR competition score spoofing handled safely with status ${idorScoreRes.status}`);

  // ────────────────────────────────────────────────────────────────
  // SECTION 6: Input Validation & DoS Protection
  // ────────────────────────────────────────────────────────────────
  console.log('\n[SECTION 6] Testing Input Validation & Request Constraints...');

  // 6.1 Empty code payload
  const emptyCodeRes = await fetch(`${BASE_URL}/api/sandbox/execute`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ code: '   ', language: 'javascript' })
  });
  assert(emptyCodeRes.status === 400, `Empty code submission rejected with 400 Bad Request`);

  // 6.2 Oversized code payload (>50KB)
  const hugeCode = 'console.log("x");\n'.repeat(3000); // ~54 KB
  const hugeCodeRes = await fetch(`${BASE_URL}/api/sandbox/execute`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ code: hugeCode, language: 'javascript' })
  });
  assert(hugeCodeRes.status === 400, `Oversized code (>50KB) rejected with 400 Bad Request`);

  // 6.3 Unsupported execution language
  const badLangRes = await fetch(`${BASE_URL}/api/sandbox/execute`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ code: 'echo hello', language: 'bash_exploit' })
  });
  assert(badLangRes.status === 400, `Unsupported language rejected with 400 Bad Request`);

  // 6.4 Malformed progress update types
  const badScoreRes = await fetch(`${BASE_URL}/api/progress/update`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ score: 'not_a_number' })
  });
  assert(badScoreRes.status === 400, `Invalid progress score type rejected with 400 Bad Request`);

  // ────────────────────────────────────────────────────────────────
  // SECTION 7: Session Invalidation / Logout
  // ────────────────────────────────────────────────────────────────
  console.log('\n[SECTION 7] Testing Server-Side Session Invalidation (Logout)...');

  // Issue logout request to revoke current token
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    }
  });
  assert(logoutRes.status === 200, `POST /api/auth/logout succeeded with status 200`);

  // Attempt using the revoked token on GET /me
  const revokedMeRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${validToken}` }
  });
  assert(revokedMeRes.status === 401, `Revoked token blocked on GET /api/auth/me with status ${revokedMeRes.status}`);

  // Attempt using the revoked token on POST /api/sandbox/execute
  const revokedExecRes = await fetch(`${BASE_URL}/api/sandbox/execute`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validToken}` 
    },
    body: JSON.stringify({ code: 'console.log("should be blocked");', language: 'javascript' })
  });
  assert(revokedExecRes.status === 401, `Revoked token blocked on POST /api/sandbox/execute with status ${revokedExecRes.status}`);

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} SECURITY AUDIT CHECKS PASSED SUCCESSFULLY!`);
  console.log('====================================================\n');
}

runSecurityAudit().catch(err => {
  console.error('\n❌ AUDIT FAILED:', err.message);
  process.exit(1);
});
