import "./App.css";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Verifyemail from "./pages/Verifyemail";
import Forgetpassword from "./pages/Forgetpassword";
import Resetpassword from "./pages/Resetpassword";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Box>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/login" element={<Home />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/verify/email" element={<Verifyemail />} />
              <Route path="/forgot/password" element={<Forgetpassword />} />
              <Route path="/reset/password" element={<Resetpassword />} />
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </Stack>
        </Box>
      </BrowserRouter>
    </>
  );
}

export default App;
