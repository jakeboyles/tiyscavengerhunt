"use strict";

const express = require('express');
const router = express.Router();
const Step = require('../models/steps');

router.get('/:id', (req, res, next) => {
	Step.find({number:req.params.id}).exec((err,response)=>{
		if(!response[0]) {
			res.render('done');
			return;
		} 
		res.render('step',{question:response[0].question,id:req.params.id});
	})
});

router.post('/answer/:id', (req, res, next) => {
   let id = req.params.id;
   Step.findOne({number:req.params.id}).exec((err,response)=>{
		if(req.body.answer.toLowerCase() === response.answer.toLowerCase()) {
	   	   res.render("step",{message:response.hint,id:id});
	   	   return;
	    }
	    
	    res.render("step",{question:response.question,id:id,error:"Try again 😞"});
	})
})

router.post('/hint/:id', (req, res, next) => {
   let id = req.params.id;
   Step.findOne({number:req.params.id}).exec((err,response)=>{

		if(req.body.code.toLowerCase() === response.hintAnswer.toLowerCase()) {
	       let newId = parseInt(id)+1;
	   	   res.redirect('/step/'+newId);
	   	   return;
	    }
	    
	    res.render("step",{message:response.hint,id:id,error:"Try again 😞"});

	})
})

module.exports = router;
