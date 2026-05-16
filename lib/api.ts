import { apiRequest } from "./api-client";

export const login = (body: any, locale: string) => apiRequest("/api/login", { method: "POST", body: JSON.stringify(body), locale });
export const verifyOtp = (body: any, locale: string) => apiRequest("/api/verify-otp", { method: "POST", body: JSON.stringify(body), locale });
export const register = (body: any, locale: string) => apiRequest("/api/register", { method: "POST", body: JSON.stringify(body), locale });
export const requestPasswordReset = (body: any, locale: string) => apiRequest("/api/password/request", { method: "POST", body: JSON.stringify(body), locale });
export const verifyPasswordCode = (body: any, locale: string) => apiRequest("/api/password/verify-code", { method: "POST", body: JSON.stringify(body), locale });
export const changePassword = (body: any, locale: string) => apiRequest("/api/password/change", { method: "POST", body: JSON.stringify(body), locale });

export const getCurrentPrices = (locale?: string) => apiRequest("/api/current-prices", { method: "GET", locale });
export const getProducts = (locale?: string) => apiRequest("/api/products", { method: "GET", locale });
export const getLiveProducts = (locale?: string) => apiRequest("/api/products-live?metal_type=gold", { method: "GET", locale });
export const getSilverLiveProducts = (locale?: string) => apiRequest("/api/products-live?metal_type=silver", { method: "GET", locale });

export const getWallet = (locale?: string) => apiRequest("/api/user/wallet", { method: "GET", locale });
export const getTransactions = (page: number = 1, type: string = "all", locale?: string) => apiRequest(`/api/user/transactions?page=${page}&type=${type}`, { method: "GET", locale });
export const getTransactionDetails = (id: string, locale?: string) => apiRequest(`/api/user/transactions/${id}`, { method: "GET", locale });
export const getNotifications = (skip: number = 0, locale?: string) => apiRequest(`/api/user/notifications?skip=${skip}`, { method: "GET", locale });
export const deleteNotification = (id: string, locale?: string) => apiRequest(`/api/user/notifications/${id}`, { method: "DELETE", locale });

export const getProfile = (locale?: string) => apiRequest("/api/user/profile", { method: "GET", locale });
export const updateProfile = (body: any, locale?: string) => apiRequest("/api/user/profile", { method: "POST", body: JSON.stringify(body), locale });
export const updateAvatar = (body: FormData, locale?: string) => apiRequest("/api/user/updateImage", { method: "POST", body, locale });

export const getPaymentMethods = (locale?: string) => apiRequest("/api/paymentMethods", { method: "GET", locale });
export const submitDeposit = (body: any, locale?: string) => apiRequest("/api/order/deposit", { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body), locale });
export const submitWithdraw = (body: any, locale?: string) => apiRequest("/api/order/withdraw", { method: "POST", body: JSON.stringify(body), locale });

// Geidea Wallet Deposits
export const createGeideaDeposit = (amount: number, currency: string, locale?: string) =>
  apiRequest("/api/user/wallet/deposits", { method: "POST", body: JSON.stringify({ amount, currency }), locale });
export const getDepositStatus = (id: number, locale?: string) =>
  apiRequest(`/api/user/wallet/deposits/${id}`, { method: "GET", locale });
export const getDepositHistory = (page: number = 1, perPage: number = 20, locale?: string) =>
  apiRequest(`/api/user/wallet/deposits?page=${page}&per_page=${perPage}`, { method: "GET", locale });

export const buyGold = (body: any, locale?: string) => apiRequest("/api/order/buyGold", { method: "POST", body: JSON.stringify(body), locale });
export const buySilver = (body: any, locale?: string) => apiRequest("/api/order/buySilver", { method: "POST", body: JSON.stringify(body), locale });

export const getStates = (locale?: string) => apiRequest("/api/states", { method: "GET", locale });
export const getCities = (stateId?: string, locale?: string) => apiRequest(`/api/cities${stateId ? `/${stateId}` : ""}`, { method: "GET", locale });

export const getBranches = (locale?: string) => apiRequest("/api/branches", { method: "GET", locale });
export const validateCart = (body: any, locale?: string) => apiRequest("/api/order/validateCart", { method: "POST", body: JSON.stringify(body), locale });
export const submitOrder = (body: any, locale?: string) => apiRequest("/api/order/submitOrder", { method: "POST", body: JSON.stringify(body), locale });
