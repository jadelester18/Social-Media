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

export default function Resetpassword() {
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
          width: '400px',
          padding: '30px',
          boxShadow: '5',
        }}
      >
        <CardMedia
          component="img"
          height="auto"
          image="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7886.jpg?w=826&t=st=1677641289~exp=1677641889~hmac=8ad57ad3e9cac5241f08dfec31aa5bdf719e9b900b73c835eac72fef5336e923"
          title="reset password"
          sx={{ marginBottom: '30px' }}
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
