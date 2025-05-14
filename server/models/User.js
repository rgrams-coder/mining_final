const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  status: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firmName: String,
  companyName: String,
  state: String,
  district: String,
  circle: String,
  mauzza: String,
  revenueThanaNo: String,
  plotNo: String,
  area: String,
  policeStation: String,
  minerals: String,
  natureOfLand: String,
  mineCodeIBM: String,
  mineCodeDGMS: String,
  licenseNo: String,
  dealerCodeIBM: String,
  natureOfBusiness: String,
  registrationFee: { type: Number, default: 1000 },
  paymentStatus: { type: String, default: 'pending' },
  hasLibraryAccess: { type: Boolean, default: false },
  libraryPaymentStatus: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);