const express = require('express');
const Party = require('../models/Party');

const router = express.Router();

// GET /api/parties - Get all parties
router.get('/', async (req, res) => {
  try {
    const parties = await Party.find().sort({ createdAt: -1 });
    res.json(parties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/parties/:id - Get single party
router.get('/:id', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/parties - Create new party
router.post('/', async (req, res) => {
  try {
    const party = new Party(req.body);
    const savedParty = await party.save();
    res.status(201).json(savedParty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/parties/:id - Update party
router.put('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/parties/:id - Delete party
router.delete('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndDelete(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json({ message: 'Party deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;