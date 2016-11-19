"use strict";

const express = require('express');
const router = express.Router();
const Step = require('../models/steps');

router.post('/post',isAuthenticatedAdmin,(req,res) => {
	let step = new Step();
	step.number = req.body.number;
	step.question = req.body.question;
	step.answer = req.body.answer;
	step.hint = req.body.hint;
	step.hintAnswer = req.body.hintAnswer;
	step.save();
	res.render('admin',{success:"Thanks for adding it!"});
})

router.get('/',isAuthenticatedAdmin, (req,res) => res.render('admin'));


function isAuthenticatedAdmin(req, res, next) {
    if (req.user)
    	if(req.user.admin)
        	return next();

    res.redirect('/');
}

module.exports = router;
