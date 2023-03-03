import {
  Avatar,
  Box,
  Divider,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Switch,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const ProfileLeftBar = ({ setThemeMode, mode }) => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  let id = userLogged.other._id;
  let username = userLogged.other.username;

  //For Get List Of All Following
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

  //For saving dark theme to local storage
  var data = JSON.parse(localStorage.getItem("Theme"));
  var switchPos = false;
  if (data === "dark") {
    // console.log(data);
    switchPos = true;
  }

  //For Get Data of User Profile
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const getnewFollowers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/post/user/details/${id}`
        );
        setUserData(res.data);
      } catch (error) {
        console.log("Get new followers list error.");
      }
    };
    getnewFollowers();
  }, [id]);

  return (
    <Box
      flex={1}
      p={2}
      sx={{ display: { xs: "none", sm: "block", lg: "block" } }}
    >
      <Box>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem disablePadding>
            <ListItemButton component={Link} to={`/profile/${id}`}>
              <ListItemAvatar>
                <Avatar
                  alt={userLogged.other.username}
                  src={userData?.profilepicture}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  userData?.firstname?.charAt(0).toUpperCase() +
                  userData?.firstname?.slice(1) +
                  " " +
                  userData?.lastname?.charAt(0).toUpperCase() +
                  userData?.lastname?.slice(1)
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={`/`}>
              <ListItemIcon>
                <HouseOutlinedIcon size="large" />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <MailIcon size="large" />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItemButton>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      </Box>
    </Box>
  );
};

export default ProfileLeftBar;
