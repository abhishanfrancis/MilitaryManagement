const express = require('express');
const Soldier = require('../models/Soldier');
const Unit = require('../models/Unit');
const Base = require('../models/Base');
const Equipment = require('../models/Equipment');
const Mission = require('../models/Mission');
const auth = require('../middleware/auth');
const router = new express.Router();

/**
 * @route   GET /api/dashboard
 * @desc    Get MRMS dashboard data
 * @access  Private
 */
router.get('/', auth(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    // --- Summary counts ---
    const totalSoldiers = await Soldier.countDocuments({ status: { $ne: 'Inactive' } });
    const totalUnits = await Unit.countDocuments({ status: { $ne: 'Disbanded' } });
    const totalBases = await Base.countDocuments({ status: 'Operational' });
    const totalEquipment = await Equipment.countDocuments();
    const activeMissions = await Mission.countDocuments({ status: 'Active' });
    const totalMissions = await Mission.countDocuments();

    // --- Equipment stats ---
    const equipmentByStatus = await Equipment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]);
    const equipmentByType = await Equipment.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { _id: 0, type: '$_id', count: 1 } }
    ]);

    // --- Unit stats ---
    const unitsByType = await Unit.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { _id: 0, type: '$_id', count: 1 } }
    ]);

    // --- Mission stats ---
    const missionsByStatus = await Mission.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]);
    const missionsByPriority = await Mission.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $project: { _id: 0, priority: '$_id', count: 1 } }
    ]);

    // --- Soldier stats ---
    const soldiersByStatus = await Soldier.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]);

    // --- System alerts ---
    const alerts = [];

    // Damaged equipment
    const damagedEquipment = await Equipment.countDocuments({ status: 'Damaged' });
    if (damagedEquipment > 0) {
      alerts.push({ type: 'warning', title: 'Damaged Equipment', message: `${damagedEquipment} items need attention`, category: 'equipment' });
    }

    // Equipment needing maintenance
    const maintenanceDue = await Equipment.countDocuments({
      $or: [
        { nextMaintenanceDate: { $lte: new Date() } },
        { condition: { $in: ['Poor', 'Critical'] } }
      ]
    });
    if (maintenanceDue > 0) {
      alerts.push({ type: 'warning', title: 'Maintenance Due', message: `${maintenanceDue} equipment items need maintenance`, category: 'equipment' });
    }

    // Units without commanders
    const leaderlessUnits = await Unit.countDocuments({ commander: null, status: 'Active' });
    if (leaderlessUnits > 0) {
      alerts.push({ type: 'error', title: 'Leaderless Units', message: `${leaderlessUnits} active units have no commander`, category: 'unit' });
    }

    // Bases over capacity
    const bases = await Base.find({ status: 'Operational' });
    for (const base of bases) {
      const occupancy = await Soldier.countDocuments({ base: base._id, status: 'Active' });
      if (base.capacity && occupancy > base.capacity) {
        alerts.push({ type: 'error', title: 'Capacity Exceeded', message: `${base.name} is over capacity (${occupancy}/${base.capacity})`, category: 'base' });
      }
    }

    // Critical missions
    const criticalMissions = await Mission.countDocuments({ priority: 'Critical', status: 'Active' });
    if (criticalMissions > 0) {
      alerts.push({ type: 'error', title: 'Critical Missions', message: `${criticalMissions} critical missions in progress`, category: 'mission' });
    }

    // --- Recent activity ---
    const recentSoldiers = await Soldier.find()
      .populate('rank', 'name abbreviation')
      .populate('base', 'name')
      .sort('-createdAt').limit(5)
      .select('firstName lastName serviceId status createdAt rank base');

    const recentMissions = await Mission.find()
      .populate('commander', 'firstName lastName')
      .sort('-createdAt').limit(5)
      .select('name code type status priority startDate createdAt');

    const recentEquipment = await Equipment.find()
      .sort('-createdAt').limit(5)
      .select('name serialNumber type status condition createdAt nextMaintenanceDate');

    res.send({
      summary: {
        totalSoldiers,
        totalUnits,
        totalBases,
        totalEquipment,
        activeMissions,
        totalMissions
      },
      soldiersByStatus,
      equipmentByStatus,
      equipmentByType,
      unitsByType,
      missionsByStatus,
      missionsByPriority,
      alerts,
      recentSoldiers,
      recentMissions,
      recentEquipment
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;