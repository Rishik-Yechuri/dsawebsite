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
import ArrayComponent from "./ArrayComponent";


function App() {
    /* var arr = JSON.parse(localStorage.getItem("arr"));
     var tempLen = arr.length
     if(arr.length > 1){
         const [state,setState] = useState(4);
     }*/
    const [state, setState] = useState(0);
    const [algoState, setAlgoState] = useState("A*");
    const [buttonState, setButtonState] = useState(0);
    const [resetState, setResetState] = useState(0);
    const [arrayHiddenState, setArrayHiddenState] = useState(true);
    const [arrayReset, setArrayReset] = useState(0);
    const [arraySort, setArraySort] = useState(0);
    const [arraySortMethod, setArraySortMethod] = useState("Bubble Sort");

    return (
        <div id={"mainDiv"}>
            <ArrayNavBar setArrayReset={setArrayReset} arrayReset={arrayReset} setArraySort={setArraySort} arraySort={arraySort} setArraySortMethod={setArraySortMethod}></ArrayNavBar>
            <Navbar setState={setState} setAlgoState={setAlgoState} setButtonState={setButtonState}
                    buttonState={buttonState} resetState={resetState} setResetState={setResetState}></Navbar>

            <MazeComponent state={state} algoState={algoState} buttonState={buttonState} setState={setState}
                           resetState={resetState}></MazeComponent>
            <ArrayComponent arrayHiddenState={arrayHiddenState} arrayReset={arrayReset} arraySort={arraySort} arraySortMethod={arraySortMethod}></ArrayComponent>
        </div>
    );
}

export default App;
