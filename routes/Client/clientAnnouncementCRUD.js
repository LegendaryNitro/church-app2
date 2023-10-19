// Import required modules and dependencies
const express = require('express');
const router = express.Router();
const Announcement = require('../models/Clients/clientAnouncement');

// CREATE a new Wysiwygannouncement
router.post('/', async (req, res) => {
  try {
    const announcement = new Announcement({
      title: req.body.title,
      template: req.body.template,
      author: req.body.author,
    });
    await announcement.save();
    res.status(201).json({ success: true, message: 'announcement created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create announcement', error: err });
  }
});

// READ all Wysiwygannouncements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json({ success: true, message: 'announcements retrieved successfully', data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve announcements', error: err });
  }
});

// READ a single Wysiwygannouncement by ID
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    res.status(200).json({ success: true, message: 'announcement retrieved successfully', data: announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve announcement', error: err });
  }
});

// UPDATE a Wysiwygannouncement by ID
router.put('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, {
      title: req.body.announcement,
      updatedAt: Date.now(),
    }, { new: true });
    res.status(200).json({ success: true, message: 'announcement updated successfully', data: announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update announcement', error: err });
  }
});

// DELETE a Wysiwygannouncement by ID
router.delete('/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement', error: err });
  }
});

module.exports = router;
