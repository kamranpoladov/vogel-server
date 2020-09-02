import express = require("express");

// Middleware to restrict access to API
const restict = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (
    req.headers["vogel-secret"] &&
    req.headers["vogel-secret"] === process.env.SECRET
  ) {
    res.locals.restrict = false;
    next();
  } else {
    res.locals.restrict = true;
    next();
  }
};

export default restict;
