import { Product, Customer } from "../models/types";

export const products: Product[] = [
  {
    id: "p1",
    title: "High Garden Pinot Noir 2021",
    sku: "HGVPIN21",
    brand: "High Garden",
    subCategory: "Wine Red",
    segment: "Red",
    basePrice: 279.06,
  },
  {
    id: "p2",
    title: "Koyama Methode Brut Nature NV",
    sku: "KOYBRUNNV6",
    brand: "Koyama Wines",
    subCategory: "Wine Sparkling",
    segment: "Sparkling",
    basePrice: 120.0,
  },
  {
    id: "p3",
    title: "Koyama Riesling 2018",
    sku: "KOYNR1837",
    brand: "Koyama Wines",
    subCategory: "Wine Port/Dessert",
    segment: "Port/Dessert",
    basePrice: 215.04,
  },
  {
    id: "p4",
    title: "Koyama Tussock Riesling 2019",
    sku: "KOYRIE19",
    brand: "Koyama Wines",
    subCategory: "Wine White",
    segment: "White",
    basePrice: 215.04,
  },
  {
    id: "p5",
    title: "Lacourte-Godbillon Brut Cru NV",
    sku: "LACBNATNV6",
    brand: "Lacourte-Godbillon",
    subCategory: "Wine Sparkling",
    segment: "Sparkling",
    basePrice: 409.32,
  },
];

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Bondi Cellars",
    groups: ["Independent Retailers", "VIP"],
  },
  {
    id: "c2",
    name: "Sydney Wine Co",
    groups: ["Independent Retailers"],
  },
  {
    id: "c3",
    name: "Melbourne Drinks",
    groups: ["VIP"],
  },
];

export const customerGroups: string[] = ["Independent Retailers", "VIP"];
