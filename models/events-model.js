const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: false },
    event: { type: String, required: true, unique: false },
    date: { type: String, required: true, unique: false },
    time: { type: String, required: true, unique: false },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);