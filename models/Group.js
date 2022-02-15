const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');

const groupSchema = new Schema({
  startStation: String,
  endStation: String,
  date: {
    day: Number,
    month: Number,
    year: Number
  },
  startTime: {
    minute : Number,
    hour: Number,
  },
  endTime: {
    minute : Number,
    hour: Number,
  },
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
  comments: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;