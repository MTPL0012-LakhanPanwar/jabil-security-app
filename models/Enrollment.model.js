const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  enrollmentId: {
    type: String,
    required: true,
    unique: true
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  entryQRCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode'
  },
  exitQRCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  unenrolledAt: {
    type: Date
  },
  expectedUnenrollmentAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired', 'forced_exit', 'emergency_exit'],
    default: 'active'
  },
  actions: [{
    action: {
      type: String,
      enum: ['enrolled', 'camera_locked', 'camera_unlocked', 'unenrolled', 'expired', 'forced_exit']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    performedBy: String,
    qrCodeScanned: String,
    location: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  violations: [{
    type: {
      type: String,
      enum: ['camera_access_attempt', 'policy_violation', 'timeout', 'suspicious_activity']
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }
  }],
  duration: {
    type: Number, // in minutes
    default: 0
  },
  notes: {
    type: String
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
enrollmentSchema.index({ enrollmentId: 1 });
enrollmentSchema.index({ deviceId: 1 });
enrollmentSchema.index({ facilityId: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ enrolledAt: 1 });

// Method to complete enrollment
enrollmentSchema.methods.complete = async function(exitQRCode) {
  this.status = 'completed';
  this.unenrolledAt = new Date();
  this.exitQRCode = exitQRCode;
  
  // Calculate duration
  if (this.enrolledAt) {
    const durationMs = this.unenrolledAt - this.enrolledAt;
    this.duration = Math.floor(durationMs / (1000 * 60)); // Convert to minutes
  }
  
  // Add action
  this.actions.push({
    action: 'unenrolled',
    timestamp: new Date(),
    qrCodeScanned: exitQRCode
  });
  
  await this.save();
};

// Method to add violation
enrollmentSchema.methods.addViolation = async function(type, description, severity = 'medium') {
  this.violations.push({
    type,
    description,
    severity,
    timestamp: new Date()
  });
  await this.save();
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
