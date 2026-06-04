import axiosInstance from "../axios";
import type { Product, PricingProfile } from "../../types";

// Auth
export const login = async (email: string, password: string): Promise<void> => {
  await axiosInstance.post("/auth/login", { email, password });

  // Store credentials for subsequent requests
  axiosInstance.defaults.headers.common["email"] = email;
  axiosInstance.defaults.headers.common["password"] = password;

  // Set auth cookie
  document.cookie = "isAuthenticated=true; path=/; max-age=86400";
};

// Products
export const getProducts = async (filters?: {
  title?: string;
  sku?: string;
  subCategory?: string;
  segment?: string;
  brand?: string;
}): Promise<Product[]> => {
  const response = await axiosInstance.get("/products", { params: filters });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

// Profiles
export const getProfiles = async (): Promise<PricingProfile[]> => {
  const response = await axiosInstance.get("/profiles");
  return response.data;
};

export const getProfileById = async (id: string): Promise<PricingProfile> => {
  const response = await axiosInstance.get(`/profiles/${id}`);
  return response.data;
};

export const createProfile = async (
  profile: Omit<PricingProfile, "id" | "createdAt">,
): Promise<PricingProfile> => {
  const response = await axiosInstance.post("/profiles", profile);
  return response.data;
};

export const updateProfile = async (
  id: string,
  profile: Partial<PricingProfile>,
): Promise<PricingProfile> => {
  const response = await axiosInstance.put(`/profiles/${id}`, profile);
  return response.data;
};

export const deleteProfile = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/profiles/${id}`);
};

export const resolvePrice = async (customerId: string, productId: string) => {
  const response = await axiosInstance.get(
    `/profiles/resolve/${customerId}/${productId}`,
  );
  return response.data;
};
