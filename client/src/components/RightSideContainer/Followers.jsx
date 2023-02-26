import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Followers = ({ followers }) => {
  //Show Profile Data of Specific User
  let location = useLocation();
  let id = location.pathname.split("/")[2];
  // console.log(id);
  return (
    <Card sx={{ boxShadow: 1 }}>
      <CardContent>
        <List sx={{ width: "100%", maxWidth: 360 }} dense disablePadding>
          <ListItem alignItems="flex-start" key={followers._id}>
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src={followers.profilepicture}
                component={Link}
                to={`/Profile/${followers._id}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                followers.firstname.charAt(0).toUpperCase() +
                followers.firstname.slice(1) +
                " " +
                followers.lastname.charAt(0).toUpperCase() +
                followers.lastname.slice(1)
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {followers.followers.length === undefined
                      ? "No followers"
                      : followers.followers.length + " Followers"}
                  </Typography>
                  {/* {" — I'll be in your neighborhood doing errands this…"} */}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      </CardContent>
    </Card>
  );
};

export default Followers;
