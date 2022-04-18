import React, {useEffect, useRef, useState} from 'react';
import "./mazeComponentStyle.css"
import Draggable from "react-draggable";
import startingarrow from "./startingarrow.png";
import targetnode from "./targetnode.png"

const MazeComponent = ({state}) => {
    var mouseDown = 0;
    window.addEventListener('mousedown', (event) => {
        if(event.button === 2){
            mouseDown = 1;
        }
    });
    window.addEventListener('mouseup', (event) => {
        if(event.button === 2){
            mouseDown = 0;
        }
    });
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

    function setPointValue(yCoord, xCoord, newVal) {
        arr[yCoord][xCoord] = newVal;
        var idName = "innerCell" + yCoord + "X" + xCoord;
        var imgId = "innerCell" + yCoord + "X" + xCoord + "I";
        var innerCell = document.getElementById(idName);
        var innerImg = document.getElementById(imgId);
        arr[yCoord][xCoord] = newVal;
        if (newVal === "END") {
            innerCell.style.backgroundColor = "red";
            innerImg.src = targetnode;
            innerImg.style.display = 'block';
        } else if (newVal === "START") {
            innerCell.style.backgroundColor = "red";
            innerImg.src = startingarrow;
            innerImg.style.display = 'block';
        } else if (newVal === "WALL") {
            innerCell.style.backgroundColor = "#000000";
        } else if (newVal === "PATH") {
            innerCell.style.backgroundColor = "yellow";
        } else if (newVal === "FINALPATH") {
            innerCell.style.backgroundColor = "lawngreen";
        }else{
            innerCell.style.backgroundColor = "red";
            innerImg.style.display = 'none';
        }
    }
    function getPointValue(yCoord,xCoord){
        return arr[yCoord][xCoord];
    }
    function popupLoaded() {
        if (localStorage.getItem("popupclosed") !== "yes") {
            document.getElementById("initialPopup").style.display = "block";
        }
        setPointValue(0, 0, "FINALPATH");
    }

    function closeButtonClicked() {
        for (var x = 0; x < holdPopups.length; x++) {
            holdPopups[x].style.display = "none";
        }
        localStorage.setItem("popupclosed", "yes");
    }
    function changeTile(ev){
        var holdLoc = ev.target.id.split('innerCell')[1].split('X');
        setPointValue(holdLoc[0],holdLoc[1],"WALL");
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
                insideElement.id = "innerCell" + y + "X" + x;
                insideElement.className = "innerCell";
                insideElement.onmouseenter  = (ev) => {
                  if(mouseDown === 1){
                      changeTile(ev)
                      /*var holdLoc = ev.target.id.split('innerCell')[1].split('X');
                      setPointValue(holdLoc[0],holdLoc[1],"FINALPATH");
                      //alert("DOWN");*/
                  }
                }
                insideElement.onmousedown = e =>{
                    if(e.button === 2){
                        changeTile(e);
                    }
                }
                var insideImg = document.createElement("img");
                insideImg.style.width = '80%';
                insideImg.style.position = 'center';
                insideImg.id = "innerCell" + y + "X" + x + "I";
                insideImg.style.display = 'none';
                //insideImg.style.height = '100%';
                insideImg.src = startingarrow;
                insideElement.appendChild(insideImg);
                element.appendChild(insideElement);
            }
            document.getElementById("mazeHolderDiv").appendChild(element);
        }
    }
    var rejectModernity = (event) => {
        event.preventDefault();
        return false;
    }
    return (
        <div id={"mazeTopDiv"} onWheel={zoom}>
            <Draggable oncontextmenu={rejectModernity}>
                <div id={"wrapperDiv"} onContextMenu={rejectModernity}>
                    <div id={"mazeHolderDiv"} onContextMenu={rejectModernity}>
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
