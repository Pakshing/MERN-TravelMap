const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')
const dotenv = require("dotenv");
const uuid=require('uuid')


dotenv.config();

aws.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    region:process.env.region
  })
  
  const s3 = new aws.S3({ /* ... */ })


var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'travelmap2021',
      key: function (req, file, cb) {
        console.log("file", file)
        cb(null, req.s3Key)
      }
    })
  })

  const singleFileUpload = upload.single('image')

  function uploadToS3(req,res){
      req.s3Key = uuid();
      let downloadUrl =`https://travelmap-bucket-2021.s3.${process.env.region}.amazonaws.com/${req.s3Key}`
    return new Promise((resolve,reject)=>{
        return singleFileUpload(req,res,err=>{
            if(err) reject(err);
            return resolve(downloadUrl)
        })
    })

  }

  module.exports={
      uploadImageToS3: (req,res)=>{
          uploadToS3(req,res)
          .then(downloadUrl=>{
              console.log(downloadUrl)
          })
          .then(()=>res.status(200).send({downloadUrl}))
          .catch(e=>{
              console.log(e)
          })
      }

  }
 

