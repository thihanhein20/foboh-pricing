import { Router, Request, Response } from "express";
import { PricingProfile } from "../models/types";
import { resolvePrice } from "../services/resolver";
import { validateProfile } from "../utils/validation";
import {
  getAllProfiles,
  findProfileById,
  addProfile,
  updateProfileById,
  removeProfileById,
} from "../store/profileStore";
import { products, customers } from "../data/seed";
import { v4 as uuidv4 } from "uuid";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    res.json(getAllProfiles());
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  try {
    const profile: PricingProfile | undefined = findProfileById(req.params.id as string);

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

    addProfile(newProfile);
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", (req: Request, res: Response) => {
  try {
    const existing: PricingProfile | undefined = findProfileById(req.params.id as string);

    if (!existing) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    const validationError: string | null = validateProfile({
      ...existing,
      ...req.body,
    });

    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const updated = updateProfileById(req.params.id as string, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  try {
    const removed: boolean = removeProfileById(req.params.id as string);

    if (!removed) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/resolve/:customerId/:productId", (req: Request, res: Response) => {
  try {
    const customerId: string = req.params.customerId as string;
    const productId: string = req.params.productId as string;

    const resolution = resolvePrice(customerId, productId, getAllProfiles(), products, customers);

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
