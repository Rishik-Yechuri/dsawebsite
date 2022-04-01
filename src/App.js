import logo from './logo.svg';
import './App.css';
import {Helmet} from "react-helmet";
import {BrowserRouter as Router, Routes, Route, Switch} from "react-router-dom";
import Navbar from "./navbar";
import ArrayNavBar from "./ArrayNavBar";
import React, {useState} from "react";
import "./navbarcss.css"
import "./mazeComponentStyle.css"
import dropDown from "./dropdown.png";
import MazeComponent from "./MazeComponent";


function App() {
    const[state,setState]= useState( 3);
    return (
        <div id={"mainDiv"}>
            <ArrayNavBar></ArrayNavBar>
            <Navbar setState={{setState}}></Navbar>

            <MazeComponent state={state}></MazeComponent>
        </div>
    );
}

export default App;
