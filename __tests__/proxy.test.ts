import fc from 'fast-check';
import assert from 'node:assert';
import { proxy } from '../proxy.js';
import { NextRequest } from 'next/server.js';

// Feature: api-integration-dashboard, Property 3: Auth guard يحمي كل مسارات الداشبورد

async function runTests() {
  console.log("Running proxy property tests...");

  try {
    fc.assert(
      fc.property(
        fc.constantFrom("ar", "en"),
        fc.constantFrom("wallet", "transactions", "notifications", "profile"),
        (locale, dashboardRoute) => {
          const url = `http://localhost:3000/${locale}/dashboard/${dashboardRoute}`;
          
          // Test WITHOUT token
          const reqWithoutToken = new NextRequest(url);
          const resWithout = proxy(reqWithoutToken);
          
          assert.strictEqual(resWithout?.status, 307);
          assert.strictEqual(resWithout?.headers.get('location'), `http://localhost:3000/${locale}/login`);
          
          // Test WITH token
          const reqWithToken = new NextRequest(url);
          reqWithToken.cookies.set('gct_token', 'mock_token');
          const resWith = proxy(reqWithToken);
          
          // Assuming NextResponse.next() doesn't return a 307 redirect
          assert.notStrictEqual(resWith?.status, 307);
        }
      ),
      { numRuns: 100 }
    );
    console.log("✅ Property 3 passed: Auth guard protects dashboard routes.");
  } catch (err) {
    console.error("❌ Property Test Failed:", err);
    process.exit(1);
  }
}

runTests();
