import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEntry } from "../API";

//import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import 'date-fns';
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { da } from "date-fns/esm/locale";


export default function LogEntryForm ({ location, onClose }) {
  const inputRef = React.createRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit,errors } = useForm();
  const [selectedDate, setSelectedDate] = useState(Date.now()); 
  const [title,setTitle] = useState("");
  const [comments,setComments] = useState("");
  const [description, setDescription] = useState("");
  const [image,setImage] = useState("");


  const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTitleChange = (e)=>{
    console.log(e.target.value);
    //setTitle(title);
  }
  const handleCommentsChange = (e)=>{
    //setComments(comments);
  }

  const handleDescriptionChange = (e)=>{
    //setDescription(e);
  }
  const handleImageChange = (e)=>{
    //setImage(image);
  }





  const onSubmit = async() => {
    try {
      setLoading(true);
      console.log("this is location: 1" +location.latitude);
      let data={};
      //console.log("this is data: 1" +data);
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
      await createLogEntry(data);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };


  return (
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

      <TextField
          name="image"
          id="standard-textarea"
          label="Image Link"
          placeholder="https://......"
          multiline
          style = {{width: 500}}
          onChange ={e=>setImage(e.target.value)}
          ref={inputRef}
        />

      <TextField
          name="date"
          id="standard-textarea"
          type = "date"
          style = {{width: 500}}
          onChange ={e=>setImage(e.target.value)}
          defaultValue = {selectedDate}
          ref={inputRef}
        />
      

     
      <button disabled={loading}>
        {loading ? "Loading..." : "Create Entry"}
      </button>
    </form>
    
  );
};

//export default LogEntryForm;
