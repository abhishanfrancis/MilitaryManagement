const express = require('express');
const Unit = require('../models/Unit');
const Soldier = require('../models/Soldier');
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');
const router = new express.Router();

// GET /api/units
router.get('/', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { base, status, type, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const match = {};

    if (base) match.base = base;
    if (status) match.status = status;
    if (type) match.type = type;
    if (search) {
      match.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const units = await Unit.find(match)
      .populate('base', 'name location')
      .populate('commander', 'firstName lastName serviceId')
      .populate('parentUnit', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Unit.countDocuments(match);
    res.send({ units, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/units/:id
router.get('/:id', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('base', 'name location')
      .populate('commander', 'firstName lastName serviceId rank')
      .populate('parentUnit', 'name');
    if (!unit) return res.status(404).send({ error: 'Unit not found' });

    // Get members of this unit
    const members = await Soldier.find({ unit: unit._id })
      .populate('rank', 'name abbreviation')
      .select('firstName lastName serviceId rank status');

    res.send({ ...unit.toJSON(), members });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /api/units
router.post('/', auth(['Admin']), async (req, res) => {
  try {
    const unit = new Unit(req.body);
    await unit.save();

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Create', resourceType: 'Unit', resourceId: unit._id,
        details: { name: unit.name, type: unit.type },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.status(201).send(unit);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// PUT /api/units/:id
router.put('/:id', auth(['Admin']), async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!unit) return res.status(404).send({ error: 'Unit not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Update', resourceType: 'Unit', resourceId: unit._id,
        details: { name: unit.name },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send(unit);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// DELETE /api/units/:id
router.delete('/:id', auth(['Admin']), async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) return res.status(404).send({ error: 'Unit not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Delete', resourceType: 'Unit', resourceId: unit._id,
        details: { name: unit.name },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send({ message: 'Unit deleted', unit });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/units/:id/members
router.get('/:id/members', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const members = await Soldier.find({ unit: req.params.id })
      .populate('rank', 'name abbreviation level')
      .sort('lastName');
    res.send(members);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
