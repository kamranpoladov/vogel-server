import express = require("express");
import { Reason } from "../models";
import restict from "../middleware/restrict";

const router = express.Router();

/*

    Logic of the following endpoints is
    fairy similar to the one of /pictures/
    so, please, refer to picturesRoute.ts
    to see extensive commenting

*/

// Get a random reason
router.get("/", async (req, res) => {
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
            res.status(205).send();
          } else {
            const random = Math.floor(Math.random() * count);
            await Reason.findOne({ didAppear: false })
              .skip(random)
              .exec(async (err, reason) => {
                if (err) {
                  res.status(500).send({ error });
                } else if (!reason) {
                  res.status(400).send({ message: "Couldn't get a reason" });
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

// Reset reasons
router.put("/", async (req, res) => {
  if (res.locals.restrict) {
    res.status(400).send({ message: "You don't have permissions to do that" });
  } else {
    try {
      const update = await Reason.updateMany(
        { didAppear: true },
        { didAppear: false }
      );
      res.send({ update });
    } catch (error) {
      res.status(500).send({ error });
    }
  }
});

// Create reason
router.post("/", async (req, res) => {
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
