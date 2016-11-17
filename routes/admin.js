"use strict";

const express = require('express');
const router = express.Router();
const Step = require('../models/steps');

router.post('/post',(req,res) => {
	let step = new Step();
	step.number = req.body.number;
	step.question = req.body.question;
	step.answer = req.body.answer;
	step.hint = req.body.hint;
	step.hintAnswer = req.body.hintAnswer;
	step.save();
	res.render('admin',{success:"Thanks for adding it!"});
})

router.get('/',(req,res) => res.render('admin'));

module.exports = router;
