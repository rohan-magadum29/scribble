// lib/httpClient.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SOCKET_URL,
  headers: { "Content-Type": "application/json" },
});

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface HttpClientOptions<TBody = unknown> {
    method?: HttpMethod;               
  body?: TBody;                      
  params?: Record<string, unknown>;  
  headers?: Record<string, string>;  
  config?: AxiosRequestConfig;  
}
export class HttpError extends Error {
  status?: number;
  isNetworkError: boolean;

  constructor(message: string, status?: number, isNetworkError = false) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}
export const httpClient = async <TResponse = unknown, TBody = unknown>(url : string,{
    method = "GET",
  body,
  params,
  headers,
  config
}: HttpClientOptions<TBody> = {}) : Promise<TResponse> => {
  try {
    const res = await axiosClient.request<TResponse>({
      ...config,
      url,
      method,
      data: body,
      params,
      headers: { ...config?.headers, ...headers },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new HttpError(
      error.response?.data?.message ?? error.message ?? "Something went wrong",
      error.response?.status,
      !error.response // true when the server is unreachable
    );
  }
};