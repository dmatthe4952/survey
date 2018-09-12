var mongoose = require('mongoose');

var EvaluationSchema = new mongoose.Schema({
    username: String,
    truck: String,
    overall: Number,
    Quality: Number,
    cleanliness: Number,
    price: Number,
    comment: String
},{usePushEach:true});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
