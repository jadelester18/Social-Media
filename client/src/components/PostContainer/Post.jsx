import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Post = () => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  let id = userLogged.other._id;

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <Box flex={4} p={2} sx={{ width: { sm: "100%" } }}>
      <Card sx={{ boxShadow: 5 }}>
        <CardHeader
          avatar={
            <Avatar
              alt={userLogged.other.username}
              src={userLogged.other.profilepicture}
              sx={{ bgcolor: "red" }}
              aria-label="recipe"
              component={Link}
              to={`/Profile/${id}`}
            />
          }
          title={
            userLogged.other.firstname.charAt(0).toUpperCase() +
            userLogged.other.firstname.slice(1) +
            " " +
            userLogged.other.lastname.charAt(0).toUpperCase() +
            userLogged.other.lastname.slice(1)
          }
          // subheader="September 14, 2016"
        />
        <CardContent>
          <TextField
            multiline
            rows={2}
            placeholder="What's on your mind?"
            variant="standard"
            sx={{ width: "100%" }}
          />
          {imageUrl && selectedImage && (
            <Box mt={2} textAlign="center">
              {/* <div>Image Preview:</div> */}
              <img src={imageUrl} alt={selectedImage.name} height="100px" />
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            justifyContent="space-evenly"
            sx={{ width: "100%" }}
          >
            <Tooltip title="Upload Image">
              <IconButton aria-label="upload picture" component="label">
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
                <AddPhotoAlternateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload Video">
              <IconButton aria-label="upload picture" component="label">
                <input hidden accept="video/*" type="file" />
                <VideoCallIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send">
              <IconButton
                variant="contained"
                sx={{ color: "default.color" }}
                size="small"
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Post;
