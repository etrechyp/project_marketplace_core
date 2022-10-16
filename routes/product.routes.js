const { Router } = require("express");
const {
  createProduct,
  getAllProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct } = require("../controllers/product.controller");
const { 
  validateRole,
  productExist } = require("../middlewares/validators");
const { validateJWT } = require("../middlewares/session");


const router = Router();

router.post("/",[ validateJWT ], createProduct);

router.get("/all", getAllProducts);

router.get("/", getSpecificProduct);

router.put("/", [ validateJWT, validateRole ], updateProduct);

router.delete("/", [ validateJWT, validateRole ], deleteProduct)





module.exports = router;