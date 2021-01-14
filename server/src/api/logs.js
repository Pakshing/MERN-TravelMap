const { Router } = require("express");
const LogEntry = require("../models/LogEntry");
const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')


const dotenv = require("dotenv");
dotenv.config();
 
var app = express()
const router = Router();

const s3 = new aws.S3({ /* ... */ })

aws.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey:process.env.secretAccessKey,
  region:process.env.region
})

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'travelmap2021',
    key: function (req, file, cb) {
      console.log("file", file)
      cb(null, Date.now().toString())
    }
  })
})

const singleFileUpload = upload.single('image');
 
router.post('/upload', upload.single('image'), function(req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!')
})





router.get("/", async (req, res) => {
  try {
    console.log("-----------------")
    console.log(process.env.secretAccessKey)
    console.log("-----------------")
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

module.exports = router;
