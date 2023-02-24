import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Post from "../PostContainer/Post";
import MainPost from "./MainPost";
import axios from "axios";

const Feeds = () => {
  const accesstoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjYxMjc0YjVhOGE2NjkwNjE4NTA4NSIsInVzZXJuYW1lIjoiamFkZWxlc3RlcjE4IiwiaWF0IjoxNjc3MTMwOTgyfQ.SW827RhYzXhKk04QRD1BjestAg1IPQeTIgLLE9Zh1Qk";

  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/followers/63f61274b5a8a66906185085",
          {
            headers: {
              token: accesstoken,
            },
          }
        );
        setPost(res.data);
      } catch (error) {}
    };
    getPost();
  }, []);

  // console.log(post);

  return (
    <Box flex={2} p={2}>
      <Post />
      {post.map((item) =>
        item.map((postDetails) => (
          <MainPost post={postDetails} key={postDetails._id} />
        ))
      )}
    </Box>
  );
};

export default Feeds;
