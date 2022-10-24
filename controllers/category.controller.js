const { response } = require("express");
const Category = require("../models/category.model");
const { validateObjectId } = require("../middlewares/validators");


const createCategory = async (req, res = response) => {
  try {
    const { ...leftover } = req.body;

    const category = new Category({
      ...leftover
    });
    
    await category.save();
    res.status(201).json({
      ok: "true",
      category
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
};

const getAllCategorys = async (req, res = response) => {
  try {
    const { pageSize = 25, pageNumber = 1 } = req.query;
    const query = { status: true };
    let page = pageNumber-1;
    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query).skip(page*pageSize).limit(pageSize),
    ]);

    res.json({
      ok: true,
      total,
      categories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
}

const getSpecificCategory = async (req, res = response) => {
  try {
    const { id } = req.query;
    const [category] = await Promise.all([
      Category.findById(id),
    ]);

    res.json({
      ok: true,
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
};

const updateCategory = async (req, res = response) => {
  try {
    const { id } = req.query;
    const { _id, ...leftover } = req.body;
    const idValidationResult = validateObjectId(id, "Category");
    if (!idValidationResult.ok) throw new Error(idValidationResult.err).message;

    const category = await Category.findByIdAndUpdate(id, leftover, {
      new: true,
      runValidators: true,
    });

    res.json({
      ok: "true",
      category,
    });
  } catch (err) {
    res.status(500).json({
      ok: "false",
      err,
    });
  }
};

const deleteCategory = async (req, res = response) => {
  try {
    const { id: idToDisable } = req.query;
    const idValidationResult = validateObjectId(idToDisable, "category");

    if (!idValidationResult.ok) throw new Error(idValidationResult.err).message;

    const category = await Category.findById(idToDisable);

    if (!category.status)
      throw new Error(`this Category does no exist`).message;

    const categoryDeleted = await Category.findByIdAndUpdate(
      idToDisable,
      { status: false },
      { new: true }
    );

    res.json({
      ok: "true",
      categoryDeleted,
    });
  } catch (err) {
    res.status(500).json({
      ok: "false",
      err,
    });
  }
};


module.exports = {
  createCategory,
  getAllCategorys,
  getSpecificCategory,
  updateCategory,
  deleteCategory
};