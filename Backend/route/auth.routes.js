import { Router } from "express";
import {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser,
    verifyEmailRedirect,
    forgotPassword,
    resetPassword,
    resendVerificationEmail
} from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

// ✅ email verification
router.get("/verify-email", verifyEmailRedirect);
router.post("/resend-verification", resendVerificationEmail);

// ✅ forgot/reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;