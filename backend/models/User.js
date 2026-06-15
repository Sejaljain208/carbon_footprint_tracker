const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    carbonGoal: {
      type: Number,
      default: 100, // kg CO2e per month
    },
    carbonSaved: {
      type: Number,
      default: 0,
    },
    theme: {
      mode: {
        type: String,
        enum: ['light', 'dark', 'custom'],
        default: 'light',
      },
      primaryColor: {
        type: String,
        default: '#10b981', // emerald
      },
      accentColor: {
        type: String,
        default: '#f59e0b', // amber
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
