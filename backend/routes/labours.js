const express = require('express');
const Labour = require('../models/Labour');

const router = express.Router();

// GET /api/labours - Get all labours
router.get('/', async (req, res) => {
  try {
    const labours = await Labour.find().sort({ createdAt: -1 });
    res.json(labours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/labours/:id - Get single labour
router.get('/:id', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) {
      return res.status(404).json({ message: 'Labour not found' });
    }
    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/labours - Create new labour
router.post('/', async (req, res) => {
  try {
    const labour = new Labour(req.body);
    const savedLabour = await labour.save();
    res.status(201).json(savedLabour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/labours/:id - Update labour
router.put('/:id', async (req, res) => {
  try {
    const labour = await Labour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!labour) {
      return res.status(404).json({ message: 'Labour not found' });
    }
    res.json(labour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/labours/:id - Delete labour
router.delete('/:id', async (req, res) => {
  try {
    const labour = await Labour.findByIdAndDelete(req.params.id);
    if (!labour) {
      return res.status(404).json({ message: 'Labour not found' });
    }
    res.json({ message: 'Labour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;