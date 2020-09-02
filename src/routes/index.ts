import express = require("express");

import pictures from "./picturesRoute";
import reasons from "./reasonsRoute";
import restict from "../middleware/restrict";

const router = express.Router();

router.use("/reasons", restict, reasons);
router.use("/pictures", restict, pictures);

export default router;
