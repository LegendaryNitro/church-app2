const router = require("express").Router();
const mongoose = require("mongoose");
const Chat = require("../models/chat-model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");



const Message = mongoose.model('Message', {
  room: String,
  author: String,
  message: String,
  time: String,
});


// Define a route to send a message to the database
router.post('/messages', async (req, res) => {
  try {
    const { room, author, message, time } = req.body;
    const newMessage = new Message({ room, author, message, time });
    await newMessage.save();
    res.status(200).send('Message saved successfully');
  } catch (err) {
    res.status(500).send('Error saving message: ' + err.message);
  }
});

// Define a route to retrieve messages from the database
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.query.room });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Error fetching messages: ' + err.message);
  }
});





module.exports = router;
