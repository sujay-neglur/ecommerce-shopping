const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .then(user => {
      req.profile = user;
      next();
    })
    .catch(err => res.status(400).json({ error: "User not found" }));
};

exports.read = (req, res) => {
  req.profile.hashedPassword = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false }
  )
    .then(user => {
      user.hashedPassword = undefined;
      user.salt = undefined;
      return res.json(user);
    })
    .catch(err =>
      res
        .status(400)
        .json({ error: "You are not authorized to perform this action" })
    );
};
