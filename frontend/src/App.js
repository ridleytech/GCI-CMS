import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import ReactDropdown from "react-dropdown";
import { useEffect, useState } from "react";
import "react-dropdown/style.css";
import Compose from "./components/Compose";
import Contacts from "./components/Contacts";
import Templates from "./components/Templates";
import VoiceTest from "./components/VoiceTest";

function App() {
  return (
    <Routes>
      <Route path="/compose" element={<Compose />}></Route>
      <Route path="/contacts" element={<Contacts />}></Route>
      <Route path="/" element={<VoiceTest />}></Route>
    </Routes>
  );
}

export default App;
