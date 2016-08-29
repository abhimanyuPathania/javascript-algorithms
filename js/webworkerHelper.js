"use strict";

// This module defines the helper functions specifically meant for WebWorkers.
// Since importing "helper" module into webworker fails due to "jquery" being
// dependency in "helper".


define([], function(){
	
	return {

		getRandomArray: function(size){

			// Smallest value to be used in array; largest is 'size' - 1
			var min = 0;
			var result = [];

			for(var i = 0; i < size; i++) {

				// get random integer in range [min to max) and add it to array
				result[i] = Math.floor(Math.random() * (size - min + 1)) + min;
			}

			return result;
		},

		getSortText: function (s){
			// bubbleSort -> Bubble Sort

			if (!s){
				return null;
			}
			
			var sortType = s.substring(0, s.indexOf("Sort"));
			return sortType[0].toUpperCase() + sortType.slice(1) + " Sort";
		}
	};
});