import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Card,
  CardMedia,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';

export default function Resetpassword() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          margin: '150px auto',
          width: '450px',
          padding: '30px',
          boxShadow: '5',
        }}
      >
        <CardMedia
          component="img"
          height="auto"
          image="https://img.freepik.com/premium-vector/landing-page-illustration-design-people-forgot-her-password_108061-334.jpg?w=1380"
          title="OTP image"
          sx={{ marginBottom: '30px' }}
        />
        <Stack
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6">Enter your new password</Typography>
          <form>
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="standard-adornment-password"
              autoComplete="new-password"
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
              // onChange={(e) => setpassword(e.target.value)}
            />
            <Button
              sx={{ marginTop: '20px' }}
              variant="contained"
              fullWidth
              // onClick={handleClick}
            >
              Set Password
            </Button>
          </form>
        </Stack>
      </Card>
    </Container>
  );
}
