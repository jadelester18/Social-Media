import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Follow from "./Follow";

const RightBar = () => {
  return (
    <Box
      position="sticky"
      flex={1}
      p={2}
      sx={{ display: { xs: "none", sm: "none", lg: "block" } }}
    >
      <Box position="fixed" sx={{ width: "22%" }}>
        <Typography variant="body2">Suggested for you</Typography>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <PersonAddOutlinedIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar
                sizes="large"
                alt="Iverson"
                src="https://3.bp.blogspot.com/-xAWqV2_qhsA/XIkQpwon87I/AAAAAAAAACk/CfMKOGodYdIdbeI0N14n0UkxZbAxA8HbQCLcBGAs/s1600/Dela-Roca.png"
              />
            </ListItemAvatar>
            <ListItemText
              primary="Jade Ballester"
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
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <PersonAddOutlinedIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar
                sizes="large"
                alt="Iverson"
                src="https://3.bp.blogspot.com/-xAWqV2_qhsA/XIkQpwon87I/AAAAAAAAACk/CfMKOGodYdIdbeI0N14n0UkxZbAxA8HbQCLcBGAs/s1600/Dela-Roca.png"
              />
            </ListItemAvatar>
            <ListItemText
              primary="Jade Ballester"
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
        <Follow />
      </Box>
    </Box>
  );
};

export default RightBar;
