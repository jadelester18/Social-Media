import React, { useEffect, useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import ProfileFeeds from "../components/ProfileMainPostContainer/ProfileFeeds";
import ProfileLeftBar from "../components/ProfileLeftSideContainer/ProfileLeftBar";
import ProfileRightBar from "../components/ProfileRightSideContainer/ProfileRightBar";
import { useSelector } from "react-redux";

const Profile = () => {
  //For Theme Management
  var data = window.localStorage.getItem("Theme");
  const [mode, setMode] = useState("light");

  const darkTheme = createTheme({
    palette: {
      mode: mode,
      white: {
        main: "#eceff1",
      },
    },
  });

  useEffect(() => {
    setMode(JSON.parse(data));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Theme", JSON.stringify(mode));
  }, [mode]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            marginLeft: { xs: "0%", sm: "10%", md: "10%" },
            marginRight: { xs: "0%", sm: "0%", md: "10%" },
            spacing: { xs: 0, sm: 0, md: 2 },
          }}
        >
          <ProfileLeftBar setThemeMode={setMode} mode={mode} />
          <ProfileFeeds />
          <ProfileRightBar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;
