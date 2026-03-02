import { Router } from "express";
import { authMiddleware } from "../utils/middlewares/authMiddleware.js";
import { roleMiddleware } from "../utils/middlewares/roleMiddleware.js";
import { getAllUsers, getUserById, getUserBusinesses, deleteUser, updateUser, searchUsers, getUsersPaginated, addSystemAdmin } from "../controllers/users.controllers.js";

const userRoutes = Router();

userRoutes.get("/", authMiddleware, roleMiddleware(["system_admin"]), getAllUsers);
// search for users using query parameters like ? and query strings like ?
userRoutes.get("/search", authMiddleware, roleMiddleware(["system_admin"]), searchUsers);
userRoutes.get("/paginated", authMiddleware, roleMiddleware(["system_admin"]), getUsersPaginated);
userRoutes.get("/:id", authMiddleware, roleMiddleware(["system_admin"]), getUserById);
userRoutes.get("/:id/businesses", authMiddleware, roleMiddleware(["system_admin", "business_admin"]), getUserBusinesses);
userRoutes.put("/:id", authMiddleware, roleMiddleware(["system_admin"]), updateUser);
userRoutes.delete("/:id", authMiddleware, roleMiddleware(["system_admin"]), deleteUser);
userRoutes.post("/add-system-admin", authMiddleware, roleMiddleware(["system_admin"]), addSystemAdmin);

export default userRoutes;