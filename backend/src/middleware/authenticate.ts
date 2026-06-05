import { Request, Response, NextFunction } from "express";
import { CREDENTIALS } from "../config/credentials";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { email, password } = req.headers;

  if (email !== CREDENTIALS.email || password !== CREDENTIALS.password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  next();
}
