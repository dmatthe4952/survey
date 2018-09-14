var mongoose = require('mongoose');

var SummarySchema = new mongoose.Schema({
    truck: String,
    quality: Number,
    price: Number,
    authenticity: Number,
    choices: Number
},{usePushEach:true});

module.exports = mongoose.model("Summary", SummarySchema);
