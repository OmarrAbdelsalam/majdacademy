import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://golden-circle.net";

/**
 * Server Component — Geidea IPN return handler.
 *
 * Geidea redirects the user here after payment with query params like:
 *   ?provider_status=success&response_code=000&trx=...&deposit_id=...
 *   or (legacy):
 *   ?orderId=...&responseCode=000&merchantReferenceId=...&status=success
 *
 * We NEVER trust the client-supplied status. Instead we:
 *   1. Extract the trx reference (merchantReferenceId or orderId).
 *   2. Call the backend deposit-status API server-side using the user's auth token.
 *   3. Redirect to /ipn/geidea/success or /ipn/geidea/failed based on the real status.
 *
 * If we can't verify (no token, no trx, backend error) we fall back to
 * reading responseCode=000 as a soft success hint, but still redirect to
 * the appropriate page — the deposit page itself polls for the real status.
 */
export default async function GeideaReturnPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  // Geidea new return URL fields (provider_status, response_code, trx, deposit_id) + legacy fallbacks
  const trx = params.trx || params.merchantReferenceId || params.orderId || "";
  const depositId = params.deposit_id || "";
  const responseCode = params.response_code || params.responseCode || "";
  const rawStatus = (params.provider_status || params.status || "").toLowerCase();

  // Try to verify server-side using the user's auth token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("gct_token")?.value;

  if (token && trx) {
    try {
      // Look up the deposit by trx reference
      const res = await fetch(
        `${BACKEND}/api/user/wallet/deposits?trx=${encodeURIComponent(trx)}&per_page=5`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
          },
          // No caching — we need the live status
          cache: "no-store",
        }
      );

      if (res.ok) {
        const json = await res.json();
        const items: Array<{ trx: string; status: string; id: number }> =
          json?.data?.items ?? [];
        const deposit = items.find((d) => d.trx === trx);

        if (deposit) {
          const status = deposit.status;
          if (status === "paid") {
            redirect(`/ipn/geidea/success?ref=${encodeURIComponent(trx)}`);
          } else if (status === "cancelled") {
            redirect(`/ipn/geidea/failed?reason=cancelled&ref=${encodeURIComponent(trx)}`);
          } else if (status === "failed" || status === "expired") {
            redirect(`/ipn/geidea/failed?reason=${status}&ref=${encodeURIComponent(trx)}`);
          }
          // status === "pending" — webhook hasn't arrived yet, fall through to soft hint
        }
      }
    } catch {
      // Network error — fall through to soft hint below
    }
  }

  // Fallback: use Geidea's responseCode / status as a soft hint.
  // The destination pages will show the appropriate UI and the deposit
  // page's polling loop will confirm the real outcome.
  const isSuccess =
    responseCode === "000" || rawStatus === "success";
  const isCancelled = rawStatus === "cancelled";

  if (isSuccess) {
    redirect(`/ipn/geidea/success?ref=${encodeURIComponent(trx)}&unverified=1`);
  } else if (isCancelled) {
    redirect(`/ipn/geidea/failed?reason=cancelled&ref=${encodeURIComponent(trx)}&unverified=1`);
  } else {
    redirect(`/ipn/geidea/failed?reason=failed&ref=${encodeURIComponent(trx)}&unverified=1`);
  }
}
