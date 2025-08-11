# E-commerce API with Node.js and Sequelize

This project is a RESTful API for an e-commerce application built with Node.js, Express, and Sequelize ORM. It includes models for Customers, Products, Orders, OrderDetails, and Categories with proper associations and foreign keys.

## Project Structure

```
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
├── README.md             # Project documentation
├── src/
│   ├── config/           # Configuration files
│   │   └── database.js   # Database configuration
│   ├── controllers/      # Request handlers
│   │   ├── customer.controller.js
│   │   └── product.controller.js
│   ├── models/           # Sequelize models
│   │   ├── index.js      # Model associations
│   │   ├── customer.model.js
│   │   ├── category.model.js
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │   └── orderDetail.model.js
│   ├── routes/           # API routes
│   │   ├── customer.routes.js
│   │   └── product.routes.js
│   ├── utils/            # Utility functions
│   │   ├── syncModels.js # Model synchronization
│   │   └── modelUpdater.js # Model column updater
│   └── server.js         # Express app
```

## Database Schema

The application uses the following database schema:

- **Customer**: Stores customer information
- **Category**: Product categories
- **Product**: Product information with category reference
- **Order**: Order information with customer reference
- **OrderDetail**: Junction table for Order-Product relationship

## API Endpoints

### Customer Endpoints

- `GET /api/customers`: Get all customers
- `GET /api/customers/:id`: Get a specific customer
- `POST /api/customers`: Create a new customer
- `PUT /api/customers/:id`: Update a customer
- `DELETE /api/customers/:id`: Delete a customer

### Product Endpoints

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product
- `GET /api/products/customers-by-product?productName=name`: Get customers who purchased a specific product

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` file
4. Start the server: `npm start` or `npm run dev` for development

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=ecommerce_db
DB_DIALECT=mysql
PORT=3000
NODE_ENV=development
```

## Features

- RESTful API with Express
- MySQL database with Sequelize ORM
- Automatic database schema updates during development
- Explicit foreign key relationships
- API to find customers who purchased a specific product

## Model Associations and Aliases

The project uses Sequelize associations with aliases to define relationships between models:

1. **Category - Product (One-to-Many)**:
   - A Category has many Products
   - Aliases: `products`, `categoryProducts` (Category → Products)
   - Aliases: `category`, `productCategory` (Product → Category)

2. **Customer - Order (One-to-Many)**:
   - A Customer has many Orders
   - Aliases: `orders`, `customerOrders` (Customer → Orders)
   - Aliases: `customer`, `orderCustomer` (Order → Customer)

3. **Order - OrderDetail (One-to-Many)**:
   - An Order has many OrderDetails
   - Aliases: `orderDetails`, `items` (Order → OrderDetails)
   - Aliases: `order`, `parentOrder` (OrderDetail → Order)

4. **Product - OrderDetail (One-to-Many)**:
   - A Product has many OrderDetails
   - Aliases: `orderDetails`, `purchases` (Product → OrderDetails)
   - Aliases: `product`, `orderedProduct` (OrderDetail → Product)

## Model Synchronization

This project includes utilities to help with model synchronization when adding new columns:

1. **Automatic Sync on Startup**: The server automatically syncs all models with the database on startup using `{ alter: true }` option, which adds new columns to existing tables.

2. **Individual Model Synchronization**: Each model has a `synchronize` method that can be called to synchronize just that model with the database.

3. **Synchronize All Models**: The `db.synchronizeAllModels()` method can be used to synchronize all models individually.

4. **Model Updater Utility**: Use the `modelUpdater.js` utility to programmatically add new columns to models and sync them with the database.

### Adding a New Column

To add a new column to a model:

1. **Edit the Model File**: Add the new column to the model definition in the appropriate model file.

2. **Automatic Sync**: The column will be automatically added to the database table when the server starts.

3. **Programmatic Addition**: Alternatively, use the `addColumnAndSync` function from `utils/modelUpdater.js` to add columns programmatically.

Examples:

```javascript
// Example 1: Using the modelUpdater utility
const Customer = require('./models/customer.model');
const { addColumnAndSync } = require('./utils/modelUpdater');
const { DataTypes } = require('sequelize');

// Add a new column to the Customer model
addColumnAndSync(Customer, 'PhoneNumber', {
  type: DataTypes.STRING(20),
  allowNull: true
});

// Example 2: Using the model's synchronize method
const db = require('./models');

// Synchronize a specific model
await db.Customer.synchronize({ alter: true });

// Synchronize all models individually
await db.synchronizeAllModels({ alter: true });
```