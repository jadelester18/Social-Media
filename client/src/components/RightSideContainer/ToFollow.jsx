import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ToFollow = ({ users }) => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  let id = userLogged.other._id;
  let accesstoken = userLogged.accessToken;

  const [follow, setFollow] = useState(<PersonAddOutlinedIcon />);

  const handleFollowUser = async (e) => {
    await fetch(`http://localhost:5000/api/user/follow/${e}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/Json", token: accesstoken },
      body: JSON.stringify({ user: `${id}` }),
    });
    setFollow(<PersonRemoveOutlinedIcon />);
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <ListItem
        alignItems="flex-start"
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="follow"
            onClick={(e) => handleFollowUser(users._id)}
          >
            {follow}
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar
            sizes="large"
            alt={users.username}
            src={users.profilepicture}
            component={Link}
            to={`/Profile/${users._id}`}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            users.firstname.charAt(0).toUpperCase() +
            users.firstname.slice(1) +
            " " +
            users.lastname.charAt(0).toUpperCase() +
            users.lastname.slice(1)
          }
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Suggested for you
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
};

export default ToFollow;
