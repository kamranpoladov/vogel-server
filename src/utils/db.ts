import mongoose = require("mongoose");

(async () => {
  try {
    mongoose.set("useUnifiedTopology", true);
    await mongoose.connect(process.env.MONGODB_URL || "", {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Connection to DB established successfully!");
  } catch (error) {
    throw new Error(error.message);
  }
})();
