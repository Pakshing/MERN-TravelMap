import * as React from "react";
import { useState, useEffect,useRef,useCallback, Fragment } from "react";
import ReactMapGL, { Marker,Popup } from "react-map-gl";
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import Geocoder from "react-map-gl-geocoder";
import FullPopup from "reactjs-popup"


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
    latitude: 36.778259,
    longitude: -119.417931,
    zoom: 6,
  });
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    [handleViewportChange]
  );


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
      ref={mapRef}
      {...viewport}
      mapStyle="mapbox://styles/pakshing/ckddrnlrt4dvz1ip8brlo1at2"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
      doubleClickZoom = {false}
    >
      <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          position="top-left"
        />
      {logEntries.map((entry) => (
        <Fragment key={entry._id}>
          {showPopup[entry._id] ? (
            
            <FullPopup open={true}>
              <Card
                DELETE_PASSWORD = {process.env.REACT_APP_DELETE_KEY}
                getEntries = {getEntries}
                setShowPopup={setShowPopup}
                title={entry.title}
                comment={entry.comments}
                description = {entry.description}
                visitedDate={new Date(entry.visitDate).toLocaleDateString()}
                image={
                  entry.image
                    ? entry.image
                    : "https://archziner.com/wp-content/uploads/2019/05/blue-sky-planet-stars-drawn-cute-backgrounds-for-girls.jpg"
                }
                entry ={entry}
              ></Card>
            </FullPopup>
          
        ) : null}
          <Marker
            key={entry._id}
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-20}
            offsetTop={-10}
            dynamicPosition = {true}
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
