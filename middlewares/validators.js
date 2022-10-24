const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../models/user.model");
const { response } = require("express");

const validateRole = (req, res = response, next) => {
  if( !req.user){
      return res.status(500).json({
          ok: false,
          msg: "the role cannot be verified without first verifying the auth token"
      })
  }
  const { isAdmin } =  req.user;
  if (isAdmin !== true){
      return res.status(401).json({
          ok: false,
          msg: 'this user is not administrator '
      })
  }
  next();
}

const validateObjectId = (_id, type) => {
  if (!ObjectId.isValid(_id)) {
    return {
      ok: false,
      err: `${type} id not valid`,
    };
  }
  return {
    ok: true,
  };
};

const emailExist = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new Error(`${email} already exist`);
  }
};

const categoryExist = async (category = "") => {
  const categoryExist = await Category.findOne({ category });
  if (categoryExist) {
    throw new Error(`${category} already exist`);
  }
};

module.exports = {
  validateRole,
  validateObjectId,
  emailExist,
  categoryExist
};