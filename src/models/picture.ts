import mongoose = require("mongoose");

interface PictureModel extends mongoose.Document {
  img: {
    data: Buffer;
    contentType: string;
  };
}

const pictureSchema = new mongoose.Schema({
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Picture = mongoose.model<PictureModel>("Picture", pictureSchema);

export default Picture;
