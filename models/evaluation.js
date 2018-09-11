var mongoose = require('mongoose');

var EvaluationSchema = new mongoose.Schema({
    username: String,
    truck: String,
    evaluation: Number,
    comment: String
},{usePushEach:true});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
