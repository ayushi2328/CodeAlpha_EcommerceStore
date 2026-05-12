const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);

    await product.save();

    res.json({
      message: "Product Added ✅",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.json({
      message: "Product Updated ✅",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product Deleted ✅",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;