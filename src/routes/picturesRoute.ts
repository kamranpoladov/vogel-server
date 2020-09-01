import express = require("express");
import fs = require("fs");
import Picture from "../models/picture";
import upload from "../utils/uploadPicture";

const router = express.Router();

// Get a random picture to display
router.get("/", async (req, res) => {
  try {
    await Picture.countDocuments().exec(async (error, count) => {
      if (error) {
        res.status(500).send({ error });
      } else {
        const random = Math.floor(Math.random() * count);
        await Picture.findOne()
          .skip(random)
          .exec((err, picture) => {
            if (err) {
              res.status(500).send({ error: err });
            } else if (!picture) {
              res.status(400).send({ message: "Coundn't get a picture" });
            } else {
              res.send({ picture });
            }
          });
      }
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Upload a picture
router.post("/", upload.single("picture"), async (req, res) => {
  try {
    const picture = new Picture();
    picture.img.data = fs.readFileSync(req.file.path);
    picture.img.contentType = "image/jpeg";
    await picture.save();

    res.json({ message: "New picture uploaded" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default router;
