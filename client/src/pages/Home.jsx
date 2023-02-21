import React, { useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import LeftBar from "../components/LeftSideContainer/LeftBar";
import Feeds from "../components/MainPostContainer/Feeds";
import RightBar from "../components/RightSideContainer/RightBar";

const Home = () => {
  const [mode, setMode] = useState("light");

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <LeftBar setThemeMode={setMode} mode={mode} />
          <Feeds />
          <RightBar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
