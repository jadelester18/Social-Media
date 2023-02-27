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
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
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
import { Link } from "react-router-dom";
import axios from "axios";

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

  const [openChat, setOpenChat] = React.useState(false);
  const handleOpenChat = () => setOpenChat(true);
  const handleCloseChat = () => setOpenChat(false);

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
  }, []);

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
            <IconButton aria-label="settings">
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
          subheader={post.createdat.replace("-", " ").slice(0, -14)}
        />
        {post.image !== " " ? (
          <CardMedia
            component="img"
            height="20%"
            image={post.image}
            alt={post.title}
          />
        ) : post.video !== " " ? (
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
          <IconButton aria-label="share" onClick={handleOpenChat}>
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
        open={openChat}
        onClose={handleCloseChat}
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
    </Box>
  );
};

export default MainPost;
