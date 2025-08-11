const db = require('../models');
const Category = db.Category;

// Create a new Category
exports.create = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while creating the Category.'
    });
  }
};

// Retrieve all Categories
exports.findAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving categories.'
    });
  }
};

// Find a single Category with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findByPk(id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({
        message: `Cannot find Category with id=${id}.`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving Category with id=${id}`
    });
  }
};