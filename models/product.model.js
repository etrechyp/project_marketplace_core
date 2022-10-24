const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
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
    ref: 'Category',
    default: '6356d636342c0c65d2b42294',
  },

  sku: {
  	type: String,
  },

  productImg: {
  	type: Array,
  	default: ['https://www.feelinggoodinstitute.com/public/gallery/NoImageAvailableIcon.png']
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

  marketplace: {
  	type: String,
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