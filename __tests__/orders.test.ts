import fc from "fast-check";
import { submitOrder, validateCart } from "../lib/api";

const originalFetch = global.fetch;

describe("Property Tests - Physical Orders", () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should always call validateCart before submitOrder in the UI logic (simulated)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({ id: fc.string(), quantity: fc.integer({ min: 1, max: 10 }) }), { minLength: 1 }),
        async (cart) => {
          let validateCalled = false;
          let submitCalled = false;

          global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = input.toString();
            if (url.includes("/api/order/validateCart")) {
              validateCalled = true;
              return new Response(JSON.stringify({ code: 200, message: "Valid", data: { total: 1000 } }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            }
            if (url.includes("/api/order/submitOrder")) {
              if (!validateCalled) {
                throw new Error("submitOrder called before validateCart");
              }
              submitCalled = true;
              return new Response(JSON.stringify({ code: 200, message: "Success" }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            }
            return new Response();
          };

          // Simulate UI flow
          const payload = { products: cart };
          await validateCart(payload, "en");
          await submitOrder(payload, "en");
          
          expect(validateCalled).toBe(true);
          expect(submitCalled).toBe(true);
        }
      )
    );
  });
});
