import express = require("express");
import Reason from "../models/reason";
import restict from "../middleware/restrict";

const router = express.Router();

router.get("/", restict, async (req, res) => {
  if (res.locals.restrict) {
    res.send({
      reason: {
        text: "for sample reason",
      },
    });
  } else {
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
  }
});

router.put("/", restict, async (req, res) => {
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

router.post("/", restict, async (req, res) => {
  if (res.locals.restrict) {
    res.status(400).send({ mess: "You don't have permissions to do that" });
  } else {
    try {
      const reason = req.body;

      const createdReason = await Reason.create(reason);
      res.send(createdReason);
    } catch (error) {
      res.status(500).send({ error });
    }
  }
});

export default router;
