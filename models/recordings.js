const mongoose = require('mongoose');

// Define a schema for recordings
const recordingSchema = new mongoose.Schema({
  recordingName: {
    type: String,
    required: true,
  },
  metadata: {
    // Define the metadata fields here
    author: String,
    date: Date,
    duration: Number, // Duration of the recording in seconds, for example
    // Add more metadata fields as needed
  },
  // Store the actual recording data as a binary buffer
  recordingData: {
    type: Buffer,
    required: true,
  },
});

// Create a model for the recording schema
const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;
