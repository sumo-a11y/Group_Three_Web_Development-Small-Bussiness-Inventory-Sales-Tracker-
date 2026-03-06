import { Router } from "express";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";
import { getAllProducts, createProduct, updateProduct, deleteProduct, searchProducts, getProductsPaginated, getProductsByBusiness } from "../controllers/products.controllers.js";

const productRoutes = Router();

productRoutes.post("/", authMiddleware, roleMiddleware("business_admin"), createProduct);
productRoutes.get("/", authMiddleware, roleMiddleware("business_admin"), getAllProducts);
productRoutes.get("/business", authMiddleware, roleMiddleware("business_admin"), getProductsByBusiness);
productRoutes.get("/paginated", authMiddleware, roleMiddleware("business_admin"), getProductsPaginated);
productRoutes.get("/search", authMiddleware, roleMiddleware("business_admin"), searchProducts);
productRoutes.put("/:id", authMiddleware, roleMiddleware("business_admin"), updateProduct);
productRoutes.delete("/:id", authMiddleware, roleMiddleware("business_admin"), deleteProduct);

export default productRoutes;