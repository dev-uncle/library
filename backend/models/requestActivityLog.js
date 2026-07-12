const mongoose = require('mongoose')

const RequestActivityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  bookTitle: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: [
      'REQUESTED',
      'READY',
      'ISSUED',
      'RETURNED',
      'CANCELLED_BY_ADMIN',
      'CANCELLED_BY_USER',
      'ARCHIVED',
    ],
    required: true,
  },
  performedBy: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
    default: '',
  },
  fineAmount: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('RequestActivityLog', RequestActivityLogSchema)
