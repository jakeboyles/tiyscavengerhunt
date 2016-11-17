"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
    number: Number,
    question: String,
    answer: String,
    hint:String,
    hintAnswer:String,
});

module.exports = mongoose.model('Step', stepSchema);