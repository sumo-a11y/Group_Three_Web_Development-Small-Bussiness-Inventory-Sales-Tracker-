// controllers/auth.controllers.js
import Business from "../models/business.models.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

        // Business uniqueness
        const existingBiz = await Business.findOne({ where: { name } });
        if (existingBiz) return res.status(400).json({ message: "Business already exists" });

        // Email uniqueness (important for enterprise)
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        // Create business
        const business = await Business.create({ name, owner_name, taxIdentificationNumber });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name: owner_name,
            email,
            hashed_password: hashedPassword,
            role: "business_admin",
            businessId: business.id,
        });

        // Issue tokens
        const jwtPayload = { userId: user.id, businessId: user.businessId, role: user.role };
        const accessToken = signAccessToken(jwtPayload);
        const refreshToken = signRefreshToken(jwtPayload);
        setRefreshCookie(res, refreshToken);

        return res.status(201).json({
            message: "Business and user registered successfully",
            token: accessToken,
            user: safeUserResponse(user, business),
        });
    } catch (error) {
        console.error("Registration error:", error);
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