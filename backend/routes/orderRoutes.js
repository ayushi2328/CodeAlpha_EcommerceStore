const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);

    await order.save();

    res.json({
      message: "Order Placed Successfully ✅",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;