import { Router } from "express";
import {
    createProduct,
    getProductsByBusiness,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/products.controllers.js";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";

const productRoute = Router();

productRoute.use(authMiddleware);

productRoute.post("/", authMiddleware, roleMiddleware('business_admin'), createProduct);
productRoute.get("/", authMiddleware, roleMiddleware('business_admin'), getProductsByBusiness);
productRoute.get("/:id", authMiddleware, roleMiddleware('business_admin'), getProductById);
productRoute.put("/:id", authMiddleware, roleMiddleware('business_admin'), updateProduct);
productRoute.delete("/:id", authMiddleware, roleMiddleware('business_admin'), deleteProduct);

export default productRoute;