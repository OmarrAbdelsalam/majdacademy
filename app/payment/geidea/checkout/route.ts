import { NextRequest } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://golden-circle.net";

async function handler(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const targetUrl = `${BACKEND}${pathname}${search}`;

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    const skip = ["host", "connection", "transfer-encoding"];
    if (!skip.includes(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  let body: BodyInit | null = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("multipart/form-data")) {
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
      // @ts-ignore
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
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

    return new Response(responseBody, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response("Backend unreachable", { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
