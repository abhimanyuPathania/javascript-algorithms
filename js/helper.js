"use strict";

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

		closeKoSelectList: function(target){
			// if user clicks outside the "ko-select-list" wrapper div;
			// close all the open dropdowns

			// Click events originating from within select-lest are handled
			// by their handlers and are not allowed to bubble up.
			if (!(target.closest(".ko-select-list").length)){
				return true;
			}
			return false;
		},

		getSortText: function (s){
			// bubbleSort -> Bubble Sort

			if (!s){
				return null;
			}
			
			var sortType = s.substring(0, s.indexOf("Sort"));
			return sortType[0].toUpperCase() + sortType.slice(1) + " Sort";
		},


		// http://stackoverflow.com/a/10835227/2426469
		isPositiveInteger: function(n){
			return n >>> 0 === parseFloat(n);
		}
	};
});