import React from 'react';
import './navbarcss.css';
import DropdownComponent from "./dropdownComponent";


const navbar = () => {

    return (
        <div className={"topBar"}>
            <div className={"halfDiv"} id={"topDiv"}>
                <div className="dropdown" id={"dropdownTop"}>
                    <DropdownComponent></DropdownComponent>
                </div>
                <form id={"sizeInput"}>
                    <input type="text" id={"sizeInputField"} placeholder="Border Length"/>
                </form>
                <button id={"createButton"}>Create</button>
            </div>

            <hr className={"divider"}></hr>
            <div className={"halfDiv"} id={"bottomDiv"}>
            </div>
        </div>
    );
}

export default navbar;
