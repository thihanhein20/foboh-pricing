export type AdjustmentType = "fixed" | "dynamic";
export type AdjustmentDirection = "increase" | "decrease";

export interface Product {
  id: string;
  title: string;
  sku: string;
  brand: string;
  subCategory: string;
  segment: string;
  basePrice: number;
}

export interface Customer {
  id: string;
  name: string;
  groups: string[];
}

export interface PricingProfile {
  id: string;
  name: string;
  adjustmentType: AdjustmentType;
  adjustmentDirection: AdjustmentDirection;
  adjustmentValue: number;
  productScope: "specific" | "category" | "all";
  productIds?: string[];
  category?: string;
  customerScope: "specific" | "group" | "all";
  customerId?: string;
  customerGroup?: string;
  createdAt: string;
}

export interface PriceResolution {
  customerId: string;
  productId: string;
  originalPrice: number;
  resolvedPrice: number;
  appliedProfileId: string;
  appliedProfileName: string;
  reason: string;
}
