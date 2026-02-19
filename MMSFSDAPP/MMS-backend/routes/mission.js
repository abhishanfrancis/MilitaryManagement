const express = require('express');
const Mission = require('../models/Mission');
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');
const router = new express.Router();

// GET /api/missions
router.get('/', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { status, type, priority, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const match = {};

    if (status) match.status = status;
    if (type) match.type = type;
    if (priority) match.priority = priority;
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const missions = await Mission.find(match)
      .populate('commander', 'firstName lastName serviceId')
      .populate('assignedUnits', 'name type')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Mission.countDocuments(match);
    res.send({ missions, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/missions/:id
router.get('/:id', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate('commander', 'firstName lastName serviceId rank')
      .populate('assignedUnits', 'name type status currentStrength')
      .populate('requiredEquipment.equipment', 'name serialNumber type status');
    if (!mission) return res.status(404).send({ error: 'Mission not found' });
    res.send(mission);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /api/missions
router.post('/', auth(['Admin']), async (req, res) => {
  try {
    const mission = new Mission(req.body);
    await mission.save();

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Create', resourceType: 'Mission', resourceId: mission._id,
        details: { name: mission.name, code: mission.code },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.status(201).send(mission);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// PUT /api/missions/:id
router.put('/:id', auth(['Admin']), async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!mission) return res.status(404).send({ error: 'Mission not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Update', resourceType: 'Mission', resourceId: mission._id,
        details: { name: mission.name, status: mission.status },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send(mission);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// PUT /api/missions/:id/status
router.put('/:id/status', auth(['Admin', 'BaseCommander']), async (req, res) => {
  try {
    const { status } = req.body;
    const mission = await Mission.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!mission) return res.status(404).send({ error: 'Mission not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Update', resourceType: 'Mission', resourceId: mission._id,
        details: { statusChange: status },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send(mission);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// DELETE /api/missions/:id
router.delete('/:id', auth(['Admin']), async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) return res.status(404).send({ error: 'Mission not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Delete', resourceType: 'Mission', resourceId: mission._id,
        details: { name: mission.name, code: mission.code },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send({ message: 'Mission deleted', mission });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
