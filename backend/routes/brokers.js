const express = require('express');
const Broker = require('../models/Broker');

const router = express.Router();

// GET /api/brokers - Get all brokers
router.get('/', async (req, res) => {
  try {
    const brokers = await Broker.find().sort({ createdAt: -1 });
    res.json(brokers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/brokers/:id - Get single broker
router.get('/:id', async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.id);
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    res.json(broker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/brokers - Create new broker
router.post('/', async (req, res) => {
  try {
    const broker = new Broker(req.body);
    const savedBroker = await broker.save();
    res.status(201).json(savedBroker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/brokers/:id - Update broker
router.put('/:id', async (req, res) => {
  try {
    const broker = await Broker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    res.json(broker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/brokers/:id - Delete broker
router.delete('/:id', async (req, res) => {
  try {
    const broker = await Broker.findByIdAndDelete(req.params.id);
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    res.json({ message: 'Broker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;