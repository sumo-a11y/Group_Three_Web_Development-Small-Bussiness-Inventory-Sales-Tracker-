import Business from "../models/business.models.js";
import User from "../models/user.models.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: Business,
                attributes: ["id", "name"]
            },
            attributes: { exclude: ["password"] }
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: {
                model: Business,
                attributes: ["id", "name"]
            },
            attributes: { exclude: ["password"] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUsersPaginated = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const users = await User.findAndCountAll({
            include: {
                model: Business,
                attributes: ["id", "name"]
            },
            attributes: { exclude: ["password"] },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return res.status(200).json({
            users: users.rows,
            total: users.count,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error("Error fetching paginated users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: "Query parameter is required" });

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            },
            include: {
                model: Business,
                attributes: ["id", "name"]
            },
            attributes: { exclude: ["password"] }
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserBusinesses = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: {
                model: Business,
                attributes: ["id", "name"]
            },
            attributes: { exclude: ["password"] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user.Businesses);
    } catch (error) {
        console.error("Error fetching user's businesses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) user.password = password; // Ensure password hashing is handled in the model

        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const addSystemAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = "system_admin";
        await user.save();
        return res.status(200).json({ message: "User promoted to system admin successfully" });
    } catch (error) {
        console.error("Error promoting user to system admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};