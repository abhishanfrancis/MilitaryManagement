const express = require('express');
const Equipment = require('../models/Equipment');
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');
const router = new express.Router();

// GET /api/equipment
router.get('/', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { base, type, status, condition, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const match = {};

    if (base) match.base = base;
    if (type) match.type = type;
    if (status) match.status = status;
    if (condition) match.condition = condition;
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const equipment = await Equipment.find(match)
      .populate('base', 'name')
      .populate('assignedUnit', 'name')
      .populate('assignedSoldier', 'firstName lastName serviceId')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Equipment.countDocuments(match);
    res.send({ equipment, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/equipment/status-summary
router.get('/status-summary', auth(['Admin', 'BaseCommander']), async (req, res) => {
  try {
    const statusSummary = await Equipment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const conditionSummary = await Equipment.aggregate([
      { $group: { _id: '$condition', count: { $sum: 1 } } }
    ]);
    const typeSummary = await Equipment.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.send({ statusSummary, conditionSummary, typeSummary });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/equipment/maintenance-due
router.get('/maintenance-due', auth(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const dueMaintenance = await Equipment.find({
      $or: [
        { nextMaintenanceDate: { $lte: thirtyDaysFromNow } },
        { status: 'UnderMaintenance' },
        { condition: { $in: ['Poor', 'Critical'] } }
      ]
    })
      .populate('base', 'name')
      .populate('assignedUnit', 'name')
      .sort('nextMaintenanceDate');

    res.send(dueMaintenance);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /api/equipment/:id
router.get('/:id', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('base', 'name location')
      .populate('assignedUnit', 'name type')
      .populate('assignedSoldier', 'firstName lastName serviceId');
    if (!equipment) return res.status(404).send({ error: 'Equipment not found' });
    res.send(equipment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /api/equipment
router.post('/', auth(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Create', resourceType: 'Equipment', resourceId: equipment._id,
        details: { name: equipment.name, serialNumber: equipment.serialNumber },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.status(201).send(equipment);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// PUT /api/equipment/:id
router.put('/:id', auth(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!equipment) return res.status(404).send({ error: 'Equipment not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Update', resourceType: 'Equipment', resourceId: equipment._id,
        details: { name: equipment.name },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send(equipment);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// DELETE /api/equipment/:id
router.delete('/:id', auth(['Admin']), async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) return res.status(404).send({ error: 'Equipment not found' });

    try {
      await new ActivityLog({
        user: req.user._id, username: req.user.username,
        action: 'Delete', resourceType: 'Equipment', resourceId: equipment._id,
        details: { name: equipment.name, serialNumber: equipment.serialNumber },
        ipAddress: req.ip, userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Activity log failed:', logError.message);
    }

    res.send({ message: 'Equipment deleted', equipment });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
