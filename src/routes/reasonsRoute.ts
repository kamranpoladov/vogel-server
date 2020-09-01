import express = require("express");
import Reason from "../models/reason";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await Reason.countDocuments({ didAppear: false }).exec(
      async (error, count) => {
        if (error) {
          res.status(500).send({ error });
        } else if (count === 0) {
          res.status(204).send();
        } else {
          const random = Math.floor(Math.random() * count);
          await Reason.findOne({ didAppear: false })
            .skip(random)
            .exec(async (err, reason) => {
              if (err) {
                res.status(500).send({ error });
              } else if (!reason) {
                res.status(400).send();
              } else {
                reason.didAppear = true;
                await reason.save();
                res.send({ reason });
              }
            });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.put("/", async (req, res) => {
  try {
    const update = await Reason.updateMany(
      { didAppear: true },
      { didAppear: false }
    );
    res.send({ update });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.post("/", async (req, res) => {
  const reason = req.body;

  const createdReason = await Reason.create(reason);
  res.send(createdReason);
});

export default router;
