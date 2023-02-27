import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProfilePost from "../ProfilePostContainer/ProfileData";
import ProfileMainPost from "./ProfileMainPost";

const ProfileFeeds = () => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  // let id = userLogged.other._id;
  const accesstoken = userLogged.accessToken;

  //Show Profile Data of Specific User
  let location = useLocation();
  let id = location.pathname.split("/")[2];

  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/post/get/post/${id}`
        );
        setPost(res.data);
      } catch (error) {}
    };
    getPost();
  }, []);

  return (
    <Box flex={2} p={2}>
      <ProfilePost />
      {post
        .map((item) => <ProfileMainPost post={item} key={item._id} />)
        .reverse()}
    </Box>
  );
};

export default ProfileFeeds;
