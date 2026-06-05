import { Router, Request, Response } from "express";
import { CREDENTIALS } from "../config/credentials";

const router: Router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email !== CREDENTIALS.email || password !== CREDENTIALS.password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json({ message: "Login successful" });
});

export default router;
