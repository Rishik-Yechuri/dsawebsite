import React from 'react';
import './navbarcss.css';
import DropdownComponent from "./dropdownComponent";


const navbar = () => {

    return (
        <div className={"topBar"}>
            <div className={"halfDiv"} id={"topDiv"}>
                <div className="dropdown" id={"dropdownTop"}>
                    <DropdownComponent></DropdownComponent>
                </div>
            </div>
            <hr className={"divider"}></hr>
            <div className={"halfDiv"} id={"bottomDiv"}>
            </div>
        </div>
    );
}

export default navbar;
