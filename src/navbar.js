import React from 'react';
import {  Link } from "react-router-dom";
import './navbarcss.css';
const navbar= () =>{
    return (
        <div className={"topBar"}>
            <div className={"halfDiv"} id={"topDiv"}>

            </div>
            <hr className={"divider"}></hr>
            <div className={"halfDiv"} id={"bottomDiv"}>
            </div>
        </div>
   );
}
export default navbar;