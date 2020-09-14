import * as React from "react";
import { useState, useEffect, Fragment } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import Card from "./components/Card";
import LogEntryForm from "./components/LogEntryForm";
import { listLogEntries } from "./API";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [showPopup, setShowPopup] = useState({});
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.6,
    longitude: -95.665,
    zoom: 4.5,
  });
  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/pakshing/ckddrnlrt4dvz1ip8brlo1at2"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <Fragment key={entry._id}>
          <Marker
            key={entry._id}
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div
              onClick={() =>
                setShowPopup({
                  //...showPopup,
                  [entry._id]: true,
                })
              }
            >
              <svg
                className="marker"
                style={{
                  width: "24px",
                  height: "24px",
                }}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          {showPopup[entry._id] ? (
            <div>
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={false}
                closeOnClick={false}
                //closeOnMove={() => setShowPopup({})}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                //anchor="top"
              >
                <Card
                  setShowPopup={setShowPopup}
                  title={entry.title}
                  comment={entry.comments}
                  visitedDate={new Date(entry.visitDate).toLocaleDateString()}
                  image={
                    entry.image
                      ? entry.image
                      : "https://archziner.com/wp-content/uploads/2019/05/blue-sky-planet-stars-drawn-cute-backgrounds-for-girls.jpg"
                  }
                ></Card>
              </Popup>
            </div>
          ) : null}
        </Fragment>
      ))}
      {addEntryLocation ? (
        <Fragment>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            offsetLeft={-20}
            offsetTop={-20}
          >
            <div>
              <svg
                className="marker"
                style={{
                  width: "24px",
                  height: "24px",
                  color: "white",
                }}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            offsetLeft={-10}
            offsetTop={-20}
            closeButton={true}
            closeOnClick={false}
            //closeOnMove={() => setShowPopup({})}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            //anchor="top"
          >
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </Fragment>
      ) : null}
    </ReactMapGL>
  );
};

export default App;
