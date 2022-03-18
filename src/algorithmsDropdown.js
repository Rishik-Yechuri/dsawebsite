import React from "react";
import dropDown from "./dropdown.png";
import './navbarcss.css';



const algorithmsDropdown = () => {
    var dropDownActivated = false;
    document.addEventListener("click",function (event){
        if(event.target.closest("#dropdownDiv")){
            return;
        }else{
            document.getElementById("secondContent").style.display = 'none';
            dropDownActivated = false;
        }
    })
    function structureDropdown() {
        if (dropDownActivated) {
            document.getElementById("secondContent").style.display = 'none';
        }
        if (!dropDownActivated) {
            document.getElementById("secondContent").style.display = 'block';
        }
        dropDownActivated = !dropDownActivated;

    }

    return (

        <>
            <div onClick={structureDropdown} id={"dropdownDiv"}>
                <text id={"dropdownText"}>Algorithm:A*</text>
                <img src={dropDown} id={"dropdownImg"}/>
            </div>
            <div className="dropdown-content" id={"secondContent"}>
                <a className={"link"} href="#">Dijkstra's</a>
                <a className={"link"} href="#">A*</a>
                <a className={"link"} href="#">Bidirectional</a>
                <a className={"link"} href="#">Breadth First*</a>
                <a className={"link"} href="#">Depth First</a>
            </div>
        </>
    );
}

export default algorithmsDropdown;