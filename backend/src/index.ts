import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import productRoutes from "./routes/products";
import profileRoutes from "./routes/profiles";
import authRoutes from "./routes/auth";
import { authenticate } from "./middleware/authenticate";
import { swaggerSpec } from "./swagger/config";

const app: Application = express();
const PORT: number = 3000;

app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec as object));

// Routes
app.use("/auth", authRoutes);
app.use("/products", authenticate, productRoutes);
app.use("/profiles", authenticate, profileRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
