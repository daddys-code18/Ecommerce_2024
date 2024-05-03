import express from "express";
import { adminOnly } from "../middleware/auth.js";
import { dashboardStats, getBarCharts, getLineCharts, getPieCharts, } from "../controllers/admin.controller.js";
const app = express();
app.get("/stats", adminOnly, dashboardStats);
app.get("/pie", adminOnly, getPieCharts);
app.get("/bar", adminOnly, getBarCharts);
app.get("/line", adminOnly, getLineCharts);
export default app;
