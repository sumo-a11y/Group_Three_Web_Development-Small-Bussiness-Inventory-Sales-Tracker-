// controllers/auth.controllers.js
import crypto from "crypto";
import Business from "../models/business.models.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mail/mailer.js";
import { generateTokenPair } from "../utils/helpers/resetToken.js";

const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "7d";

const REFRESH_COOKIE_MAX_AGE =
    Number(process.env.REFRESH_COOKIE_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000;

function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

function signRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
}

function setRefreshCookie(res, refreshToken) {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/api/auth/refresh",
        maxAge: REFRESH_COOKIE_MAX_AGE,
    });
}

function clearRefreshCookie(res) {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/api/auth/refresh",
    });
}

function safeUserResponse(user, business) {
    return {
        id: user.id,
        name: user.name,
        role: user.role,
        businessId: user.businessId,
        businessName: business?.name || null,
    };
}

export const registerUser = async (req, res) => {
    try {
        const { name, owner_name, email, password, taxIdentificationNumber } = req.body;

        if (!name || !owner_name || !email || !password || !taxIdentificationNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingBiz = await Business.findOne({ where: { name } });
        if (existingBiz) return res.status(400).json({ message: "Business already exists" });

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const business = await Business.create({ name, owner_name, taxIdentificationNumber });

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: owner_name,
            email,
            hashed_password: hashedPassword,
            role: "business_admin",
            businessId: business.id,
        });

        // ✅ Generate email verification token
        const { rawToken, hashedToken } = generateTokenPair(); // reuse helper

        // ✅ Use correct field names from your model
        user.email_verification_token = hashedToken;
        user.email_verify_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${rawToken}&email=${encodeURIComponent(
            user.email
        )}`;

        // ✅ Don’t fail registration if email fails
        sendEmail({
            to: user.email,
            subject: "Verify your email",
            text: `Verify your email: ${verifyLink}`,
            html: `
        <div style="font-family: Arial, sans-serif">
          <h2>Verify your email</h2>
          <p>Please verify your email to activate your account.</p>
          <p><a href="${verifyLink}">Verify Email</a></p>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
        }).catch((err) => console.error("Verification email failed:", err));

        // Issue tokens (your choice: you can still issue tokens, but block login actions until verified)
        const jwtPayload = { userId: user.id, businessId: user.businessId, role: user.role };
        const accessToken = signAccessToken(jwtPayload);
        const refreshToken = signRefreshToken(jwtPayload);
        setRefreshCookie(res, refreshToken);

        return res.status(201).json({
            message: "Business and user registered successfully. Please verify your email.",
            token: accessToken,
            user: safeUserResponse(user, business),
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const verifyEmailRedirect = async (req, res) => {
    try {
        const { email, token } = req.query;

        if (!email || !token) {
            return res.redirect(`${process.env.APP_URL}/login?verified=0`);
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            where: {
                email,
                email_verification_token: hashedToken,
            },
        });

        if (!user) {
            return res.redirect(`${process.env.APP_URL}/login?verified=0`);
        }

        if (!user.email_verify_expires || user.email_verify_expires < new Date()) {
            return res.redirect(`${process.env.APP_URL}/login?verified=expired`);
        }

        // already verified? still redirect nicely
        if (!user.email_verified) {
            user.email_verified = true;
            user.email_verification_token = null;
            user.email_verify_expires = null;
            await user.save();

            // ✅ send confirmation email (don’t block redirect if it fails)
            sendEmail({
                to: user.email,
                subject: "Email verified successfully",
                text: "Your email has been verified. You can now log in.",
                html: `
          <div style="font-family: Arial, sans-serif">
            <h2>Email Verified ✅</h2>
            <p>Your email has been verified successfully.</p>
            <p>You can now log in to your account.</p>
          </div>
        `,
            }).catch(console.error);
        }

        // ✅ Redirect to frontend login page
        return res.redirect(`${process.env.APP_URL}/login?verified=1`);
    } catch (err) {
        console.error("verifyEmailRedirect error:", err);
        return res.redirect(`${process.env.APP_URL}/login?verified=0`);
    }
};

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Always validate input
        if (!email) return res.status(400).json({ message: "Email is required" });

        // Generic message to prevent email enumeration
        const genericMsg = "If that email exists, we have sent a verification link.";

        const user = await User.findOne({ where: { email } });

        // If user doesn't exist, still return generic message
        if (!user) return res.status(200).json({ message: genericMsg });

        // If already verified, tell user (safe to reveal because they already have the email)
        if (user.email_verified) {
            return res.status(200).json({ message: "Your email is already verified. Please login." });
        }

        // Generate a fresh verification token
        const { rawToken, hashedToken } = generateTokenPair(); // reuse your helper

        user.email_verification_token = hashedToken;
        user.email_verify_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${rawToken}&email=${encodeURIComponent(
            user.email
        )}`;

        // Send email (don't throw hard errors to client)
        await sendEmail({
            to: user.email,
            subject: "Verify your email",
            text: `Verify your email: ${verifyLink}`,
            html: `
        <div style="font-family: Arial, sans-serif">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your email and activate your account.</p>
          <p><a href="${verifyLink}" style="display:inline-block;padding:10px 14px;background:#f97316;color:white;text-decoration:none;border-radius:8px;">Verify Email</a></p>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
        });

        return res.status(200).json({ message: genericMsg });
    } catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email & Password fields are required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        if (!user.email_verified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                emailNotVerified: true
            });
        }

        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const business = await Business.findByPk(user.businessId);

        const jwtPayload = { userId: user.id, businessId: user.businessId, role: user.role };
        const accessToken = signAccessToken(jwtPayload);
        const refreshToken = signRefreshToken(jwtPayload);
        setRefreshCookie(res, refreshToken);

        return res.status(200).json({
            message: "Login successful",
            token: accessToken,
            user: safeUserResponse(user, business),
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const tokenFromCookie = req.cookies?.refreshToken;
        if (!tokenFromCookie) return res.status(401).json({ message: "Missing refresh token" });

        let payload;
        try {
            payload = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
        } catch {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Optional: verify user still exists
        const user = await User.findByPk(payload.userId);
        if (!user) return res.status(401).json({ message: "User not found" });

        // Optional: if you stored refresh token version in DB, validate it here.

        // Rotate refresh token
        const newPayload = { userId: user.id, businessId: user.businessId, role: user.role };
        const newAccessToken = signAccessToken(newPayload);
        const newRefreshToken = signRefreshToken(newPayload);
        setRefreshCookie(res, newRefreshToken);

        const business = await Business.findByPk(user.businessId);

        return res.status(200).json({
            message: "Token refreshed",
            token: newAccessToken,
            user: safeUserResponse(user, business),
        });
    } catch (error) {
        console.error("Refresh error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        clearRefreshCookie(res);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Forget password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ where: { email } });

        // Always return a generic message (prevents email enumeration)
        const genericMsg = "If that email exists, a reset link has been sent.";

        if (!user) return res.status(200).json({ message: genericMsg });

        const { rawToken, hashedToken } = generateTokenPair();

        user.reset_password_token = hashedToken;
        user.reset_password_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();

        const resetLink = `${process.env.APP_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(
            email
        )}`;

        await sendEmail({
            to: email,
            subject: "Reset your password",
            text: `Reset your password using this link: ${resetLink}`,
            html: `
        <div style="font-family: Arial, sans-serif">
          <h2>Password reset</h2>
          <p>You requested to reset your password.</p>
          <p>
            <a href="${resetLink}" target="_blank" rel="noreferrer">Click here to reset</a>
          </p>
          <p>This link expires in 15 minutes.</p>
          <p>If you didn&apos;t request this, you can ignore this email.</p>
        </div>
      `,
        });

        return res.status(200).json({ message: genericMsg });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return res.status(400).json({ message: "Email, token and newPassword are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            where: {
                email,
                reset_password_token: hashedToken,
            },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        if (!user.reset_password_expires || user.reset_password_expires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Set new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.hashed_password = hashedPassword;

        // Clear reset fields
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();

        return res.status(200).json({ message: "Password reset successful. You can now log in." });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};