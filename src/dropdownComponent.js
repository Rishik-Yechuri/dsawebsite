import React from "react";
import dropDown from "./dropdown.png";
import './navbarcss.css';



const dropdownComponent = () => {
    var dropDownActivated = false;
    document.addEventListener("click",function (event){
        if(event.target.closest("#dropdownDiv")){
            return;
        }else{
            document.getElementById("firstContent").style.display = 'none';
            dropDownActivated = false;
        }
    })
    function structureDropdown() {
        if (dropDownActivated) {
            document.getElementById("firstContent").style.display = 'none';
        }
        if (!dropDownActivated) {
            document.getElementById("firstContent").style.display = 'block';
        }
        dropDownActivated = !dropDownActivated;

    }
    function updateDropdownText(newText){
        document.getElementById("structText").textContent = "Structure:" + newText;
    }
    return (

        <>
            <div onClick={structureDropdown} id={"dropdownDiv"}>
                <text className={"textOfDropdown"} id={"structText"}>Structure:Maze</text>
                <img src={dropDown} id={"dropdownImg"}/>
            </div>
            <div className="dropdown-content" id={"firstContent"}>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Maze")}>Maze</a>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Array")}>Array</a>
            </div>
        </>
    );
}

export default dropdownComponent;