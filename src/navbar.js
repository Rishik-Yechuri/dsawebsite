import React from 'react';
import {  Link } from "react-router-dom";
import './navbarcss.css';
import dropDown from './dropdown.png';
import {Helmet} from "react-helmet";

/*
import script from "./navbarjs";
*/



const navbar= () =>{
    var dropDownActivated = false;
    function structureDropdown(){
        if(dropDownActivated){
            document.getElementById("firstContent").style.display = 'none';
        }else{
            document.getElementById("firstContent").style.display = 'block';
        }
        dropDownActivated = !dropDownActivated;
    }
    return (
        <div className={"topBar"}>
            {/*<script src="navbarjs.js" async={true}/>*/}
            <div className={"halfDiv"} id={"topDiv"}>
                <div className="dropdown" id={"dropdownTop"} onClick={structureDropdown} >
                <div  id={"dropdownDiv"}>
                    <text id={"dropdownText"}>Structure:Maze</text>
                    <img src={dropDown} id={"dropdownImg"}/>
                </div>
                <div className="dropdown-content" id={"firstContent"}>
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