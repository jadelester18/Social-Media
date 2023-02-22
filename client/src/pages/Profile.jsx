import React from "react";
import ProfileLeftBar from "../components/ProfileLeftSideContainer/ProfileLeftBar";
import ProfileMainPost from "../components/ProfileMainPostContainer/ProfileMainPost";
import ProfilePost from "../components/ProfilePostContainer/ProfilePost";
import ProfileRightBar from "../components/ProfileRightSideContainer/ProfileRightBar";
import { Stack } from "@mui/material";

const Profile = () => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-evenly">
      <ProfilePost />
      <ProfileLeftBar />
      <ProfileMainPost />
      <ProfileRightBar />
    </Stack>
  );
};

export default Profile;
