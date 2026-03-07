import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './route/auth.routes.js';
import businessRoutes from './route/business.routes.js';
import userRoutes from './route/user.routes.js';
import productRoutes from './route/products.routes.js';
import lowStockAlertRoutes from './route/lowStockAlert.routes.js';
import subscrptionRoutes from './route/subscription.routes.js';
import subscriptionPlanRoutes from './route/subscriptionPlans.routes.js';

import db from './config/connect.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:5173",
    credentials: true,
}));

app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 60000 * 60 },
    }),
);

// Database Sync
await db.sync();
console.log("All models synced correctly..")
// auth Routes and all other routes
app.use('/api/auth', router);
app.use('/api/business', businessRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/low-stock', lowStockAlertRoutes);
app.use('/api/subscriptions', subscrptionRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Inventory and Sales Tracker API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
