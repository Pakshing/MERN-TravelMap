import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEntry,uploadImgae } from "../API";
import axios from 'axios'


//import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button'
import ImageUploader from 'react-images-upload';

import 'date-fns';



export default function LogEntryForm ({ location, onClose }) {
  const inputRef = React.createRef(null);
  const [loading, setLoading] = useState(false);
  const [image,setImage] = useState([]);
  const [pictures, setPictures] = useState([]);

  const [error, setError] = useState("");
  const { register, handleSubmit,errors } = useForm();
  const [selectedDate, setSelectedDate] = useState(Date.now()); 
  const [title,setTitle] = useState("");
  const [comments,setComments] = useState("");
  const [description, setDescription] = useState("");
  //const [image,setImage] = useState("");


 
  const buttonStyle={
    background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
    width: '500px',
    color: 'white',
    border: 'none'
  }

  const formStyle={
    background: 'black',
    width: '600px'
  }


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onDrop = picture => {
    setPictures([...pictures, picture]);
    console.log(picture)
  };

  
  const onTest = async() =>{
    await axios.post("http://localhost:1337/api/logs/test",{name:"pak"})
    .then(res=>{
      console.log("From server", res)
    })
  }




  const onSubmit = async() => {
    try {
      setLoading(true);
      //console.log("this is location: 1" +location.latitude);
      //console.log("onSubmit", pictures)
      //const uploadResponse = await uploadImgae(pictures)
      let uploadPromises=pictures.map(image=>{
        console.log("image=>",image[0].name)
        let data = new FormData()
        data.append('image',image[0],image[0].name);
        return axios.post("http://localhost:1337/api/logs/upload",data)
      })

      axios.all(uploadPromises)
        .then(result=>{
          console.log(result)
        })
        .catch(err=>{
          console.log(err)
        })

      //console.log("uploadResponse", uploadResponse)
      let data={};
      //console.log("this is data: 1" +data)
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      data.title = title;
      data.comments = comments;
      data.visitDate = selectedDate;
      data.description = description;
      data.image = image;
      //data.visitDate = selectedDate;
      //console.log(selectedDate);
      console.log("this is data: 2" +data);
      //await createLogEntry(data);
      //alert("Entry Created")
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };


  return (
    
    <div style={{width:400}}>
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error ? <h3 className="error">{error}</h3> : null}
     
      <TextField
          required
          name="title"
          id="outlined-required"
          label="Required Title"
          placeholder="Title"
          //variant="outlined"
          onChange ={e=>setTitle(e.target.value)}
          style = {{width: 500}}
          ref = {inputRef}
        />
      <TextField
          name="comments"
          id="standard-textarea"
          label="Comment"
          placeholder="The view is great!"
          multiline
          style = {{width: 500}}
          onChange ={e=>setComments(e.target.value)}
          ref={inputRef}
        />
      
      <TextField
          name="description"
          id="standard-textarea"
          label="Description"
          placeholder="This place....."
          multiline
          onChange ={e=>setDescription(e.target.value)}
          style = {{width: 500}}
          ref={inputRef}
        />

        <div>
        <ImageUploader
            singleImage = {true}
            withIcon={true}
            style={{width:500}}
            withPreview={true}
            buttonText='Select an image'
            onChange={onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
        />

        </div>

      <TextField
          required
          name="date"
          id="standard-textarea"
          type = "date"
          style = {{
            width: 500,
            marginTop:10  
          }}
          onChange ={e=>setImage(e.target.value)}
          defaultValue = {selectedDate}
          ref={inputRef}
        />
      

     
      <button 
      disabled={loading}
      style={buttonStyle}
      >
        {loading ? "Loading..." : "Create Entry"}
      </button>
    </form>
    </div>
    
  );
};

//export default LogEntryForm;
