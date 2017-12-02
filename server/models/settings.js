var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingsSchema = new Schema({
  configId: {type: String, required: true, unique: true},
  cachedChannels: Boolean,
  created_at: Date,
  updated_at: Date
});

var Settings = mongoose.model('Config', settingsSchema);

module.exports = Settings;
