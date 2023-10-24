// Import required modules and dependencies
const express = require('express');
const router = express.Router();
const Event = require('../../models/events-model');
import { verifyTokenAndAuthorization } from './verifyToken';

// CREATE a new Wysiwygannouncement
router.post('/', async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      event: req.body.event,
      date: req.body.date,
      time: req.body.time,
      author: req.body.author,
    });
    await event.save();
    res.status(201).json({ success: true, message: 'announcement created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create announcement', error: err });
  }
});

// READ all Wysiwygannouncements
router.get('/', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, message: 'announcements retrieved successfully', data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve announcements', error: err });
  }
});

// READ a single Wysiwygannouncement by ID
router.get('/:id',verifyTokenAndAuthorization, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200).json({ success: true, message: 'announcement retrieved successfully', data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve announcement', error: err });
  }
});

// UPDATE a Wysiwygannouncement by ID
router.put('/:id',verifyTokenAndAuthorization, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      updatedAt: Date.now(),
    }, { new: true });
    res.status(200).json({ success: true, message: 'announcement updated successfully', data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update announcement', error: err });
  }
});

// DELETE a Wysiwygannouncement by ID
router.delete('/:id',verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement', error: err });
  }
});

module.exports = router;
