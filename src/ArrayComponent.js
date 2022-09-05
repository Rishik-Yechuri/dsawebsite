import React, {useEffect, useMemo, useRef, useState} from 'react';
import "./ArrayComponentStyle.css"
import Draggable from "react-draggable";

const ArrayComponent = ({arrayHiddenState, arrayReset, arraySort, arraySortMethod}) => {
    var arr = JSON.parse(localStorage.getItem("barArray"));
    var valArr = JSON.parse(localStorage.getItem("barValueArray"));


    async function partition(arr, low, high) {
        var x = getBarHeight(high);
        var i = low - 1
        //alert("HERE1");
        for (var j = low; j <= high - 1; j++) {
            setBarValue(j, "SEARCHING");
            setBarValue(high, "SEARCHING");
            await new Promise(done => setTimeout(() => done(), 10));
            if (getBarHeight(j) <= x) {
                i++
                var temp = getBarHeight(i);
                arr[i] = getBarHeight(j);
                changeBarHeight(i, getBarHeight(j));
                arr[j] = temp
                changeBarHeight(j, temp);
            }
            setBarValue(j, "NONE");
            setBarValue(high, "NONE");
        }
        //alert("HERE2");
        var temp = getBarHeight(i + 1);//= arr[i + 1]
        //alert("HERE3");
        arr[i + 1] = getBarHeight(high);//arr[high]
        //alert("HERE4");
        changeBarHeight(i + 1, getBarHeight(high));
        //alert("HERE5");
        arr[high] = temp;
        //alert("HERE5.5:" + high);
        changeBarHeight(high, temp);
        //alert("HERE5.75");
        //alert("HERE6");
        return i + 1
    }

    async function mergeSort(array, startPos) {
        const half = Math.floor(array.length / 2)
        // Base case or terminating case
        if (array.length < 2) {
            return array
        }
       /* alert("HERE 2:" + array.length);
        alert("StartPos:" + startPos);
        alert("Half:" + half);*/
        const left = array.splice(0, half)
        return await merge(await mergeSort(left, (startPos)), await mergeSort(array, (half + startPos)), startPos, half + startPos);
    }

    async function merge(left, right, leftPos, rightPos) {
        var numOfElementsLeft = left.length;
        var numOfElementsRight = right.length;
        var startPoint = leftPos;
        var numOfElements = left.length + right.length;
        let arr = []
      /*  alert("LEFT:" + left.length);
        alert("RIGHT:" + right.length);*/
        //Break out of loop if any one of the array gets empty
        while ((numOfElementsLeft > 0 && numOfElementsRight > 0)) {
           /* alert("Something has");
            alert("LEFT:" + left.length);
            alert("RIGHT:" + right.length);
            alert("LeftPos:" + leftPos);
            alert("RightPos:" + rightPos);*/
            //Pick the smaller among the smallest element of left and right sub arrays
             setBarValue(leftPos, "SEARCHING");
            setBarValue(rightPos, "SEARCHING");
           // alert("Searching Set");
            await new Promise(done => setTimeout(() => done(), 10));
            setBarValue(leftPos, "NONE");
            setBarValue(rightPos, "NONE");
           // alert("Bar set");
            if (left[0] < right[0]) {
                arr.push(left.shift());
                leftPos++;
                numOfElementsLeft--;
               // alert("left push");
            } else {
                var thingToPush = right.shift();
               // alert("right push:" + thingToPush);
                arr.push(thingToPush);
                rightPos++;
                numOfElementsRight--;
            }
        }

        // Concatenating the leftover elements
        // (in case we didn't go through the entire left or right array)
        while (numOfElementsLeft > 0) {
            arr.push(left.shift());
            numOfElementsLeft--;
        }
        while (numOfElementsRight > 0) {
            arr.push(right.shift());
            numOfElementsRight--;
        }
        for (var i = 0; i < numOfElements; i++) {
          //  alert("here");
            //var barID = "bar" + (parseInt(startPoint) + parseInt(i));
           // alert("NewHeight:" + arr[i]);
            changeBarHeight((parseInt(startPoint) + i), arr[i] * 2.5);
            await new Promise(done => setTimeout(() => done(), 20));
        }
        return arr;
    }

    async function quickSort(arr, low, high) {
        if (low < high) {
            var index = await partition(arr, low, high);
            setBarValue(index, "FINISHED");
            //alert("PARTITION:" + index);
            if (low < index - 1) {
                await quickSort(arr, low, index - 1)
            } else if (index - 1 >= 0) {
                setBarValue(index - 1, "FINISHED");
            }
            if (index + 1 < high) {
                await quickSort(arr, index + 1, high)
            } else {
                setBarValue(index + 1, "FINISHED");
            }
        }
    }

    async function selectionSort(inputArr) {
        let n = inputArr.length;

        for (let i = 0; i < n; i++) {
            // Finding the smallest number in the subarray
            let min = i;
            for (let j = i + 1; j < n; j++) {
                setBarValue(j, "SEARCHING");
                //if (j + 1 < arrLen) {
                setBarValue(min, "SEARCHING");
                //}
                await new Promise(done => setTimeout(() => done(), 10));
                setBarValue(min, "NONE");
                //if (j + 1 < arrLen) {
                setBarValue(j, "NONE");
                if (getBarHeight(j) < getBarHeight(min)) {
                    min = j;
                }
            }
            /*setBarValue(min, "NONE");
            //if (j + 1 < arrLen) {
                setBarValue(n-1, "NONE");*/
            //}
            if (min !== i) {
                // Swapping the elements
                //setBarValue(min, "SEARCHING");
                //if (j + 1 < arrLen) {
                // setBarValue(i, "SEARCHING");
                //await new Promise(done => setTimeout(() => done(), 100));

                //}
                let tmp = getBarHeight(i);
                inputArr[i] = getBarHeight(min);
                changeBarHeight(i, inputArr[i]);
                inputArr[min] = tmp;
                changeBarHeight(min, tmp);


                //setBarValue(min, "NONE");
                //if (j + 1 < arrLen) {
            }
            setBarValue(i, "FINISHED");
            await new Promise(done => setTimeout(() => done(), 10));

        }
        return inputArr;
    }

    async function bubbleSort(arr) {
        var arrLen = arr.length;
        for (var i = 0; i < arrLen; i++) {
            // Last i elements are already in place
            for (var j = 0; j < (arrLen - i); j++) {
                // Checking if the item at present iteration
                // is greater than the next iteration
                setBarValue(j, "SEARCHING");
                if (j + 1 < arrLen) {
                    setBarValue(j + 1, "SEARCHING");
                }
                await new Promise(done => setTimeout(() => done(), 10));
                if (arr[j] > arr[j + 1]) {
                    /*setBarValue(j, "SWAPPING");
                    if (j + 1 < arrLen) {
                        setBarValue(j + 1, "SWAPPING");
                    }
                    await new Promise(done => setTimeout(() => done(), 100));*/
                    // If the condition is true then swap them
                    var temp = getBarHeight(j);
                    arr[j] = getBarHeight(j + 1);
                    changeBarHeight(j, getBarHeight(j + 1));
                    arr[j + 1] = temp;
                    changeBarHeight(j + 1, temp);
                }
                setBarValue(j, "NONE");
                if (j + 1 < arrLen) {
                    setBarValue(j + 1, "NONE");
                }
            }
        }
        for (var x = 0; x < arrLen; x++) {
            setBarValue(x, "FINISHED");
            await new Promise(done => setTimeout(() => done(), 10));
        }
        // Print the sorted array
        //console.log(arr);
    }

    useEffect(() => {
        if (arrayHiddenState === true) {
            document.getElementById("arrayTopDiv").style.display = 'none';
        } else {
            document.getElementById("arrayTopDiv").style.removeProperty('display');
        }
    }, [arrayHiddenState]);
    useEffect(async () => {
        if (arraySort > 0) {
            var arrayOfHeights = JSON.parse(localStorage.getItem("barArray"));
            //Call the search algorithm
            if (arraySortMethod === "Bubble Sort") {
                await bubbleSort(arrayOfHeights);
            } else if (arraySortMethod === "Selection Sort") {
                await selectionSort(arrayOfHeights);
            } else if (arraySortMethod === "Quick Sort") {
                await quickSort(arrayOfHeights, 0, arrayOfHeights.length - 1);
            } else if (arraySortMethod === "Merge Sort") {
                var tempArray = [];
                tempArray.push(getBarHeight(0));
                tempArray.push(getBarHeight(1));
               // alert("HERE:" + tempArray.length)
                await mergeSort(arrayOfHeights, 0);
                for(var i=0;i<100;i++){
                    setBarValue(i,"FINISHED");
                    await new Promise(done => setTimeout(() => done(), 10));
                }
              //  alert("HERE 2");
            }
        }
    }, [arraySort]);
    useEffect(() => {
        arr = JSON.parse(localStorage.getItem("barArray"));
        if (arrayReset > 0 || arr === null) {
            generateBars();
        } else {
            loadBars();
        }
    }, [arrayReset]);
    var rejectModernity = (event) => {
        event.preventDefault();
        return false;
    }

    function changeBarHeight(barIndex, newHeight) {
        var arr = JSON.parse(localStorage.getItem("barArray"));
        arr[barIndex] = newHeight * 0.4;
        var barID = "bar" + barIndex;
        var bar = document.getElementById(barID);
        bar.style.height = (newHeight * 0.4) + "em";
        localStorage.setItem("barArray", JSON.stringify(arr));
    }

    function getBarHeight(barIndex) {
        var arr = JSON.parse(localStorage.getItem("barArray"));
        return arr[barIndex] * 2.5;
    }

    function setBarValue(barIndex, newVal) {
        valArr = JSON.parse(localStorage.getItem("barValueArray"));
        valArr[barIndex] = newVal;
        var barID = "bar" + barIndex;
        var bar = document.getElementById(barID);
        bar.classList.remove("NONE");
        bar.classList.remove("SEARCHING");
        bar.classList.remove("SWAPPING");
        bar.classList.add(newVal);
        localStorage.setItem("barValueArray", JSON.stringify(valArr));
    }

    //function getBarValue(barIndex)
    function loadBars() {
        arr = JSON.parse(localStorage.getItem("barArray"));
        valArr = JSON.parse(localStorage.getItem("barValueArray"));
        const parent = document.getElementById("arrayBarHolder");
        for (var x = 0; x < 100; x++) {
            var element = document.createElement("div");
            element.id = "bar" + x;
            element.className = "heightBar";
            element.style.height = arr[x] + "em";
            element.classList.add(valArr[x]);
            parent.appendChild(element);
            //setBarValue(x,"SWAPPING");
        }
    }

    function generateBars() {

        arr = JSON.parse(localStorage.getItem("barArray"));
        valArr = JSON.parse(localStorage.getItem("barValueArray"));
        if (arr === null) {
            arr = [];
        }
        if (valArr === null) {
            valArr = [];
        }
        const parent = document.getElementById("arrayBarHolder");
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
        for (var x = 0; x < 100; x++) {
            var randomNum = Math.floor(Math.random() * 100) + 1;
            randomNum = randomNum * .4;
            arr[x] = randomNum;
            valArr[x] = "NONE";
            var element = document.createElement("div");
            element.id = "bar" + x;
            element.className = "heightBar";
            element.style.height = randomNum + "em";
            parent.appendChild(element);
        }
        localStorage.setItem("barArray", JSON.stringify(arr));
        localStorage.setItem("barValueArray", JSON.stringify(valArr));
    }

    let [zoomSize, setZoomSize] = useState({zoomSize: 1});

    var zoom = (event) => {
        var arrayHolderDiv = document.getElementById("arrayHolderDiv");
        var zoomSpeed = (-.001) * (.55);
        var tempZoomSize = zoomSize.zoomSize + (event.deltaY * zoomSpeed);
        zoomSize.zoomSize = Math.min(Math.max(.1, tempZoomSize), 1000000)
        arrayHolderDiv.style.transform = `scale(${zoomSize.zoomSize})`;
    }
    return (

        <div id={"arrayTopDiv"} onWheel={zoom}>
            <div id={"arrayHolderDiv"} onContextMenu={rejectModernity}>
                <div id={"arrayBarHolder"}>

                </div>
                <div id={"arrayBottomLine"} onContextMenu={rejectModernity}>

                </div>
            </div>
        </div>
    );
}
export default ArrayComponent;