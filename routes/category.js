const express = require("express");
const router = express.Router();
const {
  create,
  categoryById,
  read,
  update,
  remove,
  list
} = require("../controllers/category");
const { requireSignin, isAdmin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.param("userId", userById);
router.param("categoryId", categoryById);

router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/category/:categoryId", read);
router.put(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.put(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.get("/categories/", list);

module.exports = router;
