import React from "react";
import dropDown from "./dropdown.png";
import './navbarcss.css';


const ArrayAlgorithmComponent = ({setArraySortMethod}) => {
    //Sets dropdown state
    var dropDownActivated = false;
    //Waits for click
    document.addEventListener("click", function (event) {
        if (event.target.closest("#dropdownDiv")) {
            return;
        } else {
            document.getElementById("thirdContent").style.display = 'none';
            dropDownActivated = false;
        }
    })

    //Update dropdown
    function structureDropdown() {
        if (dropDownActivated) {
            document.getElementById("thirdContent").style.display = 'none';
        }
        if (!dropDownActivated) {
            document.getElementById("thirdContent").style.display = 'block';
        }
        //Update dropdown state
        dropDownActivated = !dropDownActivated;
    }

    //Updates text for dropdown
    function updateDropdownText(newText) {
        document.getElementById("algText").textContent = "Algorithm:" + newText;
        setArraySortMethod(newText);
    }

    return (
        <>
            <div onClick={structureDropdown} id={"dropdownDiv"}>
                <text className={"textOfDropdown"} id={"algText"}>Algorithm:Bubble Sort</text>
                <img src={dropDown} id={"dropdownImg"}/>
            </div>
            <div className="dropdown-content" id={"thirdContent"}>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Merge Sort")}>Merge Sort</a>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Quick Sort")}>Quick Sort</a>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Selection Sort")}>Selection Sort</a>
                <a className={"link"} href="#" onClick={() => updateDropdownText("Bubble Sort")}>Bubble Sort</a>
            </div>
        </>
    );
}

export default ArrayAlgorithmComponent;