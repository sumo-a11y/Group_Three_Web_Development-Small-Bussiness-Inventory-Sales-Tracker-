import Product from "../models/products.models.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity } = req.body;
        const businessId = req.user.businessId;

        const newProduct = await Product.create({
            name,
            description,
            price,
            stock_quantity,
            businessId
        });

        return res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductsByBusiness = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const products = await Product.findAll({ where: { businessId } });
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity } = req.body;
        const businessId = req.user.businessId;

        const product = await Product.findOne({ where: { id, businessId } });
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock_quantity = stock_quantity || product.stock_quantity;

        await product.save();
        return res.status(200).json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const businessId = req.user.businessId;

        const product = await Product.findOne({ where: { id, businessId } });
        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.destroy();
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductsPaginated = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;
        const products = await Product.findAndCountAll({
            where: { businessId },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return res.status(200).json({
            products: products.rows,
            total: products.count,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error("Error fetching paginated products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const searchProducts = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const { name, description } = req.query;

        const products = await Product.findAll({
            where: {
                businessId,
                name: { [Op.iLike]: `%${name}%` },
                description: { [Op.iLike]: `%${description}%` }
            }
        });

        return res.status(200).json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
