"use strict";

const express = require('express');
const router = express.Router();
const Step = require('../models/steps');

router.get('/post',isAuthenticatedAdmin, (req,res) => {
	res.render('admin-post',{title:"Post New Post"})
});

router.post('/post',isAuthenticatedAdmin,(req,res) => {

	let steps = Step.find().exec((err,response)=>{
		let step = new Step();
		step.number = response.length+1;
		step.question = req.body.question;
		step.answer = req.body.answer;
		step.hint = req.body.hint;
		step.hintAnswer = req.body.hintAnswer;
		step.save();
		res.render('admin',{success:"Thanks for adding it!"});
	})
});

router.get('/',isAuthenticatedAdmin, (req,res) => {
	let steps = Step.find().sort({ number: 1 }).exec((err,response)=>{
		res.render('admin',{steps:response, title:"Admin page"})
	})
});

router.post('/edit/:id',isAuthenticatedAdmin,(req,res) => {
	Step.findById(req.params.id,(err, step) => {
	  	if (err) return handleError(err);
		step.question = req.body.question;
		step.answer = req.body.answer;
		step.hint = req.body.hint;
		step.hintAnswer = req.body.hintAnswer;

	  	step.save((err, updatedTank) => {
	    	if (err) return res.render('admin',{error:err});
	    	res.redirect("/admin")
	  	});

	});
})

router.get('/edit/:id',isAuthenticatedAdmin, (req,res) => {
	let steps = Step.findOne({_id:req.params.id}).exec((err,response)=>{
		res.render('admin-edit',{step:response,title:"Post Edit"})
	})
});

function isAuthenticatedAdmin(req, res, next) {
    if (req.user)
    	if(req.user.admin)
        	return next();

    res.redirect('/');
}

module.exports = router;
