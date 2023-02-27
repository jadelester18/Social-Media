import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  FormControl,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TtyOutlinedIcon from "@mui/icons-material/TtyOutlined";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

const ProfileData = () => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  let idLogged = userLogged?.other._id;
  let accesstoken = userLogged.accessToken;
  // console.log(idLogged);

  //Show Profile Data of Specific User
  let location = useLocation();
  let id = location.pathname.split("/")[2];
  // console.log(id);

  //Fir Menu Edit
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
  }, []);

  //Trying to Follow or Unfollow Specific User
  const [followOrUnfollow, setFollowOrUnfollow] = useState([
    userLogged.other.following.includes(id) ? "Unfollow" : "Follow",
  ]);

  const handleFollowUser = async () => {
    if (followOrUnfollow == "Follow") {
      await fetch(`http://localhost:5000/api/user/follow/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/JSON", token: accesstoken },
        body: JSON.stringify({ user: `${idLogged}` }),
      });
      setFollowOrUnfollow("UnFollow");
    } else {
      await fetch(`http://localhost:5000/api/user/follow/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/JSON", token: accesstoken },
        body: JSON.stringify({ user: `${idLogged}` }),
      });
      setFollowOrUnfollow("Follow");
    }
  };

  return (
    <Box flex={4} p={2} sx={{ width: { sm: "100%" } }}>
      <Card sx={{ boxShadow: 5 }}>
        <CardMedia
          component="img"
          height="194"
          image="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGZvcmVzdHxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt="Paella dish"
        />
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: "red",
                height: { xs: "5rem" },
                width: { xs: "5rem" },
              }}
              aria-label="recipe"
              src={userData?.profilepicture}
            >
              R
            </Avatar>
          }
          action={
            id !== idLogged ? (
              followOrUnfollow == "Follow" ? (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ marginTop: 3, marginRight: 2, borderRadius: 10 }}
                  onClick={handleFollowUser}
                >
                  Follow
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ marginTop: 3, marginRight: 2, borderRadius: 10 }}
                  onClick={handleFollowUser}
                >
                  UnFollow
                </Button>
              )
            ) : (
              <Button
                variant="outlined"
                size="small"
                sx={{ marginTop: 3, marginRight: 2, borderRadius: 10 }}
                onClick={handleOpen}
              >
                Edit Profile
              </Button>
            )
          }
          title={
            // userData?.firstname
            userData?.firstname?.charAt(0).toUpperCase() +
            userData?.firstname?.slice(1) +
            " " +
            userData?.lastname?.charAt(0).toUpperCase() +
            userData?.lastname?.slice(1)
          }
          subheader={"@" + userData?.username}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
          </Typography>
          <CardContent>
            <Stack direction="row" spacing={1}>
              <LocalPhoneOutlinedIcon /> {"+63 " + userData?.phonenumber}
              <EventAvailableOutlinedIcon /> Joined{" "}
              {/* {userData?.joineddate.replace("-", " ").slice(0, -14)} */}
              {userData?.joineddate?.replace("-", " ").slice(0, -14)}
            </Stack>
          </CardContent>
          <CardContent>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                {userData?.following?.length} Following
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                {userData?.followers?.length} Followers
              </Typography>
            </Stack>
          </CardContent>
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ flexWrap: "wrap" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Profile
              <Button
                variant="contained"
                sx={{ float: "right", borderRadius: 10 }}
              >
                Save
              </Button>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
            <div>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  First name
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Last name
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Location
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Contact
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <TtyOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Upload
                  <input hidden accept="image/*" multiple type="file" />
                </Button>
              </FormControl>
            </div>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfileData;
