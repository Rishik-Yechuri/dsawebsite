import React from 'react';
import './navbarcss.css';
import DropdownComponent from "./dropdownComponent";
import dropDown from "./dropdown.png";
import startingarrow from "./startingarrow.png";
import targetnode from "./targetnode.png"

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
                <div className={"itemHolder"}>
                    <img className={"itemImg"} src={startingarrow} id={"startingArrow"}/>
                    <text className={"itemText"}>Starting Node</text>
                </div>
                <div className={"itemHolder"}>
                    <img className={"itemImg"} src={targetnode} id={"targetNode"}/>
                    <text className={"itemText"}>Target Node</text>
                </div>
                <div className={"itemHolder"}>
                    <div className={"itemImg"}  id={"visitedNode"}/>
                    <text className={"itemText"}>Visited Node</text>
                </div>
                <div className={"itemHolder"}>
                    <div className={"itemImg"}  id={"finalPath"}/>
                    <text className={"itemText"}>Final Path</text>
                </div>
                <div className={"itemHolder"}>
                    <div className={"itemImg"}  id={"wall"}/>
                    <text className={"itemText"}>Wall</text>
                </div>
            </div>
        </div>
    );
}

export default navbar;
