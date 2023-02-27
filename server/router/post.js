const router = require("express").Router();
const Post = require("../Models/Post");
const { route } = require("./user");
const { verifyToken } = require("./verifytoken");

router.post("/user/post", verifyToken, async (req, res) => {
  try {
    let { title, image, video } = req.body;
    let newpost = new Post({
      title,
      image,
      video,
      user: req.user.id,
    });
    const post = await newpost.save(); //this is for saving the post
    res.status(200).json(newpost);
  } catch (error) {
    return res.status(500).json("Internal error occurred.");
  }
});

//Get post by user id Profile
router.get("/get/post/:id", async (req, res) => {
  try {
    const mypost = await Post.find({ user: req.params.id });

    //Check if you have any post
    if (!mypost) {
      return res.status(400).json("You don't have any post.");
    }
    res.status(200).json(mypost);
  } catch (error) {
    return res.status(400).json("Internal error occurred.");
  }
});

//Update post by user id
router.patch("/update/post/:id", verifyToken, async (req, res) => {
  try {
    let mypost = await Post.findById(req.params.id);

    //Check if you have any post
    if (!mypost) {
      return res.status(400).json("Your post does not found.");
    }

    mypost = await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    let updatePost = await mypost.save();

    res.status(200).json(updatePost);
  } catch (error) {
    return res.status(400).json("Internal error occurred.");
  }
});

//For liking post
router.patch("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.like.includes(req.user.id)) {
      if (post.dislike.includes(req.user.id)) {
        await post.updateOne({ $pull: { dislike: req.user.id } });
      }
      await post.updateOne({ $push: { like: req.user.id } });
      return res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { like: req.user.id } });
      return res.status(200).json("Post has been unlike");
    }
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
});

//For disliking post
router.patch("/:id/dislike", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.dislike.includes(req.body.user)) {
        if(post.like.includes(req.body.user))
        {
            await post.updateOne({ $pull: { like: req.body.user } });
        }
        await post.updateOne({ $push: { dislike: req.body.user } });
        return res.status(200).json("Post has been disliked.");
    } else {
      await post.updateOne({ $pull: { dislike: req.body.user } });
      return res.status(200).json("Post has been undisliked.");
    }
  } catch (error) {
    return res.status(500).json("Internal error occurred.");
  }
});

//For comment
router.patch("/comment/post", verifyToken, async (req, res) => {
  try {
    const { comment, postid, profilepicture } = req.body;
    const comments = {
      user: req.user.id,
      username: req.user.username,
      comment,
      profilepicture,
      _id,
    };
    const post = await Post.findById(postid);
    post.comments.push(comments);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Internal error occurred.");
  }
});

//Delete single post by User posted it
router.delete("/delete/post/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if(post.user === req.user.id) {
        const deletepost = await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json("Your post has been deleted.")
    } else {
        return res.status(400).json("You are not allowed to delete this post.")
    }
  } catch (error) {
    return res.status(500).json("Internal error occurred.");
  }
});



module.exports = router;
