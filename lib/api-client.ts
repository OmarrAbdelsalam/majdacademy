export interface ApiRequestOptions extends RequestInit {
  locale?: string;
  token?: string; // Optionally pass token explicitly
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const clearCookie = (name: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
};

const BASE_URL = typeof window === "undefined" ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://golden-circle.net") : "";

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const isBrowser = typeof window !== "undefined";
    
    // Infer locale from URL if in browser, otherwise fallback to "ar"
    let locale = options.locale;
    if (!locale && isBrowser) {
      const pathLocale = window.location.pathname.split('/')[1];
      if (pathLocale === 'ar' || pathLocale === 'en') {
        locale = pathLocale;
      }
    }
    if (!locale) locale = "ar"; // default to ar

    const headers = new Headers(options.headers || {});
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");
    
    // Only set Content-Type if we have a body and it's not FormData
    if (options.body && options.body instanceof FormData) {
      // Browser will set multipart/form-data with correct boundary automatically
    } else {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    }
    
    headers.set("x-lang", locale);

    const token = options.token || getCookie("gct_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 503) {
      if (isBrowser) window.dispatchEvent(new CustomEvent("gct-maintenance"));
      return { success: false, message: "System under maintenance" };
    }

    let data: any = {};
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }

    if (res.status === 401) {
      clearCookie("gct_token");
      if (isBrowser) window.location.href = `/${locale}/login`;
      return { success: false, message: "Unauthorized", ...data };
    }

    if (data && data.code === 503) {
      if (isBrowser) window.dispatchEvent(new CustomEvent("gct-maintenance"));
      return { success: false, message: "System under maintenance" };
    }

    // Always return message from response if available for 422 etc.
    if (!res.ok || (data && data.code && data.code !== 200)) {
      return { 
        success: false, 
        message: data?.message || "حدث خطأ غير متوقع",
        ...data 
      };
    }

    return {
      success: true,
      ...data
    };

  } catch (error) {
    return { success: false, message: "تعذّر الاتصال بالخادم" };
  }
}
