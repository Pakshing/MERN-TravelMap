import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEntry,uploadImgae } from "../API";



//import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import DatePicker from "react-datepicker";
import ImageUploader from 'react-images-upload';
import {Container} from 'react-bootstrap'

import "react-datepicker/dist/react-datepicker.css";
import "./entryForm-style.css";


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
    
    <div className="form-div">
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form" >
      {error ? <h3 className="error">{error}</h3> : null}
     <Container>
      <TextField
          required
          className="textfield"
          name="title"
          id="outlined-required"
          label="Required Title"
          placeholder="Title"
          //variant="outlined"
          onChange ={e=>setTitle(e.target.value)}
         
          ref = {inputRef}
        />
     </Container>
      
      <Container>
      <TextField
          name="description"
          label="Description"
          placeholder="This place....."
          className="textfield"
          multiline
          onChange ={e=>setDescription(e.target.value)}
         
          ref={inputRef}
        />
        </Container>

        <Container>
        <ImageUploader
            singleImage = {true}
            withIcon={true}
            className="imageUploader"
            withPreview={true}
            buttonText='Select an image'
            onChange={onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif','.jpeg']}
            maxFileSize={5242880}
        />
        </Container>

      <Container className ="date-picker-container">
      <label>Visit Date*</label>
      <DatePicker
        className="date-picker"
        selected={selectedDate}
        onChange={date=>setVisitDate(date)}
        dateFormat="MM/dd/yyyy"
        required
      />
      </Container>

      

     
     <Container className="button-container">
      <button 
      className="button"
      disabled={loading}
      >
        {loading ? "Loading..." : "Create Entry"}
      </button>
      </Container>

    </form>
    </div>
    
  );
};

//export default LogEntryForm;