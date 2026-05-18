import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiRequestOptions extends AxiosRequestConfig {
  locale?: string;
  token?: string;
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

const BASE_URL = typeof window === "undefined" 
  ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://golden-circle.net") 
  : "";

// Global Axios Instance for Client-Side & Sanctum
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  withXSRFToken: true, // Automatically handle X-XSRF-TOKEN header
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const isBrowser = typeof window !== "undefined";
    
    // Infer locale
    let locale = options.locale;
    if (!locale && isBrowser) {
      const pathLocale = window.location.pathname.split('/')[1];
      if (pathLocale === 'ar' || pathLocale === 'en') {
        locale = pathLocale;
      }
    }
    if (!locale) locale = "ar";

    const config: AxiosRequestConfig = {
      ...options,
      url: endpoint,
      data: options.data || (options as any).body,
      headers: {
        ...options.headers,
        "x-lang": locale,
      },
    };

    // Handle token if explicitly provided or found in cookies (for backwards compatibility)
    const token = options.token || getCookie("gct_token");
    if (token) {
      config.headers = {
        ...config.headers,
        "Authorization": `Bearer ${token}`,
      };
    }

    const res: AxiosResponse = await apiClient.request(config);
    const data = res.data;

    if (data && data.code === 503) {
      if (isBrowser) window.dispatchEvent(new CustomEvent("gct-maintenance"));
      return { success: false, message: "System under maintenance" };
    }

    return {
      success: true,
      ...data
    };

  } catch (error: any) {
    const isBrowser = typeof window !== "undefined";
    const res = error.response;

    if (res) {
      if (res.status === 503) {
        if (isBrowser) window.dispatchEvent(new CustomEvent("gct-maintenance"));
        return { success: false, message: "System under maintenance" };
      }

      if (res.status === 401) {
        clearCookie("gct_token");
        // We might want to keep the redirect logic if it's still needed, 
        // but Sanctum usually handles sessions via cookies now.
        if (isBrowser) {
          const pathLocale = window.location.pathname.split('/')[1] || "ar";
          window.location.href = `/${pathLocale}/login`;
        }
        return { success: false, message: "Unauthorized", ...res.data };
      }

      return { 
        success: false, 
        message: res.data?.message || "حدث خطأ غير متوقع",
        ...res.data 
      };
    }

    return { success: false, message: "تعذّر الاتصال بالخادم" };
  }
}
