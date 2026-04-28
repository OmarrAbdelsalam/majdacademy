import fc from "fast-check";
import { login } from "../lib/api";

// Mocking fetch for property tests
const originalFetch = global.fetch;

describe("Property Tests - Login API", () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should handle valid token round-trip correctly", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 5 }), // email
        fc.string({ minLength: 5 }), // password
        fc.string({ minLength: 10 }), // mocked token
        async (email, password, token) => {
          // Mock fetch to return success with token
          global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            return new Response(JSON.stringify({
              code: 200,
              message: "Success",
              data: { user: { id: 1 }, token: token }
            }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          };

          const res = await login(email, password, "en");
          
          // Verify response
          if ("data" in res && res.data) {
            expect(res.data.token).toBe(token);
          } else {
            throw new Error("Response should have data");
          }
        }
      )
    );
  });
});
