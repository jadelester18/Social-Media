import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Alert,
  IconButton,
  Input,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { signup } from "../components/ReduxContainer/ApiCall";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Joi from "joi";
import app from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const theme = createTheme();

export default function Register() {
  const dispatch = useDispatch();
  // const { isFetching, error } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  // const [email, setEmail] = useState('');
  // const [phonenumber, setphonenumber] = useState('');
  // const [username, setusername] = useState('');
  // const [password, setpassword] = useState('');
  // const [firstname, setFirstName] = useState('');
  // const [lastname, setLastName] = useState('');
  const [file, setfile] = useState(null);
  const userDetails = user.user;
  const navigator = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phonenumber: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setForm({
      ...form,
      [input.name]: input.value,
    });

    const result = schema
      .extract(input.name)
      .label(input.name)
      .validate(input.value);

    if (result.error) {
      setErrors({ ...errors, [input.name]: result.error.details[0].message });
    } else {
      delete errors[input.name];
      setErrors(errors);
    }
  };

  const [errors, setErrors] = useState({
    form,
  });

  const schema = Joi.object({
    firstname: Joi.string().min(2).max(100).required(),
    lastname: Joi.string().min(2).max(100).required(),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    phonenumber: Joi.number().min(10),
    password: Joi.string().min(6).max(20).required(),
  });

  const isFormInvalid = () => {
    const result = schema.validate(form);

    return !!result.error;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setOpen2(false);
    setOpen3(false);
  };

  const handleClick = (e) => {
    e.preventDefault();

    // const fileName = new Date().getTime() + file?.name;
    // const storage = getStorage(app);
    // const StorageRef = ref(storage, fileName);

    // const uploadTask = uploadBytesResumable(StorageRef, file);
    // if (email && username && firstname && lastname && password && phonenumber) {
    try {
      if (userDetails === true) {
        setOpen3(true);
      }
    } catch {
      console.log("no user");
    }
    //   if (email === username) {
    signup(dispatch, form);
    //   } else {
    //     setOpen(true);
    //   }
    // } else {
    //   setOpen2(true);
    // }
  };

  try {
    console.log("USER: " + JSON.stringify(userDetails?.user));
    console.log("Status: " + userDetails?.Status);
    if (userDetails?.Status === "Pending") {
      navigator("/verify/email");
    }
  } catch {
    console.log("no data");
  }

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Snackbar open={open3} autoHideDuration={2000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              Email Already exist!
            </Alert>
          </Snackbar>
          {/* <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: '100%' }}
            >
              Email does not match!
            </Alert>
          </Snackbar>
          <Snackbar open={open2} autoHideDuration={2000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: '100%' }}
            >
              Please fill out the form completely
            </Alert>
          </Snackbar>  */}
          <Box
            component="form"
            noValidate
            onSubmit={handleClick}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6}>
                <Input
                  type="file"
                  onChange={(e) => setfile(e.target.files[0])}
                ></Input>
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstname"
                  label="First Name"
                  error={!!errors.firstname}
                  helperText={errors.firstname}
                  onChange={handleChange}
                  value={form.firstname}
                  autoComplete="given-name"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastname"
                  error={!!errors.lastname}
                  helperText={errors.lastname}
                  onChange={handleChange}
                  value={form.lastname}
                  label="Last Name"
                  autoComplete="family-name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username}
                  onChange={handleChange}
                  value={form.username}
                  autoComplete="username"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={handleChange}
                  value={form.email}
                  autoComplete="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="phonenumber"
                  error={!!errors.phonenumber}
                  helperText={errors.phonenumber}
                  onChange={handleChange}
                  value={form.phonenumber}
                  fullWidth
                  label="Phone Number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type={showPassword ? "text" : "password"}
                  name="password"
                  label="Password"
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={handleChange}
                  value={form.password}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
