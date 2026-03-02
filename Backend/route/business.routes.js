// routes for business-related endpoints
import express from "express";
import {
    createBusiness,
    getAllBusinesses,
    searchBusinesses,
    getBusinessesPaginated,
    updateBusiness,
    addOns,
    deleteBusiness
} from "../controllers/business.controllers.js";

import { authMiddleware } from "../utils/middlewares/authMiddleware.js";

import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";

const businessRoutes = express.Router();

businessRoutes.post("/", authMiddleware, roleMiddleware("system_admin"), createBusiness);
businessRoutes.get("/", authMiddleware, roleMiddleware("system_admin"), getAllBusinesses);

businessRoutes.get("/search", authMiddleware, roleMiddleware('system_admin'), searchBusinesses);
businessRoutes.get("/paginated", authMiddleware, roleMiddleware("system_admin"), getBusinessesPaginated);
businessRoutes.put("/:id", authMiddleware, roleMiddleware("system_admin"), updateBusiness);
businessRoutes.get("/:id/users", authMiddleware, roleMiddleware("system_admin", "business_admin"), addOns.getBusinessUsers);
businessRoutes.delete("/:id", authMiddleware, roleMiddleware("system_admin"), deleteBusiness);

export default businessRoutes;