"use strict";

define(["jquery", "webworkerHelper"], function($, webworkerHelper){
	
	return {

		showPage: function(){
			var main = $("#main");

			// remove the loading div
			$("#loading").css("display", "none");

			// show the main div
			main.css("display", "block");

			// adding "show" class to "#main" without
			// setTimeout does not trigger css transition
			setTimeout(function(){
				// fade in "#main" and reveal
				main.addClass("show");
			}, 100);
		},

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

		// add the "getSortText" function from webworkerHelper.js to helper.js
		// for single import
		getSortText: webworkerHelper["getSortText"],


		// http://stackoverflow.com/a/10835227/2426469
		isPositiveInteger: function(n){
			return n >>> 0 === parseFloat(n);
		},

		scrollToTop: function(){
			$("html, body").animate({ scrollTop: 0 }, 400);
		},

		scrollToBottom: function(){
			$("html, body").animate({ scrollTop: $(document).height() }, 400);
		}
	};
});