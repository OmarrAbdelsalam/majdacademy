import { NextRequest } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://golden-circle.net";

// Headers to forward from the client request to the backend
const FORWARD_HEADERS = [
  "content-type",
  "authorization",
  "x-lang",
  "x-device",
  "x-app-version",
  "x-platform",
];

async function handler(request: NextRequest) {
  // Proxy the request to the backend for both local and production environments


  const { pathname, search } = request.nextUrl;
  const targetUrl = `${BACKEND}${pathname}${search}`;

  // Build headers to send to the backend
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  for (const key of FORWARD_HEADERS) {
    const value = request.headers.get(key);
    if (value) headers[key] = value;
  }

  // Forward the request body for non-GET methods
  let body: BodyInit | null = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("multipart/form-data")) {
      // For FormData, pass the raw body and let the content-type (with boundary) through
      body = await request.arrayBuffer();
    } else {
      body = await request.text();
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      // @ts-ignore — needed so Node doesn't follow redirects
      redirect: "manual",
    });

    // Stream the response back to the client
    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      // Skip hop-by-hop headers
      const skip = ["transfer-encoding", "connection", "keep-alive", "content-encoding"];
      if (!skip.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // Rewrite redirect Location to stay on the local proxy
    const location = responseHeaders.get("location");
    if (location && location.startsWith(BACKEND)) {
      responseHeaders.set("location", location.replace(BACKEND, ""));
    }

    const responseBody = await backendRes.arrayBuffer();
    const isNoBody = backendRes.status === 204 || backendRes.status === 304;

    return new Response(isNoBody ? null : responseBody, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Sanctum proxy error:", error?.message || error);
    return Response.json(
      { code: 500, message: "Backend unreachable", data: null, error: error?.message },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
