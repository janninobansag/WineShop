# 🍷 WineShop - Premium Wine E-commerce Platform

A full-stack wine shop web application with 3D flip cards, user authentication, admin dashboard, inventory management, and order tracking.

## ✨ Features

- 🍇 **3D Flip Wine Cards** - Interactive product display
- 🔐 **User Authentication** - Register/Login with JWT
- 👑 **Admin Dashboard** - Manage wines, users, orders, inventory
- 📊 **Analytics Dashboard** - Sales charts and statistics
- 🛒 **Shopping Cart** - Add/remove items, quantity control
- 📦 **Order Management** - Track orders, update status
- 📝 **Reviews System** - Rate and review wines
- 📈 **Inventory Management** - Track stock levels, low stock alerts
- 🔔 **Real-time Notifications** - Order status updates
- 💳 **Checkout** - Delivery instructions, payment methods
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Context API (State Management)
- React Icons
- Chart.js (Analytics)
- CSS3 (Custom styling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (Password hashing)

### Development Tools
- Vite (Build tool)
- Nodemon (Auto-restart)
- Git (Version control)

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation Guide

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/wineshop.git
cd wineshop

----------------------------------------------------------------------------------------------------------------------
1. Install Backend Dependencies
cd WineShop/backend
npm install

2. Install Frontend Dependencies
cd ../frontend
npm install

File 1: backend/.env

 # API Configuration
WINE_API_BASE_URL=https://api.sampleapis.com/wines
WINE_API_REDS=${WINE_API_BASE_URL}/reds
WINE_API_WHITES=${WINE_API_BASE_URL}/whites
WINE_API_ROSE=${WINE_API_BASE_URL}/rose
WINE_API_SPARKLING=${WINE_API_BASE_URL}/sparkling

# Server Configuration
PORT=5000
NODE_ENV=development

File 2: frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
-------------------------------------------------------------------------------------------------------
cd backend
node scripts/importWines.js
npm install express mongoose cors dotenv bcryptjs jsonwebtoken axios

cd frontend
npm install react-icons react-router-dom react-toastify chart.js react-chartjs-2



AFTER INSTALLING AND STTING UP ALL OF THEN:

step 1: open new terminal and type this
cd backend
npm start

step 2: open new terminal and type this
cd frontend
npm start


TO OPEN AMIN ACCOUNT
http://localhost:3000/admin

-make sure to add /admin to the end of the url

admin username: admin@wineshop.com
admin password: admin123


andrie gwapoo