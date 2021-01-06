const { Router } = require("express");
const LogEntry = require("../models/LogEntry");
const router = Router();
const multer = require("multer");
var fs = require("fs");

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./upload/')
  },
  filename: function(req,file,cb){
    cb(null, new Date().toISOString() +file.originalname);
  }
})

const upload = multer({ storage:storage })



router.get("/", async (req, res) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", upload.single("image"),async (req, res, next) => {
  console.log("image",req.file);
  try {
    //console.log("req.body",req.body)
    const logEntry = new LogEntry(
      {
        image : req.body.image,
        //console.log("image: ",image);
        latitude : req.body.latitude,
        longitude : req.body.longitude,
        title : req.body.title,
        comments : req.body.comments,
        visitDate : req.body.visitDate,
        description : req.body.description
      }
    );
    
    console.log("logs:", logEntry);
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
