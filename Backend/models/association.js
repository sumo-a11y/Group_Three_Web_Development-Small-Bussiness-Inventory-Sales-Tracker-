import Sale from "./sales.model.js"
import SaleItem from "./salesItems.models.js"
import Product from "./products.models.js"
import Notification from "./notification.model.js"

Sale.hasMany(SaleItem, {
    foreignKey: 'saleId',
    as: 'items'
})

SaleItem.belongsTo(Sale, {
    foreignKey: 'saleId'
})

SaleItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
})

Product.hasMany(SaleItem, {
    foreignKey: 'productId'
})
Product.hasMany(Notification, {
    foreignKey: 'productId',
    as: 'notifications'
});
Notification.belongsTo(Product, {
    foreignKey: "productId",
    as: 'product'
})