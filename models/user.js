"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new Schema({
    fbID: Number,
});

userSchema.plugin(findOrCreate);


module.exports = mongoose.model('User', userSchema);
