import React, { useEffect, useState } from "react";
import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { Link } from "react-router-dom";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../ReduxContainer/UserReducer";
import LOGO from "../Images/LOGO.png";
import axios from "axios";
import DarkModeSharpIcon from "@mui/icons-material/DarkModeSharp";
import Brightness4SharpIcon from "@mui/icons-material/Brightness4Sharp";
const MaterialUISwitch = styled(Switch)(({ theme }) => ({}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "0ch",
    "&:focus": {
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      width: "15ch",
      marginRight: "1ch",
    },
    [theme.breakpoints.up("sm")]: {
      width: "0ch",
      "&:focus": {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        width: "50ch",
      },
    },
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const Navbar = ({ setThemeMode, mode }) => {
  //For saving dark theme to local storage
  var data = JSON.parse(localStorage.getItem("Theme"));

  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  let id = userLogged.other._id;

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);

  const handleMenuUser = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUser = () => {
    setAnchorElUser(null);
  };

  const handleMenuNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  //For logout functionality
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  //For Get Data of User Profile
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const getnewFollowers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/post/user/details/${id}`
        );
        setUserData(res.data);
      } catch (error) {
        console.log("Get new followers list error.");
      }
    };
    getnewFollowers();
  }, [id]);
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 100,
      behavior: "smooth",
    });
  };

  return (
    <AppBar position="sticky" color="white">
      <StyledToolbar>
        <Logo>
          <Link to={`/`}>
            <Avatar
              onClick={handleScrollTop}
              src={`${LOGO}`}
              sx={{ display: { xs: "none", sm: "block" } }}
            />
          </Link>

          <Typography
            variant="h6"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            𝕃𝕚𝕗𝕖 𝕋𝕣𝕖𝕟𝕕𝕤
          </Typography>
        </Logo>
        <Link to={`/`}>
          <Avatar
            onClick={handleScrollTop}
            src={`${LOGO}`}
            sx={{ display: { xs: "block", sm: "none" } }}
          />
        </Link>
        <Icons>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              sx={{ float: "right" }}
            />
          </Search>

          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ visibility: "hidden", display: "none" }}
              />
            }
            label={
              data === "dark" ? <Brightness4SharpIcon /> : <DarkModeSharpIcon />
            }
            onChange={(e) => {
              setThemeMode(mode === "light" ? "dark" : "light");
            }}
          />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMenuUser}
          >
            <Avatar size="large" src={userData.profilepicture} />
          </IconButton>
        </Icons>
        <UserBox>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ mt: 4, visibility: "hidden", display: "none" }}
              />
            }
            label={
              data === "dark" ? <Brightness4SharpIcon /> : <DarkModeSharpIcon />
            }
            onChange={(e) => {
              setThemeMode(mode === "light" ? "dark" : "light");
            }}
          />
          <Avatar
            size="large"
            src={userLogged.other.profilepicture}
            onClick={handleMenuUser}
          />
        </UserBox>
      </StyledToolbar>
      <Menu
        id="user-menu"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUser}
        sx={{ mt: "45px" }}
      >
        <MenuItem component={Link} to={`/profile/${id}`}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} component={Link} to={`/login`}>
          Logout
        </MenuItem>
      </Menu>
      <Menu
        id="user-menu"
        anchorEl={anchorElNotification}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElNotification)}
        onClose={handleCloseNotification}
        sx={{ mt: "45px" }}
      >
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem alignItems="flex-start">
            <Typography variant="body1">Notifications</Typography>
          </ListItem>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
