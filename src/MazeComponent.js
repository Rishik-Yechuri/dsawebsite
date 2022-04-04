import React, {useEffect, useState} from 'react';
import "./mazeComponentStyle.css"
import Draggable from "react-draggable";

//var mousePosition;
const MazeComponent = ({state}) => {
    //const [mouseDown, setMousedown] = useState(false);
    var gridSize = state;
    let [zoomSize, setZoomSize] = useState({zoomSize: 1});
    var mazeHolderDiv = document.getElementById("mazeHolderDiv");
    const mousedown = (event) => {
        /* setMousedown(prevState =>{
             return{
                 diffX: event.screenX - event.currentTarget.getBoundingClientRect().left,
                 diffY: event.screenY - event.currentTarget.getBoundingClientRect().top,
                 dragging: true
             }
         })
         mouseDown.mouseDown = true;*/
    }

    const mousemove = (e) => {
        /*   if(mousedown.dragging){
               var left =  e.screenX - this.state.diffX;
               var top = e.screenY - this.state.diffY;
               setMousedown(prevState => {
                   return{
                       styles:{
                           left:left,
                           top:top
                       }
                   }
               });
           }*/

    }

    function mouseup() {
        /*setMousedown(prevState => {
            return{
                pre
               // prevState.dragging: false
            }
        });
        mouseDown.mouseDown = false;*/
    }

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
        <div id={"mazeTopDiv"} onWheel={zoom} onMouseUp={mouseup}>
            <Draggable>
                <div id={"wrapperDiv"}>
                    <div id={"mazeHolderDiv"}>
                    </div>
                </div>
            </Draggable>
        </div>
    );
}

export default MazeComponent;
