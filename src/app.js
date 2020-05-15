require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoUtil = require('./mongodb');

//Init app
const app = express()
const port = process.env.PORT || 3000;

//Connect to mongodb
mongoUtil.connectToServer(function(err,client){
    if(err) console.log(err);
});

//Middlweares
app.use(bodyParser.json());

//GET all courses
app.get("/api/courses",(req,res)=>{
    const db = mongoUtil.getDb();
    db.collection("tutorials")
      .find()
      .toArray()
      .then((data)=>{
          res.status(200).json({response:data})
      }).catch((error)=>{
         res.status(500).json({error});
      })
});

//GET course detail
app.get("/api/courses/:id",(req,res)=>{
    const id = req.params.id;
    const db = mongoUtil.getDb();
    db.collection("tutorials")
      .findOne({_id:new mongodb.ObjectID(id)})
      .then((item)=>{
         res.status(200).json({response:item});
      })
      .catch((error)=>{
         res.status(500).json({error});
      })
})

//POST a course
app.post("/api/courses",(req,res)=>{
    const { id,name } = req.body;
    const db = mongoUtil.getDb();
    db.collection("tutorials")
      .insertOne({id,name})
      .then((response)=>{
          res.status(200).json({response});
      })
      .catch((error)=>{
          res.status(400).json({error})
      })
})

//Update a course
app.put("/api/courses/:id",(req,res)=>{
    const id = new mongodb.ObjectId(req.params.id);
    const db = mongoUtil.getDb();
    db.collection("tutorials")
      .updateOne({_id:id},{
          $set:{
            name:req.body.name
          }
      }).then((response)=>{
          res.status(200).json({response});
      }).catch((error)=>{
          res.status(500).json({error});  
      })
});

//Delete a Course
app.delete("/api/courses/:id",(req,res)=>{
    const id = new mongodb.ObjectID(req.params.id);
    const db = mongoUtil.getDb();
    db.collection("tutorials")
      .deleteOne({_id:id})
      .then((response)=>{
         res.status(200).json({response});
      })
      .catch((error)=>{
         res.status(500).json({error});
      })
});

//Handling 404
app.use("*",(req,res,next)=>{
    res.send("Not able to find the resource you are looking for");
})

app.listen(port,()=>{
    console.log(`Server is up and Running on port ${port}`);
})