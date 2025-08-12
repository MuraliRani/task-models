require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();

// Configure CORS
app.use(cors());
// Parse requests of content-type - application/json
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Sync database with { alter: true } for development
// This will update the database schema when new columns are added to models
db.synchronizeAllModels({ alter: true })
  .then(() => {
    console.log("Database schema is up to date with all model definitions.");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err.message);
  });

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the E-commerce API." });
});

// Include routes
require("./routes/customer.routes")(app);
require("./routes/product.routes")(app);
require("./routes/category.routes")(app);
require("./routes/order.routes")(app);
require("./routes/orderDetail.routes")(app);

// Set port and listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
