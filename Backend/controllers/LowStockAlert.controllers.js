import LowStockAlert from "../models/LowStockAlert.models.js";

export const createLowStockAlert = async (req, res) => {
    try {
        const { productId, threshold } = req.body;
        const newAlert = await LowStockAlert.create({ productId, threshold });
        return res.status(201).json(newAlert);
    } catch (error) {
        console.error("Error creating low stock alert:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getLowStockAlertsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const alerts = await LowStockAlert.findAll({ where: { productId } });
        return res.status(200).json(alerts);
    } catch (error) {
        console.error("Error fetching low stock alerts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateLowStockAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { threshold, isActive } = req.body;

        const alert = await LowStockAlert.findByPk(id);
        if (!alert) return res.status(404).json({ message: "Low stock alert not found" });

        alert.threshold = threshold !== undefined ? threshold : alert.threshold;
        alert.isActive = isActive !== undefined ? isActive : alert.isActive;

        await alert.save();
        return res.status(200).json(alert);
    } catch (error) {
        console.error("Error updating low stock alert:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteLowStockAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const alert = await LowStockAlert.findByPk(id);
        if (!alert) return res.status(404).json({ message: "Low stock alert not found" });

        await alert.destroy();
        return res.status(200).json({ message: "Low stock alert deleted successfully" });
    } catch (error) {
        console.error("Error deleting low stock alert:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllLowStockAlerts = async (req, res) => {
    try {
        const alerts = await LowStockAlert.findAll();
        return res.status(200).json(alerts);
    } catch (error) {
        console.error("Error fetching low stock alerts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getLowStockAlertById = async (req, res) => {
    try {
        const { id } = req.params;
        const alert = await LowStockAlert.findByPk(id);
        if (!alert) return res.status(404).json({ message: "Low stock alert not found" });
        return res.status(200).json(alert);
    } catch (error) {
        console.error("Error fetching low stock alert:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};