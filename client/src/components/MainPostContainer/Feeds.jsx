import { Box } from "@mui/material";
import React from "react";
import Post from "../PostContainer/Post";
import MainPost from "./MainPost";

const Feeds = () => {
  return (
    <Box flex={2} p={2}>
      <Post />
      <MainPost />
      <MainPost />
      <MainPost />
      <MainPost />
    </Box>
  );
};

export default Feeds;
