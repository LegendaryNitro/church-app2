const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // Import the v4 function from uuid

// Define a route for creating a room
router.post("/create", (req, res) => {
  // Generate a unique room ID using uuidv4()
  const roomId = uuidv4();

  // Return the room ID to the client
  res.json({ roomId });
});

// Define a route for joining a room
router.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  res.sendFile(__dirname + "/videoChat.js"); // Serve the React app
});

module.exports = router;
