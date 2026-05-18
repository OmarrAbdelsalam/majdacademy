import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { ApiResponse } from "./api-client";

/**
 * SSR Utility: Make authenticated requests from Next.js Server Components.
 * This function manually passes cookies from the incoming request to the Laravel backend.
 */
export async function serverApiRequest<T = any>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const url = endpoint.startsWith("http") ? endpoint : `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://golden-circle.net"}${endpoint}`;

  try {
    const res = await axios({
      ...options,
      url,
      headers: {
        "Cookie": cookieString,
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
        ...options.headers,
      },
      withCredentials: true,
    });

    return {
      success: true,
      ...res.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Server Error",
      ...error.response?.data
    };
  }
}

/**
 * Example of how to use authenticated requests in a Next.js Server Component.
 */
export const getProfileServer = (locale?: string) => 
  serverApiRequest("/api/user/profile", { 
    method: "GET",
    headers: {
      "x-lang": locale || "ar"
    }
  });

/**
 * Usage in a Server Component:
 * 
 * import { getProfileServer } from "@/lib/server-api";
 * 
 * export default async function DashboardPage() {
 *   const res = await getProfileServer();
 *   if (!res.success) {
 *     // Handle unauthorized or error
 *   }
 *   const user = res.data;
 *   // ...
 * }
 */
