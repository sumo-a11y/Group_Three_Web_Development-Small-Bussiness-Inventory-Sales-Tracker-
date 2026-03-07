import { Router } from "express";
import {
    createSale,
    updateSale,
    deleteSale,
    getBusinessSales,
    getSales
} from "../controllers/sales.controllers.js";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from '../utils/middlewares/roleMiddleware.js'

const salesRoute = Router();

salesRoute.use(authMiddleware);

salesRoute.post("/", authMiddleware, roleMiddleware('business_admin'), createSale);
salesRoute.get("/", authMiddleware, roleMiddleware('business_admin'), getBusinessSales);
salesRoute.get("/:id", authMiddleware, roleMiddleware('business_admin'), getSales);
salesRoute.put("/:id", authMiddleware, roleMiddleware('business_admin'), updateSale);
salesRoute.delete("/:id", authMiddleware, roleMiddleware('business_admin'), deleteSale);

export default salesRoute;