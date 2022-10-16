const { response, request } = require("express");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model");

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    JWT.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("the token could not be generated");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const validateJWT = async (req = request, res = response, next) => {
  const session = req.headers.authorization;
  
  if (!session) {
    return res.status(401).json({
      ok: false,
      msg: "missing token",
    });
  }

  try {
    const token = await session.split(' ')[1];
    const { uid } = JWT.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);
    if (!user || !user.status) {
      return res.status(401).json({
        ok: false,
        msg: "invalid token, user no exist",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      ok: false,
      msg: "invalid token",
    });
  }
};

module.exports = {
  generateJWT,
  validateJWT
};