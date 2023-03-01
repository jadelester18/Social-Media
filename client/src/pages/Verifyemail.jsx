import React from 'react';

  const handleOTP = (e) => {
    e.preventDefault();
    VerifyEmail(dispatch, { OTP: OTP, user: id });
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
          image="https://img.freepik.com/free-vector/enter-otp-concept-illustration_114360-7867.jpg?w=1380&t=st=1677556310~exp=1677556910~hmac=7317addb689575d129fd0b45d705983a69b94ae8b01363eb03ea7568ccf7e17a"
          title="OTP image"
          sx={{ marginBottom: '30px' }}
        />
        <Stack
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6">
            The OTP has been sent to your email!
          </Typography>
          <form>
            <TextField
              type="number"
              placeholder="Enter Your OTP"
              size="small"
              fullWidth
              sx={{ paddingTop: '20px' }}
              onChange={(e) => setOTP(e.target.value)}
            />
            <Button
              sx={{ margin: '20px auto' }}
              variant="contained"
              fullWidth
              onClick={handleOTP}
            >
              Confirm OTP
            </Button>
            <Link
              to={'/register'}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <Typography>Check your email for the OTP</Typography>
            </Link>
          </form>
        </Stack>
      </Card>
    </Container>
  );
}
