import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Explore = () => {
  //Get the data from database
  const accesstoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjYxMjc0YjVhOGE2NjkwNjE4NTA4NSIsInVzZXJuYW1lIjoiamFkZWxlc3RlcjE4IiwiaWF0IjoxNjc3MjA1MTY2fQ.M_Tsoo3SfobIztA1L2w0JJ-nIfSab5lZyN58TGzsKrU";

  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/followers/63f61274b5a8a66906185085",
          {
            headers: {
              token: accesstoken,
            },
          }
        );
        setPost(res.data);
      } catch (error) {}
    };
    getPost();
  }, []);

  return (
    <Box>
      <Typography
        level="body2"
        textTransform="uppercase"
        fontWeight="xl"
        mb={1}
        sx={{ letterSpacing: "0.1rem" }}
        fontSize=".8rem"
      >
        Explore
      </Typography>
      <ImageList
        sx={{
          width: "100%",
          maxWidth: 360,
          height: 350,
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
          },
        }}
        variant="woven"
        cols={3}
        gap={8}
      >
        {post.map((item) =>
          item.map((image) => (
            <ImageListItem key={image.image}>
              <img
                src={`${image.image}?w=161&fit=crop&auto=format`}
                srcSet={`${image.image}?w=161&fit=crop&auto=format&dpr=2 2x`}
                alt={image.image}
                loading="lazy"
              />
            </ImageListItem>
          ))
        )}
      </ImageList>
    </Box>
  );
};

export default Explore;
