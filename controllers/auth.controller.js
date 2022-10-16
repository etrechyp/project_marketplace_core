const { response } = require("express");
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../middlewares/session");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User not found",
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!user || !user.status || !validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Wrong email or password",
      });
    }

    const token = await generateJWT(user.id);

    if ( !user.verified ) {
      let validation = user.validation
      return res.json({
        msg: "User not verified",
        validation
      });
    }

    res.json({
      msg: "login OK",
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error, please contact with Admin",
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid } = req.body;
  const { authorization } = req.headers;
  try {
    const user = await User.findById(uid);
    if (!user) {
        return res.status(400).json({
          ok: false,
          msg: "User not found",
        });
      }

    if(!user.verified)
      throw new Error("invalid uid").message;

    if(req.headers && authorization.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')){
      const token = await generateJWT(user.uid);
      res.json({
        ok: true,
        token
      });
    }
  } catch (err) {
    return res.status(500).json({
      ok: false,
      err,
    });
  }
};

module.exports = {
  login,
  renewToken
};