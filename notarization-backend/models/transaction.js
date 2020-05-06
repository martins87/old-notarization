const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Transaction = new Schema({
    // address: { type: String },
    data: { type: String },
    digest: { type: String },
    timestamp: { type: String },
    tx: { type: String }
});

module.exports = mongoose.model('Transaction', Transaction);
