import type { Customer, Product } from "../../types";

export const CUSTOMERS: Pick<Customer, "id" | "name">[] = [
  { id: "c1", name: "Bondi Cellars" },
  { id: "c2", name: "Sydney Wine Co" },
  { id: "c3", name: "Melbourne Drinks" },
];

export const PRODUCTS: Pick<Product, "id" | "title" | "basePrice">[] = [
  { id: "p1", title: "High Garden Pinot Noir 2021", basePrice: 279.06 },
  { id: "p2", title: "Koyama Methode Brut Nature NV", basePrice: 120.0 },
  { id: "p3", title: "Koyama Riesling 2018", basePrice: 215.04 },
  { id: "p4", title: "Koyama Tussock Riesling 2019", basePrice: 215.04 },
  { id: "p5", title: "Lacourte-Godbillon Brut Cru NV", basePrice: 409.32 },
];
