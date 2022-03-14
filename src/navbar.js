import React from 'react';
import {  Link } from "react-router-dom";
import './navbarcss.css';
import dropDown from './dropdown.png';
const navbar= () =>{
    return (
        <div className={"topBar"}>
            <div className={"halfDiv"} id={"topDiv"}>
                <div className="dropdown">
                <div  id={"dropdownDiv"}>
                    <text id={"dropdownText"}>Structure:Maze</text>
                    <img src={dropDown} id={"dropdownImg"}/>
                </div>
                <div className="dropdown-content">
                    <a href="#">Link 1</a>
                    <a href="#">Link 2</a>
                    <a href="#">Link 3</a>
                </div>
                </div>
            </div>
            <hr className={"divider"}></hr>
            <div className={"halfDiv"} id={"bottomDiv"}>
            </div>
        </div>
   );
}
export default navbar;