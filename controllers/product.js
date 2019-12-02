const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .then(product => {
      req.product = product;
      next();
    })
    .catch(err => res.status(400).json({ error: "Product not found" }));
};
exports.create = (req, res) => {
  // formidable package used for managing form data
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: "Image could not be uploaded" });
    }
    // check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }
    let product = new Product(fields);
    // 1 kb=1000
    // 1 mb=1 Million
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1 MB in size"
        });
      }

      // related to formidable package
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product
      .save()
      .then(result => res.json(result))
      .catch(err => res.status(400).json({ error: errorHandler(err) }));
  });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.remove = (req, res) => {
  let product = req.product;
  product
    .remove()
    .then(deletedProduct => {
      res.json({
        message: "Product deleted successfully"
      });
    })
    .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

exports.update = (req, res) => {
  // formidable package used for managing form data
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: "Image could not be uploaded" });
    }
    // check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }
    let product = req.product;
    product = _.extend(product, fields);

    // 1 kb=1000
    // 1 mb=1 Million
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1 MB in size"
        });
      }

      // related to formidable package
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product
      .save()
      .then(result => res.json(result))
      .catch(err => res.status(400).json({ error: errorHandler(err) }));
  });
};

/*
 * sell/arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=10
 * if no params are sent then all products are returned
 */

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? Number(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .then(products => res.json(products))
    .catch(err => res.status(400).json({ error: "Products not found" }));
};

/**
 * It will find products based on request product category
 * Other products that has the same category will be returned
 */

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? Number(req.query.limit) : 6;
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .then(products => res.json(products))
    .catch(err => res.status(400).json({ error: "Categories not found" }));
};

exports.listCategories = (req, res) => {
  Product.distinct("category", {})
    .then(categories => res.json(categories))
    .catch(err => res.status(400).json({ error: "Product Not Found" }));
};

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .then(data =>
      res.json({
        size: data.length,
        data
      })
    )
    .catch(err =>
      res.status(400).json({
        error: "Products not found"
      })
    );
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  // Create query object to hold search values
  const query = {};
  // Assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    // assign category value to query.category
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }
    //Find product based on query object
    // search and category
    Product.find(query)
      .select("-photo")
      .then(products => res.json(products))
      .catch(err =>
        res.status(400).json({
          error: errorHandler(err)
        })
      );
  }
};
