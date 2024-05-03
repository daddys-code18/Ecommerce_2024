import express from "express";
import { adminOnly } from "../middleware/auth.js";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder, } from "../controllers/order-controller.js";
const app = express();
// users Routes
app.post("/new", newOrder);
app.get("/my", myOrders);
app.get("/all", adminOnly, allOrders);
app
    .route("/:id")
    .get(getSingleOrder)
    .put(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);
export default app;
