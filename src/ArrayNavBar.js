import React, {useState} from 'react';
import './navbarcss.css';
import DropdownComponent from "./dropdownComponent";
import ArrayAlgorithmComponent from "./ArrayAlgorithmComponent";

const ArrayNavBar = () => {
    return (
        <div className={"topBar"} id={"arrayNavBarTop"}>
            <div className={"halfDiv"} id={"topDiv"}>
                <div className={"spaceDiv"}></div>
                <div className={"dropdown2"}>
                    <DropdownComponent/>
                </div>
                <div className={"dropdown2"}>
                    <ArrayAlgorithmComponent/>
                    </div>
                <button className={"button"} id={"createButton"}>Sort</button>
                <button className={"button"} >Reset</button>

            </div>
        </div>
    );
}

export default ArrayNavBar;
