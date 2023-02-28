import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Post from "../PostContainer/Post";
import MainPost from "./MainPost";
import axios from "axios";
import { useSelector } from "react-redux";

const Feeds = () => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  let id = userLogged.other._id;
  const accesstoken = userLogged.accessToken;

  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/followers/${id}`,
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
      {post &&
        post
          .sort((a, b) => (a.createdat > b.createdat ? -1 : 1))
          .map((item) => (
            <Box key={item.createdat}>
              <MainPost post={item} />
            </Box>
          ))}
    </Box>
  );
};

export default Feeds;
