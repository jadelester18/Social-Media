import React, { useEffect, useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import LeftBar from "../components/LeftSideContainer/LeftBar";
import Feeds from "../components/MainPostContainer/Feeds";
import RightBar from "../components/RightSideContainer/RightBar";

const Home = () => {
  
  var data = window.localStorage.getItem("Theme");
  const [mode, setMode] = useState("light");

  const darkTheme = createTheme({
    palette: {
      mode: mode,
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
        <Stack direction="row" spacing={2} justifyContent="space-evenly">
          <LeftBar setThemeMode={setMode} mode={mode} />
          <Feeds />
          <RightBar />
        </Stack>
      </Box>
    </ThemeProvider>
  ); 
};

export default Home;
