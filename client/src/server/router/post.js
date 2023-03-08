const router = require('express').Router();
const Post = require('../Models/Post');
const { route, post } = require('./user');
const { verifyToken } = require('./verifytoken');


//Uploading
router.post('/user/post', verifyToken, async (req, res) => {
  try {
    let { title, image, video } = req.body;
    let newpost = new Post({
      title,
      image,
      video,
      user: req.user.id,
    });
    const post = await newpost.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json('Internal error occured');
  }
});

router.put("/update/post/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json("Post not found");
    }

    // Only update the fields that are specified in the request body
    if (req.body.title !== undefined) {
      post.title = req.body.title;
    }

    if (req.body.image !== undefined) {
      post.image = req.body.image;
    }

    if (req.body.video !== undefined) {
      post.video = req.body.video;
    }

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal error occurred");
  }
});


router.patch("/update/profile/:id", verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      const updateFields = {};

      if (req.body.firstname) {
         post.title = req.body.title;
      }
      if (req.body.profilepicture) {
        post.image = req.body.image;
      }
      if (req.body.backgroundpicture) {
        post.video = req.body.video;
      }

      const updateProfile = await Post.findByIdAndUpdate(req.params.id, {
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


//Get post by user id Profile
router.get('/get/post/:id', async (req, res) => {
  try {
    const mypost = await Post.find({ user: req.params.id });

    //Check if you have any post
    if (!mypost) {
      return res.status(400).json("You don't have any post.");
    }
    res.status(200).json(mypost);
  } catch (error) {
    return res.status(400).json('Internal error occurred.');
  }
});

//Update post by user id
// router.patch('/update/post/:id', verifyToken, async (req, res) => {
//   try {
//     let mypost = await Post.findById(req.params.id);

//     //Check if you have any post
//     if (!mypost) {
//       return res.status(400).json('Your post does not found.');
//     }

//     mypost = await Post.findByIdAndUpdate(req.params.id, {
//       $set: req.body,
//     });

//     let updatePost = await mypost.save();

//     res.status(200).json(updatePost);
//   } catch (error) {
//     return res.status(400).json('Internal error occurred.');
//   }
// });

//For liking post
router.patch('/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.like.includes(req.user.id)) {
      if (post.dislike.includes(req.user.id)) {
        await post.updateOne({ $pull: { dislike: req.user.id } });
      }
      await post.updateOne({ $push: { like: req.user.id } });
      return res.status(200).json('Post has been liked');
    } else {
      await post.updateOne({ $pull: { like: req.user.id } });
      return res.status(200).json('Post has been unlike');
    }
  } catch (error) {
    return res.status(500).json('Internal server error ');
  }
});

//For disliking post
router.patch('/:id/dislike', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.dislike.includes(req.body.user)) {
      if (post.like.includes(req.body.user)) {
        await post.updateOne({ $pull: { like: req.body.user } });
      }
      await post.updateOne({ $push: { dislike: req.body.user } });
      return res.status(200).json('Post has been disliked.');
    } else {
      await post.updateOne({ $pull: { dislike: req.body.user } });
      return res.status(200).json('Post has been undisliked.');
    }
  } catch (error) {
    return res.status(500).json('Internal error occurred.');
  }
});

//For comment
router.patch('/comment/post', verifyToken, async (req, res) => {
  try {
    const { comment, postid, profilepicture } = req.body;
    const comments = {
      user: req.user.id,
      username: req.user.username,
      comment,
      profilepicture,
    };
    const post = await Post.findById(postid);
    post.comments.push(comments);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json('Internal error occurred.');
  }
});

//Delete single post by User posted it
router.delete('/delete/post/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.equals(req.user.id)) {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("Your post has been deleted.");
    } else {
      return res.status(400).json("You are not allowed to delete this post.");
    }
  } catch (error) {
    return res.status(500).json('Internal error occurred.');
  }
});


module.exports = router;
