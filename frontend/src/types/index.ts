export interface PricingProfile {
  id: string;
  name: string;
  adjustmentType: "fixed" | "dynamic";
  adjustmentDirection: "increase" | "decrease";
  adjustmentValue: number;
  productScope: "specific" | "category" | "all";
  productIds?: string[];
  category?: string;
  customerScope: "specific" | "group" | "all";
  customerId?: string;
  customerGroup?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  brand: string;
  subCategory: string;
  segment: string;
  basePrice: number;
}

export interface ProfileFormValues {
  name: string;
  adjustmentType: "fixed" | "dynamic";
  adjustmentDirection: "increase" | "decrease";
  adjustmentValue: number;
  productScope: "specific" | "category" | "all";
  productIds?: string[];
  category?: string;
  customerScope: "specific" | "group" | "all";
  customerId?: string;
  customerGroup?: string;
}

export interface ProductFilters {
  title: string;
  sku: string;
  subCategory: string;
  segment: string;
  brand: string;
}
