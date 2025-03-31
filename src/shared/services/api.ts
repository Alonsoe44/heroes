import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_TOKEN;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

async function request<T>(
  promise: Promise<{ data: T }>
): Promise<[T | null, string | null]> {
  try {
    const response = await promise;
    return [response.data, null];
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message = err.response?.data?.message ?? "Unexpected error";
    return [null, message];
  }
}

export default {
  get: <T>(url: string) => request<T>(apiClient.get(url)),

  post: <T>(url: string, data?: any) => request<T>(apiClient.post(url, data)),

  put: <T>(url: string, data?: any) => request<T>(apiClient.put(url, data)),

  delete: <T>(url: string) => request<T>(apiClient.delete(url)),
};
