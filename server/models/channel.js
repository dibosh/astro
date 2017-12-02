var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  channelId: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  description: {type: String},
  category: {type: String},
  setTopBoxNumber: {type: String},
  language: {type: String},
  color: {type: String},
  logo: {type: String},
  isHD: Boolean,
  created_at: Date,
  updated_at: Date
});

var Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
