import express = require("express");
import fs = require("fs");
import Picture from "../models/picture";
import upload from "../utils/uploadPicture";
import restict from "../middleware/restrict";

const router = express.Router();

// Get a random picture to display
router.get("/", restict, async (req, res) => {
  try {
    await Picture.countDocuments({ didAppear: false }).exec(
      async (error, count) => {
        if (error) {
          res.status(500).send({ error });
        } else if (count === 0) {
          res.status(205).send();
        } else {
          const random = Math.floor(Math.random() * count);
          await Picture.findOne({ didAppear: false })
            .skip(random)
            .exec(async (err, picture) => {
              if (err) {
                res.status(500).send({ error: err });
              } else if (!picture) {
                res.status(400).send({ message: "Coundn't get a picture" });
              } else {
                picture.didAppear = true;
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
});

// Upload pictures
router.post("/", upload.array("pictures"), async (req, res) => {
  try {
    (req.files as Express.Multer.File[]).map(async (file) => {
      const picture = new Picture();
      picture.img.data = fs.readFileSync(file.path);
      picture.img.contentType = "image/jpeg";
      await picture.save();
    });

    res.json({ message: "New pictures uploaded" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.put("/", async (req, res) => {
  try {
    const update = await Picture.updateMany(
      { didAppear: true },
      { didAppear: false }
    );
    res.send({ update });
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default router;
