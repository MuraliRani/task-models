module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      CategoryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: "Category",
      timestamps: true,
    }
  );

  Category.synchronize = async (options = { alter: true }) => {
    try {
      await Category.sync(options);
      console.log("Category model synchronized successfully");
      return true;
    } catch (error) {
      console.error("Failed to synchronize Category model:", error.message);
      return false;
    }
  };

  return Category;
};
