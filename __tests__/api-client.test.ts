import fc from 'fast-check';
import assert from 'node:assert';
import { apiRequest } from '../lib/api-client.js';

// Feature: api-integration-dashboard, Property 1: API_Client يُرفق headers على كل طلب
// Feature: api-integration-dashboard, Property 11: x-lang يتطابق مع الـ locale

async function runTests() {
  console.log("Running api-client property tests...");

  // Mock global fetch
  const originalFetch = global.fetch;
  let capturedHeaders: Headers;
  
  global.fetch = async (url, options) => {
    capturedHeaders = new Headers(options?.headers || {});
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  };

  try {
    // We must await fc.assert for async properties
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("ar", "en"),
        fc.string({ minLength: 1 }),
        async (locale, path) => {
          await apiRequest(path, { locale });
          
          assert.strictEqual(capturedHeaders.get('Accept'), 'application/json');
          assert.strictEqual(capturedHeaders.get('Content-Type'), 'application/json');
          assert.strictEqual(capturedHeaders.get('x-lang'), locale);
        }
      ),
      { numRuns: 100 }
    );
    console.log("✅ Property 1 and 11 passed: API_Client attaches headers and x-lang matches locale.");
  } catch (err) {
    console.error("❌ Property Test Failed:", err);
    process.exit(1);
  } finally {
    global.fetch = originalFetch;
  }
}

runTests();
