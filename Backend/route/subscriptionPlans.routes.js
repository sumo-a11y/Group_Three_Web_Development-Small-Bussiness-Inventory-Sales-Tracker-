import { Router } from "express";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";
import { createSubscriptionPlan, getAllSubscriptionPlans, getSubscriptionPlanById, updateSubscriptionPlan, deleteSubscriptionPlan } from "../controllers/subscriptionPlans.controllers.js";

const subscriptionPlanRoutes = Router();

subscriptionPlanRoutes.post("/", authMiddleware, roleMiddleware(["system_admin"]), createSubscriptionPlan);
subscriptionPlanRoutes.get("/", authMiddleware, roleMiddleware(["system_admin"]), getAllSubscriptionPlans);
subscriptionPlanRoutes.get("/:id", authMiddleware, roleMiddleware(["system_admin"]), getSubscriptionPlanById);
subscriptionPlanRoutes.put("/:id", authMiddleware, roleMiddleware(["system_admin"]), updateSubscriptionPlan);
subscriptionPlanRoutes.delete("/:id", authMiddleware, roleMiddleware(["system_admin"]), deleteSubscriptionPlan);

export default subscriptionPlanRoutes;