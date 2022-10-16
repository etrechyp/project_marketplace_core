const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: (name) => {
        return name.length > 0 && name.length <= 64;
      },
      message: `that is not a valid name!`,
    },
  },

  lastName: {
    type: String,
    required: true,
    validate: {
      validator: (name) => {
        return name.length > 0 && name.length <= 64;
      },
      message: `that is not a valid name!`,
    },
  },
  
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => {
        return (
          email.length > 0 &&
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        );
      },
      message: `that is not a valid email!`,
    },
  },
  
  password: {
    type: String,
    required: [true, "Password is mandatory"],
  },
  
  phone: {
    type: String,
  },

  address: {
    type: String,
    required: [true, "address is mandatory"],
    validate: {
      validator: (address) => {
        return address.length > 0;
      },
      message: "address must not be an empty field",
    },
  },

  address_2: {
    type: String,
    default: ""
  },
  
  zipcode: {
    type: String,
    validate: {
      validator: (zipcode) => {
        const usRegex = /^[0-9]{5}$/;
        return usRegex.test(zipcode);
      },
    },
  },

  birthday_date: {
    type: Date,
  },

  status: {
    type: Boolean,
    default: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  validation: {
    type: String,
  },

  verified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("Users", UserSchema);