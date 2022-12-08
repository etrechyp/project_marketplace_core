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

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        birthdayDate:
 *          type: string
 *        address:
 *          type: string
 *        phone:
 *          type: string
 *      required:
 *        -email
 *        -password
 *        -firstName
 *        -lastName
 *        -birthdayDate
 *        -address
 *        -phone
 *      example:
 *        email: johndoe@email.com
 *        password: 123456
 *        firstName: John
 *        lastName: Doe
 *        birthdayDate: 1996-11-29T04:29:27.000Z
 *        address: 3844 Alejandra Forest
 *        phone: +15551230000
 */
/**
 * @swagger
 * /api/user:
 *  post:
 *    summary: create a new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json: 
 *          schema: 
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: new user added
 *      401:
 *        description: missing token
 *      500:
 *        description: internal server error
 */
router.post("/", check("email").custom(emailExist), createUser);

router.get("/all", [validateJWT, validateRole], getAllUsers);

router.get("/", [validateJWT, validateRole], getSpecificUser);

router.post("/validate", validateUser);

router.put("/", [validateJWT, validateRole], updateUser);

router.delete("/", [validateJWT, validateRole], deleteUser);

module.exports = router;
