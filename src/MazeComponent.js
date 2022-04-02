import React, {useEffect} from 'react';
import "./mazeComponentStyle.css"
import {getClosestBody} from "react-use/lib/useLockBodyScroll";

const MazeComponent = ({state}) => {

    /* for (var y = 0; y < 6; y++) {
         var element = document.createElement("div");
         element.id = "wideDiv" + y;
         for (var x = 0; x < 6; x++) {
             var insideElement = document.createElement("div");
             insideElement.id = "innerCell" + x;
             insideElement.className = "innerCell";
             element.appendChild(insideElement);
         }
         document.getElementById("mazeTopDiv").appendChild(element);

     }*/
    useEffect(() => {
        createMaze(state);
    }, [state]);

    function createMaze(length) {
        const parent = document.getElementById("mazeHolderDiv");
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
        for (var y = 0; y < length; y++) {
            var element = document.createElement("div");
            element.id = "wideDiv" + y;
            element.className = "wideDiv";
            for (var x = 0; x < length; x++) {
                var insideElement = document.createElement("div");
                insideElement.id = "innerCell" + x;
                insideElement.className = "innerCell";
                element.appendChild(insideElement);
            }
            document.getElementById("mazeHolderDiv").appendChild(element);

        }
    }

    return (
        <div id={"mazeTopDiv"}>
            <div id={"mazeHolderDiv"}>

            </div>
        </div>
    );
}

export default MazeComponent;
