import React from "react";
import dropDown from "./dropdown.png";
import './navbarcss.css';


const dropdownComponent = () => {
    //Tracks if dropdown is activated
    var dropDownActivated = false;
    //Listens for click
    document.addEventListener("click", function (event) {
        if (event.target.closest(".screenSwitchDropdown")) {
            return;
        } else {
            var holdDropdowns = document.getElementsByClassName("majorDropdown");
            for (var x = 0; x < holdDropdowns.length; x++) {
                (holdDropdowns.item(x)).style.display = 'none';
            }
            dropDownActivated = false;
        }
    })
    //Updates dropdown
    function structureDropdown() {
        var holdDropdowns = document.getElementsByClassName("majorDropdown");
        if (dropDownActivated) {
            for (var x = 0; x < holdDropdowns.length; x++) {
                (holdDropdowns.item(x)).style.display = 'none';
            }
        }
        if (!dropDownActivated) {
            for (var x = 0; x < holdDropdowns.length; x++) {
                (holdDropdowns.item(x)).style.display = 'block';
            }
        }
        //Updates dropdown state
        dropDownActivated = !dropDownActivated;

    }
    //Change text for dropdown
    function updateDropdownText(newText) {
        var elements = document.getElementsByClassName("structureDropdown");
        for (var x = 0; x < elements.length; x++) {
            elements.item(x).textContent = "Structure:" + newText;
        }
        document.getElementsByClassName("structureDropdown").textContent = "Structure:" + newText;
        if (newText === "Array") {
            document.getElementById("arrayNavBarTop").style.display = 'block';
            document.getElementById("navBarTop").style.display = 'none';
            document.getElementById("arrayTopDiv").style.removeProperty('display');// = 'block';
            document.getElementById("mazeTopDiv").style.display = 'none';
        } else {
            document.getElementById("arrayNavBarTop").style.display = 'none';
            document.getElementById("navBarTop").style.display = 'block';
            document.getElementById("arrayTopDiv").style.display = 'none';
            document.getElementById("mazeTopDiv").style.removeProperty('display');// = 'block';
        }
    }

    return (
        <>
            <div onClick={structureDropdown} className={"screenSwitchDropdown"} id={"dropdownDiv"}>
                <text className={"structureDropdown"} id={"structText"}>Structure:Maze</text>
                <img src={dropDown} id={"dropdownImg"}/>
            </div>
            <div className="dropdown-content majorDropdown" id={"firstContent"}>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Maze")}>Maze</a>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Array")}>Array</a>
            </div>
        </>
    );
}

export default dropdownComponent;