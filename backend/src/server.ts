import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import marcheRoutes from "./routes/marche.js";
import prodottiRoutes from "./routes/prodotti.js";
import preferitiRoutes from "./routes/preferiti.js";
import catalogoRoutes from "./routes/catalogo.js";
import marcaProdottiRoutes from "./routes/marca-prodotti.js";
import adminRoutes from "./routes/admin.js";
import { errorHandler } from "./middleware/asyncHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiter per autenticazione (protezione brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10, // Max 10 tentativi per finestra
  message: { error: "Troppi tentativi, riprova tra 15 minuti" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes con rate limiting per auth
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/marche", marcheRoutes);
app.use("/api/prodotti", prodottiRoutes);
app.use("/api/preferiti", preferitiRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/marca/prodotti", marcaProdottiRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Global error handler - deve essere l'ultimo middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
