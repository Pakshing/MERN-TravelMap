import React, { useRef, useEffect } from "react";
import { deleteEntry } from "../API";

import "./card-style.css";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';

const Card = ({ setShowPopup, title, comment, visitedDate, image,entry,getEntries }) => {

  const addDefaultImage = e =>{
    e.target.src = "https://archziner.com/wp-content/uploads/2019/05/blue-sky-planet-stars-drawn-cute-backgrounds-for-girls.jpg";
  }

  const onDeleteClick = async () =>{
    try{
      console.log("Entry:" +entry._id);
      await deleteEntry(entry._id)
      getEntries();
      alert("Entry deleted")

    }catch(error){
      console.error(error);
    }
    
  }

  return (
    <div
      onClick={() => setShowPopup({})}
      style={{
        borderStyle: "outset",
        borderColor: "#0e5157",
        width: "600px",
        height: "600px",
      }}
      className="card text-center shadow"
    >
      <div className="overflow">
        
        <img
          onError={e=>addDefaultImage(e)}
          border="black"
          src={image}
          alt="No Image"
          className="card-img-top"
        />
      </div>
      
      <div className="card-body text-dark">
        <h4 className="card-title">{title}</h4>
        <p> {comment}</p>
        <p className="card-text text-secondary"> {visitedDate}</p>
      </div>
      <ButtonGroup
        fullWidth={true}
      >
        <Button
          startIcon={<CancelIcon/>}
          size="large"
          variant="contained"
          color = "primary"
          >
          Back
        </Button>
        <Button
          startIcon={<DeleteForeverOutlinedIcon/>}
          size="large"
          variant="contained"
          color = "secondary"
          onClick={e=>onDeleteClick(e)}
          >
          Delete
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Card;
