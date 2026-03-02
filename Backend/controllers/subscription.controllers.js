import Subscription from '../models/subscriptions.models.js'

export const createSubscription = async (req, res) => {
    try {
        const { userId, businessId, plan, status } = req.body;
        const newSubscription = await Subscription.create({ userId, businessId, plan, status });
        return res.status(201).json(newSubscription);
    } catch (error) {
        console.error("Error creating subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll();
        return res.status(200).json(subscriptions);
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findByPk(id);
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });
        return res.status(200).json(subscription);
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
