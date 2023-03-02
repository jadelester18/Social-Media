import {
  Alert,
  Button,
  Card,
  CardMedia,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { VerifyEmail } from '../components/ReduxContainer/ApiCall';
import Joi from 'joi';
import { Box } from '@mui/system';

export default function Verifyemail() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [OTP, setOTP] = useState('');
  const user = useSelector((state) => state.user);
  console.log(user);
  const userDetails = user.user;
  const id = userDetails?.user;
  console.log(id);
  console.log(userDetails);

  const handleOTP = (e) => {
    e.preventDefault();
    // VerifyEmail(dispatch, { ...form, user: id });
    VerifyEmail(dispatch, { ...form, OTP: form.otp, user: id });
  };

  const [form, setForm] = useState({
    otp: '',
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
    otp: Joi.string().length(4).required().messages({
      'string.length': 'OTP length must be equal to 4',
    }),
  });

  const isFormInvalid = () => {
    const result = schema.validate(form);

    return !!result.error;
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

          <Box component="form" noValidate>
            <TextField
              name="otp"
              placeholder="Enter your One Time Password"
              error={!!errors.otp}
              helperText={errors.otp}
              onChange={handleChange}
              value={form.otp}
              // onChange={(e) => setOTP(e.target.value)}
              size="small"
              fullWidth
              sx={{ paddingTop: '20px' }}
            />
            <Button
              sx={{ margin: '20px auto' }}
              variant="contained"
              fullWidth
              onClick={handleOTP}
              disabled={isFormInvalid()}
            >
              Confirm OTP
            </Button>
            <Link
              to={'/register'}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <Typography>Check your email for the OTP</Typography>
            </Link>
          </Box>
        </Stack>
      </Card>
    </Container>
  );
}
