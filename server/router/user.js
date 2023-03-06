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

const crypto = require("crypto");

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
      return res.status(400).json({ message: "Please fill out the form" });
    }

    try {
      // Check if user exists
      let usernameChecker = await User.findOne({ username: req.body.username });
      let emailChecker = await User.findOne({ email: req.body.email });
      
      if (usernameChecker && usernameChecker.username === req.body.username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (emailChecker && emailChecker.email === req.body.email) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      // Create the user
      let user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: secpass,
        phonenumber: req.body.phonenumber,
      });

      // Generate JWT token and send verification email
      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWTSEC
      );

      const OTP = generateOTP();
      const verificationToken = await VerificationToken.create({
        user: user._id,
        token: OTP,
      });
      verificationToken.save();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      transport.use(
        "compile",
        hbs({
          viewEngine: {
            extname: ".handlebars",
            layoutsDir: "./emailTemplate/",
            defaultLayout: "Onetimepass",
          },
          viewPath: "./emailTemplate/",
        })
      );

      var mailConfig = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Verify your email using OTP",
        template: "Onetimepass",
        context: {
          name: user.email,
          company: `${OTP}`,
        },
      };
      transport.sendMail(mailConfig, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent :" + info.response);
        }
      });

      return res.status(200).json({
        Status: "Pending",
        msg: "Please check your email",
        user: user._id,
      });
    } catch (error) {
      return res.status(400).json({ message: "Internal error occurred" });
    }
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      //Check if user is not exist
      if (!user) {
        return res.status(400).json({ message: "User does not exist." });
      }

      const ComparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!ComparePassword) {
        return res.status(400).json({ message: "Incorrect Password" });
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

//verify email
router.post("/verify/email", async (req, res) => {
  const { user, OTP } = req.body;
  const mainuser = await User.findById(user);
  if (!mainuser) return res.status(400).json("User not found");
  if (mainuser.verified === true) {
    return res.status(400).json("User already verified");
  }
  const token = await VerificationToken.findOne({ user: mainuser._id });
  if (!token) {
    return res.status(400).json("Sorry token not found");
  }
  const isMatch = await bcrypt.compareSync(OTP, token.token);
  if (!isMatch) {
    return res.status(400).json("Token is not valid");
  }

  mainuser.verified = true;
  await VerificationToken.findByIdAndDelete(token._id);

  await mainuser.save();
  const accessToken = jwt.sign(
    {
      id: mainuser._id,
      username: mainuser.username,
    },
    JWTSEC
  );
  const { password, ...other } = mainuser._doc;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  transport.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".handlebars",
        layoutsDir: "./emailTemplate/",
        defaultLayout: "Verifyemail",
      },
      viewPath: "./emailTemplate/",
    })
  );

  var mailConfig = {
    from: process.env.EMAIL,
    to: mainuser.email,
    subject: "Successfully Verified",
    template: "Verifyemail",
    context: {
      name: `${
        mainuser.firstname.charAt(0).toUpperCase() +
        mainuser.firstname.slice(1) +
        " " +
        mainuser.lastname.charAt(0).toUpperCase() +
        mainuser.lastname.slice(1)
      }`,
      company: `${OTP}`,
    },
  };
  transport.sendMail(mailConfig, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("The Email :" + info.response + " Has Successfully Verified");
    }
  });

  return res.status(200).json({ other, accessToken });
});

//Forgot password
router.post("/forgot/password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json("User not found");
  }
  const token = await ResetToken.findOne({ user: user._id });
  if (token) {
    return res
      .status(400)
      .json("After one hour you can request for another token");
  }

  const RandomTxt = crypto.randomBytes(20).toString("hex");
  const resetToken = new ResetToken({
    user: user._id,
    token: RandomTxt,
  });
  await resetToken.save();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  transport.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".handlebars",
        layoutsDir: "./emailTemplate/",
        defaultLayout: "Resetpassword",
      },
      viewPath: "./emailTemplate/",
    })
  );

  var mailConfig = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Reset Token",
    template: "Resetpassword",
    context: {
      name: `${
        user.firstname.charAt(0).toUpperCase() +
        user.firstname.slice(1) +
        " " +
        user.lastname.charAt(0).toUpperCase() +
        user.lastname.slice(1)
      }`,
      company: `http://localhost:3000/reset/password?token=${RandomTxt}&_id=${user._id}`,
    },
  };
  transport.sendMail(mailConfig, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent :" + info.response);
    }
  });

  return res.status(200).json("Check your email to reset password");
});

//reset password
router.put("/reset/password", async (req, res) => {
  const { token, _id } = req.query;
  if (!token || !_id) {
    return res.status(400).json("Invalid req");
  }
  const user = await User.findOne({ _id: _id });
  if (!user) {
    return res.status(400).json("user not found");
  }
  const resetToken = await ResetToken.findOne({ user: user._id });
  if (!resetToken) {
    return res.status(400).json("Reset token is not found");
  }
  console.log(resetToken.token);
  const isMatch = await bcrypt.compareSync(token, resetToken.token);
  if (!isMatch) {
    return res.status(400).json("Token is not valid");
  }

  const { password } = req.body;
  // const salt = await bcrypt.getSalt(10);
  const secpass = await bcrypt.hash(password, 10);
  user.password = secpass;
  await user.save();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  transport.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".handlebars",
        layoutsDir: "./emailTemplate/",
        defaultLayout: "ResetSuccefully",
      },
      viewPath: "./emailTemplate/",
    })
  );

  var mailConfig = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Your password reset successfully",
    template: "ResetSuccefully",
    context: {
      name: `${
        user.firstname.charAt(0).toUpperCase() +
        user.firstname.slice(1) +
        " " +
        user.lastname.charAt(0).toUpperCase() +
        user.lastname.slice(1)
      }`,
      // company: `${OTP}`,
    },
  };

  transport.sendMail(mailConfig, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent :" + info.response);
    }
  });

  return res.status(200).json("Email has been sent");
});

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

    res.status(200).json(followingList);
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
