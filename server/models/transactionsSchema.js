const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: String,
  transactionHash: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Txschema', transactionSchema);
