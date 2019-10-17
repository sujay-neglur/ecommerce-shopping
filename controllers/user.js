const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .then(user => {
      req.profile = user;
      next();
    })
    .catch(err => res.status(400).json({ error: "User not found" }));
};
