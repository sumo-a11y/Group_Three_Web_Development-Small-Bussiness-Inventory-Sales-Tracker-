// routes for business-related endpoints
import express from "express";
import {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    searchBusinesses,
    getBusinessesPaginated,
    updateBusiness,
    addOns,
    deleteBusiness
} from "../controllers/business.controllers.js";

import { authMiddleware } from "../utils/middlewares/authMiddleware.js";

import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";

const businessRoutes = express.Router();

businessRoutes.get("/:id", authMiddleware, roleMiddleware("business_admin"))
businessRoutes.post("/", authMiddleware, roleMiddleware("business_admin"), createBusiness);
businessRoutes.get("/", authMiddleware, roleMiddleware("business_admin"), getAllBusinesses);

businessRoutes.get("/search", authMiddleware, roleMiddleware('business_admin'), searchBusinesses);
businessRoutes.get("/paginated", authMiddleware, roleMiddleware("business_admin"), getBusinessesPaginated);
businessRoutes.put("/:id", authMiddleware, roleMiddleware("business_admin"), updateBusiness);
businessRoutes.get("/:id/users", authMiddleware, roleMiddleware("business_admin", "business_admin"), addOns.getBusinessUsers);

businessRoutes.delete("/:id", authMiddleware, roleMiddleware("business_admin"), deleteBusiness);

export default businessRoutes;