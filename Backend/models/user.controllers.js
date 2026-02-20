import db from "../config/connect.js";
import { DataTypes } from "sequelize";

const user = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    hashed_password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('system_admin', 'business_admin', 'sales_agent'),
        allowNull: false,
        defaultValue: 'business_admin'
    },
    businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Business',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true
});
export default user;