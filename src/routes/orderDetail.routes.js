module.exports = app => {
  const orderDetails = require('../controllers/orderDetail.controller.js');
  const router = require('express').Router();

  // Create a new OrderDetail
  router.post('/', orderDetails.create);

  // (Add more routes as needed)

  app.use('/api/orderDetails', router);
};