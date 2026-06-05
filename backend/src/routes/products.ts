import { Router, Request, Response } from "express";
import { products } from "../data/seed";
import { Product } from "../models/types";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    const { title, sku, subCategory, segment, brand } = req.query;

    let filtered: Product[] = products;

    if (title) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes((title as string).toLowerCase()),
      );
    }

    if (sku) {
      filtered = filtered.filter((p) =>
        p.sku.toLowerCase().includes((sku as string).toLowerCase()),
      );
    }

    if (subCategory) {
      filtered = filtered.filter((p) =>
        p.subCategory
          .toLowerCase()
          .includes((subCategory as string).toLowerCase()),
      );
    }

    if (segment) {
      filtered = filtered.filter((p) =>
        p.segment.toLowerCase().includes((segment as string).toLowerCase()),
      );
    }

    if (brand) {
      filtered = filtered.filter((p) =>
        p.brand.toLowerCase().includes((brand as string).toLowerCase()),
      );
    }

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  try {
    const product: Product | undefined = products.find(
      (p) => p.id === req.params.id,
    );

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
