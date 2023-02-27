import { Box, Grid, Paper, styled } from "@mui/material";
import React, { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const FollowingList = ({ users }) => {
  return (
    <Item>
      <Box
        component="img"
        sx={{
          height: 50,
          width: 50,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
          borderRadius: "10%",
        }}
        alt={users.username}
        src={users.profilepicture}
      />

      <Box sx={{ fontSize: "1rem", fontWeight: 3 }}>{"@" + users.username}</Box>
    </Item>
  );
};

export default FollowingList;
