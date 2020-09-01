import multer = require("multer");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },
});
const upload = multer({ storage });

export default upload;
