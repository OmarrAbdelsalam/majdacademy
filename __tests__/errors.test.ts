import fc from "fast-check";
import { login } from "../lib/api";

const originalFetch = global.fetch;

describe("Property Tests - 422 Errors", () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should extract error message from 422 response", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 5 }), // email
        fc.string({ minLength: 5 }), // password
        fc.string({ minLength: 5 }), // error message
        async (email, password, errorMessage) => {
          // Mock fetch to return 422 with message
          global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            return new Response(JSON.stringify({
              code: 422,
              message: errorMessage
            }), {
              status: 422,
              headers: { "Content-Type": "application/json" }
            });
          };

          const res = await login(email, password, "en");
          
          // Verify response
          if ("success" in res && res.success === false) {
            expect(res.message).toBe(errorMessage);
          } else {
            throw new Error("Response should be an ApiError");
          }
        }
      )
    );
  });
});
