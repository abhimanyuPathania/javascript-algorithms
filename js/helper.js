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

		toggleKoSelectList: function(target){

			// If click is 'NOT' from/inside of, "ko-select-list-selected-item" spans
			// or does NOT has "ko-select-list-option-item" class;toggle dropdown.
			// Cannot use closest(".ko-select-list-options") since KO is removing
			// the option-item from it.

			if (!(target.hasClass("ko-select-list-option-item") ||
				target.closest(".ko-select-list-selected-item").length)){
				return true;
			}

			return false;
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
		}
	};
});