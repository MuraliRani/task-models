const db = require('../models');
const OrderDetail = db.OrderDetail;

exports.create = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.create(req.body);
    res.status(201).json(orderDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};