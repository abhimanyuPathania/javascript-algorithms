"use strict";

/*
	This WebWorker runs the sorting code for the sort page.
*/

// Call importScript asap.
// "importScript" calls are synchronous
self.importScripts("../lib/require.js");

var sortCode = {
	bubbleSort: function(arr){
		var out;
		var inner;
		var temp;

		for (out = arr.length - 1; out > 0; out -= 1) {
			for (inner = 0; inner < out; inner += 1) {
				if (arr[inner] > arr[inner + 1]) {
					temp = arr[inner];
					arr[inner] = arr[inner + 1];
					arr[inner + 1] = temp;
				}
			}
		}
		return arr;
	},

	selectionSort: function(arr){
		var inner;
		var outer;
		var min;
		var temp;

		for(outer = 0; outer < arr.length; outer += 1) {
			min = outer;

			for(inner = outer + 1; inner < arr.length; inner += 1) {
				if (arr[inner] < arr[min]) {
					min = inner;
				}
			}

			temp = arr[outer];
			arr[outer] = arr[min];
			arr[min] = temp;
		}

		return arr;
	},

	insertionSort: function(arr){
		var outer;
		var inner;
		var temp;

		for (outer = 1; outer < arr.length; outer += 1) {
			// selec the marker
			temp = arr[outer];
			inner = outer;

			// inner loops till left end of array
			// while marker is bigger than inner item
			while(inner > 0 && arr[inner-1] > temp) {

				//keep shifting the inner items forward
				arr[inner] = arr[inner-1];
				inner -= 1;
			}

			// out the marker in corect spot
			arr[inner] = temp;
		}

		return arr;
	},

	mergeSort: (function(){

		// This closure variable servers as a temporary array to/from
		// which sorted elements are copied. 
		var temp = [];

		function merge(theArr, lowerBound, mid, upperBound){
			// Left Array theArr[lower -> mid]
			// Righ Array theArr[mid + 1 -> upperBound]

			var lower = lowerBound;
			var upper = mid + 1;
			var i = 0;
			var totalLength = upperBound - lowerBound + 1;

			while(lower <= mid && upper <= upperBound){
				if (theArr[lower] < theArr[upper]){
					temp[i] = theArr[lower];
					lower += 1;
				} else {
					temp[i] = theArr[upper];
					upper += 1;
				}
				i += 1;
			}

			// If Left Array has more elements than right; copy them directly.
			while (lower <= mid){
				temp[i] = theArr[lower];
				i += 1;
				lower += 1;
			}

			// If Right Array has more elements than left; copy them directly.
			while(upper <= upperBound){
				temp[i] = theArr[upper];
				i += 1;
				upper += 1;
			}

			// Copy the sorted section of theArr from temp array to theArray
			for(i = 0; i < totalLength; i += 1){
				theArr[lowerBound + i] = temp[i];
			}
		}

		function recursiveMergeSort(theArr, lowerBound, upperBound){			
			var mid;

			// Array with single element is already sorted.
			if (lowerBound === upperBound){
				return;
			}

			mid = Math.floor((upperBound + lowerBound)/2);
			recursiveMergeSort(theArr, lowerBound, mid);
			recursiveMergeSort(theArr, mid + 1, upperBound);

			merge(theArr, lowerBound, mid, upperBound);
		}

		// This wrapper function is returned by the IIFE closure.
		// "mergeSortWrapper" takes the unsorted array as input and
		// calls the "recursiveMergeSort" function with correct arguments.
		// The closure scoping covers both "merge" and "recursiveMergeSort"
		// functions.

		// Wrapper is required to match the calling styles of other sorts.
		// It also returns the sorted arr.
		return function mergeSortWrapper(arr){
			recursiveMergeSort(arr, 0, arr.length - 1);
			return arr;
		};
	})(),

	shellSort: function(arr){
		var inner;
		var outer;
		var temp;
		var h = 1;

		// calculate the first value of h to be used
		while(h <= arr.length/3){
			h = 3*h + 1;
		}

		while (h > 0){

			for (outer = h; outer < arr.length; outer += 1){
				temp = arr[outer];
				inner = outer;

				while (inner >= h && arr[inner - h] >= temp){
					arr[inner] = arr[inner - h];
					inner = inner - h;
				}
				arr[inner] = temp;
			}
			h = (h - 1)/3;
		}
		return arr;  
	},

	quickSort: function(arr){

		recursiveQuicksort(0, arr.length - 1);
		return arr;


		function recursiveQuicksort(left, right){
			var pivot;
			var partition;

			var size = right - left + 1;
			if (size < 10){
				insertionSort(left, right);
			} else{
				pivot = medianOfThree(left, right);
				partition = partitioner(left, right, pivot);
				recursiveQuicksort(left, partition - 1);
				recursiveQuicksort(partition + 1, right);
			}
		}

		function partitioner(left, right, pivot){

			// Pre-incremented to right of first element.
			// Since we know that left element is already less that the pivot
			// due to median selection.
			var leftIndex = left;

			// Pre-decremented to left of pivot.
			var rightIndex = right - 1; 

			while(true){

				while(arr[++leftIndex] < pivot);
				while(arr[--rightIndex] > pivot);

				if(leftIndex >= rightIndex){
					break;
				}else{
					swap(leftIndex, rightIndex);
				}
			}
			// restore pivot
			// This puts pivot in its correct position for the sorted array
			swap(leftIndex, right - 1);
			return leftIndex;
		}

		function medianOfThree(left, right){
			var mid = Math.floor((left + right)/2);

			if(arr[left] > arr[mid]){
				swap(left, mid);
			}

			if(arr[left] > arr[right]){
				swap(left, right);
			}

			if(arr[mid] > arr[right]){
				swap(mid, right);
			}

			// Now the left, mid, right are in sorted order.

			// Choose arr[mid] as pivot and put it on (right - 1)
			// element. Since we're sure that right is already on
			// the correct side of pivot's partition.
			swap(mid, right - 1);

			// return pivot
			return arr[right - 1];
		}

		function insertionSort(left, right){
			var outer;
			var inner;
			var temp;

			for (outer = left + 1; outer <= right; outer += 1) {
				// selec the marker
				temp = arr[outer];
				inner = outer;

				// inner loops till left end of array
				// while marker is bigger than inner item
				while(inner > left && arr[inner-1] >= temp) {

					//keep shifting the inner items forward
					arr[inner] = arr[inner-1];
					inner -= 1;
				}

				// out the marker in corect spot
				arr[inner] = temp;
			}
		}

		function swap(index1, index2){
			var temp = arr[index1];
			arr[index1] = arr[index2];
			arr[index2] = temp;
		}
	}
};




// Require currently looks in the location of this file ie. "js/code"
// Setting base URL to one dir back pushes it to the /js dir.
require({
	baseUrl: "../"
}, ["helper"], function(helper) {
	var data; // data object recived from main script

	addEventListener("message", function(e){
		if(e.data.cmd === "runCode") {
			data = e.data;
			runSortCode();
		} 
	});
	
	// This message to main thread tells it that our WW is ready to recive
	// messages from it and to execute code.
	// "synced" cmd is sent after registering "onmessage" event handler.

	// http://stackoverflow.com/questions/9244836/how-to-use-web-workers-into-a-module-build-with-requirejs
	postMessage({
		"cmd": "synced"
	});

	// Code that must run after syncing with the WebWorker
	// is wrapper in "runSortCode" function
	function runSortCode(){
		var sortedArray;
		var randomArray = helper.getRandomArray(data.arraySize);

		// send "randomArray" built to main thread for UI
		postMessage({
			"cmd": "randomArray",
			"value": randomArray
		});

		data.sortTypes.forEach(function(sort){
			var start;
			var timeTaken;
			var arrayCopy = randomArray.slice();

			start = Date.now();
			sortedArray = sortCode[sort](arrayCopy);
			timeTaken = Date.now() - start;
			postMessage({
				"cmd": "result",
				"value": {
					"sortType": sort,
					"timeTaken": timeTaken
				}
			});
		});

		// Send "sortedArray" for  UI
		postMessage({
			"cmd": "sortedArray",
			"value": sortedArray
		});
	}
});


