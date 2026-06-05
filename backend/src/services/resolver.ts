import {
  PricingProfile,
  PriceResolution,
  Product,
  Customer,
} from "../models/types";

// Precedence rule:
// 1. Most specific customer scope wins (specific > group > all)
// 2. Most specific product scope wins (specific > category > all)
// 3. If still tied, greatest saving wins
// 4. New price can never be negative

type ProductScopeType = "specific" | "category" | "all";
type CustomerScopeType = "specific" | "group" | "all";

const scopeRank: Record<ProductScopeType | CustomerScopeType, number> = {
  specific: 3,
  category: 2,
  group: 2,
  all: 1,
};

function calculateNewPrice(basePrice: number, profile: PricingProfile): number {
  let adjustment: number = 0;

  if (profile.adjustmentType === "fixed") {
    adjustment = profile.adjustmentValue;
  } else {
    adjustment = (profile.adjustmentValue / 100) * basePrice;
  }

  const newPrice: number =
    profile.adjustmentDirection === "increase"
      ? basePrice + adjustment
      : basePrice - adjustment;

  return Math.max(0, Math.round(newPrice * 100) / 100);
}

function getProfileScore(profile: PricingProfile): number {
  const customerScore: number = scopeRank[profile.customerScope];
  const productScore: number = scopeRank[profile.productScope];
  return customerScore * 10 + productScore;
}

function profileMatchesCustomer(
  profile: PricingProfile,
  customerId: string,
  customers: Customer[],
): boolean {
  const customer: Customer | undefined = customers.find(
    (c) => c.id === customerId,
  );
  if (!customer) return false;

  if (profile.customerScope === "specific") {
    return profile.customerId === customerId;
  }
  if (profile.customerScope === "group") {
    return customer.groups.includes(profile.customerGroup ?? "");
  }
  return true;
}

function profileMatchesProduct(
  profile: PricingProfile,
  productId: string,
  products: Product[],
): boolean {
  const product: Product | undefined = products.find((p) => p.id === productId);
  if (!product) return false;

  if (profile.productScope === "specific") {
    return profile.productIds?.includes(productId) ?? false;
  }
  if (profile.productScope === "category") {
    // profile.category stores a subCategory value (e.g. "Wine Sparkling")
    return profile.category === product.subCategory;
  }
  return true;
}

export function resolvePrice(
  customerId: string,
  productId: string,
  profiles: PricingProfile[],
  products: Product[],
  customers: Customer[],
): PriceResolution | null {
  const product: Product | undefined = products.find((p) => p.id === productId);
  const customer: Customer | undefined = customers.find(
    (c) => c.id === customerId,
  );

  if (!product || !customer) return null;

  const matchingProfiles: PricingProfile[] = profiles.filter(
    (p) =>
      profileMatchesCustomer(p, customerId, customers) &&
      profileMatchesProduct(p, productId, products),
  );

  if (matchingProfiles.length === 0) {
    return {
      customerId,
      productId,
      originalPrice: product.basePrice,
      resolvedPrice: product.basePrice,
      appliedProfileId: null,
      appliedProfileName: "No profile applied",
      customerScope: null,
      profileScore: null,
      reason: "No matching pricing profile found. Base price applied.",
    };
  }

  const sorted: PricingProfile[] = [...matchingProfiles].sort((a, b) => {
    const scoreDiff: number = getProfileScore(b) - getProfileScore(a);
    if (scoreDiff !== 0) return scoreDiff;

    // negative values mean a price increase — smallest increase wins
    const discountA: number =
      product.basePrice - calculateNewPrice(product.basePrice, a);
    const discountB: number =
      product.basePrice - calculateNewPrice(product.basePrice, b);
    return discountB - discountA;
  });

  const winner: PricingProfile = sorted[0];
  const resolvedPrice: number = calculateNewPrice(product.basePrice, winner);

  const reason =
    winner.adjustmentValue === 0
      ? `Profile "${winner.name}" matched but has zero adjustmentValue — price is unchanged. ${sorted.length} profile(s) matched.`
      : `Profile "${winner.name}" applied. Customer scope: ${winner.customerScope}, Product scope: ${winner.productScope}. ${sorted.length} profile(s) matched, most specific won.`;

  return {
    customerId,
    productId,
    originalPrice: product.basePrice,
    resolvedPrice,
    appliedProfileId: winner.id,
    appliedProfileName: winner.name,
    customerScope: winner.customerScope,
    profileScore: getProfileScore(winner),
    reason,
  };
}
