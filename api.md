# Golden Circle — Mobile/Web API Documentation

> **Audience:** Frontend / Mobile developer integrating with the Golden Circle backend.
> **Source of truth:** `routes/api.php` and `app/Http/Controllers/Api/*` in this repository.
> **Last regenerated from code:** see git history of this file.

---

## 1. Conventions

### Base URL

```
{APP_URL}/api
```

Replace `{APP_URL}` with the deployed URL (e.g. `https://goldencircle.net`).

### Headers

All requests should include:

| Header           | Required | Description                                                  |
|------------------|----------|--------------------------------------------------------------|
| `Accept`         | yes      | `application/json`                                           |
| `Content-Type`   | yes      | `application/json` (or `multipart/form-data` for uploads)    |
| `Authorization`  | sometimes| `Bearer {access_token}` for authenticated endpoints          |
| `x-lang`         | optional | `en` (default) or `ar` — switches localised content          |
| `x-device`       | optional | `android` / `ios` — used for token registration & analytics  |
| `X-App-Version`  | optional | Semver string of the mobile build (`1.4.2`)                  |
| `X-Platform`     | optional | `android` / `ios` / `both` (used by version-check endpoints) |

### Authentication

This API uses **Laravel Passport** (OAuth2 access tokens).

- A user obtains a token from `POST /api/login`, `POST /api/verify-otp`, or `POST /api/register` → confirm flow.
- The token is returned in `data.access_token` with `data.token_type = "Bearer"`.
- Send it on subsequent requests as `Authorization: Bearer {token}`.
- Endpoints inside `/api/user/*` (auth.api middleware) and most of `/api/order/*` (client middleware) require this header.

### Standard response envelope

All responses follow this shape:

```json
{
  "code":    200,
  "data":    { ... } | [ ... ] | null,
  "message": "Human-readable message"
}
```

| HTTP status | `code`   | Meaning                                                           |
|-------------|----------|-------------------------------------------------------------------|
| 200         | 200      | Success                                                           |
| 200         | 401      | Token invalid for this action (rare — most use 401 HTTP)         |
| 401         | 401      | Unauthenticated — no/expired token                                |
| 404         | 404      | Resource not found                                                |
| 422         | 422      | Validation error (`message` is the first error string)            |
| 500         | 500      | Server error                                                      |

### Validation errors

When validation fails, the API returns **HTTP 422** and `message` contains the first failed rule's error text.
There is no `errors` object — rely on `message`.

---

## 2. Public Endpoints (no auth)

### `POST /api/submit-token`
**Controller:** `NotificationController@submitToken`
**Description:** Registers a device for push notifications. Call once on app launch (and again whenever the FCM token rotates). Works for both guests and logged-in users — when called by an authenticated user, the token is associated with that user.

**Request body:**

| Field          | Type   | Required | Description                                  |
|----------------|--------|----------|----------------------------------------------|
| `device_token` | string | yes      | FCM/APNs token from the device.              |
| `device_id`    | string | yes      | Stable device identifier (used for upsert).  |

**Response:**
```json
{
  "code": 200,
  "data": { "enable_otp_login": 1 },
  "message": "Token Submitted"
}
```

---

### `GET /api/general-setting`
**Controller:** `BasicController@generalSetting`
**Description:** Returns site-wide settings (currency symbol, sign-up bonus flag, branding colours, support contact, etc.) needed to bootstrap the app.

**No request fields.**

---

### `GET /api/unauthenticate`
**Controller:** `BasicController@unauthenticate`
**Description:** Endpoint Laravel auth redirects to when a token is missing/invalid. Returns a 401-shaped JSON response.

---

### `GET /api/languages`
**Controller:** `BasicController@languages`
**Description:** Lists languages enabled on the site (code, name, flag, RTL flag).

---

### `GET /api/language-data/{code}`
**Controller:** `BasicController@languageData`
**Description:** Returns the translation key/value JSON for the given language code (e.g. `en`, `ar`).

| Param  | Type   | Required | Description                            |
|--------|--------|----------|----------------------------------------|
| `code` | string | yes      | Language code in the URL (e.g. `ar`).  |

---

### `GET /api/branches`
**Controller:** `BasicController@branches`
**Description:** Lists all active physical branches (id, name, address, working hours, contact). Used in the order/pickup flow.

---

### `GET /api/home`
**Controller:** `HomeController@index`
**Description:** Home-screen payload: featured products, sliders, news highlights, current gold/silver prices, banners.

---

### `GET /api/product/{id}`
**Controller:** `HomeController@getProduct`
**Description:** Single product detail, including live calculated price for current gold price.

| Param | Type    | Required | Description     |
|-------|---------|----------|-----------------|
| `id`  | integer | yes      | Product ID.     |

---

### `GET /api/products/{type?}`
**Controller:** `HomeController@getProducts`
**Description:** Listing of products. `{type}` is optional and may be `all`, `featured`, etc.

| Field        | Type   | Required | Description                                            |
|--------------|--------|----------|--------------------------------------------------------|
| `type`       | string | optional | URL segment: `all`, `featured` …                       |
| `metal_type` | string | optional | Query string: `gold` (default) or `silver`             |

---

### `GET /api/products-live`
**Controller:** `HomeController@getProductsWithLivePrices`
**Description:** Same as `/api/products` but with live recalculated prices using the latest gold/silver rates. Use for the "watch" / live screen.

---

### `GET /api/current-prices`
**Controller:** `HomeController@getCurrentPrices`
**Description:** Live gold/silver buy + sell prices and timestamp. Lightweight endpoint suitable for short-interval polling.

---

### `GET /api/pages/{type?}`
**Controller:** `HomeController@getPage`
**Description:** Returns the rendered content of a static page (e.g. `terms`, `privacy`, `about`).

| Param  | Type   | Required | Description                                |
|--------|--------|----------|--------------------------------------------|
| `type` | string | optional | Page key. If omitted returns a default.    |

---

### `GET /api/contact-us`
**Controller:** `HomeController@contactUs`
**Description:** Returns contact-form metadata (FAQ items, contact info shown on the screen).

---

### `POST /api/contact-us`
**Controller:** `HomeController@sendContactUs`
**Description:** Submits a contact-us message. If the user is logged in, their ID is attached.

**Request body:**

| Field         | Type   | Required | Description                                              |
|---------------|--------|----------|----------------------------------------------------------|
| `name`        | string | yes      | Sender name. Max 191.                                    |
| `email`       | string | yes      | Sender email. Max 191.                                   |
| `subject`     | string | yes      | Max 100.                                                 |
| `message`     | string | yes      | Body of the message.                                     |
| `attachments` | file[] | optional | Image attachments (multipart). jpg/jpeg/png.             |

---

### `GET /api/news`
**Controller:** `HomeController@getNews`
**Description:** Paginated list of news posts.

---

### `GET /api/fixedNews`
**Controller:** `HomeController@getFixedNews`
**Description:** Pinned/sticky news items shown above the regular feed.

---

### `GET /api/news/{id?}`
**Controller:** `HomeController@getPost`
**Description:** Single news post (or default post when id omitted).

| Param | Type    | Required | Description     |
|-------|---------|----------|-----------------|
| `id`  | integer | optional | News post ID.   |

---

### `GET /api/systemInfo`
**Controller:** `HomeController@systemInfo`
**Description:** Mobile-app system meta — store URLs, support contacts, etc.

---

### `GET /api/paymentMethods`
**Controller:** `HomeController@paymentMethods`
**Description:** Returns active deposit gateways (auto + manual). Use to render the payment-method picker.

---

### `GET /api/states`
**Controller:** `LocationController@getStates`
**Description:** All active governorates / states.

---

### `GET /api/cities/{state_id?}`
**Controller:** `LocationController@getCities`
**Description:** Cities under a given state. If `state_id` is omitted, returns all cities.

| Param      | Type    | Required | Description                                         |
|------------|---------|----------|-----------------------------------------------------|
| `state_id` | integer | optional | Filter cities by state ID. Omit to get all cities. |

---

### `POST /api/updateTempImage`
**Controller:** `UserController@updateTempImage`
**Description:** Uploads a temporary image (national ID front/back) before final submit on registration / profile-update. Returns a filename to send back in subsequent calls.

**Multipart body:**

| Field   | Type | Required | Description                                       |
|---------|------|----------|---------------------------------------------------|
| `image` | file | yes      | jpg/jpeg/png, max 4 MB.                           |

**Response:**
```json
{
  "code": 200,
  "data": {
    "image":      "https://.../assets/images/user/ids/1700000000.jpg",
    "image_name": "1700000000.jpg"
  },
  "message": "ID image uploaded successfully"
}
```

---

## 3. Authentication

### `POST /api/register`
**Controller:** `Auth\RegisterController@register`
**Description:** Creates a new user account. The user is auto-confirmed (`confirmed = 1`, `ev = 1`, `sv = 1`); call `/api/login` afterwards to get a token.

**Request body:**

| Field         | Type    | Required | Description                                                                  |
|---------------|---------|----------|------------------------------------------------------------------------------|
| `firstname`   | string  | optional | Max 60.                                                                      |
| `lastname`    | string  | optional | Max 60.                                                                      |
| `email`       | string  | yes      | Valid email, max 160, unique.                                                |
| `mobile`      | string  | yes      | Max 30, unique.                                                              |
| `password`    | string  | yes      | Min 6.                                                                       |
| `reference`   | string  | optional | Username of the referrer.                                                    |
| `national_id_image` | string | optional | Filename returned by `/api/updateTempImage` (front).                  |
| `address`     | object  | optional | `{ address, state, zip, country, city }` — defaults to `country: "Egypt"`.   |

---

### `POST /api/login`
**Controller:** `Auth\LoginController@login`
**Description:** Authenticates with username/email/mobile + password. If `password` is omitted, an OTP is sent to the user (response includes `user_id` and prompts the OTP screen). If `password` is provided and correct, returns a Bearer token.

**Request body:**

| Field      | Type   | Required | Description                                              |
|------------|--------|----------|----------------------------------------------------------|
| `user`     | string | yes      | Username, email, or mobile.                              |
| `password` | string | optional | If provided → password login. If omitted → OTP login.    |

**Successful response (password login):**
```json
{
  "code":    200,
  "message": "Login Successful",
  "data": {
    "user":         { "id": 1, "username": "...", "email": "..." },
    "access_token": "eyJ0eXAiOi…",
    "token_type":   "Bearer"
  }
}
```

---

### `POST /api/verify-otp`
**Controller:** `Auth\LoginController@verifyOtp`
**Description:** Verifies an OTP that was sent during password-less login or as a 2FA step. Returns a Bearer token on success.

**Request body:**

| Field  | Type    | Required | Description                                  |
|--------|---------|----------|----------------------------------------------|
| `id`   | integer | yes      | User ID returned by the previous login call. |
| `code` | string  | yes      | 6-digit OTP delivered via SMS/email.         |

---

### `POST /api/password/request`
**Controller:** `Auth\ForgotPasswordController@sendResetCodeEmail`
**Description:** Sends a 6-digit reset code to the user's email/mobile. Response includes the user's `id` (used in step 3).

**Request body:**

| Field  | Type   | Required | Description                                                              |
|--------|--------|----------|--------------------------------------------------------------------------|
| `user` | string | yes      | Username, email, or mobile of the account requesting the password reset. |

---

### `POST /api/password/verify-code`
**Controller:** `Auth\ForgotPasswordController@verifyCode`
**Description:** Verifies the reset code sent by `/password/request`. Does **not** change the password — call `/password/change` afterwards.

**Request body:**

| Field   | Type   | Required | Description                                |
|---------|--------|----------|--------------------------------------------|
| `code`  | string | yes      | The 6-digit reset code.                    |
| `email` | string | yes      | Valid email of the account.                |

---

### `POST /api/password/change`
**Controller:** `Auth\ResetPasswordController@reset`
**Description:** Sets a new password after the reset code has been verified.

**Request body:**

| Field      | Type    | Required | Description                                       |
|------------|---------|----------|---------------------------------------------------|
| `id`       | integer | yes      | User ID returned by `/password/request`.          |
| `code`     | string  | yes      | The 6-digit reset code (same as previous step).   |
| `password` | string  | yes      | New password, min 6.                              |

---

## 4. Authenticated User Endpoints
> All endpoints in this section require `Authorization: Bearer {token}`.
> Group middleware: `auth.api` (Passport) for `/api/user/*` routes — except the small "client" group which uses Passport client credentials.

### `GET /api/user/logout`
**Controller:** `Auth\LoginController@logout`
**Description:** Revokes all of the current user's Passport tokens.

---

### `GET /api/user/authorization`
**Controller:** `AuthorizationController@authorization`
**Description:** Returns which authorization step the user must complete next (email verify / SMS verify / 2FA). Used to drive the verification screens.

---

### `GET /api/user/resend-verify`
**Controller:** `AuthorizationController@sendVerifyCode`
**Description:** Re-issues a verification code. Includes a 2-minute cooldown.

| Field  | Type   | Required | Description                              |
|--------|--------|----------|------------------------------------------|
| `type` | string | optional | `email` or `phone`. Default: `email`.    |

---

### `POST /api/user/verify-email`
**Controller:** `AuthorizationController@emailVerification`

| Field                  | Type   | Required | Description                       |
|------------------------|--------|----------|-----------------------------------|
| `email_verified_code`  | string | yes      | Code received by email.           |

---

### `POST /api/user/verify-sms`
**Controller:** `AuthorizationController@smsVerification`

| Field               | Type   | Required | Description                       |
|---------------------|--------|----------|-----------------------------------|
| `sms_verified_code` | string | yes      | Code received by SMS.             |

---

### `POST /api/user/verify-g2fa`
**Controller:** `AuthorizationController@g2faVerification`

| Field  | Type   | Required | Description                                 |
|--------|--------|----------|---------------------------------------------|
| `code` | string | yes      | 6-digit code from the authenticator app.    |

---

## 5. User Profile (client-credentials group)
> These routes use middleware `client` and accept the same Bearer token from `/api/login`.

### `GET /api/user/profile`
**Controller:** `UserController@profile`
**Description:** Returns the current user's profile object.

---

### `POST /api/user/profile`
**Controller:** `UserController@updateProfile`
**Description:** Updates the user's name + address + ID images. If the ID images change, `confirmed` is reset to 1 (re-confirmed).

**Request body:**

| Field                  | Type   | Required | Description                                                |
|------------------------|--------|----------|------------------------------------------------------------|
| `firstname`            | string | yes      | Letters/spaces/hyphens only. Max 50.                       |
| `lastname`             | string | yes      | Letters/spaces/hyphens only. Max 50.                       |
| `address`              | string | optional | Max 150.                                                   |
| `state`                | string | optional | Max 80.                                                    |
| `zip`                  | string | optional | Max 20. Letters/digits/spaces/hyphens.                     |
| `country`              | string | optional | Max 80.                                                    |
| `city`                 | string | optional | Max 80.                                                    |
| `national_id_image`    | string | optional | Filename from `/api/updateTempImage` (front).              |
| `national_id_image_bk` | string | optional | Filename from `/api/updateTempImage` (back).               |

---

### `POST /api/user/updateImage`
**Controller:** `UserController@updateImage`
**Description:** Uploads + sets the user's profile picture.

**Multipart body:**

| Field   | Type | Required | Description              |
|---------|------|----------|--------------------------|
| `image` | file | yes      | jpg/jpeg/png. Resized to 800×800. |

---

### `GET /api/user/wallet`
**Controller:** `UserController@wallet`
**Description:** Wallet snapshot — gold (grams), silver (grams), cash (EGP), portfolio value, percentage change since last reference.

**Response shape:**
```json
{
  "code": 200,
  "data": {
    "cash":      "1000.00",
    "gold":      "12.5000",
    "silver":    "0.0000",
    "portfolio": { "value": 1234567, "percentage": 1.23, "status": 1 }
  }
}
```

---

### `GET /api/user/transactions`
**Controller:** `UserController@transactions`
**Description:** Combined paginated transaction history (orders, deposits, withdraws, gold/silver moves).

**Query params:**

| Field    | Type    | Required | Description                                    |
|----------|---------|----------|------------------------------------------------|
| `page`   | integer | optional | Page number for pagination.                    |
| `type`   | string  | optional | Filter: `deposit`, `withdraw`, `gold`, `silver`, `order`. |

---

### `GET /api/user/transactions/{id}`
**Controller:** `UserController@getTransactions`
**Description:** Single transaction details by ID.

| Param | Type    | Required | Description       |
|-------|---------|----------|-------------------|
| `id`  | integer | yes      | Transaction ID.   |

---

### `GET /api/user/claimableItems`
**Controller:** `UserController@claimableItems`
**Description:** Lists items the user has bought as gold/silver weight that can be redeemed for physical product (used at the order screen as "claim my gold").

---

### `GET /api/user/notifications`
**Controller:** `NotificationController@list`
**Description:** Latest 10 user notifications (paginated via `skip`). Marks fetched ones as read.

| Field  | Type    | Required | Description                                  |
|--------|---------|----------|----------------------------------------------|
| `skip` | integer | optional | Offset for pagination. Default: 0.           |

---

### `POST /api/user/notifications`
**Controller:** `NotificationController@store`
**Description:** Creates a notification for the current user (debug/admin tooling — typically used by backend; safe to call from client).

| Field   | Type   | Required | Description           |
|---------|--------|----------|-----------------------|
| `title` | string | optional | Notification title.   |
| `body`  | string | optional | Notification body.    |

---

### `DELETE /api/user/notifications/{id}`
**Controller:** `NotificationController@delete`
**Description:** Deletes a notification by ID.

| Param | Type    | Required | Description           |
|-------|---------|----------|-----------------------|
| `id`  | integer | yes      | Notification ID.      |

---

### `GET /api/user/delete`
**Controller:** `UserController@delete`
**Description:** Deletes (or soft-deletes) the user's account. Use with confirmation screen on the client — destructive.

---

## 6. Orders & Trading
> All endpoints in this section live under `/api/order/*` with `client` middleware. Send the Bearer token from login.

### `POST /api/order/submitOrder`
**Controller:** `OrderController@submitOrder`
**Description:** Places a physical-product order. The server **ignores** any `gold_price`, `fees`, `shipping`, `sub_total`, `total` you send — all monetary values are recalculated server-side from current settings and the products' DB prices. Includes a 5-minute cooldown per user.

**Request body:**

| Field              | Type    | Required | Description                                                                                  |
|--------------------|---------|----------|----------------------------------------------------------------------------------------------|
| `products`         | array   | yes      | Non-empty list of `{ id, qty, claimed?, weight? }` items.                                    |
| `products[].id`    | integer | yes      | Product ID.                                                                                  |
| `products[].qty`   | integer | yes      | Quantity (≥ 1).                                                                              |
| `products[].claimed` | 0 or 1 | optional | If `1`, this item is being claimed against the user's gold/silver wallet (no cash charge).   |
| `products[].weight`| float   | optional | Override weight when claiming (server still validates).                                      |
| `address`          | string  | optional | Shipping address.                                                                            |
| `notes`            | string  | optional | Free-text order notes.                                                                       |
| `city`             | string  | optional | City name.                                                                                   |
| `mobile`           | string  | optional | Contact mobile number.                                                                       |
| `pickup_branch_id` | integer | optional | If set, order is for branch pickup instead of shipping.                                      |

---

### `POST /api/order/buyGold`
**Controller:** `OrderController@buyGold`
**Description:** Converts cash from the user's wallet into gold grams at the live sell price. Karat is honoured (24/21/18). Atomic with row-level locking.

**Request body:**

| Field    | Type   | Required | Description                                                  |
|----------|--------|----------|--------------------------------------------------------------|
| `weight` | number | yes      | Grams to buy. Must be > 0.                                   |
| `qty`    | int    | optional | Multiplier. Default 1.                                       |
| `karats` | int    | optional | One of `24`, `21`, `18`. Default 24.                         |

**Errors:** `Insufficient funds on your wallet` (422) when wallet < calculated total.

---

### `POST /api/order/sellGold`
**Controller:** `OrderController@sellGold`
**Description:** Converts gold grams from the user's gold wallet into cash at the live buy price.

**Request body:** same as `buyGold`.
**Errors:** `Insufficient gold balance` (422) when gold wallet < `weight × qty`.

---

### `POST /api/order/buySilver`
**Controller:** `OrderController@buySilver`
**Description:** Same as `buyGold` but for silver. No `karats` parameter.

| Field    | Type   | Required | Description           |
|----------|--------|----------|-----------------------|
| `weight` | number | yes      | Grams to buy. > 0.    |
| `qty`    | int    | optional | Multiplier. Default 1.|

---

### `POST /api/order/sellSilver`
**Controller:** `OrderController@sellSilver`
**Description:** Sells silver grams for cash. Same body as `buySilver`.

---

### `POST /api/order/validateCart`
**Controller:** `OrderController@validateCart`
**Description:** Pre-checkout validation. Returns the server-calculated totals for the cart so the client can confirm the displayed amount before submitting.

**Request body:**

| Field             | Type   | Required | Description                              |
|-------------------|--------|----------|------------------------------------------|
| `products`        | array  | yes      | Same shape as `submitOrder.products`.    |

---

### `POST /api/order/deposit`
**Controller:** `OrderController@deposit`
**Description:** Records a wallet top-up. Two flows:

1. **Fawaterak online (auto):** Send `payment_status=success` + `transaction_id` from the gateway callback — backend marks the deposit as approved and credits the cash wallet.
2. **InstaPay manual:** Send a receipt image; the deposit lands in pending and admin must approve.

The backend auto-detects the flow based on the `method` value or the presence of `payment_status=success` + `transaction_id`.

**Request body:**

| Field            | Type   | Required | Description                                                                |
|------------------|--------|----------|----------------------------------------------------------------------------|
| `method`         | string | yes      | One of `fawaterak online`, `فواتيرك اون لاين`, `fawaterk`, `fawaterak`, `fawaterakonline`, `فواتيرك`, or any value (treated as InstaPay). |
| `amount`         | number | yes      | EGP amount.                                                                |
| `payment_status` | string | optional | `success` to confirm a Fawaterak deposit.                                  |
| `transaction_id` | string | optional | Required for Fawaterak success.                                            |
| `receipt`        | file   | optional | Multipart image required for InstaPay manual.                              |

---

### `POST /api/order/withdraw`
**Controller:** `OrderController@withdraw`
**Description:** Requests a cash withdrawal from the user's deposit wallet via the configured method (id=1 in current setup). Validates min/max limits and balance, deducts amount + fee, creates a pending withdrawal record.

**Request body:**

| Field    | Type   | Required | Description                                          |
|----------|--------|----------|------------------------------------------------------|
| `amount` | number | yes      | Amount in EGP. Must be within method's min/max limits. |

**Errors:**
- `Your Requested Amount is Smaller Than Minimum Amount.` (422)
- `Your Requested Amount is Larger Than Maximum Amount.` (422)
- `In Sufficient Balance In your Wallet.` (422)

---

## 7. App Version (no auth)

### `GET /api/forceupdate`
**Controller:** `AppVersionController@forceUpdate`
**Description:** Tells the mobile app whether the user must update before continuing.

**Headers / query:**

| Field         | Type   | Required | Description                                              |
|---------------|--------|----------|----------------------------------------------------------|
| `X-App-Version` (header) **or** `version` (query) | string | yes | Current app version, e.g. `1.4.2`. |
| `X-Platform` (header) **or** `platform` (query)   | string | optional | `android`, `ios`, or `both` (default). |

**Response:**
```json
{
  "code": 200,
  "data": {
    "version":      "1.5.0",
    "forceupdate":  true,
    "message":      "Please update to continue."
  },
  "message": "Version check completed"
}
```

---

### `GET /api/version/latest`
**Controller:** `AppVersionController@latestVersion`
**Description:** Latest published version metadata (whether or not it's a forced update).

**Headers / query:**

| Field        | Type   | Required | Description                                |
|--------------|--------|----------|--------------------------------------------|
| `X-Platform` (header) or `platform` (query) | string | optional | `android`, `ios`, `both`. Default: `both`. |

---

### `GET /api/language-settings` and `GET /api/ramadan-settings`
Both stub endpoints — return `0`. Reserved for future feature flags.

---

## 8. Admin (token-only, separate from web admin)

### `GET /api/admin/users`
**Controller:** `Api\Admin\UserController@index`
**Description:** Returns a flat list of users. Currently has no auth middleware on this group beyond `api`. Treat as **internal-only** for now.

---

## 9. Quick reference — endpoint table

| # | Method | URL                                     | Auth | Module |
|---|--------|-----------------------------------------|------|--------|
| 1 | POST   | `/api/submit-token`                     | open | Notifications |
| 2 | GET    | `/api/general-setting`                  | open | Settings |
| 3 | GET    | `/api/unauthenticate`                   | open | System |
| 4 | GET    | `/api/languages`                        | open | i18n |
| 5 | GET    | `/api/language-data/{code}`             | open | i18n |
| 6 | GET    | `/api/branches`                         | open | Branches |
| 7 | GET    | `/api/home`                             | open | Home |
| 8 | GET    | `/api/product/{id}`                     | open | Products |
| 9 | GET    | `/api/products/{type?}`                 | open | Products |
| 10| GET    | `/api/products-live`                    | open | Products |
| 11| GET    | `/api/current-prices`                   | open | Prices |
| 12| GET    | `/api/pages/{type?}`                    | open | CMS |
| 13| GET    | `/api/contact-us`                       | open | Support |
| 14| POST   | `/api/contact-us`                       | open | Support |
| 15| GET    | `/api/news`                             | open | News |
| 16| GET    | `/api/fixedNews`                        | open | News |
| 17| GET    | `/api/news/{id?}`                       | open | News |
| 18| GET    | `/api/systemInfo`                       | open | System |
| 19| GET    | `/api/paymentMethods`                   | open | Payments |
| 20| GET    | `/api/states`                           | open | Locations |
| 21| GET    | `/api/cities/{state_id?}`               | open | Locations |
| 22| POST   | `/api/updateTempImage`                  | open | Uploads |
| 23| POST   | `/api/register`                         | open | Auth |
| 24| POST   | `/api/login`                            | open | Auth |
| 25| POST   | `/api/verify-otp`                       | open | Auth |
| 26| POST   | `/api/password/request`                 | open | Auth |
| 27| POST   | `/api/password/verify-code`             | open | Auth |
| 28| POST   | `/api/password/change`                  | open | Auth |
| 29| GET    | `/api/forceupdate`                      | open | App |
| 30| GET    | `/api/version/latest`                   | open | App |
| 31| GET    | `/api/user/profile`                     | client | Profile |
| 32| POST   | `/api/user/profile`                     | client | Profile |
| 33| POST   | `/api/user/updateImage`                 | client | Profile |
| 34| GET    | `/api/user/claimableItems`              | client | Profile |
| 35| GET    | `/api/user/wallet`                      | client | Wallet |
| 36| GET    | `/api/user/transactions`                | client | Wallet |
| 37| GET    | `/api/user/transactions/{id}`           | client | Wallet |
| 38| GET    | `/api/user/notifications`               | client | Notifications |
| 39| POST   | `/api/user/notifications`               | client | Notifications |
| 40| DELETE | `/api/user/notifications/{id}`          | client | Notifications |
| 41| GET    | `/api/user/delete`                      | client | Profile |
| 42| POST   | `/api/order/submitOrder`                | client | Orders |
| 43| POST   | `/api/order/buyGold`                    | client | Trading |
| 44| POST   | `/api/order/sellGold`                   | client | Trading |
| 45| POST   | `/api/order/buySilver`                  | client | Trading |
| 46| POST   | `/api/order/sellSilver`                 | client | Trading |
| 47| POST   | `/api/order/validateCart`               | client | Orders |
| 48| POST   | `/api/order/deposit`                    | client | Wallet |
| 49| POST   | `/api/order/withdraw`                   | client | Wallet |
| 50| GET    | `/api/user/logout`                      | bearer | Auth |
| 51| GET    | `/api/user/authorization`               | bearer | Auth |
| 52| GET    | `/api/user/resend-verify`               | bearer | Auth |
| 53| POST   | `/api/user/verify-email`                | bearer | Auth |
| 54| POST   | `/api/user/verify-sms`                  | bearer | Auth |
| 55| POST   | `/api/user/verify-g2fa`                 | bearer | Auth |
| 56| GET    | `/api/admin/users`                      | open*  | Admin |

\* Currently no auth — internal use.

---

## 10. Common gotchas for the frontend dev

- **Always send a `Bearer` token** on `/api/user/*` and `/api/order/*` — even if the docs above show "open" elsewhere, missing tokens here yield 401.
- **All money & weight numbers** are **recomputed on the server**. Never trust the client-side total — re-display the server's value from the response after `validateCart` / `submitOrder`.
- **OTP login flow:** `/api/login` *without* `password` triggers OTP. Read the response: `data.user_id` is what you pass to `/api/verify-otp` as `id`.
- **5-minute order cooldown** — `submitOrder` will reject a second order from the same user within 5 minutes with HTTP 200 + `code: 422`.
- **Pickup vs delivery** — set `pickup_branch_id` to switch a product order from shipped to branch-pickup.
- **Karats** — for buy/sellGold, only `24`, `21`, `18` are accepted; anything else falls back to `24`.
- **Profile image vs ID image** — `/api/user/updateImage` is for the avatar, `/api/updateTempImage` is for ID card photos (returns a filename you then send back in `national_id_image` / `national_id_image_bk`).

---

## 11. Maintenance

Routes are governed by middleware `api.maintenance`. When the API is in maintenance mode, all endpoints respond with a maintenance JSON payload (HTTP 503-equivalent). Surface this in the UI as a non-dismissable screen.
