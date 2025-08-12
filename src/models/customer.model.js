module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      CustomerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      FirstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      LastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Customer",
      timestamps: true,
    }
  );

  Customer.synchronize = async (options = { alter: true }) => {
    try {
      await Customer.sync(options);
      console.log("Customer model synchronized successfully");
      return true;
    } catch (error) {
      console.error("Failed to synchronize Customer model:", error.message);
      return false;
    }
  };

  return Customer;
};
