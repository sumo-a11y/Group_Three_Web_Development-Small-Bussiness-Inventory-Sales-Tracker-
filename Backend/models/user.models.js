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
    reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    email_verification_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email_verify_expires: {
        type: DataTypes.DATE,
        allowNull: true,
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
    timestamps: true,
    freezeTableName: true
});
export default user;