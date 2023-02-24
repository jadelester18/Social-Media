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

const ToFollow = ({ users }) => {
  const accesstoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjYxMjc0YjVhOGE2NjkwNjE4NTA4NSIsInVzZXJuYW1lIjoiamFkZWxlc3RlcjE4IiwiaWF0IjoxNjc3MjA1MTY2fQ.M_Tsoo3SfobIztA1L2w0JJ-nIfSab5lZyN58TGzsKrU";
  const user = "63f61274b5a8a66906185085";

  const [follow, setFollow] = useState(<PersonAddOutlinedIcon />);

  const handleFollowUser = async (e) => {
    await fetch(`http://localhost:5000/api/user/follow/${e}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/Json", token: accesstoken },
      body: JSON.stringify({ user }),
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
