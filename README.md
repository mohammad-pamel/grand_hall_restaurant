# 🍽️ Grand Hall Restaurant

Live Website: https://grand-hall.web.app/

---

## 📌 Project Overview

**Grand Hall Restaurant** is a full-stack restaurant management web application that allows users to browse food items, place orders, manage wishlists, and leave reviews.  

The system also includes a powerful admin dashboard where admins can manage users, promote users to admin, add food items, and control orders efficiently.

This project demonstrates a modern full-stack architecture using React, Node.js, Express, MongoDB, and Firebase Authentication.

---

## 🚀 Live Demo

👉 https://grand-hall.web.app/

---

## 🔐 Admin Credentials

- **Email:** admin@gmail.com  
- **Password:** @Admin1

---

## ✨ Key Features

### 👤 User Features
- Email/password login + Google login (Firebase Auth)
- Browse all food items (menu system)
- Search and sort food items
- Add items to wishlist
- Place food orders with details (name, address, phone, etc.)
- View order history
- Cancel pending orders
- Submit reviews & ratings
- Responsive UI (mobile/tablet/desktop)
- Light/Dark mode support

---

### 👨‍🍳 Admin Features
- Manage all users
- Promote users to **Admin**
- Add new food items to menu
- Edit / delete food items
- Manage all orders (pending → processing → delivered)
- Full dashboard control
- View system analytics (optional extension)

---

## 🎨 UI & Design
- Fully responsive layout
- Modern card-based food UI
- Clean dashboard sidebar (collapsible)
- Smooth animations and transitions
- Skeleton loaders for better UX
- Consistent navbar + footer design
- Eye-friendly color system

---

## 🧩 Pages & Structure

### 🏠 Home Page
- Hero banner with slider
- Featured food items section
- Why choose Grand Hall section
- Customer reviews section
- Call-to-action sections

---

### 🍔 Menu / Food Pages
- All food items page (grid layout)
- Food details page
- Order modal (name, phone, address, quantity)
- Search & filter functionality

---

### 📊 Dashboard

#### 👤 User Dashboard
- My Orders
- My Profile
- Wishlist

#### 🛠️ Admin Dashboard
- Manage Users
- Manage Food Items
- Manage Orders
- Promote Users to Admin

---

## 🛠️ Technologies Used

### Frontend
- React.js
- Tailwind CSS
- React Router
- TanStack Query (optional)
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Deployment
- Firebase Hosting (Client)
- Render / Vercel / Railway (Server)

---

## 📁 Project Structure
grand-hall-restaurant/
│
├── client/ # React Frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── layouts/
│ ├── hooks/
│ └── App.jsx
│
├── server/ # Node.js Backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── server.js
│
├── .env.example
└── README.md

---

## 🔐 Security Notes
- Firebase API keys stored in `.env`
- MongoDB credentials hidden using environment variables
- Protected admin routes with JWT
- Input validation for orders and forms

---

## 📌 Future Improvements
- Payment gateway integration
- Real-time order tracking
- Email notifications
- Advanced analytics dashboard
- Multi-restaurant support

---

## 👨‍💻 Developer Notes
This project supports:
- Admin can promote users to admin
- Admin can manage food items
- Admin can manage all orders
- Users can browse, order, review food items

---

## ⭐ Thank You

If you like this project, feel free to star ⭐ the repository and contribute!
```
