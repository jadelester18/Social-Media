import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Divider,
  IconButton,
  InputBase,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import ScrollToTop from "react-scroll-to-top";
import { FixedSizeList, FixedSizeList as List } from "react-window";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import MarkUnreadChatAltOutlinedIcon from "@mui/icons-material/MarkUnreadChatAltOutlined";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

const ProfileMainPost = ({ post }) => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  const accesstoken = userLogged.accessToken;

  //Show Profile Data of Specific User
  let location = useLocation();
  let id = location.pathname.split("/")[2];

  const [openChat, setOpenChat] = React.useState(false);
  const handleOpenChat = () =>
    setOpenChat(post.comments.length === 0 ? false : true);
  const handleCloseChat = () => setOpenChat(false);

  //For Comments
  const [Comments, setComments] = useState(post.comments);
  const [commentwriting, setcommentwriting] = useState("");
  const [show, setshow] = useState(false);

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

  function showAllComment() {
    return (
      <ListItem disablePadding>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={userDetails.profilepicture} />
        </ListItemAvatar>
        <ListItemText
          primary={post.comments.map((data) => data.username)}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {post.comments.comment === ""
                  ? post.comments.coment
                  : "No comment available."}
                {/* {post.comments.map((data) => data.comment)} */}
              </Typography>
              {/* {" — I'll be in your neighborhood doing errands this…"} */}
            </React.Fragment>
          }
        />
      </ListItem>
    );
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
          subheader={userDetails?.joineddate?.replace("-", " ").slice(0, -14)}
        />
        <CardMedia
          component="img"
          height="20%"
          image={post.image}
          alt={post.title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {post.title}
            sample title
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
            {post.comments.length == 0 ? (
              <QuestionAnswerOutlinedIcon />
            ) : (
              <MarkUnreadChatAltOutlinedIcon color="secondary" />
            )}
          </IconButton>
          {post.comments.length} Comments
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
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
          >
            <FixedSizeList
              height={400}
              itemSize={46}
              itemCount={post.comments.length}
              sx={{ width: "100%" }}
            >
              {showAllComment}
            </FixedSizeList>
          </Box>
          <Divider />
          <InputBase
            placeholder="Write a comment..."
            variant="filled"
            size="small"
            fullWidth
            position="sticky"
          />
        </Box>
      </Modal>
      <ScrollToTop smooth top="10" />
    </Box>
  );
};

export default ProfileMainPost;
