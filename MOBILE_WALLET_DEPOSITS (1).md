# Money Wallet Deposits — Mobile Integration Guide

**Audience:** Mobile app developer (iOS / Android / Flutter)
**Backend version:** Geidea Pay-By-Link deposit flow, 2026-05-14
**Status:** Ready for integration

---

## 1. What this feature does

Lets an authenticated user top up their **Money Wallet** (the fiat balance used to buy gold/silver) by paying through **Geidea Pay-By-Link**.

The flow is:

1. App calls the backend → backend returns a **payment URL**.
2. App opens that URL in an in-app browser / WebView / external browser.
3. User pays on Geidea's hosted page.
4. Geidea calls our backend server-to-server (**webhook = source of truth**) and credits the wallet.
5. App polls the deposit status (or waits for the user to come back to the return URL) and shows success.

> **Important:** The wallet is **never** credited by the app, by a redirect, or by any client-side success page. Only the Geidea webhook reaching our server can credit. If the user closes the browser at the wrong moment, we still credit them once the webhook arrives.

---

## 2. Wallet model (so the app shows the right thing)

The user has three wallets:

| Wallet | Purpose | Server column |
|---|---|---|
| **Money Wallet** | Fiat balance (EGP/USD). Deposits from Geidea land here. | `users.deposit_wallet` |
| **Gold Wallet** | Gold balance (grams). Affected only by buy/sell-gold operations. | `users.interest_wallet` |
| **Silver Wallet** | Silver balance (grams). Affected only by buy/sell-silver operations. | `users.silver_wallet` |

A Geidea deposit **only** increases the Money Wallet. It does **not** auto-buy gold or silver.

---

## 3. Authentication

All deposit endpoints sit behind Laravel **Passport** (`auth.api` middleware) — i.e. the same bearer-token auth the app already uses for `/api/user/profile`, `/api/user/wallet`, etc.

```
Authorization: Bearer <user-passport-token>
Accept: application/json
Content-Type: application/json
```

If the token is missing/expired the backend redirects to `api.unauthenticate`. Handle this the same way you already do for other authenticated calls.

---

## 4. The three new endpoints

Base URL: `https://golden-circle.net/api/user/wallet` (replace host for staging).

### 4.1 Create a deposit — `POST /deposits`

Creates a pending deposit row and returns a payment URL the user must visit.

**Request**
```http
POST /api/user/wallet/deposits
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "currency": "EGP"
}
```

| Field | Type | Rules |
|---|---|---|
| `amount` | number | Required. Min/max are server-controlled (currently 50 – 100 000). |
| `currency` | string | Required. Must be one of the supported currencies (currently `EGP`, `USD`). |

**Success — HTTP 201**
```json
{
  "code": 201,
  "data": {
    "deposit_id": 12345,
    "trx": "ABC123XYZ456",
    "status": "pending",
    "amount": 500,
    "currency": "EGP",
    "payment_url": "https://staging.golden-circle.net/payment/geidea/checkout?trx=ABC123XYZ456&session=4bbc93b7-bdf8-4330-b302-08deb3e8b628"
  },
  "message": "Deposit created. Complete payment to credit your wallet."
}
```

> ⚠️ **Important — the `payment_url` belongs to our server (`golden-circle.net`), not Geidea.**
> The backend hosts a small page that loads Geidea's official JavaScript SDK and opens their secure payment overlay. The URL is **safe** (same origin as the API), but the page **requires JavaScript and iframes to work**. See the WebView requirements below.

**What the app should do with the response:**

- Save `deposit_id` and `trx` (you'll need them to poll status).
- Open `payment_url` in a **WebView / in-app browser** that has:
  - ✅ **JavaScript enabled** (mandatory — the page loads Geidea's SDK)
  - ✅ **Third-party cookies allowed** (Geidea's overlay needs them for 3D-Secure)
  - ✅ **iframe support** (the Geidea checkout renders inside an iframe over our page)
- Recommended components:
  - **iOS:** `WKWebView` with `javaScriptEnabled = true` (NOT `SFSafariViewController` — it's too restrictive)
  - **Android:** `WebView` with `webSettings.setJavaScriptEnabled(true)` and `setDomStorageEnabled(true)`
  - **Flutter:** `flutter_inappwebview` (NOT `webview_flutter` plain — needs the more capable variant)
  - **React Native:** `react-native-webview` with `javaScriptEnabled` + `domStorageEnabled`
- Show "Waiting for payment confirmation…" overlay while the WebView is open.

**Error responses**

| HTTP | `code` | When | Action |
|---|---|---|---|
| 422 | 422 | Invalid amount / unsupported currency / amount out of min-max | Show server `message` to user; let them retry. |
| 502 | 502 | Geidea API unreachable / misbehaving | Show "Payment provider temporarily unavailable, try again." |
| 500 | 500 | Unexpected server error | Generic error, allow retry. |
| 401 | — | Token expired/missing | Re-authenticate. |

All error responses share the same envelope:
```json
{ "code": 422, "data": null, "message": "Amount must be between 50 and 100000 EGP." }
```

### 4.2 Get one deposit's status — `GET /deposits/{id}`

The app uses this to poll for the final outcome after the user finishes on Geidea.

**Request**
```http
GET /api/user/wallet/deposits/12345
Authorization: Bearer <token>
```

**Response — HTTP 200**
```json
{
  "code": 200,
  "data": {
    "id": 12345,
    "trx": "ABC123XYZ456",
    "amount": 500,
    "currency": "EGP",
    "status": "paid",
    "status_code": 1,
    "payment_url": "https://staging.golden-circle.net/payment/geidea/checkout?trx=ABC123XYZ456&session=4bbc93b7-...",
    "paid_at": "2026-05-14T14:23:11+00:00",
    "created_at": "2026-05-14T14:21:02+00:00"
  },
  "message": "ok"
}
```

| HTTP | When |
|---|---|
| 200 | Deposit exists and belongs to the caller — see status table below. |
| 404 | Deposit doesn't exist OR belongs to a different user. |

### 4.3 List deposit history — `GET /deposits`

Paginated. Use for a "Deposit history" screen.

**Request**
```http
GET /api/user/wallet/deposits?per_page=20
Authorization: Bearer <token>
```

Query params:
- `per_page` (optional, 1–100, default 20)
- `page` (Laravel pagination default)

**Response — HTTP 200**
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": 12345,
        "trx": "ABC123XYZ456",
        "amount": 500,
        "currency": "EGP",
        "status": "paid",
        "status_code": 1,
        "payment_url": "...",
        "paid_at": "2026-05-14T14:23:11+00:00",
        "created_at": "2026-05-14T14:21:02+00:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 4,
      "per_page": 20,
      "total": 76
    }
  },
  "message": "ok"
}
```

---

## 5. Deposit status values

The `status` field is a human-friendly string; `status_code` is the raw integer for app-side logic. Treat the string as authoritative for display.

| `status` | `status_code` | Meaning | What to show |
|---|---|---|---|
| `pending` | 0 | Link issued, waiting for user to pay (or for webhook to arrive). | Spinner: "Waiting for payment confirmation…" |
| `paid` | 1 | Wallet credited. **Money Wallet balance is already updated server-side.** | Success screen + refresh the wallet balance. |
| `pending_review` | 2 | Not used by Geidea (reserved for legacy manual deposits). | Generic "pending" state. |
| `failed` | 3 | Payment failed (declined / error). | Failure screen, allow retry. |
| `cancelled` | 3 | User cancelled on Geidea. | "Payment cancelled — try again?" |
| `expired` | 3 | Payment link expired before user paid. | "Link expired — please start a new deposit." |
| `unknown` | — | Should not happen; defensive default. | Generic error. |

> When status flips to `paid`, immediately re-fetch `GET /api/user/wallet` so the displayed Money Wallet balance is fresh.

---

## 6. Recommended polling strategy

The webhook usually arrives within a few seconds of the user finishing payment, but **it can be delayed up to ~60 seconds** in the worst case. Don't assume "user closed Geidea = payment done."

**Polling rules:**

1. Start polling `GET /deposits/{id}` the moment the user returns to the app (or every time the app comes to foreground while a pending deposit exists).
2. Use **exponential backoff** with a ceiling — e.g. 2 s, 4 s, 8 s, 16 s, 30 s, 30 s…
3. **Stop polling** as soon as `status` is anything other than `pending`.
4. After ~3 minutes with no change, stop polling and show "Still pending — check your deposit history later." The deposit will eventually flip to `paid` or `failed` server-side regardless.
5. Re-resume polling automatically when the user returns to the deposit screen.

Pseudo-code:

```dart
Future<void> waitForFinalStatus(int depositId) async {
  final delays = [2, 4, 8, 16, 30, 30, 30, 30, 30, 30]; // seconds
  for (final delay in delays) {
    await Future.delayed(Duration(seconds: delay));
    final res = await api.getDeposit(depositId);
    if (res.status != 'pending') {
      onFinalStatus(res);
      return;
    }
  }
  onTimeout();
}
```

---

## 7. End-to-end happy path (sequence)

```
App                Backend                       Geidea
 │                   │                             │
 │ POST /deposits    │                             │
 │ {amount, currency}│                             │
 │──────────────────▶│  createSession()            │
 │                   │────────────────────────────▶│
 │                   │◀──── session.id ────────────│
 │◀──201, payment_url (golden-circle.net/…)        │
 │                                                 │
 │ open payment_url in WebView                     │
 │   │                                             │
 │   ▼                                             │
 │ ┌───────────────────────────────┐               │
 │ │ Our /payment/geidea/checkout  │               │
 │ │   loads geideaCheckout.min.js │               │
 │ │   opens overlay   ──────────────────────────▶ │
 │ └───────────────────────────────┘  (user pays)  │
 │                   │                             │
 │                   │◀──── webhook ───────────────│  ⚡ wallet credited
 │                   │  (atomic, locked, idempotent)
 │                                                 │
 │ Geidea SDK redirects WebView to returnUrl ──────│
 │ App detects returnUrl navigation, closes WebView
 │                                                 │
 │ GET /deposits/{id}│                             │
 │──────────────────▶│                             │
 │◀── status:paid ───│                             │
 │ refresh wallet                                  │
 │ show success                                    │
```

---

## 7b. Detecting "user finished payment" in the WebView

After payment (success / failure / cancel), the Geidea SDK navigates the WebView to:

```
https://staging.golden-circle.net/ipn/geidea/return?merchantReferenceId=<trx>&status=<success|failed|cancelled>
```

The app **must intercept this navigation** to close the WebView and switch to polling — otherwise the WebView stays open on an empty backend response page.

| Platform | API to use |
|---|---|
| iOS `WKWebView` | `WKNavigationDelegate.decidePolicyFor:navigationAction` — match URL starts with `<return URL host>/ipn/geidea/return` |
| Android `WebView` | `WebViewClient.shouldOverrideUrlLoading()` — same URL check |
| Flutter `flutter_inappwebview` | `shouldOverrideUrlLoading` callback |
| React Native `react-native-webview` | `onShouldStartLoadWithRequest` prop |

Pseudo-code (concept, language-neutral):

```
onWebViewNavigate(url) {
    if (url.startsWith('https://staging.golden-circle.net/ipn/geidea/return')) {
        // Don't let the WebView actually load this — close it.
        closeWebView();
        // The query string has merchantReferenceId + status
        final params = parseQuery(url);
        // Start polling for the final status (don't trust the status param —
        // the server webhook is the source of truth).
        startPolling(depositId);
        return false;  // cancel navigation
    }
    return true;  // allow other URLs
}
```

> ⚠️ **Don't trust the `status` query param in the return URL.** Geidea adds it client-side and a clever user could fake it. Always poll `GET /deposits/{id}` afterward — the server-side webhook is the only source of truth for whether the wallet was actually credited.

---

## 8. Edge cases the app must handle

| Scenario | What the app should do |
|---|---|
| User kills the app mid-payment | When app reopens, list any pending deposits (`GET /deposits?status=pending` filter is **not** implemented; just look at the latest items) and poll their status. |
| User pays but closes the browser before redirect | Webhook still arrives. Polling `GET /deposits/{id}` will show `paid`. |
| Network down right after `POST /deposits` returns | Save `deposit_id` locally. Next time online, poll it. Never call `POST /deposits` a second time for the same intent — it would create a duplicate row (different `trx`). |
| User tries to deposit while a previous deposit is still `pending` | Allowed. Each `POST /deposits` creates a new independent deposit. |
| User submits 0 or a negative amount | 422 response with `Amount must be between …`. |
| User submits an unsupported currency | 422 response. |
| Geidea declines the card | Webhook arrives, status becomes `failed`. App shows failure screen. |
| Payment link expires | Status becomes `expired` after Geidea fires the timeout webhook (or remains `pending` until reconciliation). Treat as failed for UX. |
| Amount tampered with mid-flight | Backend rejects internally, status becomes `failed` with admin alert. App just sees `failed`. |

---

## 9. Headers, locale, push notifications

- **Locale** — backend uses the standard `Accept-Language` header for localized notification text. No new headers required.
- **Push notifications** — once the wallet credit completes the backend triggers `notify(user, 'DEPOSIT_COMPLETE', …)` which goes through the existing `UserNotification` channel. The app's existing notification listener will pick this up; no new keys required on the app side beyond rendering the deposit info.
- **Currency formatting** — `amount` is a plain number in major units (not minor units / cents). Format with two decimals for display.

---

## 10. Testing on staging

1. Get a Passport bearer token via the existing `/api/login` flow.
2. `POST /api/user/wallet/deposits` with `{ "amount": 100, "currency": "EGP" }`.
3. Open the returned `payment_url` — Geidea sandbox accepts test card numbers documented at https://docs.geidea.net/.
4. Poll `GET /api/user/wallet/deposits/{id}` until status flips.
5. Verify Money Wallet balance via your existing `GET /api/user/wallet` endpoint increased by exactly the deposit amount.
6. Open `GET /api/user/wallet/deposits` — the new deposit should be at the top.

**Test cases to cover before release:**

- ✅ Happy path (paid)
- ✅ Cancel on Geidea (cancelled)
- ✅ Declined card (failed)
- ✅ Close browser without paying, return later → still `pending`, polling eventually times out
- ✅ Backgrounded app during payment → polling resumes on foreground
- ✅ Same user, two deposits in parallel
- ✅ Token-expired mid-flow → re-auth, deposit history still visible
- ✅ Airplane mode after `POST /deposits` → pending deposit remembered locally, status fetched once online

---

## 11. What the backend does NOT do (so don't expect it)

- Does **not** push the payment URL to the app via WebSocket / FCM. The app **must** open the URL it gets in the `POST /deposits` response.
- Does **not** auto-redirect the app after payment. The return URL is server-side cosmetic only.
- Does **not** credit gold or silver wallets from a deposit. Buying gold/silver is a separate API.
- Does **not** support partial captures, refunds, or recurring payments in this iteration.

---

## 12. Quick reference card

```
POST   /api/user/wallet/deposits              create + get payment_url
GET    /api/user/wallet/deposits              list (paginated)
GET    /api/user/wallet/deposits/{id}         single deposit status

Auth:    Bearer <Passport token>
Statuses: pending | paid | failed | cancelled | expired | pending_review | unknown
Polling: exponential backoff 2-30s, stop on non-pending, cap at ~3 min
Source of truth: server webhook from Geidea, never the browser redirect
```

---

## 13. Questions / contacts

- Backend questions, bugs, env keys → backend team channel.
- Geidea sandbox credentials, test cards → ops / payments team.
- For any "the wallet shows the wrong balance" report, capture the `deposit_id`, `trx`, and timestamp — backend can replay from `payment_webhook_logs` for forensics.
