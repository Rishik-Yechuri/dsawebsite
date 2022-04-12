import React, {useEffect, useRef, useState} from 'react';
import "./mazeComponentStyle.css"
import Draggable from "react-draggable";

const MazeComponent = ({state}) => {
    var arr = new Array(4); // create an empty array of length n
    var holdPopups = document.getElementsByClassName("popUpContent");
    document.addEventListener('readystatechange', event => {
        if (event.target.readyState === "complete") {
            popupLoaded();
        }
    });
    var gridSize = state;
    let [zoomSize, setZoomSize] = useState({zoomSize: 1});
    var mazeHolderDiv = document.getElementById("mazeHolderDiv");
    var zoom = (event) => {
        //event.preventDefault();
        mazeHolderDiv = document.getElementById("mazeHolderDiv");
        var zoomSpeed = (-.001) * (5.0 / Math.sqrt(gridSize));
        var tempZoomSize = zoomSize.zoomSize + (event.deltaY * zoomSpeed);
        zoomSize.zoomSize = Math.min(Math.max(.125, tempZoomSize), 1000000)
        mazeHolderDiv.style.transform = `scale(${zoomSize.zoomSize})`;
    }
    useEffect(() => {
        createMaze(state);
    }, [state]);
    function setPointValue(yCoord,xCoord,newVal){
        arr[yCoord][xCoord] = newVal;
        var idName = "innerCell" + yCoord + "X" + xCoord;
        var innerCell = document.getElementById(idName);
        if(newVal === "WALL"){
            innerCell.style.backgroundColor = "#FFFFFF";
        }else if(newVal === "END"){

        }else if(newVal === "START"){
            //innerCell.style.backgroundColor = "#FFFFFF";
        }else if(newVal === "WALL"){
            innerCell.style.backgroundColor = "#FFFFFF";
        }else if(newVal === "PATH"){
            innerCell.style.backgroundColor = "#FFFFFF";
        }else if(newVal === "FINALPATH"){
            innerCell.style.backgroundColor = "#FFFFFF";
        }
    }
    function popupLoaded() {
        if (localStorage.getItem("popupclosed") !== "yes") {
            document.getElementById("initialPopup").style.display = "block";
        }
        setPointValue(0,0,"WALL");
    }

    function closeButtonClicked() {
        for (var x = 0; x < holdPopups.length; x++) {
            holdPopups[x].style.display = "none";
        }
        localStorage.setItem("popupclosed", "yes");
    }

    function createMaze(length) {
        gridSize = length;
        arr = new Array(length);
        for (var i = 0; i < length; i++) {
            arr[i] = new Array(length);
        }
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
                insideElement.id = "innerCell" + y + "X"+ x;
                insideElement.className = "innerCell";
                element.appendChild(insideElement);
            }
            document.getElementById("mazeHolderDiv").appendChild(element);
        }
    }

    return (
        <div id={"mazeTopDiv"} onWheel={zoom}>
            <Draggable>
                <div id={"wrapperDiv"}>
                    <div id={"mazeHolderDiv"}>
                    </div>
                </div>
            </Draggable>

            <div className={"popUpContent"} id={"initialPopup"}>
                <div id={"popUpInner"}>
                    <text className={"popUpText"}>Left clicking a empty square will place a wall. The Starting Node and
                        Target Node can be dragged around.
                    </text>
                </div>
                <div id={"lowerPopUpDiv"}>
                    <button id={"closeButton"} onClick={closeButtonClicked}>Ok</button>
                </div>
            </div>
        </div>
    );
}

export default MazeComponent;
