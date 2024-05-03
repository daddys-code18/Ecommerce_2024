import express from "express";
import {
  newUser,
  getAllUsers,
  getUser,
  deleteUser,
} from "../controllers/user-controller.js";
import { adminOnly } from "../middleware/auth.js";

const app = express();

// users Routes
app.post("/new", newUser);
app.get("/all", adminOnly, getAllUsers);
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);
export default app;
