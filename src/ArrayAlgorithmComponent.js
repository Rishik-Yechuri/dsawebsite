import React from "react";
import dropDown from "./dropdown.png";
import './navbarcss.css';



const ArrayAlgorithmComponent = () => {
    var dropDownActivated = false;
    document.addEventListener("click",function (event){
        if(event.target.closest("#dropdownDiv")){
            return;
        }else{
            document.getElementById("thirdContent").style.display = 'none';
            dropDownActivated = false;
        }
    })
    function structureDropdown() {
        if (dropDownActivated) {
            document.getElementById("thirdContent").style.display = 'none';
        }
        if (!dropDownActivated) {
            document.getElementById("thirdContent").style.display = 'block';
        }
        dropDownActivated = !dropDownActivated;

    }

    return (

        <>
            <div onClick={structureDropdown} id={"dropdownDiv"}>
                <text id={"dropdownText"}>Algorithm:Bubble Sort</text>
                <img src={dropDown} id={"dropdownImg"}/>
            </div>
            <div className="dropdown-content" id={"thirdContent"}>
                <a className={"link"} href="#">Bubble Sort</a>
                <a className={"link"} href="#">Merge Sort</a>
                <a className={"link"} href="#">Quick Sort</a>
            </div>
        </>
    );
}

export default ArrayAlgorithmComponent;