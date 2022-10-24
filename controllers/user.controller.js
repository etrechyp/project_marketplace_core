const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const { validateObjectId } = require("../middlewares/validators");
const { generateJWT } = require("../middlewares/session");
const randomToken = require('random-token');

const getSpecificUser = async (req, res = response) => {
  try {
    const { id } = req.query;
    const [user] = await Promise.all([
      User.findById(id),
    ]);

    res.json({
      ok: true,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
};

const getAllUsers = async (req, res = response) => {
  try {
    const { pageSize = 25, pageNumber = 1 } = req.query;
    const query = { status: true };
    let page = pageNumber-1;
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(page*pageSize).limit(pageSize),
    ]);

    res.json({
      ok: true,
      total,
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
};

const createUser = async (req, res = response) => {
  try {
    const {
      email,
      password,
      isAdmin,
      ...leftover
    } = req.body;

    const validation = randomToken(6);
    const user = new User({
      email,
      password,
      isAdmin,
      validation,
      ...leftover,
    });

    if (password.length < 6)
      throw new Error("Password must be at least 6 characters long").message;

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();
    res.status(201).json({
      ok: "true",
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
};

const validateUser = async (req, res= response) => {
  try {
    const { email, validate, uid } = req.body;
       
    const { id, validation, verified } = await User.findOne({ email })

    if(validate !== validation)
      throw new Error("Invalid Validation ID").message;

   // if(verified)
   //  throw new Error("this user has been validate").message;

    const user = await User.findByIdAndUpdate( id, {
      verified: true
    });

    const token = await generateJWT(id)

    res.json({
      ok: true,
      msg: 'User validation done',
      user,
      token
    });

  } catch (err) {
    res.status(500).json({
      ok: "false",
      err,
    });
  }
}

const updateUser = async (req, res = response) => {
  try {
    const { id } = req.query;
    const { _id, password, ...leftover } = req.body;
    const idValidationResult = validateObjectId(id, "user");
    if (!idValidationResult.ok) throw new Error(idValidationResult.err).message;

    if (password) {
      const salt = bcryptjs.genSaltSync();
      leftover.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, leftover, {
      new: true,
      runValidators: true,
    });

    res.json({
      ok: "true",
      user,
    });
  } catch (err) {
    res.status(500).json({
      ok: "false",
      err,
    });
  }
};

const deleteUser = async (req, res = response) => {
  try {
    const { id: idToDisable } = req.query;
    const adminUser = req.user;
    const idValidationResult = validateObjectId(idToDisable, "user");

    if (!idValidationResult.ok) throw new Error(idValidationResult.err).message;

    if (adminUser.id === idToDisable)
      throw new Error("You can't disable yourself").message;

    const user = await User.findById(idToDisable);

    if (!user.status)
      throw new Error(`this user does no exist`).message;

    const disabledUser = await User.findByIdAndUpdate(
      idToDisable,
      { status: false },
      { new: true }
    );

    res.json({
      ok: "true",
      adminUser,
      disabledUser,
    });
  } catch (err) {
    res.status(500).json({
      ok: "false",
      err,
    });
  }
};

module.exports = {
  getSpecificUser,
  getAllUsers,
  createUser,
  validateUser,
  updateUser,
  deleteUser
};