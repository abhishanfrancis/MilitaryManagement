const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');
const router = new express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Admin only)
 * @access  Private
 */
router.post('/register', auth(['Admin']), async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    // Log user creation
    await new ActivityLog({
      user: req.user._id,
      username: req.user.username,
      action: 'Create',
      resourceType: 'User',
      resourceId: user._id,
      details: { 
        createdUser: user.username,
        role: user.role,
        assignedBase: user.assignedBase
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }).save();
    
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).send({ 
        error: 'Login failed', 
        message: 'Username and password are required' 
      });
    }
    
    const user = await User.findByCredentials(username, password);
    
    const token = await user.generateAuthToken();
    
    try {
      await new ActivityLog({
        user: user._id,
        username: user.username,
        action: 'Login',
        resourceType: 'User',
        resourceId: user._id,
        details: { 
          role: user.role,
          assignedBase: user.assignedBase
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }).save();
    } catch (logError) {
      console.error('Error logging successful login:', logError.message);
    }
    
    res.send({ 
      user, 
      token,
      message: 'Login successful'
    });
  } catch (error) {
    
    if (req.body.username) {
      try {
        await new ActivityLog({
          username: req.body.username,
          action: 'Failed Login',
          resourceType: 'User',
          details: { 
            error: error.message,
            ipAddress: req.ip
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        }).save();
      } catch (logError) {
        console.error('Error logging failed login:', logError.message);
      }
    }
    
    res.status(401).send({ 
      error: 'Authentication failed', 
      message: 'Invalid username or password'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout a user
 * @access  Private
 */
router.post('/logout', auth(), async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    
    // Log logout
    await new ActivityLog({
      user: req.user._id,
      username: req.user.username,
      action: 'Logout',
      resourceType: 'User',
      resourceId: req.user._id,
      details: { 
        role: req.user.role,
        assignedBase: req.user.assignedBase
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }).save();
    
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post('/logout-all', auth(), async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    
    // Log logout from all devices
    await new ActivityLog({
      user: req.user._id,
      username: req.user.username,
      action: 'Logout',
      resourceType: 'User',
      resourceId: req.user._id,
      details: { 
        allDevices: true,
        role: req.user.role,
        assignedBase: req.user.assignedBase
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }).save();
    
    res.send({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth(), async (req, res) => {
  res.send(req.user);
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', auth(), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const user = await User.findByCredentials(req.user.username, currentPassword);
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Log password change
    await new ActivityLog({
      user: user._id,
      username: user.username,
      action: 'Update',
      resourceType: 'User',
      resourceId: user._id,
      details: { 
        passwordChanged: true
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }).save();
    
    res.send({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Password change failed', message: error.message });
  }
});

module.exports = router;