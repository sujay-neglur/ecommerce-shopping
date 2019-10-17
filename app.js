const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
// import user route
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
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

// register routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App listening on port ${port}`));
