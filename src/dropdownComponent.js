import React from "react";
import dropDown from "./dropdown.png";
import './navbarcss.css';



const dropdownComponent = () => {
    var dropDownActivated = false;

    const box = document.querySelector(".dropdownDiv");
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

    return (

        <>
            <div onClick={structureDropdown} id={"dropdownDiv"}>
                <text id={"dropdownText"}>Structure:Maze</text>
                <img src={dropDown} id={"dropdownImg"}/>
            </div>
            <div className="dropdown-content" id={"firstContent"}>
                <a className={"link"} href="#">Link 1</a>
                <a className={"link"} href="#">Link 2</a>
                <a className={"link"} href="#">Link 3</a>
            </div>
        </>
    );
}

export default dropdownComponent;