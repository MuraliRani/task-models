module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    "OrderDetail",
    {
      OrderID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Order",
          key: "OrderID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ProductID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Product",
          key: "ProductID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "OrderDetail",
      timestamps: true,
    }
  );

  OrderDetail.synchronize = async (options = { alter: true }) => {
    try {
      await OrderDetail.sync(options);
      console.log("OrderDetail model synchronized successfully");
      return true;
    } catch (error) {
      console.error("Failed to synchronize OrderDetail model:", error.message);
      return false;
    }
  };

  return OrderDetail;
};
