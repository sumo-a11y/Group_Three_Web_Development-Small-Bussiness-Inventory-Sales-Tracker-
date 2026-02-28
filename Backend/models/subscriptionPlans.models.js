import db from "../config/connect.js";
import { DataTypes } from "sequelize";

const subscriptionPlan = db.define('SubscriptionPlan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    features: {
        type: DataTypes.JSON,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    maxProducts: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxUsers: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxTransactions: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    freezeTableName: true
});

export default subscriptionPlan;