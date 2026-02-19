const express = require('express');
const Soldier = require('../models/Soldier');
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');
const router = new express.Router();

// GET /api/soldiers - List all soldiers
router.get('/', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { base, unit, status, rank, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const match = {};

    if (base) match.base = base;
    if (unit) match.unit = unit;
    if (status) match.status = status;
    if (rank) match.rank = rank;
    if (search) {
      match.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { serviceId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const soldiers = await Soldier.find(match)
      .populate('rank', 'name abbreviation level category')
      .populate('unit', 'name type')
      .populate('base', 'name location')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Soldier.countDocuments(match);

    res.send({ soldiers, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/soldiers/:id
router.get('/:id', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const soldier = await Soldier.findById(req.params.id)
      .populate('rank', 'name abbreviation level category')
      .populate('unit', 'name type')
      .populate('base', 'name location');
    if (!soldier) return res.status(404).send({ error: 'Soldier not found' });
    res.send(soldier);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /api/soldiers
router.post('/', auth(['Admin']), async (req, res) => {
  try {
    const soldier = new Soldier(req.body);
    await soldier.save();

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Create', resourceType: 'Soldier', resourceId: soldier._id,
        details: { serviceId: soldier.serviceId, name: `${soldier.firstName} ${soldier.lastName}` },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.status(201).send(soldier);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// PUT /api/soldiers/:id
router.put('/:id', auth(['Admin']), async (req, res) => {
  try {
    const soldier = await Soldier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!soldier) return res.status(404).send({ error: 'Soldier not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Update', resourceType: 'Soldier', resourceId: soldier._id,
        details: { serviceId: soldier.serviceId },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send(soldier);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// DELETE /api/soldiers/:id
router.delete('/:id', auth(['Admin']), async (req, res) => {
  try {
    const soldier = await Soldier.findByIdAndDelete(req.params.id);
    if (!soldier) return res.status(404).send({ error: 'Soldier not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Delete', resourceType: 'Soldier', resourceId: soldier._id,
        details: { serviceId: soldier.serviceId },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send({ message: 'Soldier deleted', soldier });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
