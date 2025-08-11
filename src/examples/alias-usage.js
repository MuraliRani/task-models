/**
 * This file demonstrates how to use the various aliases defined in the model associations
 */

const db = require('../models');
const Customer = db.Customer;
const Product = db.Product;
const Order = db.Order;
const OrderDetail = db.OrderDetail;
const Category = db.Category;

// Example 1: Find all products in a category using different aliases
async function findProductsByCategory(categoryId) {
  try {
    // Using the 'products' alias
    const categoryWithProducts = await Category.findByPk(categoryId, {
      include: [{
        model: Product,
        as: 'products'
      }]
    });
    
    // Using the 'categoryProducts' alias
    const categoryWithProductsAlt = await Category.findByPk(categoryId, {
      include: [{
        model: Product,
        as: 'categoryProducts'
      }]
    });
    
    return {
      usingProductsAlias: categoryWithProducts,
      usingCategoryProductsAlias: categoryWithProductsAlt
    };
  } catch (error) {
    console.error('Error finding products by category:', error);
    throw error;
  }
}

// Example 2: Find a product with its category using different aliases
async function findProductWithCategory(productId) {
  try {
    // Using the 'category' alias
    const productWithCategory = await Product.findByPk(productId, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    
    // Using the 'productCategory' alias
    const productWithCategoryAlt = await Product.findByPk(productId, {
      include: [{
        model: Category,
        as: 'productCategory'
      }]
    });
    
    return {
      usingCategoryAlias: productWithCategory,
      usingProductCategoryAlias: productWithCategoryAlt
    };
  } catch (error) {
    console.error('Error finding product with category:', error);
    throw error;
  }
}

// Example 3: Find all orders for a customer using different aliases
async function findOrdersByCustomer(customerId) {
  try {
    // Using the 'orders' alias
    const customerWithOrders = await Customer.findByPk(customerId, {
      include: [{
        model: Order,
        as: 'orders'
      }]
    });
    
    // Using the 'customerOrders' alias
    const customerWithOrdersAlt = await Customer.findByPk(customerId, {
      include: [{
        model: Order,
        as: 'customerOrders'
      }]
    });
    
    return {
      usingOrdersAlias: customerWithOrders,
      usingCustomerOrdersAlias: customerWithOrdersAlt
    };
  } catch (error) {
    console.error('Error finding orders by customer:', error);
    throw error;
  }
}

// Example 4: Find order details (items) for an order using different aliases
async function findOrderItems(orderId) {
  try {
    // Using the 'orderDetails' alias
    const orderWithDetails = await Order.findByPk(orderId, {
      include: [{
        model: OrderDetail,
        as: 'orderDetails'
      }]
    });
    
    // Using the 'items' alias
    const orderWithItems = await Order.findByPk(orderId, {
      include: [{
        model: OrderDetail,
        as: 'items'
      }]
    });
    
    return {
      usingOrderDetailsAlias: orderWithDetails,
      usingItemsAlias: orderWithItems
    };
  } catch (error) {
    console.error('Error finding order items:', error);
    throw error;
  }
}

// Example 5: Find all order details for a product using different aliases
async function findOrderDetailsByProduct(productId) {
  try {
    // Using the 'orderDetails' alias
    const productWithOrderDetails = await Product.findByPk(productId, {
      include: [{
        model: OrderDetail,
        as: 'orderDetails'
      }]
    });
    
    // Using the 'purchases' alias
    const productWithPurchases = await Product.findByPk(productId, {
      include: [{
        model: OrderDetail,
        as: 'purchases'
      }]
    });
    
    return {
      usingOrderDetailsAlias: productWithOrderDetails,
      usingPurchasesAlias: productWithPurchases
    };
  } catch (error) {
    console.error('Error finding order details by product:', error);
    throw error;
  }
}

// Example 6: Find customers who purchased a specific product using the new aliases
async function findCustomersByProduct(productId) {
  try {
    const customers = await Customer.findAll({
      include: [{
        model: Order,
        as: 'customerOrders', // Using the new alias
        required: true,
        include: [{
          model: OrderDetail,
          as: 'items', // Using the new alias
          required: true,
          where: { ProductID: productId },
          include: [{
            model: Product,
            as: 'orderedProduct' // Using the new alias
          }]
        }]
      }]
    });
    
    return customers;
  } catch (error) {
    console.error('Error finding customers by product:', error);
    throw error;
  }
}

module.exports = {
  findProductsByCategory,
  findProductWithCategory,
  findOrdersByCustomer,
  findOrderItems,
  findOrderDetailsByProduct,
  findCustomersByProduct
};