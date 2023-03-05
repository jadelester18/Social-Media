import { Box, Grid, ImageList, ImageListItem, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import FollowingList from "./FollowingList";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const ProfileRightBar = () => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // const accesstoken = userLogged.accessToken;

  //Show Profile Data of Specific User
  let location = useLocation();
  let id = location.pathname.split("/")[2];

  //For Screen Loader
  const [loading, setLoading] = useState(false);

  //Get the user post
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const getUserPosted = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/post/user/details/${id}`
        );
        setUserDetails(res.data);
        setLoading(true);
      } catch (error) {
        console.log("Post details has issue.");
      }
    };
    getUserPosted();
  }, [id]);

  //Getting image post of user logged in
  const [post, setPost] = useState([]);
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/post/get/post/${id}`
        );
        setPost(res.data);
        setLoading(true);
      } catch (error) {}
    };
    getPost();
  }, [id]);

  //For Get List Of All Following of user logged in
  const [following, setFollowing] = useState([]);
  useEffect(() => {
    const getUserFollowing = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/following/${id}`
        );
        setFollowing(res.data);
      } catch (error) {
        console.log("Showing available user error.");
      }
    };
    getUserFollowing();
  }, [id]);

  return (
    <Box
      flex={1}
      p={2}
      sx={{ display: { xs: "none", sm: "none", lg: "block" } }}
    >
      <Box
        position="fixed"
        sx={{
          width: "20%",
        }}
      >
        <ImageList
          sx={{
            width: "100%",
            height: 400,
            "&::-webkit-scrollbar": {
              width: "0em",
            },
            // "&::-webkit-scrollbar-track": {
            //   background: "#f1f1f1",
            // },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
            },
            borderRadius: "10%",
          }}
          variant="quilted"
          cols={4}
          rowHeight={121}
        >
          {loading ? (
            post.map((item) =>
              item.image === "" ? (
                ""
              ) : (
                <ImageListItem
                  key={item._id}
                  cols={item.cols || 1}
                  rows={item.rows || 1}
                >
                  <img
                    {...srcset(item.image, 121, item.rows, item.cols)}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              )
            )
          ) : (
            <Spinner />
          )}
        </ImageList>
        <Box sx={{ marginTop: 3 }}>
          <Typography
            level="body2"
            textTransform="uppercase"
            fontWeight="xl"
            mb={1}
            sx={{ letterSpacing: "0.1rem" }}
            fontSize=".8rem"
          >
            {userDetails?.firstname} Follows
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 350,
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              // "&::-webkit-scrollbar-track": {
              //   background: "#f1f1f1",
              // },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
              },
            }}
          >
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {loading ? (
                following &&
                following.slice(0, 6).map((item) => (
                  <Grid
                    item
                    xs={4}
                    component={Link}
                    to={`/Profile/${item._id}`}
                    key={item._id}
                    sx={{ textDecoration: "none" }}
                  >
                    <FollowingList users={item} />
                  </Grid>
                ))
              ) : (
                <Spinner />
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileRightBar;
