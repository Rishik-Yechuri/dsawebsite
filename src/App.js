import logo from './logo.svg';
import './App.css';
import {Helmet} from "react-helmet";
import {BrowserRouter as Router, Routes, Route, Switch} from "react-router-dom";
import Navbar from "./navbar";
import ArrayNavBar from "./ArrayNavBar";
import React from "react";
import dropDown from "./dropdown.png";




function App() {
  return (
      <div>
        <ArrayNavBar/>
      </div>
  );
}

export default App;
