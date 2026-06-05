import { AdjustmentType, AdjustmentDirection } from "../models/types";
import { products } from "../data/seed";

const validAdjustmentTypes: AdjustmentType[] = ["fixed", "dynamic"];
const validAdjustmentDirections: AdjustmentDirection[] = [
  "increase",
  "decrease",
];
const validProductScopes = ["specific", "category", "all"];
const validCustomerScopes = ["specific", "group", "all"];

type ValidationRule = {
  check: (body: any) => boolean;
  message: string;
};

const validationRules: ValidationRule[] = [
  {
    check: (body) => !body.name || typeof body.name !== "string",
    message: "name is required and must be a string",
  },
  {
    check: (body) => !validAdjustmentTypes.includes(body.adjustmentType),
    message: "adjustmentType must be fixed or dynamic",
  },
  {
    check: (body) =>
      !validAdjustmentDirections.includes(body.adjustmentDirection),
    message: "adjustmentDirection must be increase or decrease",
  },
  {
    check: (body) =>
      typeof body.adjustmentValue !== "number" || body.adjustmentValue < 0,
    message: "adjustmentValue must be a non-negative number",
  },
  {
    check: (body) => !validProductScopes.includes(body.productScope),
    message: "productScope must be specific, category or all",
  },
  {
    check: (body) => !validCustomerScopes.includes(body.customerScope),
    message: "customerScope must be specific, group or all",
  },
  {
    check: (body) =>
      body.productScope === "specific" &&
      (!body.productIds || body.productIds.length === 0),
    message: "productIds is required when productScope is specific",
  },
  {
    check: (body) => body.productScope === "category" && !body.category,
    message: "category is required when productScope is category",
  },
  {
    check: (body) => body.customerScope === "specific" && !body.customerId,
    message: "customerId is required when customerScope is specific",
  },
  {
    check: (body) => body.customerScope === "group" && !body.customerGroup,
    message: "customerGroup is required when customerScope is group",
  },
  {
    check: (body) =>
      body.productScope === "specific" &&
      Array.isArray(body.productIds) &&
      body.productIds.some(
        (id: string) => !products.find((p) => p.id === id),
      ),
    message: "one or more productIds do not exist",
  },
];

export function validateProfile(body: any): string | null {
  const failed = validationRules.find((rule) => rule.check(body));
  return failed ? failed.message : null;
}
