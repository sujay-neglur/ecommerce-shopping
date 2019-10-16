const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// import user route
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
  .then(() => console.log("Database connected"));

// register middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use(morgan("dev"));
// app.use(cookieParser());

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App listening on port ${port}`));
