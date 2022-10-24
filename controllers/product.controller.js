const { response } = require("express");
const Product = require("../models/product.model");
const { validateObjectId } = require("../middlewares/validators");


const createProduct = async (req, res = response) => {
  try {
    const { ...leftover } = req.body;

    const product = new Product({
      ...leftover
    });
    
    await product.save();
    res.status(201).json({
      ok: "true",
      product
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
};

const getAllProducts = async (req, res = response) => {
  try {
    const { pageSize = 25, pageNumber = 1 } = req.query;
    const query = { status: true };
    let page = pageNumber-1;
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).skip(page*pageSize).limit(pageSize).populate('category', '-status -__v'),
    ]);

    res.json({
      ok: true,
      total,
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
}

const getSpecificProduct = async (req, res = response) => {
  try {
    const { id } = req.query;
    const [product] = await Promise.all([
      Product.findById(id).populate('category', '-status -__v'),
    ]);

    res.json({
      ok: true,
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
};

const updateProduct = async (req, res = response) => {
  try {
    const { id } = req.query;
    const { _id, ...leftover } = req.body;
    const idValidationResult = validateObjectId(id, "product");
    if (!idValidationResult.ok) throw new Error(idValidationResult.err).message;

    const product = await Product.findByIdAndUpdate(id, leftover, {
      new: true,
      runValidators: true,
    });

    res.json({
      ok: "true",
      product,
    });
  } catch (err) {
    res.status(500).json({
      ok: "false",
      err,
    });
  }
};

const deleteProduct = async (req, res = response) => {
  try {
    const { id: idToDisable } = req.query;
    const idValidationResult = validateObjectId(idToDisable, "product");

    if (!idValidationResult.ok) throw new Error(idValidationResult.err).message;

    const product = await Product.findById(idToDisable);

    if (!product.status)
      throw new Error(`this product does no exist`).message;

    const productDeleted = await Product.findByIdAndUpdate(
      idToDisable,
      { status: false },
      { new: true }
    );

    res.json({
      ok: "true",
      productDeleted,
    });
  } catch (err) {
    res.status(500).json({
      ok: "false",
      err,
    });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct
};