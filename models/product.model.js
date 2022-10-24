const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  marketplace: {
  	type: String,
  },

  marketplaceID: {
    type: String,
  },

  url: {
    type: String,
    required: true,
    validate: {
      validator: (url) => {
        return url.includes('https://');
      }
    }
  },

  productName: {
    type: String,
    required: true,
    validate: {
      validator: (name) => {
        return name.length > 0 && name.length <= 72;
      },
      message: `that is not a valid name!`,
    },
  },

  productDescription: {
    type: String,
    validate: {
      validator: (shortDesc) => {
        return shortDesc.length <= 1200;
      },
      message: `must not be more than 1200 characters`,
    },
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
  },

  sku: {
  	type: String,
  },

  productImg: {
  	type: Array,
  	default: ['https://www.feelinggoodinstitute.com/public/gallery/NoImageAvailableIcon.png']
  },

  promoCode: {
  	type: String,
  },

  status: {
    type: Boolean,
    default: true,
  },
},{
  timestamp: true,
});

ProductSchema.methods.toJSON = function () {
  const { __v, _id, ...product } = this.toObject();
  product.pid = _id;
  return product;
};

module.exports = model("Products", ProductSchema);