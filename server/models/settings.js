var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingsSchema = new Schema({
  settingsId: {type: String, required: true, unique: true},
  isChannelsCached: Boolean
}, {
  timestamps: true
});

var Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
