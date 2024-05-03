import express from "express";

import { adminOnly } from "../middleware/auth.js";
import {
  newCoupon,
  applyDiscount,
  allCoupons,
  deleteCoupons,
  createPaymentIntent,
} from "../controllers/payment.controller.js";

const app = express();

app.post("/create", createPaymentIntent);

app.get("/discount", applyDiscount);

app.post("/coupon/new", adminOnly, newCoupon);

app.get("/coupon/all", adminOnly, allCoupons);
app.delete("/coupon/:id", adminOnly, deleteCoupons);
export default app;
