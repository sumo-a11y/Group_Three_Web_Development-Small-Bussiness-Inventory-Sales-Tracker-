import { Router } from "express";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";
import { createLowStockAlert, getLowStockAlertsByProduct, updateLowStockAlert, deleteLowStockAlert } from "../controllers/LowStockAlert.controllers.js";

const lowStockAlertRoutes = Router();

lowStockAlertRoutes.post("/", authMiddleware, roleMiddleware(["business_admin"]), createLowStockAlert);
lowStockAlertRoutes.get("/product/:productId", authMiddleware, roleMiddleware(["business_admin"]), getLowStockAlertsByProduct);
lowStockAlertRoutes.put("/:id", authMiddleware, roleMiddleware(["business_admin"]), updateLowStockAlert);
lowStockAlertRoutes.delete("/:id", authMiddleware, roleMiddleware(["business_admin"]), deleteLowStockAlert);

export default lowStockAlertRoutes;