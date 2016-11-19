"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new Schema({
	name:String,
    fbID: Number,
    admin:{
    	type:Boolean,
    	default:false,
    }
});

userSchema.plugin(findOrCreate);


module.exports = mongoose.model('User', userSchema);
