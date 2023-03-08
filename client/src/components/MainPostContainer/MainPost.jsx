import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import ScrollToTop from "react-scroll-to-top";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import MarkUnreadChatAltOutlinedIcon from "@mui/icons-material/MarkUnreadChatAltOutlined";
import SubtitlesOutlinedIcon from "@mui/icons-material/SubtitlesOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import LinearProgress from "@mui/material/LinearProgress";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 280, sm: 400 },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

const MainPost = ({ post }) => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  let id = userLogged.other._id;
  const accesstoken = userLogged.accessToken;

  //For Progress Bar Upload Post
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const [uploadPercent, setUploadPercent] = useState(0);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = uploadPercent;
        const diff2 = uploadPercent;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  //Showing Post Menu list
  const [anchorMenuPost, setAnchorElMenuPost] = React.useState(null);

  const handleOpenPostMenu = (event) => {
    setAnchorElMenuPost(event.currentTarget);
  };
  const handleClosePostMenu = () => {
    setAnchorElMenuPost(null);
  };

  //Showing Modal For Edit Post
  const [openEditPost, setOpenEditPost] = React.useState(false);
  const handleOpenEditPost = () => setOpenEditPost(true);
  const handleCloseEditPost = () => setOpenEditPost(false);

  // For Editing Post Data
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePostUpdate = (e) => {
    e.preventDefault();

    let postData = {};

    if (selectedFile) {
      const fileName = new Date().getTime() + selectedFile.name;
      const storage = getStorage();
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadPercent(progress);
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (selectedFile.type.startsWith("image")) {
              postData.image = downloadURL;
              postData.video = "";
            } else if (selectedFile.type.startsWith("video")) {
              postData.video = downloadURL;
              postData.image = "";
            }
            if (title.trim()) {
              postData.title = title.trim();
            }
            updatePost(postData);
          });
        }
      );
    } else if (title.trim()) {
      postData.title = title.trim();
      updatePost(postData);
    }
  };

  const updatePost = (postData) => {
    fetch(`http://localhost:5000/api/post/update/post/${post._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: accesstoken,
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update post.");
        }
        return response.json();
      })
      .then((data) => {
        // alert("Post updated successfully.");
        handleCloseEditPost(true);
        handleClosePostMenu(true);
        setTitle("");
        setSelectedFile(null);
        setUploadPercent(0);
      })
      .catch((error) => {
        console.error(error);
        // alert("Failed to update post.");
      });
  };

  //Showing Modal for Comment
  const [openComment, setOpenComment] = React.useState(false);
  const handleOpenComment = () => setOpenComment(true);
  const handleCloseComment = () => setOpenComment(false);

  //For Setting Like
  const [countLike, setCountLike] = useState(post.like.length);
  const [Like, setLike] = useState([
    post.like.includes(id) ? "Favorite" : "FavoriteBorder",
  ]);

  const handleLike = async () => {
    if (Like == "FavoriteBorder") {
      await fetch(`http://localhost:5000/api/post/${post._id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/Json", token: accesstoken },
      });
      setLike("Favorite");
      setCountLike(countLike + 1);
    } else {
      await fetch(`http://localhost:5000/api/post/${post._id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/Json", token: accesstoken },
      });
      setLike("FavoriteBorder");
      setCountLike(countLike - 1);
    }
  };

  //Get the user post
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const getUserPosted = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/post/user/details/${post.user}`,
          {
            headers: {
              token: accesstoken,
            },
          }
        );
        setUserDetails(res.data);
      } catch (error) {
        console.log("Post details has issue.");
      }
    };
    getUserPosted();
  }, [post.user, accesstoken]);

  //Add Comment
  const [Comments, setComments] = useState(post.comments);
  const [CommentWriting, setCommentWriting] = useState("");

  const addCommentToPost = async () => {
    const comment = {
      postid: `${post._id}`,
      username: `${userLogged.other.username}`,
      comment: `${CommentWriting}`,
      profilepicture: `${userLogged.other?.profilepicture}`,
    };
    await fetch(`http://localhost:5000/api/post/comment/post`, {
      method: "PATCH",
      headers: { "Content-Type": "application/Json", token: accesstoken },
      body: JSON.stringify(comment),
    });
    setComments(Comments.concat(comment));
  };

  const handleComment = () => {
    addCommentToPost();
  };

  //For Delete Post
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/post/delete/post/${post._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: accesstoken,
          },
        }
      );
      console.log("Post deleted successfully.");
      // alert("Post deleted successfully.");
      // Update state to indicate that the post has been deleted
      setIsDeleted(true);
    } catch (error) {
      console.log("Error deleting post:", error);
    }
  };

  // If the post has been deleted, don't render anything
  if (isDeleted) {
    return null;
  }

  //For Getting the time of the post
  const postTimestamp = post.createdat;

  // Convert the post timestamp to a Date object
  const postDate = new Date(postTimestamp);

  // Get the current time as a Date object in the Philippine time zone
  const currentDate = new Date().toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
  });

  // Convert the current time to a Date object
  const currentDateTime = new Date(currentDate);

  // Calculate the difference between the current time and the post time in milliseconds
  const differenceMs = currentDateTime.getTime() - postDate.getTime();

  // Calculate the number of seconds, minutes, hours, and days that have passed
  const seconds = Math.floor(differenceMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeDifference;

  // The output will depend on the number of days, hours, minutes, and seconds that have passed
  if (days > 0) {
    timeDifference = `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    timeDifference = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    timeDifference = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    timeDifference = `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  return (
    <Box flex={4} p={2} sx={{ width: { sm: "100%" } }}>
      <Card sx={{ boxShadow: 10 }}>
        <CardHeader
          avatar={
            <Avatar
              size="large"
              src={
                userDetails.profilepicture === ""
                  ? ""
                  : userDetails.profilepicture
              }
              component={Link}
              to={`/Profile/${userDetails._id}`}
            />
          }
          action={
            <IconButton aria-label="settings" onClick={handleOpenPostMenu}>
              <MoreVertIcon />
            </IconButton>
          }
          title={
            userDetails?.firstname?.charAt(0)?.toUpperCase() +
            userDetails?.firstname?.slice(1) +
            " " +
            userDetails?.lastname?.charAt(0)?.toUpperCase() +
            userDetails?.lastname?.slice(1)
          }
          subheader={timeDifference}
        />
        {post.image !== "" ? (
          <CardMedia
            component="img"
            height="20%"
            image={post.image}
            alt={post.title}
          />
        ) : post.video !== "" ? (
          <CardMedia
            component="video"
            image={post.video}
            alt={post.title}
            controls
            // autoPlay
          />
        ) : (
          ""
        )}

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {post.title}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Checkbox
            {...label}
            icon={
              Like == "FavoriteBorder" ? (
                <FavoriteBorder />
              ) : (
                <Favorite color="primary" />
              )
            }
            checkedIcon={
              Like == "Favorite" ? (
                <Favorite color="primary" />
              ) : (
                <FavoriteBorder />
              )
            }
            onClick={handleLike}
          />
          {countLike} Likes
          <IconButton aria-label="share" onClick={handleOpenComment}>
            {post.comments.length === 0 ? (
              <QuestionAnswerOutlinedIcon />
            ) : (
              <MarkUnreadChatAltOutlinedIcon color="secondary" />
            )}
          </IconButton>
          {Comments.length} Comments
          <Typography variant="body2" color="text.secondary"></Typography>
          <IconButton aria-label="share" sx={{ marginLeft: "auto" }}>
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Modal
        open={openComment}
        onClose={handleCloseComment}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal} color={"text.primary"}>
          <Box
            sx={{
              width: "100%",
              height: 400,
              maxWidth: 500,
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                width: "0em",
              },
              // "&::-webkit-scrollbar-track": {
              //   background: "#f1f1f1",
              // },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
              },
            }}
          >
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {Comments.map((item) => (
                <ListItem alignItems="flex-start" key={item._id}>
                  <ListItemAvatar>
                    <Avatar
                      alt={item.username}
                      src={item.profilepicture}
                      component={Link}
                      to={`/Profile/${item.user}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                    primary={item.username}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        ></Typography>
                        {item.comment}
                        {/* {" — I'll be in your neighborhood doing errands this…"} */}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              )).reverse()}
            </List>
          </Box>
          <Divider />
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <InputBase
              placeholder="Write a comment..."
              variant="filled"
              size="small"
              fullWidth
              position="sticky"
              onChange={(e) => setCommentWriting(e.target.value)}
            />
            <Button
              variant="body2"
              onClick={handleComment}
              disabled={!CommentWriting}
            >
              Post
            </Button>
          </Stack>
        </Box>
      </Modal>
      <ScrollToTop smooth top="10" />
      <Menu
        id="user-menu"
        anchorEl={anchorMenuPost}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(id !== post.user ? "" : anchorMenuPost)}
        onClose={handleClosePostMenu}
        sx={{ mt: "45px" }}
      >
        <MenuItem onClick={handleOpenEditPost}>Edit</MenuItem>

        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <Modal
        open={openEditPost}
        onClose={handleCloseEditPost}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ styleModal }}
      >
        <Box sx={styleModal}>
          <LinearProgress
            variant="buffer"
            value={progress}
            valueBuffer={buffer}
          />
          <Box sx={{ flexWrap: "wrap" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" color={"text.primary"}>
              Edit Post
              <Button
                disabled={post.title === title ? true : false}
                variant="contained"
                sx={{ float: "right", borderRadius: 10 }}
                onClick={handlePostUpdate}
                // disabled={!this.state.email}
              >
                Save
              </Button>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
            <div>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <Card>
                  {post.image !== "" ? (
                    <CardMedia
                      component="img"
                      height="20%"
                      image={post.image}
                      alt={post.title}
                    />
                  ) : post.video !== "" ? (
                    <CardMedia
                      component="video"
                      image={post.video}
                      alt={post.title}
                      controls
                      // autoPlay
                    />
                  ) : (
                    ""
                  )}
                </Card>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Caption
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={(e) => setTitle(e.target.value)}
                  defaultValue={post.title}
                  startAdornment={
                    <InputAdornment position="start">
                      <SubtitlesOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadOutlinedIcon />}
                >
                  Edit Post Video/Image
                  <input
                    hidden
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    type="file"
                  />
                </Button>
              </FormControl>
            </div>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MainPost;
