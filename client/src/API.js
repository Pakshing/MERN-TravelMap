import axios from 'axios'

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:1337"
    : "https://travel-log-pak-api.pakshing.vercel.app";

export async function listLogEntries() {
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
}

export async function deleteEntry(entry_id) {

  const response = await fetch(`${API_URL}/api/logs`, {
    method: "DELETE",
    headers: {
      'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
     },
    body: JSON.stringify({id:entry_id}),
  });
  console.log(response)
}

export async function uploadImgae(pictures){
 

  try{
    let formdata = new FormData()
    formdata.append('image',pictures[0],pictures[0].name);
    let result = await axios.post(`${API_URL}/api/logs/upload`,formdata)
    return result;
  }catch(error){
    console.log("error",error)
    return ""
  }
  
  

 

 

  //console.log("from API.js", response)
 
}






export async function createLogEntry(entry) {
  // const apiKey = entry.apiKey;
  // delete entry.apiKey;
  const response = await fetch(`${API_URL}/api/logs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // "X-API-KEY": apiKey,
    },
    body: JSON.stringify(entry),
  });
  let json;
  if (response.headers.get("content-type").includes("text/html")) {
    const message = await response.text();
    json = {
      message,
    };
  } else {
    json = await response.json();
  }
  if (response.ok) {
    return json;
  }
  const error = new Error(json.message);
  error.response = json;
  throw error;
}
