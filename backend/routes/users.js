const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _= require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {User, validate} = require('../models/user');
const asyncMIddleware = require('../middleware/async');

//Register a new user; this route should be protected to only admin users.
router.post('/', async (req,res) =>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body,[ 'name','last','salary','position','email','password','isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
   /*
    await user.save();  
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send( _.pick(user,['_id','name','last','email']));
    */

   await user.save((error)=>{
       if(error){
           console.log(error);
       }else {
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send( _.pick(user,['_id','name','last','email']));
       }
   });
    
  
});

/*
router.post('/update/time/:user_id', async (req,res) =>{
    console.log('The user Id is: ' + req.params.user_id);
    console.log('The time id is:' + req.body.time_id);
    console.log('Inside user time update route');
    const user = await User.findById(req.params.user_id);//.populate('time',['order','date','client','description', 'time']);
        if(!user) return res.status(400).send('The user with the given id is not valid');

    await res.send(user._id);
});
*/
router.post('/:user_id/time', async (req,res) =>{  
        const user = await User.findById(req.params.user_id);
        if (!user) return res.status(400).send('No user found with provided id...');

        user.time.push(req.body.time_id);

       await user.save((error) =>{
           if(error){
               console.log(error);
           }else{
               res.send(user);
           }
       });
});

//Finds a user by _id, and returns all the times present in the user
router.get('/time/:user_id', async (req,res) =>{
    const user = await User.findById(req.params.user_id).populate('time',['date', 'user_name','description', 'time']);
     if(!user) return res.status(400).send('The user with the given id is not valid');

    res.send(user.time);
});

//Get all users
router.get('/', async (req, res,) => {
    // throw new Error({error:'Error'});
     const users = await User.find().sort('name');
     res.send(users);
 });

//Get a user by id
router.get('/me', auth, async (req,res) =>{
    const users = await User.findById(req.user._id).select('-password');
    res.send(users);
});

module.exports = router;