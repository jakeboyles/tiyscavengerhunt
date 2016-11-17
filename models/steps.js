var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stepSchema = new Schema({
    number: Number,
    question: String,
    answer: String,
    hint:String,
    hintAnswer:String,
});

module.exports = mongoose.model('Step', stepSchema);