import mongoose = require("mongoose");

interface ReasonModel extends mongoose.Document {
  text: string;
  isPrivate: boolean;
  didAppear: boolean;
}

const reasonSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  didAppear: {
    type: Boolean,
    default: false,
  },
});

export const Reason = mongoose.model<ReasonModel>("Reason", reasonSchema);
