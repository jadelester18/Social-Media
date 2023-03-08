import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store, persistor } from "./components/ReduxContainer/Store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

reportWebVitals();
const express = require("express");
const app = express();
const mongo = require("mongoose");
const dotenv = require("dotenv");
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

app.listen(5000, () => console.log("Server running"));
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
