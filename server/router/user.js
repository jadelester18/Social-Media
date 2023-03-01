const router = require("express").Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs"); //for hashing password
const jwt = require("jsonwebtoken"); //for token
const JWTSEC =
  "f943796f0a956ffde6e21dad239122a0d89be4ce5ad5a35105e5589a312bb718eeb2cdea0d5701ba61ceca514556ca04266bb731a9e474ba5b749e981415e4db"; //require('crypto').randomBytes(128).toString('hex')

const Post = require("../Models/Post");

const { findById } = require("../Models/User");
const VerificationToken = require("../Models/VerificationToken");
const { verifyToken } = require("./verifytoken");

const { generateOTP } = require("./otpgenerator");
const ResetToken = require("../Models/ResetToken");

const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

router.post(
  "/register/user",
  body("firstname").isLength({ min: 1 }),
  body("lastname").isLength({ min: 1 }),
  body("username").isLength({ min: 1 }),
  body("email").isEmail(),
  body("password").isLength({ min: 1 }),
  body("phonenumber").isLength({ min: 1 }),
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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: secpass,
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

//Trying to Follow Specific User
router.patch("/follow/:id", verifyToken, async (req, res) => {
  if (req.params.id !== req.body.user) {
    const user = await User.findById(req.params.id);
    const otheruser = await User.findById(req.body.user);

    if (!user.followers.includes(req.body.user)) {
      await user.updateOne({ $push: { followers: req.body.user } });
      await otheruser.updateOne({ $push: { following: req.params.id } });
      return res.status(200).json("User has followed");
    } else {
      await user.updateOne({ $pull: { followers: req.body.user } });
      await otheruser.updateOne({ $pull: { following: req.params.id } });
      return res.status(200).json("User has Unfollowed");
    }
  } else {
    return res.status(400).json("You can't follow yourself");
  }
});

//Show all available user to follow by user logged in
router.get("/all/availuser/:id", async (req, res) => {
  try {
    const allUser = await User.find();
    const user = await User.findById(req.params.id);
    const followingUser = await Promise.all(
      user.following.map((user) => {
        return user;
      })
    );

    let userToFollow = allUser.filter((val) => {
      return !followingUser.find((user) => {
        return val._id.toString() === user;
      });
    });

    let filteruser = await Promise.all(
      userToFollow.map((user) => {
        const {
          email,
          username,
          phonenumber,
          followers,
          following,
          password,
          ...others
        } = user._doc;
        return others;
      })
    );
    res.status(200).json(filteruser);
  } catch (error) {
    return res.status(400).json("No available user to follow.");
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
    const userLoggedPost = await Post.find({ user: user._id });

    res.status(200).json(userLoggedPost.concat(...followersPost));
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

//Update Profile
router.patch("/update/profile/:id", verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      const updateFields = {};

      if (req.body.firstname) {
        updateFields.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        updateFields.lastname = req.body.lastname;
      }
      if (req.body.username) {
        updateFields.username = req.body.username;
      }
      if (req.body.bio) {
        updateFields.bio = req.body.bio;
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);
        updateFields.password = secpass;
      }
      if (req.body.phonenumber) {
        updateFields.phonenumber = req.body.phonenumber;
      }
      if (req.body.location) {
        updateFields.location = req.body.location;
      }
      if (req.body.profilepicture) {
        updateFields.profilepicture = req.body.profilepicture;
      }
      if (req.body.backgroundpicture) {
        updateFields.backgroundpicture = req.body.backgroundpicture;
      }

      const updateProfile = await User.findByIdAndUpdate(req.params.id, {
        $set: updateFields,
      });

      await updateProfile.save();
      res.status(200).json(updateProfile);
    } else {
      return res
        .status(400)
        .json("You're not allowed to updated this user profile.");
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

//Get the user who posted
router.get("/post/user/details/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json("User not found.");
    }
    const { email, password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    return res.status(500).json("Internal error occurred.");
  }
});

/// Get all Following List of that user Profile
router.get("/following/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followinguser = await Promise.all(
      user.following.map((item) => {
        return User.findById(item);
      })
    );

    let followingList = [];
    followinguser.map((person) => {
      const { email, password, phonenumber, following, followers, ...others } =
        person._doc;
      followingList.push(others);
    });

    res.status(200).json(followingList.sort(() => Math.random() - 0.5));
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});

/// Get all Followers List of that user Profile
router.get("/followerslist/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followersuser = await Promise.all(
      user.followers.map((item) => {
        return User.findById(item);
      })
    );

    let followersList = [];
    followersuser.map((person) => {
      const { email, password, phonenumber, Following, ...others } =
        person._doc;
      followersList.push(others);
    });

    res.status(200).json(followersList);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});


module.exports = router;
