reportWebVitals();
const express = require("express");
const app = express();
const mongo = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./server/router/user");
const postRouter = require("./server/router/post");
const { default: reportWebVitals } = require("../reportWebVitals");
dotenv.config();

mongo
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Mongodb connection successful");
  })
  .catch(() => {
    console.log("Something went wrong.");
  });
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
