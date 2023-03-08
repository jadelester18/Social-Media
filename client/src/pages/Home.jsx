import React, { useEffect, useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import LeftBar from "../components/LeftSideContainer/LeftBar";
import Feeds from "../components/MainPostContainer/Feeds";
import RightBar from "../components/RightSideContainer/RightBar";

const Home = () => {
  //For Dark Theme
  var data = window.localStorage.getItem("Theme");
  var LD = "light";
  if (data) {
    LD = JSON.parse(data);
  }
  const [mode, setMode] = useState(LD);

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
        <Navbar setThemeMode={setMode} mode={mode} />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            marginLeft: { xs: "0%", sm: "0px", md: "10%" },
            marginRight: { xs: "0%", sm: "0px", md: "10%" },
            spacing: { xs: 0, sm: 0, md: 2 },
          }}
        >
          <LeftBar />
          <Feeds />
          <RightBar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
