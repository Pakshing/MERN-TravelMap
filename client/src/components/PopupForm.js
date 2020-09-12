import { Fragment } from "react";
import React, { useState } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const PopupForm = ({ title, comments, visitedDate, image }) => {
  return (
    <Fragment>
      <Card border={"Dark"} style={{ width: "35rem" }}>
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{comments}</Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default PopupForm;
