const { Router } = require("express");

const LogEntry = require("../models/LogEntry");

const router = Router();

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

module.exports = router;
