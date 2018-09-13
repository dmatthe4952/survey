var mongoose = require('mongoose');

var TotalSchema = new mongoose.Schema({
    truck: String,
    overall: Number,
    Quality: Number,
    cleanliness: Number,
    price: Number
},{usePushEach:true});

module.exports = mongoose.model("Total", TotalSchema);
