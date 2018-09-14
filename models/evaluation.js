var mongoose = require('mongoose');

var EvaluationSchema = new mongoose.Schema({
    username: String,
    truck: String,
    quality: Number,
    price: Number,
    authenticity: Number,
    choices: Number,
    comment: String
},{usePushEach:true});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
