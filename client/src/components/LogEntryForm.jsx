import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEntry,uploadImgae } from "../API";



//import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ImageUploader from 'react-images-upload';

import 'date-fns';




export default function LogEntryForm ({ location, onClose }) {
  const inputRef = React.createRef(null);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([]);

  const [error, setError] = useState("");
  const {handleSubmit} = useForm();
  const [selectedDate, setSelectedDate] = useState(null); 
  const [title,setTitle] = useState("");
  const [comments,setComments] = useState("");
  const [description, setDescription] = useState("");
  


 
  const buttonStyle={
    background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
    width: '500px',
    color: 'white',
    border: 'none'
  }


  const onDrop = picture => {
    setPictures(picture);
    console.log(picture)
  };

  

  const onSubmit = async() => {
    try {
      setLoading(true);
      let data={};
      if(pictures.length ===0){
        data.image =""
      }else{
        const imageResponse = await uploadImgae(pictures) 
        data.image = imageResponse.data.downloadUrl;
      }
     
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      data.title = title;
      data.comments = comments;
      data.visitDate = selectedDate;
      data.description = description;
     
      await createLogEntry(data);
      //alert("Entry Created")
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };


  return (
    
    <div >
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form" >
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
          onChange ={e=>setSelectedDate(e.target.value)}
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
