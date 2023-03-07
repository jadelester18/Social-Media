const express = require("express")
const app = express();
const mongo = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors");
const userRouter = require("./router/user");
const postRouter = require("./router/post");
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

app.listen(5000, () => console.log("Server running"))