const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  categoryName: {
    type: String,
    required: true,
    validate: {
      validator: (name) => {
        return name.length <= 64;
      },
      message: `that is not a valid name!`,
    },
  },

  status: {
    type: Boolean,
    default: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const { __v, _id, ...category } = this.toObject();
  category.cid = _id;
  return category;
};

module.exports = model("Categories", CategorySchema);