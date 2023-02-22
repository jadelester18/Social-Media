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

const Post = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <Box flex={4} p={2} sx={{ width: { sm: "100%" } }}>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
              J
            </Avatar>
          }
          title="Jade Ballester"
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
