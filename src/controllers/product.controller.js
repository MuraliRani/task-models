const db = require('../models');
const Product = db.Product;
const Customer = db.Customer;
const Order = db.Order;
const OrderDetail = db.OrderDetail;
const { Op } = db.Sequelize;

// Create a new Product
exports.create = async (req, res) => {
  try {
    // Check if CategoryID exists
    if (req.body.CategoryID) {
      const category = await db.Category.findByPk(req.body.CategoryID);
      if (!category) {
        return res.status(400).json({
          message: `Category with ID=${req.body.CategoryID} not found. Please provide a valid CategoryID.`
        });
      }
    } else {
      return res.status(400).json({
        message: 'CategoryID is required for creating a product.'
      });
    }
    
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    // Check for foreign key constraint error
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Cannot create product: The specified CategoryID does not exist. Please create the category first or use an existing CategoryID.'
      });
    }
    
    res.status(500).json({
      message: error.message || 'Some error occurred while creating the Product.'
    });
  }
};

// Retrieve all Products
exports.findAll = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving products.'
    });
  }
};

// Find a single Product with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findByPk(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({
        message: `Cannot find Product with id=${id}.`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving Product with id=${id}`
    });
  }
};

// Update a Product by the id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Product.update(req.body, {
      where: { ProductID: id }
    });

    if (num === 1) {
      res.status(200).json({
        message: 'Product was updated successfully.'
      });
    } else {
      res.status(404).json({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error updating Product with id=${id}`
    });
  }
};

// Delete a Product with the specified id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Product.destroy({
      where: { ProductID: id }
    });

    if (num === 1) {
      res.status(200).json({
        message: 'Product was deleted successfully!'
      });
    } else {
      res.status(404).json({
        message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Could not delete Product with id=${id}`
    });
  }
};

// Find all customers who purchased a specific product by product name
exports.findCustomersByProductName = async (req, res) => {
  const { productName } = req.query;
  
  if (!productName) {
    return res.status(400).json({
      message: 'Product name is required!'
    });
  }

  try {
    // Find products matching the name
    const products = await Product.findAll({
      where: {
        ProductName: {
          [Op.like]: `%${productName}%`
        }
      }
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: `No products found with name containing '${productName}'`
      });
    }

    const productIds = products.map(product => product.ProductID);

    // Find customers who purchased these products (using new aliases)
    const customers = await Customer.findAll({
      attributes: ['CustomerID', 'FirstName', 'LastName', 'Email'],
      include: [{
        model: Order,
        as: 'customerOrders', // Using the new alias instead of 'orders'
        required: true,
        include: [{
          model: OrderDetail,
          as: 'items', // Using the new alias instead of 'orderDetails'
          required: true,
          where: {
            ProductID: {
              [Op.in]: productIds
            }
          }
        }]
      }]
    });

    // Return unique customers
    const uniqueCustomers = customers.map(customer => ({
      id: customer.CustomerID,
      firstName: customer.FirstName,
      lastName: customer.LastName,
      email: customer.Email
    }));

    res.status(200).json(uniqueCustomers);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error finding customers who purchased '${productName}'`
    });
  }
};