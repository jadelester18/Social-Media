import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Switch,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Verifyemail from "./pages/Verifyemail";
import Forgetpassword from "./pages/Forgetpassword";
import Resetpassword from "./pages/Resetpassword";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "./components/Spinner/Loader";
import { Grid } from "@mui/material";

function App() {
  const userLoggedinDetails = useSelector((state) => state.user);
  let user = userLoggedinDetails.user;
  // console.log(user);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Loader />
          </Grid>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                user?.other?.verified === true ? (
                  <Home />
                ) : (
                  <Navigate to={"/login"} replace={true} />
                )
              }
            />
            <Route path={`/Profile/:id`} element={<Profile />} />
            <Route
              path="/login"
              element={
                user?.other?.verified === true ? (
                  <Navigate to={"/"} replace={true} />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user?.other?.verified === true ? (
                  <Navigate to={"/"} replace={true} />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/verify/email"
              element={
                user?.Status === "Pending" ? (
                  <Verifyemail />
                ) : user?.other?.verified === true ? (
                  <Navigate to={"/"} replace={true} />
                ) : (
                  <Login />
                )
              }
            ></Route>
            <Route
              path="/forgot/password"
              element={
                user?.other?.verified === true ? (
                  <Navigate to={"/"} replace={true} />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/reset/password"
              element={
                user?.other?.verified === true ? (
                  <Navigate to={"/"} replace={true} />
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
