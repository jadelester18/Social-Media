import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Followers from "./Followers";
import axios from "axios";
import ToFollow from "./ToFollow";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const RightBar = () => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;

  //Show Profile Data of Specific User
  let location = useLocation();
  let id = location.pathname.split("/")[2];

  let idNewFollowers = userLogged?.other?._id;
  let idForSuggestToFollow = userLogged?.other?._id;

  //For Screen Loader
  const [loading, setLoading] = useState(false);

  //For Get List Of All Avaible User To Follow
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUserPosted = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/all/availuser/${idForSuggestToFollow}`
        );
        const removeLoggedin = res.data.filter(
          (users) => users._id !== idForSuggestToFollow
        );
        setUser(removeLoggedin);
        setLoading(true);
      } catch (error) {
        console.log("Showing available user error.");
      }
    };
    getUserPosted();
  }, [idForSuggestToFollow, user]);

  //For Get List Of New Followers
  const [newFollowerUser, setnewFollowerUser] = useState([]);
  useEffect(() => {
    const getnewFollowers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/followerslist/${idNewFollowers}`
        );
        setnewFollowerUser(res.data);
        setLoading(true);
      } catch (error) {
        console.log("Get new followers list error.");
      }
    };
    getnewFollowers();
  }, [idNewFollowers, newFollowerUser]);

  return (
    <Box
      flex={1}
      p={2}
      sx={{ display: { xs: "none", sm: "none", lg: "block" } }}
    >
      <Box
        position="fixed"
        sx={{
          width: "22%",
        }}
      >
        <Typography
          level="body2"
          textTransform="uppercase"
          fontWeight="xl"
          mb={1}
          sx={{ letterSpacing: "0.1rem" }}
          fontSize=".8rem"
        >
          Suggested for you
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 400,
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
          {loading ? (
            user.map((item) => <ToFollow users={item} key={item._id} />)
          ) : (
            <Spinner />
          )}
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <Typography
            level="body2"
            textTransform="uppercase"
            fontWeight="xl"
            mb={1}
            sx={{ letterSpacing: "0.1rem" }}
            fontSize=".8rem"
          >
            My Followers
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "15rem",
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
            {loading ? (
              newFollowerUser
                .map((item) => (
                  <Stack key={item._id}>
                    <Followers followers={item} />
                  </Stack>
                ))
                .reverse()
            ) : (
              <Spinner />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RightBar;
