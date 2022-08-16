import React, {useEffect, useMemo, useRef, useState} from 'react';
import "./mazeComponentStyle.css"
import Draggable from "react-draggable";
import startingarrow from "./startingarrow.png";
import targetnode from "./targetnode.png"
import Cookies from 'universal-cookie';


const MazeComponent = ({state, algoState, buttonState, setState}) => {
    let yLocOfStart = 8;
    var lastGoodY;
    var lastGoodX;
    var endLastGoodY;
    var endLastGoodX;
    var mouseDown = 0;
    var draggingItemMode = false;
    var itemBeingDragged = null;
    //var startPointY = 0;
    const [startPointYState, setStartPointYState] = useState(0);
    //var startPointX = 0;
    const [startPointXState, setStartPointXState] = useState(0);
    //var endPointY = 0;
    const [endPointYState, setEndPointYState] = useState(0);
    //var endPointX = 0;
    const [endPointXState, setEndPointXState] = useState(0);
    var arr = JSON.parse(localStorage.getItem("arr"));
    window.addEventListener('mousedown', (event) => {
        if (event.button === 2) {
            mouseDown = 1;
        }
    });
    window.addEventListener('mouseup', (event) => {
        if (event.button === 2) {
            mouseDown = 0;
        }
    });
    localStorage.setItem("arr", JSON.stringify(arr));
    var holdPopups = document.getElementsByClassName("popUpContent");
    document.addEventListener('readystatechange', event => {
        if (event.target.readyState === "complete") {
            popupLoaded();
        }
    });

    var gridSize = state;
    arr = JSON.parse(localStorage.getItem("arr"));
    if (arr !== null) {
        gridSize = arr.length
    } else {
        gridSize = 4;
    }
    let [zoomSize, setZoomSize] = useState({zoomSize: 1});
    var mazeHolderDiv = document.getElementById("mazeHolderDiv");
    var zoom = (event) => {
        mazeHolderDiv = document.getElementById("mazeHolderDiv");
        var zoomSpeed = (-.001) * (5.0 / Math.sqrt(gridSize));
        var tempZoomSize = zoomSize.zoomSize + (event.deltaY * zoomSpeed);
        zoomSize.zoomSize = Math.min(Math.max(.1, tempZoomSize), 1000000)
        mazeHolderDiv.style.transform = `scale(${zoomSize.zoomSize})`;
    }
    useEffect(() => {
        arr = JSON.parse(localStorage.getItem("arr"));
        if (state > 1) {
            createMaze(state)
            //gridSize = state;
        } else {
            //gridSize = arr.length;
            createMaze(gridSize)
        }
    }, [state]);
    useEffect(() => {
    }, [algoState]);
    useEffect(() => {
        if (buttonState > 0) {
            startSearching();
        }
    }, [buttonState]);

    function startSearching() {
        var holdState = algoState.toString();
        if (holdState === "A*") {
            arr = JSON.parse(localStorage.getItem("arr"));
            aStar(arr, JSON.parse(localStorage.getItem("starty")), JSON.parse(localStorage.getItem("startx")), JSON.parse(localStorage.getItem("endy")), JSON.parse(localStorage.getItem("endx")));
            } else {
        }
    }

    class Queue {
        constructor() {
            this.elements = {};
            this.head = 0;
            this.tail = 0;
        }

        enqueue(element) {
            this.elements[this.tail] = element;
            this.tail++;
        }

        dequeue() {
            const item = this.elements[this.head];
            delete this.elements[this.head];
            this.head++;
            return item;
        }

        peek() {
            return this.elements[this.head];
        }

        get length() {
            return this.tail - this.head;
        }

        isEmpty() {
            return this.length === 0;
        }
    }
    const reconstructPath = (start,end,prev) => {
        var path = [];
        var pathPos = 0;
        var keepGoing = true;
        var currThing = end;
        while(keepGoing){
            path[pathPos] = currThing;
            if(prev.get(currThing) === null){
                keepGoing = false;
            }else{
                currThing = prev.get(currThing);
            }
            pathPos++;
        }
        path.reverse();

        if(path[0] === start){
            return path;
        }
        return null;
    }
    const aStar = (grid, startY, startX, finishY, finishX) => {
        var found = false;
        var queue = new Queue();
        var thingToEnqueue = (startY.toString() + "," + startX.toString()).toString();
        queue.enqueue(thingToEnqueue);
        var holdVisited = new Set();
        holdVisited.add(thingToEnqueue);
        var prev = new Map();
        while (!queue.isEmpty()) {
            var node = queue.dequeue();
            var holdNodePos = node.split(",");
            var yPos = holdNodePos[0];
            var xPos = holdNodePos[1];
            var holdDirectionsToGo = []
            var holdDirectionsPos = 0;
            //alert("PointCoords:" + yPos + "," + xPos);
            if(yPos > 0){
                holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos)-1) + "," + xPos;
                holdDirectionsPos++;
            }
            //alert("arrlen:" + arr.length + ",yPos+1:" + (yPos+1));
            if((parseInt(yPos)+1) < arr.length){
                holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos)+1) + "," + xPos;
                holdDirectionsPos++;
            }
            if(xPos > 0){
                holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos)-1);
                holdDirectionsPos++;
            }
            if((parseInt(xPos)+1)<arr.length){
                holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos)+1);
                holdDirectionsPos++;
            }
            //alert("NumOfNeighbors:" + holdDirectionsPos);
           // alert("holdNodePos:" + holdNodePos);
            for(var x=0;x<holdDirectionsPos;x++){
                if(!holdVisited.has(holdDirectionsToGo[x]) && !found){
                    if((finishY+","+finishX)=== holdDirectionsToGo[x]){
                        found = true;
                    }
                    alert("enqueue:" + holdDirectionsToGo[x]);
                    queue.enqueue(holdDirectionsToGo[x]);
                    holdVisited.add(holdDirectionsToGo[x]);
                    alert("Prev Set:" + holdDirectionsToGo + "," + thingToEnqueue);
                    prev.set(holdDirectionsToGo[x],thingToEnqueue);
                }
            }
        }
       // alert("SUPMATE:" + prev.get("1,1"));
       // localStorage.setItem("testing",JSON.stringify(prev));
        var finalPath = reconstructPath((startY+","+startX),(finishY+","+finishX),prev);
        return finalPath;
    };

    function setPointValue(yCoord, xCoord, newVal, dontChange) {
        arr = JSON.parse(localStorage.getItem("arr"));
        var environmentUpdated = true;
        var idName = "innerCell" + yCoord + "X" + xCoord;
        var imgId = "innerCell" + yCoord + "X" + xCoord + "I";
        var innerCell = document.getElementById(idName);
        var innerImg = document.getElementById(imgId);
        innerCell.classList.remove('dragCell');
        innerCell.classList.remove('majorPointCell');
        if (newVal === "END" && arr[yCoord][xCoord] !== "START") {
            //innerCell.style.backgroundColor = "red";
            innerCell.classList.add('majorPointCell');
            innerImg.src = targetnode;
            innerImg.style.display = 'block';
            innerImg.style.width = '65%';
            setEndPointYState(yCoord);
            setEndPointXState(xCoord);
            localStorage.setItem("endy",JSON.stringify(yCoord));
            localStorage.setItem("endx",JSON.stringify(xCoord));
        } else if (newVal === "START") {
            if (arr[yCoord][xCoord] === "END") {
                idName = "innerCell" + lastGoodY + "X" + lastGoodX;
                innerCell = document.getElementById(idName);
                imgId = "innerCell" + lastGoodY + "X" + lastGoodX + "I";
                innerImg = document.getElementById(imgId);
            }
            innerCell.classList.add('majorPointCell');
            innerImg.src = startingarrow;
            innerImg.style.display = 'block';
            innerImg.style.width = '60%';
            setStartPointYState(yCoord);
            setStartPointXState(xCoord);
            localStorage.setItem("starty",JSON.stringify(yCoord));
            localStorage.setItem("startx",JSON.stringify(xCoord));
        } else if (arr[yCoord][xCoord] !== "END" && arr[yCoord][xCoord] !== "START" || newVal === "EMPTY") {
            innerImg.style.display = 'none';
            if (newVal === "WALL") {
                if (arr[yCoord][xCoord] === "WALL" && !dontChange) {
                    innerCell.classList.remove('wallCell');
                    arr[yCoord][xCoord] = "EMPTY";
                    environmentUpdated = false;
                } else {
                    innerCell.classList.add('wallCell');
                }
            } else if (newVal === "PATH") {
                innerCell.style.backgroundColor = "yellow";
            } else if (newVal === "FINALPATH") {
                innerCell.style.backgroundColor = "lawngreen";
            } else {
                innerImg.style.display = 'none';
            }
        } else {
            environmentUpdated = false;
        }
        if (environmentUpdated) {
            arr[yCoord][xCoord] = newVal;
        }
        localStorage.setItem("arr", JSON.stringify(arr));
    }

    function getPointValue(yCoord, xCoord) {
        arr = JSON.parse(localStorage.getItem("arr"));
        return arr[yCoord][xCoord];
    }

    function popupLoaded() {
        if (localStorage.getItem("popupclosed") !== "yes") {
            document.getElementById("initialPopup").style.display = "block";
        }
    }

    function closeButtonClicked() {
        for (var x = 0; x < holdPopups.length; x++) {
            holdPopups[x].style.display = "none";
        }
        localStorage.setItem("popupclosed", "yes");
    }

    function changeTile(ev) {
        var holdLoc = ev.target.id.replaceAll("I", "").split('innerCell')[1].split('X');
        setPointValue(holdLoc[0], holdLoc[1], "WALL");
    }

    function createMaze(length) {
        var arrayDiffSize = false;
        arr = JSON.parse(localStorage.getItem("arr"));
        if (arr == null || length !== arr.length) {
            arrayDiffSize = true;
            localStorage.setItem("mainpoints", JSON.stringify(false));
            var newArr = new Array(length);
            for (var i = 0; i < length; i++) {
                var arrayToInsert = new Array(length);
                for (var q = 0; q < length; q++) {
                    arrayToInsert[q] = "EMPTY";
                }
                newArr[i] = arrayToInsert;
            }
            localStorage.setItem("arr", JSON.stringify(newArr));
            arr = JSON.parse(localStorage.getItem("arr"));
        }
        if (length <= 1) {
            return;
        }
        gridSize = length;
         yLocOfStart = 0;
        if (length > 0) {
            yLocOfStart = parseInt(length / 2, 10);
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
                insideElement.onmouseenter = (ev) => {
                    if (mouseDown === 1) {
                        var thingClicked = ev.target.id.replaceAll("I", "");
                        var thing = document.getElementById(thingClicked);
                        if (draggingItemMode) {
                            thing.classList.remove('wallCell');
                            var holdLoc = ev.target.id.replaceAll("I", "").split('innerCell')[1].split('X');
                            var imgId;
                            if ((arr[holdLoc[0]][holdLoc[1]] === "START" || arr[holdLoc[0]][holdLoc[1]] === "END")) {
                                holdLoc[0] = lastGoodY;
                                holdLoc[1] = lastGoodX;
                            } else {
                                ev.target.classList.add('dragCell');
                            }
                            imgId = "innerCell" + holdLoc[0] + "X" + holdLoc[1] + "I";
                            var innerImg = document.getElementById(imgId);
                            if (itemBeingDragged === "START") {
                                innerImg.src = startingarrow;
                                innerImg.style.width = '60%';
                            } else if (itemBeingDragged === "END") {
                                innerImg.src = targetnode;
                                innerImg.style.width = '65%';
                            }
                            innerImg.style.display = 'block';
                        } else {
                            changeTile(ev)
                        }
                    }
                    localStorage.setItem("arr", JSON.stringify(arr));
                }
                insideElement.onmouseleave = (ev) => {
                    if (mouseDown === 1) {
                        if (draggingItemMode) {
                            var holdLoc = ev.target.id.replaceAll("I", "").split('innerCell')[1].split('X');
                            if ((itemBeingDragged === "START" && arr[holdLoc[0]][holdLoc[1]] !== "END") || (itemBeingDragged === "END" && arr[holdLoc[0]][holdLoc[1]] !== "START")) {
                                if (arr[holdLoc[0]][holdLoc[1]] === "START" || arr[holdLoc[0]][holdLoc[1]] === "END") {
                                    setPointValue(holdLoc[0], holdLoc[1], "EMPTY");
                                } else {
                                    setPointValue(holdLoc[0], holdLoc[1], arr[holdLoc[0]][holdLoc[1]], true);
                                }
                                lastGoodY = holdLoc[0];
                                lastGoodX = holdLoc[1];
                            } else {
                                setPointValue(lastGoodY, lastGoodX, arr[lastGoodY][lastGoodX], true);
                            }
                        }
                    }
                    localStorage.setItem("arr", JSON.stringify(arr));
                }
                insideElement.onmousedown = e => {
                    if (e.button === 2) {
                        var thingClicked = e.target.id.replaceAll("I", "");
                        var thing = document.getElementById(thingClicked);
                        var holdLoc = e.target.id.replaceAll("I", "").split('innerCell')[1].split('X');
                        if (arr[holdLoc[0]][holdLoc[1]] === "START" || arr[holdLoc[0]][holdLoc[1]] === "END") {
                            draggingItemMode = true;
                            thing.classList.add('dragCell');
                            if (arr[holdLoc[0]][holdLoc[1]] === "START") {
                                itemBeingDragged = "START";
                            } else if (arr[holdLoc[0]][holdLoc[1]]) {
                                itemBeingDragged = "END";
                            }
                        } else {
                            changeTile(e);
                        }
                    }
                    localStorage.setItem("arr", JSON.stringify(arr));
                }
                insideElement.onmouseup = e => {
                    if (e.button === 2) {
                        var thingClicked = e.target.id.replaceAll("I", "");
                        var thing = document.getElementById(thingClicked);
                        if (draggingItemMode) {
                            var holdLoc = e.target.id.replaceAll("I", "").split('innerCell')[1].split('X');
                            if ((arr[holdLoc[0]][holdLoc[1]] === "START" || arr[holdLoc[0]][holdLoc[1]] === "END")) {
                                if (lastGoodY === undefined || lastGoodX === undefined) {
                                    if (arr[holdLoc[0]][holdLoc[1]] === "START") {
                                        holdLoc[0] = yLocOfStart;
                                        holdLoc[1] = 0;
                                    } else if (arr[holdLoc[0]][holdLoc[1]] === "END") {
                                        holdLoc[0] = yLocOfStart;
                                        holdLoc[1] = arr.length - 2;
                                    }
                                } else {
                                    holdLoc[0] = lastGoodY;
                                    holdLoc[1] = lastGoodX;
                                }
                            }
                            if (itemBeingDragged === "START") {
                                setPointValue(holdLoc[0], holdLoc[1], "START");
                            } else if (itemBeingDragged === "END") {
                                setPointValue(holdLoc[0], holdLoc[1], "END");
                            }
                            itemBeingDragged = "";
                            draggingItemMode = false;
                            thing.classList.remove('dragCell');
                        }
                    }
                }
                var insideImg = document.createElement("img");
                insideImg.style.width = '80%';
                insideImg.style.position = 'center';
                insideImg.id = "innerCell" + y + "X" + x + "I";
                insideImg.style.display = 'none';
                insideImg.src = startingarrow;
                insideElement.appendChild(insideImg);
                element.appendChild(insideElement);
            }
            document.getElementById("mazeHolderDiv").appendChild(element);
        }
        localStorage.setItem("arr", JSON.stringify(arr));
        if (!arrayDiffSize) {
            for (y = 0; y < length; y++) {
                for (x = 0; x < length; x++) {
                    setPointValue(y, x, arr[y][x], true);
                }
            }
        } else {
            for (y = 0; y < length; y++) {
                for (x = 0; x < length; x++) {
                    setPointValue(y, x, "EMPTY");
                }

            }
        }
        var mainPointsExist = localStorage.getItem("mainpoints") === 'true';
        if (length > 1 && !mainPointsExist) {
            setPointValue(yLocOfStart, 0, "START");
            setStartPointYState(yLocOfStart); //= yLocOfStart;
            setStartPointXState(0);
            var xLocOfEnd = length - 2;
            if (length < 3) {
                xLocOfEnd = length - 1;
            }
            setEndPointYState(yLocOfStart);
            setEndPointXState(xLocOfEnd);
            localStorage.setItem("starty",yLocOfStart);
            localStorage.setItem("startx",JSON.stringify(0));
            localStorage.setItem("endy",yLocOfStart);
            localStorage.setItem("endx",xLocOfEnd);
            setPointValue(yLocOfStart, xLocOfEnd, "END");
            localStorage.setItem("mainpoints", JSON.stringify(true));
        }/*else if(length > 1){
            setStartPointYState(yLocOfStart); //= yLocOfStart;
            setStartPointXState(0);
            setEndPointYState(yLocOfStart);
            setEndPointXState(xLocOfEnd);
        }*/
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