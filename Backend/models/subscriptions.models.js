import db from "../config/connect.js";
import { DataTypes } from "sequelize";

const Subscription = db.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Business',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    subscriptionPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SubscriptionPlan',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'cancelled'),
        defaultValue: 'active'
    }
}, {
    timestamps: true,
    freezeTableName: true
});

export default Subscription;