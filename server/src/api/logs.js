const { Router } = require("express");
const LogEntry = require("../models/LogEntry");
const uploadImageToS3 = require('./imageController')
const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')
const { v4: uuidv4 } = require('uuid');


const dotenv = require("dotenv");
dotenv.config();
 
var app = express()
const router = Router();



aws.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey:process.env.secretAccessKey,
  region:process.env.region
})

const s3 = new aws.S3({ /* ... */ })

 

router.get("/", async (req, res) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    
    const logEntry = new LogEntry(req.body);
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
    console.log(req.body);
  } catch (error) {
    console.log(error.name);
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

router.delete("/",async (req,res, next)=> {
  try{
    console.log("from server delete: " + req.body.id)
    //res.json();
    const deleted = await LogEntry.deleteOne({_id:req.body.id})
    res.json()
  }catch(error){
    console.log(error.name)
    res.status(401);
  }
})

router.post('/test',(req,res)=>{
  console.log("req.body",req.body);
  res.send("Got it")
})


var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'travelmap-bucket-2021',
    key: function (req, file, cb) {
      console.log("file", file)
      cb(null, req.s3Key)
    }
  })
})

const singleFileUpload = upload.single('image')

function uploadToS3(req,res){
    req.s3Key = uuidv4();
    console.log("uploadToS3")
    let downloadUrl =`https://s3-${process.env.region}.amazonaws.com/travelmap-bucket-2021/${req.s3Key}`
  return new Promise((resolve,reject)=>{
      return singleFileUpload(req,res,err=>{
          if(err) reject(err);
          return resolve(downloadUrl)
      })
  })
}

router.get("/test",(req,res)=>{
  console.log("/test")
  res.send("got it")
})

router.post('/upload', function(req, res, next) {
  uploadToS3(req,res)
  .then(downloadUrl=>{
      console.log(downloadUrl)
      res.status(200).send({downloadUrl})
  })
  .catch(e=>{
      console.log(e)
  })
})




module.exports = router;
