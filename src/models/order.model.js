module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    OrderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Customer",
        key: "CustomerID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    OrderD: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: "Order",
    timestamps: true,
  });

  Order.synchronize = async (options = { alter: true }) => {
    try {
      await Order.sync(options);
      console.log("Order model synchronized successfully");
      return true;
    } catch (error) {
      console.error("Failed to synchronize Order model:", error.message);
      return false;
    }
  };

  return Order;
};