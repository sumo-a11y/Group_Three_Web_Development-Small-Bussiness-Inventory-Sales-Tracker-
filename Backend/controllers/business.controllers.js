import Business from "../models/business.models.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.findAll();
        return res.status(200).json(businesses);
    } catch (error) {
        console.error("Error fetching businesses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getBusinessById = async (req, res) => {
    try {
        const { id } = req.params;
        const business = await Business.findByPk(id);
        if (!business) return res.status(404).json({ message: "Business not found" });
        return res.status(200).json(business);
    } catch (error) {
        console.error("Error fetching business:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// create a new business for a business admin with the user attached to the business
// create signAccessToken, signRefreshToken, setRefreshCookie, safeUserResponse here

function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function signRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function setRefreshCookie(res, token) {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}

function safeUserResponse(user, business) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        business: {
            id: business.id,
            name: business.name,
            owner_name: business.owner_name,
            taxIdentificationNumber: business.taxIdentificationNumber,
        }
    };
}

export const createBusiness = async (req, res) => {
    try {
        const { name, owner_name, taxIdentificationNumber, email, password } = req.body;

        if (!name || !owner_name || !taxIdentificationNumber || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create business
        const business = await Business.create({ name, owner_name, taxIdentificationNumber });

        // Create user
        const hashedPassword = await bcrypt.hash(password, 12);
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
        console.error("Error creating business:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// create a search query for businesses
export const searchBusinesses = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: "Query parameter is required" });

        const businesses = await Business.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${query}%`
                }
            }
        });

        return res.status(200).json(businesses);
    } catch (error) {
        console.error("Error searching businesses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// business pagination
export const getBusinessesPaginated = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const businesses = await Business.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return res.status(200).json({
            businesses: businesses.rows,
            total: businesses.count,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error("Error fetching paginated businesses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, owner_name, taxIdentificationNumber } = req.body;

        const business = await Business.findByPk(id);
        if (!business) return res.status(404).json({ message: "Business not found" });

        business.name = name || business.name;
        business.owner_name = owner_name || business.owner_name;
        business.taxIdentificationNumber = taxIdentificationNumber || business.taxIdentificationNumber;

        await business.save();
        return res.status(200).json(business);
    } catch (error) {
        console.error("Error updating business:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// other business related controllers addsOn
export const addOns = {
    getBusinessUsers: async (req, res) => {
        try {
            const { id } = req.params;
            const business = await Business.findByPk(id, {
                include: [{ model: User, attributes: { exclude: ["hashed_password"] } }]
            });
            if (!business) return res.status(404).json({ message: "Business not found" });
            return res.status(200).json(business.Users);
        } catch (error) {
            console.error("Error fetching business users:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

export const deleteBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const business = await Business.findByPk(id);
        if (!business) return res.status(404).json({ message: "Business not found" });

        await business.destroy();
        return res.status(200).json({ message: "Business deleted successfully" });
    } catch (error) {
        console.error("Error deleting business:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};