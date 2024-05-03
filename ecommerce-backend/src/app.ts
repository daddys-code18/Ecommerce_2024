import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middleware/error.js";
import { config } from "dotenv";
import morgan from "morgan";

//Importing Routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.-route.js";
import orderRoutes from "./routes/order-route.js";
import paymentRoutes from "./routes/payment.route.js";
import dashboardRoute from "./routes/AdminDashboard.route.js";
import NodeCache from "node-cache";
import cors from "cors";
import Stripe from "stripe";

config({ path: "./.env" });
// connecting DB /
const mongoURI = process.env.MONGO_URI || "";
const stripekey =
  process.env.STRIPE_KEY ||
  "sk_test_51OoAGxSI0gBXO1ndhrjGkTNcgQyrtU5KRNrYpynI7TN0eJTkgNubrxLW6pA5eRhPqEjjr61iUbk6i1cPeUjtmKSK00sJiZXloT";

connectDB(mongoURI);

export const stripe = new Stripe(stripekey);
export const myCache = new NodeCache();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors()); // Log requests to the console
// using Routes
app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(process.env.PORT || 4000, () => {
  console.log(
    `Server is Working on http://localhost:${process.env.PORT || 4000}`
  );
});
