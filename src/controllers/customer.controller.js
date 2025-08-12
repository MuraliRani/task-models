const db = require('../models');
const Customer = db.Customer;

// Create a new Customer
exports.create = async (req, res) => {
  //Added validation here
  if (!req.body.FirstName || !req.body.LastName || !req.body.Email) {
    return res.status(400).json({
      message: 'FirstName, LastName, and Email are required fields.'
    });
  }

  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while creating the Customer.'
    });
  }
};

// Retrieve all Customers
exports.findAll = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving customers.'
    });
  }
};

// Find a single Customer with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  //Validation for ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Valid Customer ID is required.' });
  }

  try {
    const customer = await Customer.findByPk(id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({
        message: `Cannot find Customer with id=${id}.`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving Customer with id=${id}`
    });
  }
};

// Update a Customer by the id
exports.update = async (req, res) => {
  const id = req.params.id;

  //Validation for ID and request body
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Valid Customer ID is required.' });
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty.' });
  }

  try {
    const [num] = await Customer.update(req.body, {
      where: { CustomerID: id }
    });

    if (num === 1) {
      res.status(200).json({
        message: 'Customer was updated successfully.'
      });
    } else {
      res.status(404).json({
        message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error updating Customer with id=${id}`
    });
  }
};

// Delete a Customer with the specified id
exports.delete = async (req, res) => {
  const id = req.params.id;

  //Validation for ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Valid Customer ID is required.' });
  }

  try {
    const num = await Customer.destroy({
      where: { CustomerID: id }
    });

    if (num === 1) {
      res.status(200).json({
        message: 'Customer was deleted successfully!'
      });
    } else {
      res.status(404).json({
        message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Could not delete Customer with id=${id}`
    });
  }
};

// Get customers who purchased a particular product by product name
exports.findCustomersByProductName = async (req, res) => {
  const { productName } = req.query;

  //Validation for query param
  if (!productName || productName.trim() === '') {
    return res.status(400).json({ message: "Product name is required." });
  }

  try {
    const db = require('../models');
    const customers = await db.Customer.findAll({
      include: [{
        model: db.Order,
        as: 'orders',
        include: [{
          model: db.OrderDetail,
          as: 'OrderDetails',
          include: [{
            model: db.Product,
            as: 'product',
            where: { ProductName: productName }
          }]
        }]
      }]
    });

    const filteredCustomers = customers
      .filter(customer =>
        customer.orders.some(order =>
          order.OrderDetails.some(detail =>
            detail.product && detail.product.ProductName === productName
          )
        )
      )
      .map(customer => ({
        CustomerID: customer.CustomerID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Email: customer.Email
      }));

    res.status(200).json(filteredCustomers);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while fetching customers by product name.'
    });
  }
};
