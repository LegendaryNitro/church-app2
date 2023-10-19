const mongoose = require("mongoose");
const { Schema } = mongoose;

const SermonSchema = new Schema({
  topic: { type: String, required: true, unique: false },
  description: { type: String, required: true, unique: false },
  author: {
    type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
    required: true,
    ref: 'UserChurchApp',
    unique: false, // Remove the quotes around false
  },
  link: { type: String, required: true, unique: false },
}, { timestamps: true });

module.exports = mongoose.model("Sermon", SermonSchema);
