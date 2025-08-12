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

// Customer - Order (One-to-Many)
db.Customer.hasMany(db.Order, {
  foreignKey: 'CustomerID',
  as: 'orders'
});
db.Order.belongsTo(db.Customer, {
  foreignKey: 'CustomerID',
  as: 'customer'
});

// Order - OrderDetail (One-to-Many)
db.Order.hasMany(db.OrderDetail, {
  foreignKey: 'OrderID',
  as: 'OrderDetails'
});
db.OrderDetail.belongsTo(db.Order, {
  foreignKey: 'OrderID',
  as: 'order'
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