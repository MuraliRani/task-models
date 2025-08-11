const db = require('../models');
const Customer = db.Customer;

// Create a new Customer
exports.create = async (req, res) => {
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