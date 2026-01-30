const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  facilityId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  entrances: [{
    name: String,
    location: String,
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRCode'
    }
  }],
  exits: [{
    name: String,
    location: String,
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRCode'
    }
  }],
  settings: {
    allowMultipleDevices: {
      type: Boolean,
      default: false
    },
    maxEnrollmentDuration: {
      type: Number, // in hours
      default: 24
    },
    requireExitScan: {
      type: Boolean,
      default: true
    },
    autoUnenrollAfter: {
      type: Number, // in hours
      default: 24
    },
    notifyOnEntry: {
      type: Boolean,
      default: true
    },
    notifyOnExit: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    totalEnrollments: {
      type: Number,
      default: 0
    },
    activeEnrollments: {
      type: Number,
      default: 0
    },
    totalVisitors: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
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

// Index for faster queries
facilitySchema.index({ facilityId: 1 });
facilitySchema.index({ status: 1 });

module.exports = mongoose.model('Facility', facilitySchema);
