# ExpressShop

A server-rendered e-commerce application built with **Node.js**, **Express 5**, **MongoDB** and **EJS**. Users can browse a paginated product catalog, manage a shopping cart, place orders and download PDF invoices. Authenticated users can also list, edit and delete their own products.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running MongoDB with Docker](#running-mongodb-with-docker)
  - [Running the App](#running-the-app)
- [Routes](#routes)
- [Debugging](#debugging)
- [Author](#author)

---

## Features

- **Authentication**: sign up, log in and log out, with passwords hashed using `bcryptjs` and sessions stored in MongoDB (`express-session` + `connect-mongo`).
- **Input validation**: form validation with `express-validator`, with errors shown through flash messages (`connect-flash`).
- **Product management**: create, edit and delete products with image uploads (`multer`, PNG/JPG/JPEG only). Users can only change products they own.
- **Asynchronous deletion**: products are removed from the admin view using `fetch` and a `DELETE` request, with no page reload.
- **Shopping cart**: add and remove items; the cart is saved on the user's record.
- **Checkout and orders**: review the cart at checkout, place orders and view order history.
- **PDF invoices**: invoices are generated on the fly with `pdfkit`. Only the user who placed the order can download its invoice.
- **Pagination**: a reusable pagination partial for the shop and product listings.
- **Error handling**: dedicated 404 and 500 pages.

## Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Runtime        | Node.js                           |
| Framework      | Express 5                         |
| Database / ODM | MongoDB, Mongoose                 |
| Templating     | EJS                               |
| Sessions       | express-session, connect-mongo    |
| Validation     | express-validator                 |
| File uploads   | Multer                            |
| PDF generation | PDFKit                            |
| Dev tooling    | Nodemon, Docker Compose, Prettier |

## Project Structure

```
.
├── app.js               # App entry point: middleware, sessions, routes, error handling
├── controllers/         # Request handlers (admin, auth, shop, error)
├── middleware/          # Custom middleware (is-auth route guard)
├── models/              # Mongoose models (User, Product, Order)
├── routes/              # Route definitions (admin, auth, shop)
├── views/               # EJS templates
│   ├── admin/           # Product management pages
│   ├── auth/            # Login and signup pages
│   ├── includes/        # Shared partials (head, navigation, pagination, ...)
│   └── shop/            # Storefront, cart, checkout, orders
├── public/              # Static assets (CSS and client-side JS)
├── images/              # Uploaded product images (created at runtime)
├── data/                # Invoice output (data/invoices)
├── utils/               # Database connection and helpers
└── docker-compose.yml   # Local MongoDB service
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm
- [Docker](https://www.docker.com/) (optional, for running MongoDB locally)

### Installation

```bash
git clone git@github.com:biancavlz/ExpressShop.git
cd ExpressShop
npm install
```

Create the folders the app writes to at runtime:

```bash
mkdir -p images data/invoices
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Application
MONGO_URI=mongodb://<user>:<password>@localhost:27017/<database>?authSource=admin
EXPRESS_SESSION_SECRET=<a-long-random-string>

# Used by docker-compose to set up the MongoDB container
MONGO_INITDB_ROOT_USERNAME=<user>
MONGO_INITDB_ROOT_PASSWORD=<password>
MONGO_INITDB_DATABASE=<database>
```

| Variable                     | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `MONGO_URI`                  | MongoDB connection string for data and sessions |
| `EXPRESS_SESSION_SECRET`     | Secret used to sign the session cookie          |
| `MONGO_INITDB_ROOT_USERNAME` | Root username for the Docker MongoDB container  |
| `MONGO_INITDB_ROOT_PASSWORD` | Root password for the Docker MongoDB container  |
| `MONGO_INITDB_DATABASE`      | Initial database created in the container       |

> `.env` is listed in `.gitignore`. Never commit credentials.

### Running MongoDB with Docker

```bash
docker compose up -d
```

This starts MongoDB on `localhost:27017`, with data saved in the `mongodb_data` volume.

### Running the App

```bash
npm start
```

The server starts with Nodemon, so it restarts when files change. Open **http://localhost:3001**.

## Routes

### Shop

| Method | Path                   | Auth | Description                        |
| ------ | ---------------------- | :--: | ---------------------------------- |
| GET    | `/`                    |      | Home page (paginated)              |
| GET    | `/products`            |      | Product list (paginated)           |
| GET    | `/products/:productId` |      | Product details                    |
| GET    | `/cart`                |  ✔   | View cart                          |
| POST   | `/cart`                |  ✔   | Add a product to the cart          |
| POST   | `/cart-delete-item`    |  ✔   | Remove a product from the cart     |
| GET    | `/checkout`            |  ✔   | Checkout page                      |
| POST   | `/create-order`        |  ✔   | Place an order from the cart       |
| GET    | `/orders`              |  ✔   | Order history                      |
| GET    | `/orders/:orderId`     |  ✔   | Download the order's invoice (PDF) |

### Admin

| Method | Path                             | Auth | Description        |
| ------ | -------------------------------- | :--: | ------------------ |
| GET    | `/admin/add-product`             |  ✔   | New product form   |
| POST   | `/admin/add-product`             |  ✔   | Create a product   |
| GET    | `/admin/products`                |  ✔   | List your products |
| GET    | `/admin/edit-product/:productId` |  ✔   | Edit product form  |
| POST   | `/admin/edit-product`            |  ✔   | Update a product   |
| DELETE | `/admin/product/:productId`      |  ✔   | Delete a product   |

### Auth

| Method | Path      | Description    |
| ------ | --------- | -------------- |
| GET    | `/login`  | Login form     |
| POST   | `/login`  | Log in         |
| GET    | `/signup` | Signup form    |
| POST   | `/signup` | Create account |
| POST   | `/logout` | Log out        |

## Debugging

A VS Code launch configuration is included in `launch.json` (**Debug App**). Copy it to `.vscode/launch.json` to start `app.js` with the debugger attached.
