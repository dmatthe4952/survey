var mongoose = require('mongoose');

var TotalSchema = new mongoose.Schema({
    truck: String,
    quality: Number,
    price: Number,
    authenticity: Number,
    choices: Number,
    updates: Number
},{usePushEach:true});

module.exports = mongoose.model("Total", TotalSchema);
