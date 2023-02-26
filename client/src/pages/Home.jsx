import React, { useEffect, useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import LeftBar from "../components/LeftSideContainer/LeftBar";
import Feeds from "../components/MainPostContainer/Feeds";
import RightBar from "../components/RightSideContainer/RightBar";

const Home = () => {
  //For Dark Theme
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
          spacing={2}
          justifyContent="space-between"
          sx={{
            marginLeft: { xs: "0%", sm: "10%" },
            marginRight: { xs: "0%", sm: "10%" },
          }}
        >
          <LeftBar setThemeMode={setMode} mode={mode} />
          <Feeds />
          <RightBar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
