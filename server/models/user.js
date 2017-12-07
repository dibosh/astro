var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  displayName: {type: String},
  picture: {type: String},
  facebookProfileId: {type: String, unique: true},
  favoriteChannelIds: [{type: Number}]
}, {
  timestamps: true
});

var User = mongoose.model('User', userSchema);

module.exports = User;
