import subscriptionPlan from "../models/subscriptionPlans.models.js";

export const createSubscriptionPlan = async (req, res) => {
    try {
        const { name, price, features } = req.body;
        const newPlan = await subscriptionPlan.create({ name, price, features });
        return res.status(201).json(newPlan);
    } catch (error) {
        console.error("Error creating subscription plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllSubscriptionPlans = async (req, res) => {
    try {
        const plans = await subscriptionPlan.findAll();
        return res.status(200).json(plans);
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getSubscriptionPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await subscriptionPlan.findByPk(id);
        if (!plan) return res.status(404).json({ message: "Subscription plan not found" });
        return res.status(200).json(plan);
    } catch (error) {
        console.error("Error fetching subscription plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, features } = req.body;

        const plan = await subscriptionPlan.findByPk(id);
        if (!plan) return res.status(404).json({ message: "Subscription plan not found" });

        plan.name = name || plan.name;
        plan.price = price || plan.price;
        plan.features = features || plan.features;

        await plan.save();
        return res.status(200).json(plan);
    } catch (error) {
        console.error("Error updating subscription plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await subscriptionPlan.findByPk(id);
        if (!plan) return res.status(404).json({ message: "Subscription plan not found" });

        await plan.destroy();
        return res.status(200).json({ message: "Subscription plan deleted successfully" });
    } catch (error) {
        console.error("Error deleting subscription plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};