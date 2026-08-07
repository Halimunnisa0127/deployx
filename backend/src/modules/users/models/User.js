const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../../../utils/helpers/password.helper');
const { ROLES } = require('../../../shared/constants/constants');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    authProvider: {
      type: [String],
      enum: ['local', 'google', 'github'],
      default: ['local'],
    },
    password: {
      type: String,
      required: function() {
        return this.authProvider.includes('local');
      },
      select: false,
    },
    role: {
      type: String,
      enum: [ROLES.USER, ROLES.ADMIN],
      default: ROLES.USER,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxLength: 500,
    },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      timezone: { type: String, default: 'UTC' },
      language: { type: String, default: 'en' },
      emailNotifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshTokenVersion: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await hashPassword(this.password);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return comparePassword(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
