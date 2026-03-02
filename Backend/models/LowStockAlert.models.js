import db from "../config/connect.js";
import { DataTypes } from "sequelize";

const LowStockAlert = db.define('LowStockAlert', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Product',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    threshold: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    freezeTableName: true
});

export default LowStockAlert;