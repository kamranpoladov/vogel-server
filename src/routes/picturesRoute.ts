import express = require("express");
import fs = require("fs");
import { Picture } from "../models";
import upload from "../utils/uploadPicture";
import restict from "../middleware/restrict";

const router = express.Router();

// Get a random picture
router.get("/", async (req, res) => {
  if (res.locals.restrict) {
    // If user does not have sufficient rights
    // send a picture with fluffy clouds
    const picture = await Picture.findById("5f4f3a2f76f3703d8c988d1c");
    res.send({ picture });
  } else {
    try {
      // Count how many pictures have not ever appeared to client
      await Picture.countDocuments({ didAppear: false }).exec(
        async (error, count) => {
          if (error) {
            res.status(500).send({ error });
          } else if (count === 0) {
            res.status(205).send(); // Let the client know when there are no such pictures left
          } else {
            // Send a random picture
            const random = Math.floor(Math.random() * count);
            await Picture.findOne({ didAppear: false })
              .skip(random)
              .exec(async (err, picture) => {
                if (err) {
                  res.status(500).send({ error: err });
                } else if (!picture) {
                  res.status(400).send({ message: "Coundn't get a picture" });
                } else {
                  picture.didAppear = true; // True since client has already seen it
                  await picture.save();
                  res.send({ picture });
                }
              });
          }
        }
      );
    } catch (error) {
      res.status(500).send({ error });
    }
  }
});

// Upload pictures
router.post("/", upload.array("pictures"), async (req, res) => {
  if (res.locals.restrict) {
    res.status(400).send({ message: "You don't have permissions to do that" });
  } else {
    try {
      (req.files as Express.Multer.File[]).map(async (file) => {
        const picture = new Picture();
        picture.img.data = fs.readFileSync(file.path);
        picture.img.contentType = "image/jpeg"; // TODO: dynamic content type
        await picture.save();
      });

      res.json({ message: "New pictures uploaded" });
    } catch (error) {
      res.status(500).send({ error });
    }
  }
});

// Reset pictures
// Called when client has seen
// all the pictures and they need
// to be reset
router.put("/", async (req, res) => {
  if (res.locals.restrict) {
    res.status(400).send({ message: "You don't have permissions to do that" });
  } else {
    try {
      // Set all the pictures that client
      // has seen to "unseen"
      const update = await Picture.updateMany(
        { didAppear: true },
        { didAppear: false }
      );
      res.send({ update });
    } catch (error) {
      res.status(500).send({ error });
    }
  }
});

export default router;
