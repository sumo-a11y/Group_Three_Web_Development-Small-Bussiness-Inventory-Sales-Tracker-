import { Router } from "express";
import {
    createCustomer,
    getCustomersByBusiness,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from "../controllers/customers.controllers.js";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";

const customerRoute = Router();

customerRoute.use(authMiddleware);

customerRoute.post("/", authMiddleware, roleMiddleware('business_admin'), createCustomer);
customerRoute.get("/", authMiddleware, roleMiddleware('business_admin'), getCustomersByBusiness);
customerRoute.get("/:id", authMiddleware, roleMiddleware('business_admin'), getCustomerById);
customerRoute.put("/:id", authMiddleware, roleMiddleware('business_admin'), updateCustomer);
customerRoute.delete("/:id", authMiddleware, roleMiddleware('business_admin'), deleteCustomer);

export default customerRoute;