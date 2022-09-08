import React, {useEffect, useState} from 'react';
import './navbarcss.css';
import DropdownComponent from "./dropdownComponent";
import ArrayAlgorithmComponent from "./ArrayAlgorithmComponent";
const ArrayNavBar = ({setArrayReset,arrayReset,setArraySort,arraySort,setArraySortMethod}) => {
   // const [setArraySortMethod, arraySortMethod] = useState("Merge");

    const updateArrayResetState = (event) => {
        setArrayReset(arrayReset+1);
    }
    const updateArraySortState = (event) => {
        setArraySort(arraySort+1);
    }
    return (
        <div className={"topBar"} id={"arrayNavBarTop"}>
            <div className={"halfDiv"} id={"topDiv"}>
                <div className={"spaceDiv"}></div>
                <div className={"dropdown2"}>
                    <DropdownComponent/>
                </div>
                <div className={"dropdown2"}>
                    <ArrayAlgorithmComponent setArraySortMethod={setArraySortMethod}/>
                    </div>
                <button onClick={updateArraySortState} className={"button"} id={"createButton"}>Sort</button>
                <button onClick={updateArrayResetState} className={"button"} >Reset</button>

            </div>
        </div>
    );
}

export default ArrayNavBar;
