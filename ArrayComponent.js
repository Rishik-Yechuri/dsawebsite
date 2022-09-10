import React, {useEffect, useMemo, useRef, useState} from 'react';
import "./ArrayComponentStyle.css"

const ArrayComponent = ({arrayHiddenState, arrayReset, arraySort, arraySortMethod}) => {
    //Initializes variables
    const [searchingState, setSearchingState] = useState("false");
    var arr = JSON.parse(localStorage.getItem("barArray"));
    var valArr = JSON.parse(localStorage.getItem("barValueArray"));

    //Function that is used for Quick Sort
    async function partition(arr, low, high) {
        //Gets bar height at index high
        var x = await getBarHeight(high);
        var i = low - 1
        //Loops from index j to high
        for (var j = low; j <= high - 1; j++) {
            //Sets two bars to yellow to indicate they are being searched
            await setBarValue(j, "SEARCHING");
            await setBarValue(high, "SEARCHING");
            //Pauses so user can see what is happening
            await new Promise(done => setTimeout(() => done(), 10));
            //Compares bar height to x
            if (await getBarHeight(j) <= x) {
                i++
                var temp = await getBarHeight(i);
                arr[i] = await getBarHeight(j);
                await changeBarHeight(i, await getBarHeight(j));
                arr[j] = temp
                await changeBarHeight(j, temp);
            }
            //Changes bar colors back to original color
            await setBarValue(j, "NONE");
            await setBarValue(high, "NONE");
        }
        //Swaps bar heights
        var temp = await getBarHeight(i + 1);
        arr[i + 1] = await getBarHeight(high);//arr[high]
        await changeBarHeight(i + 1, await getBarHeight(high));
        arr[high] = temp;
        await changeBarHeight(high, temp);
        return i + 1
    }

    async function mergeSort(array, startPos) {
        //Finds the midpoint in the array
        const half = Math.floor(array.length / 2)
        //Base case
        if (array.length < 2) {
            return array
        }
        //Splits array in half
        const left = array.splice(0, half);
        //Calls merge sort on both sides and merges them together
        return await merge(await mergeSort(left, (startPos)), await mergeSort(array, (half + startPos)), startPos, half + startPos);
    }

    //Combines two sorted arrays into one sorted array
    async function merge(left, right, leftPos, rightPos) {
        //Gets size of both arrays
        var numOfElementsLeft = left.length;
        var numOfElementsRight = right.length;
        var startPoint = leftPos;
        var numOfElements = left.length + right.length;
        let arr = []
        //Loops as long as both arrays have elements
        while ((numOfElementsLeft > 0 && numOfElementsRight > 0)) {
            //Changes color of the two bars being compared
            setBarValue(leftPos, "SEARCHING");
            setBarValue(rightPos, "SEARCHING");
            //Pause so user can see what is happening
            await new Promise(done => setTimeout(() => done(), 10));
            //Changes bar colors back to original
            setBarValue(leftPos, "NONE");
            setBarValue(rightPos, "NONE");
            //Compares values of both sides
            if (left[0] < right[0]) {
                //Pushes element from left array side
                arr.push(left.shift());
                leftPos++;
                numOfElementsLeft--;
            } else {
                //Pushes element from right array
                var thingToPush = right.shift();
                arr.push(thingToPush);
                rightPos++;
                numOfElementsRight--;
            }
        }

        //Adds any leftover values
        while (numOfElementsLeft > 0) {
            arr.push(left.shift());
            numOfElementsLeft--;
        }
        while (numOfElementsRight > 0) {
            arr.push(right.shift());
            numOfElementsRight--;
        }
        //Changes everything to green(completed)
        for (var i = 0; i < numOfElements; i++) {
            changeBarHeight((parseInt(startPoint) + i), arr[i] * 2.5);
            await new Promise(done => setTimeout(() => done(), 20));
        }
        return arr;
    }

    //Call quicksort
    async function quickSortCaller(arr, low, high) {
        await quickSort(arr, low, high).then(r => {
        });
    }

    //Quick Sort algorithm
    async function quickSort(arr, low, high, currIteration) {
        //Keeps going as long as low is less than high
        if (low < high) {
            //Finds next index
            var index = await partition(arr, low, high);
            //Set that one bar to finished status
            await setBarValue(index, "FINISHED");
            currIteration++;
            //Calls quicksort on left side
            if (low < index - 1) {
                await quickSort(arr, low, index - 1, currIteration + 1)
            } else if (index - 1 >= 0) {
                await setBarValue(index - 1, "FINISHED");
                currIteration++;
            }
            //Calls quicksort on right side
            if (index + 1 < high) {
                await quickSort(arr, index + 1, high, currIteration + 1)
            } else {
                await setBarValue(index + 1, "FINISHED");
                currIteration++;
            }
        }
        return 0;
    }

    async function selectionSort(inputArr) {
        //Gets size of array
        let n = inputArr.length;
        for (let i = 0; i < n; i++) {
            // Finding the smallest number in the subarray
            let min = i;
            for (let j = i + 1; j < n; j++) {
                //Sets the status of the two bars to searching
                setBarValue(j, "SEARCHING");
                setBarValue(min, "SEARCHING");
                //Pause to allow user to see what is happening
                await new Promise(done => setTimeout(() => done(), 10));
                //Change bar color back to original
                setBarValue(min, "NONE");
                setBarValue(j, "NONE");
                //Compare heights
                if (getBarHeight(j) < getBarHeight(min)) {
                    min = j;
                }
            }
            if (min !== i) {
                let tmp = getBarHeight(i);
                inputArr[i] = getBarHeight(min);
                changeBarHeight(i, inputArr[i]);
                inputArr[min] = tmp;
                changeBarHeight(min, tmp);
            }
            setBarValue(i, "FINISHED");
            await new Promise(done => setTimeout(() => done(), 10));
        }
        return inputArr;
    }

    async function bubbleSort(arr) {
        var arrLen = arr.length;
        for (var i = 0; i < arrLen; i++) {
            for (var j = 0; j < (arrLen - i); j++) {
                setBarValue(j, "SEARCHING");
                if (j + 1 < arrLen) {
                    setBarValue(j + 1, "SEARCHING");
                }
                await new Promise(done => setTimeout(() => done(), 10));
                if (arr[j] > arr[j + 1]) {
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
        //Sets all bars to green(completed)
        for (var x = 0; x < arrLen; x++) {
            setBarValue(x, "FINISHED");
            await new Promise(done => setTimeout(() => done(), 10));
        }
    }
    //Displays array when selected in navigation
    useEffect(() => {
        if (arrayHiddenState === true) {
            document.getElementById("arrayTopDiv").style.display = 'none';
        } else {
            document.getElementById("arrayTopDiv").style.removeProperty('display');
        }
    }, [arrayHiddenState]);

    useEffect(() => {
        if (searchingState === "sorted") {
            //setSearchingState("false");
        }
    }, [arraySortMethod]);
    //Array is sorted when sort is clicked
    useEffect(async () => {
        //If array is already sorted, generate new array
        if (searchingState === "sorted") {
            await generateBars();
        }
        //Start sorting if it isn't currently being sorted
        if (arraySort > 0 && searchingState !== "true") {
            var arrayOfHeights = JSON.parse(localStorage.getItem("barArray"));
            //Call the search algorithm
            if (arraySortMethod === "Bubble Sort") {
                setSearchingState("true");
                await bubbleSort(arrayOfHeights);
                setSearchingState("sorted");
            } else if (arraySortMethod === "Selection Sort") {
                setSearchingState("true");
                await selectionSort(arrayOfHeights);
                setSearchingState("sorted");
            } else if (arraySortMethod === "Quick Sort") {
                await quickSortCaller(arrayOfHeights, 0, arrayOfHeights.length - 1, 0);
            } else if (arraySortMethod === "Merge Sort") {
                setSearchingState("true");
                var tempArray = [];
                tempArray.push(getBarHeight(0));
                tempArray.push(getBarHeight(1));
                await mergeSort(arrayOfHeights, 0);
                for (var i = 0; i < 100; i++) {
                    setBarValue(i, "FINISHED");
                    await new Promise(done => setTimeout(() => done(), 10));
                }
                setSearchingState("sorted");
            }
        }
    }, [arraySort]);
    //Loads or generates bars when array is reset(first loaded/reset clicked)
    useEffect(() => {
        arr = JSON.parse(localStorage.getItem("barArray"));
        if (searchingState !== "true") {
            if (arrayReset > 0 || arr === null) {
                generateBars();
            } else {
                loadBars();
            }
        }
    }, [arrayReset]);
    var rejectModernity = (event) => {
        event.preventDefault();
        return false;
    }

    //Changes height of bar
    function changeBarHeight(barIndex, newHeight) {
        var arr = JSON.parse(localStorage.getItem("barArray"));
        arr[barIndex] = newHeight * 0.4;
        var barID = "bar" + barIndex;
        var bar = document.getElementById(barID);
        bar.style.height = (newHeight * 0.4) + "em";
        localStorage.setItem("barArray", JSON.stringify(arr));
    }

    //Returns height of bar
    function getBarHeight(barIndex) {
        var arr = JSON.parse(localStorage.getItem("barArray"));
        return arr[barIndex] * 2.5;
    }

    //Change color of bar
    function setBarValue(barIndex, newVal) {
        valArr = JSON.parse(localStorage.getItem("barValueArray"));
        var barID = "bar" + barIndex;
        var bar = document.getElementById(barID);
        bar.classList.remove("NONE");
        bar.classList.remove("SEARCHING");
        bar.classList.remove("SWAPPING");
        bar.classList.add(newVal);
        localStorage.setItem("barValueArray", JSON.stringify(valArr));
    }

    //Load  bars from memory
    function loadBars() {
        arr = JSON.parse(localStorage.getItem("barArray"));
        const parent = document.getElementById("arrayBarHolder");
        for (var x = 0; x < 100; x++) {
            var element = document.createElement("div");
            element.id = "bar" + x;
            element.className = "heightBar";
            element.style.height = arr[x] + "em";
            parent.appendChild(element);
        }
    }

    //Generates bars randomly(height set from 1-100)
    function generateBars() {
        arr = JSON.parse(localStorage.getItem("barArray"));
        if (arr === null) {
            arr = [];
        }
        valArr = [];
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

    //Holds state for zoom
    let [zoomSize, setZoomSize] = useState({zoomSize: 1});
    //Zooms in on array
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