import { Router } from "express";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";
import { createSubscription, getAllSubscriptions, getSubscriptionById } from "../controllers/subscription.controllers.js";

const subscriptionRoutes = Router();

subscriptionRoutes.post("/", authMiddleware, roleMiddleware(["system_admin"]), createSubscription);
subscriptionRoutes.get("/", authMiddleware, roleMiddleware(["system_admin"]), getAllSubscriptions);
subscriptionRoutes.get("/:id", authMiddleware, roleMiddleware(["system_admin"]), getSubscriptionById);

export default subscriptionRoutes;