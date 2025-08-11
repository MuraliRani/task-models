const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: dbConfig.logging
  }
);

// Initialize models object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Customer = require('./customer.model')(sequelize, Sequelize);
db.Category = require('./category.model')(sequelize, Sequelize);
db.Product = require('./product.model')(sequelize, Sequelize);
db.Order = require('./order.model')(sequelize, Sequelize);
db.OrderDetail = require('./orderDetail.model')(sequelize, Sequelize);

// Define associations

// Category - Product (One-to-Many)
db.Category.hasMany(db.Product, {
  foreignKey: 'CategoryID',
  as: 'products'
});
db.Product.belongsTo(db.Category, {
  foreignKey: 'CategoryID',
  as: 'category'
});

// Additional alias for Category - Product
db.Category.hasMany(db.Product, {
  foreignKey: 'CategoryID',
  as: 'categoryProducts'
});
db.Product.belongsTo(db.Category, {
  foreignKey: 'CategoryID',
  as: 'productCategory'
});

// Customer - Order (One-to-Many)
db.Customer.hasMany(db.Order, {
  foreignKey: 'CustomerID',
  as: 'orders'
});
db.Order.belongsTo(db.Customer, {
  foreignKey: 'CustomerID',
  as: 'customer'
});

// Additional alias for Customer - Order
db.Customer.hasMany(db.Order, {
  foreignKey: 'CustomerID',
  as: 'customerOrders'
});
db.Order.belongsTo(db.Customer, {
  foreignKey: 'CustomerID',
  as: 'orderCustomer'
});

// Order - OrderDetail (One-to-Many)
db.Order.hasMany(db.OrderDetail, {
  foreignKey: 'OrderID',
  as: 'orderDetails'
});
db.OrderDetail.belongsTo(db.Order, {
  foreignKey: 'OrderID',
  as: 'order'
});

// Additional alias for Order - OrderDetail
db.Order.hasMany(db.OrderDetail, {
  foreignKey: 'OrderID',
  as: 'items'
});
db.OrderDetail.belongsTo(db.Order, {
  foreignKey: 'OrderID',
  as: 'parentOrder'
});

// Product - OrderDetail (One-to-Many)
db.Product.hasMany(db.OrderDetail, {
  foreignKey: 'ProductID',
  as: 'orderDetails'
});
db.OrderDetail.belongsTo(db.Product, {
  foreignKey: 'ProductID',
  as: 'product'
});

// Additional alias for Product - OrderDetail
db.Product.hasMany(db.OrderDetail, {
  foreignKey: 'ProductID',
  as: 'purchases'
});
db.OrderDetail.belongsTo(db.Product, {
  foreignKey: 'ProductID',
  as: 'orderedProduct'
});

// Synchronize all models individually
db.synchronizeAllModels = async (options = { alter: true }) => {
  try {
    console.log('Synchronizing all models individually...');
    await db.Customer.synchronize(options);
    await db.Category.synchronize(options);
    await db.Product.synchronize(options);
    await db.Order.synchronize(options);
    await db.OrderDetail.synchronize(options);
    console.log('All models synchronized successfully');
    return true;
  } catch (error) {
    console.error('Failed to synchronize all models:', error.message);
    return false;
  }
};

module.exports = db;