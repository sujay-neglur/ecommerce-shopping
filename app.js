const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
// import user route
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
// dotenv to get environment variables
require("dotenv").config();

// connect to database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

// register middleware
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

// register routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening on port ${port}`));

// const Category = require("./models/category");
// const Product = require("./models/product");
//
// Category.find()
//   .then(categories => {
//     const ids = [];
//     categories.forEach(category => ids.push(category._id));
//     return new Promise(resolve => resolve(ids));
//   })
//   .then(ids => {
//     Product.find().then(products => {
//       products.forEach(product => {
//         const catId = ids[Math.floor(Math.random() * Math.floor(ids.length))];
//         product.category = catId;
//         product.save();
//       });
//     });
//   })
//   .catch(err => console.log(err));
