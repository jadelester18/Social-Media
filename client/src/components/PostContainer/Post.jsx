import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const Post = () => {
  return (
    <Card sx={{ width: "100%" }}>
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
      </CardContent>
      <CardActions>
        <Grid container spacing={5}>
          <Grid item xs={1}>
            <IconButton aria-label="add to favorites">
              <AddPhotoAlternateIcon />
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton aria-label="share">
              <VideoCallIcon />
            </IconButton>
          </Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={2}>
            <IconButton variant="primary" size="small">
              <SendIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Post;
