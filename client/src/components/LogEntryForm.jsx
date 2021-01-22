import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEntry,uploadImgae } from "../API";



//import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageUploader from 'react-images-upload';

import 'date-fns';




export default function LogEntryForm ({ location, onClose }) {
  const inputRef = React.createRef(null);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([]);

  const [error, setError] = useState("");
  const {handleSubmit} = useForm();
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [title,setTitle] = useState("");
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


  const setVisitDate =(date) =>{
    setSelectedDate(date);
    console.log(selectedDate);
    console.log(date)
}
  

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
          name="description"
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
      <div>
      <label>Visit Date*</label>
      <DatePicker
        
        selected={selectedDate}
        onChange={date=>setVisitDate(date)}
        dateFormat="MM/dd/yyyy"
        required
      />
      </div>

      

     
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
