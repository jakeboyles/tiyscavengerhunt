"use strict";

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/',isAuthenticated, (req, res) => res.render("index",{title:"Scavenger Hunt"}));

function isAuthenticated(req, res, next) {
    if (req.user)
        res.redirect('/step/1');

    return next();
}

module.exports = router;
