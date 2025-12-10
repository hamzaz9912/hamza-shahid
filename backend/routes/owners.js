const express = require('express');
const Owner = require('../models/Owner');

const router = express.Router();

// GET /api/owners - Get all owners
router.get('/', async (req, res) => {
  try {
    const owners = await Owner.find().sort({ createdAt: -1 });
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/owners/:id - Get single owner
router.get('/:id', async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/owners - Create new owner
router.post('/', async (req, res) => {
  try {
    const owner = new Owner(req.body);
    const savedOwner = await owner.save();
    res.status(201).json(savedOwner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/owners/:id - Update owner
router.put('/:id', async (req, res) => {
  try {
    const owner = await Owner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.json(owner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/owners/:id - Delete owner
router.delete('/:id', async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.json({ message: 'Owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;