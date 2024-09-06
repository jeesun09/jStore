import express from "express";
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
// Importing the routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
