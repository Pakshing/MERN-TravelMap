import React, { useRef, useEffect } from "react";

import "./card-style.css";
const Card = ({ setShowPopup, title, comment, visitedDate, image }) => {
  return (
    <div
      onClick={() => setShowPopup({})}
      style={{
        borderStyle: "outset",
        borderColor: "#0e5157",
        width: "440px",
        height: "440px",
      }}
      className="card text-center shadow"
    >
      <div className="overflow">
        <img
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
    </div>
  );
};

export default Card;
