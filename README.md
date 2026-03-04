# 📦 Small Business Inventory & Sales Tracker

A full-stack web application for managing products, stock levels, sales, and subscriptions for small businesses.

This system allows business administrators to:

- Manage products
- Track inventory stock
- Monitor low stock alerts
- Handle subscriptions
- Authenticate users securely
- View dashboard data

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite Database
- JWT Authentication
- Express Session
- Swagger (API documentation)

### Frontend
- Vue.js
- Vite
- Vue Router
- Modern UI Dashboard Design

---

## 📁 Project Structure

```
Group_Three_Web_Development-Small-Bussiness-Inventory-Sales-Tracker-
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── route/
│   ├── scripts/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```
git clone https://github.com/sumo-a11y/Group_Three_Web_Development-Small-Bussiness-Inventory-Sales-Tracker-.git
cd Group_Three_Web_Development-Small-Bussiness-Inventory-Sales-Tracker-
```

---

## 🚀 Running the Backend

```
cd Backend
npm install
npx nodemon
```

Backend runs at:

```
http://localhost:3000
```

---

## 🚀 Running the Frontend

Open a new terminal:

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔐 Authentication

The system uses:

- JWT for secure authentication
- Sessions for request handling
- Password hashing with bcrypt

---

## 🗄 Database

- SQLite database file located in:
  ```
  Backend/config/database.db
  ```
- Sequelize ORM handles all models and relationships.

---

## 📡 API Routes Overview

Main route groups:

```
/api/auth
/api/business
/api/users
/api/products
/api/low-stock
/api/subscriptions
/api/subscription-plans
```

---

## 🌱 Branching Strategy

- `main` → Stable production-ready code
- `development` → Active development branch
- `feature-*` → Individual feature branches

Workflow:

```
feature branch → development → main
```

---

## 🔮 Future Improvements

- Role-based access control
- Sales analytics dashboard
- Pagination and filtering
- Email notifications
- Deployment to cloud (Render / Railway / VPS)
- Production database (PostgreSQL)

---

## 👨‍💻 Contributors

- Team Group Three
- Maintained by: sumo-a11y

---

## 📄 License

This project is for educational and development purposes.