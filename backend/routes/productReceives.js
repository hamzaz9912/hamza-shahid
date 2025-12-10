const express = require('express');
const ProductReceive = require('../models/ProductReceive');

const router = express.Router();

// GET /api/productReceives - Get all product receives
router.get('/', async (req, res) => {
  try {
    const productReceives = await ProductReceive.find().sort({ createdAt: -1 });
    res.json(productReceives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productReceives/:id - Get single product receive
router.get('/:id', async (req, res) => {
  try {
    const productReceive = await ProductReceive.findById(req.params.id);
    if (!productReceive) {
      return res.status(404).json({ message: 'Product receive not found' });
    }
    res.json(productReceive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/productReceives - Create new product receive
router.post('/', async (req, res) => {
  try {
    const productReceive = new ProductReceive(req.body);
    const savedProductReceive = await productReceive.save();
    res.status(201).json(savedProductReceive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/productReceives/:id - Update product receive
router.put('/:id', async (req, res) => {
  try {
    const productReceive = await ProductReceive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!productReceive) {
      return res.status(404).json({ message: 'Product receive not found' });
    }
    res.json(productReceive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/productReceives/:id - Delete product receive
router.delete('/:id', async (req, res) => {
  try {
    const productReceive = await ProductReceive.findByIdAndDelete(req.params.id);
    if (!productReceive) {
      return res.status(404).json({ message: 'Product receive not found' });
    }
    res.json({ message: 'Product receive deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;