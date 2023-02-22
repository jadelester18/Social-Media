import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

const MainPost = () => {
  return (
    <Box flex={4} p={2} sx={{ width: { sm: "100%" } }}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              size="large"
              src="https://media.licdn.com/dms/image/C4D03AQHUdFZK1jgvQQ/profile-displayphoto-shrink_200_200/0/1659529297027?e=1681948800&v=beta&t=jmWyYI3s6-LL0JnruVRv5HLGmrdY1-VFJdvA81O9nEg"
            />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        <CardMedia
          component="img"
          height="20%"
          image="https://i.pinimg.com/564x/61/34/bd/6134bdefba6c54bf53b09da003326f57.jpg"
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
          <IconButton aria-label="share">
            <QuestionAnswerOutlinedIcon />
          </IconButton>
          <IconButton aria-label="share" sx={{ marginLeft: "auto" }}>
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
};

export default MainPost;
