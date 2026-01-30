const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  deviceInfo: {
    manufacturer: String,
    model: String,
    osVersion: String,
    platform: {
      type: String,
      enum: ['android', 'ios'],
      required: true
    },
    appVersion: String,
    deviceName: String
  },
  visitorInfo: {
    name: String,
    email: String,
    phone: String,
    purpose: String,
    company: String
  },
  mdmInfo: {
    enrolled: {
      type: Boolean,
      default: false
    },
    enrollmentId: String,
    profileId: String,
    cameraLocked: {
      type: Boolean,
      default: false
    },
    enrollmentMethod: {
      type: String,
      enum: ['device_admin', 'work_profile', 'mdm_profile', 'supervised']
    }
  },
  currentFacility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility'
  },
  enrollmentHistory: [{
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility'
    },
    enrolledAt: Date,
    unenrolledAt: Date,
    entryQRScanned: String,
    exitQRScanned: String,
    duration: Number, // in minutes
    status: {
      type: String,
      enum: ['active', 'completed', 'expired', 'forced_exit']
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'inactive'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ status: 1 });
deviceSchema.index({ 'mdmInfo.enrolled': 1 });
deviceSchema.index({ currentFacility: 1 });

// Method to check if device is currently enrolled
deviceSchema.methods.isEnrolled = function() {
  return this.mdmInfo.enrolled && this.status === 'active';
};

// Method to update last activity
deviceSchema.methods.updateActivity = async function() {
  this.lastActivity = new Date();
  await this.save();
};

module.exports = mongoose.model('Device', deviceSchema);
