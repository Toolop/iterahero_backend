const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cameraSchema = new Schema(
  {
    id_camera: Number,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("camera", cameraSchema);
