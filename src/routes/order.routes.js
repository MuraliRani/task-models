module.exports = app => {
  const orders = require('../controllers/order.controller.js');
  const router = require('express').Router();

  // Create a new Order
  router.post('/', orders.create);

  // (Add more routes as needed)

  app.use('/api/orders', router);
};