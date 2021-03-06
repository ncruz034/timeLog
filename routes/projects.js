const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt');
const _= require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {Project, validate} = require('../models/project');
const { Global } = require('../models/global');
const asyncMIddleware = require('../middleware/async');
const ObjectId = mongoose.Types.ObjectId;

//Create a new Project; this route should be protected to only admin users.
router.post('/', auth, async (req,res) =>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   console.log("Client --- ID: " + req.body.client_id);
    let project = new Project({
                           projectName:req.body.projectName,
                           client_id:req.body.client_id,
                           clientName:req.body.clientName,
                           date:req.body.date,
                           description:req.body.description,
                           status:req.body.status
                        });
    
    project = await project.save();
    res.send(project);
});

// Update a project information
router.put('/:id', async (req,res) =>{
    console.log(req.body);
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const updatedProject = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id,updatedProject);
    res.status(200).send(project);
});

// Get a project by id
/*
router.get('/:idd', auth, async (req,res) =>{
    const project = await Project.findById(req.params.id);
     //check if there is any error
     if(!project) return res.status(400).send('The project with the given id is not valid');
    res.send(project);
   });
*/
// Get an Project by id
    router.get('/:id', auth, async (req,res) =>{
        console.log("Inside Project ================" + req.params.id)
 
         const project = await Project.aggregate([
             { $match: {_id: ObjectId(req.params.id)}},
            {$lookup: {from: 'orders', localField:'projectName',foreignField: 'projectName', as: 'projectOrders'}},
            {$lookup: {from: 'times', localField:'projectName',foreignField: 'projectName', as: 'times'}}]);
     
          //check if there is any error
          if(!project) {
              return res.status(400).send('The projectt with the given id is not valid');
             }

         res.send(project[0]);
    });
     
   
// Get all projects sorted by project name
router.get('/', async (req,res) =>{
    const projects = await Project.find().sort('projectName');//.populate('order',['orderNumber'],'Order');
    if(!projects) return res.status(400).send('The order with the given id is not valid');
    res.send(projects);
});

// Delete a project by id
   router.delete('/delete/:_id', async (req,res) =>{
    const project = await Project.findByIdAndRemove(req.params._id);
    if(!project) return res.status(404).send('The project was not found'); 
    res.send(project);
});


//Finds an project by _id, and returns all the orders present in the project
/* router.get('/order/:project_id', async (req,res) =>{
    const project = await Project.findById(req.params.project_id).populate({path:'order', model:'Order', select:['orderNumber','date','description','status'],
                                                            populate:{path:'user',model:"User",select:['name','last']}});
    if(!project) return res.status(400).send('The project with the given id is not valid');
    res.send(project.order);
});

router.get('/last', async (req,res) =>{
    const currentOrderNumber = await Global.findOne();
    if(!currentOrderNumber) return res.status(400).send('There are no orders in the database');

    res.send(currentOrderNumber.currentOrderNumber);
}) */

/* router.put('/last/', async (req,res) =>{
    await Global.findOne({}, function(err, data){
        if(err){
            console.log(err);
            res.status(500).send();
        } else {
            if(!data){
                res.status(400).send('No orders in the system.');
            } else {
                if(req.body.currentOrderNumber){
                    data.currentOrderNumber = req.body.currentOrderNumber;
                    data.save(function(err,updatedData){
                        if(err){
                            console.log(err);
                            res.status(500).send();
                        } else {
                            res.send(data);
                        }
                    })
                }
            }
        }
    });
}); */



/* router.put('/:id', auth, admin, async (req,res) =>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const updatedClient = req.body;
    const client = await Client.findByIdAndUpdate(req.params.id,updatedClient);
    res.status(200).send(client);
}); */


//Finds an order by _id and adds a new time to the order.
/* router.post('/:order_id/time', async (req,res) =>{  
    const order = await Order.findById(req.params.order_id);
    if (!order) return res.status(400).send('No Order found with provided id...');

    order.time.push(req.body.time_id);
   await order.save((error) =>{
       if(error){
           console.log(error);
       }else{
           res.send(order);
       }
   });
}); */

//Get all orders
/*
router.get('/', async (req, res,) => {
    // throw new Error({error:'Error'});
     const orders = await Order.find().sort('date').populate('time');
     res.send(orders);
 });
*/
/*
 router.get('/', async (req,res) =>{
    const orders = await Order.find().populate({path:'time', model:'Time', select:['date','description','time'],
                                                           populate:{path:'user',model:"User",select:['name','last']}});

    if(!orders) return res.status(400).send('The order with the given id is not valid');

    res.send(orders);
});
*/

// Get all projects sorted by project name
/* router.get('/', async (req,res) =>{
    const projects = await Project.find().sort('projectName');//.populate('order',['orderNumber'],'Order');
    if(!projects) return res.status(400).send('The order with the given id is not valid');
    res.send(projects);
     let counter=0;
       for(let project of projects) {
           for(let order of project.order){
            counter = counter + order.order;
           }   
       }    
       console.log('The time is: ' + counter); 
}); */


/* //Get an order by id
router.get('/:id', auth, async (req,res) =>{
    let id = mongoose.Types.ObjectId(req.params.id);
    console.log('the id:' + id);

    const order = await Order.aggregate([
        // { $match: { client: "BROAD AND CASSEL, P.A. AND STACY HALPEN"}},
         {"$match": {_id: id}} , {$lookup: {from: 'times',localField:'_id',foreignField: 'order', as: 'time'}}
     ]);
console.log(order);
 //const order = await Order.findById(req.params.id);
  //check if there is any error
  if(!order) return res.status(400).send('The order with the given id is not valid');
 res.send(order);
}); */


//Get an order by orderNumber and returns the _id.
/* router.get('/number/:order_number', auth, async (req,res) =>{
    console.log("The order number is: " + req.params.order_number);
    await Order.findOne({orderNumber: req.params.order_number }, function(err,order){
        //check if there is any error
        if(!order) return res.status(400).send('The order with the given order number is not valid');
        res.send(order._id);
    });
}); */


/* //Get an order by orderNumber and returns the _id.
router.delete('/:_id/time/:time_id', auth, async (req,res) =>{
    console.log(req.params._id);
    const order = await Order.findById(req.params._id);
        //check if there is any error
        if(!order) return res.status(400).send('The order with the given order number is not valid');
    
        order.time.pop(req.body.time_id);
        order.save(function (error){
            if(error){
                console.log(error);
            }else{
                res.send(order.time);
            }
        });
}); */

module.exports = router;