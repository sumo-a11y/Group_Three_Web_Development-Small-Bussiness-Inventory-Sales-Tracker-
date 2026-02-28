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

businessRoutes.post("/", authMiddleware, roleMiddleware(["system_admin"]), createBusiness);
businessRoutes.get("/", authMiddleware, getAllBusinesses);

businessRoutes.get("/search", authMiddleware, searchBusinesses);
businessRoutes.get("/paginated", authMiddleware, getBusinessesPaginated);
businessRoutes.put("/:id", authMiddleware, roleMiddleware(["system_admin"]), updateBusiness);
businessRoutes.get("/:id/users", authMiddleware, roleMiddleware(["system_admin", "business_admin"]), addOns.getBusinessUsers);
businessRoutes.delete("/:id", authMiddleware, roleMiddleware(["system_admin"]), deleteBusiness);

export default businessRoutes;