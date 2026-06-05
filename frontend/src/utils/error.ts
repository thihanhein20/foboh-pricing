import axios from "axios";

export function getApiError(err: unknown, fallback: string): string {
  return axios.isAxiosError(err)
    ? (err.response?.data?.error ?? fallback)
    : fallback;
}
