import Product from "../models/products.models.js";
import { handleProductStockAlert } from "./saleAlert.services.js";

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const createProductService = async (businessId, data) => {
    const {
        name,
        description,
        price,
        selling_price,
        stock_quantity,
        low_stock_threshold
    } = data;

    if (!name || price === undefined || selling_price === undefined) {
        throw new AppError("Name, price, and selling_price are required", 400);
    }

    if (Number(price) < 0 || Number(selling_price) < 0) {
        throw new AppError("Price values cannot be negative", 400);
    }

    if (stock_quantity !== undefined && Number(stock_quantity) < 0) {
        throw new AppError("Stock quantity cannot be negative", 400);
    }

    const product = await Product.create({
        name: String(name).trim(),
        description: description || null,
        price: Number(price),
        selling_price: Number(selling_price),
        stock_quantity: stock_quantity !== undefined ? Number(stock_quantity) : 0,
        low_stock_threshold: low_stock_threshold !== undefined ? Number(low_stock_threshold) : 10,
        businessId
    });

    await handleProductStockAlert(product);

    return product;
};

export const getProductsByBusinessService = async (businessId) => {
    return await Product.findAll({
        where: { businessId },
        order: [["createdAt", "DESC"]]
    });
};

export const getProductByIdService = async (id, businessId) => {
    const product = await Product.findOne({
        where: { id, businessId }
    });

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    return product;
};

export const updateProductService = async (id, businessId, data) => {
    const product = await Product.findOne({
        where: { id, businessId }
    });

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    const updates = {};

    if (data.name !== undefined) {
        if (!String(data.name).trim()) {
            throw new AppError("Product name cannot be empty", 400);
        }
        updates.name = String(data.name).trim();
    }

    if (data.description !== undefined) {
        updates.description = data.description;
    }

    if (data.price !== undefined) {
        if (Number(data.price) < 0) {
            throw new AppError("Price cannot be negative", 400);
        }
        updates.price = Number(data.price);
    }

    if (data.selling_price !== undefined) {
        if (Number(data.selling_price) < 0) {
            throw new AppError("Selling price cannot be negative", 400);
        }
        updates.selling_price = Number(data.selling_price);
    }

    if (data.stock_quantity !== undefined) {
        if (Number(data.stock_quantity) < 0) {
            throw new AppError("Stock quantity cannot be negative", 400);
        }
        updates.stock_quantity = Number(data.stock_quantity);
    }

    if (data.low_stock_threshold !== undefined) {
        if (Number(data.low_stock_threshold) < 0) {
            throw new AppError("Low stock threshold cannot be negative", 400);
        }
        updates.low_stock_threshold = Number(data.low_stock_threshold);
    }

    await product.update(updates);
    await handleProductStockAlert(product);

    return product;
};

export const deleteProductService = async (id, businessId) => {
    const product = await Product.findOne({
        where: { id, businessId }
    });

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    await product.destroy();

    return { message: "Product deleted successfully" };
};