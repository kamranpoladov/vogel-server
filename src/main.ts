import express = require("express");
import cors = require("cors");

const app = express();
const port = process.env.PORT || 1803;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});
