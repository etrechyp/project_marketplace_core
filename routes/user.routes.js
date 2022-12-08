const { Router } = require("express");
const { emailExist } = require("../middlewares/validators");
const { check } = require("express-validator");
const {
  getSpecificUser,
  getAllUsers,
  validateUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { validateRole } = require("../middlewares/validators");
const { validateJWT } = require("../middlewares/session");

const router = Router();

router.post("/", check("email").custom(emailExist), createUser);

router.get("/all", [validateJWT, validateRole], getAllUsers);

router.get("/", [validateJWT, validateRole], getSpecificUser);

router.post("/validate", validateUser);

router.put("/", [validateJWT, validateRole], updateUser);

router.delete("/", [validateJWT, validateRole], deleteUser);

module.exports = router;
