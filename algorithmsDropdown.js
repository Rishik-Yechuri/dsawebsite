import React, {useState} from "react";
import dropDown from "./dropdown.png";
import './navbarcss.css';
const algorithmsDropdown = ({setState,setAlgoState}) => {
    //A* is the default algorithm
    var currentAlgo = "A*";
    //Stores whether the dropdown is open or not
    var dropDownActivated = false;
    //Waits for click
    document.addEventListener("click",function (event){
        if(event.target.closest("#dropdownDiv")){
            return;
        }else{
            document.getElementById("secondContent").style.display = 'none';
            dropDownActivated = false;
        }
    })
    //Function to open and close dropdown
    function structureDropdown() {
        if (dropDownActivated) {
            document.getElementById("secondContent").style.display = 'none';
        }
        if (!dropDownActivated) {
            document.getElementById("secondContent").style.display = 'block';
        }
        //Change dropdown state
        dropDownActivated = !dropDownActivated;
    }
    //Update text
    function updateDropdownText(newText){
        document.getElementById("mazeAlgText").textContent = "Algorithm:" + newText;
        setAlgoState(newText);
    }

    return (
        <>
            <div onClick={structureDropdown} id={"dropdownDiv"}>
                <text className={"textOfDropdown"} id={"mazeAlgText"}>Algorithm:A*</text>
                <img src={dropDown} id={"dropdownImg"}/>
            </div>
            <div className="dropdown-content" id={"secondContent"}>
                <a className={"link"} href="#" onClick={() => updateDropdownText("A*")}>A*</a>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Bidirectional")}>Bidirectional</a>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Breadth First")}>Breadth First</a>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Depth First")}>Depth First</a>
            </div>
        </>
    );
}

export default algorithmsDropdown;