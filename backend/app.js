// import dependencies
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import logger from "morgan";
import mainRoutes from "./server/routes/main.js";
// set up route

const app = express();

import cors from "cors";
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

// set up dependencies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

app.use("/api/", mainRoutes);

// set up express app
// set up port
const port = 5035;
// set up route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Project with Nodejs Express and MongoDB",
  });
});
app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});

// set up mongoose
mongoose
  .connect("mongodb://localhost:27017/dataTodo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error connecting to database");
  });
