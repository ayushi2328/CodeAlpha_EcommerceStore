const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


router.post("/signup", async (req, res) => {

  try {

    const { name, email, password } =
      req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.json({
        message: "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({

      name,
      email,
      password: hashedPassword,

    });

    await newUser.save();

    res.json({
      message: "Signup Successful ✅",
    });

  } catch (error) {

    res.status(500).json(error);

  }

});


router.post("/login", async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.json({
        message: "User not found",
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.json({
        message: "Invalid Password",
      });

    }

    const token = jwt.sign(

      {
        id: user._id,
      },

      process.env.JWT_SECRET

    );

    res.json({

      token,

      user: {

        id: user._id,
        name: user.name,
        email: user.email,

      },

      message:
        "Login Successful ✅",

    });

  } catch (error) {

    res.status(500).json(error);

  }

});

module.exports = router;