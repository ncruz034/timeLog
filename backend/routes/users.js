const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _= require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {User, validate} = require('../models/user');
const asyncMIddleware = require('../middleware/async');

//Register a new user
router.post('/', async (req,res) =>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body,[ 'name','last','salary','position','email','password','isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    
   const token = user.generateAuthToken();
   res.header('x-auth-token', token).send( _.pick(user,['_id','name','last','email']));
});

//Get a user by id
router.get('/me',auth, async (req,res) =>{
   
    const users = await User.findById(req.user._id).select('-password');
    res.send(users);
});

module.exports = router;