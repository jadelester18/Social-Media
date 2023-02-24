import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Followers from "./Followers";
import axios from "axios";
import ToFollow from "./ToFollow";

const RightBar = () => {
  const accesstoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjYxMjc0YjVhOGE2NjkwNjE4NTA4NSIsInVzZXJuYW1lIjoiamFkZWxlc3RlcjE4IiwiaWF0IjoxNjc3MjA1MTY2fQ.M_Tsoo3SfobIztA1L2w0JJ-nIfSab5lZyN58TGzsKrU";

  //For Get List Of All Avaible User To Follow
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUserPosted = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/all/availuser`,
          {
            headers: {
              token: accesstoken,
            },
          }
        );
        setUser(res.data);
      } catch (error) {
        console.log("Showing available user error.");
      }
    };
    getUserPosted();
  }, []);

  //For Get List Of New Followers
  const [newFollowerUser, setnewFollowerUser] = useState([]);
  useEffect(() => {
    const getnewFollowers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/all/newfollowers`,
          {
            headers: {
              token: accesstoken,
            },
          }
        );
        setnewFollowerUser(res.data);
      } catch (error) {
        console.log("Get new followers list error.");
      }
    };
    getnewFollowers();
  }, []);

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
          {user.map((item) => (
            <ToFollow users={item} key={item._id} />
          ))}
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
            New Followers
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
            {newFollowerUser.map((item) => (
              <Followers followers={item} key={item._id} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RightBar;
