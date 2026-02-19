const express = require('express');
const Base = require('../models/Base');
const Soldier = require('../models/Soldier');
const Unit = require('../models/Unit');
const Equipment = require('../models/Equipment');
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');
const router = new express.Router();

// GET /api/bases
router.get('/', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const match = {};

    if (status) match.status = status;
    if (type) match.type = type;
    if (search) match.name = { $regex: search, $options: 'i' };

    const bases = await Base.find(match)
      .populate('commander', 'firstName lastName serviceId')
      .sort('name');

    res.send(bases);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/bases/:id
router.get('/:id', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const base = await Base.findById(req.params.id)
      .populate('commander', 'firstName lastName serviceId');
    if (!base) return res.status(404).send({ error: 'Base not found' });

    const unitCount = await Unit.countDocuments({ base: base._id });
    const soldierCount = await Soldier.countDocuments({ base: base._id });
    const equipmentCount = await Equipment.countDocuments({ base: base._id });

    res.send({ ...base.toJSON(), unitCount, soldierCount, equipmentCount });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /api/bases
router.post('/', auth(['Admin']), async (req, res) => {
  try {
    const base = new Base(req.body);
    await base.save();

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Create', resourceType: 'Base', resourceId: base._id,
        details: { name: base.name, location: base.location },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.status(201).send(base);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// PUT /api/bases/:id
router.put('/:id', auth(['Admin']), async (req, res) => {
  try {
    const base = await Base.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!base) return res.status(404).send({ error: 'Base not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Update', resourceType: 'Base', resourceId: base._id,
        details: { name: base.name },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send(base);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// DELETE /api/bases/:id
router.delete('/:id', auth(['Admin']), async (req, res) => {
  try {
    const base = await Base.findByIdAndDelete(req.params.id);
    if (!base) return res.status(404).send({ error: 'Base not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Delete', resourceType: 'Base', resourceId: base._id,
        details: { name: base.name },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send({ message: 'Base deleted', base });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/bases/:id/capacity
router.get('/:id/capacity', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const base = await Base.findById(req.params.id);
    if (!base) return res.status(404).send({ error: 'Base not found' });

    const soldierCount = await Soldier.countDocuments({ base: base._id, status: 'Active' });
    const unitCount = await Unit.countDocuments({ base: base._id });

    res.send({
      base: base.name,
      capacity: base.capacity,
      currentOccupancy: soldierCount,
      occupancyRate: base.capacity ? Math.round((soldierCount / base.capacity) * 100) : 0,
      unitCount
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
