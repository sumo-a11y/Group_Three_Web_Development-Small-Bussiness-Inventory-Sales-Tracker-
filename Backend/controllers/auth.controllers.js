import Business from "../models/business.models.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { name, owner_name, email, password } = req.body;

        if (!name || !owner_name || !email || !password) {
            console.log("Missing fields in registration:", { name, owner_name, email, password });
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the business already exists
        let business = await Business.findOne({ where: { name } });
        if (business) {
            return res.status(400).json({ message: "Business already exists" });
        }

        // Create the business
        business = await Business.create({ name, owner_name });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            name: owner_name,
            email,
            password: hashedPassword,
            role: 'business_admin',
            businessId: business.id
        });

        res.status(201).json({ message: "Business and user registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ mesg: "Email & Password fields are required" })
        // Find the user by email
        if (req.session.authenticated) {
            return res.status(200).json({ message: "Already logged in" });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (isMatch) {
            req.session.authenticated = true;
            req.session.userId = user.id;
            req.session.businessId = user.businessId;
            req.session.role = user.role;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, businessId: user.businessId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' }, req.sessionID);

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
