import { Router, Request, Response } from "express";
import { PricingProfile } from "../models/types";
import { resolvePrice } from "../services/resolver";
import { validateProfile } from "../utils/validation";
import { v4 as uuidv4 } from "uuid";

const router: Router = Router();

let profiles: PricingProfile[] = [];

router.get("/", (req: Request, res: Response) => {
  try {
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  try {
    const profile: PricingProfile | undefined = profiles.find(
      (p) => p.id === req.params.id,
    );

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", (req: Request, res: Response) => {
  try {
    const validationError: string | null = validateProfile(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const newProfile: PricingProfile = {
      id: uuidv4(),
      name: req.body.name,
      adjustmentType: req.body.adjustmentType,
      adjustmentDirection: req.body.adjustmentDirection,
      adjustmentValue: req.body.adjustmentValue,
      productScope: req.body.productScope,
      productIds: req.body.productIds,
      category: req.body.category,
      customerScope: req.body.customerScope,
      customerId: req.body.customerId,
      customerGroup: req.body.customerGroup,
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", (req: Request, res: Response) => {
  try {
    const index: number = profiles.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    const validationError: string | null = validateProfile({
      ...profiles[index],
      ...req.body,
    });

    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    profiles[index] = { ...profiles[index], ...req.body };
    res.json(profiles[index]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  try {
    const index: number = profiles.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    profiles.splice(index, 1);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/resolve/:customerId/:productId", (req: Request, res: Response) => {
  try {
    const customerId: string = req.params.customerId as string;
    const productId: string = req.params.productId as string;

    const resolution = resolvePrice(customerId, productId, profiles);

    if (!resolution) {
      res.status(404).json({ error: "Customer or product not found" });
      return;
    }

    res.json(resolution);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
