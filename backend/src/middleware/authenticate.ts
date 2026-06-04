import { Request, Response, NextFunction } from "express";

const CREDENTIALS = {
  email: "admin@foboh.com",
  password: "foboh2024",
};

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
