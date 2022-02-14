const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');

const groupSchema = new Schema({
  startStation: String,
  endStation: String,
  date: Date,
  startTime: Number,
  endTime: Number,
  maxPassengers: Number,
  owner: {
      type: Schema.Types.ObjectId,
      ref: User,
  },
  guests: [
    {
      type: Schema.Types.ObjectId,
      ref: User,
    }
  ],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;