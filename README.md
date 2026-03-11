<div align="center">

# ⚡ M-MARKET ELECTRONICS

### Electronics E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-m--market--frontend.vercel.app-f3a81c?style=for-the-badge&logoColor=white)](https://m-market-frontend.vercel.app/)
[![Backend API](https://img.shields.io/badge/🔌_API-m--market--2.onrender.com-22c55e?style=for-the-badge)](https://m-market-2.onrender.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)

<br/>
> A full-stack electronics storefront with real-time product browsing, order placement, payment screenshot upload, and a complete admin dashboard.

</div>

---

## 🔗 Live Links

| Service | URL | Status |
|---------|-----|--------|
| 🖥️ Frontend | [https://m-market-frontend.vercel.app/](https://m-market-frontend.vercel.app/) | ![Vercel](https://img.shields.io/badge/Vercel-Live-black?logo=vercel) |
| 🔌 Backend API | [https://m-market-2.onrender.com/](https://m-market-2.onrender.com/) | ![Render](https://img.shields.io/badge/Render-Live-46E3B7?logo=render) |

---

## 🔐 Demo Credentials

> Try the app without registering — use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| 👑 **Admin** | admin@gmail.com | 1234 |
| 👤 **User** | user@gmail.com | 1234 |

---

## ✨ Features

### 🛍️ Customer Experience
- **Product Browsing** — Browse all electronics with a 4-column responsive grid
- **Smart Search** — Real-time search across product names and categories
- **Category Filtering** — Filter by Phones, Laptops, Tablets, Watches, AirPods
- **Product Detail Modal** — Rich modal with specs, images, and order flow
- **Order Placement** — 3-step checkout: details → confirm → success
- **Payment Upload** — Upload payment screenshot as proof of payment
- **Order Tracking** — View full order history with real-time status badges

### 🔐 Authentication
- JWT-based login & registration
- Protected routes for orders and admin
- Persistent session via localStorage
- Auto token expiry handling

### 👑 Admin Dashboard
- **Product Management** — Upload, update, and delete products
- **Cloudinary Integration** — Images stored on Cloudinary CDN
- **Order Management** — View all orders with customer details
- **Status Updates** — Update order status (Pending → Paid → Shipped → Cancelled)
- **Stats Overview** — Revenue, total orders, stock levels at a glance

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI Framework |
| **React Router v6** | Client-side routing |
| **CSS3 (Custom)** | Dark premium theme, animations |
| **Google Material Symbols** | Iconography |
| **Syne + DM Sans** | Typography |

### Backend
| Technology | Purpose |
|-----------|---------|
| **NestJS** | Node.js framework |
| **MongoDB + Mongoose** | Database & ODM |
| **Cloudinary** | Image storage & CDN |
| **JWT (Passport.js)** | Authentication |
| **Multer** | File upload handling |
| **class-validator** | DTO validation |
| **Access controler** | role based |

### Deployment
| Service | Used For |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Image CDN |

---

## 📁 Project Structure

```
m-market-frontend/
├── public/
│   └── index.html              # Font & icon imports
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation & search
│   │   ├── ProductCard.jsx     # Product grid card
│   │   ├── ProductModal.jsx    # Order flow modal
│   │   ├── PageTransition.jsx  # Route animations
│   │   └── Skeletons.jsx       # Loading skeletons
│   ├── pages/
│   │   ├── Home.jsx            # Main storefront
│   │   ├── Login.jsx           # Authentication
│   │   ├── Registration.jsx    # Sign up
│   │   ├── MyOrders.jsx        # Order history
│   │   └── Admin.jsx           # Admin dashboard
│   ├── styles/
│   │   ├── Home.css            # Main theme
│   │   ├── Auth.css            # Auth pages
│   │   ├── MyOrders.css        # Orders page
│   │   └── Animations.css      # Transitions
│   ├── App.jsx                 # Routes config
│   └── index.js                # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mumekonin/m-market-electronics.git

# Navigate to the frontend folder
cd m-market-electronics/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will run at **http://localhost:3000**

### Environment

The frontend connects directly to the deployed backend — no `.env` setup needed for local development.

If you want to use a local backend, update the `SERVER_URL` constant in each component:

```js
const SERVER_URL = 'http://localhost:3000'; // change to your local backend
```

---

## 🔌 API Reference

Base URL: `https://m-market-2.onrender.com`

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/products/get-all-products` | ❌ | Get all products |
| `GET` | `/products/get-product-detail/:id` | ❌ | Get single product |
| `GET` | `/products/search-products?key=` | ❌ | Search products |
| `POST` | `/products/upload` | ✅ Admin | Upload new product |
| `PATCH` | `/products/update/:id` | ✅ Admin | Update product |
| `DELETE` | `/products/delete/:id` | ✅ Admin | Delete product |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/orders/create-order` | ✅ User | Place an order |
| `GET` | `/orders/myOrder` | ✅ User | Get my orders |
| `GET` | `/orders/allOrders` | ✅ Admin | Get all orders |
| `PATCH` | `/orders/:id` | ✅ Admin | Update order status |

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/user/register` | ❌ | Register new user |
| `POST` | `/user/login` | ❌ | Login → returns JWT |

### Order Status Values
```
pending → paid → shipped → cancelled
```

### Category Enum Values
```
phone | laptop | ipad | watch | AirPods
```
---

## 🔗 Related Repositories

| Repo | Description |
|------|-------------|
| 🔌 [m-market-backend](https://github.com/mumekonin/m-market-backend) | NestJS + MongoDB backend API |

---
