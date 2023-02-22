import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Home from "./Home";

export default function PageNotFound() {
  return (
    <Box
      sx={{
        margin: "auto",
        marginY: 40,
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid xs={6} pacing={4}>
            {/* <Typography variant="h1">404</Typography> */}
            <Typography variant="h3">
              The page you’re looking for doesn’t exist.
            </Typography>
            <Link to={"/"} style={{ textDecoration: "none" }}>
              <Button variant="contained">Back Home</Button>
            </Link>
          </Grid>
          <Grid xs={6}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/PageNotFound-2129569__340.jpg"
              alt=""
              width={500}
              height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
