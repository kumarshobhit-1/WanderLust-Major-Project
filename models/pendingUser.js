const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pendingUserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, index: true },
  passwordEncrypted: { type: String, required: true }, 
  otpHash: { type: String, required: true },
  otpExpires: { type: Date, required: true, },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

pendingUserSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PendingUser', pendingUserSchema);
