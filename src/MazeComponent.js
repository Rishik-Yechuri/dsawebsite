import React, {useEffect, useMemo, useRef, useState} from 'react';
import "./mazeComponentStyle.css"
import Draggable from "react-draggable";
import startingarrow from "./startingarrow.png";
import targetnode from "./targetnode.png"
import Cookies from 'universal-cookie';


const MazeComponent = ({state, algoState, buttonState, setState, resetState}) => {
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
    //localStorage.setItem("searching", "false");
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
        } else {
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

    useEffect(() => {
        if (resetState > 0) {
            resetMaze(false);
        }
    }, [resetState]);

    async function drawPath(path) {
        var sizeOfPath = path.length;
        for (var x = 0; x < sizeOfPath; x++) {
            await new Promise(done => setTimeout(() => done(), 200));
            var holdCoords = path[x].split(",");
            var idName = "innerCell" + holdCoords[0] + "X" + holdCoords[1];
            var thingToEdit = document.getElementById(idName);
            //thingToEdit.style.backgroundColor = "green";
            thingToEdit.classList.remove('searchedPathCell');
            thingToEdit.classList.remove('biPathCell');
            thingToEdit.classList.add('finalPathCell');
        }
        localStorage.setItem("searching", "false");
    }

    function delay(n) {
        n = n || 2000;
        return new Promise(done => {
            setTimeout(() => {
                done();
            }, n);
        });
    }

    function pause() {
    }

    async function startSearching() {
        if (localStorage.getItem("searching") !== "true") {
            resetMaze(true);

            localStorage.setItem("searching", "true");
            //alert("SETTO:" + localStorage.getItem("searching"));
            arr = JSON.parse(localStorage.getItem("arr"));
            var holdState = algoState.toString();
            if (holdState === "A*") {
                arr = JSON.parse(localStorage.getItem("arr"));
                const path = await aStar(arr, JSON.parse(localStorage.getItem("starty")), JSON.parse(localStorage.getItem("startx")), JSON.parse(localStorage.getItem("endy")), JSON.parse(localStorage.getItem("endx")));
                await drawPath(path);
            } else if (holdState === "Breadth First") {
                const path = await BFS(arr, JSON.parse(localStorage.getItem("starty")), JSON.parse(localStorage.getItem("startx")), JSON.parse(localStorage.getItem("endy")), JSON.parse(localStorage.getItem("endx")));
                await drawPath(path);
            } else if (holdState === "Depth First") {
                var set = new Set();
                var arrForFinish = [false];
                const path = await DFSCaller(arr, JSON.parse(localStorage.getItem("starty")), JSON.parse(localStorage.getItem("startx")), JSON.parse(localStorage.getItem("endy")), JSON.parse(localStorage.getItem("endx")), new Map(), arr.length, set, arrForFinish, undefined);
                //return reconstructPath((startY + "," + startX), (finishY + "," + finishX), prev);
                await drawPath(path);
            } else if (holdState === "Bidirectional") {
                const path = await BiBFS(arr, JSON.parse(localStorage.getItem("starty")), JSON.parse(localStorage.getItem("startx")), JSON.parse(localStorage.getItem("endy")), JSON.parse(localStorage.getItem("endx")));
                await drawPath(path);
            }
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

    function reconstructPath(start, end, prev) {
        var path = [];
        var pathPos = 0;
        var keepGoing = true;
        var currThing = end;
        while (keepGoing) {
            path[pathPos] = currThing;
            if (prev.get(currThing) === undefined) {
                keepGoing = false;
            } else {
                currThing = prev.get(currThing);
            }
            pathPos++;
        }
        path.reverse();
        if (path[0] === start) {
            return path;
        }
        return null;
    }

    function sortedIndex(array, value) {
        var low = 0,
            high = array.length;
        while (low < high) {
            var mid = (low + high) >>> 1;
            if (array[mid][0] < value) low = mid + 1;
            else high = mid;
        }
        return low;
    }

    function binarySearch(sortedArray, key) {
        let start = 0;
        let end = sortedArray.length - 1;

        while (start <= end) {
            let middle = Math.floor((start + end) / 2);

            if (sortedArray[middle][0] === key) {
                // found the key
                return middle;
            } else if (sortedArray[middle] < key) {
                // continue searching to the right
                start = middle + 1;
            } else {
                // search searching to the left
                end = middle - 1;
            }
        }
        // key wasn't found
        return -1;
    }

    async function DFSCaller(grid, currY, currX, finishY, finishX, pathArray, arrLen, visitedNodes, finished, parentNode) {
        var pathArray = await DFS(grid, currY, currX, finishY, finishX, pathArray, arrLen, visitedNodes, finished, parentNode);
        return reconstructPath((currY + "," + currX), (finishY + "," + finishX), pathArray);

    }

    async function DFS(grid, currY, currX, finishY, finishX, pathArray, arrLen, visitedNodes, finished, parentNode) {
        if (!finished[0]) {
            var shortestPath = pathArray;
            var shortestLen = Number.MAX_VALUE;
            var currNode = currY + "," + currX;
            pathArray.set(currNode, parentNode);
            if (parseInt(finishY) === parseInt(currY) && parseInt(finishX) === parseInt(currX)) {
                finished[0] = true;
            }
            visitedNodes.add(currNode);
            await new Promise(done => setTimeout(() => done(), 200));
            var idName = "innerCell" + currY + "X" + currX;
            var thingToEdit = document.getElementById(idName);
            //thingToEdit.style.backgroundColor = "yellow";
            thingToEdit.classList.add('searchedPathCell');
            var childNodes = new Array();

            if (!visitedNodes.has((parseInt(currY) - 1) + "," + currX) && parseInt(currY) - 1 >= 0) {
                childNodes.push((parseInt(currY) - 1) + "," + currX);
            }
            if (!visitedNodes.has(currY + "," + (parseInt(currX) + 1)) && (parseInt(currX) + 1) < arrLen) {
                childNodes.push(currY + "," + (parseInt(currX) + 1));
            }
            if (!visitedNodes.has((parseInt(currY) + 1) + "," + currX) && (parseInt(currY) + 1) < arrLen) {
                childNodes.push((parseInt(currY) + 1) + "," + currX);
            }
            if (!visitedNodes.has(currY + "," + (parseInt(currX) - 1)) && (parseInt(currX) - 1) >= 0) {
                childNodes.push(currY + "," + (parseInt(currX) - 1));
            }
            var lenOfChildren = childNodes.length;
            if (!finished[0]) {
                for (var i = 0; i < lenOfChildren; i++) {
                    if (await getPointValue(childNodes[i].split(",")[0], childNodes[i].split(",")[1]) !== "WALL") {
                        var checkIfContains = pathArray.get(childNodes[i]);
                        var tempPath = await DFS(grid, childNodes[i].split(",")[0], childNodes[i].split(",")[1], finishY, finishX, pathArray, arrLen, visitedNodes, finished, currNode);
                    }
                }
            }
        }
        return pathArray;
    }

    async function BiBFS(grid, startY, startX, finishY, finishX) {
        var connectY;
        var connectX;
        var prevFromStart = new Map();
        var prevFromEnd = new Map();
        var connected = false;
        var holdVisitedStart = new Set();
        var holdVisitedEnd = new Set();
        var queueStart = new Queue();
        var queueEnd = new Queue();
        queueStart.enqueue(startY + "," + startX);
        queueEnd.enqueue(finishY + "," + finishX);
        while ((!queueStart.isEmpty() || !queueEnd.isEmpty()) && !connected) {
            var startNode = undefined;//queueStart.dequeue();
            var keepLooking = true;
            while (keepLooking) {
                startNode = queueStart.dequeue();
                if ((!holdVisitedStart.has(startNode) && !connected) || startNode === undefined) {
                    keepLooking = false;
                }
            }
            if (!holdVisitedStart.has(startNode) && !connected) {
                // alert("front thing");
                await new Promise(done => setTimeout(() => done(), 100));
                holdVisitedStart.add(startNode);
                var splitCoords = startNode.split(",");
                var holdDirectionsToGo = [];
                var holdDirectionsPos = 0;

                var idName = "innerCell" + splitCoords[0] + "X" + splitCoords[1];
                var thingToEdit = document.getElementById(idName);
                //thingToEdit.style.backgroundColor = "yellow";
                thingToEdit.classList.add('searchedPathCell');
                var yPos = splitCoords[0];
                var xPos = splitCoords[1];
                if (yPos > 0) {
                    holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos) - 1) + "," + xPos;
                    holdDirectionsPos++;
                }
                if ((parseInt(xPos) + 1) < arr.length) {
                    holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos) + 1);
                    holdDirectionsPos++;
                }
                if ((parseInt(yPos) + 1) < arr.length) {
                    holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos) + 1) + "," + xPos;
                    holdDirectionsPos++;
                }
                if (xPos > 0) {
                    holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos) - 1);
                    holdDirectionsPos++;
                }
                for (var i = 0; i < holdDirectionsPos; i++) {
                    var childSplitCoords = holdDirectionsToGo[i].split(",");
                    if (await getPointValue(childSplitCoords[0], childSplitCoords[1]) !== "WALL" && !holdVisitedStart.has(holdDirectionsToGo[i])) {
                        var childToEnqueue = (childSplitCoords[0].toString() + "," + childSplitCoords[1].toString()).toString();
                        queueStart.enqueue(childToEnqueue);
                        prevFromStart.set(childToEnqueue, startNode);
                    }
                }
                if (holdVisitedEnd.has(startNode)) {
                    connected = true;
                    connectY = yPos;
                    connectX = xPos;
                }
            }
            var endNode = undefined;//queueEnd.dequeue();
            keepLooking = true;
            while (keepLooking) {
                endNode = queueEnd.dequeue();
                if ((!holdVisitedEnd.has(endNode) && !connected) || endNode === undefined) {
                    keepLooking = false;
                }
            }
            if (!holdVisitedEnd.has(endNode) && !connected) {
                //alert("end thing");
                await new Promise(done => setTimeout(() => done(), 100));
                holdVisitedEnd.add(endNode);
                var splitCoords = endNode.split(",");
                var holdDirectionsToGo = [];
                var holdDirectionsPos = 0;

                var idName = "innerCell" + splitCoords[0] + "X" + splitCoords[1];
                var thingToEdit = document.getElementById(idName);
                //thingToEdit.style.backgroundColor = "blue";
                thingToEdit.classList.add('biPathCell');
                var yPos = splitCoords[0];
                var xPos = splitCoords[1];
                if (yPos > 0) {
                    holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos) - 1) + "," + xPos;
                    holdDirectionsPos++;
                }
                if ((parseInt(xPos) + 1) < arr.length) {
                    holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos) + 1);
                    holdDirectionsPos++;
                }
                if ((parseInt(yPos) + 1) < arr.length) {
                    holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos) + 1) + "," + xPos;
                    holdDirectionsPos++;
                }
                if (xPos > 0) {
                    holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos) - 1);
                    holdDirectionsPos++;
                }
                for (var i = 0; i < holdDirectionsPos; i++) {
                    var childSplitCoords = holdDirectionsToGo[i].split(",");
                    if (await getPointValue(childSplitCoords[0], childSplitCoords[1]) !== "WALL" && !holdVisitedEnd.has(holdDirectionsToGo[i])) {
                        var childToEnqueue = (childSplitCoords[0].toString() + "," + childSplitCoords[1].toString()).toString();
                        queueEnd.enqueue(childToEnqueue);
                        prevFromEnd.set(childToEnqueue, endNode);
                    }
                }
                if (holdVisitedStart.has(endNode)) {
                    connected = true;
                    connectY = yPos;
                    connectX = xPos;
                }
            }
        }
        var path = reconstructPath(startY + "," + startX, connectY + "," + connectX, prevFromStart);
        var secondPiecePath = [];
        var posInSecondPath = 0;
        var keepGoing = true;
        var currThing = connectY + "," + connectX;
        while (keepGoing) {
            currThing = prevFromEnd.get(currThing);
            if (currThing === undefined) {
                keepGoing = false;
            } else {
                secondPiecePath[posInSecondPath] = currThing;
                posInSecondPath++;
            }
        }
        //var secondPath = [];

        var lengthOfFirstPath = path.length;
        var lengthOfSecondPath = posInSecondPath;
        var finalPath = [];
        var posInFinalPath = 0;
        for (var a = 0; a < lengthOfFirstPath; a++) {
            finalPath[posInFinalPath] = path[a];
            posInFinalPath++;
        }
        for (var b = 0; b < lengthOfSecondPath; b++) {
            finalPath[posInFinalPath] = secondPiecePath[b];
            posInFinalPath++;
        }
        return finalPath;
    }

    async function BFS(grid, startY, startX, finishY, finishX) {
        var prev = new Map();
        var found = false;
        var holdVisited = new Set();
        var queue = new Queue();
        queue.enqueue(startY + "," + startX);
        while (!queue.isEmpty()) {
            var node = queue.dequeue();
            if (!holdVisited.has(node) && !found) {
                await new Promise(done => setTimeout(() => done(), 100));
                holdVisited.add(node);
                var splitCoords = node.split(",");
                var holdDirectionsToGo = [];
                var holdDirectionsPos = 0;
                if (node === finishY + "," + finishX) {
                    found = true;
                }
                var idName = "innerCell" + splitCoords[0] + "X" + splitCoords[1];
                var thingToEdit = document.getElementById(idName);
                //thingToEdit.style.backgroundColor = "yellow";
                thingToEdit.classList.add('searchedPathCell');
                var yPos = splitCoords[0];
                var xPos = splitCoords[1];
                if (yPos > 0) {
                    holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos) - 1) + "," + xPos;
                    holdDirectionsPos++;
                }
                if ((parseInt(xPos) + 1) < arr.length) {
                    holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos) + 1);
                    holdDirectionsPos++;
                }
                if ((parseInt(yPos) + 1) < arr.length) {
                    holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos) + 1) + "," + xPos;
                    holdDirectionsPos++;
                }
                if (xPos > 0) {
                    holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos) - 1);
                    holdDirectionsPos++;
                }
                for (var i = 0; i < holdDirectionsPos; i++) {
                    var childSplitCoords = holdDirectionsToGo[i].split(",");
                    if (await getPointValue(childSplitCoords[0], childSplitCoords[1]) !== "WALL" && !holdVisited.has(holdDirectionsToGo[i])) {
                        var childToEnqueue = (childSplitCoords[0].toString() + "," + childSplitCoords[1].toString()).toString();
                        queue.enqueue(childToEnqueue);
                        prev.set(childToEnqueue, node);
                    }
                }
            }
        }
        return reconstructPath((startY + "," + startX), (finishY + "," + finishX), prev);
    }

    async function aStar(grid, startY, startX, finishY, finishX) {
        var holdDistFromStartNode = new Map();
        var holdDistFromEndNode = new Map();
        var endFound = false;
        var yPosOfEnd = JSON.parse(localStorage.getItem("endy"));
        var xPosOfEnd = JSON.parse(localStorage.getItem("endx"));
        var found = false;
        var queue = [];
        var thingToEnqueue = (startY.toString() + "," + startX.toString()).toString();
        var distVal = (Math.abs(yPosOfEnd - startY) + Math.abs(xPosOfEnd - startX));
        holdDistFromStartNode.set(thingToEnqueue, 0);
        holdDistFromEndNode.set(thingToEnqueue, distVal);
        var arrayToQueue = [];
        arrayToQueue[0] = distVal;
        arrayToQueue[1] = thingToEnqueue;
        queue.push(arrayToQueue);
        var holdVisited = new Set();
        var prev = new Map();
        while (queue.length && !endFound) {
            var node = queue.shift();
            if (!holdVisited.has(node[1])) {
                await new Promise(done => setTimeout(() => done(), 100));
                var holdNodePos = node[1].split(",");
                var yPos = holdNodePos[0];
                var xPos = holdNodePos[1];
                if (node[1] === finishY + ',' + finishX) {
                    endFound = true;
                }
                var holdDirectionsToGo = [];
                var holdDirectionsPos = 0;
                //Draw node on grid
                var idName = "innerCell" + holdNodePos[0] + "X" + holdNodePos[1];
                var thingToEdit = document.getElementById(idName);
                thingToEnqueue = yPos + "," + xPos;
                holdVisited.add(thingToEnqueue);
                //thingToEdit.style.backgroundColor = "yellow";
                thingToEdit.classList.add('searchedPathCell');
                if (yPos > 0) {
                    holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos) - 1) + "," + xPos;
                    holdDirectionsPos++;
                }
                if ((parseInt(xPos) + 1) < arr.length) {
                    holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos) + 1);
                    holdDirectionsPos++;
                }
                if ((parseInt(yPos) + 1) < arr.length) {
                    holdDirectionsToGo[holdDirectionsPos] = (parseInt(yPos) + 1) + "," + xPos;
                    holdDirectionsPos++;
                }
                if (xPos > 0) {
                    holdDirectionsToGo[holdDirectionsPos] = yPos + "," + (parseInt(xPos) - 1);
                    holdDirectionsPos++;
                }

                for (var i = 0; i < holdDirectionsPos; i++) {
                    var isWall = false;
                    var splitCoords = holdDirectionsToGo[i].split(",");
                    if (await getPointValue(splitCoords[0], splitCoords[1]) === "WALL") {
                        isWall = true;
                    }
                    thingToEnqueue = (splitCoords[0].toString() + "," + splitCoords[1].toString()).toString();
                    if (!isWall) {
                        distVal = (Math.abs(yPosOfEnd - splitCoords[0]) + Math.abs(xPosOfEnd - splitCoords[1]));
                        var betterValue = false;
                        var lastDistFromStart = holdDistFromStartNode.get(thingToEnqueue);
                        if (lastDistFromStart === undefined || holdDistFromStartNode.get(node[1]) + 1 < lastDistFromStart) {
                            lastDistFromStart = holdDistFromStartNode.get(node[1]) + 1;
                            prev.set(thingToEnqueue, node[1]);
                            betterValue = true;
                        }

                        holdDistFromStartNode.set(thingToEnqueue, lastDistFromStart);
                        holdDistFromEndNode.set(thingToEnqueue, distVal);
                        var locationInQueue = sortedIndex(queue, distVal + lastDistFromStart);
                        var newArrayToQueue = [];
                        newArrayToQueue[0] = distVal + lastDistFromStart;
                        newArrayToQueue[1] = thingToEnqueue;
                        queue.splice(locationInQueue, 0, newArrayToQueue);
                    }
                }
            }
        }
        return reconstructPath((startY + "," + startX), (finishY + "," + finishX), prev);
    }

    function setPointValue(yCoord, xCoord, newVal, dontChange) {
        // alert("HOW");
        arr = JSON.parse(localStorage.getItem("arr"));
        var environmentUpdated = true;
        var idName = "innerCell" + yCoord + "X" + xCoord;
        var imgId = "innerCell" + yCoord + "X" + xCoord + "I";
        var innerCell = document.getElementById(idName);
        var innerImg = document.getElementById(imgId);
        innerCell.classList.remove('dragCell');
        innerCell.classList.remove('majorPointCell');
        var containsPath = (innerCell.classList.contains("searchedPathCell") || innerCell.classList.contains("finalPathCell") || innerCell.classList.contains("biPathCell"));
        if (newVal === "END" && arr[yCoord][xCoord] !== "START") {
            if (containsPath) {
                resetMaze(true);
            }
            //innerCell.style.backgroundColor = "red";
            innerCell.classList.add('majorPointCell');
            innerImg.src = targetnode;
            innerImg.style.display = 'block';
            innerImg.style.width = '65%';
            setEndPointYState(yCoord);
            setEndPointXState(xCoord);
            localStorage.setItem("endy", JSON.stringify(yCoord));
            localStorage.setItem("endx", JSON.stringify(xCoord));
        } else if (newVal === "START") {
            if (arr[yCoord][xCoord] === "END") {
                idName = "innerCell" + lastGoodY + "X" + lastGoodX;
                innerCell = document.getElementById(idName);
                imgId = "innerCell" + lastGoodY + "X" + lastGoodX + "I";
                innerImg = document.getElementById(imgId);
            }
            if (containsPath) {
                resetMaze(true);
            }
            innerCell.classList.add('majorPointCell');
            innerImg.src = startingarrow;
            innerImg.style.display = 'block';
            innerImg.style.width = '60%';
            setStartPointYState(yCoord);
            setStartPointXState(xCoord);
            localStorage.setItem("starty", JSON.stringify(yCoord));
            localStorage.setItem("startx", JSON.stringify(xCoord));
        } else if ((arr[yCoord][xCoord] !== "END" && arr[yCoord][xCoord] !== "START") || newVal === "EMPTY") {
            innerImg.style.display = 'none';
            innerCell.classList.remove('wallCell');
            var containsPath = (innerCell.classList.contains("searchedPathCell") || innerCell.classList.contains("finalPathCell") || innerCell.classList.contains("biPathCell"));
            if (newVal === "WALL") {
                if (containsPath) {
                    resetMaze(true);
                }
                if (arr[yCoord][xCoord] === "WALL" && !dontChange) {
                    innerCell.classList.remove('wallCell');
                    arr[yCoord][xCoord] = "EMPTY";
                    environmentUpdated = false;
                } else {
                    innerCell.classList.add('wallCell');
                }
            } else if (newVal === "PATH") {
                //innerCell.style.backgroundColor = "yellow";
                // innerCell.classList.add('searchedPathCell');
            } else if (newVal === "FINALPATH") {
                innerCell.style.backgroundColor = "purple";
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

    function resetMaze(justPath) {
        var newarr = JSON.parse(localStorage.getItem("arr"));

        //alert("searching:" + localStorage.getItem("searching"));
        if (localStorage.getItem("searching") === "false" || localStorage.getItem("searching") === null) {
            // alert("PASSCHECK");
            var lengthOfArray = arr.length;
            for (var y = 0; y < lengthOfArray; y++) {
                for (var x = 0; x < lengthOfArray; x++) {
                    var pointVal = getPointValue(y, x);
                    if (!(pointVal === "END" || pointVal === "START") && !justPath) {
                        setPointValue(y, x, "EMPTY", false);
                        newarr[y][x] = "EMPTY";
                        localStorage.setItem("arr", JSON.stringify(newarr));

                        /*var idName = "innerCell" + y + "X" + x;
                        var pointToRemoveColorFrom = document.getElementById(idName);
                        pointToRemoveColorFrom.classList.remove('searchedPathCell');
                        pointToRemoveColorFrom.classList.remove('finalPathCell');*/
                    }
                    var idName = "innerCell" + y + "X" + x;
                    var pointToRemoveColorFrom = document.getElementById(idName);
                    pointToRemoveColorFrom.classList.remove('searchedPathCell');
                    pointToRemoveColorFrom.classList.remove('finalPathCell');
                    pointToRemoveColorFrom.classList.remove('biPathCell');
                    pointToRemoveColorFrom.classList.remove('walCell');
                }
            }
            //localStorage.setItem("arr",JSON.stringify(newarr));
        }
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
                    arr = JSON.parse(localStorage.getItem("arr"));
                    //alert(localStorage.getItem("searching"));
                    if (localStorage.getItem("searching") === "false" || localStorage.getItem("searching") === null) {
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
                                //alert("SUP:" + )
                                changeTile(ev)
                            }
                        }
                        //alert("Settingarr:" + arr);
                        //arr = localStorage
                        //localStorage.setItem("arr", JSON.stringify(arr));
                    }
                }
                insideElement.onmouseleave = (ev) => {
                    //arr = JSON.parse(localStorage.getItem("arr"));
                    if (localStorage.getItem("searching") === "false" || localStorage.getItem("searching") === null) {
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
                        //localStorage.setItem("arr", JSON.stringify(arr));
                    }
                }
                insideElement.onmousedown = e => {
                    if (localStorage.getItem("searching") === "false" || localStorage.getItem("searching") === null) {
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
                }
                insideElement.onmouseup = e => {
                    if (e.button === 2) {
                        var thingClicked = e.target.id.replaceAll("I", "");
                        var thing = document.getElementById(thingClicked);
                        if (draggingItemMode) {
                            var holdLoc = e.target.id.replaceAll("I", "").split('innerCell')[1].split('X');
                            if ((itemBeingDragged !== "START" && arr[holdLoc[0]][holdLoc[1]] === "START" || arr[holdLoc[0]][holdLoc[1]] === "END" && itemBeingDragged !== "END")) {
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
            localStorage.setItem("starty", yLocOfStart);
            localStorage.setItem("startx", JSON.stringify(0));
            localStorage.setItem("endy", yLocOfStart);
            localStorage.setItem("endx", xLocOfEnd);
            setPointValue(yLocOfStart, xLocOfEnd, "END");
            localStorage.setItem("mainpoints", JSON.stringify(true));
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