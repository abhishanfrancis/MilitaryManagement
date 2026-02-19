const express = require('express');
const Rank = require('../models/Rank');
const auth = require('../middleware/auth');
const router = new express.Router();

// GET /api/ranks
router.get('/', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const ranks = await Rank.find().sort('level');
    res.send(ranks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/ranks/:id
router.get('/:id', auth(['Admin', 'BaseCommander']), async (req, res) => {
  try {
    const rank = await Rank.findById(req.params.id);
    if (!rank) return res.status(404).send({ error: 'Rank not found' });
    res.send(rank);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /api/ranks
router.post('/', auth(['Admin']), async (req, res) => {
  try {
    const rank = new Rank(req.body);
    await rank.save();
    res.status(201).send(rank);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// PUT /api/ranks/:id
router.put('/:id', auth(['Admin']), async (req, res) => {
  try {
    const rank = await Rank.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rank) return res.status(404).send({ error: 'Rank not found' });
    res.send(rank);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// DELETE /api/ranks/:id
router.delete('/:id', auth(['Admin']), async (req, res) => {
  try {
    const rank = await Rank.findByIdAndDelete(req.params.id);
    if (!rank) return res.status(404).send({ error: 'Rank not found' });
    res.send({ message: 'Rank deleted', rank });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
