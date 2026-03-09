import { Router } from "express";
import {
    createProduct,
    getProductsByBusiness,
    getProductById,
    updateProduct,
    getAllProducts,
    deleteProduct
} from "../controllers/products.controllers.js";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";

const productRoute = Router();

productRoute.use(authMiddleware);
productRoute.use(roleMiddleware('business_admin', 'system_admin'))


productRoute.post("/", createProduct);
productRoute.get("/", getProductsByBusiness);
productRoute.get("/all-products", getAllProducts)
productRoute.get("/:id", getProductById);
productRoute.put("/:id", updateProduct);
productRoute.delete("/:id", deleteProduct);

export default productRoute;