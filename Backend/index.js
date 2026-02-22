import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import router from './route/auth.routes.js';
import db from './config/connect.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 * 60 }
}));

// Database Sync
await db.sync({ alter: true });
console.log("All models synced correctly..")
// Routes
app.use('/api/auth', router);
app.get('/', (req, res) => {
    res.send('Welcome to the Inventory and Sales Tracker API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});