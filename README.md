# Ninja Sushi Shop

A React + Vite + Firebase demo e-commerce app for a sushi shop. Includes catalog browsing, product detail pages, cart & checkout overlay, favorites, address and orders pages, city/zones-based delivery settings, and an admin panel for managing products.

## Stack

- React 18 (Vite)
- Redux Toolkit
- React Router
- Firebase Auth, Firestore, Storage
- Tailwind + custom CSS

## Project structure

```
src/
  app/                # Redux store
  components/         # Reusable UI: header, nav, cart, etc
  features/           # Redux slices: cart, fav, sort, user, settings, checkout
  pages/              # Route pages: home, menu, categories, product detail, account
  images/, fonts/     # Assets
```

Key routes are declared in `src/App.jsx`.

## Running locally

1. Install deps

```
npm i
```

2. Start dev server

```
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Firebase config

Edit `src/firebase.js` with your Firebase project keys. The repo already contains a working public project for demo purposes.

### Firestore rules

See `firestore.rules` (summarized):

- Public read for product collections (e.g., `rolls`, `sushi`, ...)
- Write allowed only for admins: users who have document `users/{uid}` with `role: 'admin'`
- Per-user data (`users/{uid}/favorites`, `orders`, `addresses`) protected by ownership
- Cities/zones/settings write – admins only

### Storage rules

See `storage.rules`:

- Public read for images
- Write allowed only for admins (same admin check as in Firestore)

## Features

- Catalog lists with responsive slider/grid: `src/components/productItems/ProductItems.jsx`
- Product detail page with related products and favorites toggle
- Cart overlay with add/remove/increment and order summary
- Favorites synced per user in Firestore: `features/fav/favSlice.jsx`
- Settings (city, zones, delivery fee, min order): `features/settings/settingsSlice.js`
- Sort bar with filters, including "New": `components/sortbar/Sortbar.jsx`
- Badges on product card: New/Top (top-left), Eco/Spicy (bottom-right)

## Authentication

Google Sign-In via Firebase Auth. User state stored in `features/user/userSlice.jsx`. Role is fetched from Firestore:

- Document: `users/{uid}`
- Field: `role: 'admin' | 'user'`

## Admin panel (production)

- Route: `/admin/products`
- Access: only admins (based on role check)
- What you can do:
  - Choose a catalog (rolls/sushi/sets/snacks/drinks/sauces)
  - Add, edit, delete products
  - Upload images from your computer (Firebase Storage) or provide an external URL

Product fields supported:

- `title` (string)
- `price` (number, uah)
- `weight` (number, grams, optional)
- `desc` (string, optional)
- `image` (string, URL)
- flags: `isNew`, `isTop`, `spicy`, `eco`

## Demo admin for HR/testing

To allow non-admins (e.g., HR) to test without touching live DB, there is a demo mode for the same admin UI:

- Route: `/admin/products?demo=1` (включает общий демо-режим)
- Демо-режим также включает авто-логин как админ, поэтому можно пользоваться всем сайтом и админкой без реальной авторизации
- Нет требований к роли/аккаунту
- Все изменения в админке сохраняются только в браузерном `localStorage` (ключи `demo:{catalog}`) и не попадают в Firebase
- Загрузка файла сохраняет Data URL для предпросмотра

Tip: Refresh the page to confirm data persists only in your browser. Clear site data to reset.

## Deployment

- The repo includes `firebase.json` and `firestore.rules`. You can deploy hosting and rules via Firebase CLI.
- Alternatively, deploy the Vite build output to any static hosting (Vercel/Netlify). Build with:

```
npm run build
```

## Notable files

- Routing and app shell: `src/App.jsx`
- Product grid and badges: `src/components/productItems/ProductItems.jsx`
- Sort bar filters: `src/components/sortbar/Sortbar.jsx`
- Admin products: `src/pages/admin/AdminProducts.jsx`
- State: `src/app/store.js` and slices in `src/features/`

## Extending

- Add more catalogs by extending `CATALOGS` in `AdminProducts.jsx` and creating corresponding Firestore collections
- Add more filters in `Sortbar.jsx`
- Add role management UI or backend to assign roles to users

## License

This project is for demonstration and recruiting purposes.

# SHOP

_Transforming Shopping Into Seamless Experiences_

![Last Commit](https://img.shields.io/github/last-commit/f0xyris/shop?style=flat&logo=git&logoColor=white&color=0080ff)
![Top Language](https://img.shields.io/github/languages/top/f0xyris/shop?style=flat&color=0080ff)
![Languages Count](https://img.shields.io/github/languages/count/f0xyris/shop?style=flat&color=0080ff)

---

## Overview

Shop is a modern e-commerce web application built with React, Tailwind CSS, and Firebase. The project is focused on delivering scalable, secure, and visually appealing online shopping experiences.

### Why Shop?

SHOP simplifies the development of complex e-commerce platforms by integrating essential tools and best practices:

- 🔥 **Tailwind CSS Configuration:** Centralized styling setup for consistency and optimization.
- 🚀 **Firebase Security & Authentication:** Secure data access and user management, including Google sign-in.
- ⚙️ **React + Redux Architecture:** Scalable state management and dynamic UI rendering.
- 🎨 **Modular Components:** Reusable UI elements for rapid development.
- ⚡ **Vite Build Optimization:** Faster builds and enhanced performance.
- 📁 Clear project structure supporting complex e-commerce workflows.

---

## Getting Started

### Prerequisites

- JavaScript
- npm

### Installation

```bash
git clone https://github.com/f0xyris/shop
cd shop
npm install
```

### Usage & Testing

```bash
npm start
npm test
```
