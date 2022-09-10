import React, {useState} from 'react';
import './navbarcss.css';
import DropdownComponent from "./dropdownComponent";
import startingarrow from "./startingarrow.png";
import targetnode from "./targetnode.png"
import AlgorithmComponent from "./algorithmsDropdown";
import AlgorithmsDropdown from "./algorithmsDropdown";
import {usePrevious} from "react-use";

const navbar = ({setState,setAlgoState,setButtonState,buttonState,resetState,setResetState}) => {
   //Updates length state
    const updateLength = (event) =>{
        const inputVal = event.target.value;
        setState(inputVal);
    }
    //Updates visualize button state
    const updateButtonState = (event) => {
        setButtonState(buttonState+1);
    }
    //Updates reset button state
    const updateResetState = (event) => {
        setResetState(resetState+1);
    }
    return (
        <div className={"topBar"} id={"navBarTop"}>
            <div className={"halfDiv"} id={"topDiv"}>
                <div className="dropdown" id={"dropdownTop"}>
                    <DropdownComponent/>
                </div>
                <div className="dropdown">
                    <AlgorithmsDropdown setAlgoState={setAlgoState}/>
                </div>
                <form id={"sizeInput"}>
                    <input type="text" onChange={updateLength} id={"sizeInputField"}
                           placeholder="Border Length"/>
                </form>
                <button onClick={updateButtonState} className={"button"} id={"createButton"}>Visualize</button>
                <button onClick={updateResetState} className={"button"}>Reset</button>

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
                    <div className={"itemImg"} id={"visitedNode"}/>
                    <text className={"itemText"}>Visited Node</text>
                </div>
                <div className={"itemHolder"}>
                    <div className={"itemImg"} id={"finalPath"}/>
                    <text className={"itemText"}>Final Path</text>
                </div>
                <div className={"itemHolder"}>
                    <div className={"itemImg"} id={"wall"}/>
                    <text className={"itemText"}>Wall</text>
                </div>
            </div>
        </div>
    );
}

export default navbar;
