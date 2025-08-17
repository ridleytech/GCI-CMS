import logo from "../logo.svg";
import "../App.css";
import { Routes, Route, Link } from "react-router-dom";
import ReactDropdown from "react-dropdown";
import { useEffect, useState } from "react";
import "react-dropdown/style.css";
import NavBar from "./NavBar";
import ReactPlayer from "react-player";

function Compose() {
  const [sourceOptions, setsourceOptions] = useState(["Vacant", "Lien"]);
  const [selectedSource, setselectedSource] = useState();
  const _onSourceSelect = (e) => {
    //console.log("e", e.value);
    setselectedSource(e.value);
  };

  // useEffect(() => {
  //   if (selectedSource) {
  //     console.log("ss", selectedSource);
  //   }
  // }, [selectedSource]);

  return (
    <div style={{ padding: 20, backgroundColor: "gray" }}>
      <NavBar />

      <ReactDropdown
        style={{}}
        options={sourceOptions}
        onChange={_onSourceSelect}
        value={selectedSource}
        placeholder="Select an option"
      />

      <input
        type="text"
        placeholder="Subject"
        id="fileTxt"
        style={{ marginTop: 10, width: "97%", padding: 15 }}
      />

      <textarea
        style={{
          width: "97%",
          minHeight: 500,
          marginTop: 10,
          //paddingLeft: 10,
          padding: 15,
        }}
      ></textarea>

      {/* <button title="Send" value={"Send"}></button> */}

      <div
        //onClick={convert}
        style={{
          backgroundColor: "#61dafb",
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 15,
          paddingBottom: 15,
          width: 100,
          textAlign: "center",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: 10,
          borderRadius: 4,
        }}
      >
        CONVERT
      </div>
    </div>
  );
}

export default Compose;
