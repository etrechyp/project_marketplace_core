const { Router } = require("express");
const { categoryExist } = require("../middlewares/validators");
const { check } = require("express-validator");
const {
  getSpecificCategory,
  getAllCategorys,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/category.controller");
const { validateRole } = require("../middlewares/validators");
const { validateJWT } = require("../middlewares/session");


const router = Router();

router.post("/", check("category").custom(categoryExist), [ validateJWT ], createCategory);

router.get("/all", [ validateJWT, validateRole ], getAllCategorys);

router.get("/", [ validateJWT, validateRole ], getSpecificCategory);

router.put("/", [ validateJWT, validateRole ], updateCategory);

router.delete("/", [ validateJWT, validateRole ],  deleteCategory);

module.exports = router;