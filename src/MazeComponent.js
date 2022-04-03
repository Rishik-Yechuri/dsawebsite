import React, {useEffect, useState} from 'react';
import "./mazeComponentStyle.css"

const MazeComponent = ({state}) => {
   // var zoomSize = 1.0;
    var gridSize = state;
    let [zoomSize,setZoomSize]= useState( {zoomSize:1});

    var mazeTopDiv = document.getElementById("mazeHolderDiv");

    var zoom = (event) =>{
       // alert("PRE");
        event.preventDefault();
        mazeTopDiv = document.getElementById("mazeHolderDiv");
        var zoomSpeed = (-.001) * (5.0/Math.sqrt(gridSize));
        var tempZoomSize = zoomSize.zoomSize + (event.deltaY * zoomSpeed);
        zoomSize.zoomSize = Math.min(Math.max(.125, tempZoomSize), 1000000)
        mazeTopDiv.style.transform = `scale(${zoomSize.zoomSize})`;
    }
    useEffect(() => {
        createMaze(state);
    }, [state]);

    function createMaze(length) {
        gridSize = length;
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
        <div id={"mazeTopDiv"} onWheel={zoom} >
            <div id={"mazeHolderDiv"}>
            </div>
        </div>
    );
}

export default MazeComponent;
