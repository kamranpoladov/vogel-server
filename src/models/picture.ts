import mongoose = require("mongoose");

interface PictureModel extends mongoose.Document {
  img: {
    data: Buffer;
    contentType: string;
  };
  didAppear: boolean;
}

const pictureSchema = new mongoose.Schema({
  img: {
    data: Buffer,
    contentType: String,
  },
  didAppear: {
    type: Boolean,
    default: false,
  },
});

const Picture = mongoose.model<PictureModel>("Picture", pictureSchema);

export default Picture;
