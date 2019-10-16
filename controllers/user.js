const User = require("../models/user");

exports.signup = (req, res) => {
  const user = new User(req.body);
  console.log("user", user);
  user.save((err, user) => {
    if (err) return res.status(400).json(err);
    res.json(user);
  });
};
