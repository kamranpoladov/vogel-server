import * as dotenv from "dotenv";
dotenv.config();
import "./utils/db";
import express = require("express");
import cors = require("cors");
import reasonsRouter from "./routes/reasonsRoute";
import picturesRouter from "./routes/picturesRoute";

const app = express();
const port = process.env.PORT || 1212;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (request.method === "OPTIONS") {
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    return response.status(200).json();
  }

  next();
});

app.use("/reasons", reasonsRouter);
app.use("/pictures", picturesRouter);

app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});
