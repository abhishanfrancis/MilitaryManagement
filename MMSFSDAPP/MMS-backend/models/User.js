const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'BaseCommander', 'LogisticsOfficer'], 
    required: true 
  },
  assignedBase: { type: String },
  active: { type: Boolean, default: true },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    // Only hash if the password is not already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    if (!user.password.startsWith('$2')) {
      console.log(`Hashing password for user: ${user.username}`);
      user.password = await bcrypt.hash(user.password, 10);
    } else {
      console.log(`Password already hashed for user: ${user.username}, skipping hash`);
    }
  }
  next();
});

// Generate auth token
UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '24h' });
  
  user.tokens = user.tokens.concat({ token });
  await user.save();
  
  return token;
};

// Find user by credentials
UserSchema.statics.findByCredentials = async function(username, password) {
  try {
    const user = await this.findOne({ username });
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    if (!user.active) {
      throw new Error('User account is inactive');
    }
    
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error(`bcrypt error during login for ${username}: ${bcryptError.message}`);
      isMatch = false;
    }
    
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Remove sensitive data when sending user object
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  
  delete userObject.password;
  delete userObject.tokens;
  
  return userObject;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
