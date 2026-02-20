import sequelize from 'sequelize';

const db = new sequelize({
    database: 'inventory_sales_tracker',
    dialect: 'sqlite',
    storage: './config/database.db'
});
try {
    await db.authenticate();
    console.log('Database connection has been established successfully.');

    await db.sync({ alter: true });

} catch (error) {
    console.error('Unable to connect to the database:', error);
}
export default db;

