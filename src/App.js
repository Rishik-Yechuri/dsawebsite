import logo from './logo.svg';
import './App.css';
import {Helmet} from "react-helmet";
import {BrowserRouter as Router, Routes, Route, Switch} from "react-router-dom";
import navbar from "./navbar"
import Navbar from "./navbar";
import React from "react";




function App() {
  return (
      <div>
        <Navbar/>
      </div>
  );
}

export default App;
