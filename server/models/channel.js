var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  channelId: {type: Number, required: true, unique: true},
  title: {type: String, required: true},
  description: {type: String},
  category: {type: String},
  setTopBoxNumber: {type: Number, required: true},
  language: {type: String},
  color: {type: String},
  logo: {type: String},
  isHD: {type: Boolean},
  isFavorite: {type: Boolean, default: false}
}, {
  timestamps: true
});

var Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
