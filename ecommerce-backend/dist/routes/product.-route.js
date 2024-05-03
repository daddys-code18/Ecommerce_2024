import express from "express";
import { deletedProduct, getAdminProducts, getAllCategories, getAllProducts, getSingleProduct, getlatestProduct, newProduct, updateProduct, } from "../controllers/product-controller.js";
import { singleUpload } from "../middleware/multer.js";
import { adminOnly } from "../middleware/auth.js";
const app = express();
// To Create New Product /api/v1/Product/new
app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/all", getAllProducts);
// To get Last 10 Products /api/v1/product/latest
app.get("/latest", getlatestProduct);
// To get all unique Categories - /api/v1/categories
app.get("/category", getAllCategories);
//To Get All products by Admin /api/v1/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);
app
    .route("/:id")
    .get(getSingleProduct)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deletedProduct);
export default app;
