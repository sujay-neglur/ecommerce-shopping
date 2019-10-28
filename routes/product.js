const express = require("express");
const router = express.Router();
const { requireSignin, isAdmin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo
} = require("../controllers/product");

router.param("userId", userById);
router.param("productId", productById);

router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);

router.get("/product/:productId", read);

router.get("/products/related/:productId", listRelated);

router.get("/products/categories", listCategories);

router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);

router.post("/products/by/search", listBySearch);

router.get("/products", list);

router.get("/product/photo/:productId", photo);

module.exports = router;
