module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Category",
        key: "CategoryID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  }, {
    tableName: "Product",
    timestamps: true,
  });

  Product.synchronize = async (options = { alter: true }) => {
    try {
      await Product.sync(options);
      console.log("Product model synchronized successfully");
      return true;
    } catch (error) {
      console.error("Failed to synchronize Product model:", error.message);
      return false;
    }
  };

  return Product;
};