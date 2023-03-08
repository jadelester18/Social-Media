import {
  Button,
  Card,
  CardMedia,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

export default function Resetpassword() {
  const navigate = useNavigate();

  const location = useLocation();
  const code = location.search.split("?")[1];
  console.log(code);
  const [password, setpassword] = useState("");
  console.log(password);
  const handleClick = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/api/user/reset/password?${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify({ password: password }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Your password has been reset successfully.");
          navigate("/login", { replace: true });
        } else {
          throw new Error("Failed to reset password.");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          margin: "150px auto",
          width: "450px",
          padding: "30px",
          boxShadow: "5",
        }}
      >
        <CardMedia
          component="img"
          height="auto"
          image="https://img.freepik.com/premium-vector/landing-page-illustration-design-people-forgot-her-password_108061-334.jpg?w=1380"
          title="OTP image"
          sx={{ marginBottom: "30px" }}
        />
        <Stack
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6">Enter your new password</Typography>
          <form>
            <TextField
              type="password"
              placeholder="**********"
              size="small"
              fullWidth
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button
              sx={{ marginTop: "20px" }}
              variant="contained"
              fullWidth
              onClick={handleClick}
            >
              Set Password
            </Button>
          </form>
        </Stack>
      </Card>
    </Container>
  );
}
