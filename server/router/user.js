const router = require("express").Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs"); //for hashing password
const jwt = require("jsonwebtoken"); //for token
const JWTSEC =
  "f943796f0a956ffde6e21dad239122a0d89be4ce5ad5a35105e5589a312bb718eeb2cdea0d5701ba61ceca514556ca04266bb731a9e474ba5b749e981415e4db"; //require('crypto').randomBytes(128).toString('hex')

const { verifyToken } = require("./verifytoken");
const Post = require("../Models/Post");
const { findById } = require("../Models/User");

router.post(
  "/register/user",
  body("email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 5 }),
  body("username").isLength({ min: 5 }),
  body("phonenumber").isLength({ min: 10 }),
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json("Some error occured");
    }

    try {
      //Check if user is exist
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(200).json("Please login with correct password.");
      }

      //For hashing password
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      //If user doesn't exist this command will work for signup
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secpass,
        profilepicture: req.body.profilepicture,
        phonenumber: req.body.phonenumber,
      });

      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWTSEC
      );

      await user.save();
      res.status(200).json({ user, accessToken });
    } catch (error) {
      return res.status(400).json("Internal error occurred.");
    }
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    // const error = validationResult(req);
    // if (!error.isEmpty()) {
    //   return res.status(400).json("Some error occured.");
    // }

    try {
      const user = await User.findOne({ email: req.body.email });

      //Check if user is not exist
      if (!user) {
        return res.status(400).json("User doesn't exist.");
      }

      const ComparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!ComparePassword) {
        return res.status(400).json("Password error issue.");
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWTSEC
      );

      const { password, ...other } = user._doc;

      res.status(200).json({ other, accessToken });
    } catch (error) {
      return res.status(400).json("Internal error occurred.");
    }
  }
);

router.patch("/follow/:id", verifyToken, async (req, res) => {
  if (req.params.id !== req.body.user) {
    const userToBeFollow = await User.findById(req.params.id);
    const userInSession = await User.findById(req.body.user);

    if (!userToBeFollow.followers.includes(req.body.user)) {
      await userToBeFollow.updateOne({ $push: { followers: req.body.user } });
      await userInSession.updateOne({ $push: { following: req.params.id } });
      return res.status(200).json("User has followed.");
    } else {
      return res.status(400).json("You already followed this user.");
    }
  } else {
    return res.status(400).json("You can't follow yourself!");
  }
});

//Get all the Post user's follows or get all the post by id
router.get("/followers/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followersPost = await Promise.all(
      user.following.map((post) => {
        return Post.find({ user: post });
      })
    );
    res.status(200).json(followersPost);
  } catch (error) {
    return res.status(500).json("Internal error occurred.");
  }
});

//Update Password
router.patch("/update/:id", verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);
        req.body.password = secpass;
        const updateUserPassword = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        await updateUserPassword.save();
        res.status(200).json(updateUserPassword);
      }
      return res
        .status(400)
        .json("You're not allowed to updated this user details.");
    }
  } catch (error) {
    return res.status(500).json("Internal error occurred.");
  }
});

//Delete Personal Account
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(400).json("Account doesn't match.");
    } else {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted.");
    }
  } catch (error) {
    return res.status(500).json("Internal error occurred.");
  }
});


module.exports = router;
